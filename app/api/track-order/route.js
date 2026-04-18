import { NextResponse } from "next/server";
import { findOrderByNumber } from "../../../lib/orders";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
    const phone       = searchParams.get("phone")?.trim().replace(/\s/g, "");

    if (!orderNumber) {
      return NextResponse.json({ error: "Order number is required" }, { status: 400 });
    }

    const order = findOrderByNumber(orderNumber, phone);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check the order number and phone number." },
        { status: 404 }
      );
    }

    // Redact sensitive fields
    const safeOrder = {
      ...order,
      customer: {
        name:  order.customer?.name,
        email: maskEmail(order.customer?.email),
        phone: maskPhone(order.customer?.phone),
      },
    };

    return NextResponse.json({ success: true, order: safeOrder });
  } catch (error) {
    console.error("GET /api/track-order error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  if (!domain) return email;
  return user.slice(0, 2) + "****@" + domain;
}

function maskPhone(phone) {
  if (!phone) return "";
  return phone.slice(0, 2) + "******" + phone.slice(-2);
}
