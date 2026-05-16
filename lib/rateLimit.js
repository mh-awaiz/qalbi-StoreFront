/**
 * lib/rateLimit.js
 * ---------------------------------------------------------------------------
 * Lightweight in-memory sliding-window rate limiter for Next.js API routes.
 * No Redis or external dependency required — works on Vercel Edge + Node.
 *
 * Usage:
 *   import { rateLimit, rateLimitResponse } from "@/lib/rateLimit";
 *
 *   export async function GET(request) {
 *     const { success, remaining, reset } = rateLimit(request, "collections", 30, 60);
 *     if (!success) return rateLimitResponse(reset);
 *     // ... your handler
 *   }
 *
 * Parameters:
 *   request  — the NextRequest object (used to extract IP)
 *   key      — a string namespace so different routes share separate buckets
 *   limit    — max requests allowed per window (default 60)
 *   windowSec— window length in seconds (default 60)
 * ---------------------------------------------------------------------------
 */

// Global store — survives across requests within the same serverless instance.
// On Vercel each lambda instance has its own store, which is fine: the limiter
// is a "best effort" defence against abuse, not a strict global counter.
const store = new Map(); // Map<bucketKey, { count, resetAt }>

/**
 * Derive the caller's IP from the incoming request.
 * Vercel sets x-forwarded-for; fallback to a fixed string so the limiter
 * still works in local dev (where there's no real IP header).
 */
function getIP(request) {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

/**
 * Check and increment the rate-limit counter for this IP + key.
 *
 * @returns {{ success: boolean, remaining: number, reset: number }}
 *   success   — true if the request is within the limit
 *   remaining — how many requests are left in this window
 *   reset     — Unix timestamp (seconds) when the window resets
 */
export function rateLimit(request, key = "default", limit = 60, windowSec = 60) {
  const ip = getIP(request);
  const bucketKey = `${ip}::${key}`;
  const now = Math.floor(Date.now() / 1000);

  let bucket = store.get(bucketKey);

  // Start a fresh window if none exists or the previous window has expired
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowSec };
  }

  bucket.count += 1;
  store.set(bucketKey, bucket);

  // Periodically evict expired entries so the Map doesn't grow forever.
  // Run cleanup ~1% of the time to keep overhead negligible.
  if (Math.random() < 0.01) {
    for (const [k, v] of store.entries()) {
      if (now >= v.resetAt) store.delete(k);
    }
  }

  const remaining = Math.max(0, limit - bucket.count);
  const success = bucket.count <= limit;

  return { success, remaining, reset: bucket.resetAt };
}

/**
 * Build a 429 Too Many Requests response with standard Retry-After headers.
 */
export function rateLimitResponse(resetAt) {
  const retryAfter = Math.max(1, resetAt - Math.floor(Date.now() / 1000));
  return new Response(
    JSON.stringify({
      success: false,
      error: "Too many requests. Please slow down.",
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": "see route config",
        "X-RateLimit-Reset": String(resetAt),
      },
    }
  );
}
