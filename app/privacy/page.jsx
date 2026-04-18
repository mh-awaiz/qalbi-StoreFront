import Link from "next/link";
import { FiShield, FiLock, FiEye, FiServer, FiMail, FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Privacy Policy — Qalbi Couture",
  description:
    "Read Qalbi Couture's Privacy Policy. Understand how we collect, use, and protect your personal information when you shop with us.",
  keywords: [
    "Qalbi Couture privacy policy",
    "data protection ethnic wear",
    "personal information policy India",
    "online shopping privacy",
  ],
  openGraph: {
    title: "Privacy Policy — Qalbi Couture",
    description: "How Qalbi Couture collects, uses, and protects your personal information.",
    url: "https://www.qalbicouture.com/privacy",
  },
  alternates: { canonical: "https://www.qalbicouture.com/privacy" },
  robots: { index: true, follow: true },
};

const sections = [
  {
    id: "information-we-collect",
    icon: <FiEye size={18} className="text-[var(--secondary)]" />,
    title: "1. Information We Collect",
    content: [
      {
        subtitle: "Information You Provide",
        text: "When you place an order, create an account, or contact us, we collect: your full name, email address, phone number, shipping address, and payment details (processed securely via Razorpay — we never store card numbers).",
      },
      {
        subtitle: "Information Collected Automatically",
        text: "We automatically collect certain data when you visit our site: your IP address, browser type, device information, pages visited, and referring URLs. This helps us improve your shopping experience.",
      },
      {
        subtitle: "Cookies",
        text: "We use cookies and similar tracking technologies to remember your cart, preferences, and login session. You can disable cookies in your browser settings, though some features may not work correctly.",
      },
    ],
  },
  {
    id: "how-we-use",
    icon: <FiServer size={18} className="text-[var(--secondary)]" />,
    title: "2. How We Use Your Information",
    content: [
      {
        subtitle: "Order Processing",
        text: "We use your name, address, and contact details to process orders, arrange delivery, and send you order confirmation, shipping updates, and delivery notifications.",
      },
      {
        subtitle: "Customer Support",
        text: "Your contact details are used to respond to queries, resolve disputes, and handle returns or complaints efficiently.",
      },
      {
        subtitle: "Marketing Communications",
        text: "If you opt in, we may send you promotional emails about new collections, exclusive offers, and fashion updates. You can unsubscribe at any time using the link in any email.",
      },
      {
        subtitle: "Analytics & Improvement",
        text: "Aggregated, anonymised data helps us understand how customers use our website so we can improve the shopping experience. We do not sell this data.",
      },
    ],
  },
  {
    id: "data-sharing",
    icon: <FiShield size={18} className="text-[var(--secondary)]" />,
    title: "3. Data Sharing & Third Parties",
    content: [
      {
        subtitle: "Delivery Partners",
        text: "We share your name, address, and phone number with Delhivery (our logistics partner) solely for order delivery purposes. They are contractually obligated to protect your data.",
      },
      {
        subtitle: "Payment Processors",
        text: "Payments are processed by Razorpay, which maintains its own privacy and security standards. We do not store or have access to your full payment card details.",
      },
      {
        subtitle: "No Sale of Data",
        text: "We do not sell, rent, or trade your personal information to any third party for marketing purposes — ever. Your data is used only to fulfil your order and improve our service.",
      },
    ],
  },
  {
    id: "data-security",
    icon: <FiLock size={18} className="text-[var(--secondary)]" />,
    title: "4. Data Security",
    content: [
      {
        text: "We implement industry-standard security measures including SSL/TLS encryption for all data transmitted on our website. Our servers are hosted on secure cloud infrastructure with access controls and regular security audits. While no system is 100% immune to breaches, we take every reasonable precaution to protect your data.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: [
      {
        text: "You have the right to: (a) access the personal data we hold about you; (b) request correction of inaccurate data; (c) request deletion of your data (subject to legal obligations); (d) withdraw consent for marketing communications at any time; (e) raise a complaint with us if you believe your data has been misused.",
      },
      {
        text: "To exercise any of these rights, contact us at privacy@qalbicouture.com or use the contact form on our website.",
      },
    ],
  },
  {
    id: "cookies-policy",
    title: "6. Cookies Policy",
    content: [
      {
        text: "Our website uses the following types of cookies: Essential cookies (required for the site to function, including your shopping cart and session); Analytical cookies (help us understand how visitors use the site — we use anonymised data only); Preference cookies (remember your settings such as language and currency). You can control cookie settings via your browser.",
      },
    ],
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    content: [
      {
        text: "Our website is not directed at children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately and we will delete it.",
      },
    ],
  },
  {
    id: "updates",
    title: "8. Updates to This Policy",
    content: [
      {
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we make material changes, we will notify you via email or a prominent notice on our website. The date of the most recent revision is shown at the top of this page.",
      },
    ],
  },
  {
    id: "contact",
    icon: <FiMail size={18} className="text-[var(--secondary)]" />,
    title: "9. Contact & Grievance",
    content: [
      {
        text: "For any privacy-related concerns, questions, or requests, please contact our Privacy Officer at: privacy@qalbicouture.com or write to us at: Qalbi Couture, Chandni Chowk, Delhi – 110006, India. We aim to respond to all privacy requests within 7 working days.",
      },
    ],
  },
];

export default function PrivacyPage() {
  const lastUpdated = "1 January 2025";

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Last updated: <strong className="text-gray-700">{lastUpdated}</strong>
          </p>
          <p className="text-gray-500 text-sm mt-2 max-w-xl leading-relaxed">
            At Qalbi Couture, we take your privacy seriously. This policy explains what data we collect, how we use it, and your rights regarding your personal information.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Table of contents */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contents</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}
                    className="block text-sm text-gray-500 hover:text-[var(--secondary)] transition-colors py-1 leading-snug">
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-2.5 mb-4">
                  {section.icon && <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">{section.icon}</div>}
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((block, i) => (
                    <div key={i}>
                      {block.subtitle && <h3 className="text-sm font-semibold text-gray-800 mb-1.5">{block.subtitle}</h3>}
                      <p className="text-sm text-gray-500 leading-relaxed">{block.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-b border-gray-100" />
              </section>
            ))}

            <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong className="text-gray-900">Questions about this policy?</strong> We're happy to help.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4">
                Contact Us <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
