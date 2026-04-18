import Link from "next/link";
import { FiArrowRight, FiHeart, FiStar, FiPackage, FiTruck, FiShield } from "react-icons/fi";
import { MdDiamond } from "react-icons/md";

export const metadata = {
  title: "About Us — Qalbi Couture | Our Story & Mission",
  description:
    "Learn about Qalbi Couture — a Delhi-based ethnic fashion brand bringing premium dress materials, Pakistani suits, and salwar kameez to your doorstep. Handpicked designs, genuine craftsmanship.",
  keywords: [
    "about Qalbi Couture",
    "ethnic wear brand India",
    "Pakistani suits online India",
    "dress materials Delhi",
    "Indian fashion brand story",
    "handcrafted ethnic wear",
  ],
  openGraph: {
    title: "About Us — Qalbi Couture",
    description:
      "Discover the story behind Qalbi Couture — handpicked ethnic wear crafted with love, delivered across India.",
    url: "https://www.qalbicouture.com/about",
    type: "website",
  },
  alternates: { canonical: "https://www.qalbicouture.com/about" },
};

const values = [
  {
    icon: <MdDiamond size={22} className="text-[var(--secondary)]" />,
    title: "Uncompromising Quality",
    desc: "Every fabric is hand-tested before it reaches our catalog. We work directly with weavers and embroidery artisans across India to ensure only the finest makes it to you.",
  },
  {
    icon: <FiHeart size={22} className="text-[var(--secondary)]" />,
    title: "Crafted with Care",
    desc: "Each suit and dress material is chosen with a deep appreciation for tradition. From Lucknowi chikankari to Rajasthani block prints — we celebrate India's textile heritage.",
  },
  {
    icon: <FiStar size={22} className="text-[var(--secondary)]" />,
    title: "Customer First, Always",
    desc: "We've fulfilled over 10,000 orders since 2021. Every review, every return request, every WhatsApp message — we read them all and improve with every order.",
  },
  {
    icon: <FiShield size={22} className="text-[var(--secondary)]" />,
    title: "Transparent & Honest",
    desc: "No misleading product images. No hidden shipping charges. What you see is what you get — and if it isn't, we make it right. Simple.",
  },
];

const milestones = [
  { year: "2021", title: "The Beginning", desc: "Qalbi Couture was founded in a small shop in Shaheen Bagh, Delhi, with a simple idea: make authentic ethnic wear accessible to everyone." },
  { year: "2022", title: "Going Online", desc: "Launched our first digital storefront. Within 3 months, we had shipped to 18 states across India. The response was overwhelming." },
  { year: "2023", title: "100 Happy Customers", desc: "Hit our first 100 customer milestone. We celebrated by adding an exclusive premium collection featuring hand-embroidered Pakistani suits." },
  { year: "2024", title: "Growing Together", desc: "Expanded our catalog to 75+ unique designs. Partnered with master craftspeople in Lucknow, Surat, and Jaipur for exclusive collections." },
  { year: "2025", title: "100+ Orders", desc: "Crossed 100 fulfilled orders. Expanded free shipping to all orders above ₹999 as a thank-you to our incredible community." },
];

