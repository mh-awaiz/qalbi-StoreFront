import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import CollectionGrid from "./CollectionGrid";

async function getCollectionData(handle) {
  try {
    const res = await fetch(
      `${process.env.PUBLIC_APP_URL}/api/collections/${handle}/products?limit=100`,
      { next: { revalidate: 3600 } }
    );
    const data = await res.json();
    if (!data.success) return null;
    return data;
  } catch { return null; }
}

export async function generateMetadata({ params }) {
  const data = await getCollectionData(params.handle);
  const title = data?.collection?.title || params.handle.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
  return {
    title: `${title} — Qalbi Couture`,
    description: data?.collection?.description || "Browse our curated collection.",
  };
}

export default async function CollectionPage({ params }) {
  const { handle } = params;
  const data = await getCollectionData(handle);

  const products = data?.products || [];
  const col = data?.collection;

  if (!col && products.length === 0) notFound();

  const info = {
    title: col?.title || handle.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" "),
    description: col?.description || "Explore our curated collection.",
    gradient: "from-rose-50 to-pink-50",
  };

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className={`bg-gradient-to-br ${info.gradient} border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[var(--secondary)] transition-colors mb-4">
            <ArrowLeft size={13} /> All Collections
          </Link>
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-2">Collection</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            {info.title}
          </h1>
          {info.description && <p className="text-gray-500 text-sm mt-2 max-w-lg leading-relaxed">{info.description}</p>}
          <p className="text-xs text-gray-400 mt-3 font-medium">{products.length} {products.length === 1 ? "product" : "products"}</p>
        </div>
      </div>

      {/* Sort bar */}
      {products.length > 0 && (
        <div className="border-b border-gray-100 bg-white sticky top-[60px] z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500 hidden sm:block">Showing {products.length} products</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { label: "Featured", href: "?sort=default" },
                { label: "Price: Low", href: "?sort=price-asc" },
                { label: "Price: High", href: "?sort=price-desc" },
                { label: "Newest", href: "?sort=newest" },
              ].map(s => (
                <Link key={s.label} href={`/collections/${handle}${s.href}`}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 rounded-lg hover:bg-red-50 hover:text-[var(--secondary)] transition-colors whitespace-nowrap">
                  {s.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">👗</div>
            <p className="text-gray-500 font-medium text-lg">No products in this collection yet</p>
            <p className="text-sm text-gray-400 mt-1 mb-6">Check back soon or browse all products</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white rounded-xl font-medium text-sm hover:bg-[#c03535] transition-colors">
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <CollectionGrid products={products} />
            <div className="text-center mt-12 pt-8 border-t border-gray-100">
              <p className="text-sm text-gray-400 mb-4">Looking for something specific?</p>
              <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--secondary)] hover:underline underline-offset-4">
                Browse all products →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
