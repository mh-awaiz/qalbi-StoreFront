import { NextResponse } from "next/server";
import { shopifyFetch, normalizeProduct } from "../../../lib/shopify";
import {
  GET_PRODUCTS,
  GET_FEATURED_PRODUCTS,
} from "../../../lib/queries/products";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const featured = searchParams.get("featured");
    const search = searchParams.get("search") || searchParams.get("q");
    const sort = searchParams.get("sort");
    const limit = parseInt(searchParams.get("limit") || "24");
    const after = searchParams.get("after") || null;

    if (featured === "true") {
      const data = await shopifyFetch({
        query: GET_FEATURED_PRODUCTS,
        variables: { first: Math.min(limit, 20) },
        revalidate: 7200,
        tags: ["products", "featured"],
      });
      const products = (data?.products?.edges || []).map((e) =>
        normalizeProduct(e.node),
      );
      return NextResponse.json({ success: true, products });
    }

    const queryParts = [];
    if (search) queryParts.push(search);
    const queryStr = queryParts.join(" ") || null;

    const sortMap = {
      "price-asc": { sortKey: "PRICE", reverse: false },
      "price-desc": { sortKey: "PRICE", reverse: true },
      newest: { sortKey: "CREATED_AT", reverse: true },
      "name-asc": { sortKey: "TITLE", reverse: false },
    };
    const { sortKey = "RELEVANCE", reverse = false } = sortMap[sort] || {};

    const data = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: limit, query: queryStr, sortKey, reverse, after },
      cache: "no-store",
    });

    const edges = data?.products?.edges || [];
    const pageInfo = data?.products?.pageInfo || {};
    const products = edges.map((e) => normalizeProduct(e.node));

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: products.length,
        hasMore: pageInfo.hasNextPage,
        endCursor: pageInfo.endCursor,
      },
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
