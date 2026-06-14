"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";

// Ordered sequence: Akshat, Indresh, Monish, Shashank, Divya, Ankita, Utkarsh
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
    name: "Sharma Monish Mukesh",
    role: "Co-Founder & Product Lead",
    initials: "MS",
    image: "/assets/teams/Monish.png",
    socials: {
      github: "https://github.com/MonishSharma01",
      linkedin: "https://www.linkedin.com/in/monish-sharma-16799b3b5/",
      email: "monishsharma0107@gmail.com",
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
    name: "Sharma Divya Gurudev",
    role: "Developer & Community Lead",
    initials: "DS",
    image: "/assets/teams/divya.png",
    socials: {
      github: "https://github.com/divyagsharma2006-blip",
      linkedin: "https://www.linkedin.com/in/divya-sharma-57673536b/",
      email: "divyagsharma2006@gmail.com",
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
    role: "Software Developer",
    initials: "UP",
    image: "/assets/teams/Utkarsh.png",
    socials: {
      github: "https://github.com/utkarshpan",
      linkedin: "https://www.linkedin.com/in/utkarsh-pandey-95507631b/",
      email: "pandeyutkarsh870@gmail.com",
    },
  },
];

// Reusable Image component that handles load error gracefully and shows a fallback icon
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 select-none">
        <Icon
          name="person"
          className="text-5xl sm:text-6xl text-slate-350 dark:text-slate-655 group-hover:scale-110 transition-transform duration-500"
          fill
        />
        <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase mt-1 sm:mt-1.5 text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded group-hover:scale-105 transition-transform duration-500">
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
      className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
    />
  );
}

