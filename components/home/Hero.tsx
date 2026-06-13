"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon";

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

export default function Hero({ onShowToast }: HeroProps) {
  const [skill, setSkill] = useState("");
  const [location, setLocation] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative pt-[100px] pb-16 min-h-[90vh] flex items-center overflow-hidden bg-brand-bg-light dark:bg-slate-900 transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 rounded-full filter blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-3xl -z-10 animate-pulse delay-1000" />

      <div className="mx-auto max-w-[1140px] px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-primary-light dark:bg-slate-800 text-brand-primary-dark dark:text-brand-primary text-xs font-bold uppercase tracking-wider mb-6"
          >
            <span>Empower Your Skills &bull; Discover Locally</span>
          </motion.div>

          <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-[1.15] tracking-tight text-slate-900 dark:text-white mb-6">
            Find Trusted Local <br />
            <span className="text-brand-primary relative inline-block">
              Skilled Workers
              <span className="absolute left-0 bottom-1 w-full h-[6px] bg-brand-primary-light/50 dark:bg-brand-primary-dark/30 -z-10 rounded-full" />
            </span>{" "}
            Near You
          </h1>

          <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-[480px]">
            Discover tutors, cooks, babysitters, tailors, and other skilled
            professionals in your neighborhood. Kaamao helps workers showcase
            their talent and customers connect with local experts directly.
          </p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch gap-2 p-2 mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-700 max-w-[560px]"
          >
            <div className="flex flex-1 items-center gap-2 px-3 py-2.5 border-b sm:border-b-0 sm:border-r border-slate-100 dark:border-slate-700">
              <Icon
                name="search"
                className="text-xl text-slate-400 dark:text-slate-500 shrink-0"
              />
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                placeholder="What skill do you need?"
                className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <div className="flex flex-1 items-center gap-2 px-3 py-2.5">
              <Icon
                name="location_on"
                className="text-xl text-slate-400 dark:text-slate-500 shrink-0"
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Near your neighborhood"
                className="w-full bg-transparent outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
            <button
              onClick={() => onShowToast("Search functionality coming soon...")}
              className="shrink-0 text-white bg-brand-primary font-bold text-sm px-8 py-3 sm:py-0 rounded-xl hover:opacity-95 active:scale-95 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              Search
            </button>
          </motion.div>

          {/* Quick buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-brand-primary text-white font-bold text-sm shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all active:scale-95 text-center"
            >
              Become a Service Provider
            </Link>
            <button
              onClick={() => {
                const element = document.getElementById("skills");
                element?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-750 hover:-translate-y-0.5 transition-all active:scale-95 text-center cursor-pointer"
            >
              Find Services
            </button>
          </div>

          {/* Stats indicators */}
          <div className="flex items-center gap-8 border-t border-slate-200/60 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-3">
              <span className="text-amber-500 text-2xl">★</span>
              <div>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                  4.9 / 5
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Community Rating
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/15">
                <Icon name="check" className="text-sm" fill />
              </div>
              <div>
                <p className="text-base font-extrabold text-slate-800 dark:text-slate-200 leading-tight">
                  2,500+
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Verified Providers
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Carousel & Floating Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          {/* Main Carousel Frame */}
          <div className="relative w-[440px] h-[460px] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800 transition-colors duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={carouselIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0"
              >
                <img
                  src={SLIDES[carouselIndex].src}
                  alt={SLIDES[carouselIndex].label}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
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
                />
              ))}
            </div>
          </div>

          {/* Floating Card 1 - Discovery Connections */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -left-6 top-12 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100/50 dark:border-slate-700/50 p-3.5 flex items-center gap-3 w-[200px] transition-colors duration-300"
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

          {/* Floating Card 2 - Connection activity */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -right-6 bottom-8 z-20 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100/50 dark:border-slate-700/50 p-4 w-[170px] transition-colors duration-300"
          >
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-2 uppercase tracking-wide">
              Active connections
            </p>
            <div className="flex items-end gap-1.5 h-10">
              {[35, 55, 45, 75, 60, 90].map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h}%` }}
                  className={`flex-1 rounded-sm transition-all duration-500 ${
                    i === 5
                      ? "bg-brand-primary shadow-sm shadow-blue-500/30"
                      : "bg-brand-primary-light dark:bg-slate-700"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
