// app/api/payment/create-order/route.js
// Creates a Shopify Cart via Storefront API and returns the hosted checkoutUrl.
// Shopify handles payment (UPI, cards, COD, etc.) + Delhivery fulfillment natively.

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

/**
 * Ensure the variantId is a valid Shopify Global ID.
 * Shopify expects: gid://shopify/ProductVariant/12345
 * If we get a bare numeric or MongoDB ID, we can't use it.
 */
function toShopifyGid(variantId) {
  if (!variantId) return null;
  const str = String(variantId);
  // Already a proper Shopify GID
  if (str.startsWith("gid://shopify/ProductVariant/")) return str;
  // Numeric ID — wrap it
  if (/^\d+$/.test(str)) return `gid://shopify/ProductVariant/${str}`;
  // Anything else (MongoDB ObjectId, product GID, etc.) — can't use it
  return null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { items, customer } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Build valid Shopify line items
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
        invalidItems
      );
    }

    if (!lines.length) {
      return NextResponse.json(
        {
          error:
            "No items have valid Shopify variant IDs. Make sure products are synced from Shopify and variantId is stored in the cart. Invalid items: " +
            invalidItems.join(", "),
        },
        { status: 400 }
      );
    }

    // Pre-fill buyer identity so Shopify checkout shows customer info
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
      cache: "no-store",
    });

    const cart = data?.cartCreate?.cart;
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

    return NextResponse.json({
      success: true,
      checkoutUrl: cart.checkoutUrl,
      cartId: cart.id,
    });
  } catch (error) {
    console.error("POST /api/payment/create-order error:", error);
    return NextResponse.json(
      { error: "Failed to create cart: " + error.message },
      { status: 500 }
    );
  }
}
