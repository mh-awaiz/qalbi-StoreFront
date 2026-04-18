"use client";
import { useState, useEffect } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../lib/useWishlist";


export default function WishlistButton({ product, size = 18, className = "" }) {
  const { isInWishlist, toggleWishlist, mounted } = useWishlist();
  const [animating, setAnimating] = useState(false);
  const [active,    setActive]    = useState(false);

  useEffect(() => {
    if (mounted) setActive(isInWishlist(product?.slug || product?.productId));
  }, [mounted, product?.slug, product?.productId]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    const newState = toggleWishlist(product);
    setActive(newState);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
  };

  return (
    <button
      onClick={handleClick}
      title={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`group flex items-center justify-center transition-all duration-200 ${className}`}
      style={{
        transform: animating ? "scale(1.35)" : "scale(1)",
        transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      {active ? (
        <FaHeart
          size={size}
          className="text-[#da3f3f] drop-shadow-sm"
          style={{ filter: "drop-shadow(0 0 4px rgba(218,63,63,0.4))" }}
        />
      ) : (
        <FiHeart
          size={size}
          className="text-gray-400 group-hover:text-[#da3f3f] transition-colors duration-200"
        />
      )}
    </button>
  );
}
