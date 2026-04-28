import {
  shopifyFetch,
  normalizeProduct,
  normalizeCollection,
} from "../../lib/shopify";
import { GET_PRODUCTS, GET_COLLECTIONS } from "../../lib/queries/products";
import ShopClient from "./ShopClient";

export const revalidate = 3600;

export const metadata = {
  title: "Shop All — Qalbi Couture",
  description: "Browse our full collection of premium ethnic wear.",
};

export default async function ShopPage() {
  const [productsData, collectionsData] = await Promise.all([
    shopifyFetch({
      query: GET_PRODUCTS,
      variables: { first: 100, sortKey: "CREATED_AT", reverse: true },
      revalidate: 3600,
      tags: ["products"],
    }),
    shopifyFetch({
      query: GET_COLLECTIONS,
      variables: { first: 20 },
      revalidate: 3600,
      tags: ["collections"],
    }),
  ]);

  const products = (productsData?.products?.edges || []).map((e) =>
    normalizeProduct(e.node),
  );
  const collections = (collectionsData?.collections?.edges || []).map((e) => ({
    id: e.node.id,
    handle: e.node.handle,
    title: e.node.title,
    name: e.node.title,
  }));

  return <ShopClient initialProducts={products} collections={collections} />;
}
