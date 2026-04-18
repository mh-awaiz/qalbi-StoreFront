import FeaturedSlider from "./FeaturedSlider";

async function getFeaturedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/products?featured=true&limit=20`,
      { next: { revalidate: 3600 } },
    );
    const data = await res.json();
    if (!data.success) return [];
    return data.products;
  } catch (err) {
    console.error("Failed to fetch featured products:", err);
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return <FeaturedSlider products={products} />;
}
