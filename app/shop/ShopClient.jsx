"use client";
import { useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";

export default function ShopClient({ initialProducts, collections }) {
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [sort, setSort] = useState("newest");

  const filtered = useMemo(() => {
    let list = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    if (selectedCollection) {
      list = list.filter((p) => p.collections?.includes(selectedCollection));
    }

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        break;
    }

    return list;
  }, [initialProducts, search, selectedCollection, sort]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-2">
            Our Collection
          </p>
          <h1
            className="text-3xl sm:text-5xl font-semibold text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Shop All
          </h1>
          <p className="text-gray-500 text-sm mt-2">
            {initialProducts.length} products
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-[60px] z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap gap-2 items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--secondary)] w-48"
          />

          {/* Collection filter */}
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--secondary)] bg-white"
          >
            <option value="">All Collections</option>
            {collections.map((c) => (
              <option key={c.handle} value={c.handle}>
                {c.title}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[var(--secondary)] bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          {/* Result count */}
          <span className="ml-auto text-xs text-gray-400 hidden sm:block">
            {filtered.length} results
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 font-medium text-lg">
              No products found
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedCollection("");
              }}
              className="mt-4 px-5 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
