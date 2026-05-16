import { NextResponse } from "next/server";
import { getOrder } from "../../../../lib/orders";
import { rateLimit, rateLimitResponse } from "../../../../lib/rateLimit";

export async function GET(request, { params }) {
  // ── Rate limit: 20 requests / 60 s per IP ─────────────────────────────────
  const { success, remaining, reset } = rateLimit(request, "orders", 20, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const { id } = params;

    // Basic ID sanity check — prevent path traversal / weird inputs
    if (!id || !/^[\w-]+$/.test(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    const order = getOrder(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, order },
      {
        headers: {
          // Order details are user-specific — never cache publicly
          "Cache-Control": "private, no-store",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
