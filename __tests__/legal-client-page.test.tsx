import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// ─── Hoisted mocks ──────────────────────────────────────────────────────────

const { mockUseSearchParams, mockUseRouter, mockRouterPush } = vi.hoisted(
  () => {
    const mockRouterPush = vi.fn();
    return {
      mockUseSearchParams: vi.fn(),
      mockUseRouter: vi.fn(() => ({ push: mockRouterPush })),
      mockRouterPush,
    };
  },
);

vi.mock("next/navigation", () => ({
  useSearchParams: mockUseSearchParams,
  useRouter: mockUseRouter,
}));

vi.mock("next/image", () => ({
  default: function MockImage({
    src,
    alt,
    ...props
  }: {
    src: string;
    alt: string;
    [key: string]: unknown;
  }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  },
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      [key: string]: unknown;
    }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

vi.mock("react-icons/fa", () => ({
  FaInstagram: () => <svg data-testid="icon-instagram" />,
  FaLinkedinIn: () => <svg data-testid="icon-linkedin" />,
  FaFacebookF: () => <svg data-testid="icon-facebook" />,
  FaYoutube: () => <svg data-testid="icon-youtube" />,
  FaWhatsapp: () => <svg data-testid="icon-whatsapp" />,
}));

vi.mock("react-icons/fa6", () => ({
  FaXTwitter: () => <svg data-testid="icon-twitter" />,
}));

// ── Import after mocks ──

import LegalClientPage from "../app/legal/LegalClientPage";

const SAMPLE_TERMS = `# Terms of Service

## 1. About GullyGig

This is the about section.

## 2. Eligibility

You must be at least 18 years old.

- Requirement one
- Requirement two

## 8. Prohibited Conduct

Do not misuse the platform.
`;

const SAMPLE_PRIVACY = `# Privacy Policy

## 1. Who We Are

We are GullyGig.

## 2. Information We Collect

We collect your data.

- Name
- Email

## Contact Us

Email us at support@example.com.
`;

describe("LegalClientPage – activeTab logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("defaults to 'terms' tab when no tab query param is present", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    // Terms content heading should be rendered
    expect(screen.getByText("Terms of Service")).toBeTruthy();
  });

  it("shows terms tab content when tab=terms", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByText("1. About GullyGig")).toBeTruthy();
  });

  it("shows privacy tab content when tab=privacy", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=privacy"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByText("Privacy Policy")).toBeTruthy();
    expect(screen.getByText("1. Who We Are")).toBeTruthy();
  });

  it("falls back to 'terms' for an unknown tab value", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=unknown"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    // Should render terms, not privacy
    expect(screen.getByText("1. About GullyGig")).toBeTruthy();
    expect(screen.queryByText("1. Who We Are")).toBeNull();
  });
});

describe("LegalClientPage – handleTabChange", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
  });

  it("navigates to /legal?tab=privacy when Privacy Policy tab is clicked", () => {
    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    // Find all "Privacy Policy" buttons (mobile + desktop) and click the first
    const privacyButtons = screen.getAllByText(/privacy policy/i);
    fireEvent.click(privacyButtons[0]);

    expect(mockRouterPush).toHaveBeenCalledWith("/legal?tab=privacy");
  });

  it("navigates to /legal?tab=terms when Terms of Service tab is clicked", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=privacy"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const termsButtons = screen.getAllByText(/terms of service/i);
    fireEvent.click(termsButtons[0]);

    expect(mockRouterPush).toHaveBeenCalledWith("/legal?tab=terms");
  });
});

describe("LegalClientPage – parseMarkdownToReact (rendered output)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders H1 (# heading) as large title element", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    // "Terms of Service" from "# Terms of Service" should appear as h1
    const h1 = screen.getByRole("heading", {
      level: 1,
      name: /terms of service/i,
    });
    expect(h1).toBeTruthy();
  });

  it("renders H2 (## heading) as section title", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const h2 = screen.getByRole("heading", {
      level: 2,
      name: /1. about gullygig/i,
    });
    expect(h2).toBeTruthy();
  });

  it("renders bullet list items (- prefix)", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByText("Requirement one")).toBeTruthy();
    expect(screen.getByText("Requirement two")).toBeTruthy();
  });

  it("renders paragraph text within sections", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByText("This is the about section.")).toBeTruthy();
  });

  it("renders bold text from **bold** markdown syntax", () => {
    const contentWithBold = `# Title\n## Section\nHello **world** text.`;
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={contentWithBold}
      />,
    );

    const boldEl = screen.getByText("world");
    expect(boldEl.tagName).toBe("STRONG");
  });

  it("renders privacy bullet items correctly", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=privacy"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
  });

  it("skips empty lines without crashing", () => {
    const contentWithBlanks = `# Title\n\n## Section\n\nSome text.\n\n- Item A\n\n`;
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={contentWithBlanks}
      />,
    );

    expect(screen.getByText("Some text.")).toBeTruthy();
    expect(screen.getByText("Item A")).toBeTruthy();
  });
});

