"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { MdDiamond } from "react-icons/md";

// ─── Data ────────────────────────────────────────────────────────────────────

const COLLECTIONS = [
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
    name: "Cotton World",
    description: "Printed organza & cotton silk",
    handle: "premium-collection",
    image:
      "https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Daman.jpg?v=1747405900",
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/q_auto,f_auto,vc_auto,w_720/v1778877239/cotten_k94pig.mp4",
  },
];

const FEATURES = [
  {
    icon: <FiTruck size={18} className="text-[var(--secondary)]" />,
    title: "Free Shipping",
    desc: "On orders above ₹999",
  },
  {
    icon: <MdDiamond size={18} className="text-[var(--secondary)]" />,
    title: "Premium Quality",
    desc: "Handpicked fabrics & embroidery",
  },
  {
    icon: <FiRefreshCw size={18} className="text-[var(--secondary)]" />,
    title: "Easy Returns",
    desc: "Hassle-free 7-day returns",
  },
  {
    icon: <FiShield size={18} className="text-[var(--secondary)]" />,
    title: "Secure Payments",
    desc: "UPI, Cards, Net Banking",
  },
];

// ─── Derive a mobile-optimised video URL from the Cloudinary URL ─────────────
// Swaps in w_400,q_40 so mobile gets a much smaller file (~3–4× smaller).
function mobileVideoUrl(url) {
  return url.replace(
    "/upload/",
    "/upload/q_40,f_auto,vc_auto,w_400,br_300k/",
  );
}

// ─── Collection Card ──────────────────────────────────────────────────────────
// Mobile : video plays immediately (no hover needed), image hidden behind it.
// Desktop: image shown first → video crossfades in on hover.

