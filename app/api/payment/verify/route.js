// app/api/payment/verify/route.js
// With Shopify Checkout, payment verification happens on Shopify's side.
// This endpoint is kept for any webhook or order-status polling needs.
// Shopify sends order webhooks to your store — you handle fulfillment in Shopify Admin.

import { NextResponse } from "next/server";

export async function POST(request) {
  // No-op: Shopify handles payment verification internally.
  // If you need post-checkout hooks, use Shopify webhooks instead.
  return NextResponse.json({
    success: true,
    message: "Shopify handles payment verification. Check Shopify Admin for order status.",
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order_id");
  return NextResponse.json({ success: true, orderId });
}
