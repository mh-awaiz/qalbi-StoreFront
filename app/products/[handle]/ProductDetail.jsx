"use client";
import { useState, useMemo } from "react";
import { useEffect } from "react";
import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

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
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import {
  FiMail,
  FiPhone,
  FiClock,
  FiGift,
  FiCreditCard,
  FiTag,
} from "react-icons/fi";

function seededRandom(seed) {
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
  const seed =
    [...str].reduce(
      (acc, c, i) => acc ^ (c.charCodeAt(0) * (i + 7) * 2654435761),
      str.length * 1234567,
    ) || 987654;
  const rand = seededRandom(seed);
  rand();
  rand();
  rand();
  const steps = Math.floor(rand() * 16);
  const rating = (4.0 + steps * 0.1).toFixed(1);
  const reviews = Math.floor(10 + rand() * 110);
  return { rating: parseFloat(rating), reviews };
}

// Accordion item component
function AccordionItem({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-xs font-bold tracking-widest uppercase text-gray-700 group-hover:text-gray-900 transition-colors">
          {title}
        </span>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform duration-300 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "max-h-[600px] pb-4" : "max-h-0"}`}
      >
        <div className="text-sm text-gray-600 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

/**
 * Parses Shopify's descriptionHtml into structured sections.
 * Shopify formats descriptions with <p><strong>Section Title</strong></p> headers
 * followed by <ul> bullet lists or <p> paragraphs.
 *
 * Falls back gracefully to plain text if no HTML is available.
 */
function parseDescriptionHtml(html) {
  if (!html || typeof window === "undefined") return null;

  // Parse the HTML string into a DOM tree (client-side only)
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const sections = [];
  let currentSection = null;

  for (const node of body.childNodes) {
    if (node.nodeType !== 1) continue; // skip text nodes
    const tag = node.tagName.toLowerCase();

    if (tag === "p") {
      const strongEl = node.querySelector("strong");
      const text = node.textContent.trim();

      if (!text) continue;

      // Check if this <p> is a section header (only contains a <strong> tag)
      if (strongEl && strongEl.textContent.trim() === text) {
        // New section header
        currentSection = { title: text, items: [], note: null };
        sections.push(currentSection);
      } else {
        // Plain paragraph — treat as a note or body text
        if (currentSection) {
          currentSection.note = text;
        } else {
          // No current section yet — create an unnamed one
          currentSection = { title: null, items: [], note: text };
          sections.push(currentSection);
        }
      }
    } else if (tag === "ul" || tag === "ol") {
      const bullets = [...node.querySelectorAll("li")].map((li) =>
        li.textContent.trim(),
      );
      if (currentSection) {
        currentSection.items.push(...bullets);
      } else {
        currentSection = { title: null, items: bullets, note: null };
        sections.push(currentSection);
      }
    }
  }

  return sections.length > 0 ? sections : null;
}

/**
 * Renders the Shopify description HTML as structured sections
 * with section headers, bullet lists, and notes.
 * Falls back to plain-text paragraph rendering if HTML parsing fails.
 */
function DescriptionContent({ descriptionHtml, descriptionText }) {
  const sections = useMemo(
    () => (descriptionHtml ? parseDescriptionHtml(descriptionHtml) : null),
    [descriptionHtml],
  );

  if (sections && sections.length > 0) {
    // Separate the trailing note (untitled section with no bullets) from main sections
    const mainSections = sections.filter((s) => s.title || s.items.length > 0);
    const trailingNotes = sections.filter(
      (s) => !s.title && s.items.length === 0 && s.note,
    );

    return (
      <div className="space-y-5">
        {mainSections.map((section, i) => (
          <div key={i}>
            {section.title && (
              <p className="text-sm font-bold text-gray-900 mb-2">
                {section.title}
              </p>
            )}
            {section.items.length > 0 && (
              <ul className="space-y-1.5 ml-1">
                {section.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-2.5 text-sm text-gray-600"
                  >
                    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
            {/* Inline note within a section */}
            {section.note && (
              <p className="text-xs text-gray-400 mt-2">{section.note}</p>
            )}
          </div>
        ))}

        {/* Trailing note(s) — rendered small and muted, like the Shopify disclaimer */}
        {trailingNotes.length > 0 && (
          <div className="border-t border-gray-100 pt-3 space-y-1">
            {trailingNotes.map((n, i) => (
              <p key={i} className="text-xs text-gray-400 leading-relaxed">
                {n.note}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback: plain text
  // Fallback for plain text descriptions
  const text = descriptionText || "";

  if (!text.trim()) return null;

  // Detect common Shopify headings
  const headings = ["Product Details", "Size", "Material & Wash", "Note:-"];

  let formattedSections = [];
  let remainingText = text;

  headings.forEach((heading, index) => {
    const currentIndex = remainingText.indexOf(heading);

    if (currentIndex !== -1) {
      const nextHeading = headings
        .slice(index + 1)
        .map((h) => ({
          heading: h,
          index: remainingText.indexOf(h),
        }))
        .filter((h) => h.index !== -1)
        .sort((a, b) => a.index - b.index)[0];

      const content = nextHeading
        ? remainingText
            .substring(currentIndex + heading.length, nextHeading.index)
            .trim()
        : remainingText.substring(currentIndex + heading.length).trim();

      formattedSections.push({
        title: heading.replace(":-", ""),
        content,
      });
    }
  });

  return (
    <div className="space-y-5">
      {formattedSections.map((section, i) => (
        <div key={i}>
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            {section.title}
          </h4>

          {section.title === "Note" ? (
            <p className="text-xs text-gray-400 leading-relaxed">
              {section.content}
            </p>
          ) : (
            (() => {
              let items = [];

              // For Material & Wash
              if (section.title === "Material & Wash") {
                items = section.content
                  .split(
                    /(?=Dry Wash|Hand Wash|Machine Wash|Cotton|Silk|Linen|Muslin|Blend)/i,
                  )
                  .filter((item) => item.trim());
              }

              // For Size
              else if (section.title === "Size") {
                items = section.content
                  .split(/(?=One Size|XS|S|M|L|XL|XXL|XXXL)/i)
                  .filter((item) => item.trim());
              }

              // For Product Details
              else {
                items = section.content
                  .split(". ")
                  .filter((item) => item.trim());
              }

              return (
                <ul className="space-y-2 ml-1">
                  {items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed"
                    >
                      <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />

                      <span>
                        {item.trim()}
                        {!item.trim().endsWith(".") &&
                        section.title === "Product Details"
                          ? "."
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              );
            })()
          )}
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail({ product, related }) {
  const { addItem } = useCart();

  const [imgIdx, setImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Move images here first
  const images = product.images || [];

  useEffect(() => {
    if (!images?.length) return;

    images.forEach((img, index) => {
      if (index === 0) return;

      const preloadImg = new window.Image();

      // preload optimized Shopify image size
      preloadImg.src = `${img}&width=1200`;
    });
  }, [images]);

  const { rating, reviews } = useMemo(
    () => getProductStats(product.id || product.handle),
    [product.id, product.handle],
  );

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
    const variant =
      product.variants?.find(
        (v) => v.size === selectedSize || v.title === selectedSize,
      ) || product.variants?.[0];
    addItem({
      id: product.id,
      variantId: variant?.id || product.id,
      productId: product.id,
      title: product.title,
      price: variant?.price || product.price,
      image: images[0] || "",
      slug: product.slug || product.handle || "",
      size: selectedSize || variant?.size || null,
    });
    setTimeout(() => setAdding(false), 1800);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const prevImg = () =>
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIdx((i) => (i + 1) % images.length);

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
                href={`/collections/${product.collections?.[0] || "all"}`}
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
          {/* ── Images — 5:7 aspect ratio ── */}
          <div className="space-y-3">
            {/* Mobile Swiper */}
            <div className="block md:hidden">
              {images.length > 0 ? (
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: true }}
                  spaceBetween={10}
                  slidesPerView={1}
                  onSlideChange={(swiper) => setImgIdx(swiper.activeIndex)}
                  className="rounded-2xl overflow-hidden"
                >
                  {images.map((img, i) => (
                    <SwiperSlide key={i}>
                      <div
                        className="relative bg-gray-100"
                        style={{ aspectRatio: "5/7" }}
                      >
                        <Image
                          src={`${img}&width=1000`}
                          alt={`${product.title}-${i}`}
                          fill
                          priority={i === 0}
                          quality={80}
                          sizes="100vw"
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div
                  className="w-full flex items-center justify-center text-gray-300 text-5xl bg-gray-100 rounded-2xl"
                  style={{ aspectRatio: "5/7" }}
                >
                  👗
                </div>
              )}
            </div>

            {/* Desktop Image Viewer */}
            <div
              className="hidden md:block relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gray-100 group"
              style={{ aspectRatio: "5/7" }}
            >
              {images.length > 0 ? (
                <Image
                  src={`${images[imgIdx]}&width=1200`}
                  alt={product.title}
                  fill
                  priority={imgIdx === 0}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL={images[imgIdx]}
                  className="object-cover transition-opacity duration-300"
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button
                    onClick={nextImg}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}

              {discount && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="px-2.5 py-1 bg-[var(--secondary)] text-white text-[11px] font-bold rounded-full shadow-sm">
                    -{discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                      i === imgIdx
                        ? "border-[var(--secondary)] shadow-sm"
                        : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                    style={{ aspectRatio: "5/7" }}
                  >
                    <Image
                      src={`${img}&width=250`}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            {/* Category + Share */}
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase">
                {product.category}
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

            {/* Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900 leading-tight mb-3"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(fullStars)].map((_, i) => (
                  <Star
                    key={`f-${i}`}
                    size={13}
                    className="fill-amber-400 text-amber-400"
                  />
                ))}
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
                {[...Array(emptyStars)].map((_, i) => (
                  <Star
                    key={`e-${i}`}
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
            <div className="grid grid-cols-3 gap-2 mb-6">
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
                  sub: "via Shopify",
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

            {/* ── Accordion tabs ── */}
            <div className="border-t border-gray-200">
              <AccordionItem title="Details" defaultOpen={true}>
                <DescriptionContent
                  descriptionHtml={product.descriptionHtml}
                  descriptionText={product.description}
                />
              </AccordionItem>

              <AccordionItem title="Offers">
                <div className="space-y-3">
                  {[
                    {
                      icon: (
                        <FiGift
                          size={14}
                          className="text-[var(--secondary)] flex-shrink-0 mt-0.5"
                        />
                      ),
                      text: "Free shipping on orders above ₹999",
                    },
                    {
                      icon: (
                        <FiCreditCard
                          size={14}
                          className="text-[var(--secondary)] flex-shrink-0 mt-0.5"
                        />
                      ),
                      text: "No extra charges — pay securely via Shopify",
                    },
                    {
                      icon: (
                        <FiTag
                          size={14}
                          className="text-[var(--secondary)] flex-shrink-0 mt-0.5"
                        />
                      ),
                      text: "Exclusive deals for returning customers",
                    },
                  ].map((o) => (
                    <div key={o.text} className="flex items-start gap-2.5">
                      {o.icon}
                      <span>{o.text}</span>
                    </div>
                  ))}
                </div>
              </AccordionItem>

              <AccordionItem title="Return Policy">
                <div className="space-y-2">
                  <p>7-day exchange policy from the date of delivery.</p>
                  <p>
                    Item must be unused, unwashed, and in original packaging
                    with tags intact.
                  </p>
                  <p>No direct refunds — store credit or exchange only.</p>
                  <p>Sale items are not eligible for exchange.</p>
                </div>
              </AccordionItem>

              <AccordionItem title="Support">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <FiMail
                      size={14}
                      className="text-[var(--secondary)] flex-shrink-0"
                    />
                    <span>
                      <strong>Email:</strong> info@qalbicouture.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiPhone
                      size={14}
                      className="text-[var(--secondary)] flex-shrink-0"
                    />
                    <span>
                      <strong>WhatsApp:</strong> +91 81304 21960
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiClock
                      size={14}
                      className="text-[var(--secondary)] flex-shrink-0"
                    />
                    <span>
                      <strong>Hours:</strong> Mon–Sat, 10am – 7pm IST
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 pt-1 pl-0.5">
                    We typically respond within 24 hours.
                  </p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* ── You May Also Like ── */}
        {related && related.length > 0 && (
          <div className="mt-20 sm:mt-24">
            <div className="flex items-end justify-between mb-8 sm:mb-10">
              <div>
                <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-1">
                  Handpicked For You
                </p>
                <h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-900"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  You May Also Like
                </h2>
              </div>
              <Link
                href={`/collections/${product.collections?.[0] || "all"}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--secondary)] border border-[var(--secondary)] px-4 py-2 rounded-xl hover:bg-[var(--secondary)] hover:text-white transition-all"
              >
                View Collection →
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => {
                const relDiscount =
                  p.compareAtPrice && p.compareAtPrice > p.price
                    ? Math.round(
                        ((p.compareAtPrice - p.price) / p.compareAtPrice) * 100,
                      )
                    : null;

                return (
                  <Link
                    href={`/products/${p.handle || p.slug}`}
                    key={p.id || p.handle}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-300"
                  >
                    <div
                      className="relative overflow-hidden bg-gray-100"
                      style={{ aspectRatio: "5/7" }}
                    >
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt={p.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-200 text-4xl">
                          👗
                        </div>
                      )}
                      {relDiscount && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="px-2 py-0.5 bg-[var(--secondary)] text-white text-[10px] font-bold rounded-full shadow-sm">
                            -{relDiscount}%
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-10" />
                      <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="bg-white/95 backdrop-blur-sm py-2.5 text-center text-xs font-semibold text-gray-900 flex items-center justify-center gap-1.5">
                          <ShoppingBag size={12} />
                          Quick View
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-3.5">
                      {p.category && (
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5 font-medium truncate">
                          {p.category}
                        </p>
                      )}
                      <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-snug group-hover:text-[var(--secondary)] transition-colors mb-2">
                        {p.title}
                      </p>
                      <div className="flex items-center justify-between gap-1">
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-[var(--secondary)]">
                            ₹{Number(p.price).toLocaleString("en-IN")}
                          </span>
                          {p.compareAtPrice && p.compareAtPrice > p.price && (
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹
                              {Number(p.compareAtPrice).toLocaleString("en-IN")}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-0.5 flex-shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={9}
                              className={
                                i < 4
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-gray-200 text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Link
                href={`/collections/${product.collections?.[0] || "all"}`}
                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--secondary)] text-[var(--secondary)] text-sm font-semibold rounded-xl hover:bg-[var(--secondary)] hover:text-white transition-all"
              >
                View Full Collection
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
