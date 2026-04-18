"use client";
import { useState } from "react";
import ProductCard from "../../components/ProductCard";
import { ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_VISIBLE = 20;
const LOAD_MORE_COUNT = 12;

export default function CollectionGrid({ products }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const canCollapse = visibleCount > INITIAL_VISIBLE;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + LOAD_MORE_COUNT);
  };

  const handleViewLess = () => {
    setVisibleCount(INITIAL_VISIBLE);
    document
      .getElementById("collection-grid-top")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div
        id="collection-grid-top"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
      >
        {visibleProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {(hasMore || canCollapse) && (
        <div className="mt-10 flex flex-col items-center gap-3">
          {/* Progress text */}
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {visibleProducts.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">
              {products.length}
            </span>{" "}
            products
          </p>

          {/* Progress bar */}
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--secondary)] rounded-full transition-all duration-500"
              style={{
                width: `${(visibleProducts.length / products.length) * 100}%`,
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 mt-1">
            {hasMore && (
              <button
                onClick={handleViewMore}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-all active:scale-95"
              >
                <ChevronDown size={15} />
                View More
                <span className="text-xs opacity-75">
                  (+{Math.min(LOAD_MORE_COUNT, products.length - visibleCount)})
                </span>
              </button>
            )}
            {canCollapse && (
              <button
                onClick={handleViewLess}
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-gray-600 border border-gray-200 rounded-xl text-sm font-medium hover:border-gray-300 hover:bg-gray-50 transition-all active:scale-95"
              >
                <ChevronUp size={15} />
                View Less
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
