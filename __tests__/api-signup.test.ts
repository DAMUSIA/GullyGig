import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── All mocks must be declared with vi.hoisted() since vi.mock() is hoisted ──

const {
  mockCreateUser,
  mockDeleteUser,
  mockUpsert,
  mockFrom,
  mockRateLimit,
  mockGetIdentifier,
} = vi.hoisted(() => {
  const mockUpsert = vi.fn();
  const mockFrom = vi.fn(() => ({ upsert: mockUpsert }));

  return {
    mockCreateUser: vi.fn(),
    mockDeleteUser: vi.fn(),
    mockUpsert,
    mockFrom,
    mockRateLimit: vi.fn(() => ({
      success: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
      headers: {},
    })),
    mockGetIdentifier: vi.fn(() => "127.0.0.1"),
  };
});

vi.mock("../lib/supabase-admin", () => ({
  supabaseAdmin: {
    auth: {
      admin: {
        createUser: mockCreateUser,
        deleteUser: mockDeleteUser,
      },
    },
    from: mockFrom,
  },
}));

vi.mock("../lib/rate-limit", () => ({
  rateLimit: mockRateLimit,
  getIdentifier: mockGetIdentifier,
}));

import { POST } from "../app/api/auth/signup/route";

const validBody = {
  fullName: "Test User",
  phoneNo: "9876543210",
  password: "password123",
};

const makeRequest = (body: unknown, method = "POST") =>
  new Request("http://localhost/api/auth/signup", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

const makeAuthUser = (id = "user-123") => ({
  id,
  email: "phone_9876543210@gullygig.in",
});

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRateLimit.mockReturnValue({
      success: true,
      remaining: 9,
      resetAt: Date.now() + 60000,
      headers: {},
    });
    mockGetIdentifier.mockReturnValue("127.0.0.1");
    mockFrom.mockReturnValue({ upsert: mockUpsert });
  });

  // ── Rate Limiting ──────────────────────────────────────────────────────────

  it("returns 429 when rate limit is exceeded", async () => {
    mockRateLimit.mockReturnValue({
      success: false,
      remaining: 0,
      resetAt: Date.now() + 60000,
      headers: { "Retry-After": "60" },
    });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toMatch(/too many signup attempts/i);
  });

  // ── Request Body Validation ────────────────────────────────────────────────

  it("returns 400 for invalid JSON body", async () => {
    const req = new Request("http://localhost/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-valid-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid JSON body");
  });

  it("returns 400 when required fields are missing", async () => {
    const req = makeRequest({ phoneNo: "9876543210" }); // missing fullName and password
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBeTruthy();
  });

  it("returns 400 when phoneNo is invalid (too short)", async () => {
    const req = makeRequest({ ...validBody, phoneNo: "12345" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const req = makeRequest({ ...validBody, password: "abc" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  // ── Auth User Creation ─────────────────────────────────────────────────────

  it("returns 400 when user is already registered (auth error)", async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "User already registered" },
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/already registered/i);
    expect(data.error).toMatch(/login instead/i);
  });

  it("returns 400 when email already exists (auth error)", async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "email already exists in the system" },
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/already registered/i);
  });

  it("returns 400 for other auth errors", async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Some other auth error" },
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Some other auth error");
  });

  it("returns 500 when auth creates user without user object", async () => {
    mockCreateUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/failed to create user account/i);
  });

  // ── Profile Insert ─────────────────────────────────────────────────────────

  it("returns 200 with success message on valid signup", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toMatch(/account created/i);
  });

  it("generates pseudo-email from phone number when no email is provided", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    await POST(req);

    // The createUser call should use the pseudo-email format
    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "phone_9876543210@gullygig.in",
      }),
    );
  });

  it("uses provided email directly when email is given", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({ ...validBody, email: "test@example.com" });
    await POST(req);

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "test@example.com",
      }),
    );
  });

  it("includes optional fields (dob, location) in upsert when provided", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      dob: "1990-01-01",
      location: "Mumbai",
    });
    await POST(req);

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        dob: "1990-01-01",
        location: "Mumbai",
      }),
    );
  });

  it("rolls back auth user and returns 400 when profile insert fails", async () => {
    const user = makeAuthUser("user-to-rollback");
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({
      error: { message: "some insert error", code: "UNKNOWN" },
    });
    mockDeleteUser.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(mockDeleteUser).toHaveBeenCalledWith("user-to-rollback");
    const data = await res.json();
    expect(data.error).toMatch(/failed to setup user profile/i);
  });

  it("logs console.error when profile insert fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = makeAuthUser();
    const insertError = { message: "insert failed", code: "TEST_ERR" };
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: insertError });
    mockDeleteUser.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    await POST(req);

    expect(consoleSpy).toHaveBeenCalledWith(
      "Signup profile insert error:",
      insertError,
    );
    consoleSpy.mockRestore();
  });

  it("returns duplicate phone error when insert fails with unique constraint on phone_no", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({
      error: {
        message: "duplicate key value violates unique constraint on phone_no",
        code: "23505",
        details: "Key (phone_no)=(9876543210) already exists.",
      },
    });
    mockDeleteUser.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/phone number is already registered/i);
  });

  it("returns duplicate email error when insert fails with unique constraint on email", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({
      error: {
        message: "duplicate key value violates unique constraint",
        code: "23505",
        details: "Key (email)=(test@example.com) already exists.",
      },
    });
    mockDeleteUser.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/email is already registered/i);
  });

  it("returns not-null constraint error message for missing required DB fields", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({
      error: {
        message: "not-null constraint violation on column x",
        code: "23502",
      },
    });
    mockDeleteUser.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/database constraint error/i);
  });

  it("continues even when rollback (deleteUser) throws", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({
      error: { message: "insert failed", code: "UNKNOWN" },
    });
    mockDeleteUser.mockRejectedValueOnce(new Error("delete failed"));

    const req = makeRequest(validBody);
    const res = await POST(req);
    // Should still respond with 400 (not 500 from the delete failure)
    expect(res.status).toBe(400);
  });

  // ── Edge Cases ─────────────────────────────────────────────────────────────

  it("strips non-digit characters from phoneNo before generating pseudo-email", async () => {
    const user = makeAuthUser();
    mockCreateUser.mockResolvedValueOnce({ data: { user }, error: null });
    mockUpsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({ ...validBody, phoneNo: "98-765-43210" });
    await POST(req);

    expect(mockCreateUser).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "phone_9876543210@gullygig.in",
      }),
    );
  });

  it("returns 500 on unexpected internal error", async () => {
    mockCreateUser.mockRejectedValueOnce(new Error("unexpected failure"));
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toMatch(/internal server error/i);
  });
});
