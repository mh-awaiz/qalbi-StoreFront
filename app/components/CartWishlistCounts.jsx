"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingBag, FiHeart } from "react-icons/fi";


export default function CartWishlistCounts() {
  const [cartCount,     setCartCount]     = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);

  const sync = () => {
    try {
      const cart     = JSON.parse(localStorage.getItem("qalbi_cart")     || "[]");
      const wishlist = JSON.parse(localStorage.getItem("qalbi_wishlist") || "[]");
      setCartCount(cart.reduce((s, i) => s + (i.qty || 1), 0));
      setWishlistCount(wishlist.length);
    } catch {}
  };

  useEffect(() => {
    sync();
    window.addEventListener("cart-updated",     sync);
    window.addEventListener("wishlist-updated", sync);
    return () => {
      window.removeEventListener("cart-updated",     sync);
      window.removeEventListener("wishlist-updated", sync);
    };
  }, []);

  return (
    <div className="flex items-center gap-1">
      {/* Wishlist */}
      <Link
        href="/wishlist"
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-[#da3f3f] hover:bg-rose-50 transition-all"
        aria-label="Wishlist"
      >
        <FiHeart size={20} />
        {wishlistCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full px-1 leading-none">
            {wishlistCount > 99 ? "99+" : wishlistCount}
          </span>
        )}
      </Link>

      {/* Cart */}
      <Link
        href="/cart"
        className="relative flex items-center justify-center w-10 h-10 rounded-xl text-gray-600 hover:text-[#da3f3f] hover:bg-red-50 transition-all"
        aria-label="Cart"
      >
        <FiShoppingBag size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-[#da3f3f] text-white text-[10px] font-bold rounded-full px-1 leading-none">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>
    </div>
  );
}
