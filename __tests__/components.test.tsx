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
  }: {
    src?: string;
    children?: React.ReactNode;
    id?: string;
    [key: string]: unknown;
  }) => (
    <script data-testid="next-script" data-src={src} id={id}>
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
    process.env.NEXT_PUBLIC_GA_ID = originalEnv;
  });

  it("renders GA scripts correctly", () => {
    render(<GoogleAnalytics />);

    const scripts = screen.getAllByTestId("next-script");

    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const trackingScript = scripts.find(
      (s) => s.getAttribute("id") === "google-analytics",
    );

    expect(trackingScript).toBeDefined();
  });
});
