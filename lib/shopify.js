const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-04";
const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

export async function shopifyFetch({
  query,
  variables = {},
  cache = "force-cache",
  tags = [],
  revalidate = 3600,
}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Next.js deduplicates identical fetches within the same render
    next: cache === "no-store" ? { revalidate: 0 } : { revalidate, tags },
  });

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

export function normalizeProduct(node) {
  if (!node) return null;

  const variants = (node.variants?.edges || []).map((e) => {
    const v = e.node;
    const priceAmount = v.priceV2?.amount ?? v.price?.amount ?? "0";
    return {
      id: v.id,
      title: v.title,
      size:
        v.selectedOptions?.find((o) => o.name.toLowerCase() === "size")
          ?.value ||
        v.title ||
        "One Size",
      price: parseFloat(priceAmount) || 0,
      available: v.availableForSale,
      stock: v.quantityAvailable ?? (v.availableForSale ? 99 : 0),
    };
  });

  const priceRangeAmount = parseFloat(
    node.priceRange?.minVariantPrice?.amount || "0",
  );
  const firstVariantPrice = variants[0]?.price || 0;
  const price = priceRangeAmount > 0 ? priceRangeAmount : firstVariantPrice;

  const compareAtRaw = node.compareAtPriceRange?.maxVariantPrice?.amount;
  const compareAtPrice =
    compareAtRaw && parseFloat(compareAtRaw) > price
      ? parseFloat(compareAtRaw)
      : null;

  return {
    id: node.id,
    handle: node.handle,
    slug: node.handle,
    title: node.title,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    price,
    compareAtPrice,
    images: (node.images?.edges || []).map(
      (e) => e.node.url || e.node.originalSrc,
    ),
    isFeatured: node.tags?.includes("featured") || false,
    tags: node.tags || [],
    variants,
    availableForSale: node.availableForSale,
    vendor: node.vendor,
    productType: node.productType,
    category: node.productType || node.vendor || "General",
    collections: (node.collections?.edges || []).map((e) => e.node.handle),
  };
}

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
