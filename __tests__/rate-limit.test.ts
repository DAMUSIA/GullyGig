import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  rateLimit,
  getIdentifier,
  RATE_LIMIT_CONFIGS,
} from "../lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests within the limit", () => {
    const config = RATE_LIMIT_CONFIGS["reviews"]; // 10 req/min
    for (let i = 0; i < config.maxRequests; i++) {
      const result = rateLimit("reviews", `test-ip-allow-${Date.now()}-${i}`);
      expect(result.success).toBe(true);
    }
  });

  it("allows first request and returns correct remaining count", () => {
    const result = rateLimit("likes", "ip-first-request");
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT_CONFIGS["likes"].maxRequests - 1);
  });

  it("blocks requests after exceeding the limit", () => {
    const identifier = "ip-block-test-" + Date.now();
    const config = RATE_LIMIT_CONFIGS["auth"]; // 5 req / 15 min

    for (let i = 0; i < config.maxRequests; i++) {
      rateLimit("auth", identifier);
    }

    // Next request should be blocked
    const result = rateLimit("auth", identifier);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.headers["Retry-After"]).toBeDefined();
  });

  it("resets the window after windowMs has passed", () => {
    const identifier = "ip-reset-test-" + Date.now();
    const config = RATE_LIMIT_CONFIGS["auth"]; // 5 req / 15 min

    for (let i = 0; i < config.maxRequests; i++) {
      rateLimit("auth", identifier);
    }

    // Advance time past the window
    vi.advanceTimersByTime(config.windowMs + 1);

    const result = rateLimit("auth", identifier);
    expect(result.success).toBe(true);
  });

  it("applies per-endpoint configs independently", () => {
    const ip = "shared-ip-" + Date.now();
    // Exhaust auth limit
    for (let i = 0; i < RATE_LIMIT_CONFIGS["auth"].maxRequests; i++) {
      rateLimit("auth", ip);
    }

    // likes endpoint should not be affected
    const likesResult = rateLimit("likes", ip);
    expect(likesResult.success).toBe(true);
  });

  it("uses default config for unknown endpoints", () => {
    const result = rateLimit("unknown-endpoint", "ip-default-" + Date.now());
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(
      RATE_LIMIT_CONFIGS["default"].maxRequests - 1,
    );
  });

  it("returns rate limit headers on success", () => {
    const result = rateLimit("reviews", "ip-headers-test-" + Date.now());
    expect(result.headers["X-RateLimit-Limit"]).toBeDefined();
    expect(result.headers["X-RateLimit-Remaining"]).toBeDefined();
    expect(result.headers["X-RateLimit-Reset"]).toBeDefined();
  });
});

describe("getIdentifier", () => {
  it("extracts IP from x-forwarded-for header", () => {
    const req = new Request("http://localhost/api/test", {
      headers: { "x-forwarded-for": "192.168.1.1, 10.0.0.1" },
    });
    expect(getIdentifier(req)).toBe("192.168.1.1");
  });

  it("falls back to x-real-ip header", () => {
    const req = new Request("http://localhost/api/test", {
      headers: { "x-real-ip": "10.0.0.5" },
    });
    expect(getIdentifier(req)).toBe("10.0.0.5");
  });

  it("returns localhost when no IP headers are present", () => {
    const req = new Request("http://localhost/api/test");
    expect(getIdentifier(req)).toBe("127.0.0.1");
  });
});
