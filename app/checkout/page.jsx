"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingBag, FiLoader } from "react-icons/fi";

export default function CheckoutPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  useEffect(() => {
    async function redirectToShopify() {
      try {
        const saved = JSON.parse(localStorage.getItem("qalbi_cart") || "[]");
        if (!saved.length) {
          router.replace("/shop");
          return;
        }

        const items = saved.map((i) => ({
          variantId: i.variantId || i.id,
          qty: i.qty || 1,
          title: i.title,
          price: i.price,
        }));

        const res = await fetch("/api/payment/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
        const data = await res.json();

        if (!res.ok || !data.checkoutUrl) {
          throw new Error(data.error || "Could not create checkout session");
        }

        // Clear local cart then hand off to Shopify
        localStorage.removeItem("qalbi_cart");
        window.dispatchEvent(new Event("cart-updated"));
        window.location.href = data.checkoutUrl;
      } catch (err) {
        console.error("Checkout redirect error:", err);
        setError(err.message);
      }
    }

    redirectToShopify();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf6f1] px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag size={28} className="text-[#da3f3f]" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-gray-500 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push("/cart")}
              className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 bg-[#da3f3f] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#faf6f1]">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#da3f3f]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiLoader size={28} className="text-[#da3f3f] animate-spin" />
        </div>
        <p className="text-gray-700 font-semibold text-base">
          Redirecting to Shopify Checkout…
        </p>
        <p className="text-gray-400 text-sm mt-1.5">
          Please wait, do not close this page.
        </p>
      </div>
    </div>
  );
}
