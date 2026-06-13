"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/Icon";

const TEAM_DETAILS = [
  {
    name: "Indresh Suresh",
    role: "Co-Founder & Tech Lead",
    bio: "Indresh is a passionate engineer specializing in full-stack architecture, database design, and cloud deployments. He drives the technical vision of Kaamao, focusing on building high-performance, accessible, and secure platform architectures that make local search instant and reliable.",
    initials: "IS",
    image: "", // initials avatar
    gradient: "from-blue-600 via-indigo-600 to-indigo-700",
    skills: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Supabase",
      "REST APIs",
      "System Architecture",
    ],
    experience: "5+ Years in Full Stack Engineering",
    vision:
      "To leverage technology to build stronger, self-sustaining neighborhood economies.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:indresh@localskill.com",
    },
  },
  {
    name: "Monish Sharma",
    role: "Co-Founder & Product Lead",
    bio: "Monish leads the product strategy, user experience design, and community operations at Kaamao. With a background in user research and agile product growth, he ensures the platform remains incredibly intuitive for both tech-savvy providers and customers seeking easy local discoverability.",
    initials: "MS",
    image: "", // initials avatar
    gradient: "from-cyan-500 via-blue-500 to-blue-600",
    skills: [
      "Product Strategy",
      "UX Design",
      "User Research",
      "Agile Planning",
      "Growth Marketing",
      "Analytics",
    ],
    experience: "4+ Years in Tech Product Management",
    vision:
      "To make skill discovery as frictionless as looking out your front window.",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "mailto:monish@localskill.com",
    },
  },
];

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<"skills" | "vision">("skills");

  return (
    <div className="min-h-screen bg-slate-50 font-[Manrope,sans-serif] text-slate-800 selection:bg-brand-primary-light selection:text-brand-primary-dark relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/30 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-100/30 rounded-full filter blur-3xl -z-10" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="mx-auto flex h-[64px] max-w-[1140px] items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
              <Icon name="check" fill className="text-xs text-white" />
            </div>
            Kaamao
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-brand-primary transition-all group"
          >
            <Icon
              name="arrow_back"
              className="text-base group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-6 py-16">
        {/* Hero title */}
        <div className="text-center max-w-[680px] mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest bg-brand-primary-light px-3.5 py-1.5 rounded-full inline-block mb-4">
              Our Creators
            </span>
            <h1 className="text-[clamp(2.2rem,5vw,3.2rem)] font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
              Meet the Founders of <br />
              <span className="text-brand-primary relative">
                Kaamao
                <span className="absolute left-0 bottom-1.5 w-full h-[5px] bg-brand-primary-light/60 -z-10 rounded-full" />
              </span>
            </h1>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed">
              We started with a simple belief: every community has hidden
              expertise. Our mission is to unlock these talents, build trust
              locally, and create economic opportunities right in your
              neighborhood.
            </p>
          </motion.div>
        </div>

        {/* Founders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[960px] mx-auto">
          {TEAM_DETAILS.map((founder, idx) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.2 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-blue-500/5 overflow-hidden flex flex-col justify-between relative group hover:border-brand-primary-light transition-colors duration-300"
            >
              {/* Decorative top gradient edge */}
              <div
                className={`h-3 w-full bg-gradient-to-r ${founder.gradient}`}
              />

              <div className="p-8 md:p-10">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                  {/* Avatar Circle */}
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr ${founder.gradient} text-white flex items-center justify-center font-extrabold text-3xl sm:text-4xl shadow-lg shadow-blue-500/15 shrink-0 group-hover:scale-105 transition-transform duration-300 relative`}
                  >
                    {founder.initials}
                    {/* Ring glow */}
                    <div className="absolute inset-0 border border-white/20 rounded-3xl" />
                  </div>

                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-extrabold text-slate-800 mb-1">
                      {founder.name}
                    </h2>
                    <p className="text-sm text-brand-primary font-bold mb-3">
                      {founder.role}
                    </p>
                    <p className="text-xs text-slate-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                      <Icon name="work" className="text-sm text-slate-400" />
                      <span>{founder.experience}</span>
                    </p>
                  </div>
                </div>

                {/* Bio paragraph */}
                <p className="text-slate-600 text-sm leading-relaxed mb-8">
                  {founder.bio}
                </p>

                {/* Tabs Selector */}
                <div className="flex border-b border-slate-100 mb-6 gap-6">
                  <button
                    onClick={() => setActiveTab("skills")}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
                      activeTab === "skills"
                        ? "text-brand-primary"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <span>Core Expertise</span>
                    {activeTab === "skills" && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("vision")}
                    className={`pb-3 text-xs font-bold uppercase tracking-wider relative transition-all cursor-pointer ${
                      activeTab === "vision"
                        ? "text-brand-primary"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    <span>Mission Vision</span>
                    {activeTab === "vision" && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"
                      />
                    )}
                  </button>
                </div>

                {/* Tabs Content */}
                <div className="min-h-[120px]">
                  <AnimatePresence mode="wait">
                    {activeTab === "skills" ? (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-wrap gap-2"
                      >
                        {founder.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-brand-primary-light hover:text-brand-primary-dark px-3 py-1.5 rounded-lg transition-colors"
                          >
                            {skill}
                          </span>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="vision"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-start gap-3 bg-brand-bg-light/60 p-4 rounded-2xl border border-brand-primary-light/30"
                      >
                        <Icon
                          name="tips_and_updates"
                          className="text-xl text-brand-primary shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-brand-primary-dark mb-1">
                            Founder Vision
                          </p>
                          <p className="text-slate-600 text-xs italic leading-relaxed">
                            &ldquo;{founder.vision}&rdquo;
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Social links Footer Bar */}
              <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between gap-4">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Connect Directly
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={founder.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-brand-bg-light hover:text-brand-primary hover:border-brand-primary-light transition-all shadow-sm"
                    aria-label="GitHub Profile"
                  >
                    <Icon name="code" className="text-base" />
                  </a>
                  <a
                    href={founder.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-brand-bg-light hover:text-brand-primary hover:border-brand-primary-light transition-all shadow-sm"
                    aria-label="LinkedIn Profile"
                  >
                    <Icon name="share" className="text-base" />
                  </a>
                  <a
                    href={founder.socials.email}
                    className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-brand-bg-light hover:text-brand-primary hover:border-brand-primary-light transition-all shadow-sm"
                    aria-label="Email Founder"
                  >
                    <Icon name="mail" className="text-base" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Vision Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-[32px] p-8 md:p-12 text-center max-w-[860px] mx-auto mt-24 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full filter blur-xl -translate-x-1/2 -translate-y-1/2" />
          <Icon
            name="groups"
            className="text-4xl text-brand-primary-muted mb-6"
            fill
          />
          <h3 className="text-lg font-bold mb-3 uppercase tracking-wider text-brand-primary-light">
            Our Mission
          </h3>
          <p className="text-sm md:text-base leading-relaxed max-w-[600px] mx-auto text-slate-300">
            &ldquo;Kaamao transforms skills into opportunities and local talent
            into sustainable income, bringing neighborhoods closer together
            through trusted professional networks.&rdquo;
          </p>
        </motion.div>
      </main>
    </div>
  );
}
