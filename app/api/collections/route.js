import { NextResponse } from "next/server";
import { shopifyFetch, normalizeCollection } from "../../../lib/shopify";
import { GET_COLLECTIONS } from "../../../lib/queries/products";

export async function GET() {
  try {
    const data = await shopifyFetch({
      query: GET_COLLECTIONS,
      variables: { first: 20 },
      cache: "force-cache",
      tags: ["collections"],
    });

    const collections = (data?.collections?.edges || [])
      .map((e) => normalizeCollection(e.node))
      .filter(Boolean);

    return NextResponse.json({ success: true, categories: collections, collections });
  } catch (error) {
    console.error("GET /api/collections error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch collections" }, { status: 500 });
  }
}