// Reusable Card Component with clean hover interactions and interactive spotlight effect
function TeamMemberCard({
  member,
  isDark,
}: {
  member: (typeof TEAM_MEMBERS)[0];
  isDark: boolean;
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });

    // 3D Magnetic tilt calculations (max 8 degrees tilt on hover for smooth interactive pop)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = -((y - centerY) / centerY) * 8;
    const rotY = ((x - centerX) / centerX) * 8;
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  // Cursor spotlight color: Light blue in dark theme (#60a5fa), Dark blue in light theme (#1e40af)
  const spotlightColor = isDark ? "#60a5fa" : "#1e40af";
  const ambientGlow = isDark
    ? `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(96, 165, 250, 0.12), transparent 80%)`
    : `radial-gradient(150px circle at ${coords.x}px ${coords.y}px, rgba(30, 64, 175, 0.08), transparent 80%)`;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        y: isHovered ? -16 : 0,
        scale: isHovered ? 1.05 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-full max-w-[280px] sm:w-[290px] h-[350px] sm:h-[360px] bg-slate-100 dark:bg-slate-800/60 p-[1.5px] rounded-[24px] overflow-hidden group hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.18)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.55)] transition-shadow duration-300 mx-auto relative cursor-default border border-gray-100/10"
      style={{
        transformStyle: "preserve-3d",
        perspective: 1000,
        background: isHovered
          ? `radial-gradient(300px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`
          : undefined,
      }}
    >
      <div 
        className="w-full h-full bg-white dark:bg-slate-900 rounded-[23px] flex flex-col justify-between overflow-hidden relative z-10 transition-colors duration-300"
        style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
      >
        {/* Shimmer overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none z-20">
          <div className="w-full h-full bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.06)_40%,rgba(255,255,255,0.06)_50%,transparent_60%)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
        </div>

        {/* Mouse tracker ambient light */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
          style={{
            background: ambientGlow,
          }}
        />

        {/* Profile Image - Optimized size for mobile view responsiveness */}
        <div 
          className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] mt-6 sm:mt-8 mx-auto rounded-full p-0.5 bg-slate-100 dark:bg-slate-800 group-hover:bg-gradient-to-tr group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-500 shrink-0 z-10 shadow-md"
          style={{ transform: "translateZ(10px)" }}
        >
          <div className="w-full h-full rounded-full border-4 border-white dark:border-slate-900 overflow-hidden bg-white dark:bg-slate-900">
            <TeamMemberImage
              src={member.image}
              name={member.name}
              initials={member.initials}
            />
          </div>
        </div>

        {/* Name and Role */}
        <div 
          className="flex-grow flex flex-col pt-2 px-4 pb-2 justify-center overflow-hidden relative z-10"
          style={{ transform: "translateZ(15px)" }}
        >
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight text-center line-clamp-1 group-hover:text-brand-primary dark:group-hover:text-brand-teal transition-colors duration-300 font-['Plus_Jakarta_Sans',sans-serif]">
            {member.name}
          </h3>
          <p className="text-[9px] font-extrabold text-brand-primary dark:text-brand-teal uppercase tracking-widest mt-1.5 text-center select-none bg-brand-primary-light/40 dark:bg-brand-primary-dark/20 px-3.5 py-1 rounded-full w-fit mx-auto border border-brand-primary/10 transition-colors duration-300">
            {member.role}
          </p>
        </div>

        {/* Connect Social Bar */}
        <div className="bg-slate-50/50 dark:bg-slate-950/20 border-t border-slate-100 dark:border-slate-800/80 px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-4 shrink-0 relative z-10">
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider select-none">
            Connect
          </span>
          <div className="flex items-center gap-1.5">
            {/* GitHub */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href={member.socials.github}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-slate-250/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              aria-label="GitHub Profile"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </motion.a>

            {/* LinkedIn - Turns blue on hover */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-blue-100 dark:border-blue-950/60 bg-white dark:bg-slate-900 flex items-center justify-center text-blue-600 dark:text-blue-455 hover:bg-[#0077b5] dark:hover:bg-[#0077b5] hover:text-white dark:hover:text-white hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              aria-label="LinkedIn Profile"
            >
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </motion.a>

            {/* Email - Turns red on hover */}
            <motion.a
              whileHover={{ scale: 1.15, y: -2 }}
              href={`mailto:${member.socials.email}`}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg border border-red-100 dark:border-red-950/60 bg-white dark:bg-slate-900 flex items-center justify-center text-red-500 dark:text-red-450 hover:bg-red-500 dark:hover:bg-red-500 hover:text-white dark:hover:text-white hover:-translate-y-0.5 transition-all duration-200 shadow-sm"
              aria-label="Email Member"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const topThree = TEAM_MEMBERS.slice(0, 3);
  const bottomFour = TEAM_MEMBERS.slice(3, 7);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
    
    // Set up a MutationObserver to listen to class changes on documentElement (for dark mode changes)
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-['Plus_Jakarta_Sans',sans-serif] text-slate-800 dark:text-slate-100 selection:bg-brand-primary-light selection:text-brand-primary-dark relative overflow-hidden transition-colors duration-300">
      {/* Tech Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-100/20 dark:bg-blue-900/10 rounded-full filter blur-3xl -z-10 animate-pulse-subtle" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full filter blur-3xl -z-10 animate-pulse-subtle" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-900 transition-colors duration-300">
        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 group font-extrabold text-slate-900 dark:text-white text-lg"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white">
              <Icon name="check" fill className="text-xs text-white" />
            </div>
            Kaamao
          </Link>
          <div className="flex items-center gap-4">
            {/* Interactive Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-brand-bg-light dark:hover:bg-slate-800 transition-all cursor-pointer shadow-sm"
              title="Toggle Dark Mode"
            >
              <Icon
                name={isDark ? "light_mode" : "dark_mode"}
                className="text-xl"
                fill
              />
            </button>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-brand-primary dark:hover:text-brand-primary-light transition-all group"
            >
              <Icon
                name="arrow_back"
                className="text-base group-hover:-translate-x-1 transition-transform"
              />
              {/* Responsive: Hide text on mobile viewports */}
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Page container */}
      <main className="mx-auto max-w-[1400px] px-4 sm:px-6 py-10 sm:py-16">
        {/* Hero title - About text paragraph removed as requested */}
        <div className="text-center max-w-[680px] mx-auto mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-primary font-bold text-xs uppercase tracking-widest bg-brand-primary-light dark:bg-brand-primary-dark/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
              Our Creators
            </span>
            <h1 className="text-[clamp(2.0rem,5vw,3.2rem)] font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
              Meet the Team behind <br />
              <span className="text-brand-primary relative">
                Kaamao
                <span className="absolute left-0 bottom-1.5 w-full h-[5px] bg-brand-primary-light/60 dark:bg-brand-primary-dark/40 -z-10 rounded-full" />
              </span>
            </h1>
          </motion.div>
        </div>

        {/* 3 Up, 4 Below layout on Desktop, perfectly uniform vertically on Mobile */}
        <div className="space-y-6 sm:space-y-8 md:space-y-10 w-full max-w-[1400px] mx-auto flex flex-col items-center">
          {/* Row 1: 3 cards up */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 w-full">
            {topThree.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <TeamMemberCard member={member} isDark={isDark} />
              </motion.div>
            ))}
          </div>

          {/* Row 2: 4 cards below */}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 w-full">
            {bottomFour.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: (idx + 3) * 0.05 }}
              >
                <TeamMemberCard member={member} isDark={isDark} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Company Vision Banner / Our Mission with Stylish Playfair Display font */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 text-center max-w-[880px] mx-auto mt-16 sm:mt-24 relative overflow-hidden shadow-2xl border border-slate-800 dark:border-slate-850"
        >
          <div className="absolute top-0 left-0 w-48 h-48 bg-brand-primary/10 rounded-full filter blur-xl -translate-x-1/2 -translate-y-1/2" />
          <Icon
            name="groups"
            className="text-3xl sm:text-4xl text-brand-primary-muted mb-4 sm:mb-6"
            fill
          />
          <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-brand-primary-light mb-3 sm:mb-4">
            Our Mission
          </h3>
          <p className="text-lg sm:text-xl md:text-[23px] leading-relaxed font-medium italic max-w-[740px] mx-auto text-slate-100 tracking-wide font-['Playfair_Display',serif] bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-white to-slate-100 py-1 sm:py-2 leading-8 sm:leading-9">
            &ldquo;Kaamao transforms skills into opportunities and local talent
            into sustainable income, bringing neighborhoods closer together
            through trusted professional networks.&rdquo;
          </p>
        </motion.div>
      </main>
    </div>
  );
}
