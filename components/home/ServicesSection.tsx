"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "../Icon"; // Assuming this is your custom icon component

// Framer motion variants for a clean, staggered list entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function ServicesSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      id="services-section"
      className="scroll-mt-20 py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden"
    >
      {/* Force all phone numbers to be visible in dark mode */}
      <style jsx global>{`
        .dark .font-mono {
          color: #ffffff !important;
        }
        .dark .font-bold.font-mono {
          color: #ffffff !important;
        }
        .dark [class*="font-mono"] {
          color: #ffffff !important;
        }
      `}</style>

      <div className="mx-auto max-w-[1140px] px-6 relative z-10">
        {/* Minimalist Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
          >
            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-[0.2em] bg-blue-50/50 dark:bg-blue-500/10 px-4 py-1.5 rounded-full mb-5 border border-blue-100 dark:border-blue-900/30">
              Services Directory
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              Hyperlocal Services Directory
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-[540px] text-center">
              Find, view, and contact verified local instructors, tutors, home
              chefs, and other skilled professionals directly in your
              neighborhood.
            </p>
          </motion.div>
        </div>

        {/* Clean, Premium Feature Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="rounded-3xl bg-white dark:bg-slate-900 p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-between gap-12"
        >
          {/* Card Left Details */}
          <div className="space-y-8 max-w-none text-left w-full">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
                Looking for something specific?
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                Explore our comprehensive 1-column service search directory.
                Find local expertise, view full portfolios, and contact
                providers directly with zero middlemen fees.
              </p>
            </div>

            {/* Refined Micro Features List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6"
            >
              {[
                "No Commissions or Fees",
                "Direct Phone Contacts",
                "Verified Portfolios",
                "Community Rated",
              ].map((feature, idx) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center justify-center shrink-0">
                    <Icon
                      name="check_circle"
                      className="text-[18px] text-blue-500"
                      fill
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {feature}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Card Right CTA Container */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-auto">
            {/* Elegant Floating Icons */}
            <div className="relative mb-10 hidden md:block w-32 h-32">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <Icon
                  name="search"
                  className="text-4xl text-blue-600 dark:text-blue-400"
                />
              </motion.div>

              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute top-0 right-0 w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-slate-50 dark:border-slate-700"
              >
                <Icon name="star" className="text-lg text-amber-400" fill />
              </motion.div>

              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute bottom-2 left-0 w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-md border border-slate-50 dark:border-slate-700"
              >
                <Icon name="map" className="text-lg text-emerald-500" fill />
              </motion.div>
            </div>

            {/* PROPER ANIMATED BUTTON 
              - Starts Blue with White Text
              - On hover, a White Background sweeps in from the left
              - Text switches to Blue, Arrow slides in
            */}
            <Link
              href="/services"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative overflow-hidden w-full md:w-[240px] h-[56px] rounded-full bg-blue-600 dark:bg-blue-600 border border-blue-600 shadow-lg shadow-blue-500/20 flex items-center justify-center group"
            >
              {/* The Sliding White Background */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: isHovered ? "-10%" : "-100%" }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} // Smooth Apple-like easing curve
                className="absolute inset-0 bg-white z-0 rounded-full"
              />

              {/* Button Content Wrapper */}
              <div className="relative z-10 flex items-center justify-center w-full h-full overflow-hidden">
                {/* Default State (Fades out and moves down) */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isHovered ? 30 : 0,
                    opacity: isHovered ? 0 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute flex items-center gap-2 text-sm font-bold text-white tracking-wide"
                >
                  <span>Explore Directory</span>
                </motion.div>

                {/* Hover State (Fades in and moves up from bottom) */}
                <motion.div
                  initial={false}
                  animate={{
                    y: isHovered ? 0 : -30,
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-450 tracking-wide"
                >
                  <motion.span
                    initial={{ x: -10, opacity: 0 }}
                    animate={{
                      x: isHovered ? 0 : -10,
                      opacity: isHovered ? 1 : 0,
                    }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="flex items-center"
                  >
                    <Icon name="arrow_forward" className="text-lg" />
                  </motion.span>
                  <span>View Services</span>
                </motion.div>
              </div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
