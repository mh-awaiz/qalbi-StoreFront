import { Poppins } from "next/font/google";
import "./globals.css";
import ConditionalShell from "./components/ConditionalShell";
import { CartProvider } from "./context/CartContext";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://www.qalbicouture.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Qalbi Couture — Premium Ethnic Wear | Dress Materials, Pakistani Suits, Salwar Kameez",
    template: "%s | Qalbi Couture",
  },
  description:
    "Shop premium ethnic wear at Qalbi Couture — handpicked dress materials, Pakistani suits, and salwar kameez delivered across India. Free shipping above ₹999. Easy 7-day returns.",
  keywords: [
    "Qalbi Couture",
    "ethnic wear India",
    "dress materials online",
    "Pakistani suits India",
    "salwar kameez online",
    "buy ethnic wear Delhi",
    "unstitched dress material",
    "Chiffon suit online",
    "Georgette dress material",
    "embroidered suits India",
    "buy salwar kameez online India",
    "best ethnic wear brand India",
  ],
  authors: [{ name: "Qalbi Couture", url: siteUrl }],
  creator: "Qalbi Couture",
  publisher: "Qalbi Couture",
  formatDetection: { telephone: true, email: true },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Qalbi Couture",
    title: "Qalbi Couture — Premium Ethnic Wear",
    description:
      "Handpicked dress materials, Pakistani suits & salwar kameez. Free shipping above ₹999. Easy returns.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Qalbi Couture — Premium Ethnic Wear Collections",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qalbi Couture — Premium Ethnic Wear",
    description:
      "Handpicked dress materials, Pakistani suits & salwar kameez. Free shipping above ₹999.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: siteUrl },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Organization structured data
const orgStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Qalbi Couture",
  url: siteUrl,
  logo: `${siteUrl}/logo.avif`,
  description:
    "Premium ethnic wear brand — dress materials, Pakistani suits, and salwar kameez delivered across India.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jamia Nagar, Okhla",
    addressLocality: "Delhi",
    postalCode: "110025",
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+91 81304 21960",
    contactType: "customer service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: [
    "https://www.instagram.com/qalbi_couture/",
    "https://www.facebook.com/qalbicouture",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JHC2LDSEK8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JHC2LDSEK8');
          `}
        </Script>

        {/*Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(orgStructuredData),
          }}
        />
        <meta
          name="google-site-verification"
          content="MRBYKHpOA65wMeP5_F7ZjyPSpcijC_-SxoyV_VgfRkM"
        />

        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
    !function(f,b,e,v,n,t,s)
    {
      if(f.fbq)return;
      n=f.fbq=function(){
        n.callMethod ?
        n.callMethod.apply(n,arguments) : n.queue.push(arguments)
      };
      if(!f._fbq)f._fbq=n;
      n.push=n;
      n.loaded=!0;
      n.version='2.0';
      n.queue=[];
      t=b.createElement(e);
      t.async=!0;
      t.src=v;
      s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s);
    }(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', '2884133501797938');
    fbq('track', 'PageView');
  `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2884133501797938&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>

      <body
        className={`${poppins.variable} antialiased bg-[var(--primary)] min-h-screen`}
      >
        <CartProvider>
          <div className="overflow-x-hidden min-h-screen">
            <ConditionalShell>{children}</ConditionalShell>
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
