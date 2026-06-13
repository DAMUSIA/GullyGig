"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "../Icon";

const TEAM_MEMBERS = [
  {
    name: "Indresh Suresh",
    role: "Co-Founder & Tech Lead",
    bio: "Passionate about building scalable applications and empowering local communities.",
    initials: "IS",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "Monish Sharma",
    role: "Co-Founder & Product Lead",
    bio: "Focused on creating intuitive user experiences and local economic growth.",
    initials: "MS",
    gradient: "from-cyan-500 to-blue-600",
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-brand-bg-light relative overflow-hidden">
      <div className="mx-auto max-w-[1140px] px-6 relative z-10">
        {/* Heading */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[clamp(1.8rem,3.5vw,2.4rem)] font-extrabold text-slate-800 mb-3">
              Meet Our Founders
            </h2>
            <div className="mx-auto mb-5 h-1 w-14 rounded-full bg-brand-primary" />
            <p className="text-sm text-slate-500 leading-relaxed max-w-[480px] mx-auto">
              The minds behind LocalSkill Connect, transforming local skills
              into sustainable income opportunities.
            </p>
          </motion.div>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto mb-12">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-blue-500/5 flex flex-col items-center text-center group"
            >
              {/* Profile Initials Avatar */}
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${member.gradient} text-white flex items-center justify-center font-extrabold text-2xl mb-6 shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300`}
              >
                {member.initials}
              </div>

              <h3 className="text-lg font-extrabold text-slate-800 mb-1">
                {member.name}
              </h3>
              <p className="text-sm text-brand-primary font-bold mb-4">
                {member.role}
              </p>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Button to Team Page */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-brand-primary hover:opacity-95 rounded-full px-8 py-3.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all active:scale-95 hover:-translate-y-0.5"
            >
              <span>Explore Our Journey &amp; details</span>
              <Icon name="arrow_forward" className="text-base" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
