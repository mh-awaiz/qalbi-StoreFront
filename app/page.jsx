import HeroSection from "./sections/HeroSection";
import CollectionsSection from "./sections/CollectionsSection";
import FeaturedProducts from "./sections/FeaturedProducts";
import ReviewSection from "../app/sections/ReviewSection";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function Home() {
  return (
    <main className="flex flex-col overflow-x-hidden">
      <HeroSection />
      <CollectionsSection />
      <FeaturedProducts />
      <ReviewSection />

      {/* ── Video CTA Banner ── */}
      <section className="mx-3 sm:mx-6 mb-16 sm:mb-20 rounded-2xl sm:rounded-3xl overflow-hidden relative" style={{ minHeight: "320px" }}>
        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Front2.jpg?v=1762569597"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.4)" }}
        >
          <source src="https://cdn.coverr.co/videos/coverr-woman-in-traditional-dress-8289/1080p.mp4" type="video/mp4" />
        </video>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, rgba(218,63,63,0.6) 0%, rgba(26,10,0,0.7) 100%)" }}
        />

        {/* Decorative blobs */}
        <div className="absolute top-6 right-16 w-28 h-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute bottom-6 left-10 w-20 h-20 rounded-full bg-white/5 blur-xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 sm:py-20">
          <p className="text-white/60 text-xs font-bold tracking-[0.3em] uppercase mb-3">New Every Week</p>
          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            New Arrivals, Always
          </h2>
          <p className="text-white/70 text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed">
            Be the first to discover our newest dress materials, Pakistani suits, and salwar kameez sets.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-white text-[var(--secondary)] rounded-full font-bold text-sm hover:bg-white/90 transition-all shadow-xl hover:-translate-y-0.5"
          >
            Shop Now <FiArrowRight size={15} />
          </Link>
        </div>
      </section>
    </main>
  );
}
