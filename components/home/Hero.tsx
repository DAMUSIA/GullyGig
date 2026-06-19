"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon";
import { getPlatformStats } from "@/lib/stats";

interface HeroProps {
  onShowToast: (msg: string) => void;
}

const SLIDES = [
  {
    src: "/assets/hero-slide-1.png",
    label: "Freelancers working flexibly",
    tag: "Discover local skills",
  },
  {
    src: "/assets/hero-slide-2.png",
    label: "Tutors teaching locally",
    tag: "Trusted experts",
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

// Custom hook for counting animation
const useCountUp = (
  target: number,
  duration: number = 2000,
  delay: number = 500,
) => {
  const [count, setCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCounting(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isCounting || target === 0) {
      setCount(target);
      return;
    }

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(eased * target);

      setCount(currentCount);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [target, duration, isCounting]);

  return count;
};

export default function Hero({ onShowToast }: HeroProps) {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Load real stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getPlatformStats();
        console.log("Stats loaded:", data);
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  // Use the count up hook
  const animatedUsers = useCountUp(stats.users, 2000, 600);
  const animatedServices = useCountUp(stats.services, 2000, 800);

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k+";
    }
    return num.toLocaleString();
  };

  return (
    <section className="relative pt-[100px] pb-16 min-h-[100vh] flex items-center overflow-hidden bg-brand-bg-light dark:bg-slate-900 transition-colors duration-300">
      {/* Background decorations - subtle */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-3xl -z-10" />

      <div className="mx-auto max-w-[1140px] px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary-light dark:bg-slate-800 text-brand-primary-dark dark:text-brand-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            Growing Hyperlocal Marketplace
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-4"
          >
            Find Trusted Local
            <br />
            <span className="text-brand-primary relative inline-block">
              Skilled Workers
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-brand-primary-light/50 dark:bg-brand-primary-dark/30 -z-10 rounded-full" />
            </span>
            <br />
            Near You
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed max-w-[480px] font-medium mb-6"
          >
            Discover verified tutors, cooks, babysitters, tailors, and skilled
            professionals in your neighborhood.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <Link
              href="/register"
              className="px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95 text-center"
            >
              Become a Provider
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById("skills");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:-translate-y-0.5 transition-all active:scale-95 text-center cursor-pointer"
              suppressHydrationWarning
            >
              Find Services
            </button>
          </motion.div>

          {/* Stats with counting animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap items-center gap-6 border-t border-slate-200/60 dark:border-slate-800 pt-5"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/15">
                <Icon name="people" className="text-sm" fill />
              </div>
              <div>
                <motion.p
                  key={stats.users}
                  className="text-[32px] text-base font-extrabold text-slate-800 dark:text-slate-200 leading-tight tabular-nums"
                >
                  {loading ? "..." : formatNumber(animatedUsers)} +
                </motion.p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Registered Users
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/15">
                <Icon name="work" className="text-sm" fill />
              </div>
              <div>
                <motion.p
                  key={stats.services}
                  className="text-[32px] text-base font-extrabold text-slate-800 dark:text-slate-200 leading-tight tabular-nums"
                >
                  {loading ? "..." : formatNumber(animatedServices)} +
                </motion.p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Active Services
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - Carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Main Carousel Frame */}
          <div className="relative w-[440px] h-[460px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors duration-300 max-w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={SLIDES[carouselIndex].src}
                  alt={SLIDES[carouselIndex].label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-brand-primary text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                    {SLIDES[carouselIndex].tag}
                  </span>
                  <span className="text-white text-xs font-semibold drop-shadow-md">
                    {SLIDES[carouselIndex].label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dot Indicators */}
            <div className="absolute top-6 right-6 z-10 flex gap-2 bg-slate-900/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    carouselIndex === i
                      ? "w-5 h-2 bg-white"
                      : "w-2 h-2 bg-white/50 hover:bg-white"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                  suppressHydrationWarning
                />
              ))}
            </div>
          </div>

          {/* Floating Card 1 */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-6 top-12 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100/50 dark:border-slate-700/50 p-3.5 flex items-center gap-3 w-[200px] transition-colors duration-300 max-w-[calc(100vw-40px)]"
          >
            <div className="w-10 h-10 rounded-xl bg-brand-primary-light dark:bg-slate-700 flex items-center justify-center shrink-0">
              <Icon name="groups" fill className="text-xl text-brand-primary" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                Hyperlocal Search
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Direct contact referrals
              </p>
            </div>
          </motion.div>

          {/* Floating Card 2 */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -right-6 bottom-8 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100/50 dark:border-slate-700/50 p-3.5 w-[160px] transition-colors duration-300 max-w-[calc(100vw-40px)]"
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-amber-500 text-lg">★</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                4.9
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium text-center">
              Trusted Community
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
