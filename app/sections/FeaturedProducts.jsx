import FeaturedSlider from "./FeaturedSlider";
import { shopifyFetch, normalizeProduct } from "../../lib/shopify";
import {
  GET_COLLECTION_BY_HANDLE,
  GET_PRODUCTS,
} from "../../lib/queries/products";

async function getFeaturedProducts() {
  const COLLECTION_HANDLE = "premium-collection";

  try {
    const colData = await shopifyFetch({
      query: GET_COLLECTION_BY_HANDLE,
      variables: {
        handle: COLLECTION_HANDLE,
        first: 20,
        sortKey: "COLLECTION_DEFAULT",
        reverse: false,
      },
      cache: "force-cache",
      tags: ["featured", `collection-${COLLECTION_HANDLE}`],
    });

    const products = (colData?.collectionByHandle?.products?.edges || []).map(
      (e) => normalizeProduct(e.node),
    );

    if (products.length > 0) return products;

    const tagData = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: 20, query: "tag:featured" },
      cache: "force-cache",
      tags: ["featured"],
    });
    const tagProducts = (tagData?.products?.edges || []).map((e) =>
      normalizeProduct(e.node),
    );
    if (tagProducts.length > 0) return tagProducts;

    const newData = await shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: 20, query: null, sortKey: "CREATED", reverse: true },
      cache: "force-cache",
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
