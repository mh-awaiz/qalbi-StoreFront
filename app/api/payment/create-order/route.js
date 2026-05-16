import { NextResponse } from "next/server";
import { shopifyFetch } from "../../../../lib/shopify";
import { rateLimit, rateLimitResponse } from "../../../../lib/rateLimit";

const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
      }
      userErrors { field message }
    }
  }
`;

function toShopifyGid(variantId) {
  if (!variantId) return null;
  const str = String(variantId);
  if (str.startsWith("gid://shopify/ProductVariant/")) return str;
  if (/^\d+$/.test(str)) return `gid://shopify/ProductVariant/${str}`;
  return null;
}

function normalizeCheckoutUrl(url) {
  if (!url) return url;
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("qalbicouture.com")) {
      parsed.hostname = "qalbicouture.myshopify.com";
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function POST(request) {
  // ── Rate limit: 10 checkout attempts / 60 s per IP ────────────────────────
  // Tighter limit — this hits Shopify's mutation API every time.
  const { success, remaining, reset } = rateLimit(request, "create-order", 10, 60);
  if (!success) return rateLimitResponse(reset);

  try {
    // ── Guard against oversized payloads (max 64 KB) ──────────────────────
    const contentLength = parseInt(request.headers.get("content-length") || "0");
    if (contentLength > 65536) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 413 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { items, customer } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // ── Cap the number of line items to prevent abuse ──────────────────────
    if (items.length > 50) {
      return NextResponse.json(
        { error: "Too many items in cart (max 50)" },
        { status: 400 }
      );
    }

    const lines = [];
    const invalidItems = [];

    for (const item of items) {
      const gid = toShopifyGid(item.variantId);
      if (gid) {
        lines.push({
          merchandiseId: gid,
          quantity: Math.min(Math.max(1, item.qty || item.quantity || 1), 99), // cap qty per item
        });
      } else {
        invalidItems.push(item.title || item.variantId);
      }
    }

    if (invalidItems.length > 0) {
      console.warn("Items missing valid Shopify variantId (skipped):", invalidItems);
    }

    if (!lines.length) {
      return NextResponse.json(
        {
          error:
            "No valid Shopify variant IDs found. Invalid items: " +
            invalidItems.join(", "),
        },
        { status: 400 }
      );
    }

    const buyerIdentity = customer?.email ? { email: customer.email } : undefined;

    const data = await shopifyFetch({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines,
          ...(buyerIdentity && { buyerIdentity }),
          attributes: [{ key: "source", value: "qalbicouture.com" }],
        },
      },
      cache: "no-store", // mutations must never be cached
    });

    const cart   = data?.cartCreate?.cart;
    const errors = data?.cartCreate?.userErrors || [];

    if (errors.length > 0) {
      console.error("Shopify cart userErrors:", errors);
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    if (!cart?.checkoutUrl) {
      return NextResponse.json(
        { error: "Shopify did not return a checkout URL" },
        { status: 500 }
      );
    }

    const checkoutUrl = normalizeCheckoutUrl(cart.checkoutUrl);

    return NextResponse.json(
      { success: true, checkoutUrl, cartId: cart.id },
      {
        headers: {
          // Never cache checkout responses
          "Cache-Control": "no-store",
          "X-RateLimit-Remaining": String(remaining),
        },
      }
    );
  } catch (error) {
    console.error("POST /api/payment/create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create cart: " + error.message },
      { status: 500 }
    );
  }
}
