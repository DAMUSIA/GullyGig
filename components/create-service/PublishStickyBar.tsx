"use client";

import React from "react";
import { Send, Loader2 } from "lucide-react";

interface PublishStickyBarProps {
  isValid: boolean;
  isLoading: boolean;
  onPublish: () => void;
}

export default function PublishStickyBar({
  isValid,
  isLoading,
  onPublish,
}: PublishStickyBarProps) {
  return (
    <div className="mt-10 bg-white/90 border-t border-slate-200/70 shadow-sm px-4 py-4 md:py-5 animate-in fade-in duration-300 rounded-3xl">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4 ">
        {/* Help Tip */}
        <div className="hidden md:block text-left ">
          <h4 className="text-xs font-bold text-slate-700">Ready to go?</h4>
          <p className="text-[10px] text-slate-400">
            {isValid
              ? "All required fields are ready. Hit publish to go live!"
              : "Complete the required fields to publish your teaching service."}
          </p>
        </div>

        {/* Publish Button */}
        <button
          type="button"
          onClick={onPublish}
          disabled={!isValid || isLoading}
          className={`relative w-full md:w-auto md:min-w-64 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold tracking-wide transition-all duration-200 active:scale-98 cursor-pointer overflow-hidden ${
            isValid && !isLoading
              ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30"
              : "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Publishing Service...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Publish Service</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
