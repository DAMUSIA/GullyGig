"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-gray-100 flex flex-col justify-center items-center p-6 overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/10 blur-[120px] pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 max-w-xl w-full text-center space-y-8 bg-slate-900/40 backdrop-blur-md border border-slate-800 p-10 rounded-3xl shadow-2xl">
        {/* Logo Icon */}
        <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/10 animate-pulse-subtle">
          <svg
            className="w-8 h-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
            Kaamao Connect
          </h1>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            Bridge the gap between local talent and community needs. Verify
            ideas, connect, and build together.
          </p>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
