import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── All mocks must be declared with vi.hoisted() since vi.mock() is hoisted ──

const {
  mockGetUser,
  mockSelect,
  mockEq,
  mockMaybeSingle,
  mockInsert,
  mockFrom,
  mockCreateClient,
} = vi.hoisted(() => {
  const mockMaybeSingle = vi.fn();
  const mockEq = vi.fn(() => ({ maybeSingle: mockMaybeSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockInsert = vi.fn();
  const mockFrom = vi.fn((table: string) => {
    if (table === "users") {
      return { select: mockSelect, insert: mockInsert };
    }
    return { select: mockSelect, insert: mockInsert };
  });

  const mockGetUser = vi.fn();

  const mockCreateClient = vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  }));

  return {
    mockGetUser,
    mockSelect,
    mockEq,
    mockMaybeSingle,
    mockInsert,
    mockFrom,
    mockCreateClient,
  };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: mockCreateClient,
}));

import { POST } from "../app/api/auth/sync-profile/route";

const makeRequest = (body: unknown, token: string | null = "valid-token") => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token !== null) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return new Request("http://localhost/api/auth/sync-profile", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
};

const validBody = {
  id: "user-uuid-123",
  fullName: "Test User",
  email: "test@example.com",
  phoneNo: "9876543210",
};

const mockAuthUser = (id = "user-uuid-123") => ({
  data: { user: { id, email: "test@example.com" } },
  error: null,
});

describe("POST /api/auth/sync-profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: from() returns both select+insert
    mockFrom.mockImplementation(() => ({
      select: mockSelect,
      insert: mockInsert,
    }));
    mockSelect.mockReturnValue({ eq: mockEq });
    mockEq.mockReturnValue({ maybeSingle: mockMaybeSingle });
  });

  // ── Authorization ──────────────────────────────────────────────────────────

  it("returns 401 when no Authorization header is provided", async () => {
    const req = makeRequest(validBody, null);
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when Authorization header does not start with Bearer", async () => {
    const req = new Request("http://localhost/api/auth/sync-profile", {
      method: "POST",
      headers: {
        Authorization: "Basic invalid-token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  // ── Required Field Validation ──────────────────────────────────────────────

  it("returns 400 when id is missing", async () => {
    const { id: _id, ...bodyWithoutId } = validBody;
    const req = makeRequest(bodyWithoutId);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields");
  });

  it("returns 400 when fullName is missing", async () => {
    const { fullName: _fullName, ...bodyWithoutName } = validBody;
    const req = makeRequest(bodyWithoutName);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Missing required fields");
  });

  // ── JWT Verification ───────────────────────────────────────────────────────

  it("returns 401 when JWT verification fails (auth error)", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid token" },
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when JWT user id does not match request id", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "different-user-id" } },
      error: null,
    });
    const req = makeRequest(validBody); // validBody.id = "user-uuid-123"
    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 401 when getUser returns no user", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  // ── Existing User Check ────────────────────────────────────────────────────

  it("returns 200 with 'Profile already exists' when user already has a profile", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: { id: "user-uuid-123" } });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe("Profile already exists");
  });

  // ── Pseudo-Email Logic (Key PR Change) ────────────────────────────────────

  it("stores null for email when email has phone_ prefix and ends with @gullygig.in", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null }); // user does not exist yet
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      email: "phone_9876543210@gullygig.in",
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: null }),
    );
  });

  it("stores null for @kaamao.com emails (treated as legacy pseudo)", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      email: "phone_9876543210@kaamao.com",
    });
    await POST(req);

    // @kaamao.com is a legacy pseudo-email — should be stored as null
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: null }),
    );
  });

  it("stores real email for phone_ prefix with a non-pseudo domain (e.g. @example.com)", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      email: "phone_1234567890@example.com",
    });
    await POST(req);

    // Should be stored as-is since it is not a pseudo-email domain
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "phone_1234567890@example.com" }),
    );
  });

  it("stores null when email is not provided", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const { email: _email, ...bodyWithoutEmail } = validBody;
    const req = makeRequest(bodyWithoutEmail);
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: null }),
    );
  });

  it("stores real email for regular email addresses", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({ ...validBody, email: "user@gmail.com" });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "user@gmail.com" }),
    );
  });

  it("gullygig.in email without phone_ prefix is stored as real email", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      email: "normaluser@gullygig.in",
    });
    await POST(req);

    // Does not start with "phone_" so is not pseudo
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ email: "normaluser@gullygig.in" }),
    );
  });

  // ── Successful Insert ──────────────────────────────────────────────────────

  it("returns 200 on successful profile creation", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.message).toBe("Profile saved successfully");
  });

  it("inserts profile with optional fields (dob, location) when provided", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest({
      ...validBody,
      dob: "1990-05-20",
      location: "Bangalore",
    });
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        dob: "1990-05-20",
        location: "Bangalore",
      }),
    );
  });

  it("inserts null for optional fields (dob, location) when not provided", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const req = makeRequest(validBody); // no dob or location
    await POST(req);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        dob: null,
        location: null,
        phone_no: "9876543210",
      }),
    );
  });

  // ── Insert Error ───────────────────────────────────────────────────────────

  it("returns 500 when profile insert fails", async () => {
    mockGetUser.mockResolvedValueOnce(mockAuthUser());
    mockMaybeSingle.mockResolvedValueOnce({ data: null });
    mockInsert.mockResolvedValueOnce({
      error: { message: "DB error occurred" },
    });

    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("DB error occurred");
  });

  // ── Unexpected Error ───────────────────────────────────────────────────────

  it("returns 500 on unexpected internal error", async () => {
    mockGetUser.mockRejectedValueOnce(new Error("network failure"));
    const req = makeRequest(validBody);
    const res = await POST(req);
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe("Internal server error");
  });
});
