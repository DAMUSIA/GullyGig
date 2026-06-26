"use client";

import React from "react";
import { motion } from "framer-motion";
import Icon from "../Icon";

const SKILLS = [
  {
    image: "/assets/home_page_images/tutoring.png",
    chip: "TUTORING",
    title: "Academic Support",
    desc: "From math wizards to language experts right in your block.",
    count: "Experts",
  },
  {
    image: "/assets/home_page_images/cooking.png",
    chip: "COOKING",
    title: "Home Chefs",
    desc: "Healthy, home-cooked meals or culinary lessons from neighbors.",
    count: "Cooks",
  },
  {
    image: "/assets/home_page_images/sewing.png",
    chip: "SEWING",
    title: "Tailoring & Crafts",
    desc: "Quick repairs, custom clothing, or textile workshops nearby.",
    count: "Tailors",
  },
];

export default function PopularSkills({
  onShowToast,
}: {
  onShowToast: (msg: string) => void;
}) {
  return (
    <section
      id="skills"
      className="scroll-mt-20 py-24 bg-brand-bg-light dark:bg-slate-900 transition-colors duration-300"
    >
      <div className="mx-auto max-w-[1140px] px-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold text-slate-800 dark:text-white mb-3">
              Popular Local Skills
            </h2>
            <div className="h-1 w-14 rounded-full bg-brand-primary mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[400px]">
              Browse our community&apos;s most sought-after expertise and find
              the help you need today.
            </p>
          </div>
          <button
            onClick={() => onShowToast("Categories directory coming soon...")}
            className="flex items-center gap-1.5 text-sm font-bold text-brand-primary dark:text-blue-400 hover:opacity-85 transition-opacity whitespace-nowrap shrink-0 cursor-pointer text-left"
            suppressHydrationWarning
          >
            <span>View All Categories</span>
            <Icon name="arrow_forward" className="text-base" />
          </button>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {SKILLS.map((s, idx) => (
            <motion.button
              key={s.title}
              onClick={() => onShowToast("Skill listings coming soon...")}
              suppressHydrationWarning
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                rotateX: 2,
                rotateY: -2,
                boxShadow: "0 25px 35px -5px rgba(37, 99, 235, 0.12)",
              }}
              className="text-left bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/50 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 hover:border-brand-primary-light dark:hover:border-slate-700 transition-all duration-300 group cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-[220px] overflow-hidden bg-slate-100 dark:bg-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.image}
                  alt={s.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Chip */}
                <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-brand-primary dark:text-blue-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                  {s.chip}
                </span>
              </div>
              {/* Body */}
              <div className="p-6">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-150 mb-2 group-hover:text-brand-primary dark:group-hover:text-blue-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                  {s.desc}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/80 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {s.count}
                  </span>
                  <span className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:bg-brand-primary group-hover:border-brand-primary dark:group-hover:bg-blue-600 dark:group-hover:border-blue-600 transition-all shadow-sm">
                    <Icon
                      name="arrow_forward"
                      className="text-sm text-slate-400 group-hover:text-white transition-colors"
                    />
                  </span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
