"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiHome,
  FiMail,
  FiExternalLink,
  FiShoppingBag,
  FiCopy,
  FiCheck,
} from "react-icons/fi";
import { MdLocalShipping } from "react-icons/md";
import { BsStars } from "react-icons/bs";
import Image from "next/image";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const orderId = searchParams.get("id");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger confetti-style animation
    setTimeout(() => setVisible(true), 100);

    if (!orderId) {
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => setOrder(d.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    {
      icon: FiCheckCircle,
      label: "Order Confirmed",
      sub: "Payment received",
      done: true,
    },
    {
      icon: FiPackage,
      label: "Being Prepared",
      sub: "Packing your order",
      done: false,
    },
    {
      icon: MdLocalShipping,
      label: "Shipped",
      sub: "On the way via Delhivery",
      done: false,
    },
    {
      icon: FiHome,
      label: "Delivered",
      sub: "Est. 5–7 business days",
      done: false,
    },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#fdf8f3] to-[#faf6f1]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Confetti dots */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {visible &&
          [...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-70"
              style={{
                left: `${5 + Math.random() * 90}%`,
                top: "-8px",
                background: [
                  "#da3f3f",
                  "#f5c842",
                  "#4ade80",
                  "#60a5fa",
                  "#c084fc",
                ][i % 5],
                animation: `fall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 1.5}s forwards`,
              }}
            />
          ))}
      </div>

      <div className="max-w-xl mx-auto px-4 py-8 lg:py-16 relative z-10">
        {/* Hero success */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="relative inline-flex mb-5">
            <div className="w-20 h-20 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center">
              <FiCheckCircle size={36} className="text-green-500" />
            </div>
            <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[#fdf8f3] flex items-center justify-center">
              <BsStars size={14} className="text-amber-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed! 🌸
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto">
            Shukriya for shopping with us. Your beautiful ethnic wear is being
            lovingly prepared.
          </p>
        </div>

        {/* Order number card */}
        <div
          className={`bg-white rounded-3xl border border-[#f0dcc8] shadow-lg shadow-amber-900/5 p-6 mb-5 transition-all duration-700 delay-100 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2 text-center">
            Your Order Number
          </p>
          <div className="flex items-center justify-center gap-3">
            <p className="text-2xl font-bold text-[#2d1810] tracking-widest">
              {orderNumber || "—"}
            </p>
            {orderNumber && (
              <button
                onClick={copyOrderNumber}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {copied ? (
                  <FiCheck size={14} className="text-green-500" />
                ) : (
                  <FiCopy size={14} />
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            Save this for tracking your order
          </p>
        </div>

        {/* Order items (if loaded) */}
        {!loading && order?.items?.length > 0 && (
          <div
            className={`bg-white rounded-3xl border border-gray-100 shadow-sm mb-5 overflow-hidden transition-all duration-700 delay-150 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <FiShoppingBag size={14} className="text-[#da3f3f]" />
              <p className="text-sm font-semibold text-gray-800">
                Items Ordered
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-3 p-4">
                  <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                      {item.title}
                    </p>
                    {item.size && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        Size: {item.size} · Qty: {item.qty}
                      </p>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                    ₹{(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
            {order && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between">
                <span className="text-sm text-gray-500">Total Paid</span>
                <span className="text-sm font-bold text-gray-900">
                  ₹{order.total?.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        <div
          className={`bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-5 transition-all duration-700 delay-200 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-5">
            What Happens Next
          </p>
          <div className="space-y-0">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        s.done
                          ? "bg-green-50 text-green-600 border-2 border-green-200"
                          : "bg-gray-50 text-gray-400 border-2 border-gray-100"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-1 ${s.done ? "bg-green-100" : "bg-gray-100"}`}
                      />
                    )}
                  </div>
                  <div className="pb-6 pt-1.5">
                    <p
                      className={`text-sm font-semibold ${s.done ? "text-green-700" : "text-gray-500"}`}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Email notice */}
        <div
          className={`bg-[#fdf8f3] border border-[#f0dcc8] rounded-2xl p-4 mb-6 flex gap-3 items-start transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <FiMail size={18} className="text-[#da3f3f] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-[#2d1810] mb-0.5">
              Confirmation Email Sent
            </p>
            <p className="text-xs text-[#9b6e4f] leading-relaxed">
              We've sent an order confirmation to your email
              {order?.customer?.email ? ` at ${order.customer.email}` : ""}. A
              tracking link will be sent via SMS once shipped.
            </p>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          className={`space-y-3 transition-all duration-700 delay-300 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          {order?.delhiveryWaybill && (
            <a
              href={`https://www.delhivery.com/track/package/${order.delhiveryWaybill}`}
              target="_blank"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#da3f3f] text-white font-semibold rounded-2xl hover:bg-[#c03535] transition-all text-sm"
            >
              <FiTruck size={16} /> Track Your Order{" "}
              <FiExternalLink size={14} />
            </a>
          )}
          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-[#da3f3f] text-[#da3f3f] font-semibold rounded-2xl hover:bg-[#da3f3f] hover:text-white transition-all text-sm"
          >
            <FiShoppingBag size={16} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 py-3 text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors"
          >
            <FiHome size={15} /> Back to Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          0%   { transform: translateY(0) rotate(0deg); opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf6f1] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#da3f3f] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ConfirmedContent />
    </Suspense>
  );
}
