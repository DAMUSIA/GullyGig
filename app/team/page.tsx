"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  Variants,
} from "framer-motion";
import Icon from "@/components/Icon";

const TEAM_MEMBERS = [
  {
    name: "Sabnis Akshat Shailesh",
    role: "Founder & CEO",
    initials: "AS",
    image: "/assets/teams/Akshat.png",
    socials: {
      github: "https://github.com/dontknowhowtocode69",
      linkedin: "https://www.linkedin.com/in/akshat-sabnis-84a139336/",
      email: "sabnisakshat5@gmail.com",
    },
  },
  {
    name: "Pathinenchil Indresh Suresh",
    role: "Co-Founder & CTO",
    initials: "IS",
    image: "/assets/teams/indresh.jpeg",
    socials: {
      github: "https://github.com/indresh404",
      linkedin: "https://www.linkedin.com/in/indresh-suresh-093646399",
      email: "indreshsuresh95@gmail.com",
    },
  },
  {
    name: "Sharma Divya Gurudev",
    role: "Co-Founder & Community Lead",
    initials: "DS",
    image: "/assets/teams/divya.png",
    socials: {
      github: "https://github.com/divyaa404",
      linkedin: "https://www.linkedin.com/in/divya-sharma-57673536b/",
      email: "divyagsharma2006@gmail.com",
    },
  },
  {
    name: "Sharma Shashank Rajesh",
    role: "Marketing & Operations",
    initials: "SS",
    image: "/assets/teams/Shashank.png",
    socials: {
      github: "https://github.com/shashsharmaa",
      linkedin: "https://www.linkedin.com/in/shashank-sharma-2376993b8/",
      email: "shashanksharmatech2476@gmail.com",
    },
  },
  {
    name: "Sharma Monish Mukesh",
    role: "Product Lead & Developer",
    initials: "MS",
    image: "/assets/teams/Monish.png",
    socials: {
      github: "https://github.com/MonishSharma01",
      linkedin: "https://www.linkedin.com/in/monish-sharma-16799b3b5/",
      email: "monishsharma0107@gmail.com",
    },
  },
  {
    name: "Rajbhar Ankita Ganesh",
    role: "Software Developer",
    initials: "AR",
    image: "/assets/teams/Ankita.png",
    socials: {
      github: "https://github.com/Ankita0325",
      linkedin: "https://www.linkedin.com/in/ankita-rajbhar-303a01307/",
      email: "ankitar1979@gmail.com",
    },
  },
  {
    name: "Pandey Utkarsh Ramesh",
    role: "Founding Eng. & Developer",
    initials: "UP",
    image: "/assets/teams/Utkarsh.png",
    socials: {
      github: "https://github.com/utkarshpan",
      linkedin: "https://www.linkedin.com/in/utkarsh-pandey-95507631b/",
      email: "pandeyutkarsh870@gmail.com",
    },
  },
];

function TeamMemberImage({
  src,
  name,
  initials,
}: {
  src: string;
  name: string;
  initials: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 select-none rounded-full">
        <Icon
          name="person"
          className="text-7xl sm:text-8xl text-slate-300 dark:text-slate-600 transition-transform duration-700 group-hover:scale-110 group-hover:text-blue-200"
          fill
        />
        <span className="text-sm font-bold tracking-wider uppercase mt-2 text-slate-500 dark:text-slate-400 group-hover:text-blue-100 transition-colors duration-500">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className="w-full h-full object-cover transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-110"
    />
  );
}

