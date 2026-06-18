"use client";

import React from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PosterTemplate from "./PosterTemplate";
import PosterDownload from "./PosterDownload";

interface PosterPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    id: string;
    title: string;
    category: string;
    description: string;
    starting_price: number | null;
    price_unit: string | null;
    city: string;
    area: string | null;
    contact_numbers?: string[];
  };
  portfolioUrl: string;
}

export default function PosterPreview({
  isOpen,
  onClose,
  service,
  portfolioUrl,
}: PosterPreviewProps) {
  if (!isOpen) return null;

  const locationStr = [service.area, service.city].filter(Boolean).join(", ");
  const contacts = service.contact_numbers || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="relative w-full max-w-[480px] bg-white rounded-3xl p-5 sm:p-6 shadow-2xl z-10 flex flex-col gap-5 max-h-[95vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Poster Generator</h3>
              <p className="text-xs text-slate-500 mt-0.5">Preview and download your service ad poster</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0 cursor-pointer transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scaled Poster Visual Template Preview */}
          <div className="overflow-hidden py-2">
            <PosterTemplate
              title={service.title}
              category={service.category}
              description={service.description}
              startingPrice={service.starting_price}
              priceUnit={service.price_unit}
              location={locationStr}
              contactNumbers={contacts}
              portfolioUrl={portfolioUrl}
            />
          </div>

          {/* Download trigger */}
          <div className="pt-2 border-t border-slate-100">
            <PosterDownload
              title={service.title}
              category={service.category}
              description={service.description}
              startingPrice={service.starting_price}
              priceUnit={service.price_unit}
              location={locationStr}
              contactNumbers={contacts}
              portfolioUrl={portfolioUrl}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
