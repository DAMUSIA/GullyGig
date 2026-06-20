"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon";
import { getPlatformStats } from "@/lib/stats";

const SLIDES = [
  {
    src: "/assets/home_page_images/hero-slide-1.png",
    label: "Freelancers working flexibly",
    tag: "Discover local skills",
  },
  {
    src: "/assets/home_page_images/hero-slide-2.png",
    label: "Tutors teaching locally",
    tag: "Trusted experts",
  },
  {
    src: "/assets/home_page_images/hero-slide-3.png",
    label: "Home chefs sharing skills",
    tag: "Home chefs",
  },
  {
    src: "/assets/home_page_images/hero-slide-4.png",
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

interface HeroProps {
  onShowToast?: (message: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Hero(props: HeroProps = {}) {
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
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const animatedUsers = useCountUp(stats.users, 3000, 800);
  const animatedServices = useCountUp(stats.services, 3000, 800);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
    return num.toLocaleString();
  };

  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-brand-bg-light dark:bg-slate-950 transition-colors duration-300 font-sans pt-20 lg:pt-0 pb-10 lg:pb-0">
      {/* Background decorations */}
      <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-brand-primary/10 dark:bg-brand-primary/20 rounded-full filter blur-[80px] -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full filter blur-[80px] -z-10" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center z-10">
        {/* LEFT COLUMN */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col justify-center lg:pr-6"
        >
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-4xl sm:text-2xl lg:text-[3.9rem] xl:text-[4.0rem] font-black tracking-tight leading-[1.05] text-slate-900 dark:text-white mb-3 mt-10"
          >
            Find Trusted Local
            <br />
            <span className="text-brand-primary relative inline-block mt-1 sm:mt-2">
              Skilled Workers
              <span className="absolute left-0 bottom-1 w-full h-2 bg-brand-primary/20 dark:bg-brand-primary/30 -z-10 rounded-sm" />
            </span>
            <br />
            <span className="mt-1 sm:mt-2 inline-block">Near You</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-[480px] font-medium mb-8"
          >
            Discover verified tutors, cooks, babysitters, tailors, and skilled
            professionals right in your neighborhood.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-wrap items-center gap-3.5 mb-8 lg:mb-10"
          >
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-brand-primary text-white font-semibold text-[15px] shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-center"
            >
              Become a Provider
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById("skills");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-semibold text-[15px] border-2 border-slate-200 dark:border-slate-800 hover:border-brand-primary/50 dark:hover:border-brand-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-center cursor-pointer"
              suppressHydrationWarning
            >
              Find Services
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2 }}
            className="flex items-center gap-6 lg:gap-8 border-t border-slate-200 dark:border-slate-800/80 pt-6"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                <Icon name="people" className="text-lg" fill />
              </div>
              <div>
                <motion.p
                  key={stats.users}
                  className="text-2xl lg:text-5xl font-black text-slate-900 dark:text-white leading-none tabular-nums tracking-tight"
                >
                  {loading ? "..." : formatNumber(animatedUsers)}
                  <span className="text-brand-primary">+</span>
                </motion.p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  Registered Users
                </p>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                <Icon name="work" className="text-lg" fill />
              </div>
              <div>
                <motion.p
                  key={stats.services}
                  className="text-2xl lg:text-5xl font-black text-slate-900 dark:text-white leading-none tabular-nums tracking-tight"
                >
                  {loading ? "..." : formatNumber(animatedServices)}
                  <span className="text-brand-primary">+</span>
                </motion.p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                  Active Services
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT COLUMN - Carousel (Increased size slightly) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0"
        >
          {/* Main Carousel Frame - Increased max-width and height */}
          <div className="relative w-full max-w-[420px] xl:max-w-[480px] aspect-[4/4.8] sm:h-[480px] xl:h-[520px] rounded-[2rem] overflow-hidden shadow-2xl shadow-brand-primary/15 border-4 lg:border-[6px] border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 transition-colors duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img
                  src={SLIDES[carouselIndex].src}
                  alt={SLIDES[carouselIndex].label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2.5">
                  <span className="w-max bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-brand-primary text-[10px] lg:text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-md shadow-sm">
                    {SLIDES[carouselIndex].tag}
                  </span>
                  <span className="text-white text-lg lg:text-xl font-bold tracking-tight drop-shadow-lg leading-tight">
                    {SLIDES[carouselIndex].label}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Dot Indicators */}
            <div className="absolute top-5 right-5 z-10 flex gap-1.5 bg-slate-950/40 backdrop-blur-md px-3 py-1.5 rounded-full">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    carouselIndex === i
                      ? "w-5 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                  suppressHydrationWarning
                />
              ))}
            </div>
          </div>

          {/* Floating Card 1 - Updated to highlight location/local aspect */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-2 sm:-left-8 lg:-left-12 top-16 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100/50 dark:border-slate-800 p-3.5 flex items-center gap-3.5 w-[200px] transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
              <Icon
                name="location_on"
                fill
                className="text-xl text-brand-primary"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                Near You
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                Local professionals
              </p>
            </div>
          </motion.div>

          {/* Floating Card 2 - Replaced Rating with "Verified Providers" */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: 1.5,
            }}
            className="absolute -right-2 sm:-right-6 bottom-12 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100/50 dark:border-slate-800 p-3.5 flex items-center gap-3 w-[160px] transition-colors duration-300"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <Icon
                name="verified"
                fill
                className="text-lg text-emerald-600 dark:text-emerald-400"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Verified
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Providers
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
