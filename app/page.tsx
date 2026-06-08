"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/* ─── Icon helper ─────────────────────────────────────────── */
function Icon({
  name,
  fill = false,
  className = "",
}: {
  name: string;
  fill?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`material-symbols-outlined select-none leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0},'wght' 400,'GRAD' 0,'opsz' 24`,
      }}
    >
      {name}
    </span>
  );
}

/* ─── Data ────────────────────────────────────────────────── */
const SKILLS = [
  {
    image: "/assets/tutoring.png",
    chip: "TUTORING",
    title: "Academic Support",
    desc: "From math wizards to language experts right in your block.",
    count: "120+ Experts",
  },
  {
    image: "/assets/cooking.png",
    chip: "COOKING",
    title: "Home Chefs",
    desc: "Healthy, home-cooked meals or culinary lessons from neighbors.",
    count: "85+ Cooks",
  },
  {
    image: "/assets/sewing.png",
    chip: "SEWING",
    title: "Tailoring & Crafts",
    desc: "Quick repairs, custom clothing, or textile workshops nearby.",
    count: "50+ Tailors",
  },
];

const PROVIDER_STEPS = [
  {
    n: "1",
    title: "Create Your Profile",
    desc: "List your skills, experience, and set your local availability and rates.",
  },
  {
    n: "2",
    title: "Accept Requests",
    desc: "Chat with neighbors directly and confirm project details on your terms.",
  },
  {
    n: "3",
    title: "Get Paid Locally",
    desc: "Complete tasks and receive secure payments directly through our platform.",
  },
];

const CUSTOMER_STEPS = [
  {
    n: "1",
    title: "Find Expertise",
    desc: "Search for specific skills or browse categories within your zip code.",
  },
  {
    n: "2",
    title: "Check Reviews",
    desc: "View provider ratings and community feedback to ensure a perfect match.",
  },
  {
    n: "3",
    title: "Book Instantly",
    desc: "Schedule your task and track progress in real-time through the app.",
  },
];

const TRUST_CHECKS = [
  "Verified Neighborhood Profiles",
  "Secure Escrow Payments",
  "24/7 Local Community Support",
  "Real-time Activity Tracking",
];

