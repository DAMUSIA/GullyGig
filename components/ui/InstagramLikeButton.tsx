"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

interface InstagramLikeButtonProps {
  isLiked: boolean;
  onToggle: () => void;
  likesCount?: number;
  showCount?: boolean;
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  darkMode?: boolean;
  variant?: "pill" | "icon-only" | "hero-full";
}

export default function InstagramLikeButton({
  isLiked,
  onToggle,
  likesCount,
  showCount = false,
  label,
  className = "",
  size = "md",
  darkMode = false,
  variant = "pill",
}: InstagramLikeButtonProps) {
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Trigger burst particles if transitioning to liked state
    if (!isLiked) {
      setParticles([1, 2, 3, 4, 5, 6]);
      setTimeout(() => setParticles([]), 700);
    }

    onToggle();
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  if (variant === "hero-full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isLiked}
        className={`relative flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition-all active:scale-95 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          isLiked
            ? "text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20"
            : "text-white/90 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10"
        } ${className}`}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: isLiked ? 0.7 : 1 }}
            animate={{
              scale: isLiked ? [1, 1.45, 0.9, 1.15, 1] : [1, 0.85, 1],
            }}
            transition={{ duration: isLiked ? 0.45 : 0.25, ease: "easeOut" }}
          >
            <Heart
              className={`${iconSizes[size]} transition-colors duration-200 ${
                isLiked ? "fill-red-400 text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.6)]" : "text-white/90"
              }`}
            />
          </motion.div>

          {/* Micro sparkle burst particles */}
          <AnimatePresence>
            {particles.length > 0 &&
              particles.map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                const distance = 16;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: [0, 1.2, 0.4],
                      x,
                      y,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 pointer-events-none"
                  />
                );
              })}
          </AnimatePresence>
        </div>

        <span>
          {label || (isLiked ? "Saved to Favourites" : "Save to Favourites")}
        </span>

        {showCount && typeof likesCount === "number" && (
          <span className="text-xs font-bold font-mono opacity-80 ml-0.5">
            ({likesCount})
          </span>
        )}
      </button>
    );
  }

  if (variant === "icon-only") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={isLiked}
        className={`relative p-2 sm:p-2.5 rounded-xl border transition-all duration-200 active:scale-90 cursor-pointer select-none flex items-center justify-center ${
          isLiked
            ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-xs shadow-red-500/10"
            : darkMode
            ? "bg-slate-800/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
            : "bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
        } ${className}`}
        title={isLiked ? "Liked" : "Like"}
      >
        <div className="relative flex items-center justify-center">
          <motion.div
            key={isLiked ? "liked" : "unliked"}
            initial={{ scale: isLiked ? 0.7 : 1 }}
            animate={{
              scale: isLiked ? [1, 1.45, 0.9, 1.15, 1] : [1, 0.85, 1],
            }}
            transition={{ duration: isLiked ? 0.45 : 0.25, ease: "easeOut" }}
          >
            <Heart
              className={`${iconSizes[size]} transition-colors duration-200 ${
                isLiked ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" : ""
              }`}
            />
          </motion.div>

          {/* Micro burst particles */}
          <AnimatePresence>
            {particles.length > 0 &&
              particles.map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                const distance = 14;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;

                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: [0, 1.2, 0.3],
                      x,
                      y,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 pointer-events-none"
                  />
                );
              })}
          </AnimatePresence>
        </div>
      </button>
    );
  }

  // Default "pill" variant
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isLiked}
      className={`relative border font-bold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2 rounded-full flex items-center gap-2 transition-all duration-200 active:scale-95 cursor-pointer select-none shadow-xs ${
        isLiked
          ? "text-red-500 border-red-500/30 bg-red-500/10 shadow-red-500/10"
          : darkMode
          ? "border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
      } ${className}`}
      title={isLiked ? "Saved" : "Save"}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          key={isLiked ? "liked" : "unliked"}
          initial={{ scale: isLiked ? 0.7 : 1 }}
          animate={{
            scale: isLiked ? [1, 1.45, 0.9, 1.15, 1] : [1, 0.85, 1],
          }}
          transition={{ duration: isLiked ? 0.45 : 0.25, ease: "easeOut" }}
        >
          <Heart
            className={`${iconSizes[size]} transition-colors duration-200 ${
              isLiked ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" : ""
            }`}
          />
        </motion.div>

        {/* Micro burst particles */}
        <AnimatePresence>
          {particles.length > 0 &&
            particles.map((_, i) => {
              const angle = (i * 60 * Math.PI) / 180;
              const distance = 14;
              const x = Math.cos(angle) * distance;
              const y = Math.sin(angle) * distance;

              return (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 0,
                    scale: [0, 1.2, 0.3],
                    x,
                    y,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-pink-500 to-red-500 pointer-events-none"
                />
              );
            })}
        </AnimatePresence>
      </div>

      <span>
        {label || (isLiked ? "Saved" : "Save")}
      </span>

      {showCount && typeof likesCount === "number" && (
        <span className="font-mono text-xs font-extrabold opacity-85">
          {likesCount}
        </span>
      )}
    </button>
  );
}
