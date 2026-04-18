"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import ProductCard from "../components/ProductCard";

const STATIC_TABS = [{ label: "All", param: null }];

function PrevArrow({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
        disabled
          ? "border-gray-100 text-gray-200 cursor-default"
          : "border-gray-300 text-gray-600 hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-sm"
      }`}
    >
      <FiChevronLeft size={17} />
    </button>
  );
}

function NextArrow({ onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-200 flex-shrink-0 ${
        disabled
          ? "border-gray-100 text-gray-200 cursor-default"
          : "border-gray-300 text-gray-600 hover:border-[var(--secondary)] hover:text-[var(--secondary)] hover:shadow-sm"
      }`}
    >
      <FiChevronRight size={17} />
    </button>
  );
}

export default function FeaturedSlider({ products }) {
  const desktopSliderRef = useRef(null);
  const mobileSliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState(STATIC_TABS);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetch("/api/collections")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.collections.length > 0) {
          setTabs([
            { label: "All", param: null },
            ...d.collections.map((c) => ({ label: c.name, param: c.handle })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  const filtered =
    activeTab === 0
      ? products
      : products.filter((p) => p.collections?.includes(tabs[activeTab]?.param));

  const handleTabChange = (i) => {
    setActiveTab(i);
    setCurrentSlide(0);
    desktopSliderRef.current?.slickGoTo(0, true);
    mobileSliderRef.current?.slickGoTo(0, true);
  };

  // ── Desktop slider settings ──
  const desktopSettings = {
    dots: false,
    infinite: false,
    speed: 380,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    swipeToSlide: true,
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3.5, slidesToScroll: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 2 } },
    ],
  };

  // ── Mobile slider settings ──
  const mobileSettings = {
    dots: false,
    infinite: false,
    speed: 420,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,
    touchThreshold: 10,
    cssEase: "cubic-bezier(0.22, 1, 0.36, 1)",
    beforeChange: (_, next) => setCurrentSlide(next),
    responsive: [
      { breakpoint: 480, settings: { slidesToShow: 1.6, slidesToScroll: 1 } },
      { breakpoint: 380, settings: { slidesToShow: 1.4, slidesToScroll: 1 } },
    ],
  };

  const canPrev = currentSlide > 0;
  const canNext = currentSlide < filtered.length - 2;

  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">👗</p>
          <p className="font-medium">No featured products yet</p>
          <p className="text-sm mt-1">
            Mark products as featured in the admin panel
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-16 sm:pb-20 overflow-hidden">
      {/* ── Header ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-end justify-between mb-5 sm:mb-7">
        <div>
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-1.5">
            Handpicked for you
          </p>
          <h2
            className="text-2xl sm:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Featured Products
          </h2>
        </div>

        {/* Desktop: arrows + view all */}
        <div className="hidden sm:flex items-center gap-2">
          <PrevArrow
            onClick={() => desktopSliderRef.current?.slickPrev()}
            disabled={!canPrev}
          />
          <NextArrow
            onClick={() => desktopSliderRef.current?.slickNext()}
            disabled={!canNext}
          />
          <Link
            href="/shop"
            className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4 whitespace-nowrap"
          >
            View All <FiArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* ── Filter tabs ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-5 sm:mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              onClick={() => handleTabChange(i)}
              className={`flex-none px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                activeTab === i
                  ? "bg-[var(--secondary)] text-white border-[var(--secondary)] shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:border-[var(--secondary)] hover:text-[var(--secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════
          DESKTOP SLIDER  (sm and above)
          ════════════════════════════════ */}
      <div className="hidden sm:block max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">No products in this collection yet</p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm text-[var(--secondary)] hover:underline"
            >
              Browse all products →
            </Link>
          </div>
        ) : (
          <Slider ref={desktopSliderRef} {...desktopSettings}>
            {filtered.map((product) => (
              <div key={product.id || product._id} className="px-2">
                <ProductCard product={product} />
              </div>
            ))}
            {/* View All card */}
            <div className="px-2">
              <Link
                href="/shop"
                className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[var(--secondary)]/30 bg-red-50/50 hover:border-[var(--secondary)] hover:bg-red-50 transition-all duration-300 group"
                style={{ minHeight: "280px" }}
              >
                <div className="w-12 h-12 rounded-full bg-[var(--secondary)]/10 flex items-center justify-center group-hover:bg-[var(--secondary)]/20 transition-colors">
                  <FiArrowRight size={20} className="text-[var(--secondary)]" />
                </div>
                <div className="text-center px-4">
                  <p className="text-sm font-semibold text-[var(--secondary)]">
                    View All
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">75+ products</p>
                </div>
              </Link>
            </div>
          </Slider>
        )}
      </div>

      {/* ════════════════════════════════
          MOBILE SLIDER  (below sm)
          ════════════════════════════════ */}
      <div className="sm:hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 text-gray-400">
            <p className="text-sm">No products in this collection yet</p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm text-[var(--secondary)] hover:underline"
            >
              Browse all products →
            </Link>
          </div>
        ) : (
          <>
            <div className="px-4">
              <Slider ref={mobileSliderRef} {...mobileSettings}>
                {filtered.map((product) => (
                  <div key={product.id || product._id} className="pr-3">
                    <ProductCard product={product} />
                  </div>
                ))}
              </Slider>
            </div>

            {/* Mobile bottom controls */}
            <div className="mt-5 px-4 flex items-center justify-between">
              {/* Arrows */}
              <div className="flex items-center gap-2">
                <PrevArrow
                  onClick={() => mobileSliderRef.current?.slickPrev()}
                  disabled={!canPrev}
                />
                <NextArrow
                  onClick={() => mobileSliderRef.current?.slickNext()}
                  disabled={!canNext}
                />
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {filtered.slice(0, Math.min(filtered.length, 8)).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      mobileSliderRef.current?.slickGoTo(i);
                      setCurrentSlide(i);
                    }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === currentSlide ? "20px" : "6px",
                      height: "6px",
                      background:
                        i === currentSlide ? "var(--secondary)" : "#e5e7eb",
                    }}
                  />
                ))}
              </div>

              {/* View all */}
              <Link
                href="/shop"
                className="text-sm font-semibold text-[var(--secondary)] underline underline-offset-4"
              >
                All →
              </Link>
            </div>

            {/* Swipe hint */}
            <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1.5">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              Swipe to explore
            </p>
          </>
        )}
      </div>

      <style>{`
        .slick-track { display: flex !important; align-items: stretch; }
        .slick-slide { height: auto; }
        .slick-slide > div { height: 100%; }
        .slick-list { overflow: hidden !important; }
      `}</style>
    </section>
  );
}
