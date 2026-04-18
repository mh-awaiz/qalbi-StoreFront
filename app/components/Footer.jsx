"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiMail, FiPhone, FiMapPin, FiHeart } from "react-icons/fi";

const supportLinks = [
  { label: "Track Order", href: "/track-order" },
  { label: "Exchange Policy", href: "/exchange" },
  { label: "Shipping Info", href: "/shipping" },
  // { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];
const companyLinks = [
  { label: "About Us", href: "/about" },
  // { label: "Our Story", href: "/about#story" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/collections").then(r => r.json()).then(d => {
      if (d.success) setCategories(d.collections);
    }).catch(() => {});
  }, []);

  const shopLinks = [
    { label: "All Products", href: "/shop" },
    ...categories.map(c => ({ label: c.name, href: `/collections/${c.handle}` })),
  ];

  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Newsletter */}
      <div className="bg-[var(--secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3
              className="text-xl sm:text-2xl font-semibold text-white"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Stay in the loop
            </h3>
            <p className="text-white/80 text-sm mt-1">
              New arrivals, exclusive deals & style inspiration.
            </p>
          </div>
          <div className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button className="px-4 sm:px-5 py-2.5 bg-white text-[var(--secondary)] rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1">
            <Link href="/" className="block mb-4">
              <img
                className="w-24 sm:w-28"
                src="/logo.avif"
                alt="Qalbi Couture"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5 max-w-xs">
              Handpicked ethnic wear — dress materials, Pakistani suits, and
              premium salwar kameez, curated for every occasion.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/qalbi_couture/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <FiInstagram size={16} />
              </a>
              <a
                href="https://www.facebook.com/qalbicouture"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <FiFacebook size={16} />
              </a>
              <a
                href="mailto:info@qalbicouture.com"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all"
              >
                <FiMail size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Shop
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Support
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <FiPhone size={13} />
                <span>+91 81304 21960</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin size={13} />
                <span>Delhi, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-gray-600">
          <p className="text-center">
            © {new Date().getFullYear()} Qalbi Couture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
