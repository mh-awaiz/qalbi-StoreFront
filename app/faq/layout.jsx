export const metadata = {
  title: "FAQ — Qalbi Couture | Frequently Asked Questions",
  description:
    "Find answers to all your questions about Qalbi Couture — orders, shipping, returns, payments, and product details. 30+ questions answered by our support team.",
  keywords: [
    "Qalbi Couture FAQ",
    "frequently asked questions ethnic wear",
    "shipping returns questions Qalbi",
    "how to order Pakistani suits online",
    "dress material return policy questions",
    "Qalbi Couture help",
  ],
  openGraph: {
    title: "FAQ — Qalbi Couture | Frequently Asked Questions",
    description:
      "Everything you need to know — orders, shipping, returns, payments. 30+ questions answered.",
    url: "https://www.qalbicouture.com/faq",
  },
  alternates: { canonical: "https://www.qalbicouture.com/faq" },
};

// JSON-LD structured data for FAQ rich results in Google
const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How long does delivery take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard shipping takes 5–8 business days. Express shipping takes 2–4 business days across India.",
      },
    },
    {
      "@type": "Question",
      name: "What is the return policy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We offer a 7-day return window from the date of delivery. Items must be unused, unwashed, with original tags and packaging intact.",
      },
    },
    {
      "@type": "Question",
      name: "Is there free shipping?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! All orders above ₹999 qualify for free standard shipping. For orders below ₹999, a flat ₹99 shipping fee applies.",
      },
    },
    {
      "@type": "Question",
      name: "What payment methods do you accept?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We accept UPI, debit/credit cards, net banking, and popular wallets via Razorpay.",
      },
    },
    {
      "@type": "Question",
      name: "Do you ship to all states in India?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we ship pan-India via Delhivery to all 28 states and 8 union territories.",
      },
    },
    {
      "@type": "Question",
      name: "What does unstitched mean?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An unstitched dress material comes as separate fabric pieces (kurta, bottom, dupatta) that you take to a tailor for stitching according to your measurements.",
      },
    },
    {
      "@type": "Question",
      name: "How do I track my order?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Once shipped, you'll receive a tracking link via email and SMS. You can also use our Track Order page on the website.",
      },
    },
    {
      "@type": "Question",
      name: "Can I exchange an item for a different size?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, exchanges are available subject to stock. Mention in your return request that you'd like an exchange with the size or colour you want.",
      },
    },
  ],
};

export default function FAQLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      {children}
    </>
  );
}
