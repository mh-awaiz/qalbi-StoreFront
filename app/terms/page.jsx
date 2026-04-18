import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Terms of Service — Qalbi Couture",
  description:
    "Read the Terms of Service for Qalbi Couture. Understand the rules, rights, and responsibilities when using our website and purchasing our products.",
  keywords: [
    "Qalbi Couture terms of service",
    "terms and conditions ethnic wear",
    "online shopping terms India",
    "purchase terms Qalbi",
  ],
  openGraph: {
    title: "Terms of Service — Qalbi Couture",
    description: "Terms and conditions governing your use of qalbicouture.com and purchase of our products.",
    url: "https://www.qalbicouture.com/terms",
  },
  alternates: { canonical: "https://www.qalbicouture.com/terms" },
};

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: `By accessing or using the Qalbi Couture website (qalbicouture.com) or placing an order with us, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website or services.

These terms apply to all visitors, users, and customers of our website. We reserve the right to update these terms at any time. Continued use of the site after changes constitutes your acceptance of the revised terms.`,
  },
  {
    id: "eligibility",
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to place an order on qalbicouture.com. By using this site, you represent and warrant that you are 18 years or older and legally capable of entering into a binding contract.

If you are placing an order on behalf of a business, you warrant that you have authority to bind that business to these terms.`,
  },
  {
    id: "products",
    title: "3. Products & Pricing",
    content: `All products listed on our website are subject to availability. We reserve the right to discontinue any product at any time without notice.

Prices are displayed in Indian Rupees (INR) and are inclusive of applicable taxes. Prices are subject to change without notice; however, orders already placed will be honoured at the price at the time of purchase.

We make every effort to display product colors and details accurately, but screen variations may cause slight differences in appearance. If you are unsatisfied with a product's appearance, our returns policy applies.`,
  },
  {
    id: "orders",
    title: "4. Orders & Payment",
    content: `Placing an order on our website constitutes an offer to purchase. We reserve the right to accept or decline any order at our discretion — for example, if a product is out of stock, if the order contains a pricing error, or if we suspect fraudulent activity.

Payment is processed securely via Razorpay. We accept UPI, debit/credit cards, net banking, and wallet payments. You agree to provide accurate and complete payment information.

You will receive an order confirmation email once your order is accepted. An order is not confirmed until you receive this email.`,
  },
  {
    id: "shipping",
    title: "5. Shipping & Delivery",
    content: `We ship across India via Delhivery. Estimated delivery times are 5–8 business days for standard shipping and 2–4 business days for express shipping. These are estimates and not guarantees.

Qalbi Couture is not responsible for delays caused by courier issues, natural disasters, or other events beyond our control. If your order is significantly delayed, please contact us and we will investigate with the courier.

Free shipping is available on all orders above ₹999. A flat ₹99 shipping charge applies to orders below this threshold.`,
  },
  {
    id: "returns",
    title: "6. Returns & Refunds",
    content: `We offer a 7-day return window from the date of delivery. Products must be unused, unwashed, and in original packaging with tags intact.

Refunds are processed within 7–10 business days of receiving the returned item. Please refer to our full Return Policy for details on eligible products and the return process.

We are not responsible for return shipping costs unless the return is due to our error (wrong item, damaged product, etc.).`,
  },
  {
    id: "intellectual-property",
    title: "7. Intellectual Property",
    content: `All content on qalbicouture.com — including product images, descriptions, logos, graphics, and text — is the property of Qalbi Couture and is protected by Indian copyright law.

You may not reproduce, distribute, or commercially exploit any content from our website without our prior written permission. You may share product pages via social media for personal, non-commercial purposes.`,
  },
  {
    id: "prohibited",
    title: "8. Prohibited Uses",
    content: `You agree not to use our website to: (a) violate any applicable laws or regulations; (b) transmit spam, malware, or harmful code; (c) harvest user data without permission; (d) interfere with the security or functionality of the site; (e) post false or misleading reviews; (f) engage in fraudulent transactions or chargebacks.

We reserve the right to suspend or terminate any account found to be in violation of these prohibitions.`,
  },
  {
    id: "liability",
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, Qalbi Couture shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our website or products. Our total liability to you for any claim shall not exceed the amount you paid for the specific product in question.

We make no warranties — express or implied — regarding the accuracy, completeness, or fitness for purpose of any content or product on our site.`,
  },
  {
    id: "governing-law",
    title: "10. Governing Law & Disputes",
    content: `These Terms of Service are governed by the laws of India. Any dispute arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Delhi, India.

If you have a complaint, we encourage you to contact us first at support@qalbicouture.com to resolve the matter amicably before initiating legal proceedings.`,
  },
  {
    id: "contact-terms",
    title: "11. Contact",
    content: `For questions about these Terms of Service, please contact us at:
Email: legal@qalbicouture.com
Address: Qalbi Couture, Chandni Chowk, Delhi – 110006, India`,
  },
];

export default function TermsPage() {
  const lastUpdated = "1 January 2025";

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-gray-50 to-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <p className="text-xs text-[var(--secondary)] font-semibold tracking-widest uppercase mb-3">Legal</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
            Terms of Service
          </h1>
          <p className="text-gray-500 text-sm">Last updated: <strong className="text-gray-700">{lastUpdated}</strong></p>
          <p className="text-gray-500 text-sm mt-2 max-w-xl leading-relaxed">
            Please read these terms carefully before using our website or placing an order. They govern your relationship with Qalbi Couture.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contents</p>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`} className="block text-sm text-gray-500 hover:text-[var(--secondary)] transition-colors py-1 leading-snug">{s.title}</a>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 space-y-10">
            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <div className="space-y-3">
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-sm text-gray-500 leading-relaxed">{para}</p>
                  ))}
                </div>
                <div className="mt-8 border-b border-gray-100" />
              </section>
            ))}

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                <strong className="text-gray-900">Need help?</strong> If you have any questions about these terms, our team is happy to clarify.
              </p>
              <div className="flex gap-4">
                <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--secondary)] hover:underline underline-offset-4">Contact Us <FiArrowRight size={13} /></Link>
                <Link href="/privacy" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Privacy Policy <FiArrowRight size={13} /></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
