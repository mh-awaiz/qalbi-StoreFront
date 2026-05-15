"use client";
import { useRef, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
  {
    name: "Rafat Jamal",
    city: "Delhi",
    rating: 5,
    text: "Very good experience of Qalbi Couture. It's an amazing place for clothes collection.",
    product: "Luxury Clothing Collection",
    avatar: "RJ",
    color: "from-rose-400 to-pink-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Arsh Ali",
    city: "Mumbai",
    rating: 5,
    text: "Qalbi Couture dresses are so beautiful.",
    product: "Designer Dresses",
    avatar: "AA",
    color: "from-teal-400 to-emerald-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Zoya Ansari",
    city: "Hyderabad",
    rating: 5,
    text: "Great quality clothes with stylish designs, comfortable fabric, and timely delivery. Highly satisfied with the purchase.",
    product: "Premium Outfit Collection",
    avatar: "ZA",
    color: "from-purple-400 to-violet-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Aisha Syed",
    city: "Lucknow",
    rating: 5,
    text: "Beautiful collection.",
    product: "Ethnic Wear Collection",
    avatar: "AS",
    color: "from-amber-400 to-orange-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Mehram Shamim",
    city: "Noida",
    rating: 5,
    text: "The collection was amazing. Loved to be there. The collection has a blend of every style.",
    product: "Mixed Fashion Collection",
    avatar: "MS",
    color: "from-red-400 to-rose-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Taniya Shamim",
    city: "Bangalore",
    rating: 5,
    text: "Loved my purchase from this brand. The clothes are trendy, comfortable, and true to size. Highly recommendable.",
    product: "Trendy Fashion Wear",
    avatar: "TS",
    color: "from-blue-400 to-indigo-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHNmrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Saima Ansari",
    city: "Kolkata",
    rating: 5,
    text: "Aesthetic and beautiful outfits. A fit that works perfectly for my occasions.",
    product: "Occasion Wear",
    avatar: "SA",
    color: "from-green-400 to-emerald-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Y K",
    city: "Surat",
    rating: 5,
    text: "Good collection. Great value for the money.",
    product: "Affordable Luxury Collection",
    avatar: "YK",
    color: "from-cyan-400 to-blue-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Faiz Ahmad",
    city: "Delhi",
    rating: 5,
    text: "Visited for wedding shopping and my wife was very happy with their collection. Affordable luxury suits under one roof. Highly recommended.",
    product: "Wedding Collection",
    avatar: "FA",
    color: "from-yellow-400 to-orange-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Mohammad Reyan",
    city: "Jaipur",
    rating: 5,
    text: "Best clothes for women, trendy styles, and lots of options to choose from.",
    product: "Women's Fashion Collection",
    avatar: "MR",
    color: "from-indigo-400 to-purple-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
  },
  {
    name: "Saima Arfin",
    city: "Lucknow",
    rating: 5,
    text: "Seeing the collection here truly made my heart happy. Perfect combination of quality and style. Everyone must visit!",
    product: "Premium Fashion Collection",
    avatar: "SR",
    color: "from-pink-400 to-rose-500",
    link: "https://www.google.com/search?sca_esv=3bfd357771d07d42&biw=1536&bih=776&sxsrf=ANbL-n7zWMiQbB1f6KFqSRXHUlWmjS-bJQ:1778855572888&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOQgIyiSmO1Zzbv7JLBjZueAJdOhapYUaHgT0atJHN1mrc9C6oQ80wkOBmrKctQGYk0lLZoxluMqxzadSXSyPMpt-a3EB&q=Qalbi+Couture+Reviews&sa=X&ved=2ahUKEwiJjp20wbuUAxWSzTgGHdsUBdwQ0bkNegQIIRAH&cshid=1778855858566032",
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
        breakpoint: 768, // change from 640 → 768
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
                <span className="text-sm font-semibold text-gray-800">5.0</span>
                <span className="text-sm text-gray-400">from 50+ reviews</span>
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
                  {/* Google Review Link */}
                  <a
                    href={review.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {review.name}
                          </p>
                          <p className="text-xs text-gray-400">{review.city}</p>
                        </div>

                        <p className="ml-auto text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap hover:bg-green-100 transition-colors">
                          {" "}
                          ✓ Verified
                        </p>
                      </div>
                    </div>
                  </a>
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
