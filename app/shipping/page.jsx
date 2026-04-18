import Link from "next/link";
import {
  FiTruck, FiPackage, FiClock, FiMapPin,
  FiShield, FiArrowRight, FiAlertCircle, FiCheck,
} from "react-icons/fi";

export const metadata = {
  title: "Shipping Information — Qalbi Couture | Fast Delivery Across India",
  description:
    "Learn about Qalbi Couture's shipping policy. Free shipping above ₹999, delivery in 5–8 days via Delhivery. Standard and express shipping options available across India.",
  keywords: [
    "Qalbi Couture shipping",
    "free shipping ethnic wear India",
    "delivery time salwar kameez",
    "Delhivery shipping India",
    "express shipping dress material",
    "order tracking Qalbi Couture",
  ],
  openGraph: {
    title: "Shipping Information — Qalbi Couture",
    description: "Free shipping above ₹999. Delivery in 5–8 days. Express options available.",
    url: "https://www.qalbicouture.com/shipping",
  },
  alternates: { canonical: "https://www.qalbicouture.com/shipping" },
};

const shippingOptions = [
  {
    name: "Standard Shipping",
    price: "FREE above ₹999 · ₹99 below",
    days: "5–8 Business Days",
    desc: "Delivered via Delhivery across all major cities and towns in India. Tracking link sent via email and SMS once shipped.",
    icon: <FiTruck size={20} className="text-[var(--secondary)]" />,
    highlight: true,
  },
  {
    name: "Express Shipping",
    price: "₹199 flat",
    days: "2–4 Business Days",
    desc: "Priority processing and expedited delivery for when you need your outfit sooner. Available at checkout.",
    icon: <FiPackage size={20} className="text-[var(--secondary)]" />,
    highlight: false,
  },
];

const orderTimeline = [
  { step: "Order Placed", time: "Immediately", desc: "You receive an order confirmation email with your order details." },
  { step: "Order Verified", time: "Within 2 hours", desc: "Our team verifies your order, checks stock, and prepares it for dispatch." },
  { step: "Packed & Dispatched", time: "1–2 Business Days", desc: "Your order is carefully packed and handed over to Delhivery for delivery." },
  { step: "Out for Delivery", time: "5–8 Business Days", desc: "Delhivery delivers to your address. You'll receive an SMS before delivery." },
  { step: "Delivered", time: "5–8 Business Days", desc: "Your parcel arrives at your door. Enjoy your new outfit!" },
];

const coveredZones = [
  { zone: "Metro Cities", cities: "Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad", days: "3–5 Days" },
  { zone: "Tier-2 Cities", cities: "Jaipur, Lucknow, Surat, Indore, Bhopal, Nagpur, Chandigarh, Kochi", days: "4–6 Days" },
  { zone: "Tier-3 & Rural", cities: "Smaller towns and villages across all 28 states", days: "6–8 Days" },
  { zone: "Northeast India", cities: "Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, Arunachal Pradesh, Sikkim", days: "7–10 Days" },
];

const faqs = [
  { q: "Do you ship to all states in India?", a: "Yes, we ship to all 28 states and 8 union territories of India via Delhivery's pan-India network." },
  { q: "Can I change my delivery address after placing the order?", a: "Address changes can be requested within 2 hours of placing the order by contacting us on WhatsApp or email. After dispatch, changes are not possible." },
  { q: "What if I miss my delivery?", a: "Delhivery will attempt delivery 3 times before marking the package as RTO (Return to Origin). If you miss a delivery, contact the courier directly or reach out to us to reattempt." },
  { q: "Is my order insured during transit?", a: "All orders are insured against loss or damage during transit at no extra cost. If your package arrives damaged, contact us within 48 hours with photos and we'll arrange a replacement or refund." },
  { q: "Do you offer international shipping?", a: "Currently, we ship within India only. International shipping is on our roadmap — sign up to our newsletter to be notified when it launches." },
  { q: "Why is my order delayed?", a: "Delays can occur during peak seasons (Eid, Diwali, etc.), bad weather, or in remote locations. If your order is more than 3 days past the estimated delivery, please contact us with your order number." },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Shipping & Delivery</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
            Fast Delivery Across India
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
            We partner with Delhivery — one of India's most trusted logistics networks — to ensure your order arrives safely and on time, wherever you are.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: <FiCheck size={13} />, label: "Free Shipping above ₹999" },
              { icon: <FiTruck size={13} />, label: "Delivered via Delhivery" },
              { icon: <FiMapPin size={13} />, label: "All India Delivery" },
            ].map(b => (
              <span key={b.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm">
                <span className="text-[var(--secondary)]">{b.icon}</span>{b.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping options */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>Shipping Options</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {shippingOptions.map((opt) => (
            <div key={opt.name} className={`rounded-2xl p-6 border-2 transition-all ${opt.highlight ? "border-[var(--secondary)] bg-red-50" : "border-gray-200 bg-white"}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${opt.highlight ? "bg-[var(--secondary)]/10" : "bg-gray-50"}`}>{opt.icon}</div>
                {opt.highlight && <span className="px-2.5 py-1 bg-[var(--secondary)] text-white text-[10px] font-bold rounded-full">Most Popular</span>}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-0.5">{opt.name}</h3>
              <p className="text-[var(--secondary)] font-semibold text-sm mb-1">{opt.price}</p>
              <div className="flex items-center gap-1.5 mb-3">
                <FiClock size={12} className="text-gray-400" />
                <span className="text-xs text-gray-500 font-medium">{opt.days}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{opt.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Order timeline */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-10 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>Your Order Journey</h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[var(--secondary)] to-rose-200 hidden sm:block" />
            <div className="space-y-6">
              {orderTimeline.map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-[var(--secondary)] text-white flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm z-10">{i + 1}</div>
                  <div className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{item.step}</h3>
                      <span className="text-xs font-medium text-[var(--secondary)] bg-red-50 px-2.5 py-0.5 rounded-full">{item.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Coverage zones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>Delivery Zones & Timelines</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 border border-gray-200 rounded-xl">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide rounded-l-xl">Zone</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Example Cities</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide rounded-r-xl">Est. Delivery</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coveredZones.map((zone) => (
                <tr key={zone.zone} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-gray-900">{zone.zone}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 max-w-sm">{zone.cities}</td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full">{zone.days}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">* Delivery timelines are estimates. Actual delivery may vary based on courier operations and external factors.</p>
      </section>

      {/* Packaging */}
      <section className="bg-gradient-to-br from-rose-50 to-pink-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-12 h-12 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FiShield size={22} className="text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>How We Pack Your Order</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Every order is lovingly packed in our signature packaging — your ethnic wear is first wrapped in tissue paper, then placed in a durable, moisture-proof polybag inside a sealed cardboard box. Fragile items and premium collections receive extra bubble wrap protection.
            </p>
            <p className="text-gray-500 text-sm leading-relaxed">
              We're also working toward eco-friendly packaging across our entire range. By 2026, we aim to use 100% recyclable materials for all our shipments.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>Shipping FAQs</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3">
          <FiAlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 leading-relaxed">
            <strong>Having trouble with your delivery?</strong> Contact us at support@qalbicouture.com or WhatsApp +91 99999 99999 with your order number and we'll resolve it within 24 hours.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/track-order" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white rounded-full font-semibold text-sm hover:bg-[#c03535] transition-all shadow-lg shadow-red-200">
            Track My Order <FiArrowRight size={14} />
          </Link>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-semibold text-sm border border-gray-200 hover:border-gray-300 transition-all">
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
