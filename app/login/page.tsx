"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, isSupabaseConfigured, getCurrentUser } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Session check error on login page:", err);
      }
    }
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isSupabaseConfigured) {
      setError(
        "Supabase is not configured. Please check your environment variables.",
      );
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn({ email, password });

      if (result.success) {
        if (keepLoggedIn) {
          localStorage.setItem("rememberedEmail", email);
        }
        router.push("/dashboard");
      } else {
        if (result.error?.includes("Invalid login credentials")) {
          setError("Invalid email or password");
        } else if (result.error?.includes("Email not confirmed")) {
          setError("Please confirm your email before logging in");
        } else {
          setError(result.error || "Login failed. Please try again.");
        }
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const supabaseModule = await import("@/lib/supabase");
      const supabase = supabaseModule.supabase;
      const isConfigured = supabaseModule.isSupabaseConfigured;

      if (!isConfigured || !supabase) {
        setError("Supabase is not configured. Please try again later.");
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
      // No need to set isLoading false on success as page will redirect
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Google login failed";
      setError(errorMessage);
      setIsGoogleLoading(false);
    }
  };

  const primaryColor = "var(--color-brand-primary)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all duration-200 group md:top-6 md:left-6"
        aria-label="Go back to home"
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
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          Back
        </span>
        <span className="text-sm font-medium text-gray-700 sm:hidden">
          Back
        </span>
      </button>

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Panel */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[300px] md:min-h-[500px]">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-primary-light rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-primary-muted rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
          </div>

          <div className="absolute bottom-16 right-8 w-40 h-40 bg-white/10 rounded-[60%_40%_70%_30%/_50%_60%_40%_60%] shadow-inner" />

          <div className="absolute inset-0">
            <div className="absolute w-16 h-16 bg-white/10 rounded-full top-[18%] left-[20%]" />
            <div className="absolute w-24 h-24 bg-white/10 rounded-full bottom-[24%] right-[16%]" />
            <div className="absolute w-8 h-8 bg-white/20 rounded-full top-[38%] right-[24%]" />
          </div>

          <div className="absolute bottom-6 left-6 flex gap-1.5 opacity-25">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>

          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center mb-8">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Kaamao
              <br />
              <em className="italic text-white/80">Connect</em>
            </h2>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              Bridge the gap between local talent and community needs
            </p>
          </div>

          <div className="relative z-10 flex gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <p className="text-white text-lg font-bold">99%</p>
              <p className="text-white/60 text-xs">Trust Score</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
              <p className="text-white text-lg font-bold">10K+</p>
              <p className="text-white/60 text-xs">Active Users</p>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 bg-white">
          <div className="h-full flex flex-col justify-center">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
              <p className="text-gray-500 text-sm mt-1">
                Welcome back! Please login to your account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || isGoogleLoading}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || isGoogleLoading}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-10 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="********"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isGoogleLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
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

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    disabled={isLoading || isGoogleLoading}
                    className="w-4 h-4 rounded border-gray-300 focus:ring-brand-primary disabled:opacity-50"
                    style={{ accentColor: primaryColor }}
                  />
                  <span className="text-sm text-gray-600">
                    Keep me logged in
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full py-2.5 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed relative"
                style={{ backgroundColor: primaryColor }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-gray-600"
                      xmlns="http://www.w3.org/2000/svg"
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
                    <span className="text-gray-700">
                      Connecting to Google...
                    </span>
                  </>
                ) : (
                  <>
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
                    <span className="text-gray-700">Login with Google</span>
                  </>
                )}
              </button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-brand-primary hover:opacity-85"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="text-center mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  © 2026 Kaamao Connect. All rights reserved.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
