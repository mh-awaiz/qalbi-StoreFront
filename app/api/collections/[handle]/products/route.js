import { NextResponse } from "next/server";
import { shopifyFetch, normalizeProduct } from "../../../../../lib/shopify";
import { GET_COLLECTION_BY_HANDLE } from "../../../../../lib/queries/products";

export async function GET(request, { params }) {
  try {
    const { handle } = params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") || "COLLECTION_DEFAULT";
    const limit = parseInt(searchParams.get("limit") || "24");
    const after = searchParams.get("after") || null;

    // Map sort param to Shopify enum
    const sortMap = {
      "price-asc": { sortKey: "PRICE", reverse: false },
      "price-desc": { sortKey: "PRICE", reverse: true },
      newest: { sortKey: "CREATED", reverse: true },
      "name-asc": { sortKey: "TITLE", reverse: false },
      default: { sortKey: "COLLECTION_DEFAULT", reverse: false },
    };
    const { sortKey, reverse } = sortMap[sort] || sortMap.default;

    const data = await shopifyFetch({
      query: GET_COLLECTION_BY_HANDLE,
      variables: { handle, first: limit, after, sortKey, reverse },
      cache: "no-store",
    });

    const col = data?.collectionByHandle;
    if (!col) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    const products = (col.products?.edges || []).map((e) => normalizeProduct(e.node));
    const pageInfo = col.products?.pageInfo || {};

    return NextResponse.json({
      success: true,
      collection: {
        id: col.id,
        handle: col.handle,
        title: col.title,
        description: col.description,
        image: col.image?.url || null,
      },
      products,
      pageInfo,
    });
  } catch (error) {
    console.error("GET /api/collections/[handle]/products error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch collection products" }, { status: 500 });
  }
}
