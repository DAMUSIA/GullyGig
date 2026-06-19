"use client";

import React from "react";
import { Briefcase, Eye, Heart, Star } from "lucide-react";
import { StatusCard } from "./status_card";

interface AnalyticsCardProps {
  totalServices: number;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  totalReviews: number;
}

export function AnalyticsCard({
  totalServices,
  totalViews,
  totalLikes,
  averageRating,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  totalReviews,
}: AnalyticsCardProps) {
  const stats = [
    {
      icon: Briefcase,
      label: "Total Services",
      value: totalServices,
      color: "blue" as const,
    },
    {
      icon: Eye,
      label: "Total Views",
      value: totalViews,
      color: "purple" as const,
    },
    {
      icon: Heart,
      label: "Total Likes",
      value: totalLikes,
      color: "red" as const,
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: averageRating > 0 ? `${averageRating}` : "0.0",
      color: "amber" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatusCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
