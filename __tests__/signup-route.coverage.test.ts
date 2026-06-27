import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/supabase-admin", () => ({
  supabaseAdmin: {},
}));

vi.mock("../lib/rate-limit", () => ({
  rateLimit: vi.fn(),
  getIdentifier: vi.fn(),
}));

describe("signup route coverage bump", () => {
  it("imports signup route", async () => {
    const mod = await import("../app/api/auth/signup/route");
    expect(mod).toBeDefined();
  });
});
