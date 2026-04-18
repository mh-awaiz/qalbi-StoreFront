import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/orders";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const order = getOrder(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
