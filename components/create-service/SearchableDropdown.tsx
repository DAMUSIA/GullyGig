"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface SearchableDropdownProps {
  label: string;
  required?: boolean;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  placeholder?: string;
}

export default function SearchableDropdown({
  label,
  required = false,
  options,
  value,
  onChange,
  customValue = "",
  onCustomChange,
  placeholder = "Select an option",
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery("");
  };

  const isOtherSelected = value === "Other";

  return (
    <div ref={dropdownRef} className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm text-left text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${
            isOpen
              ? "border-blue-500 ring-2 ring-blue-500/20"
              : "border-slate-200 hover:border-slate-300"
          } ${value ? "text-slate-800 font-medium" : "text-slate-400"}`}
        >
          <span>{value || placeholder}</span>
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl max-h-64 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Search Input */}
            <div className="relative p-2.5 border-b border-slate-50 flex items-center bg-slate-50/50">
              <Search className="absolute left-5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full pl-8 pr-8 py-2 bg-white border border-slate-250 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* List options */}
            <ul className="flex-1 overflow-y-auto py-1.5 max-h-48 text-sm">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left px-4 py-2.5 hover:bg-blue-50/60 hover:text-blue-600 transition-colors ${
                        value === option
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-slate-700"
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-3 text-slate-400 text-center text-xs">
                  No matching categories found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {isOtherSelected && onCustomChange && (
        <div className="pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            Custom Category <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={customValue}
            onChange={(e) => onCustomChange(e.target.value)}
            placeholder="e.g. Calligraphy Teacher, Rubik's Cube Coach"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
          />
        </div>
      )}
    </div>
  );
}
