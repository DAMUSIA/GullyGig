import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── All mocks must be declared with vi.hoisted() since vi.mock() is hoisted ──

const {
  mockGetUser,
  mockGetLikeStatus,
  mockToggleLike,
  mockRateLimit,
  mockGetIdentifier,
} = vi.hoisted(() => ({
  mockGetUser: vi.fn(),
  mockGetLikeStatus: vi.fn(),
  mockToggleLike: vi.fn(),
  mockRateLimit: vi.fn(() => ({
    success: true,
    remaining: 29,
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

vi.mock("../lib/services/likes.service", () => ({
  getLikeStatus: mockGetLikeStatus,
  toggleLike: mockToggleLike,
}));

vi.mock("../lib/rate-limit", () => ({
  rateLimit: mockRateLimit,
  getIdentifier: mockGetIdentifier,
}));

import { GET, POST } from "../app/api/likes/route";

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

describe("GET /api/likes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 29,
      resetAt: Date.now() + 60000,
      headers: {},
    });
    mockGetIdentifier.mockReturnValue("127.0.0.1");
  });

  it("returns liked: false when no Authorization header", async () => {
    const req = new Request("http://localhost/api/likes?serviceId=uuid-1");
    const res = await GET(req);
    const json = await res.json();
    expect(json.liked).toBe(false);
  });

  it("returns liked: false when token is invalid", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("Invalid token"),
    });
    const req = makeAuthRequest(
      "http://localhost/api/likes?serviceId=uuid-1",
      "bad-token",
    );
    const res = await GET(req);
    const json = await res.json();
    expect(json.liked).toBe(false);
  });

  it("returns 400 when serviceId is missing", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const req = makeAuthRequest("http://localhost/api/likes", "valid-token");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns like status for authenticated user", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockGetLikeStatus.mockResolvedValueOnce({ liked: true });
    const req = makeAuthRequest(
      "http://localhost/api/likes?serviceId=00000000-0000-0000-0000-000000000001",
      "valid-token",
    );
    const res = await GET(req);
    const json = await res.json();
    expect(json.liked).toBe(true);
  });
});

describe("POST /api/likes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 29,
      resetAt: Date.now() + 60000,
      headers: {},
    });
    mockGetIdentifier.mockReturnValue("127.0.0.1");
  });

  it("returns 401 when no Authorization header", async () => {
    const req = new Request("http://localhost/api/likes", {
      method: "POST",
      body: JSON.stringify({
        serviceId: "00000000-0000-0000-0000-000000000001",
        action: "like",
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
      "http://localhost/api/likes",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", action: "like" },
    );
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 400 for invalid Zod input (non-UUID serviceId)", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const req = makeAuthRequest(
      "http://localhost/api/likes",
      "valid-token",
      "POST",
      { serviceId: "not-a-uuid", action: "like" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("UUID");
  });

  it("returns 400 for invalid action", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    const req = makeAuthRequest(
      "http://localhost/api/likes",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", action: "upvote" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 for a valid like action", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockToggleLike.mockResolvedValueOnce({
      success: true,
      liked: true,
      likesCount: 5,
    });
    const req = makeAuthRequest(
      "http://localhost/api/likes",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", action: "like" },
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.liked).toBe(true);
    expect(json.likesCount).toBe(5);
  });

  it("returns 400 when service layer returns an error", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "user-1" } },
      error: null,
    });
    mockToggleLike.mockResolvedValueOnce({
      success: false,
      error: "You cannot like your own service listing.",
    });
    const req = makeAuthRequest(
      "http://localhost/api/likes",
      "valid-token",
      "POST",
      { serviceId: "00000000-0000-0000-0000-000000000001", action: "like" },
    );
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
