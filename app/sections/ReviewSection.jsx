"use client";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    name: "Fatima Shaikh",
    city: "Mumbai",
    rating: 5,
    text: "The quality of the chiffon dress material is absolutely gorgeous. The embroidery is so fine and detailed. Will definitely order again!",
    product: "Beige Chiffon Dress Material",
    avatar: "FS",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Priya Mehta",
    city: "Delhi",
    rating: 5,
    text: "Ordered the Pakistani suit material and I'm blown away. The georgette is so soft, and the dupatta is stunning. Fast delivery too!",
    product: "Green Georgette Pakistani Suit",
    avatar: "PM",
    color: "from-teal-400 to-emerald-500",
  },
  {
    name: "Ayesha Khan",
    city: "Hyderabad",
    rating: 5,
    text: "Qalbi Couture never disappoints. The tissue organza salwar suit was exactly as shown. Beautiful colors, premium quality.",
    product: "Pista Organza Salwar Suit",
    avatar: "AK",
    color: "from-purple-400 to-violet-500",
  },
  {
    name: "Zara Ahmed",
    city: "Bangalore",
    rating: 4,
    text: "Lovely collection and great customer service. The dress materials are top quality. Packaging was also very neat and elegant.",
    product: "Chanderi Cotton Silk Suit",
    avatar: "ZA",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Nadia Rahman",
    city: "Kolkata",
    rating: 5,
    text: "I've been ordering from Qalbi Couture for 2 years now and they never fail. The hand embroidery work is just stunning.",
    product: "Wine Organza Dress Material",
    avatar: "NR",
    color: "from-red-400 to-rose-500",
  },
  {
    name: "Rukhsar Patel",
    city: "Surat",
    rating: 5,
    text: "Absolutely love the collection! The Pink Chanderi with zari work is my go-to for every occasion. Premium quality at fair price.",
    product: "Pink Chanderi Zariwork",
    avatar: "RP",
    color: "from-blue-400 to-indigo-500",
  },
];

export default function ReviewSection() {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    swipeToSlide: true,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // 🔥 change from 640 → 768
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <>
      {/* ── Marquee strip ── */}
      <div className="bg-[var(--secondary)] py-3.5 overflow-hidden">
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 28s linear infinite" }}
        >
          {[...Array(4)].map((_, j) =>
            [
              "Premium Fabrics",
              "Hand Embroidery",
              "Free Shipping on ₹999+",
              "75+ Products",
              "Trusted by 1000+ Customers",
              "New Arrivals Weekly",
            ].map((item, i) => (
              <span
                key={`${j}-${i}`}
                className="inline-flex items-center gap-3 text-xs sm:text-sm font-medium text-white tracking-wider px-8"
              >
                <span style={{ color: "rgba(255,255,255,0.35)" }}>✦</span>
                {item}
              </span>
            )),
          )}
        </div>
      </div>

      {/* ── Reviews slider ── */}
      <section
        className="py-16 sm:py-20 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #fff 0%, #fdf8f8 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="flex items-end justify-between mb-10 sm:mb-12">
            <div>
              <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-2">
                Customer Love
              </p>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-900"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                What Our Customers Say
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-800">4.9</span>
                <span className="text-sm text-gray-400">from 500+ reviews</span>
              </div>
            </div>

            {/* Desktop arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
              >
                <FiChevronLeft size={17} />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
              >
                <FiChevronRight size={17} />
              </button>
            </div>
          </div>

          {/* Slider */}
          <div className="overflow-hidden">
            <Slider ref={sliderRef} {...settings}>
              {reviews.map((review, i) => (
                <div key={review.name} className="px-2 sm:px-3">
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-red-50 hover:border-red-100 transition-all duration-300 group flex flex-col h-full w-full">
                    {/* Quote icon */}
                    <FaQuoteLeft
                      size={22}
                      className="text-red-100 group-hover:text-red-200 transition-colors mb-4"
                    />

                    {/* Stars */}
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(review.rating)].map((_, j) => (
                        <FiStar
                          key={j}
                          size={13}
                          className="fill-amber-400 text-amber-400"
                        />
                      ))}
                      {[...Array(5 - review.rating)].map((_, j) => (
                        <FiStar
                          key={`e-${j}`}
                          size={13}
                          className="fill-gray-200 text-gray-200"
                        />
                      ))}
                    </div>

                    {/* Review text — no line-clamp on mobile so full text shows */}
                    <p className="text-sm sm:text-sm text-gray-600 leading-relaxed mb-3 flex-1 sm:line-clamp-4">
                      "{review.text}"
                    </p>

                    {/* Product tag */}
                    <p className="text-[11px] text-gray-400 mb-4 font-medium bg-gray-50 px-2.5 py-1 rounded-full inline-block self-start">
                      {review.product}
                    </p>

                    {/* Reviewer */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br ${review.color} shadow-sm flex-shrink-0`}
                      >
                        {review.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {review.name}
                        </p>
                        <p className="text-xs text-gray-400">{review.city}</p>
                      </div>
                      <span className="ml-auto text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap">
                        ✓ Verified
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {/* Mobile arrows */}
          <div className="sm:hidden flex items-center justify-center gap-3 mt-7">
            <button
              onClick={() => sliderRef.current?.slickPrev()}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
            >
              <FiChevronLeft size={17} />
            </button>

            {/* Dot indicators */}
            <div className="flex items-center gap-1.5">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => sliderRef.current?.slickGoTo(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === currentSlide % reviews.length ? "20px" : "6px",
                    height: "6px",
                    background:
                      i === currentSlide % reviews.length
                        ? "var(--secondary)"
                        : "#e5e7eb",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => sliderRef.current?.slickNext()}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-[var(--secondary)] hover:text-[var(--secondary)] transition-all"
            >
              <FiChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* Remove default slick arrows/dots since we use custom */
        .slick-prev, .slick-next { display: none !important; }
        .slick-dots { display: none !important; }
        .slick-track { display: flex !important; }
        .slick-slide { height: auto; }
        .slick-slide > div { height: 100%; }
      `}</style>
    </>
  );
}