describe("LegalClientPage – getSectionIcon (via rendered aria/visual output)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
  });

  it("renders 'Contact Us' section without throwing (contact icon used)", () => {
    const content = `# Title\n## Contact Us\nReach us here.`;
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    expect(() =>
      render(
        <LegalClientPage
          privacyContent={SAMPLE_PRIVACY}
          termsContent={content}
        />,
      ),
    ).not.toThrow();

    expect(screen.getByText("Reach us here.")).toBeTruthy();
  });

  it("renders '8. Prohibited Conduct' section with red/warning styling", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    const { container } = render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    // The prohibited section should use red styling
    const prohibitedSection = screen
      .getByText("8. Prohibited Conduct")
      .closest("section");
    expect(prohibitedSection).toBeTruthy();
    // Find the icon container within the section
    const iconDiv = prohibitedSection?.querySelector(".bg-red-50");
    expect(iconDiv).toBeTruthy();
    void container;
  });

  it("renders non-prohibited terms sections with indigo styling", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=terms"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const aboutSection = screen
      .getByText("1. About GullyGig")
      .closest("section");
    expect(aboutSection).toBeTruthy();
    const iconDiv = aboutSection?.querySelector(".bg-indigo-50");
    expect(iconDiv).toBeTruthy();
  });

  it("renders privacy sections with blue styling", () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams("tab=privacy"));

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const whoWeAreSection = screen
      .getByText("1. Who We Are")
      .closest("section");
    expect(whoWeAreSection).toBeTruthy();
    const iconDiv = whoWeAreSection?.querySelector(".bg-blue-50");
    expect(iconDiv).toBeTruthy();
  });
});

describe("LegalClientPage – social links and footer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
  });

  it("renders all 6 social media icons", () => {
    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    expect(screen.getByTestId("icon-instagram")).toBeTruthy();
    expect(screen.getByTestId("icon-twitter")).toBeTruthy();
    expect(screen.getByTestId("icon-linkedin")).toBeTruthy();
    expect(screen.getByTestId("icon-facebook")).toBeTruthy();
    expect(screen.getByTestId("icon-youtube")).toBeTruthy();
    expect(screen.getByTestId("icon-whatsapp")).toBeTruthy();
  });

  it("renders 'Our Team' link in the footer", () => {
    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const teamLink = screen.getByRole("link", { name: /our team/i });
    expect(teamLink).toBeTruthy();
    expect((teamLink as HTMLAnchorElement).href).toContain("/team");
  });

  it("renders 'Back to Home' navigation link", () => {
    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const backLink = screen.getByRole("link", { name: /back to home/i });
    expect(backLink).toBeTruthy();
    expect((backLink as HTMLAnchorElement).href).toContain("/");
  });
});

describe("LegalClientPage – handleShare", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSearchParams.mockReturnValue(new URLSearchParams(""));
  });

  it("calls navigator.share when available", async () => {
    const mockShare = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: mockShare,
    });

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const shareBtn = screen.getByRole("button", { name: /share gullygig/i });
    fireEvent.click(shareBtn);

    await vi.waitFor(() => {
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining("GullyGig"),
        }),
      );
    });
  });

  it("copies to clipboard when navigator.share is not available", async () => {
    // Remove share API
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });

    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    const mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: mockWriteText },
    });

    render(
      <LegalClientPage
        privacyContent={SAMPLE_PRIVACY}
        termsContent={SAMPLE_TERMS}
      />,
    );

    const shareBtn = screen.getByRole("button", { name: /share gullygig/i });
    fireEvent.click(shareBtn);

    await vi.waitFor(() => {
      expect(mockWriteText).toHaveBeenCalled();
    });

    mockAlert.mockRestore();
  });
});
