"use client";

import React from "react";
import { X, Home, Calendar, Globe, MapPin, TrendingUp } from "lucide-react";

interface ServiceItem {
  id: string;
  user_id: string;
  title: string;
  category: string;
  description: string;
  city: string;
  area: string | null;
  latitude: number | null;
  longitude: number | null;
  service_modes: string[];
  availability: string[];
  languages: string[];
  starting_price: number | null;
  price_unit: string | null;
  views_count: number;
  likes_count: number;
  reviews_count: number;
  rating_average: number;
  is_active: boolean;
  created_at: string;
}

interface ViewServiceModalProps {
  service: ServiceItem;
  onClose: () => void;
}

export function ViewServiceModal({ service, onClose }: ViewServiceModalProps) {
  const detailItems = [
    {
      icon: Home,
      label: "Modes",
      value: service.service_modes.join(", ") || "Not specified",
    },
    {
      icon: Calendar,
      label: "Availability",
      value: service.availability.join(", ") || "Flexible",
    },
    {
      icon: Globe,
      label: "Languages",
      value: service.languages.join(", ") || "English",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm cursor-pointer"
      />

      <div className="relative w-full max-w-[640px] bg-white rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase border border-blue-100/30">
              {service.category}
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 leading-tight mt-1.5 break-words">
              {service.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Description
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100 whitespace-pre-line">
              {service.description}
            </p>
          </div>

          <div className="bg-slate-50/70 rounded-xl p-4 space-y-3 border border-slate-100">
            <h4 className="font-extrabold text-slate-700 text-sm border-b border-slate-200/50 pb-2">
              Details
            </h4>

            {detailItems.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm"
              >
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <item.icon className="h-3.5 w-3.5 text-blue-500" />
                  {item.label}
                </span>
                <span className="font-semibold text-slate-600">
                  {item.value}
                </span>
              </div>
            ))}

            {service.area && service.city && (
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  Location
                </span>
                <span className="font-semibold text-slate-600">
                  {service.area}, {service.city}
                </span>
              </div>
            )}

            {service.starting_price && (
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-1 sm:gap-3 text-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-blue-500" />
                  Pricing
                </span>
                <span className="font-bold text-blue-600">
                  ₹{service.starting_price} /{" "}
                  {service.price_unit?.toLowerCase()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
