"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ darkMode, onToggleDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "shadow-lg backdrop-blur-lg bg-white/75 dark:bg-slate-900/75 border-slate-200/50 dark:border-slate-800/50 py-1"
          : "border-transparent bg-transparent py-2"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1140px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <Icon name="check" fill className="text-lg text-white" />
          </div>
          <span className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight group-hover:text-brand-primary transition-colors">
            Kaamao
          </span>
        </Link>

        {/* Nav links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Features
          </Link>
          <Link
            href="/#skills"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Find Skills
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            How it Works
          </Link>
          <Link
            href="/team"
            className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-primary transition-colors relative py-1.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-brand-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Our Team
          </Link>
        </div>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand-primary transition-all active:scale-90"
            aria-label="Toggle Theme"
          >
            <Icon
              name={darkMode ? "light_mode" : "dark_mode"}
              className="text-xl"
            />
          </button>

          <Link
            href="/login"
            className="hidden sm:block text-sm font-bold text-brand-primary hover:opacity-85 transition-all active:scale-95"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="text-sm font-bold text-white px-5 py-2.5 rounded-full bg-brand-primary shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:opacity-95 hover:-translate-y-0.5 transition-all active:scale-95 text-center inline-block"
          >
            Join as Provider
          </Link>

          {/* Mobile Hamburg Navigator */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            <Icon
              name={mobileMenuOpen ? "close" : "menu"}
              className="text-xl"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg overflow-hidden shadow-xl"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <Link
                href="/#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
              >
                Features
              </Link>
              <Link
                href="/#skills"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
              >
                Find Skills
              </Link>
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
              >
                How it Works
              </Link>
              <Link
                href="/team"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-brand-primary transition-colors py-2 border-b border-slate-100 dark:border-slate-800"
              >
                Our Team
              </Link>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold text-brand-primary py-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200/40 dark:border-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold text-white py-2.5 rounded-xl bg-brand-primary hover:opacity-95 transition-opacity shadow-md shadow-blue-500/10"
                >
                  Join as Provider
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
