"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FiMail, FiPhone, FiMapPin, FiInstagram, FiFacebook,
  FiSend, FiCheck, FiLoader, FiClock, FiMessageSquare,
  FiPackage, FiArrowRight,
} from "react-icons/fi";

const contactMethods = [
  {
    icon: <FiMail size={20} className="text-[var(--secondary)]" />,
    title: "Email Us",
    value: "info@qalbicouture.com",
    sub: "We reply within 24 hours",
    href: "mailto:info@qalbicouture.com",
  },
  {
    icon: <FiPhone size={20} className="text-[var(--secondary)]" />,
    title: "Call / WhatsApp",
    value: "+91 81304 21960",
    sub: "Mon–Sat, 10 AM – 7 PM IST",
    href: "tel:+918130421960",
  },
  {
    icon: <FiMapPin size={20} className="text-[var(--secondary)]" />,
    title: "Our Address",
    value: "Jamia Nagar, New Delhi 110025",
    sub: "India",
    href: "https://www.google.com/maps/place/Qalbi+Couture/@28.5436465,77.3002281,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce52b02b54f0f:0x64ead592f349210a!8m2!3d28.5436465!4d77.3028084!16s%2Fg%2F11yrdmfp_p?entry=ttu&g_ep=EgoyMDI2MDMxNy4wIKXMDSoASAFQAw%3D%3D",
  },
];

const faqs = [
  { q: "How long does shipping take?", a: "Most orders are delivered within 5–8 business days. Express shipping (2–4 days) is available at checkout." },
  { q: "Can I return or exchange a product?", a: "Yes! We offer hassle-free returns within 7 days of delivery. See our Return Policy for full details." },
  { q: "Do you ship outside India?", a: "Currently we ship across all states in India. International shipping is coming soon — join our newsletter to be notified." },
  { q: "How do I track my order?", a: "Once shipped, you'll receive a tracking link via email and SMS. You can also use our Track Order page anytime." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in name, email, and message.");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send message");
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <div className="max-w-xl">
            <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">
              Contact Us
            </p>
            <h1
              className="text-4xl sm:text-5xl font-semibold text-gray-900 leading-tight mb-4"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              We'd Love to Hear From You
            </h1>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Have a question about an order? Need help choosing the right
              fabric? Or just want to say hello? Reach out — we're always happy
              to help.
            </p>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          {contactMethods.map((m) => (
            <a
              key={m.title}
              href={m.href}
              target={m.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all group"
            >
              <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center mb-4 group-hover:bg-red-100 transition-colors">
                {m.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                {m.title}
              </h3>
              <p className="text-sm text-[var(--secondary)] font-medium">
                {m.value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
            </a>
          ))}
        </div>

        {/* Form + FAQ grid */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Contact form */}
          <div>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Send Us a Message
            </h2>

            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiCheck size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 text-sm mb-5">
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => {
                    setSent(false);
                    setForm({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "",
                      message: "",
                    });
                  }}
                  className="px-5 py-2.5 bg-[var(--secondary)] text-white rounded-xl text-sm font-medium hover:bg-[#c03535] transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Ayesha Sharma"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Subject
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all"
                  >
                    <option value="">Select a topic...</option>
                    <option>Order Issue</option>
                    <option>Return / Exchange</option>
                    <option>Product Query</option>
                    <option>Shipping Delay</option>
                    <option>Bulk / Wholesale Enquiry</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                    Message *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[var(--secondary)] focus:bg-white transition-all resize-none"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center gap-2 px-7 py-3.5 bg-[var(--secondary)] text-white rounded-xl font-semibold text-sm hover:bg-[#c03535] transition-all shadow-sm disabled:opacity-60"
                >
                  {sending ? (
                    <FiLoader size={15} className="animate-spin" />
                  ) : (
                    <FiSend size={15} />
                  )}
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          {/* FAQ + social */}
          <div>
            <h2
              className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Quick Answers
            </h2>
            <div className="space-y-4 mb-10">
              {faqs.map((faq) => (
                <div
                  key={faq.q}
                  className="bg-white rounded-2xl p-5 border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <FiMessageSquare
                      size={14}
                      className="text-[var(--secondary)] mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {faq.q}
                      </p>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick links */}
            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                Helpful Links
              </h3>
              <div className="space-y-2">
                {[
                  {
                    icon: <FiPackage size={13} />,
                    label: "Track Your Order",
                    href: "/track-order",
                  },
                  {
                    icon: <FiClock size={13} />,
                    label: "Return Policy",
                    href: "/returns",
                  },
                  {
                    icon: <FiArrowRight size={13} />,
                    label: "Shipping Information",
                    href: "/shipping",
                  },
                  {
                    icon: <FiArrowRight size={13} />,
                    label: "FAQ — Full Guide",
                    href: "/faq",
                  },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[var(--secondary)] transition-colors py-1"
                  >
                    <span className="text-[var(--secondary)]">{l.icon}</span>
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-5 pt-5 border-t border-rose-100">
                <p className="text-xs font-semibold text-gray-600 mb-3">
                  Follow Us
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://www.instagram.com/qalbi_couture/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:border-rose-300 hover:text-[var(--secondary)] transition-all"
                  >
                    <FiInstagram size={13} /> Instagram
                  </a>
                  <a
                    href="https://www.facebook.com/qalbicouture"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl text-xs font-medium text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    <FiFacebook size={13} /> Facebook
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
