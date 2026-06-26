"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, getCurrentUser } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthPage({
  defaultMode,
}: {
  defaultMode: "login" | "register";
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">(defaultMode);

  // Form states
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Sync mode state with browser history (back/forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === "/register") {
        setMode("register");
      } else if (path === "/login") {
        setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Check client-side URL search params for redirects or messages
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("registered") === "true") {
      const timer = setTimeout(() => {
        setSuccess("Account created successfully! Please log in.");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  // Load remembered login preference on mount/mode toggle
  useEffect(() => {
    if (mode === "login") {
      const rememberedPreference = localStorage.getItem(
        "rememberLoginPreference",
      );
      if (rememberedPreference === "true") {
        const timer = setTimeout(() => {
          setKeepLoggedIn(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [mode]);

  // Check existing session
  useEffect(() => {
    async function checkSession() {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Session check error on auth page:", err);
      }
    }
    checkSession();
  }, [router]);

  const handleToggleMode = (newMode: "login" | "register") => {
    setError("");
    setSuccess("");
    setPassword("");
    setIsLoading(false);
    setIsGoogleLoading(false);
    window.history.pushState(null, "", `/${newMode}`);
    setMode(newMode);
  };

  const handleGoogleAuth = async () => {
    setError("");
    setSuccess("");
    setIsGoogleLoading(true);

    try {
      const supabaseModule = await import("@/lib/supabase");
      const supabase = supabaseModule.supabase;
      const isConfigured = supabaseModule.isSupabaseConfigured;

      if (!isConfigured || !supabase) {
        setError(
          "Server temporarily unavailable. Please try again in a few minutes.",
        );
        setIsGoogleLoading(false);
        return;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setError(error.message);
        setIsGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google authentication error:", err);
      setError("Google authentication failed");
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode === "register") {
      // Validate Register
      if (!fullName.trim()) {
        setError("Full name is required");
        return;
      }
      const cleanPhone = phoneNo.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (!agreeTerms) {
        setError("Please agree to the Terms & Conditions");
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName,
            phoneNo: cleanPhone,
            password,
          }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setSuccess("Account created successfully! Switching to Login...");
          setTimeout(() => {
            handleToggleMode("login");
          }, 1500);
        } else {
          if (
            result.error?.toLowerCase().includes("already registered") ||
            result.error?.toLowerCase().includes("exists")
          ) {
            setError(
              "This phone number is already registered. Please login instead.",
            );
          } else {
            setError(result.error || "Signup failed. Please try again.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Signup error:", err);
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    } else {
      // Validate Login
      const cleanPhone = phoneNo.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        setError("Please enter a valid 10-digit phone number");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      setIsLoading(true);
      try {
        const loginEmail = `phone_${cleanPhone}@gullygig.in`;
        let result = await signIn({ email: loginEmail, password });

        // Fallback to legacy domain if initial login fails
        if (!result.success) {
          const legacyEmail = `phone_${cleanPhone}@kaamao.com`;
          const legacyResult = await signIn({ email: legacyEmail, password });
          if (legacyResult.success) {
            result = legacyResult;
          }
        }

        if (result.success) {
          if (keepLoggedIn) {
            localStorage.setItem("rememberLoginPreference", "true");
          } else {
            localStorage.removeItem("rememberLoginPreference");
          }
          router.push("/dashboard");
        } else {
          if (
            result.error?.includes("Invalid login credentials") ||
            result.error?.toLowerCase().includes("invalid_credentials") ||
            result.error?.toLowerCase().includes("invalid_grant")
          ) {
            setError("Invalid phone number or password");
          } else if (result.error?.includes("Email not confirmed")) {
            setError("Please confirm your email before logging in");
          } else {
            setError(result.error || "Login failed. Please try again.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Login error:", err);
        setError("An unexpected error occurred. Please try again.");
        setIsLoading(false);
      }
    }
  };

  const primaryColor = "var(--color-brand-primary)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4 relative font-sans">
      {/* Back Button Wrapper - Aligned with the card's left edge, sitting above it */}
      <div className="w-full max-w-5xl mb-4 flex justify-start z-50">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all duration-200 group"
          aria-label="Go back"
        >
          <svg
            className="w-5 h-5 text-gray-700 group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span className="text-sm font-medium text-gray-700">Back</span>
        </button>
      </div>

      {/* Outer Card - Exact original layout settings */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel - Exact original layout and animated theme */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden p-8 md:p-10 flex-col justify-between min-h-[300px] md:min-h-[500px]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-primary-muted rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
          </div>

          <div className="absolute bottom-16 right-8 w-40 h-40 bg-white/10 rounded-[60%_40%_70%_30%/_50%_60%_40%_60%] shadow-inner animate-[morphBlob_7s_ease-in-out_infinite]" />

          <div className="absolute inset-0">
            <div className="absolute w-16 h-16 bg-white/10 rounded-full top-[18%] left-[20%] animate-[floatDot_8s_ease-in-out_infinite]" />
            <div className="absolute w-24 h-24 bg-white/10 rounded-full bottom-[24%] right-[16%] animate-[floatDot_8s_ease-in-out_infinite_2s]" />
            <div className="absolute w-8 h-8 bg-white/20 rounded-full top-[38%] right-[24%] animate-[floatDot_8s_ease-in-out_infinite_1.2s]" />
          </div>

          <div className="absolute bottom-6 left-6 flex gap-1.5 opacity-25">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="w-1 h-1 bg-white rounded-full animate-[dotPop_2s_ease-in-out_infinite]"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center mb-8 overflow-hidden p-1">
              <Image
                src="/logo.png"
                alt="GullyGig Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              GullyGig
              <br />
              <em className="italic text-white/80">Connect</em>
            </h2>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              Bridge the gap between local talent and community needs
            </p>
          </div>
        </div>

        {/* Right Panel - Exact original layout settings */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <div className="h-full flex flex-col justify-center">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {mode === "login" ? "Login" : "Sign Up"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {mode === "login"
                  ? "Welcome back! Please login to your account."
                  : "Create your account to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm text-center font-medium"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Name Input Field - Register Mode Only */}
              <AnimatePresence initial={false} mode="wait">
                {mode === "register" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    // Remove overflow-hidden to prevent focus ring clipping
                    className="overflow-visible"
                  >
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        disabled={isLoading || isGoogleLoading}
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-200"
                        placeholder="Enter your full name"
                        required={mode === "register"}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phone Input Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  value={phoneNo}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) {
                      setPhoneNo(val);
                    }
                  }}
                  maxLength={10}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                  placeholder="9876543210"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  {/* Forgot Password link removed */}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isGoogleLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  >
                    {showPassword ? (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              {mode === "login" ? (
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    disabled={isLoading || isGoogleLoading}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-0 cursor-pointer accent-blue-600 disabled:opacity-50"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    Keep me logged in
                  </span>
                </label>
              ) : (
                <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    disabled={isLoading || isGoogleLoading}
                    className="rounded border-gray-300 disabled:opacity-50 accent-blue-600"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-gray-600">
                    I agree to the Terms & Conditions
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {mode === "login" ? "Logging in..." : "Creating Account..."}
                  </div>
                ) : mode === "login" ? (
                  "Login"
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading || isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span className="text-gray-700 text-sm">
                {mode === "login" ? "Login with Google" : "Sign up with Google"}
              </span>
            </button>

            {/* Toggle Button */}
            <div className="text-center mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs sm:text-sm text-gray-500">
                {mode === "login" ? (
                  <>
                    Don&apos;t have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleToggleMode("register")}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => handleToggleMode("login")}
                      className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer focus:outline-none"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes morphBlob {
          0%,
          100% {
            border-radius: 60% 40% 70% 30% / 50% 60% 40% 60%;
            transform: rotate(0deg);
          }
          50% {
            border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%;
            transform: rotate(15deg);
          }
        }

        @keyframes floatDot {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-18px) scale(1.05);
            opacity: 1;
          }
        }

        @keyframes dotPop {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
          }
        }

        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
