// lib/useWishlist.js — localStorage-based wishlist hook

import { useState, useEffect } from "react";
import { useCart } from "../app/context/CartContext";

const STORAGE_KEY = "qalbi_wishlist";

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { addItem } = useCart();

  // Read from localStorage once mounted (avoids SSR mismatch)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      setWishlist(saved);
    } catch {
      setWishlist([]);
    }
    setMounted(true);
  }, []);

  // Keep in sync when other tabs / components update the wishlist
  useEffect(() => {
    const sync = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        setWishlist(saved);
      } catch {
        setWishlist([]);
      }
    };
    window.addEventListener("wishlist-updated", sync);
    return () => window.removeEventListener("wishlist-updated", sync);
  }, []);

  /** Persist updated list and fire event so other components stay in sync */
  const persist = (updated) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event("wishlist-updated"));
  };

  /** Remove a wishlist item by slug */
  const removeFromWishlist = (slug) => {
    const updated = wishlist.filter(
      (i) => i.slug !== slug && i.productId !== slug
    );
    persist(updated);
  };

  /**
   * Move a wishlist item to the cart.
   * Returns true on success so the caller can show feedback.
   */
  const moveToCart = (item) => {
    try {
      addItem({
        id: item.productId || item.id,
        variantId: item.variantId || item.productId || item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        slug: item.slug,
        size: item.size || null,
      });
      return true;
    } catch {
      return false;
    }
  };

  /** Clear the entire wishlist */
  const clearWishlist = () => persist([]);

  return { wishlist, removeFromWishlist, moveToCart, clearWishlist, mounted };
}
