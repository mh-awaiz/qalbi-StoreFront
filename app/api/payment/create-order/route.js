import { NextResponse } from "next/server";
import { shopifyFetch } from "../../../../lib/shopify";

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

function fixCheckoutUrl(url) {
  if (!url) return url;
  const shopifyDomain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
  try {
    const parsed = new URL(url);
    parsed.host = shopifyDomain;
    return parsed.toString();
  } catch {
    return url;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const lines = [];
    const invalidItems = [];

    for (const item of items) {
      const gid = toShopifyGid(item.variantId);
      if (gid) {
        lines.push({
          merchandiseId: gid,
          quantity: Math.max(1, item.qty || item.quantity || 1),
        });
      } else {
        invalidItems.push(item.title || item.variantId);
      }
    }

    if (invalidItems.length > 0) {
      console.warn(
        "Items missing valid Shopify variantId (skipped):",
        invalidItems,
      );
    }

    if (!lines.length) {
      return NextResponse.json(
        {
          error:
            "No valid Shopify variant IDs found. Invalid items: " +
            invalidItems.join(", "),
        },
        { status: 400 },
      );
    }

    const buyerIdentity = customer?.email
      ? { email: customer.email }
      : undefined;

    const data = await shopifyFetch({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines,
          ...(buyerIdentity && { buyerIdentity }),
          attributes: [{ key: "source", value: "qalbicouture.com" }],
        },
      },
      cache: "no-store",
    });

    const cart = data?.cartCreate?.cart;
    const errors = data?.cartCreate?.userErrors || [];

    if (errors.length > 0) {
      console.error("Shopify cart userErrors:", errors);
      return NextResponse.json(
        { error: errors.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }

    if (!cart?.checkoutUrl) {
      return NextResponse.json(
        { error: "Shopify did not return a checkout URL" },
        { status: 500 },
      );
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

    const checkoutUrl = normalizeCheckoutUrl(cart.checkoutUrl);

    return NextResponse.json({
      success: true,
      checkoutUrl,
      cartId: cart.id,
    });
  } catch (error) {
    console.error("POST /api/payment/create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create cart: " + error.message },
      { status: 500 },
    );
  }
}
