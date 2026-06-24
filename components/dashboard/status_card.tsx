"use client";

import React from "react";

interface StatusCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: "blue" | "purple" | "red" | "amber" | "green" | "indigo" | "emerald";
}

const colorMap: Record<
  string,
  { bg: string; text: string; border: string; hover: string }
> = {
  blue: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100/20",
    hover: "hover:border-blue-200",
  },
  purple: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100/20",
    hover: "hover:border-purple-200",
  },
  red: {
    bg: "bg-red-50",
    text: "text-red-500",
    border: "border-red-100/20",
    hover: "hover:border-red-200",
  },
  amber: {
    bg: "bg-amber-50",
    text: "text-amber-500",
    border: "border-amber-100/20",
    hover: "hover:border-amber-200",
  },
  green: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-100/20",
    hover: "hover:border-green-200",
  },
  indigo: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    border: "border-indigo-100/20",
    hover: "hover:border-indigo-200",
  },
  emerald: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100/20",
    hover: "hover:border-emerald-200",
  },
};

export function StatusCard({
  icon: Icon,
  label,
  value,
  color,
}: StatusCardProps) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 hover:-translate-y-1 hover:shadow-xl ${colors.hover} transition-all duration-300 group cursor-default`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-2xl ${colors.bg} ${colors.text} flex items-center justify-center shrink-0 border ${colors.border} group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-extrabold text-slate-800 mt-0.5">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}