import { NextResponse } from "next/server";
import crypto from "crypto";
import { getOrder, updateOrder } from "../../../../lib/orders";

export async function POST(request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    // HMAC-SHA256 signature verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      updateOrder(orderId, {
        paymentStatus: "failed",
        $push: { timeline: { status: "processing", note: "Payment verification failed — invalid signature", timestamp: new Date().toISOString() } },
      });
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Mark order as paid
    const order = updateOrder(orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      $push: { timeline: { status: "confirmed", note: "Payment confirmed via Razorpay — " + razorpay_payment_id, timestamp: new Date().toISOString() } },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Fire-and-forget: create Delhivery shipment → then send tracking email
    (async () => {
      let waybill = null;
      let isMock = false;

      try {
        const shipRes = await fetch(`${appUrl}/api/shipping/create-shipment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        const shipData = await shipRes.json();
        if (shipRes.ok && shipData.waybill) {
          waybill = shipData.waybill;
          isMock = shipData.mock === true;
        }
      } catch (shipErr) {
        console.error("Delhivery shipment error (non-fatal):", shipErr);
      }

      try {
        await fetch(`${appUrl}/api/orders/send-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, waybill, isMock }),
        });
      } catch (emailErr) {
        console.error("Confirmation email error (non-fatal):", emailErr);
      }
    })();

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order._id,
    });
  } catch (error) {
    console.error("POST /api/payment/verify error:", error);
    return NextResponse.json({ error: "Verification error: " + error.message }, { status: 500 });
  }
}
