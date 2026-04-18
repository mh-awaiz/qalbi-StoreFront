import Link from "next/link";
import {
  FiArrowRight,
  FiCheck,
  FiX,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";

export const metadata = {
  title: "Exchange Policy — Qalbi Couture | Easy 7-Day Exchanges",
  description:
    "Qalbi Couture's hassle-free exchange policy. Exchange your ethnic wear within 7 days of delivery. Learn what's eligible, how to initiate an exchange, and what to expect.",
  keywords: [
    "Qalbi Couture exchange policy",
    "ethnic wear exchange India",
    "dress material exchange policy",
    "7 day exchange policy online shopping",
    "exchange policy salwar kameez",
    "exchange policy Qalbi",
  ],
  openGraph: {
    title: "Exchange Policy — Qalbi Couture | Easy 7-Day Exchanges",
    description:
      "Exchange within 7 days. Simple, hassle-free, no questions asked.",
    url: "https://www.qalbicouture.com/returns",
  },
  alternates: { canonical: "https://www.qalbicouture.com/returns" },
};

const eligibleItems = [
  "Unused, unwashed items with original tags intact",
  "Items in their original packaging",
  "Products received in a damaged or defective condition",
  "Wrong item received (different from what was ordered)",
  "Items with significant colour variation from product photos",
];

const ineligibleItems = [
  "Items that have been worn, washed, or dry-cleaned",
  "Items with removed tags or missing original packaging",
  "Customised or stitched products",
  "Sale or clearance items marked as Final Sale",
  "Items returned after 7 days from delivery date",
  "Accessories, blouses, or any free gifts",
];

const steps = [
  {
    num: "01",
    icon: <FiRefreshCw size={18} className="text-[var(--secondary)]" />,
    title: "Initiate Your Exchange",
    desc: "Email us at exchange@qalbicouture.com with your order number, reason for exchange, and 1–2 photos of the item. Mention the size or colour you'd like instead. Or use the 'Track Order' page to raise an exchange request.",
  },
  {
    num: "02",
    icon: <FiPackage size={18} className="text-[var(--secondary)]" />,
    title: "Pack the Item",
    desc: "Securely repack the item in its original packaging with all tags attached. Include a slip of paper inside with your order number, name, and the item you'd like in exchange.",
  },
  {
    num: "03",
    icon: <FiTruck size={18} className="text-[var(--secondary)]" />,
    title: "Ship It Back",
    desc: "We'll email you a return address. Ship via any reliable courier and keep the tracking number handy. Note: shipping costs for exchange are borne by you unless the exchange is due to our error.",
  },
  {
    num: "04",
    icon: <FiClock size={18} className="text-[var(--secondary)]" />,
    title: "New Item Dispatched",
    desc: "Once we receive and inspect the item (1–2 business days), we'll dispatch your replacement. You'll get a tracking link as soon as it's shipped — usually within 2 business days of approval.",
  },
];

const faqs = [
  {
    q: "Do you offer refunds?",
    a: "We do not offer direct refunds. All eligible returns are processed as exchanges for a different size, colour, or product of equal value. In case of a damaged or wrong item, we dispatch a replacement immediately.",
  },
  {
    q: "What if the item I want to exchange for is out of stock?",
    a: "If your preferred size or colour is unavailable, we'll offer you a store credit valid for 6 months, which you can use on any future purchase at Qalbi Couture.",
  },
  {
    q: "Can I exchange for a completely different product?",
    a: "Yes! You can exchange for any other product of equal or higher value. If the new item costs more, you'll be asked to pay the difference. We do not refund the price difference if the new item costs less.",
  },
  {
    q: "What if my order arrived damaged?",
    a: "Please email us within 48 hours of delivery with photos of the damage. We'll arrange a free pickup and send a replacement at no extra cost to you.",
  },
  {
    q: "Do you offer free exchanges?",
    a: "Exchange shipping is paid by the customer for change-of-mind requests. However, if you received a wrong or damaged item, we cover the shipping cost entirely on both ends.",
  },
  {
    q: "Can I exchange an unstitched dress material after cutting it?",
    a: "No. Once a fabric has been cut or stitched, it is no longer eligible for exchange. We recommend keeping the fabric intact until you're fully satisfied.",
  },
  {
    q: "My exchange request is past 7 days — what can I do?",
    a: "In exceptional cases (delays in delivery, festival periods, etc.), please write to us. We evaluate late exchange requests on a case-by-case basis.",
  },
];

export default function ExchangePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">
            Exchange Policy
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Easy 7-Day Exchanges
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed max-w-xl">
            Not the right size or colour? No problem. Exchange your purchase
            within 7 days of delivery — simple, hassle-free, no questions asked.
            Please note we do not offer direct refunds.
          </p>

          {/* Quick badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { icon: <FiClock size={13} />, label: "7-Day Exchange Window" },
              {
                icon: <FiRefreshCw size={13} />,
                label: "Size & Colour Exchange",
              },
              {
                icon: <FiCheck size={13} />,
                label: "Exchange or Store Credit",
              },
            ].map((b) => (
              <span
                key={b.label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-600 shadow-sm"
              >
                <span className="text-[var(--secondary)]">{b.icon}</span>
                {b.label}
              </span>
            ))}
          </div>

          {/* No refunds notice */}
          <div className="mt-6 inline-flex items-start gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl max-w-xl">
            <FiAlertCircle
              size={15}
              className="text-amber-500 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Please note:</strong> We do not offer cash refunds or
              payment reversals. All eligible requests are resolved through an
              exchange or store credit.
            </p>
          </div>
        </div>
      </section>

      {/* Eligible vs not eligible */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          What Can Be Exchanged?
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Eligible */}
          <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                <FiCheck size={14} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-green-800">
                Eligible for Exchange
              </h3>
            </div>
            <ul className="space-y-2.5">
              {eligibleItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-green-700"
                >
                  <FiCheck
                    size={14}
                    className="text-green-500 mt-0.5 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* Ineligible */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                <FiX size={14} className="text-red-600" />
              </div>
              <h3 className="font-semibold text-red-800">Not Eligible</h3>
            </div>
            <ul className="space-y-2.5">
              {ineligibleItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-red-700"
                >
                  <FiX
                    size={14}
                    className="text-red-400 mt-0.5 flex-shrink-0"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How to exchange */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-10 text-center"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            How to Exchange in 4 Steps
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative"
              >
                <span
                  className="absolute top-4 right-4 text-4xl font-bold text-gray-100"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {step.num}
                </span>
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exchange timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Exchange Timeline
        </h2>
        <div className="max-w-2xl mx-auto">
          {[
            { day: "Day 1", event: "You ship the item back to us" },
            { day: "Day 3–5", event: "We receive the parcel" },
            { day: "Day 5–6", event: "Quality inspection & exchange approved" },
            {
              day: "Day 6–7",
              event: "Replacement item dispatched with tracking",
            },
            { day: "Day 8–10", event: "New item delivered to your doorstep" },
          ].map((r, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
            >
              <span className="text-xs font-bold text-[var(--secondary)] w-20 flex-shrink-0">
                {r.day}
              </span>
              <div className="w-2 h-2 rounded-full bg-[var(--secondary)] flex-shrink-0" />
              <span className="text-sm text-gray-600">{r.event}</span>
            </div>
          ))}
        </div>

        {/* Store credit note */}
        <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-2xl max-w-2xl mx-auto flex items-start gap-3">
          <FiAlertCircle
            size={16}
            className="text-blue-500 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-blue-700 leading-relaxed">
            <strong>Can't find what you want?</strong> If your preferred item is
            out of stock, we'll issue a <strong>store credit</strong> valid for
            6 months — use it on any future order, no pressure.
          </p>
        </div>

        <div className="mt-4 p-5 bg-amber-50 border border-amber-100 rounded-2xl max-w-2xl mx-auto flex items-start gap-3">
          <FiAlertCircle
            size={16}
            className="text-amber-500 mt-0.5 flex-shrink-0"
          />
          <p className="text-sm text-amber-700 leading-relaxed">
            <strong>COD Orders:</strong> Cash on Delivery orders are not
            eligible for cash refunds. Approved exchanges will be dispatched as
            a replacement order. Store credits will be issued where exchanges
            aren't possible.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Exchange FAQs
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <p className="text-gray-500 text-sm mb-4">
          Ready to start an exchange? Or have more questions?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white rounded-full font-semibold text-sm hover:bg-[#c03535] transition-all shadow-lg shadow-red-200"
          >
            Contact Support <FiArrowRight size={14} />
          </Link>
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-full font-semibold text-sm border border-gray-200 hover:border-gray-300 transition-all"
          >
            Track My Order
          </Link>
        </div>
      </section>
    </div>
  );
}
