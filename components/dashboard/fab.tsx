"use client";

import React from "react";
import { Plus } from "lucide-react";

interface FABProps {
  onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-blue-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 z-30 group cursor-pointer"
      aria-label="Create service"
    >
      <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
    </button>
  );
}
