import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { saveOrder } from "../../../../lib/orders";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer, shippingAddress, shippingCharge = 0 } = body;

    if (!items?.length || !customer || !shippingAddress) {
      return NextResponse.json(
        { error: "Missing required fields: items, customer, shippingAddress" },
        { status: 400 }
      );
    }

    // Calculate totals server-side
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + shippingCharge;

    // Create Razorpay order (amount in paise)
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
      },
    });

    // Save pending order in memory store
    const order = saveOrder({
      items,
      customer,
      shippingAddress,
      subtotal,
      shippingCharge,
      total,
      razorpayOrderId: rzpOrder.id,
      paymentStatus: "pending",
      orderStatus: "processing",
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      razorpayOrder: {
        id: rzpOrder.id,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("POST /api/payment/create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create order: " + error.message },
      { status: 500 }
    );
  }
}
