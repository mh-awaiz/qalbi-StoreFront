/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "**.myshopify.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },

  // ── Global HTTP response headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        // Static pages — cache at CDN for 1 hour, stale-while-revalidate 24 h
        source: "/((?!api/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=3600, stale-while-revalidate=86400",
          },
          // Basic security headers
          { key: "X-Content-Type-Options",   value: "nosniff" },
          { key: "X-Frame-Options",          value: "SAMEORIGIN" },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // API routes — no public caching by default (each route sets its own)
        source: "/api/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options",        value: "DENY" },
        ],
      },
    ];
  },
};

export default nextConfig;