const team = [
  { name: "Faiz Ali Ansair", role: "Founder & Creative Director", bio: "With 5 years in ethnic fashion buying, Faiz curates every design in the catalog personally." },
  { name: "Afiya Ward Ansari", role: "Head of Operations", bio: "Afiya ensures every order ships on time and every customer query is resolved within 24 hours." },
  { name: "Zoya Ward Ansari", role: "Fabric Sourcing Lead", bio: "Zoya travels across India's textile hubs — sourcing only fabrics that meet Qalbi's quality standards." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-100/40 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="max-w-2xl">
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Our Story</p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-5"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              We Dress You in
              <span className="text-[var(--secondary)] italic"> Grace</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed mb-8 max-w-xl">
              Qalbi Couture is a Delhi-based ethnic fashion brand on a mission to bring India's most beautiful textiles — hand-embroidered, hand-picked, and deeply rooted in tradition — directly to your door.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white rounded-full font-semibold text-sm hover:bg-[#c03535] transition-all shadow-lg shadow-red-200 hover:-translate-y-0.5">
                Shop the Collection <FiArrowRight size={15} />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-semibold text-sm border border-gray-200 hover:border-gray-300 transition-all">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { num: "100+", label: "Orders Fulfilled" },
              { num: "75+", label: "Unique Designs" },
              { num: "4.8★", label: "Average Rating" },
              { num: "28+", label: "States Served" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl sm:text-4xl font-bold text-[var(--secondary)]" style={{ fontFamily: "var(--font-cormorant)" }}>{s.num}</p>
                <p className="text-sm text-gray-500 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Our Mission</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-5 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
              Making Authentic Ethnic Wear Accessible to Every Woman
            </h2>
            <div className="space-y-4 text-gray-500 text-sm sm:text-base leading-relaxed">
              <p>
                India's textile tradition is one of the richest in the world — yet for most women, finding authentic, high-quality ethnic wear means either expensive boutique shopping or sifting through unreliable online listings.
              </p>
              <p>
                Qalbi Couture was born to bridge that gap. We work directly with weavers, embroiderers, and fabric houses across Lucknow, Surat, Jaipur, and Kolkata — cutting out middlemen so you get genuine craftsmanship at honest prices.
              </p>
              <p>
                "Qalbi" means "from the heart" in Urdu. That's our promise — every piece in our collection is chosen with love, care, and a deep respect for the artisans behind it.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-rose-100 to-pink-50 flex items-center justify-center">
              <img
                src="https://cdn.shopify.com/s/files/1/0879/0366/6340/files/Front2.jpg?v=1762569597"
                alt="Qalbi Couture ethnic wear collection"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
              <p className="text-2xl font-bold text-[var(--secondary)]" style={{ fontFamily: "var(--font-cormorant)" }}>Since 2021</p>
              <p className="text-xs text-gray-500 mt-0.5">Serving India with love</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">What We Stand For</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>Our Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Our Journey</p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>A Story of Growth</h2>
        </div>
        <div className="relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-rose-200 via-[var(--secondary)] to-rose-200 sm:-translate-x-1/2" />
          <div className="space-y-10">
            {milestones.map((m, i) => (
              <div key={m.year} className={`relative flex items-start gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                <div className="absolute left-4 sm:left-1/2 w-3 h-3 bg-[var(--secondary)] rounded-full border-2 border-white shadow sm:-translate-x-1/2 mt-1.5" />
                <div className={`pl-12 sm:pl-0 sm:w-[45%] ${i % 2 === 0 ? "sm:pr-10 sm:text-right" : "sm:pl-10"}`}>
                  <span className="inline-block px-3 py-1 bg-red-50 text-[var(--secondary)] text-xs font-bold rounded-full mb-2">{m.year}</span>
                  <h3 className="font-semibold text-gray-900 text-base mb-1">{m.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{m.desc}</p>
                </div>
                <div className="hidden sm:block sm:w-[10%]" />
                <div className="hidden sm:block sm:w-[45%]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">The People Behind It</p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900" style={{ fontFamily: "var(--font-cormorant)" }}>Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-200 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--secondary)]" style={{ fontFamily: "var(--font-cormorant)" }}>{member.name[0]}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                <p className="text-xs text-[var(--secondary)] font-medium mt-0.5 mb-2">{member.role}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="bg-gradient-to-br from-[var(--secondary)] to-rose-600 rounded-3xl p-8 sm:p-14 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-white/70">Ready to Shop?</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4 relative" style={{ fontFamily: "var(--font-cormorant)" }}>
            Explore Our Collections
          </h2>
          <p className="text-white/80 text-sm sm:text-base mb-8 max-w-md mx-auto">
            75+ curated designs. Free shipping above ₹999. Easy returns. What are you waiting for?
          </p>
          <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[var(--secondary)] rounded-full font-bold text-sm hover:bg-white/90 transition-all shadow-xl">
            Shop Now <FiArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
