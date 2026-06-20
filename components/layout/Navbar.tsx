"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../Icon";

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

const NAV_LINKS = [
  { name: "Features", href: "/#features", id: "features" },
  { name: "Find Skills", href: "/#skills", id: "skills" },
  { name: "How it Works", href: "/#how-it-works", id: "how-it-works" },
  { name: "Our Team", href: "/team", id: "team" },
];

export default function Navbar({ darkMode, onToggleDarkMode }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Handle Scroll tracking for background blur and Active Link Indicator (ScrollSpy)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);

      // ScrollSpy Logic: Detect which section is currently in view
      const sections = NAV_LINKS.map((link) => link.id).filter(Boolean);
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the top of the section is within 150px of the viewport top, mark it active
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
          }
        }
      }

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll handler for anchor links
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string,
  ) => {
    if (href.startsWith("/#")) {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        // Close mobile menu if open
        setMobileMenuOpen(false);
        // Smooth scroll with an offset to account for the fixed navbar height
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } else {
      // Normal page transition (e.g., /team)
      setMobileMenuOpen(false);
    }
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "shadow-sm backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-slate-200/50 dark:border-slate-800/50 py-1"
          : "border-transparent bg-transparent py-2 lg:py-3"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group z-50">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary text-white shadow-lg shadow-brand-primary/20 transition-colors"
          >
            <Icon name="check" fill className="text-xl text-white" />
          </motion.div>
          <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-brand-primary transition-colors">
            Kaamao
          </span>
        </Link>

        {/* Nav links (Desktop) - ScrollSpy + Underline Hover */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.id)}
                className={`text-sm font-bold transition-colors relative py-1.5 
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-brand-primary after:transition-transform after:duration-300 
                  ${
                    isActive
                      ? "text-brand-primary after:scale-x-100 after:origin-bottom-left"
                      : "text-slate-600 dark:text-slate-300 hover:text-brand-primary after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Actions & Theme Toggle */}
        <div className="flex items-center gap-3 md:gap-4 z-50">
          {/* Theme Toggle Button - Animated Icon Swap */}
          <motion.button
            onClick={onToggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand-primary border border-slate-200/50 dark:border-slate-700/50 transition-colors overflow-hidden"
            aria-label="Toggle Theme"
            suppressHydrationWarning
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={darkMode ? "dark" : "light"}
                initial={{ y: -10, opacity: 0, rotate: -60 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 10, opacity: 0, rotate: 60 }}
                transition={{ duration: 0.25, ease: "backOut" }}
                className="absolute flex items-center justify-center"
              >
                <Icon
                  name={darkMode ? "light_mode" : "dark_mode"}
                  className="text-[22px]"
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Authentication Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-brand-primary dark:hover:text-brand-primary transition-colors active:scale-95"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-bold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-center"
            >
              Register Now
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50 transition-colors overflow-hidden relative"
            aria-label="Toggle Menu"
            suppressHydrationWarning
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={mobileMenuOpen ? "close" : "menu"}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <Icon
                  name={mobileMenuOpen ? "close" : "menu"}
                  className="text-2xl"
                />
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      {/* Mobile Dropdown Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-slate-200/50 dark:border-slate-800/50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl overflow-hidden shadow-2xl absolute w-full"
          >
            <div className="flex flex-col px-6 py-6 gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <motion.div key={link.name} variants={mobileItemVariants}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href, link.id)}
                      className={`block text-base font-bold transition-colors py-3.5 border-b border-slate-100 dark:border-slate-800/60 ${
                        isActive
                          ? "text-brand-primary"
                          : "text-slate-700 dark:text-slate-200 hover:text-brand-primary"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                variants={mobileItemVariants}
                className="flex flex-col gap-3 pt-6 pb-2"
              >
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold text-slate-700 dark:text-slate-200 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200/50 dark:border-slate-700/50 active:scale-95"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center text-sm font-bold text-white py-3 rounded-xl bg-brand-primary hover:bg-brand-primary-dark transition-colors shadow-lg shadow-brand-primary/20 active:scale-95"
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
