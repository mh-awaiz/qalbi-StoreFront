"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FiArrowRight,
  FiVolume2,
  FiVolumeX,
  FiChevronDown,
} from "react-icons/fi";

const slides = [
  {
    id: 1,
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778875272/hero_video_q1sk8n.mp4",
    poster:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778875272/hero_video_q1sk8n.mp4",
    accent: "New Collection",
    headline: "Dressed in\nGrace",
    sub: "Timeless embroidery. Premium fabrics. Every occasion.",
    cta: "Shop New Arrivals",
    ctaLink: "/shop",
    secondaryCta: "View Collections",
    secondaryLink: "/shop",
  },
  {
    id: 2,
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778876376/Bestseller_nfmtku.mp4",
    poster:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778876376/Bestseller_nfmtku.mp4",
    accent: "Hand Picked For You",
    headline: "Bestseller",
    sub: "Hand-crafted suits for every celebration and gathering.",
    cta: "Explore Suits",
    ctaLink: "/collections/bestseller",
    secondaryCta: "All Collections",
    secondaryLink: "/shop",
  },
  {
    id: 3,
    video:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778875272/dress_material_zj2bpi.mp4",
    poster:
      "https://res.cloudinary.com/dxra2tyvf/video/upload/v1778875272/dress_material_zj2bpi.mp4",
    accent: "Premium Pick",
    headline: "Dress Material",
    sub: "Luxurious fabrics curated by master craftspeople.",
    cta: "View Dress Materials",
    ctaLink: "/collections/dress-material",
    secondaryCta: "Browse All",
    secondaryLink: "/shop",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [transitioning, setTransitioning] = useState(false);
  const videoRefs = useRef([]);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 700);
  };

  const next = () => goTo((current + 1) % slides.length);
  const prev = () => goTo((current - 1 + slides.length) % slides.length);

  // Autoplay timer
  useEffect(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [current, transitioning]);

  // Play current video, pause others
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      v.muted = muted;
      if (i === current) {
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [current, muted]);

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "100svh", minHeight: "600px", maxHeight: "920px" }}
    >
      {/* ── Video layers ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current && !transitioning ? 1 : 0,
            zIndex: 1,
          }}
        >
          {/* Poster image always shown as background — video loads on top */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${s.poster})`,
              filter: "brightness(0.52)",
            }}
          />
          <video
            ref={(el) => {
              videoRefs.current[i] = el;
            }}
            src={s.video}
            poster={s.poster}
            loop
            muted={muted}
            playsInline
            preload={i === 0 ? "auto" : "none"}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.52)" }}
          />
        </div>
      ))}

      {/* ── Cinematic overlays ── */}
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 100%)",
          zIndex: 2,
        }}
      />
      {/* Left-side gradient for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 60%)",
          zIndex: 2,
        }}
      />
      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "180px",
          background:
            "linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))",
          zIndex: 2,
        }}
      />

      {/* ── Slide content ── */}
      <div
        className="absolute inset-0 flex items-center z-10"
        key={`content-${current}`}
        style={{
          animation: "heroFadeUp 0.75s cubic-bezier(0.22,1,0.36,1) forwards",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full pb-20 sm:pb-0">
          <div className="max-w-xl">
            {/* Accent line */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <span className="w-8 h-px bg-[var(--secondary)]" />
              <span
                className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {slide.accent}
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[3.2rem] sm:text-[4.5rem] lg:text-[6.5rem] font-semibold text-white leading-[0.92] mb-5 sm:mb-7"
              style={{
                fontFamily: "var(--font-cormorant)",
                whiteSpace: "pre-line",
                textShadow: "0 4px 32px rgba(0,0,0,0.25)",
              }}
            >
              {slide.headline}
            </h1>

            {/* Subtitle */}
            <p
              className="text-sm sm:text-base mb-8 sm:mb-10 max-w-sm leading-relaxed font-light tracking-wide"
              style={{ color: "rgba(255,255,255,0.68)" }}
            >
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={slide.ctaLink}
                className="group inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--secondary)] text-white rounded-full font-semibold text-sm hover:bg-[#c03535] transition-all shadow-lg shadow-red-900/50 hover:-translate-y-0.5"
              >
                {slide.cta}
                <FiArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={slide.secondaryLink}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-4 border border-white/25 text-white rounded-full font-medium text-sm backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all"
              >
                {slide.secondaryCta}
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-7 sm:gap-10 mt-10 sm:mt-12">
              {[
                { num: "10k+", label: "Orders" },
                { num: "4.9★", label: "Rating" },
                { num: "75+", label: "Designs" },
              ].map((st) => (
                <div key={st.label}>
                  <p
                    className="text-xl sm:text-2xl font-bold text-white"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {st.num}
                  </p>
                  <p
                    className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {st.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom controls bar ── */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between gap-4">
          {/* Progress pills */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-white/35 font-medium tabular-nums">
              {String(current + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Slide ${i + 1}`}
                  className="relative h-[3px] rounded-full overflow-hidden transition-all duration-500"
                  style={{
                    width: i === current ? "36px" : "16px",
                    background: "rgba(255,255,255,0.2)",
                  }}
                >
                  {i === current && (
                    <span
                      className="absolute inset-0 rounded-full bg-white"
                      style={{
                        animation: "slideProgress 3s linear forwards",
                        transformOrigin: "left",
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="text-[11px] text-white/35 font-medium tabular-nums">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-1.5">
            {/* Mute toggle */}
            <button
              onClick={() => setMuted((m) => !m)}
              title={muted ? "Unmute" : "Mute"}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center transition-all hover:bg-white/10 backdrop-blur-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              {muted ? <FiVolumeX size={13} /> : <FiVolume2 size={13} />}
            </button>
            {/* Prev */}
            <button
              onClick={prev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center transition-all hover:bg-white/10 backdrop-blur-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M8 2L4 6L8 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {/* Next */}
            <button
              onClick={next}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/20 flex items-center justify-center transition-all hover:bg-white/10 backdrop-blur-sm"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                <path
                  d="M4 2L8 6L4 10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        className="absolute bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 pointer-events-none"
        style={{ opacity: 0.4 }}
      >
        <span className="text-[9px] tracking-[0.25em] text-white uppercase">
          Scroll
        </span>
        <FiChevronDown size={13} className="text-white animate-bounce" />
      </div>

      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideProgress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