function CollectionCard({ col, idx, tall = false }) {
  const [isMobile, setIsMobile] = useState(false);
  const [videoActive, setVideoActive] = useState(false);
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef(null);
  const cardRef = useRef(null);

  // Detect mobile once on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
  }, []);

  // ── Mobile: start playing as soon as the component mounts ──
  // src is set immediately so the browser begins buffering right away.
  // IntersectionObserver only pauses/resumes to save battery when off-screen.
  useEffect(() => {
    if (!isMobile) return;
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!videoRef.current) return;
        if (entry.isIntersecting) {
          videoRef.current.play().catch(() => {});
          setVideoActive(true);
        } else {
          videoRef.current.pause();
          setVideoActive(false);
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [isMobile]);

  // ── Desktop: hover handlers ──
  const handleMouseEnter = useCallback(() => {
    if (isMobile) return;
    setHovering(true);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setVideoActive(true);
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    setHovering(false);
    setVideoActive(false);
    if (videoRef.current) videoRef.current.pause();
  }, [isMobile]);

  const handleVideoCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
      setVideoActive(true);
    }
  }, []);

  return (
    <Link
      ref={cardRef}
      href={`/collections/${col.handle}`}
      className="group relative flex w-full h-full overflow-hidden rounded-2xl block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Base image — desktop only; hidden on mobile (video takes over) ── */}
      <Image
        src={col.image}
        alt={col.name}
        fill
        priority={idx === 0}
        sizes={
          idx === 0
            ? "(max-width: 640px) 100vw, 50vw"
            : "(max-width: 640px) 100vw, 25vw"
        }
        className={`hidden sm:block object-cover transition-all duration-500 ${
          videoActive
            ? "opacity-0 scale-[1.03]"
            : "opacity-100 scale-100 group-hover:scale-[1.03]"
        }`}
      />

      {/* ── Video ──
           Mobile : compressed src set immediately so buffering starts at paint.
           Desktop: full-quality src; plays on hover only.
      ── */}
      <video
        ref={videoRef}
        src={isMobile ? mobileVideoUrl(col.video) : col.video}
        muted
        loop
        playsInline
        // "auto" on mobile tells the browser to start buffering immediately.
        // Desktop keeps "none" so the file isn't fetched until hover.
        preload={isMobile ? "auto" : "none"}
        onCanPlayThrough={handleVideoCanPlay}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          videoActive ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0 transition-opacity duration-400"
        style={{
          background: hovering
            ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)"
            : "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
        }}
      />

      {/* ── Live badge (desktop hover) ── */}
      <div
        className={`hidden sm:flex absolute top-4 right-4 items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-sm transition-all duration-300 ${
          hovering ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        }`}
        style={{ background: "rgba(0,0,0,0.35)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
        <span className="text-[10px] text-white/80 font-medium tracking-wide">
          Live Preview
        </span>
      </div>

      {/* ── Content ── */}
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p
          className="text-[9px] sm:text-[10px] font-bold tracking-[0.22em] uppercase mb-1.5 transition-colors duration-300"
          style={{ color: hovering ? "var(--secondary)" : "rgba(255,255,255,0.5)" }}
        >
          Collection
        </p>

        <h3
          className="text-white leading-tight mb-1 transition-transform duration-300"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: tall
              ? "clamp(1.9rem, 3vw, 2.8rem)"
              : "clamp(1.5rem, 2.2vw, 2rem)",
            fontWeight: 600,
            transform: hovering ? "translateY(-3px)" : "translateY(0)",
          }}
        >
          {col.name}
        </h3>

        <p
          className="text-xs sm:text-sm mb-4 leading-relaxed transition-all duration-300"
          style={{
            color: "rgba(255,255,255,0.6)",
            opacity: hovering ? 1 : 0.75,
            maxWidth: "22ch",
          }}
        >
          {col.description}
        </p>

        <span
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white rounded-full transition-all duration-300"
          style={{
            background: hovering ? "var(--secondary)" : "rgba(255,255,255,0.15)",
            backdropFilter: "blur(8px)",
            border: hovering
              ? "1.5px solid var(--secondary)"
              : "1.5px solid rgba(255,255,255,0.2)",
            padding: "8px 18px",
            transform: hovering ? "translateY(-2px)" : "translateY(0)",
            boxShadow: hovering ? "0 6px 20px rgba(218,63,63,0.35)" : "none",
          }}
        >
          Explore Now
          <FiArrowRight
            size={12}
            style={{
              transform: hovering ? "translateX(3px)" : "translateX(0)",
              transition: "transform 0.3s ease",
            }}
          />
        </span>
      </div>
    </Link>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function CollectionsSection() {
  return (
    <>
      {/* ── Feature strip ── */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-2.5 py-1">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
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
      <section className="w-full px-3 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <p className="text-[10px] sm:text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-1.5">
              Our Collections
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Shop by Category
            </h2>
            {/* Hint — context-aware */}
            <p className="hidden sm:block text-xs text-gray-400 mt-1">
              Hover to preview
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4"
          >
            View All <FiArrowRight size={13} />
          </Link>
        </div>

        {/* ── Desktop bento grid ── */}
        <div
          className="hidden sm:grid max-w-7xl mx-auto gap-4"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "340px 340px",
          }}
        >
          {/* Left tall card */}
          <div style={{ gridColumn: "1", gridRow: "1 / 3" }}>
            <CollectionCard col={COLLECTIONS[0]} idx={0} tall />
          </div>
          {/* Top right */}
          <div style={{ gridColumn: "2", gridRow: "1" }}>
            <CollectionCard col={COLLECTIONS[1]} idx={1} />
          </div>
          {/* Bottom right */}
          <div style={{ gridColumn: "2", gridRow: "2" }}>
            <CollectionCard col={COLLECTIONS[2]} idx={2} />
          </div>
        </div>

        {/* ── Mobile: stacked cards, image-only, no video ── */}
        <div className="sm:hidden flex flex-col gap-3">
          {COLLECTIONS.map((col, i) => (
            <div key={col.handle} style={{ height: "240px" }}>
              <CollectionCard col={col} idx={i} />
            </div>
          ))}
        </div>

        {/* Mobile "View All" link */}
        <div className="sm:hidden text-center mt-5">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4"
          >
            View All Collections <FiArrowRight size={13} />
          </Link>
        </div>
      </section>
    </>
  );
}