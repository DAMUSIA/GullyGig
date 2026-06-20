import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── All mocks must be declared with vi.hoisted() since vi.mock() is hoisted ──

const {
  mockGetUser,
  mockGetReviews,
  mockPostReview,
  mockRateLimit,
  mockGetIdentifier,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetReviews: vi.fn(),
  mockPostReview: vi.fn(),
  mockRateLimit: vi.fn(() => ({
    success: true,
    remaining: 9,
    resetAt: Date.now() + 60000,
    headers: {},
  })),
  mockGetIdentifier: vi.fn(() => "127.0.0.1"),
}));

vi.mock("../lib/supabase-admin", () => ({
  supabaseAdmin: {
    auth: { getUser: mockGetUser },
  },
}));

vi.mock("../lib/services/reviews.service", () => ({
  getReviews: mockGetReviews,
  postReview: mockPostReview,
}));

vi.mock("../lib/rate-limit", () => ({
  rateLimit: mockRateLimit,
  getIdentifier: mockGetIdentifier,
}));

import { GET, POST } from "../app/api/reviews/route";

const makeAuthRequest = (
  url: string,
  token: string,
  method = "GET",
  body?: object,
) =>
  new Request(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

describe("GET /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
      headers: {},
    });
    mockGetIdentifier.mockReturnValue("127.0.0.1");
  });

  it("returns 400 when serviceId is missing", async () => {
    const req = new Request("http://localhost/api/reviews");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns reviews for a valid serviceId", async () => {
    const mockReviews = [{ id: "r1", rating: 5, review: "Great!" }];
    mockGetReviews.mockResolvedValueOnce({
      success: true,
      reviews: mockReviews,
    });
    const req = new Request(
      "http://localhost/api/reviews?serviceId=00000000-0000-0000-0000-000000000001",
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.reviews).toHaveLength(1);
    expect(json.reviews[0].id).toBe("r1");
  });

  it("returns 500 when service layer fails", async () => {
    mockGetReviews.mockResolvedValueOnce({ success: false, error: "DB error" });
    const req = new Request(
      "http://localhost/api/reviews?serviceId=00000000-0000-0000-0000-000000000001",
    );
    const res = await GET(req);
    expect(res.status).toBe(500);
  });
});

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
      headers: {},
    });
    mockGetIdentifier.mockReturnValue("127.0.0.1");
  });

  it("returns 401 when no Authorization header", async () => {
    const req = new Request("http://localhost/api/reviews", {
      method: "POST",
      body: JSON.stringify({
        serviceId: "00000000-0000-0000-0000-000000000001",
        rating: 5,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockRateLimit.mockReturnValueOnce({
      success: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
      headers: { "Retry-After": "60" },
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", rating: 5 },
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 400 for invalid rating (out of range)", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", rating: 10 },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("5");
  });

  it("returns 400 for non-UUID serviceId", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      { serviceId: "not-a-uuid", rating: 4 },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when user tries to review their own service", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockPostReview.mockResolvedValueOnce({
      success: false,
      error: "You cannot review your own service listing.",
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      {
        serviceId: "00000000-0000-0000-0000-000000000001",
        rating: 5,
        comment: "Great!",
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("own service");
  });

  it("returns 400 for duplicate review", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockPostReview.mockResolvedValueOnce({
      success: false,
      error: "You have already submitted a review for this tutor/service.",
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", rating: 4 },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 for a valid review submission", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockPostReview.mockResolvedValueOnce({
      success: true,
      message: "Review posted successfully",
      averageRating: 4.5,
      totalReviews: 10,
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      {
        serviceId: "00000000-0000-0000-0000-000000000001",
        rating: 5,
        comment: "Excellent service!",
      },
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.averageRating).toBe(4.5);
    expect(json.totalReviews).toBe(10);
  });

  it("returns 404 when service is not found", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockPostReview.mockResolvedValueOnce({
      success: false,
      error: "Service listing not found.",
    });
    const req = makeAuthRequest(
      "http://localhost/api/reviews",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000002", rating: 3 },
    );
    const res = await POST(req);
    expect(res.status).toBe(404);
  });
});
