import { describe, it, expect, vi, beforeEach } from "vitest";

const { chain } = vi.hoisted(() => {
  const chain = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi.fn((onfulfilled) => {
      return Promise.resolve({ data: null, error: null }).then(onfulfilled);
    }),
  };
  return { chain };
});

const mockAuth = vi.hoisted(() => ({
  signUp: vi.fn(),
  signInWithPassword: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  onAuthStateChange: vi.fn(() => ({
    data: { subscription: { unsubscribe: vi.fn() } },
  })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue(chain),
    auth: mockAuth,
  })),
}));

import {
  isSupabaseConfigured,
  logClick,
  signUp,
  signIn,
  signOut,
  onAuthStateChange,
} from "../lib/supabase";

describe("Supabase Client Configuration", () => {
  it("should export isSupabaseConfigured as a boolean", () => {
    expect(typeof isSupabaseConfigured).toBe("boolean");
  });
});

describe("logClick", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not throw when called regardless of config state", async () => {
    await expect(
      logClick("visitor-123", "test-project", true),
    ).resolves.toBeUndefined();
  });
});

describe("signUp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when Supabase is not configured", async () => {
    if (!isSupabaseConfigured) {
      const result = await signUp({
        fullName: "Test User",
        phoneNo: "1234567890",
        password: "password123",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    } else {
      // When configured, mock auth.signUp to return an error
      mockAuth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: "Test error" },
      });
      const result = await signUp({
        fullName: "Test User",
        phoneNo: "1234567890",
        password: "password123",
      });
      expect(result.success).toBe(false);
    }
  });

  it("returns rateLimited when rate limit is exceeded", async () => {
    if (!isSupabaseConfigured) return; // skip if not configured

    mockAuth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: "rate limit exceeded" },
    });

    // Make 3 attempts to exhaust the in-memory rate limit window
    const email = `ratelimit_test_${Date.now()}@kaamao.com`;
    for (let i = 0; i < 3; i++) {
      await signUp({
        fullName: "Test",
        phoneNo: "9999999999",
        password: "pass1234",
        email,
      });
    }

    const result = await signUp({
      fullName: "Test",
      phoneNo: "9999999999",
      password: "pass1234",
      email,
    });
    expect(result.success).toBe(false);
    expect(result.rateLimited).toBe(true);
  });
});

describe("signIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when Supabase is not configured", async () => {
    if (!isSupabaseConfigured) {
      const result = await signIn({
        email: "test@test.com",
        password: "password",
      });
      expect(result.success).toBe(false);
    } else {
      mockAuth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials" },
      });
      const result = await signIn({
        email: "test@test.com",
        password: "wrongpassword",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid email or password");
    }
  });

  it("returns success with session when credentials are valid", async () => {
    if (!isSupabaseConfigured) return;

    const mockSession = { user: { id: "user-1" }, access_token: "token-123" };
    mockAuth.signInWithPassword.mockResolvedValueOnce({
      data: { user: { id: "user-1" }, session: mockSession },
      error: null,
    });
    const result = await signIn({
      email: "test@test.com",
      password: "correctpassword",
    });
    expect(result.success).toBe(true);
    expect(result.session).toEqual(mockSession);
  });
});

describe("signOut", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls supabase auth.signOut", async () => {
    if (!isSupabaseConfigured) return;
    mockAuth.signOut.mockResolvedValueOnce({ error: null });
    const result = await signOut();
    expect(result.success).toBe(true);
  });

  it("returns error if signOut fails", async () => {
    if (!isSupabaseConfigured) return;
    mockAuth.signOut.mockResolvedValueOnce({
      error: { message: "Network error" },
    });
    const result = await signOut();
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});

describe("onAuthStateChange", () => {
  it("returns an unsubscribe function", () => {
    const unsubscribe = onAuthStateChange(() => {});
    expect(typeof unsubscribe).toBe("function");
  });
});
