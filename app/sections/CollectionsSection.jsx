"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { MdDiamond } from "react-icons/md";

// const FALLBACK_COLLECTIONS = [
//   {
//     name: "Dress Materials",
//     description: "Chiffon, Georgette, Silk & more",
//     handle: "dress-material",
//     image:
//       "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Front2.jpg?v=1762569597",
//     video:
//       "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778876814/Suit_Sets_qpat9k.mp4",
//   },
//   {
//     name: "Chikankari",
//     description: "Elegant embroidered kameez sets",
//     handle: "chikankari-kurti",
//     image:
//       "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/IMG_2644.jpg?v=1746646118",
//     video:
//       "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778876895/CHIKANKARI_rzl3bz.mp4",
//   },
//   {
//     name: "Cotten Worid",
//     description: "Printed organza & cotton silk",
//     handle: "premium-collection",
//     image:
//       "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Daman.jpg?v=1747405900",
//     video:
//       "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778877239/cotten_k94pig.mp4",
//   },
// ];

const FALLBACK_COLLECTIONS = [
  {
    name: "Dress Materials",
    description: "Chiffon, Georgette, Silk & more",
    handle: "dress-material",
    image:
      "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Front2.jpg?v=1762569597",
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/q_auto,f_auto,vc_auto,w_720/v1778876814/Suit_Sets_qpat9k.mp4",
  },
  {
    name: "Chikankari",
    description: "Elegant embroidered kameez sets",
    handle: "chikankari-kurti",
    image:
      "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/IMG_2644.jpg?v=1746646118",
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/q_auto,f_auto,vc_auto,w_720/v1778876895/CHIKANKARI_rzl3bz.mp4",
  },
  {
    name: "Cotten Worid",
    description: "Printed organza & cotton silk",
    handle: "premium-collection",
    image:
      "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Daman.jpg?v=1747405900",
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/q_auto,f_auto,vc_auto,w_720/v1778877239/cotten_k94pig.mp4",
  },
];

const features = [
  {
    icon: <FiTruck size={19} className="text-[var(--secondary)]" />,
    title: "Free Shipping",
    desc: "On all orders above ₹999",
  },
  {
    icon: <MdDiamond size={19} className="text-[var(--secondary)]" />,
    title: "Premium Quality",
    desc: "Handpicked fabrics & embroidery",
  },
  {
    icon: <FiRefreshCw size={19} className="text-[var(--secondary)]" />,
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns",
  },
  {
    icon: <FiShield size={19} className="text-[var(--secondary)]" />,
    title: "Secure Payments",
    desc: "Razorpay — UPI, Cards, Net Banking",
  },
];

