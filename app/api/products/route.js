import { NextResponse } from "next/server";
import { shopifyFetch, normalizeProduct } from "../../../lib/shopify";
import {
  GET_PRODUCTS,
  GET_FEATURED_PRODUCTS,
} from "../../../lib/queries/products";
import { rateLimit, rateLimitResponse } from "../../../lib/rateLimit";

const sortMap = {
  "price-asc":  { sortKey: "PRICE",      reverse: false },
  "price-desc": { sortKey: "PRICE",      reverse: true  },
  newest:       { sortKey: "CREATED_AT", reverse: true  },
  "name-asc":   { sortKey: "TITLE",      reverse: false },
};

export async function GET(request) {
  // ── Rate limit: 40 requests / 60 s per IP ─────────────────────────────────
  const { success, remaining, reset } = rateLimit(request, "products", 40, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const search   = searchParams.get("search") || searchParams.get("q");
    const sort     = searchParams.get("sort");
    const limit    = Math.min(parseInt(searchParams.get("limit") || "24"), 100);
    const after    = searchParams.get("after") || null;

    // ── Featured products — long cache (2 h) ──────────────────────────────
    if (featured === "true") {
      const data = await shopifyFetch({
        query: GET_FEATURED_PRODUCTS,
        variables: { first: Math.min(limit, 20) },
        revalidate: 7200,
        tags: ["products", "featured"],
      });
      const products = (data?.products?.edges || []).map((e) =>
        normalizeProduct(e.node)
      );
      return NextResponse.json(
        { success: true, products },
        {
          headers: {
            "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=14400",
            "X-RateLimit-Remaining": String(remaining),
          },
        }
      );
    }

    const queryStr = search || null;
    const { sortKey = "RELEVANCE", reverse = false } = sortMap[sort] || {};

    // ── Search results — short cache (2 min); no-search — 10 min ──────────
    const revalidate = search ? 120 : 600;
    const cacheHeader = search
      ? "public, s-maxage=120, stale-while-revalidate=300"
      : "public, s-maxage=600, stale-while-revalidate=1200";

    const data = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: limit, query: queryStr, sortKey, reverse, after },
      revalidate,
      tags: search ? ["products", `search-${search}`] : ["products"],
    });

    const edges    = data?.products?.edges || [];
    const pageInfo = data?.products?.pageInfo || {};
    const products = edges.map((e) => normalizeProduct(e.node));

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          total:     products.length,
          hasMore:   pageInfo.hasNextPage,
          endCursor: pageInfo.endCursor,
        },
      },
      {
        headers: {
          "Cache-Control": cacheHeader,
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
