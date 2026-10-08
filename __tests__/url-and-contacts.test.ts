import { describe, it, expect, vi } from "vitest";
import {
  getBaseUrl,
  getPortfolioUrl,
  resolvePortfolioIdFromParam,
  getProfileUrl,
  getServiceUrl,
  getShareUrl,
  getPosterUrl,
  getQRCodeUrl,
  getYouTubeVideoId,
  getYouTubeEmbedUrl,
} from "../lib/url";
import {
  SUPPORT_NUMBERS,
  SUPPORT_EMAIL,
  SUPPORT_NUMBERS_STRING,
} from "../lib/contacts";
import { getPlatformStats } from "../lib/stats";
import { supabase } from "../lib/supabase";

describe("lib/contacts", () => {
  it("exports valid support numbers and email", () => {
    expect(SUPPORT_NUMBERS.length).toBe(3);
    expect(SUPPORT_EMAIL).toBe("support@gullygig.in");
    expect(SUPPORT_NUMBERS_STRING).toContain("88795 14626");
    expect(SUPPORT_NUMBERS[0].tel).toBe("tel:8879514626");
    expect(SUPPORT_NUMBERS[0].whatsapp).toContain("wa.me/918879514626");
  });
});

describe("lib/url", () => {
  it("getBaseUrl returns window origin in browser environment", () => {
    const url = getBaseUrl();
    expect(url).toBeDefined();
    expect(typeof url).toBe("string");
  });

  it("getPortfolioUrl generates correct portfolio URLs", () => {
    const serviceId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(getPortfolioUrl(serviceId)).toContain(`/p/${serviceId}`);
    expect(getPortfolioUrl(serviceId, "Maths Tutor")).toContain(
      `/p/maths-tutor-${serviceId}`,
    );
  });

  it("resolvePortfolioIdFromParam parses UUID from various formats", () => {
    const uuid = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(resolvePortfolioIdFromParam(uuid)).toBe(uuid);
    expect(resolvePortfolioIdFromParam(`maths-tutor-${uuid}`)).toBe(uuid);
    expect(resolvePortfolioIdFromParam(`https://gullygig.in/p/${uuid}`)).toBe(
      uuid,
    );
    expect(resolvePortfolioIdFromParam("")).toBeNull();
    expect(resolvePortfolioIdFromParam("invalid-slug-without-uuid")).toBeNull();
  });

  it("getProfileUrl, getServiceUrl, getShareUrl, getPosterUrl generate valid paths", () => {
    expect(getProfileUrl("user-123")).toContain("/profile/user-123");
    expect(getServiceUrl("svc-123")).toContain("/service/svc-123");
    expect(getServiceUrl("svc-123", "maths")).toContain(
      "/service/svc-123/maths",
    );
    expect(getShareUrl("custom/path")).toContain("/custom/path");
    expect(getShareUrl("/leading-slash")).toContain("/leading-slash");
    expect(getPosterUrl("svc-123")).toContain("/poster/svc-123");
  });

  it("getQRCodeUrl generates valid QR server URL", () => {
    const qr = getQRCodeUrl("https://gullygig.in/p/123", 200);
    expect(qr).toContain("api.qrserver.com");
    expect(qr).toContain("size=200x200");
    expect(qr).toContain(encodeURIComponent("https://gullygig.in/p/123"));
  });

  it("getYouTubeVideoId extracts video IDs correctly", () => {
    expect(getYouTubeVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(
      getYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(getYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(getYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ",
    );
    expect(
      getYouTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ"),
    ).toBe("dQw4w9WgXcQ");
    expect(getYouTubeVideoId(null)).toBeNull();
    expect(getYouTubeVideoId("")).toBeNull();
    expect(getYouTubeVideoId("not-a-youtube-url")).toBeNull();
  });

  it("getYouTubeEmbedUrl generates privacy-friendly embed URL", () => {
    expect(getYouTubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&playsinline=1",
    );
    expect(getYouTubeEmbedUrl("")).toBeNull();
  });
});

describe("lib/stats", () => {
  it("getPlatformStats returns database counts when available", async () => {
    const mockFrom = vi.fn().mockImplementation((table: string) => {
      return {
        select: vi.fn().mockResolvedValue({
          count: table === "users" ? 42 : 15,
          error: null,
        }),
      };
    });

    if (supabase) {
      vi.spyOn(supabase, "from").mockImplementation(
        mockFrom as unknown as typeof supabase.from,
      );
    }

    const stats = await getPlatformStats();
    expect(stats.users).toBe(42);
    expect(stats.services).toBe(15);
  });

  it("getPlatformStats handles errors and returns fallback zeros", async () => {
    const mockFrom = vi.fn().mockImplementation(() => {
      return {
        select: vi.fn().mockReturnValue({
          eq: vi
            .fn()
            .mockResolvedValue({ count: null, error: new Error("DB Error") }),
          then: (resolve: (value: unknown) => void) =>
            resolve({ count: null, error: new Error("DB Error") }),
        }),
      };
    });

    if (supabase) {
      vi.spyOn(supabase, "from").mockImplementation(
        mockFrom as unknown as typeof supabase.from,
      );
    }

    const stats = await getPlatformStats();
    expect(stats.users).toBe(0);
    expect(stats.services).toBe(0);
  });
});