/* ─── Main Component ──────────────────────────────────────── */
export default function Home() {
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const SLIDES = [
    {
      src: "/assets/hero-slide-1.png",
      label: "Freelancers working flexibly",
      tag: "Earn from home",
    },
    {
      src: "/assets/hero-slide-2.png",
      label: "Tutors teaching locally",
      tag: "Trusted tutors",
    },
    {
      src: "/assets/hero-slide-3.png",
      label: "Home chefs sharing skills",
      tag: "Home chefs",
    },
    {
      src: "/assets/hero-slide-4.png",
      label: "Community connections",
      tag: "Community trust",
    },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const showToast = (message: string) => {
    setToast(null);
    setTimeout(() => {
      setToast(message);
    }, 10);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div
      className="min-h-screen font-[Manrope,sans-serif] text-brand-primary-dark"
      style={{ backgroundColor: "var(--color-brand-bg-light)" }}
    >
      {/* ══════ NAVBAR ══════════════════════════════════════════ */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
        style={{ backgroundColor: "var(--color-brand-white)" }}
      >
        <nav className="mx-auto flex h-[64px] max-w-[1140px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            >
              <Icon name="check" fill className="text-sm text-white" />
            </div>
            <span className="text-[15px] font-bold text-brand-primary">
              LocalSkill
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#skills"
              className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
            >
              Find Skills
            </Link>
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-slate-500 hover:text-brand-primary transition-colors"
            >
              How it Works
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:block text-sm font-semibold text-brand-primary hover:opacity-70 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold text-white px-5 py-2.5 rounded-full transition-opacity hover:opacity-90 active:scale-95 inline-block text-center"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            >
              Join as Provider
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* ══════ HERO ════════════════════════════════════════════ */}
        <section
          className="pt-[64px] min-h-screen flex items-center"
          style={{ backgroundColor: "var(--color-brand-bg-light)" }}
        >
          <div className="mx-auto max-w-[1140px] px-6 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div>
              <h1 className="text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-brand-primary mb-5">
                Empower Your Skills,
                <br />
                Earn Locally
              </h1>
              <p className="text-[15px] text-slate-600 leading-7 mb-8 max-w-[420px]">
                Connect with your neighbors and turn your everyday expertise
                into local opportunities. Whether you&apos;re a tutor, cook, or
                handyman, your skills are needed right next door.
              </p>

              {/* Search bar */}
              <div className="flex items-stretch gap-0 mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-[520px]">
                <label className="flex flex-1 items-center gap-2 px-4 py-3.5 cursor-text border-r border-slate-200">
                  <Icon
                    name="search"
                    className="text-xl text-slate-400 shrink-0"
                  />
                  <input
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    placeholder="What skill do you need?"
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  />
                </label>
                <label className="flex flex-1 items-center gap-2 px-4 py-3.5 cursor-text">
                  <Icon
                    name="location_on"
                    className="text-xl text-slate-400 shrink-0"
                  />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Near your neighborhood"
                    className="w-full bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                  />
                </label>
                <button
                  onClick={() => showToast("functionality coming soon..")}
                  className="shrink-0 text-white font-bold text-sm px-7 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  style={{ backgroundColor: "var(--color-brand-primary)" }}
                >
                  Search
                </button>
              </div>

              {/* Download Buttons */}
              <div className="flex items-center gap-3 mb-8">
                {/* Google Play */}
                <button
                  onClick={() => showToast("app coming soon")}
                  className="flex items-center gap-2.5 bg-black text-white rounded-xl px-4 py-2.5 hover:opacity-80 active:scale-95 transition-all cursor-pointer text-left"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-6 h-6 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient
                        id="gp1"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#00C6FF" />
                        <stop offset="100%" stopColor="#00A8E8" />
                      </linearGradient>
                      <linearGradient
                        id="gp2"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FFD000" />
                        <stop offset="100%" stopColor="#FF8C00" />
                      </linearGradient>
                      <linearGradient
                        id="gp3"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#FF3A44" />
                        <stop offset="100%" stopColor="#C31162" />
                      </linearGradient>
                      <linearGradient
                        id="gp4"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#32DF84" />
                        <stop offset="100%" stopColor="#00B057" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M3.18 23.76c.3.16.64.2.97.12L14.39 12 10.76 8.37 3.18 23.76z"
                      fill="url(#gp1)"
                    />
                    <path
                      d="M20.5 10.55l-2.8-1.6-3.31 3.05 3.31 3.06 2.83-1.62c.81-.46.81-1.63-.03-2.89z"
                      fill="url(#gp2)"
                    />
                    <path
                      d="M3.18.24C2.84.14 2.47.2 2.18.41L14.39 12 17.7 8.95 4.15.36c-.32-.2-.66-.25-.97-.12z"
                      fill="url(#gp3)"
                    />
                    <path
                      d="M2.18 23.59c.29.21.66.27.97.17l13.55-8.59L13.39 12 2.18 23.59z"
                      fill="url(#gp4)"
                    />
                  </svg>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] font-medium opacity-80 uppercase tracking-wide">
                      GET IT ON
                    </p>
                    <p className="text-[14px] font-bold leading-none">
                      Google Play
                    </p>
                  </div>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-lg">★</span>
                  <div>
                    <p className="text-sm font-extrabold text-brand-primary">
                      4.9 / 5
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Community Rating
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-brand-primary)" }}
                  >
                    <Icon name="check" fill className="text-xs text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-brand-primary">
                      2,500+
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      Verified Providers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — Image Carousel */}
            <div className="relative hidden lg:flex items-center justify-center">
              {/* Main carousel frame */}
              <div className="relative w-[460px] h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                {SLIDES.map((slide, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 transition-opacity duration-700"
                    style={{ opacity: carouselIndex === i ? 1 : 0 }}
                  >
                    <img
                      src={slide.src}
                      alt={slide.label}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/60 via-transparent to-transparent" />
                    {/* Label tag */}
                    <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                      <span className="bg-white/90 backdrop-blur-sm text-brand-primary text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                        {slide.tag}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Dot navigation */}
                <div className="absolute bottom-5 right-5 z-10 flex gap-1.5">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCarouselIndex(i)}
                      className={`rounded-full transition-all duration-300 ${
                        carouselIndex === i
                          ? "w-6 h-2 bg-white"
                          : "w-2 h-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating chip — top left (outside carousel) */}
              <div className="absolute -left-4 top-8 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 w-[190px]">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                >
                  <Icon
                    name="payments"
                    fill
                    className="text-lg text-brand-primary"
                  />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-brand-primary">
                    15+ Methods
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Secure local payments
                  </p>
                </div>
              </div>

              {/* Floating chip — bottom right (outside carousel) */}
              <div className="absolute -right-4 bottom-10 z-20 bg-white rounded-2xl shadow-xl px-4 py-3 w-[170px]">
                <p className="text-[10px] text-slate-400 font-semibold mb-1.5">
                  200k+ Active Tasks
                </p>
                <div className="flex items-end gap-1 h-8">
                  {[35, 55, 45, 70, 60, 85].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        height: `${h}%`,
                        backgroundColor:
                          i === 5
                            ? "var(--color-brand-primary)"
                            : "var(--color-brand-primary-light)",
                      }}
                      className="flex-1 rounded-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ FEATURES ══════════════════════════════════════ */}
        <section id="features" className="scroll-mt-20 pt-10 pb-20 bg-white">
          <div className="mx-auto max-w-[1140px] px-6">
            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-[clamp(1.8rem,3.5vw,2.6rem)] font-extrabold text-brand-primary mb-3">
                Features
              </h2>
              <div
                className="mx-auto mb-5 h-1 w-14 rounded-full"
                style={{ backgroundColor: "var(--color-brand-primary)" }}
              />
              <p className="text-sm text-slate-500 leading-7 max-w-[480px] mx-auto">
                Everything you need to safely and efficiently connect with local
                talent in your neighborhood.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Card 1 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                >
                  <Icon
                    name="location_on"
                    fill
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-[15px] font-extrabold text-brand-primary mb-2">
                  Location-Based Discovery
                </h3>
                <p className="text-[13px] text-slate-500 leading-5">
                  Find experts right in your neighborhood with our precise local
                  matching.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                >
                  <Icon
                    name="verified_user"
                    fill
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-[15px] font-extrabold text-brand-primary mb-2">
                  Secure Payments
                </h3>
                <p className="text-[13px] text-slate-500 leading-5">
                  Protected escrow-based transactions ensure your money is safe
                  until the job is done.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                >
                  <Icon
                    name="manage_accounts"
                    fill
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-[15px] font-extrabold text-brand-primary mb-2">
                  Verified Profiles
                </h3>
                <p className="text-[13px] text-slate-500 leading-5">
                  Background-checked and community-vetted providers you can
                  trust.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                >
                  <Icon
                    name="chat"
                    fill
                    className="text-xl text-brand-primary"
                  />
                </div>
                <h3 className="text-[15px] font-extrabold text-brand-primary mb-2">
                  Direct Communication
                </h3>
                <p className="text-[13px] text-slate-500 leading-5">
                  Seamlessly chat with providers to discuss details and schedule
                  tasks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ POPULAR LOCAL SKILLS ════════════════════════════ */}
        <section id="skills" className="scroll-mt-20 py-16 bg-brand-bg-light">
          <div className="mx-auto max-w-[1140px] px-6">
            {/* Header row */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-[clamp(1.6rem,3vw,2rem)] font-extrabold text-brand-primary mb-2">
                  Popular Local Skills
                </h2>
                <p className="text-sm text-slate-500 leading-6 max-w-[340px]">
                  Browse our community&apos;s most sought-after expertise and
                  find the help you need today.
                </p>
              </div>
              <button
                onClick={() => showToast("coming soon..")}
                className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:opacity-70 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
              >
                View All Categories
                <Icon name="arrow_forward" className="text-base" />
              </button>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {SKILLS.map((s) => (
                <button
                  key={s.title}
                  onClick={() => showToast("functionality coming soon..")}
                  className="text-left bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Chip */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-brand-primary text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">
                      {s.chip}
                    </span>
                  </div>
                  {/* Body */}
                  <div className="p-5">
                    <h3 className="text-base font-extrabold text-brand-primary mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-5 mb-4">
                      {s.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-amber-500">
                        {s.count}
                      </span>
                      <span className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary transition-all">
                        <Icon
                          name="arrow_forward"
                          className="text-sm text-slate-400 group-hover:text-white transition-colors"
                        />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ HOW IT WORKS ════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="scroll-mt-20 py-20"
          style={{ backgroundColor: "var(--color-brand-primary)" }}
        >
          <div className="mx-auto max-w-[1140px] px-6">
            {/* Heading */}
            <div className="text-center mb-14">
              <h2 className="text-[clamp(1.6rem,3vw,2.2rem)] font-extrabold text-white mb-3">
                How LocalSkill Connect Works
              </h2>
              <p className="text-brand-primary-muted text-sm leading-6 max-w-[480px] mx-auto">
                Bridging the gap between neighbors. Whether you want to provide
                a service or find one, we&apos;ve simplified the process.
              </p>
            </div>

            {/* Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* For Providers */}
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon name="work" fill className="text-xl text-white" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    For Providers
                  </h3>
                </div>
                <div className="space-y-5">
                  {PROVIDER_STEPS.map((step) => (
                    <div key={step.n} className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-extrabold text-white border border-white/30"
                        style={{
                          backgroundColor:
                            "var(--color-brand-white-translucent)",
                        }}
                      >
                        {step.n}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-white mb-1">
                          {step.title}
                        </p>
                        <p className="text-[13px] text-brand-primary-muted leading-5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className="mt-8 text-sm font-bold text-white border border-white/40 rounded-full px-6 py-2.5 hover:bg-white/10 transition-colors active:scale-95 inline-block text-center"
                >
                  Join as Provider
                </Link>
              </div>

              {/* For Customers */}
              <div>
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Icon name="person_search" className="text-xl text-white" />
                  </div>
                  <h3 className="text-lg font-extrabold text-white">
                    For Customers
                  </h3>
                </div>
                <div className="space-y-5">
                  {CUSTOMER_STEPS.map((step) => (
                    <div key={step.n} className="flex items-start gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm font-extrabold text-white border border-white/30"
                        style={{
                          backgroundColor:
                            "var(--color-brand-white-translucent)",
                        }}
                      >
                        {step.n}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-white mb-1">
                          {step.title}
                        </p>
                        <p className="text-[13px] text-brand-primary-muted leading-5">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/register"
                  className="mt-8 text-sm font-bold text-white px-7 py-2.5 rounded-full hover:opacity-90 active:scale-95 transition-all inline-block text-center"
                  style={{ backgroundColor: "var(--color-brand-teal)" }}
                >
                  Find a Service
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════ TRUST SECTION ═══════════════════════════════════ */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-[1140px] px-6 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            {/* Left — image with overlay card */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden h-[420px] w-full">
                <img
                  src="/assets/trust-neighbors.png"
                  alt="Community trust"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-teal/60 via-transparent to-transparent rounded-3xl" />
                {/* Logo watermark on image */}
                <div className="absolute bottom-16 left-5 text-white font-bold text-sm">
                  LocalSkill
                </div>
              </div>
              {/* Floating card */}
              <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-2xl p-4 w-[210px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--color-brand-bg-light)" }}
                  >
                    <Icon
                      name="verified_user"
                      fill
                      className="text-sm text-brand-primary"
                    />
                  </div>
                  <p className="text-xs font-extrabold text-brand-primary">
                    Safe &amp; Verified
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 leading-4">
                  Every provider undergoes a community verification process.
                </p>
              </div>
            </div>

            {/* Right — text */}
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-brand-primary mb-4 leading-tight">
                Building Community
                <br />
                Through Trust
              </h2>
              <p className="text-sm text-slate-500 leading-7 mb-7 max-w-[400px]">
                We believe the best expertise is often right down the street.
                Our platform isn&apos;t just about tasks; it&apos;s about
                reconnecting neighbors through valuable exchange.
              </p>
              <ul className="space-y-3 mb-8">
                {TRUST_CHECKS.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "var(--color-brand-primary)" }}
                    >
                      <Icon
                        name="check"
                        fill
                        className="text-[11px] text-white"
                      />
                    </div>
                    <span className="text-sm font-semibold text-brand-primary">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => showToast("functionality coming soon..")}
                className="text-sm font-bold text-brand-primary border border-brand-primary-light bg-brand-bg-light rounded-xl px-6 py-3 hover:bg-brand-bg-hover transition-colors active:scale-95 cursor-pointer"
              >
                Learn About Our Safety Standards
              </button>
            </div>
          </div>
        </section>

        {/* ══════ CTA BLOCK ═══════════════════════════════════════ */}
        <section
          className="py-16"
          style={{ backgroundColor: "var(--color-brand-bg-light)" }}
        >
          <div className="mx-auto max-w-[1140px] px-6">
            <div
              className="rounded-3xl px-8 py-14 text-center"
              style={{ backgroundColor: "var(--color-brand-primary)" }}
            >
              <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold text-white mb-3 leading-tight">
                Ready to connect with
                <br />
                your local experts?
              </h2>
              <p className="text-brand-primary-muted text-sm leading-6 mb-8 max-w-[460px] mx-auto">
                Join thousands of neighbors already growing their skills and
                simplifying their lives with LocalSkill Connect.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="text-sm font-bold text-brand-primary bg-white px-7 py-3.5 rounded-full hover:bg-slate-100 active:scale-95 transition-all inline-block text-center"
                >
                  Find Nearby Services
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-bold text-white px-7 py-3.5 rounded-full hover:opacity-90 active:scale-95 transition-all inline-block text-center"
                  style={{ backgroundColor: "var(--color-brand-teal)" }}
                >
                  Register as Provider
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ══════ FOOTER ══════════════════════════════════════════ */}
      <footer className="bg-white border-t border-slate-100 py-7">
        <div className="mx-auto max-w-[1140px] px-6 flex flex-col sm:flex-row items-center justify-between gap-5">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "var(--color-brand-primary)" }}
              >
                <Icon name="check" fill className="text-xs text-white" />
              </div>
              <span className="text-sm font-bold text-brand-primary">
                LocalSkill
              </span>
            </div>
            <p className="text-[12px] text-slate-400">
              © 2024 LocalSkill Connect. Bridging community expertise.
            </p>
          </div>

          {/* Center links */}
          <div className="flex flex-wrap items-center justify-center gap-5">
            {[
              "Privacy Policy",
              "Terms of Service",
              "Help Center",
              "Community Guidelines",
            ].map((l) => (
              <button
                key={l}
                onClick={() => showToast("functionality coming soon..")}
                className="text-[12px] text-slate-500 hover:text-brand-primary transition-colors cursor-pointer"
              >
                {l}
              </button>
            ))}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast("functionality coming soon..")}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Icon name="share" className="text-base text-slate-500" />
            </button>
            <button
              onClick={() => showToast("functionality coming soon..")}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Icon name="language" className="text-base text-slate-500" />
            </button>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-2xl animate-toast text-sm font-semibold tracking-wide">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Icon name="info" className="text-[14px]" />
          </div>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
