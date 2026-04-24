"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiShoppingBag,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
  FiArrowLeft,
  FiTag,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHeart,
  FiX,
  FiPackage,
  FiZap,
} from "react-icons/fi";
import { BsStars } from "react-icons/bs";
import { MdLocalOffer } from "react-icons/md";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 99;

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadCart();
    const onUpdate = () => loadCart();
    window.addEventListener("cart-updated", onUpdate);
    setTimeout(() => setVisible(true), 50);
    return () => window.removeEventListener("cart-updated", onUpdate);
  }, []);

  const loadCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem("qalbi_cart") || "[]");
      setCart(saved);
    } catch {
      setCart([]);
    }
  };

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("qalbi_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const updateQty = (index, delta) => {
    const updated = cart.map((item, i) => {
      if (i !== index) return item;
      const newQty = Math.max(1, Math.min(10, item.qty + delta));
      return { ...item, qty: newQty };
    });
    saveCart(updated);
  };

  const removeItem = (index) => {
    setRemoving(index);
    setTimeout(() => {
      const updated = cart.filter((_, i) => i !== index);
      saveCart(updated);
      setRemoving(null);
    }, 300);
  };

  const moveToWishlist = (index) => {
    try {
      const item = cart[index];
      const wishlist = JSON.parse(
        localStorage.getItem("qalbi_wishlist") || "[]",
      );
      const alreadyIn = wishlist.some(
        (w) => w.productId === item.productId || w.slug === item.slug,
      );
      if (!alreadyIn) {
        wishlist.push({
          productId: item.productId,
          title: item.title,
          slug: item.slug,
          image: item.image,
          price: item.price,
          compareAtPrice: item.compareAtPrice,
          savedAt: new Date().toISOString(),
        });
        localStorage.setItem("qalbi_wishlist", JSON.stringify(wishlist));
        window.dispatchEvent(new Event("wishlist-updated"));
      }
      removeItem(index);
    } catch {
      removeItem(index);
    }
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingCharge;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingPct = Math.min(
    100,
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
  );
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  if (!mounted) return null;

  return (
    <div className="relative min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <div className="bg-white border-b border-[#f0e8df] sticky top-0 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#da3f3f] hover:text-[#da3f3f] transition-all"
          >
            <FiArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#da3f3f] flex items-center justify-center">
              <FiShoppingBag size={15} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">
                My Bag
              </h1>
              <p className="text-[11px] text-gray-400 leading-tight">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="ml-auto flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <FiTrash2 size={12} /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {cart.length === 0 && (
        <div
          className={`flex flex-col items-center justify-center min-h-[60vh] px-6 text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-[#fdf3f3] border-2 border-[#f5d5d5] flex items-center justify-center">
              <FiShoppingBag size={44} className="text-[#e8a0a0]" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
              <BsStars size={14} className="text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Your bag is empty
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-xs">
            Looks like you haven't added anything yet. Explore our beautiful
            ethnic wear collection!
          </p>
          <Link
            href="/shop"
            className="flex items-center gap-2 px-8 py-3.5 bg-[#da3f3f] text-white font-semibold rounded-2xl hover:bg-[#c03535] transition-all shadow-lg shadow-red-900/20 text-sm"
          >
            <FiZap size={15} /> Start Shopping
          </Link>
          <Link
            href="/collections/new-arrivals"
            className="mt-4 text-xs text-[#da3f3f] hover:underline underline-offset-2"
          >
            View New Arrivals →
          </Link>
        </div>
      )}

      {cart.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* ── LEFT: Cart Items ── */}
            <div className="lg:col-span-3 space-y-3">
              {/* Free shipping progress */}
              {amountToFreeShipping > 0 ? (
                <div className="bg-white rounded-2xl border border-amber-100 p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-700">
                      <FiTruck size={15} />
                      Add{" "}
                      <span className="font-bold">
                        ₹{amountToFreeShipping.toLocaleString("en-IN")}
                      </span>{" "}
                      more for FREE shipping
                    </div>
                    <span className="text-xs text-amber-500 font-semibold">
                      {Math.round(freeShippingPct)}%
                    </span>
                  </div>
                  <div className="h-2 bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-700"
                      style={{ width: `${freeShippingPct}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3.5 flex items-center gap-3 shadow-sm">
                  <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <FiTruck size={15} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Free Shipping Unlocked!
                    </p>
                    <p className="text-xs text-green-600">
                      Your order qualifies for free delivery
                    </p>
                  </div>
                </div>
              )}

              {/* Cart items */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-[#faf6f1]">
                  {cart.map((item, index) => (
                    <div
                      key={`${item.slug}-${item.size}-${index}`}
                      className={`transition-all duration-300 ${
                        removing === index
                          ? "opacity-0 scale-95 translate-x-4"
                          : "opacity-100 scale-100"
                      }`}
                    >
                      <div className="flex gap-3.5 p-4 sm:p-5">
                        {/* Product image */}
                        <Link
                          href={`/products/${item.slug}`}
                          className="flex-shrink-0"
                        >
                          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FiPackage
                                  size={24}
                                  className="text-gray-300"
                                />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <Link href={`/products/${item.slug}`}>
                              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-[#da3f3f] transition-colors">
                                {item.title}
                              </h3>
                            </Link>
                            <button
                              onClick={() => removeItem(index)}
                              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 transition-all"
                            >
                              <FiX size={14} />
                            </button>
                          </div>

                          {item.size && (
                            <span className="inline-flex mt-1.5 px-2.5 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-full">
                              Size: {item.size}
                            </span>
                          )}

                          {/* Price */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-base font-bold text-gray-900">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                            {item.compareAtPrice &&
                              item.compareAtPrice > item.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  ₹{item.compareAtPrice.toLocaleString("en-IN")}
                                </span>
                              )}
                          </div>

                          {/* Bottom row: qty + wishlist */}
                          <div className="flex items-center justify-between mt-3">
                            {/* Qty stepper */}
                            <div className="flex items-center gap-0 rounded-xl border border-gray-200 overflow-hidden">
                              <button
                                onClick={() => updateQty(index, -1)}
                                disabled={item.qty <= 1}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                              >
                                <FiMinus size={12} />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-900 border-x border-gray-200">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => updateQty(index, 1)}
                                disabled={item.qty >= 10}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                              >
                                <FiPlus size={12} />
                              </button>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveToWishlist(index)}
                                className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-rose-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-rose-50"
                              >
                                <FiHeart size={12} /> Save
                              </button>
                              <div className="text-right">
                                <span className="text-sm font-bold text-[#da3f3f]">
                                  ₹
                                  {(item.price * item.qty).toLocaleString(
                                    "en-IN",
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue shopping */}
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm text-[#da3f3f] font-medium hover:underline underline-offset-2 px-1"
              >
                <FiArrowLeft size={14} /> Continue Shopping
              </Link>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <MdLocalOffer size={16} className="text-[#da3f3f]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Order Summary
                  </h2>
                </div>

                {/* Line items */}
                <div className="p-5 space-y-3">
                  {cart.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-gray-500 flex-1 line-clamp-1 leading-relaxed">
                        {item.title}
                        <span className="text-gray-400 text-xs ml-1">
                          ×{item.qty}
                        </span>
                      </span>
                      <span className="font-semibold text-gray-800 flex-shrink-0">
                        ₹{(item.price * item.qty).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="px-5 pb-5 space-y-2.5 border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-semibold text-gray-700">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1.5">
                      <FiTruck size={13} /> Shipping
                    </span>
                    <span
                      className={`font-semibold ${shippingCharge === 0 ? "text-green-600" : "text-gray-700"}`}
                    >
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{total.toLocaleString("en-IN")}
                      </span>
                      {shippingCharge > 0 && (
                        <p className="text-[10px] text-gray-400">
                          incl. ₹{shippingCharge} shipping
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="px-5 pb-5 space-y-3">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-4 bg-[#da3f3f] text-white font-bold rounded-2xl hover:bg-[#c03535] transition-all shadow-lg shadow-red-900/20 text-sm"
                  >
                    Proceed to Checkout <FiArrowRight size={16} />
                  </Link>

                  {/* Trust */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {[
                      { icon: FiShield, label: "Secure Pay" },
                      { icon: FiTruck, label: "Fast Ship" },
                      { icon: FiRefreshCw, label: "7-Day Return" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1 py-2 bg-gray-50 rounded-xl"
                      >
                        <Icon size={14} className="text-[#da3f3f]" />
                        <span className="text-[10px] text-gray-500 font-medium text-center leading-tight">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1">
                    <FiShield size={11} className="text-green-500" />
                    100% secure checkout via Shopify
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
