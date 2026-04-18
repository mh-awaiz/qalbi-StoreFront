"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiSearch, FiPackage, FiTruck, FiCheckCircle, FiClock,
  FiMapPin, FiPhone, FiAlertCircle, FiExternalLink,
  FiChevronDown, FiChevronUp, FiArrowLeft, FiShoppingBag,
  FiX, FiBox,
} from "react-icons/fi";
import { MdLocalShipping, MdVerified } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import Image from "next/image";


const STATUS_CONFIG = {
  processing: {
    label: "Order Received",
    color: "text-amber-700",
    bg:    "bg-amber-50",
    border:"border-amber-200",
    dot:   "bg-amber-400",
    ring:  "ring-amber-200",
    icon:  FiClock,
    step:  1,
  },
  confirmed: {
    label: "Confirmed",
    color: "text-blue-700",
    bg:    "bg-blue-50",
    border:"border-blue-200",
    dot:   "bg-blue-400",
    ring:  "ring-blue-200",
    icon:  FiCheckCircle,
    step:  2,
  },
  shipped: {
    label: "Shipped",
    color: "text-purple-700",
    bg:    "bg-purple-50",
    border:"border-purple-200",
    dot:   "bg-purple-400",
    ring:  "ring-purple-200",
    icon:  MdLocalShipping,
    step:  3,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-700",
    bg:    "bg-green-50",
    border:"border-green-200",
    dot:   "bg-green-400",
    ring:  "ring-green-200",
    icon:  FiCheckCircle,
    step:  4,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-600",
    bg:    "bg-red-50",
    border:"border-red-200",
    dot:   "bg-red-400",
    ring:  "ring-red-200",
    icon:  FiX,
    step:  0,
  },
};

const STEPS = [
  { key: "processing", label: "Order Placed",    icon: BsBoxSeam },
  { key: "confirmed",  label: "Confirmed",       icon: FiCheckCircle },
  { key: "shipped",    label: "On The Way",       icon: FiTruck },
  { key: "delivered",  label: "Delivered",       icon: FiMapPin },
];

