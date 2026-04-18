"use client";
import { useState, useMemo } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  RefreshCw,
  Shield,
  Plus,
  Minus,
  Share2,
  Check,
} from "lucide-react";
import Image from "next/image";

// Seeded random — same product always gets same rating/review count
function seededRandom(seed) {
  // Xorshift — much better distribution than LCG for similar seeds
  let s = seed >>> 0 || 123456789;
  return () => {
    s ^= s << 13;
    s ^= s >> 17;
    s ^= s << 5;
    return (s >>> 0) / 0xffffffff;
  };
}

function getProductStats(productId = "") {
  const str = String(productId);
  // Mix character codes + positions to get a well-spread seed
  const seed =
    [...str].reduce(
      (acc, c, i) => acc ^ (c.charCodeAt(0) * (i + 7) * 2654435761),
      str.length * 1234567,
    ) || 987654;
  const rand = seededRandom(seed);

  // Burn a few calls so the first value isn't always similar
  rand();
  rand();
  rand();

  // Rating: 3.0 – 4.5, steps of 0.1
  const steps = Math.floor(rand() * 16); // 0–15  →  3.0, 3.1 … 4.5
  const rating = (4.0 + steps * 0.1).toFixed(1);

  // Review count: 10 – 120
  const reviews = Math.floor(10 + rand() * 110);

  return { rating: parseFloat(rating), reviews };
}