function CollectionCard({ col, idx, layout }) {
  const [hovering, setHovering] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile || !col.video) return;

    const timer = setTimeout(() => {
      setShowVideo(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMobile, col.video]);

  const handleMouseEnter = () => {
    if (isMobile) return;

    setHovering(true);
    setShowVideo(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;

    setHovering(false);
    setShowVideo(false);

    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  // layout: "tall" = left big card, "short" = right stacked cards
  const isTall = layout === "tall";

  return (
    <Link
      href={`/collections/${col.handle}`}
      className="group relative overflow-hidden block w-full h-full"
      style={{ borderRadius: "20px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster image */}
      {col.image && (
        <Image
          src={col.image}
          alt={col.name}
          fill
          priority={idx === 0}
          sizes="(max-width: 640px) 100vw, 50vw"
          className={`absolute inset-0 object-cover transition-all duration-700 ${
            showVideo ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />
      )}

      {/* Video */}
      {col.video && (
        <video
          ref={videoRef}
          src={col.video}
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          style={{
            opacity: showVideo ? 1 : 0,
          }}
        />
      )}

      {/* Dark gradient — stronger at bottom */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: hovering
            ? "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        }}
      />

      {/* Index number watermark */}
      <div
        className="absolute top-5 left-6 transition-opacity duration-300"
        style={{
          fontFamily: "var(--font-cormorant)",
          fontSize: isTall ? "5rem" : "3.5rem",
          fontWeight: 700,
          lineHeight: 1,
          color: "rgba(255,255,255,0.06)",
          userSelect: "none",
        }}
      >
        0{idx + 1}
      </div>

      {/* Live preview badge */}
      <div
        className="absolute top-4 right-4 flex items-center gap-1.5 backdrop-blur-sm px-2.5 py-1 rounded-full transition-all duration-300"
        style={{
          background: "rgba(0,0,0,0.35)",
          opacity: hovering ? 1 : 0,
          transform: hovering ? "translateY(0)" : "translateY(-6px)",
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-[10px] text-white/80 font-medium tracking-wide">
          Live Preview
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
        {/* Category label */}
        <p
          className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2 transition-colors duration-300"
          style={{
            color: hovering ? "var(--secondary)" : "rgba(255,255,255,0.5)",
          }}
        >
          Collection
        </p>

        {/* Title */}
        <h3
          className="text-white leading-tight mb-2 transition-all duration-300"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: isTall
              ? "clamp(2rem, 3.5vw, 3rem)"
              : "clamp(1.6rem, 2.5vw, 2.2rem)",
            fontWeight: 600,
            transform: hovering ? "translateY(-4px)" : "translateY(0)",
          }}
        >
          {col.name}
        </h3>

        {col.description && (
          <p
            className="text-sm leading-relaxed mb-5 transition-all duration-300"
            style={{
              color: "rgba(255,255,255,0.65)",
              maxWidth: "26ch",
              opacity: hovering ? 1 : 0.7,
            }}
          >
            {col.description}
          </p>
        )}

        {/* CTA button */}
        <div className="flex items-center gap-3">
          <span
            className="inline-flex items-center gap-2 font-semibold text-sm rounded-full transition-all duration-300"
            style={{
              background: hovering
                ? "var(--secondary)"
                : "rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              border: hovering
                ? "1.5px solid var(--secondary)"
                : "1.5px solid rgba(255,255,255,0.25)",
              color: "#fff",
              padding: "10px 20px",
              transform: hovering ? "translateY(-2px)" : "translateY(0)",
              boxShadow: hovering ? "0 8px 24px rgba(218,63,63,0.35)" : "none",
            }}
          >
            Explore Now
            <FiArrowRight
              size={13}
              style={{
                transform: hovering ? "translateX(3px)" : "translateX(0)",
                transition: "transform 0.3s ease",
              }}
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function CollectionsSection() {
  const categories = FALLBACK_COLLECTIONS;

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.collections.length > 0)
          setCategories(d.collections.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  const displayCollections = categories
    ? categories.map((cat, i) => ({
        ...cat,

        // force custom collection route
        handle: FALLBACK_COLLECTIONS[i]?.handle || cat.handle,

        // force custom title
        name: FALLBACK_COLLECTIONS[i]?.name || cat.name,

        // force custom description
        description:
          FALLBACK_COLLECTIONS[i]?.description || cat.description || "",

        // force custom media
        image: FALLBACK_COLLECTIONS[i]?.image || cat.image || null,
        video: FALLBACK_COLLECTIONS[i]?.video || null,
      }))
    : FALLBACK_COLLECTIONS;

  return (
    <>
      {/* ── Feature strip ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="flex items-center gap-2.5 sm:gap-3 py-1"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                    {f.title}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ── */}
      <section className="w-full px-3 sm:px-6 py-12 sm:py-20">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-2">
              Our Collections
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1.5">
              Hover to preview
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>

        {/* ── DESKTOP: Bento grid layout ── */}
        <div
          className="hidden sm:grid max-w-7xl mx-auto gap-4"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "360px 360px",
          }}
        >
          {/* Card 1 — spans full left column, both rows (tall) */}
          <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
            {displayCollections[0] && (
              <CollectionCard
                col={displayCollections[0]}
                idx={0}
                layout="tall"
              />
            )}
          </div>

          {/* Card 2 — top right */}
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            {displayCollections[1] && (
              <CollectionCard
                col={displayCollections[1]}
                idx={1}
                layout="short"
              />
            )}
          </div>

          {/* Card 3 — bottom right */}
          <div style={{ gridColumn: "2", gridRow: "2" }}>
            {displayCollections[2] && (
              <CollectionCard
                col={displayCollections[2]}
                idx={2}
                layout="short"
              />
            )}
          </div>
        </div>

        {/* ── MOBILE: Full-width stacked cards ── */}
        <div className="sm:hidden flex flex-col gap-4">
          {displayCollections.map((col, i) => (
            <div key={col.handle || col.name} style={{ height: "280px" }}>
              <CollectionCard col={col} idx={i} layout="short" />
            </div>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="sm:hidden text-center mt-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4"
          >
            View All Collections <FiArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}
