import { NextResponse } from "next/server";
import { shopifyFetch, normalizeProduct } from "../../../../lib/shopify";
import { GET_PRODUCT_BY_HANDLE, GET_PRODUCTS } from "../../../../lib/queries/products";
import { rateLimit, rateLimitResponse } from "../../../../lib/rateLimit";

export async function GET(request, { params }) {
  // ── Rate limit: 40 requests / 60 s per IP ─────────────────────────────────
  const { success, remaining, reset } = rateLimit(request, "product-handle", 40, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    const { handle } = params;

    const data = await shopifyFetch({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
      revalidate: 3600,
      tags: [`product-${handle}`],
    });

    const product = normalizeProduct(data?.productByHandle);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Fetch related products — same productType
    const relatedData = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: {
        first: 4,
        query: `product_type:${product.productType || ""} -handle:${handle}`,
      },
      revalidate: 3600,
      tags: [`product-${handle}`, "products"],
    });
    const related = (relatedData?.products?.edges || [])
      .map((e) => normalizeProduct(e.node))
      .filter((p) => p.handle !== handle);

    return NextResponse.json(
      { success: true, product, related },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products/[handle] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