export default function ProductDetail({ product, related }) {
  const { addItem } = useCart();

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [tab, setTab] = useState("description");
  const [copied, setCopied] = useState(false);

  // Stable per-product rating & review count
  const { rating, reviews } = useMemo(
    () => getProductStats(product._id),
    [product._id],
  );

  const images = product.images || [];
  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100,
      )
    : null;

  const selectedVariant = product.variants?.find(
    (v) => v.size === selectedSize,
  );
  const inStock = selectedVariant
    ? selectedVariant.stock > 0
    : product.variants?.some((v) => v.stock > 0);
  const lowStock =
    selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 3;

  const handleAddToCart = () => {
    const needsSize = product.variants?.length > 1;
    if (needsSize && !selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      document
        .getElementById("size-selector")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setAdding(true);
    addItem({
      id: product._id,
      productId: product._id,
      title: product.title,
      price: product.price,
      image: images[0] || "",
      slug: product.slug || "",
      size: selectedSize || product.variants?.[0]?.size || null,
    });
    setTimeout(() => setAdding(false), 1800);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const prevImg = () =>
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

  const descLines = (product.description || "").split(/\n+/).filter(Boolean);

  // How many full/half/empty stars to show
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 text-xs text-gray-400 overflow-x-auto no-scrollbar whitespace-nowrap">
          <Link
            href="/"
            className="hover:text-[var(--secondary)] transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/shop"
            className="hover:text-[var(--secondary)] transition-colors"
          >
            Shop
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link
                href={`/collections/${product.collections?.[0] || "dress-materials"}`}
                className="hover:text-[var(--secondary)] transition-colors"
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-600 truncate max-w-[160px] sm:max-w-none">
            {product.title}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* ── Images ─────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100 group">
              {images.length > 0 ? (
                <img
                  src={images[imgIdx]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-5xl">
                  👗
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImg}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {discount && (
                  <span className="px-2.5 py-1 bg-[var(--secondary)] text-white text-[11px] font-bold rounded-full shadow-sm">
                    -{discount}% OFF
                  </span>
                )}
                {product.isFeatured && (
                  <span className="px-2.5 py-1 bg-[#1a1a1a] text-white text-[11px] font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/40 text-white text-[10px] font-medium rounded-full backdrop-blur-sm">
                  {imgIdx + 1}/{images.length}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx
                        ? "border-[var(--secondary)] shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ────────────────────────── */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase">
                {product.category}
                {product.fabric && ` · ${product.fabric}`}
              </p>
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[var(--secondary)] transition-colors"
              >
                {copied ? (
                  <Check size={13} className="text-green-500" />
                ) : (
                  <Share2 size={13} />
                )}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight mb-3"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {product.title}
            </h1>

            {/* ── Dynamic Rating ── */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                  <Star
                    key={`full-${i}`}
                    size={13}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
                {/* Half star */}
                {hasHalf && (
                  <span className="relative inline-block w-[13px] h-[13px]">
                    <Star
                      size={13}
                      className="fill-gray-200 text-gray-200 absolute inset-0"
                    />
                    <span className="absolute inset-0 overflow-hidden w-[50%]">
                      <Star
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                    </span>
                  </span>
                )}
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                  <Star
                    key={`empty-${i}`}
                    size={13}
                    className="fill-gray-200 text-gray-200"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {rating}
              </span>
              <span className="text-sm text-gray-400">({reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-bold text-[var(--secondary)]">
                ₹{product.price?.toLocaleString("en-IN")}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.compareAtPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discount && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">
                  Save ₹
                  {(product.compareAtPrice - product.price).toLocaleString(
                    "en-IN",
                  )}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mb-5">
              {inStock ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    {lowStock
                      ? `Only ${selectedVariant?.stock} left!`
                      : "In Stock"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="text-xs font-medium text-red-500">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Size selector */}
            {product.variants && product.variants.length > 0 && (
              <div id="size-selector" className="mb-5">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-sm font-semibold text-gray-900">
                    {product.variants.length === 1
                      ? "Availability"
                      : "Select Size"}
                  </span>
                  {product.variants.length > 1 && (
                    <button className="text-xs text-[var(--secondary)] underline underline-offset-2 hover:no-underline">
                      Size Guide
                    </button>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v) => (
                    <button
                      key={v.size}
                      onClick={() => {
                        setSelectedSize(v.size);
                        setSizeError(false);
                      }}
                      disabled={v.stock === 0}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all min-w-[50px] ${
                        selectedSize === v.size
                          ? "border-[var(--secondary)] bg-[var(--secondary)] text-white shadow-sm"
                          : v.stock === 0
                            ? "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                            : "border-gray-200 text-gray-700 hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
                      }`}
                    >
                      {v.size}
                      {v.stock <= 3 && v.stock > 0 && (
                        <span className="block text-[9px] leading-none mt-0.5 text-amber-500">
                          {v.stock} left
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {sizeError && (
                  <p className="text-xs text-[var(--secondary)] mt-2 font-medium animate-fadeIn">
                    Please select a size before adding to bag
                  </p>
                )}
              </div>
            )}

            {/* Qty + Add to cart */}
            <div className="flex gap-3 mb-5">
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2 flex-shrink-0">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-11 flex items-center justify-center text-gray-500 hover:text-[var(--secondary)] transition-colors"
                >
                  <Minus size={13} />
                </button>
                <span className="w-8 text-center text-sm font-semibold select-none">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-11 flex items-center justify-center text-gray-500 hover:text-[var(--secondary)] transition-colors"
                >
                  <Plus size={13} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  !inStock
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : adding
                      ? "bg-green-500 text-white shadow-lg shadow-green-100"
                      : "bg-[var(--secondary)] text-white hover:bg-[#c03535] shadow-lg shadow-red-100 hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                <ShoppingBag size={16} />
                {!inStock
                  ? "Out of Stock"
                  : adding
                    ? "Added to Bag ✓"
                    : "Add to Bag"}
              </button>

              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="w-12 h-12 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-[var(--secondary)] transition-colors flex-shrink-0"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={18}
                  className={
                    wishlisted
                      ? "fill-[var(--secondary)] text-[var(--secondary)]"
                      : "text-gray-400"
                  }
                />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                {
                  icon: <Truck size={15} />,
                  label: "Free Shipping",
                  sub: "on ₹999+",
                },
                {
                  icon: <RefreshCw size={15} />,
                  label: "7-Day Exchange",
                  sub: "Easy process",
                },
                {
                  icon: <Shield size={15} />,
                  label: "Secure Pay",
                  sub: "via Razorpay",
                },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center text-center p-2.5 bg-gray-50 rounded-xl gap-1"
                >
                  <span className="text-[var(--secondary)]">{b.icon}</span>
                  <span className="text-[10px] font-semibold text-gray-900 leading-tight">
                    {b.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{b.sub}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100 pt-4 flex-1">
              <div className="flex gap-5 border-b border-gray-100 mb-4 overflow-x-auto no-scrollbar">
                {["description", "details", "shipping"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`pb-2.5 text-xs font-semibold capitalize border-b-2 transition-all -mb-px whitespace-nowrap ${
                      tab === t
                        ? "border-[var(--secondary)] text-[var(--secondary)]"
                        : "border-transparent text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {tab === "description" && (
                <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                  {descLines.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              )}

              {tab === "details" && (
                <div className="space-y-0">
                  {[
                    ["Category", product.category],
                    ["Fabric", product.fabric || "—"],
                    ["Wash Care", product.washCare || "Dry Wash Only"],
                    [
                      "Includes",
                      "Kurta (2.5m) · Bottom (2.5m) · Dupatta (2.25m)",
                    ],
                    ["Dispatch", "Ships within 2–3 business days"],
                    ["Availability", inStock ? "In Stock" : "Out of Stock"],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between py-2.5 border-b border-gray-50 text-sm"
                    >
                      <span className="text-gray-400 font-medium">{k}</span>
                      <span className="text-gray-700 text-right max-w-[60%]">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {tab === "shipping" && (
                <div className="text-sm text-gray-600 space-y-3 leading-relaxed">
                  <p>
                    <strong>Standard Delivery:</strong> 4–7 business days · ₹99
                  </p>
                  <p>
                    <strong>Free Shipping:</strong> On all orders above ₹999
                  </p>
                  <p>
                    <strong>Tracked Shipping:</strong> via Delhivery. Tracking
                    link sent to your email after dispatch.
                  </p>
                  <p>
                    <strong>Exchange:</strong> 7 days from delivery. Item must
                    be unused, unwashed, and in original packaging. No direct
                    refunds.
                  </p>
                  <p>
                    <strong>Questions?</strong> Email us at
                    info@qalbicouture.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Products ─────────────────────── */}
        {related && related.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <div className="flex items-end justify-between mb-6 sm:mb-8">
              <h2
                className="text-2xl sm:text-3xl font-semibold text-gray-900"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                You May Also Like
              </h2>
              <Link
                href={`/collections/${product.collections?.[0] || "dress-materials"}`}
                className="text-xs text-[var(--secondary)] font-medium hover:underline underline-offset-2 hidden sm:block"
              >
                View collection →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {related.map((p) => (
                <Link
                  href={`/products/${p.slug}`}
                  key={p._id}
                  className="product-card group bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-gray-100 img-zoom">
                    <img
                      src={p.images?.[0]}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-gray-400 mb-0.5 font-medium">
                      {p.category}
                    </p>
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-[var(--secondary)] transition-colors text-xs sm:text-sm">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <p className="text-sm font-bold text-[var(--secondary)]">
                        ₹{p.price?.toLocaleString("en-IN")}
                      </p>
                      {p.compareAtPrice && (
                        <p className="text-xs text-gray-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
