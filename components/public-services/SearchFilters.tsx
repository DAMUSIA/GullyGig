import React from "react";
import { Search, MapPin, Loader2, Navigation } from "lucide-react";

const CATEGORY_CHIPS = [
  "All",
  "Yoga",
  "Dance",
  "Guitar",
  "Gym",
  "Tuition",
  "Fitness",
  "Music",
  "Other",
];

interface SearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  locationQuery: string;
  setLocationQuery: (query: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  detectingLoc: boolean;
  handleAutoDetectLocation: () => void;
  setCurrentPage: (page: number) => void;
}

export default function SearchFilters({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  sortBy,
  setSortBy,
  selectedCategory,
  setSelectedCategory,
  detectingLoc,
  handleAutoDetectLocation,
  setCurrentPage,
}: SearchFiltersProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-md shadow-blue-500/5 mb-8 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="relative md:col-span-5">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search keywords, title, or provider name..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>

        <div className="relative md:col-span-4 flex items-center">
          <div className="relative w-full">
            <MapPin className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => {
                setLocationQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Filter by city or locality..."
              className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500 text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />

            <button
              type="button"
              onClick={handleAutoDetectLocation}
              disabled={detectingLoc}
              title="Auto Detect Location"
              className="absolute right-2 top-2 p-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:text-brand-primary dark:hover:text-blue-450 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {detectingLoc ? (
                <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
              ) : (
                <Navigation className="h-4 w-4 fill-brand-primary/10" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:col-span-3">
          <label
            htmlFor="service-sort"
            className="text-[10px] md:text-xs font-bold text-slate-450 uppercase tracking-wider shrink-0"
          >
            Sort:
          </label>
          <select
            id="service-sort"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            <option value="Newest">Newest Listed</option>
            <option value="Highest Rated">Highest Rated ⭐</option>
            <option value="Lowest Price">Price: Low to High</option>
            <option value="Highest Price">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Category Chips Scroll */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
        <span className="text-[10px] font-bold text-slate-455 uppercase tracking-widest mr-2">
          Category:
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((chip) => {
            const isSelected = selectedCategory === chip;
            return (
              <button
                key={chip}
                onClick={() => {
                  setSelectedCategory(chip);
                  setCurrentPage(1);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-2xs ${
                  isSelected
                    ? "bg-brand-primary text-white border border-transparent shadow-md shadow-blue-500/15"
                    : "bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
