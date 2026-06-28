import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Icon from "@/components/Icon";

interface HeaderProps {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export default function Header({ isDark, toggleDarkMode }: HeaderProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-all duration-300 py-1">
      <div className="mx-auto flex h-[72px] max-w-[1140px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center group z-50">
          <div className="relative h-22 w-32 sm:h-22 sm:w-48 flex-shrink-0">
            <Image
              src={isDark ? "/logo_light.png" : "/logo_dark.png"}
              alt="Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-3 md:gap-4 z-50">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-350 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-brand-primary border border-slate-200/50 dark:border-slate-750/50 transition-colors flex items-center justify-center cursor-pointer shadow-2xs active:scale-95 shrink-0"
            aria-label="Toggle Theme"
          >
            <Icon
              name={isDark ? "light_mode" : "dark_mode"}
              className="text-lg"
            />
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 h-10 w-10 sm:w-auto sm:px-4.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl shadow-md transition cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
            {/* Hidden on mobile, visible on sm (640px) and up */}
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
