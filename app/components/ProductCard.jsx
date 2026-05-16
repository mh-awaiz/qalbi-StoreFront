"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { FiShoppingBag, FiStar, FiCheck, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function useWishlistItem(slug, productId) {
  const [active, setActive] = useState(false);

  const sync = () => {
    try {
      const w = JSON.parse(localStorage.getItem("qalbi_wishlist") || "[]");
      setActive(w.some((i) => i.slug === slug || i.productId === productId));
    } catch {
      setActive(false);
    }
  };

  useEffect(() => {
    sync();
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, [slug, productId]);

  const toggle = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const w = JSON.parse(localStorage.getItem("qalbi_wishlist") || "[]");
      const idx = w.findIndex(
        (i) => i.slug === slug || i.productId === productId,
      );
      const updated =
        idx > -1
          ? w.filter((_, i) => i !== idx)
          : [...w, { ...product, savedAt: new Date().toISOString() }];
      localStorage.setItem("qalbi_wishlist", JSON.stringify(updated));
      window.dispatchEvent(new Event("wishlist-updated"));
      setActive(idx === -1);
    } catch {}
  };

  return { active, toggle };
}

export default function ProductCard({
  product,
  className = "",
  priority = false,
}) {
  const { addItem } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const { active: wishlisted, toggle: toggleWishlist } = useWishlistItem(
    product.slug || product.handle,
    product.id,
  );

  const handleAddToCart = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const firstVariant =
      product.variants?.find((v) => v.available) || product.variants?.[0];
    addItem({
      id: product.id,
      variantId: firstVariant?.id || product.id,
      title: product.title,
      price: firstVariant?.price || product.price,
      image: product.images?.[0] || "",
      slug: product.slug || product.handle,
      size: firstVariant?.size || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    setHeartAnim(true);
    setTimeout(() => setHeartAnim(false), 400);
    toggleWishlist(
      {
        productId: product.id,
        title: product.title,
        slug: product.slug || product.handle,
        image: product.images?.[0],
        price: product.price,
        compareAtPrice: product.compareAtPrice,
      },
      e,
    );
  };

  const displayPrice =
    product.price > 0 ? product.price : product.variants?.[0]?.price || 0;

  const displayCompare =
    product.compareAtPrice && product.compareAtPrice > displayPrice
      ? product.compareAtPrice
      : null;

  const discount = displayCompare
    ? Math.round(((displayCompare - displayPrice) / displayCompare) * 100)
    : null;

  const href = `/products/${product.slug || product.handle}`;

  // Use the hovered image src — falls back to first image
  const currentImage = product.images?.[imgIdx] || product.images?.[0] || null;

  return (
    <div
      className={`product-card group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      {/* ── Image area (relative container for overlays) ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
        <Link href={href} className="block absolute inset-0 z-0">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={priority}
              onMouseEnter={() => product.images?.[1] && setImgIdx(1)}
              onMouseLeave={() => setImgIdx(0)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">
              👗
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {discount && (
            <span className="px-2 py-0.5 bg-[var(--secondary)] text-white text-[10px] font-bold rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
          {product.isFeatured && !discount && (
            <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-medium rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
          style={{
            transform: heartAnim ? "scale(1.35)" : undefined,
            transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wishlisted ? (
            <FaHeart size={13} className="text-[var(--secondary)]" />
          ) : (
            <FiHeart size={13} className="text-gray-500" />
          )}
        </button>

        {/* Quick add button */}
        <div className="absolute bottom-0 left-0 right-0 z-10 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className={`w-full py-2.5 sm:py-3 text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              added
                ? "bg-green-500 text-white"
                : "bg-[var(--secondary)] text-white hover:bg-[#c03535]"
            }`}
          >
            {added ? (
              <>
                <FiCheck size={14} /> Added!
              </>
            ) : (
              <>
                <FiShoppingBag size={14} /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <Link href={href} className="block">
        <div className="p-3.5 sm:p-4">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-medium truncate">
            {product.category || product.productType || "Ethnic Wear"}
          </p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mb-2.5 group-hover:text-[var(--secondary)] transition-colors">
            {product.title}
          </h3>

          <div className="flex items-center justify-between gap-1">
            {/* Price */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              {displayPrice > 0 ? (
                <>
                  <span className="text-base font-bold text-[var(--secondary)]">
                    ₹{Number(displayPrice).toLocaleString("en-IN")}
                  </span>
                  {displayCompare && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{Number(displayCompare).toLocaleString("en-IN")}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-sm text-gray-400 italic">
                  Price on request
                </span>
              )}
            </div>

            {/* Stars */}
            <div className="flex items-center gap-0.5 flex-shrink-0">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  size={10}
                  className={
                    i < 4
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
