"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiChevronDown,
  FiSearch,
  FiX,
  FiPackage,
  FiTruck,
  FiRefreshCw,
  FiShoppingBag,
  FiCreditCard,
  FiHeart,
  FiMail,
  FiArrowRight,
} from "react-icons/fi";

// FAQ data — structured for easy parsing
const FAQ_CATEGORIES = [
  {
    id: "orders",
    label: "Orders & Shopping",
    icon: <FiShoppingBag size={15} />,
    faqs: [
      {
        q: "How do I place an order on Qalbi Couture?",
        a: "Simply browse our shop, select the product you love, choose your size (if applicable), and click 'Add to Cart'. When you're ready, go to your cart and click 'Proceed to Checkout'. Fill in your shipping details, choose a payment method, and confirm your order. You'll receive an order confirmation email immediately.",
      },
      {
        q: "Can I order without creating an account?",
        a: "Yes! You can checkout as a guest without creating an account. However, creating an account lets you track orders, save your addresses, and view your order history for a smoother experience.",
      },
      {
        q: "How do I know if my order was confirmed?",
        a: "Once your order is successfully placed and payment is verified, you'll receive an order confirmation email with your order number, item details, and estimated delivery date. If you don't receive this within 30 minutes, please check your spam folder or contact us.",
      },
      {
        q: "Can I modify or cancel my order after placing it?",
        a: "Order modifications and cancellations can be requested within 2 hours of placing the order by contacting us on WhatsApp (+91 99999 99999) or email. After this window, the order may already be packed and dispatched, making changes difficult. If the order has shipped, our returns process applies.",
      },
      {
        q: "Do you have a minimum order value?",
        a: "No minimum order value is required. However, orders below ₹999 will incur a ₹99 shipping charge. Orders of ₹999 or above qualify for free standard shipping.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Delivery",
    icon: <FiTruck size={15} />,
    faqs: [
      {
        q: "How long does delivery take?",
        a: "Standard shipping takes 5–8 business days. Express shipping (available at checkout for ₹199) takes 2–4 business days. Metro cities like Delhi, Mumbai, and Bangalore typically receive orders faster — often within 3–5 days on standard shipping.",
      },
      {
        q: "Do you ship to all states in India?",
        a: "Yes! We ship pan-India via Delhivery to all 28 states and 8 union territories. Delivery to remote areas and the Northeast may take 7–10 business days.",
      },
      {
        q: "Is there free shipping?",
        a: "Yes! All orders above ₹999 qualify for free standard shipping. For orders below ₹999, a flat ₹99 shipping fee applies. Express shipping is ₹199 regardless of order value.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order ships, you'll receive a tracking link via email and SMS. You can also visit our Track Order page on the website and enter your order number or email address to get real-time updates.",
      },
      {
        q: "What if my package is lost or delayed?",
        a: "If your order is more than 3 days past the estimated delivery date, please contact us at support@qalbicouture.com with your order number. We'll investigate with Delhivery and either track it down or initiate a replacement/refund.",
      },
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "Currently, we accept prepaid orders only (UPI, cards, net banking via Razorpay). COD is not available at this time, but we're working on adding it soon.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns & Refunds",
    icon: <FiRefreshCw size={15} />,
    faqs: [
      {
        q: "What is your return policy?",
        a: "We offer a 7-day return window from the date of delivery. Items must be unused, unwashed, with original tags and packaging intact. Visit our Return Policy page for full eligibility criteria.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email returns@qalbicouture.com with your order number, the item(s) you want to return, reason for return, and 1–2 photos. We'll respond within 24 hours with return instructions.",
      },
      {
        q: "How long does a refund take?",
        a: "After we receive and inspect your return (1–2 days), your refund is processed within 7–10 business days to your original payment method. UPI and wallet refunds may be faster.",
      },
      {
        q: "Can I exchange an item for a different size?",
        a: "Yes! Exchanges are available subject to stock. Mention in your return request that you'd like an exchange, and specify the size/colour you want. We'll confirm availability and process it.",
      },
      {
        q: "Is return shipping free?",
        a: "Return shipping is borne by the customer for change-of-mind returns. If you received a damaged, defective, or wrong item, we cover the return shipping cost in full.",
      },
    ],
  },
  {
    id: "products",
    label: "Products & Sizing",
    icon: <FiHeart size={15} />,
    faqs: [
      {
        q: "What does 'unstitched' mean?",
        a: "An unstitched dress material (or fabric set) comes as separate pieces of fabric — typically a kurta piece, bottom piece, and dupatta — that you take to a tailor of your choice to stitch according to your measurements. This is ideal for a custom fit.",
      },
      {
        q: "How do I know which size to order?",
        a: "Each product page includes a size guide with measurements in inches and centimetres. For unstitched sets, one size generally fits all (since you get it stitched to your measurements). For stitched garments, refer to the size chart carefully.",
      },
      {
        q: "Are the product colours accurate?",
        a: "We photograph all products in natural light and make every effort to display colours accurately. However, screen settings vary across devices, so slight colour variations are possible. If you're unsatisfied with colour after receiving the item, our return policy applies.",
      },
      {
        q: "Are your products handmade or machine-made?",
        a: "It depends on the item. Many of our premium and Pakistani suit collections feature hand embroidery by skilled artisans. Our printed dress materials are digitally or screen printed. Each product description clearly mentions the work type.",
      },
      {
        q: "Do you restock sold-out products?",
        a: "Some bestsellers are restocked; others are one-time collections that may not return. The best way to know is to contact us or sign up to our newsletter — we announce restocks there first.",
      },
    ],
  },
  {
    id: "payment",
    label: "Payment & Security",
    icon: <FiCreditCard size={15} />,
    faqs: [
      {
        q: "What payment methods do you accept?",
        a: "We accept all major payment methods via Razorpay: UPI (GPay, PhonePe, Paytm, BHIM), debit/credit cards (Visa, Mastercard, RuPay), net banking (50+ banks), and popular wallets (Paytm, Amazon Pay, etc.).",
      },
      {
        q: "Is it safe to pay on your website?",
        a: "Absolutely. All payments are processed through Razorpay, which is PCI DSS Level 1 compliant — the highest level of payment security. We never see or store your card or UPI details. Our website uses SSL/TLS encryption for all data transmission.",
      },
      {
        q: "Why did my payment fail?",
        a: "Payment failures can occur due to: insufficient funds, bank server downtime, incorrect card details, or UPI app issues. If your payment failed but money was deducted, please contact us immediately with the transaction ID — we'll verify and refund within 24 hours.",
      },
      {
        q: "Can I pay in EMI?",
        a: "EMI options are available via Razorpay for eligible credit cards (HDFC, SBI, ICICI, Axis, etc.). During checkout, select 'EMI' as the payment method and choose your preferred tenure (3, 6, 9, or 12 months).",
      },
      {
        q: "Do you offer any discounts or promo codes?",
        a: "Yes! We occasionally run promotions for new customers, festivals, and newsletter subscribers. Follow us on Instagram and sign up to our newsletter to stay updated on the latest offers. Promo codes can be applied at checkout.",
      },
    ],
  },
  {
    id: "account",
    label: "Account & Support",
    icon: <FiMail size={15} />,
    faqs: [
      {
        q: "How do I contact customer support?",
        a: "You can reach us via: Email (support@qalbicouture.com) — we reply within 24 hours. WhatsApp (+91 99999 99999) — fastest response, usually within a few hours. Our Contact Us form on the website. We're available Monday–Saturday, 10 AM – 7 PM IST.",
      },
      {
        q: "I received a wrong item — what should I do?",
        a: "We sincerely apologise! Please email us at support@qalbicouture.com within 48 hours of delivery with your order number and photos of what you received. We'll arrange a free pickup and send the correct item — or issue a full refund if the correct item is unavailable.",
      },
      {
        q: "Can I buy in bulk or wholesale?",
        a: "Yes, we welcome bulk and wholesale enquiries! Please contact us at bulk@qalbicouture.com with your requirements (product types, quantities, delivery location). We'll get back to you with special pricing within 48 hours.",
      },
      {
        q: "Do you have a physical store?",
        a: "Our main operations are online, but we have a small showroom in Chandni Chowk, Delhi, where you can view fabrics by appointment. Contact us to schedule a visit.",
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("orders");
  const [openItem, setOpenItem] = useState(null);
  const [search, setSearch] = useState("");

  const toggleItem = (id) => setOpenItem((prev) => (prev === id ? null : id));

  const allFaqs = FAQ_CATEGORIES.flatMap((c) =>
    c.faqs.map((f) => ({ ...f, categoryId: c.id })),
  );

  const searchResults =
    search.trim().length > 1
      ? allFaqs.filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase()),
        )
      : null;

  const activeData = FAQ_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">
            Help Centre
          </p>
          <h1
            className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Frequently Asked Questions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Everything you need to know about shopping with Qalbi Couture —
            orders, shipping, returns, payments, and more.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <FiSearch
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions… e.g. 'track order'"
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm shadow-sm focus:outline-none focus:border-[var(--secondary)] transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FiX size={15} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Search results */}
        {searchResults !== null ? (
          <div>
            <p className="text-sm text-gray-500 mb-6">
              {searchResults.length === 0
                ? "No results found."
                : `${searchResults.length} result${searchResults.length !== 1 ? "s" : ""} for "${search}"`}
            </p>
            {searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 font-medium">
                  No matching questions
                </p>
                <p className="text-sm text-gray-400 mt-2 mb-6">
                  Try different keywords or browse the categories below
                </p>
                <button
                  onClick={() => setSearch("")}
                  className="px-5 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((faq, i) => {
                  const id = `search-${i}`;
                  return (
                    <FaqItem
                      key={id}
                      id={id}
                      question={faq.q}
                      answer={faq.a}
                      isOpen={openItem === id}
                      onToggle={toggleItem}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Category sidebar */}
            <aside className="lg:w-52 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Categories
                </p>
                <nav className="flex lg:flex-col gap-2 flex-wrap">
                  {FAQ_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setOpenItem(null);
                      }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left w-full ${
                        activeCategory === cat.id
                          ? "bg-[var(--secondary)] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* FAQ accordion */}
            <div className="flex-1">
              {activeData && (
                <>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center text-[var(--secondary)]">
                      {activeData.icon}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                      {activeData.label}
                    </h2>
                    <span className="ml-auto text-xs text-gray-400">
                      {activeData.faqs.length} questions
                    </span>
                  </div>
                  <div className="space-y-3">
                    {activeData.faqs.map((faq, i) => {
                      const id = `${activeCategory}-${i}`;
                      return (
                        <FaqItem
                          key={id}
                          id={id}
                          question={faq.q}
                          answer={faq.a}
                          isOpen={openItem === id}
                          onToggle={toggleItem}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Still need help */}
        <div className="mt-14 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 sm:p-10 text-center border border-rose-100">
          <div className="w-12 h-12 bg-[var(--secondary)] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiMail size={20} className="text-white" />
          </div>
          <h3
            className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Didn't Find Your Answer?
          </h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
            Our support team is available Monday–Saturday, 10 AM – 7 PM IST. We
            typically reply within a few hours.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--secondary)] text-white rounded-full font-semibold text-sm hover:bg-[#c03535] transition-all shadow-lg shadow-red-200"
            >
              Contact Us <FiArrowRight size={14} />
            </Link>
            <a
              href="https://wa.me/918130421960

"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold text-sm hover:bg-green-600 transition-all shadow-lg shadow-green-200"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <div
      className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden ${isOpen ? "border-[var(--secondary)]/30 shadow-sm" : "border-gray-100"}`}
    >
      <button
        onClick={() => onToggle(id)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className={`text-sm font-semibold leading-relaxed transition-colors ${isOpen ? "text-[var(--secondary)]" : "text-gray-900"}`}
        >
          {question}
        </span>
        <FiChevronDown
          size={16}
          className={`flex-shrink-0 mt-0.5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-[var(--secondary)]" : ""}`}
        />
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-5 pb-5">
          <div className="h-px bg-gray-100 mb-4" />
          <p className="text-sm text-gray-500 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
