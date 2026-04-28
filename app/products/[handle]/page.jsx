import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";

async function getProduct(handle) {
  try {
    const res = await fetch(
      `${process.env.PUBLIC_APP_URL}/api/products/${handle}`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.success) return null;
    return data;
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
