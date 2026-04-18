"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiHeart, FiShoppingBag, FiTrash2, FiArrowLeft,
  FiShare2, FiCheck, FiArrowRight, FiTag, FiEye,
  FiX, FiShoppingCart,
} from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { useWishlist } from "../../lib/useWishlist";

export default function WishlistPage() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, moveToCart, mounted } = useWishlist();

  const [removing,   setRemoving]   = useState(null);
  const [addedToCart, setAddedToCart] = useState({});
  const [shared,     setShared]     = useState(false);
  const [visible,    setVisible]    = useState(false);
  const [cartAdded,  setCartAdded]  = useState(new Set());

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const handleRemove = (slug) => {
    setRemoving(slug);
    setTimeout(() => {
      removeFromWishlist(slug);
      setRemoving(null);
    }, 300);
  };

  const handleMoveToCart = (item) => {
    const key = item.slug || item.productId;
    const success = moveToCart(item);
    if (success) {
      setCartAdded((prev) => new Set([...prev, key]));
      setTimeout(() => {
        setCartAdded((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 2000);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Wishlist — Qalbi Couture", url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {}
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((item) => handleMoveToCart(item));
  };

  if (!mounted) return null;

  return (
    <div
      className="min-h-screen bg-[#faf6f1]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#f0e8df] sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#da3f3f] hover:text-[#da3f3f] transition-all"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-400 to-[#da3f3f] flex items-center justify-center">
              <FaHeart size={13} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Wishlist</h1>
              <p className="text-[11px] text-gray-400 leading-tight">
                {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {wishlist.length > 0 && (
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-700 border border-gray-200 rounded-xl hover:border-gray-300 transition-all"
              >
                {shared ? <FiCheck size={13} className="text-green-500" /> : <FiShare2 size={13} />}
                {shared ? "Copied!" : "Share"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {wishlist.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center min-h-[65vh] px-6 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-[#fdf3f3] border-2 border-[#f5d5d5] flex items-center justify-center">
              <FiHeart size={44} className="text-[#e8a0a0]" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <BsStars size={14} className="text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Nothing saved yet</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
            Tap the ❤️ on any product to save it here for later. Your wishlist is waiting to be filled!
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-500 to-[#da3f3f] text-white font-semibold rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-red-900/20 text-sm"
          >
            <FiHeart size={15} /> Discover Products
          </Link>
          <Link href="/collections/new-arrivals" className="mt-4 text-xs text-[#da3f3f] hover:underline underline-offset-2">
            Browse New Arrivals →
          </Link>
        </div>
      )}

      {/* Wishlist grid */}
      {wishlist.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">

          {/* Top actions bar */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{wishlist.length}</span> item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
            <button
              onClick={handleMoveAllToCart}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#da3f3f] text-white text-sm font-semibold rounded-xl hover:bg-[#c03535] transition-all shadow-sm shadow-red-900/15"
            >
              <FiShoppingBag size={14} /> Add All to Bag
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {wishlist.map((item, index) => {
              const key       = item.slug || item.productId;
              const isRemoving = removing === key;
              const isAdded   = cartAdded.has(key);
              const discount  = item.compareAtPrice && item.compareAtPrice > item.price
                ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                : null;

              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group transition-all duration-300 ${
                    isRemoving ? "opacity-0 scale-95 -translate-y-2" : "opacity-100 scale-100"
                  }`}
                  style={{
                    animationDelay: `${index * 60}ms`,
                    animation: visible ? `fadeUp 0.5s ease forwards ${index * 60}ms` : "none",
                    opacity: visible ? 1 : 0,
                  }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gray-50">
                    <Link href={`/products/${item.slug}`}>
                      <div className="aspect-[3/4] overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiTag size={28} className="text-gray-200" />
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Discount badge */}
                    {discount && (
                      <div className="absolute top-2 left-2 bg-[#da3f3f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        -{discount}%
                      </div>
                    )}

                    {/* Remove button */}
                    <button
                      onClick={() => handleRemove(key)}
                      className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                    >
                      <FiX size={13} />
                    </button>

                    {/* View overlay */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-3 flex items-end justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <span className="text-white text-xs font-semibold flex items-center gap-1.5">
                        <FiEye size={12} /> Quick View
                      </span>
                    </Link>
                  </div>

                  {/* Info */}
                  <div className="p-3.5">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug hover:text-[#da3f3f] transition-colors mb-2">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{item.price?.toLocaleString("en-IN")}
                      </span>
                      {item.compareAtPrice && item.compareAtPrice > item.price && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{item.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Saved date */}
                    {item.savedAt && (
                      <p className="text-[10px] text-gray-400 mb-2.5">
                        Saved {new Date(item.savedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                          isAdded
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-[#da3f3f] text-white hover:bg-[#c03535] shadow-sm"
                        }`}
                      >
                        {isAdded ? (
                          <><FiCheck size={11} /> Added!</>
                        ) : (
                          <><FiShoppingBag size={11} /> Add to Bag</>
                        )}
                      </button>
                      <button
                        onClick={() => handleRemove(key)}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-medium text-gray-400 border border-gray-200 hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <FiTrash2 size={11} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 text-center space-y-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-[#da3f3f] text-[#da3f3f] font-semibold rounded-2xl hover:bg-[#da3f3f] hover:text-white transition-all text-sm"
            >
              <FiHeart size={15} /> Keep Browsing
            </Link>
            {wishlist.length > 0 && (
              <div>
                <Link
                  href="/cart"
                  className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#da3f3f] transition-colors"
                >
                  <FiShoppingCart size={14} /> View Cart <FiArrowRight size={13} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
