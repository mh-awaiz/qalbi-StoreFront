"use client";
import { useCart } from "../context/CartContext";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart();

  const shippingFree = subtotal >= 999;
  const shippingCharge = shippingFree ? 0 : 99;
  const remaining = 999 - subtotal;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[400px] bg-white z-50 cart-panel flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={20} className="text-[var(--secondary)]" />
            <h2 className="text-lg font-semibold text-gray-900">
              Your Bag{" "}
              {totalItems > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-1">
                  ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free shipping banner */}
        {!shippingFree && items.length > 0 && (
          <div className="mx-4 mt-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-xs text-[var(--secondary)] font-medium text-center">
              Add ₹{remaining.toFixed(0)} more for{" "}
              <span className="font-bold">FREE shipping!</span>
            </p>
            <div className="mt-2 h-1.5 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--secondary)] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {shippingFree && items.length > 0 && (
          <div className="mx-4 mt-4 px-4 py-2 bg-green-50 border border-green-100 rounded-xl">
            <p className="text-xs text-green-600 font-medium text-center">
               You've unlocked <span className="font-bold">FREE shipping!</span>
            </p>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-[var(--secondary)] opacity-50" />
              </div>
              <p className="text-gray-500 font-medium mb-1">Your bag is empty</p>
              <p className="text-sm text-gray-400 mb-6">
                Add some beautiful pieces to get started
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-3 p-3 bg-gray-50 rounded-2xl"
              >
                {/* Image */}
                <div className="w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                    {item.title}
                  </p>
                  {item.size && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Size: {item.size}
                    </p>
                  )}
                  <p className="text-sm font-bold text-[var(--secondary)] mt-1">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>

                  {/* Qty controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQty(item.variantId, item.size, item.qty - 1, item.id)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 text-center text-sm font-medium text-gray-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.variantId, item.size, item.qty + 1, item.id)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.variantId, item.size, item.id)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-[var(--secondary)] text-gray-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-4 py-5 space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span className={shippingFree ? "text-green-600 font-medium" : ""}>
                  {shippingFree ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
                <span>Total</span>
                <span>₹{(subtotal + shippingCharge).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[var(--secondary)] text-white rounded-xl font-semibold text-sm hover:bg-[#c03535] transition-colors shadow-lg shadow-red-200"
            >
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/shop"
              onClick={closeCart}
              className="block text-center text-sm text-gray-500 hover:text-[var(--secondary)] transition-colors py-1"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
