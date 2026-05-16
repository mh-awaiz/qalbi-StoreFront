import { NextResponse } from "next/server";
import { shopifyFetch, normalizeProduct } from "../../../../../lib/shopify";
import { GET_COLLECTION_BY_HANDLE } from "../../../../../lib/queries/products";
import { rateLimit, rateLimitResponse } from "../../../../../lib/rateLimit";

// Valid ProductCollectionSortKeys
const sortMap = {
  "price-asc":  { sortKey: "PRICE",              reverse: false },
  "price-desc": { sortKey: "PRICE",              reverse: true  },
  newest:       { sortKey: "CREATED",            reverse: true  },
  "name-asc":   { sortKey: "TITLE",              reverse: false },
  default:      { sortKey: "COLLECTION_DEFAULT", reverse: false },
};

export async function GET(request, { params }) {
  // ── Rate limit: 30 requests / 60 s per IP ──────────────────────────────────
  const { success, remaining, reset } = rateLimit(request, "collection-products", 30, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const { handle } = params;
    const { searchParams } = new URL(request.url);
    const sort  = searchParams.get("sort")  || "default";
    const limit = Math.min(parseInt(searchParams.get("limit") || "24"), 100); // cap at 100
    const after = searchParams.get("after") || null;

    const { sortKey, reverse } = sortMap[sort] || sortMap.default;

    // ── Fetch with ISR caching (5 min) — was "no-store" ───────────────────
    const data = await shopifyFetch({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle, first: limit, after, sortKey, reverse },
      revalidate: 300,
      tags: [`collection-${handle}`],
    });

    const col = data?.collectionByHandle;
    if (!col) {
      return NextResponse.json(
        { success: false, error: "Collection not found" },
        { status: 404 }
      );
    }

    const products = (col.products?.edges || []).map((e) => normalizeProduct(e.node));
    const pageInfo = col.products?.pageInfo || {};

    // ── Cache at CDN / browser level for 5 min ────────────────────────────
    return NextResponse.json(
      {
        success: true,
        collection: {
          id:          col.id,
          handle:      col.handle,
          title:       col.title,
          description: col.description,
          image:       col.image?.url || null,
        },
        products,
        pageInfo,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/collections/[handle]/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch collection products" },
      { status: 500 }
    );
  }
}
