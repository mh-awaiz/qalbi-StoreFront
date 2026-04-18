import ShopClient from "./ShopClient";

async function getAllProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/products?limit=100`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    if (!data.success) return [];
    return data.products;
  } catch (err) {
    console.error("Failed to fetch products for shop:", err);
    return [];
  }
}

export const metadata = {
  title: "Shop All Collections — Qalbi Couture",
  description:
    "Browse 75+ premium dress materials, Pakistani suits, and salwar kameez sets. Filter by category, price, and fabric.",
};

export default async function ShopPage({ searchParams }) {
  const products = await getAllProducts();

  return (
    <ShopClient
      products={products}
      initialCollection={searchParams?.collection || ""}
      initialSearch={searchParams?.search || ""}
      initialSort={searchParams?.sort || "featured"}
    />
  );
}
