"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Icon from "@/components/Icon";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import PopularSkills from "@/components/home/PopularSkills";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  const [toast, setToast] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

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
      className={`min-h-screen font-[Manrope,sans-serif] text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 selection:bg-brand-primary-light selection:text-brand-primary-dark transition-colors duration-300 ${darkMode ? "dark" : ""}`}
    >
      {/* HEADER */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* MAIN CONTENT */}
      <main>
        {/* HERO */}
        <Hero onShowToast={showToast} />

        {/* FEATURES */}
        <Features />

        {/* POPULAR LOCAL SKILLS */}
        <PopularSkills onShowToast={showToast} />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* TRUST SECTION */}
        <TrustSection onShowToast={showToast} />

        {/* CTA BANNER */}
        <section className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
          <div className="mx-auto max-w-[1140px] px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="rounded-[36px] bg-gradient-to-br from-brand-primary to-brand-primary-dark p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-500/10"
            >
              {/* Background accent shapes */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 filter blur-2xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-teal/10 rounded-full translate-y-1/2 -translate-x-1/2 filter blur-xl" />

              <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold mb-4 leading-tight">
                Ready to Connect with <br className="hidden sm:inline" />
                Your Local Experts?
              </h2>
              <p className="text-blue-100 text-sm md:text-base leading-relaxed mb-10 max-w-[500px] mx-auto opacity-90">
                Join thousands of neighbors already growing their skills and
                simplifying their lives with Kaamao.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link
                  href="/register"
                  className="w-full sm:w-auto text-center text-sm font-bold text-brand-primary dark:text-blue-400 bg-white dark:bg-slate-900 px-8 py-4 rounded-full shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Find Nearby Services
                </Link>
                <Link
                  href="/register"
                  className="w-full sm:w-auto text-center text-sm font-bold text-white bg-brand-teal px-8 py-4 rounded-full shadow-lg hover:opacity-95 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
                >
                  Register as Provider
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <Footer onShowToast={showToast} />

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl shadow-2xl text-sm font-semibold tracking-wide"
          >
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 shrink-0">
              <Icon name="info" className="text-[14px]" />
            </div>
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
