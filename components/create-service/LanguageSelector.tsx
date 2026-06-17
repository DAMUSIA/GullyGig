"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

const POPULAR_LANGUAGES = [
  "English",
  "Hindi",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Gujarati",
  "Bengali",
  "Punjabi",
];

export default function LanguageSelector({
  selectedLanguages,
  onChange,
}: LanguageSelectorProps) {
  const [customLang, setCustomLang] = useState("");

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onChange(selectedLanguages.filter((l) => l !== lang));
    } else {
      onChange([...selectedLanguages, lang]);
    }
  };

  const handleAddCustomLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLang = customLang.trim();
    if (!cleanLang) return;
    
    // Capitalize first letter of language
    const formattedLang = cleanLang.charAt(0).toUpperCase() + cleanLang.slice(1);
    
    if (!selectedLanguages.includes(formattedLang)) {
      onChange([...selectedLanguages, formattedLang]);
    }
    setCustomLang("");
  };

  const removeLanguage = (lang: string) => {
    onChange(selectedLanguages.filter((l) => l !== lang));
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-slate-700">
          Languages You Teach In
        </label>
        <p className="text-xs text-slate-400 mt-0.5">
          Select one or more languages or add custom ones.
        </p>
      </div>

      {/* Selected Languages Chips Area */}
      {selectedLanguages.length > 0 && (
        <div className="flex flex-wrap gap-2 p-2 bg-slate-50/50 border border-slate-100 rounded-xl">
          {selectedLanguages.map((lang) => {
            return (
              <span
                key={lang}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs animate-in zoom-in-95 duration-150"
              >
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(lang)}
                  className="p-0.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Popular Options Chips Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-500">Popular Choices</label>
        <div className="flex flex-wrap gap-2">
          {POPULAR_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <button
                type="button"
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-50"
                }`}
              >
                {lang}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Language Input */}
      <form onSubmit={handleAddCustomLanguage} className="flex gap-2 max-w-sm pt-1">
        <input
          type="text"
          value={customLang}
          onChange={(e) => setCustomLang(e.target.value)}
          placeholder="Add other language..."
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center p-2 bg-blue-50 border border-blue-150 hover:bg-blue-100 text-blue-600 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
