import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GoogleAnalytics from "../components/GoogleAnalytics";

// Mock Next.js Script
vi.mock("next/script", () => ({
  default: ({
    src,
    children,
    id,
    strategy,
  }: {
    src?: string;
    children?: React.ReactNode;
    id?: string;
    strategy?: string;
  }) => (
    <script
      data-testid="next-script"
      data-src={src}
      id={id}
      data-strategy={strategy}
    >
      {children}
    </script>
  ),
}));

// Mock Supabase lib
vi.mock("../lib/supabase", () => ({
  isSupabaseConfigured: true,
}));

describe("GoogleAnalytics Component", () => {
  const originalEnv = process.env.NEXT_PUBLIC_GA_ID;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_GA_ID = "G-TEST123456";
  });

  afterEach(() => {
    if (originalEnv === undefined) {
      delete process.env.NEXT_PUBLIC_GA_ID;
    } else {
      process.env.NEXT_PUBLIC_GA_ID = originalEnv;
    }
  });

  it("renders GA scripts correctly", () => {
    render(<GoogleAnalytics />);

    const scripts = screen.getAllByTestId("next-script");

    // Verify both scripts: loader and inline config
    const loaderScript = scripts.find((s) =>
      s.getAttribute("data-src")?.includes("googletagmanager.com/gtag/js"),
    );
    const inlineScript = scripts.find(
      (s) => s.getAttribute("id") === "google-analytics",
    );

    expect(loaderScript).toBeDefined();
    expect(inlineScript).toBeDefined();
    expect(scripts.length).toBe(2);
  });
});
