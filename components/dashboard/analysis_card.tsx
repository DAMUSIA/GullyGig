"use client";

import React from "react";
import { Eye, Heart, Star, MessageSquare, Phone, Globe } from "lucide-react";
import { StatusCard } from "./status_card";

interface AnalyticsCardProps {
  totalServices: number;
  totalViews: number;
  totalLikes: number;
  averageRating: number;
  totalReviews: number;
  totalPortfolioViews?: number;
  totalContacts?: number;
}

export function AnalyticsCard({
  totalViews,
  totalLikes,
  averageRating,
  totalReviews,
  totalPortfolioViews = 0,
  totalContacts = 0,
}: AnalyticsCardProps) {
  const stats = [
    {
      icon: Eye,
      label: "App Views",
      value: totalViews,
      color: "purple" as const,
    },
    {
      icon: Globe,
      label: "Portfolio Views",
      value: totalPortfolioViews,
      color: "blue" as const,
    },
    {
      icon: Heart,
      label: "Likes",
      value: totalLikes,
      color: "red" as const,
    },
    {
      icon: MessageSquare,
      label: "Reviews",
      value: totalReviews,
      color: "green" as const,
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: averageRating > 0 ? `${averageRating.toFixed(1)}` : "0.0",
      color: "amber" as const,
    },
    {
      icon: Phone,
      label: "Contacts",
      value: totalContacts,
      color: "purple" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <StatusCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