function TeamMemberCard({
  member,
  isDark,
}: {
  member: (typeof TEAM_MEMBERS)[0];
  isDark: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Smooth, premium spring physics
  const springConfig = { damping: 20, stiffness: 100, mass: 0.5 };

  // Card Tilt Values
  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);
  const mouseXSpring = useSpring(xPct, springConfig);
  const mouseYSpring = useSpring(yPct, springConfig);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  // Spotlight Position Values (GPU Accelerated)
  const spotX = useMotionValue(150);
  const spotY = useMotionValue(200);
  const spotXSpring = useSpring(spotX, { damping: 30, stiffness: 150 });
  const spotYSpring = useSpring(spotY, { damping: 30, stiffness: 150 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    xPct.set(mouseX / width - 0.5);
    yPct.set(mouseY / height - 0.5);
    spotX.set(mouseX);
    spotY.set(mouseY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xPct.set(0);
    yPct.set(0);
    spotX.set(150);
    spotY.set(220);
  };

  const cursorGlow = useMotionTemplate`radial-gradient(350px circle at ${spotXSpring}px ${spotYSpring}px, ${
    isDark ? "rgba(59, 130, 246, 0.25)" : "rgba(37, 99, 235, 0.12)"
  }, transparent 70%)`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 1500,
      }}
      animate={{
        y: isHovered ? -12 : 0,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", damping: 20, stiffness: 150 }}
      className="w-full max-w-[310px] h-[450px] group relative mx-auto rounded-[34px] shadow-lg hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] transition-shadow duration-700"
    >
      {/* Main Background Layer */}
      <div className="absolute inset-0 bg-white dark:bg-slate-900 rounded-[34px] overflow-hidden z-10">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 bg-gradient-to-br from-blue-50/80 via-blue-100/30 to-white dark:from-blue-950/90 dark:via-slate-900 dark:to-slate-900" />
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 z-0 mix-blend-overlay"
          style={{ background: cursorGlow }}
        />
      </div>

      {/* Subtle border shadow */}
      <div className="absolute inset-0 rounded-[34px] border border-slate-200/60 dark:border-slate-800 z-0 pointer-events-none" />

      {/* 3D Content Layer */}
      <div className="absolute inset-[2px] flex flex-col justify-between z-20 pointer-events-none rounded-[32px] [transform-style:preserve-3d]">
        {/* Profile Image with Thin White Border + Animation - FIXED */}
        <div
          className="relative w-[180px] h-[180px] mt-8 mx-auto rounded-full shrink-0 shadow-xl group-hover:shadow-blue-500/30 pointer-events-auto"
          style={{ transform: "translateZ(50px)" }}
        >
          {/* Animated border layer (behind the white border) */}
          <div className="absolute inset-[-3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            {/* Rotating gradient */}
            <div className="absolute inset-[-2px] rounded-full bg-[conic-gradient(from_0deg,transparent_60%,#3b82f6_70%,#8b5cf6_80%,transparent_90%)] animate-[spin_4s_linear_infinite]" />
            {/* Subtle glow */}
            <div className="absolute inset-[-8px] rounded-full blur-xl bg-blue-500/10 animate-[spin_4s_linear_infinite]" />
          </div>

          {/* Thin white border - FIXED: Higher z-index, proper stacking */}
          <div className="absolute inset-0 rounded-full border-[4px] border-white/90 dark:border-white/70 z-30 pointer-events-none" />

          {/* Profile image container - FIXED: Lower z-index to show border properly */}
          <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-slate-900 relative z-20">
            <TeamMemberImage
              src={member.image}
              name={member.name}
              initials={member.initials}
            />
          </div>
        </div>

        {/* Info Section */}
        <div
          className="flex-grow flex flex-col pt-6 px-4 pb-4 justify-center relative pointer-events-auto transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ transform: "translateZ(40px)" }}
        >
          <h3 className="text-[17px] sm:text-[18px] font-extrabold text-slate-900 dark:text-white tracking-tight text-center line-clamp-2 transition-colors duration-500 group-hover:text-blue-900 dark:group-hover:text-blue-100">
            {member.name}
          </h3>
          <p className="text-[11px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 mt-2 text-center bg-blue-50 dark:bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white px-5 py-2 rounded-full w-fit mx-auto border border-blue-100 dark:border-blue-500/20 group-hover:border-transparent transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
            {member.role}
          </p>
        </div>

        {/* Social Connect Bar */}
        <div
          className="bg-slate-50 dark:bg-slate-950/50 group-hover:bg-white/40 dark:group-hover:bg-blue-950/40 border-t border-slate-100 dark:border-slate-800 group-hover:border-transparent px-6 py-5 flex items-center justify-between gap-4 shrink-0 relative backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] pointer-events-auto rounded-b-[32px]"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 font-bold uppercase tracking-widest select-none transition-colors duration-500">
            Connect
          </span>
          <div className="flex items-center gap-2.5">
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-1.5 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md"
              aria-label="GitHub Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full border border-blue-100 dark:border-blue-900 bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-[#0077b5] dark:hover:bg-[#0077b5] hover:text-white dark:hover:text-white hover:-translate-y-1.5 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/20"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href={`mailto:${member.socials.email}`}
              className="w-9 h-9 rounded-full border border-red-100 dark:border-red-900 bg-white dark:bg-slate-800 flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white hover:-translate-y-1.5 hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-red-500/20"
              aria-label="Email Member"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Container variants for staggered entrance - Fixed with proper typing
const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function TeamPage() {
  const topThree = TEAM_MEMBERS.slice(0, 3);
  const bottomFour = TEAM_MEMBERS.slice(3, 7);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsDark(isDarkTheme);

    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      setIsDark(false);
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      setIsDark(true);
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-blue-500/30 selection:text-blue-900 dark:selection:text-blue-100 relative overflow-hidden transition-colors duration-500 pb-24">
      {/* Background Floating Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-400/15 dark:bg-blue-600/15 rounded-full filter blur-[140px] -z-10 pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 20, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-400/15 dark:bg-indigo-600/15 rounded-full filter blur-[140px] -z-10 pointer-events-none"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-[#0B1120]/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-500">
        <div className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
              <Icon name="check" fill className="text-sm text-white" />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white text-xl tracking-tight">
              Kaamao
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={toggleDarkMode}
              className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 shadow-sm hover:scale-105"
              aria-label="Toggle Dark Mode"
            >
              <Icon
                name={isDark ? "light_mode" : "dark_mode"}
                className="text-2xl"
                fill
              />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                <Icon
                  name="arrow_back"
                  className="text-lg group-hover:-translate-x-1 transition-transform duration-300"
                />
              </div>
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs sm:text-sm uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-5 py-2 rounded-full inline-block mb-6 border border-blue-200 dark:border-blue-500/20 shadow-sm">
              Our Creators
            </span>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
              Meet the Team <br /> behind{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 relative">
                Kaamao
                <svg
                  className="absolute w-full h-3 -bottom-1 left-0 text-blue-500/30 dark:text-blue-400/30"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 5 Q 50 10 100 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  />
                </svg>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Coordinated Entry Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-10 lg:gap-14 w-full"
        >
          {/* Row 1: Top 3 */}
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-5xl mx-auto">
            {topThree.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex justify-center"
              >
                <TeamMemberCard member={member} isDark={isDark} />
              </motion.div>
            ))}
          </div>

          {/* Row 2: Bottom 4 */}
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8 w-full">
            {bottomFour.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-24px)] flex justify-center"
              >
                <TeamMemberCard member={member} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mission Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0B1120] text-white rounded-[32px] sm:rounded-[40px] p-10 sm:p-16 text-center max-w-5xl mx-auto mt-28 sm:mt-36 relative overflow-hidden shadow-2xl border border-slate-700/50"
        >
          <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full filter blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

          <Icon
            name="groups"
            className="text-5xl sm:text-6xl text-blue-400 mb-8"
            fill
          />
          <h3 className="text-sm font-extrabold uppercase tracking-[0.3em] text-slate-400 mb-6">
            Our Mission
          </h3>
          <p className="text-2xl sm:text-3xl md:text-4xl leading-snug font-medium italic max-w-4xl mx-auto text-slate-100 tracking-wide font-['Playfair_Display',serif]">
            &ldquo;Kaamao transforms skills into opportunities and local talent
            into sustainable income, bringing neighborhoods closer together
            through trusted professional networks.&rdquo;
          </p>
        </motion.div>
      </main>
    </div>
  );
}
