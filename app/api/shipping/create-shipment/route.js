import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "../../../../lib/orders";

const DELHIVERY_BASE = "https://track.delhivery.com";

export async function POST(request) {
  try {
    const { orderId } = await request.json();
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

    const order = getOrder(orderId);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.paymentStatus !== "paid") return NextResponse.json({ error: "Order not paid" }, { status: 400 });
    if (order.delhiveryWaybill) return NextResponse.json({ success: true, waybill: order.delhiveryWaybill });

    const token = process.env.DELHIVERY_API_TOKEN;
    const warehouseName = process.env.DELHIVERY_WAREHOUSE_NAME;

    if (!token || !warehouseName) {
      const mockWaybill = `DEL${Date.now()}MOCK`;
      updateOrder(orderId, {
        delhiveryWaybill: mockWaybill,
        $push: { timeline: { status: "confirmed", note: `Mock waybill: ${mockWaybill}`, timestamp: new Date().toISOString() } },
      });
      return NextResponse.json({ success: true, waybill: mockWaybill, mock: true });
    }

    const addr = order.shippingAddress;
    const itemsDesc = order.items.map((i) => `${i.title} (x${i.qty})`).join(", ");

    const shipmentPayload = {
      shipments: [
        {
          name: addr.name,
          add: `${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}`,
          city: addr.city,
          state: addr.state,
          country: "India",
          pin: addr.pincode,
          phone: addr.phone,
          order: order.orderNumber,
          payment_mode: "Prepaid",
          return_pin: process.env.DELHIVERY_WAREHOUSE_PINCODE || "110025",
          return_city: process.env.DELHIVERY_WAREHOUSE_CITY || "New Delhi",
          return_phone: process.env.DELHIVERY_WAREHOUSE_PHONE || "8130421960",
          return_add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || "Warehouse",
          return_state: process.env.DELHIVERY_WAREHOUSE_STATE || "Delhi",
          return_country: "India",
          products_desc: itemsDesc,
          hsn_code: "6211",
          cod_amount: "0",
          order_date: new Date(order.createdAt).toISOString().split("T")[0],
          total_amount: order.total.toString(),
          seller_add: process.env.DELHIVERY_WAREHOUSE_ADDRESS || "Warehouse",
          seller_name: "Qalbi Couture",
          seller_inv: order.orderNumber,
          quantity: order.items.reduce((a, i) => a + i.qty, 0).toString(),
          weight: "500",
          shipment_width: "20",
          shipment_height: "5",
          shipment_length: "30",
          comment: "Handle with care — ethnic wear",
          AWB_number: "",
          invoice_number: order.orderNumber,
          shipment_type: "EXPRESS",
        },
      ],
      pickup_location: { name: warehouseName },
    };

    const formBody = `format=json&data=${encodeURIComponent(JSON.stringify(shipmentPayload))}`;

    const response = await fetch(`${DELHIVERY_BASE}/api/cmu/create.json`, {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody,
    });

    const result = await response.json();
    if (!response.ok || result.packages?.[0]?.status === "Error") {
      throw new Error(result.packages?.[0]?.remarks || result.error || "Shipment creation failed");
    }

    const waybill = result.packages?.[0]?.waybill;
    if (!waybill) throw new Error("No waybill returned");

    updateOrder(orderId, {
      delhiveryWaybill: waybill,
      orderStatus: "shipped",
      $push: { timeline: { status: "shipped", note: `Delhivery waybill: ${waybill}`, timestamp: new Date().toISOString() } },
    });

    return NextResponse.json({ success: true, waybill });
  } catch (error) {
    console.error("create-shipment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