function TrackContent() {
  const searchParams  = useSearchParams();
  const router        = useRouter();

  const [orderNum, setOrderNum] = useState(searchParams.get("order") || "");
  const [phone,    setPhone]    = useState(searchParams.get("phone") || "");
  const [order,    setOrder]    = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showItems, setShowItems] = useState(false);
  const [searched,  setSearched]  = useState(false);

  // Auto-search if URL has params
  useEffect(() => {
    if (searchParams.get("order")) {
      handleSearch(null, searchParams.get("order"), searchParams.get("phone") || "");
    }
  }, []);

  const handleSearch = async (e, overrideOrder, overridePhone) => {
    if (e) e.preventDefault();
    const num = (overrideOrder || orderNum).trim().toUpperCase();
    const ph  = (overridePhone  || phone).trim();

    if (!num) { setError("Please enter an order number"); return; }

    setLoading(true);
    setError("");
    setOrder(null);
    setSearched(true);

    try {
      const params = new URLSearchParams({ orderNumber: num });
      if (ph) params.set("phone", ph);
      const res  = await fetch(`/api/track-order?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data.order);
        // Update URL without reload
        router.replace(`/track-order?order=${num}${ph ? "&phone=" + ph : ""}`, { scroll: false });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sc     = order ? (STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.processing) : null;
  const currStep = sc?.step || 0;

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-[#fdf8f3] to-[#faf6f1]"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header */}
      <div className="bg-white border-b border-[#f0e8df] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:border-[#da3f3f] hover:text-[#da3f3f] transition-all"
          >
            <FiArrowLeft size={18} />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#da3f3f] flex items-center justify-center">
              <FiTruck size={15} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">
                Track Order
              </h1>
              <p className="text-[11px] text-gray-400 leading-tight">
                Qalbi Couture
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 lg:py-12">
        {/* Hero text (before search) */}
        {!order && (
          <div className="text-center mb-8">
            <div className="inline-flex w-16 h-16 rounded-2xl bg-[#fdf3f3] border border-[#f5d5d5] items-center justify-center mb-4">
              <FiPackage size={28} className="text-[#da3f3f]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Where is my order?
            </h2>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              Enter your order number to get real-time updates on your Qalbi
              Couture order.
            </p>
          </div>
        )}

        {/* Search form */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Order Number *
                </label>
                <div className="relative">
                  <BsBoxSeam
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={orderNum}
                    onChange={(e) => setOrderNum(e.target.value.toUpperCase())}
                    placeholder="e.g. QC-00001"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-semibold focus:outline-none focus:border-[#da3f3f] focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                  Phone Number{" "}
                  <span className="text-gray-400 normal-case font-normal">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <FiPhone
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit number"
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#da3f3f] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                <FiAlertCircle size={16} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !orderNum.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#da3f3f] text-white font-semibold rounded-2xl hover:bg-[#c03535] transition-all shadow-md shadow-red-900/15 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiSearch size={15} />
              )}
              {loading ? "Searching..." : "Track My Order"}
            </button>
          </form>
        </div>

        {/* ── Order Result ── */}
        {order && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status card */}
            <div
              className={`rounded-3xl border-2 ${sc.border} ${sc.bg} p-5 sm:p-6`}
            >
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.color} ${sc.border}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse`}
                      />
                      {sc.label}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {order.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${sc.bg} border-2 ${sc.border}`}
                >
                  <sc.icon size={22} className={sc.color} />
                </div>
              </div>

              {/* Progress stepper */}
              {order.orderStatus !== "cancelled" && (
                <div className="relative">
                  {/* Progress bar */}
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#da3f3f] to-[#f87171] rounded-full transition-all duration-1000"
                      style={{
                        width: `${Math.max(0, ((currStep - 1) / 3) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-4 relative z-10">
                    {STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const done = currStep >= stepNum;
                      const active = currStep === stepNum;
                      const Icon = step.icon;
                      return (
                        <div
                          key={step.key}
                          className="flex flex-col items-center gap-2"
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              done
                                ? "bg-[#da3f3f] border-[#da3f3f] shadow-lg shadow-red-900/20"
                                : "bg-white border-gray-200"
                            } ${active ? "scale-110 ring-4 ring-red-100" : ""}`}
                          >
                            <Icon
                              size={13}
                              className={done ? "text-white" : "text-gray-300"}
                            />
                          </div>
                          <span
                            className={`text-[10px] font-semibold text-center leading-tight ${
                              done ? "text-gray-800" : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {order.orderStatus === "cancelled" && (
                <div className="flex items-center gap-2 p-3 bg-red-100 rounded-xl text-sm text-red-700 font-medium">
                  <FiAlertCircle size={15} />
                  This order has been cancelled.
                </div>
              )}
            </div>

            {/* Delhivery tracking */}
            {order.delhiveryWaybill && (
              <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center flex-shrink-0">
                    <FiTruck size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">
                      Shipment Tracking
                    </p>
                    <p className="text-xs text-gray-500">
                      Shipped via Delhivery
                    </p>
                  </div>
                  <MdVerified size={18} className="ml-auto text-purple-500" />
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 flex items-center justify-between mb-3">
                  <div>
                    <p className="text-[10px] text-purple-500 uppercase tracking-wider font-semibold">
                      Waybill Number
                    </p>
                    <p className="font-mono font-bold text-purple-900 text-base tracking-wide mt-0.5">
                      {order.delhiveryWaybill}
                    </p>
                  </div>
                </div>
                <a
                  href={`https://www.delhivery.com/track/package/${order.delhiveryWaybill}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-purple-200 text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-all text-sm"
                >
                  <FiExternalLink size={14} /> Track on Delhivery website
                </a>
              </div>
            )}

            {/* Delivery address */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <FiMapPin size={15} className="text-[#da3f3f]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Delivery Address
                </h3>
              </div>
              <div className="bg-gray-50 rounded-xl p-3.5 text-sm leading-relaxed">
                <p className="font-semibold text-gray-900">
                  {order.customer.name}
                </p>
                <p className="text-gray-500 text-xs mt-0.5">
                  {order.customer.phone}
                </p>
                <p className="text-gray-600 mt-1.5 text-xs">
                  {order.shippingAddress?.line1}
                  {order.shippingAddress?.line2
                    ? `, ${order.shippingAddress.line2}`
                    : ""}
                  <br />
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
                  — {order.shippingAddress?.pincode}
                </p>
              </div>
            </div>

            {/* Order items (collapsible) */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowItems(!showItems)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FiShoppingBag size={15} className="text-[#da3f3f]" />
                  <span className="text-sm font-bold text-gray-900">
                    Order Items ({order.items?.length || 0})
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{order.total?.toLocaleString("en-IN")}
                  </span>
                  {showItems ? (
                    <FiChevronUp size={16} className="text-gray-400" />
                  ) : (
                    <FiChevronDown size={16} className="text-gray-400" />
                  )}
                </div>
              </button>

              {showItems && (
                <div className="border-t border-gray-100">
                  <div className="divide-y divide-gray-50">
                    {(order.items || []).map((item, i) => (
                      <div key={i} className="flex gap-3.5 p-4">
                        <div className="relative w-14 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              sizes="56px"
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
                  <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-100 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Subtotal</span>
                      <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Shipping</span>
                      <span
                        className={
                          order.shippingCharge === 0
                            ? "text-green-600 font-semibold"
                            : ""
                        }
                      >
                        {order.shippingCharge === 0
                          ? "FREE"
                          : `₹${order.shippingCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-900 pt-1 border-t border-gray-200">
                      <span>Total Paid</span>
                      <span>₹{order.total?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            {order.timeline?.length > 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiClock size={15} className="text-[#da3f3f]" /> Order
                  Timeline
                </h3>
                <div className="space-y-0">
                  {[...order.timeline].reverse().map((event, i, arr) => (
                    <div key={i} className="flex gap-3.5">
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                            i === 0
                              ? "bg-[#da3f3f] border-[#da3f3f]"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          {i === 0 ? (
                            <FiCheckCircle size={13} className="text-white" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-gray-300" />
                          )}
                        </div>
                        {i < arr.length - 1 && (
                          <div className="w-0.5 h-6 bg-gray-100 mt-0.5" />
                        )}
                      </div>
                      <div className="pb-4 flex-1 min-w-0">
                        <p
                          className={`text-sm font-semibold capitalize ${i === 0 ? "text-[#da3f3f]" : "text-gray-600"}`}
                        >
                          {event.status === "note" ? "Note" : event.status}
                        </p>
                        {event.note && (
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                            {event.note}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(event.timestamp).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Back to search / shop */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setOrder(null);
                  setSearched(false);
                  setOrderNum("");
                  setPhone("");
                }}
                className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-2xl hover:border-gray-300 transition-all text-sm text-center"
              >
                Track Another Order
              </button>
              <Link
                href="/shop"
                className="flex-1 py-3 bg-[#da3f3f] text-white font-semibold rounded-2xl hover:bg-[#c03535] transition-all text-sm text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}

        {/* Help text */}
        {!order && !loading && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Order number was sent to your email after placing the order.{" "}
            <Link
              href="mailto:hello@qalbicouture.com"
              className="text-[#da3f3f] hover:underline"
            >
              Need help?
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf6f1] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#da3f3f] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <TrackContent />
    </Suspense>
  );
}
