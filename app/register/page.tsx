"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step1Data = {
  fullName: string;
  email: string;
  phoneNo: string;
  password: string;
  confirmPassword: string;
};

type Step2Data = {
  dob: string;
  locationCity: string;
  pincode: string;
  neighborhood?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isStepTransitioning, setIsStepTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  useEffect(() => {
    async function checkSession() {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Session check error on register page:", err);
      }
    }
    checkSession();
  }, [router]);

  const [step1Data, setStep1Data] = useState<Step1Data>({
    fullName: "",
    email: "",
    phoneNo: "",
    password: "",
    confirmPassword: "",
  });

  const [step2Data, setStep2Data] = useState<Step2Data>({
    dob: "",
    locationCity: "",
    pincode: "",
    neighborhood: "",
  });

  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep1Data({
      ...step1Data,
      [e.target.name]: e.target.value,
    });
  };

  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStep2Data({
      ...step2Data,
      [e.target.name]: e.target.value,
    });
  };

  const validateStep1 = (): boolean => {
    if (!step1Data.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!step1Data.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(step1Data.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!step1Data.phoneNo.trim()) {
      setError("Phone number is required");
      return false;
    }
    if (!/^\d{10}$/.test(step1Data.phoneNo.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    if (!step1Data.password) {
      setError("Password is required");
      return false;
    }
    if (step1Data.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (step1Data.password !== step1Data.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    setError("");
    return true;
  };

  const validateStep2 = (): boolean => {
    if (!step2Data.dob) {
      setError("Date of birth is required");
      return false;
    }
    const birthDate = new Date(step2Data.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    if (age < 18) {
      setError("You must be at least 18 years old");
      return false;
    }
    if (!step2Data.locationCity.trim()) {
      setError("City is required");
      return false;
    }
    if (!step2Data.pincode.trim()) {
      setError("Pincode is required");
      return false;
    }
    if (!/^\d{6}$/.test(step2Data.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }
    setError("");
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setIsStepTransitioning(true);
        setTimeout(() => {
          setStep(2);
          setError("");
          setIsStepTransitioning(false);
        }, 200);
      }
    } else if (step === 2) {
      if (validateStep2()) {
        setIsStepTransitioning(true);
        setTimeout(() => {
          setStep(3);
          setError("");
          setIsStepTransitioning(false);
        }, 200);
      }
    }
  };

  const handlePrevStep = () => {
    setIsStepTransitioning(true);
    setTimeout(() => {
      if (step === 2) {
        setStep(1);
      } else if (step === 3) {
        setStep(2);
      }
      setError("");
      setIsStepTransitioning(false);
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: step1Data.email,
          password: step1Data.password,
          fullName: step1Data.fullName,
          phoneNo: step1Data.phoneNo,
          dob: step2Data.dob,
          locationCity: step2Data.locationCity,
          neighborhood: step2Data.neighborhood,
          pincode: step2Data.pincode,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        router.push("/login?registered=true");
      } else {
        if (result.error?.toLowerCase().includes("already registered")) {
          setError("This email is already registered. Please login instead.");
        } else {
          setError(result.error || "Signup failed. Please try again.");
        }
        setIsLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const primaryColor = "var(--color-brand-primary)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all duration-200 group md:top-6 md:left-6"
        aria-label="Go back "
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
        {/* Left Side */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 relative overflow-hidden p-8 md:p-10 flex flex-col justify-between min-h-[300px] md:min-h-[550px]">
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
            <div className="w-10 h-10 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 flex items-center justify-center mb-8">
              <svg
                className="w-5 h-5 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              Join Our
              <br />
              <em className="italic text-white/80">Community</em>
            </h2>
            <p className="text-white/70 text-sm mt-3 leading-relaxed">
              Connect with neighbors and grow together
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

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-white overflow-y-auto max-h-[90vh]">
          <div className="h-full flex flex-col">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-gray-500 text-sm mt-1">
                Create your account to get started
              </p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex-1 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    step === 1
                      ? "text-white"
                      : step > 1
                        ? "text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                  style={
                    step === 1 || step > 1
                      ? { backgroundColor: primaryColor }
                      : {}
                  }
                >
                  {step > 1 ? "✓" : "1"}
                </div>
                <span
                  className={`text-xs ${step === 1 ? "text-brand-primary font-medium" : "text-gray-400"}`}
                >
                  Account
                </span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    step === 2
                      ? "text-white"
                      : step > 2
                        ? "text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                  style={
                    step === 2 || step > 2
                      ? { backgroundColor: primaryColor }
                      : {}
                  }
                >
                  {step > 2 ? "✓" : "2"}
                </div>
                <span
                  className={`text-xs ${step === 2 ? "text-brand-primary font-medium" : "text-gray-400"}`}
                >
                  Location
                </span>
              </div>
              <div className="flex-1 text-center">
                <div
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                    step === 3 ? "text-white" : "bg-gray-200 text-gray-500"
                  }`}
                  style={step === 3 ? { backgroundColor: primaryColor } : {}}
                >
                  3
                </div>
                <span
                  className={`text-xs ${step === 3 ? "text-brand-primary font-medium" : "text-gray-400"}`}
                >
                  Review
                </span>
              </div>
            </div>

            {error && (
              <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs text-center">
                {error}
              </div>
            )}

            <div
              className={`transition-all duration-300 ${
                isStepTransitioning
                  ? "opacity-0 transform translate-x-10"
                  : "opacity-100 transform translate-x-0"
              }`}
            >
              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full name
                      </label>
                      <input
                        name="fullName"
                        type="text"
                        value={step1Data.fullName}
                        onChange={handleStep1Change}
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Phone number
                      </label>
                      <input
                        name="phoneNo"
                        type="tel"
                        value={step1Data.phoneNo}
                        onChange={handleStep1Change}
                        disabled={isLoading}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={step1Data.email}
                      onChange={handleStep1Change}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showPassword ? "text" : "password"}
                          value={step1Data.password}
                          onChange={handleStep1Change}
                          disabled={isLoading}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="********"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          {showPassword ? (
                            <svg
                              className="h-4 w-4"
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
                              className="h-4 w-4"
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
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Confirm password
                      </label>
                      <div className="relative">
                        <input
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={step1Data.confirmPassword}
                          onChange={handleStep1Change}
                          disabled={isLoading}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent pr-8 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          placeholder="********"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                        >
                          {showConfirmPassword ? (
                            <svg
                              className="h-4 w-4"
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
                              className="h-4 w-4"
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
                  </div>

                  <p className="text-xs text-gray-400 -mt-1">
                    Password must be at least 6 characters
                  </p>

                  <button
                    onClick={handleNextStep}
                    disabled={isLoading}
                    className="w-full py-2 rounded-lg font-semibold text-white mt-2 transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm relative"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Continue
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Date of birth
                    </label>
                    <input
                      name="dob"
                      type="date"
                      value={step2Data.dob}
                      onChange={handleStep2Change}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      name="locationCity"
                      type="text"
                      value={step2Data.locationCity}
                      onChange={handleStep2Change}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Neighborhood (Optional)
                    </label>
                    <input
                      name="neighborhood"
                      type="text"
                      value={step2Data.neighborhood}
                      onChange={handleStep2Change}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="e.g., Block B"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Pincode
                    </label>
                    <input
                      name="pincode"
                      type="text"
                      value={step2Data.pincode}
                      onChange={handleStep2Change}
                      disabled={isLoading}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Enter 6-digit pincode"
                      maxLength={6}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-lg font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm relative"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                    <p className="font-medium text-gray-900 text-sm mb-1">
                      Review your information
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Full name:</span>
                        <span className="text-gray-900">
                          {step1Data.fullName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email:</span>
                        <span className="text-gray-900">{step1Data.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Phone:</span>
                        <span className="text-gray-900">
                          {step1Data.phoneNo}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">City:</span>
                        <span className="text-gray-900">
                          {step2Data.locationCity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Pincode:</span>
                        <span className="text-gray-900">
                          {step2Data.pincode}
                        </span>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      disabled={isLoading}
                      className="rounded border-gray-300 disabled:opacity-50"
                      style={{ accentColor: primaryColor }}
                    />
                    <span className="text-gray-600">
                      I agree to the Terms & Conditions
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-lg font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm relative"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-4 w-4 text-white"
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
                          Creating Account...
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {step === 1 && !isLoading && (
              <div className="text-center mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-brand-primary hover:opacity-85"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            )}

            <div className="text-center mt-4 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                © 2026 Kaamao Connect. All rights reserved.
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
