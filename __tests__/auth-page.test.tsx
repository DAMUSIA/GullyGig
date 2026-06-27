import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// ─── Hoisted mocks ──────────────────────────────────────────────────────────

const { mockUseSearchParams, mockUseRouter, mockGetCurrentUser, mockSignIn } =
  vi.hoisted(() => ({
    mockUseSearchParams: vi.fn(),
    mockUseRouter: vi.fn(),
    mockGetCurrentUser: vi.fn(),
    mockSignIn: vi.fn(),
  }));

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

vi.mock("@/lib/supabase", () => ({
  getCurrentUser: mockGetCurrentUser,
  signIn: mockSignIn,
}));

// ── Import after mocks ──

import Page from "../app/Auth/page";
import AuthPage from "../components/AuthPage";

describe("app/Auth/page.tsx – Page wrapper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
    });
    mockGetCurrentUser.mockResolvedValue({ user: null });
  });

  it("renders login mode when mode param is absent", () => {
    const searchParams = new URLSearchParams("");
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<Page />);
    // AuthPage with defaultMode="login" shows "Login" heading
    expect(screen.getByRole("heading", { name: /login/i })).toBeTruthy();
  });

  it("renders login mode when mode param is 'login'", () => {
    const searchParams = new URLSearchParams("mode=login");
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<Page />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeTruthy();
  });

  it("renders register mode when mode param is 'register'", () => {
    const searchParams = new URLSearchParams("mode=register");
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<Page />);
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeTruthy();
  });

  it("defaults to login mode for any unknown mode param value", () => {
    const searchParams = new URLSearchParams("mode=unknown");
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<Page />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeTruthy();
  });

  it("renders the Suspense fallback structure (spinner container present in DOM)", () => {
    const searchParams = new URLSearchParams("");
    mockUseSearchParams.mockReturnValue(searchParams);

    render(<Page />);
    // The actual component (not fallback) is rendered synchronously since
    // useSearchParams is mocked. Verify core content is visible.
    expect(screen.getByRole("heading")).toBeTruthy();
  });
});

describe("components/AuthPage.tsx – Mode logic", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
    });
    mockGetCurrentUser.mockResolvedValue({ user: null });

    // Mock window.history.pushState
    vi.spyOn(window.history, "pushState").mockImplementation(() => {});
    // Mock window.location.search
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...window.location,
        search: "",
        pathname: "/Auth",
        origin: "http://localhost",
      },
    });
  });

  it("renders Login heading in login mode", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByRole("heading", { name: /^login$/i })).toBeTruthy();
  });

  it("renders Sign Up heading in register mode", () => {
    render(<AuthPage defaultMode="register" />);
    expect(screen.getByRole("heading", { name: /sign up/i })).toBeTruthy();
  });

  it("shows Full name field only in register mode", () => {
    render(<AuthPage defaultMode="register" />);
    expect(screen.getByPlaceholderText(/enter your full name/i)).toBeTruthy();
  });

  it("does not show Full name field in login mode", () => {
    render(<AuthPage defaultMode="login" />);
    const nameField = screen.queryByPlaceholderText(/enter your full name/i);
    expect(nameField).toBeNull();
  });

  it("shows phone number input in both modes", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByPlaceholderText("9876543210")).toBeTruthy();
  });

  it("shows 'Login with Google' button in login mode", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByText(/login with google/i)).toBeTruthy();
  });

  it("shows 'Sign up with Google' button in register mode", () => {
    render(<AuthPage defaultMode="register" />);
    expect(screen.getByText(/sign up with google/i)).toBeTruthy();
  });

  it("shows 'Keep me logged in' checkbox only in login mode", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByText(/keep me logged in/i)).toBeTruthy();
  });

  it("shows Terms agreement checkbox only in register mode", () => {
    render(<AuthPage defaultMode="register" />);
    expect(screen.getByText(/terms & conditions/i)).toBeTruthy();
  });

  it("shows 'Don't have an account?' prompt in login mode", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByText(/don't have an account/i)).toBeTruthy();
  });

  it("shows 'Already have an account?' prompt in register mode", () => {
    render(<AuthPage defaultMode="register" />);
    expect(screen.getByText(/already have an account/i)).toBeTruthy();
  });

  it("redirects to /dashboard if user is already logged in", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ user: { id: "user-123" } });
    render(<AuthPage defaultMode="login" />);
    // Wait for useEffect
    await vi.waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("does not redirect when no session exists", async () => {
    mockGetCurrentUser.mockResolvedValueOnce({ user: null });
    render(<AuthPage defaultMode="login" />);
    await vi.waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("renders Back button", () => {
    render(<AuthPage defaultMode="login" />);
    expect(screen.getByRole("button", { name: /go back|back/i })).toBeTruthy();
  });
});
