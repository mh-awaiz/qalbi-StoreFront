import { NextResponse } from "next/server";
import { shopifyFetch, normalizeCollection } from "../../../lib/shopify";
import { GET_COLLECTIONS } from "../../../lib/queries/products";
import { rateLimit, rateLimitResponse } from "../../../lib/rateLimit";

export async function GET(request) {
  // ── Rate limit: 60 requests / 60 s per IP ─────────────────────────────────
  const { success, remaining, reset } = rateLimit(request, "collections", 60, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const data = await shopifyFetch({
      query: GET_COLLECTIONS,
      variables: { first: 20 },
      revalidate: 3600,           // already had force-cache; keep 1 hr ISR
      tags: ["collections"],
    });

    const collections = (data?.collections?.edges || [])
      .map((e) => normalizeCollection(e.node))
      .filter(Boolean);

    return NextResponse.json(
      { success: true, categories: collections, collections },
      {
        headers: {
          // Cache at the CDN edge for 1 hour, serve stale for 2 hours while revalidating
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/collections error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
