import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import { shopifyFetch, normalizeProduct } from "../../../lib/shopify";
import {
  GET_PRODUCT_BY_HANDLE,
  GET_PRODUCTS,
  GET_COLLECTION_BY_HANDLE,
} from "../../../lib/queries/products";

async function getProduct(handle) {
  try {
    const data = await shopifyFetch({
      query: GET_PRODUCT_BY_HANDLE,
      variables: { handle },
      revalidate: 3600,
      tags: [`product-${handle}`],
    });

    const product = normalizeProduct(data?.productByHandle);
    if (!product) return null;

    // Strategy: try same collection first → same productType → newest products
    // Run all 3 in parallel, use whichever returns enough results
    const [collectionData, typeData, newestData] = await Promise.all([
      // 1. Products from same collection
      product.collections?.[0]
        ? shopifyFetch({
            query: GET_COLLECTION_BY_HANDLE,
            variables: {
              handle: product.collections[0],
              first: 8,
              sortKey: "COLLECTION_DEFAULT",
              reverse: false,
            },
            revalidate: 3600,
          }).catch(() => null)
        : Promise.resolve(null),

      // 2. Products of same type
      shopifyFetch({
        query: GET_PRODUCTS,
        variables: {
          first: 8,
          query: product.productType
            ? `product_type:"${product.productType}" -title:"${product.title}"`
            : null,
          sortKey: "CREATED_AT",
          reverse: true,
        },
        revalidate: 3600,
      }).catch(() => null),

      // 3. Newest products as final fallback
      shopifyFetch({
        query: GET_PRODUCTS,
        variables: { first: 8, sortKey: "CREATED_AT", reverse: true },
        revalidate: 3600,
      }).catch(() => null),
    ]);

    // Build related list — exclude current product, deduplicate by handle
    const seen = new Set([handle]);
    const addUnique = (items) =>
      (items || [])
        .map((e) => normalizeProduct(e.node || e))
        .filter((p) => p && !seen.has(p.handle) && seen.add(p.handle));

    let related = [];

    // Try collection first
    const collectionProducts =
      collectionData?.collectionByHandle?.products?.edges || [];
    related = addUnique(collectionProducts);

    // Top up with same-type products
    if (related.length < 4) {
      const typeProducts = typeData?.products?.edges || [];
      related = [...related, ...addUnique(typeProducts)];
    }

    // Top up with newest if still not enough
    if (related.length < 4) {
      const newestProducts = newestData?.products?.edges || [];
      related = [...related, ...addUnique(newestProducts)];
    }

    // Cap at 8
    related = related.slice(0, 8);

    return { product, related };
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const data = await getProduct(params.handle);
  if (!data) return { title: "Product Not Found — Qalbi Couture" };
  const { product } = data;
  return {
    title: `${product.title} — Qalbi Couture`,
    description: product.description?.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description?.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductPage({ params }) {
  const data = await getProduct(params.handle);
  if (!data) notFound();
  return <ProductDetail product={data.product} related={data.related} />;
}
