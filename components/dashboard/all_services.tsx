"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Briefcase,
  Edit,
  BarChart3,
  ExternalLink,
} from "lucide-react";

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

interface AllServicesProps {
  services: ServiceItem[];
  onEdit: (service: ServiceItem) => void;
  onView: (service: ServiceItem) => void;
  onAddService: () => void;
}

function ServiceCard({
  service,
  onEdit,
  onView,
  onStats,
}: {
  service: ServiceItem;
  onEdit: (service: ServiceItem) => void;
  onView: (service: ServiceItem) => void;
  onStats: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-blue-100/30">
            {service.category}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${
              service.is_active
                ? "bg-green-50 text-green-600 border border-green-100/35"
                : "bg-slate-100 text-slate-400 border border-slate-200/50"
            }`}
          >
            {service.is_active ? "Active" : "Inactive"}
          </span>
        </div>

        <h3 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {service.title}
        </h3>

        <p className="text-xs text-slate-500 font-medium line-clamp-3">
          {service.description}
        </p>

        {service.starting_price && (
          <div className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
            <span>₹{service.starting_price}</span>
            <span className="text-slate-400 font-normal">
              / {service.price_unit?.toLowerCase()}
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 border-t border-slate-50 pt-3">
          <span className="flex items-center gap-1 text-amber-500">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{service.rating_average || "0.0"}</span>
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{service.views_count || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5" />
            <span>{service.likes_count || 0}</span>
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{service.reviews_count || 0}</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 mt-3">
        <button
          onClick={() => onEdit(service)}
          className="flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
        >
          <Edit className="h-3 w-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={onStats}
          className="flex items-center justify-center gap-1.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
        >
          <BarChart3 className="h-3 w-3" />
          <span>Stats</span>
        </button>
        <button
          onClick={() => onView(service)}
          className="flex items-center justify-center gap-1.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold rounded-xl transition cursor-pointer active:scale-95"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({ onAddService }: { onAddService: () => void }) {
  return (
    <div className="text-center py-16 bg-white border-2 border-dashed border-slate-200 rounded-3xl">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Briefcase className="h-10 w-10 text-blue-400" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">No Services Yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w mx-auto">
        You haven&apos;t listed any teaching services yet. Start by creating
        your first service.
      </p>
      <button
        onClick={onAddService}
        className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition cursor-pointer active:scale-95"
      >
        <Plus className="h-4 w-4" />
        Create Your First Service
      </button>
    </div>
  );
}

export function AllServices({
  services,
  onEdit,
  onView,
  onAddService,
}: AllServicesProps) {
  const router = useRouter();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-extrabold text-slate-800">My Services</h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {services.length}
          </span>
        </div>
        <button
          onClick={() => router.push("/dashboard/analytics")}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer transition-colors"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Analytics
        </button>
      </div>

      {services.length === 0 ? (
        <EmptyState onAddService={onAddService} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={onEdit}
              onView={onView}
              onStats={() => router.push("/dashboard/analytics")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
