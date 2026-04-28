import FeaturedSlider from "./FeaturedSlider";
import { shopifyFetch, normalizeProduct } from "../../lib/shopify";
import {
  GET_COLLECTION_BY_HANDLE,
  GET_PRODUCTS,
} from "../../lib/queries/products";

// Revalidate this section every 2 hours
export const revalidate = 7200;

const COLLECTION_HANDLE = "premium-collection"; // ← your Shopify collection handle

async function getFeaturedProducts() {
  try {
    // Try premium collection first
    const colData = await shopifyFetch({
      query: GET_COLLECTION_BY_HANDLE,
      variables: {
        handle: COLLECTION_HANDLE,
        first: 20,
        sortKey: "COLLECTION_DEFAULT",
        reverse: false,
      },
      revalidate: 7200,
      tags: ["featured", `collection-${COLLECTION_HANDLE}`],
    });

    const products = (colData?.collectionByHandle?.products?.edges || []).map(
      (e) => normalizeProduct(e.node),
    );
    if (products.length > 0) return products;

    // Fall back to tag:featured
    const tagData = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: 20, query: "tag:featured" },
      revalidate: 7200,
      tags: ["featured"],
    });
    const tagProducts = (tagData?.products?.edges || []).map((e) =>
      normalizeProduct(e.node),
    );
    if (tagProducts.length > 0) return tagProducts;

    // Last resort: newest products
    const newData = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: 20, query: null, sortKey: "CREATED", reverse: true },
      revalidate: 7200,
      tags: ["products"],
    });
    return (newData?.products?.edges || []).map((e) =>
      normalizeProduct(e.node),
    );
  } catch (err) {
    console.error("Failed to fetch featured products:", err);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  return <FeaturedSlider products={products} />;
}
