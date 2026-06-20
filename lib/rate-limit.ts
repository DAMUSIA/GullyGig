/**
 * lib/rate-limit.ts
 *
 * IP-based and user-based rate limiting for API routes.
 * Uses in-memory store (suitable for single-instance dev/staging).
 *
 * For multi-instance production, replace the MemoryStore with
 * Upstash Redis by setting UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN env vars and wiring in @upstash/ratelimit.
 */

export interface RateLimitConfig {
  /** Maximum number of requests in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests this window */
  remaining: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
  /** HTTP-ready headers to attach to the response */
  headers: Record<string, string>;
}

// Endpoint-specific configurations
export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  auth: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 req / 15 min
  likes: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 req / min
  reviews: { maxRequests: 10, windowMs: 60 * 1000 }, // 10 req / min
  default: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 req / min
};

interface WindowEntry {
  count: number;
  windowStart: number;
}

// In-memory store — keyed by "{endpoint}:{identifier}"
const store = new Map<string, WindowEntry>();

// Clean up expired windows periodically to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      const config =
        RATE_LIMIT_CONFIGS[key.split(":")[0]] ?? RATE_LIMIT_CONFIGS.default;
      if (now - entry.windowStart > config.windowMs) {
        store.delete(key);
      }
    }
  }, 60_000);
}

/**
 * Check and record a rate-limit hit.
 *
 * @param endpoint  One of "auth" | "likes" | "reviews" | "default"
 * @param identifier  IP address or user ID
 */
export function rateLimit(
  endpoint: string,
  identifier: string,
): RateLimitResult {
  const config = RATE_LIMIT_CONFIGS[endpoint] ?? RATE_LIMIT_CONFIGS.default;
  const key = `${endpoint}:${identifier}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || now - entry.windowStart > config.windowMs) {
    // Start a fresh window
    store.set(key, { count: 1, windowStart: now });
    const resetAt = now + config.windowMs;
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt,
      headers: {
        "X-RateLimit-Limit": String(config.maxRequests),
        "X-RateLimit-Remaining": String(config.maxRequests - 1),
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
      },
    };
  }

  const newCount = entry.count + 1;
  store.set(key, { ...entry, count: newCount });

  const resetAt = entry.windowStart + config.windowMs;
  const remaining = Math.max(0, config.maxRequests - newCount);

  if (newCount > config.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetAt,
      headers: {
        "X-RateLimit-Limit": String(config.maxRequests),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
        "Retry-After": String(Math.ceil((resetAt - now) / 1000)),
      },
    };
  }

  return {
    success: true,
    remaining,
    resetAt,
    headers: {
      "X-RateLimit-Limit": String(config.maxRequests),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
    },
  };
}

/**
 * Extract the best available IP identifier from a Request.
 * Falls back to a constant for environments without IP headers (e.g. local dev).
 */
export function getIdentifier(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1"
  );
}
