// lib/shopify.js — Shopify Storefront API client

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-04";

const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch({ query, variables = {}, cache = "force-cache", tags = [] }) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  };

  if (cache === "no-store") {
    options.cache = "no-store";
  } else {
    options.next = { revalidate: 3600, tags };
  }

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API error ${res.status}: ${text}`);
  }

  const json = await res.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  return json.data;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Normalize a Shopify product node into the shape the app uses */
export function normalizeProduct(node) {
  if (!node) return null;
  return {
    id: node.id,
    handle: node.handle,
    slug: node.handle, // alias for backward compat
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price: parseFloat(node.priceRange?.minVariantPrice?.amount || 0),
    compareAtPrice: node.compareAtPriceRange?.maxVariantPrice?.amount
      ? parseFloat(node.compareAtPriceRange.maxVariantPrice.amount)
      : null,
    images: (node.images?.edges || []).map((e) => e.node.url || e.node.originalSrc),
    isFeatured: node.tags?.includes("featured") || false,
    tags: node.tags || [],
    variants: (node.variants?.edges || []).map((e) => ({
      id: e.node.id,
      title: e.node.title,
      size: e.node.selectedOptions?.find((o) => o.name.toLowerCase() === "size")?.value || e.node.title,
      price: parseFloat(e.node.priceV2?.amount || e.node.price?.amount || 0),
      available: e.node.availableForSale,
      stock: e.node.quantityAvailable ?? (e.node.availableForSale ? 99 : 0),
    })),
    availableForSale: node.availableForSale,
    vendor: node.vendor,
    productType: node.productType,
    category: node.productType || node.vendor || "General",
    collections: (node.collections?.edges || []).map((e) => e.node.handle),
  };
}

/** Normalize a collection node */
export function normalizeCollection(node) {
  if (!node) return null;
  return {
    id: node.id,
    handle: node.handle,
    name: node.title,
    title: node.title,
    description: node.description,
    image: node.image?.url || null,
  };
}
