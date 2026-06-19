"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Plus,
  Loader2,
  AlertCircle,
  ArrowUpDown,
  Phone,
  Globe,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { getCurrentUser, supabase } from "@/lib/supabase";

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  views_count: number;
  likes_count: number;
  reviews_count: number;
  rating_average: number;
  created_at: string;
  service_analytics?: {
    portfolio_views: number;
    total_views?: number;
    total_contacts: number;
  } | null;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Sorting state for table
  const [sortField, setSortField] = useState<keyof ServiceItem>("views_count");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as {
          user: { id: string } | null;
        };
        if (!user) {
          router.push("/login");
          return;
        }

        if (!supabase) {
          throw new Error(
            "Supabase service is not configured on your environment",
          );
        }

        const { data, error: servicesError } = await supabase
          .from("services")
          .select(
            "id, title, category, views_count, likes_count, reviews_count, rating_average, created_at, service_analytics(total_views, portfolio_views, total_contacts)",
          )
          .eq("user_id", user.id);

        if (servicesError) throw servicesError;

        const formatted = ((data as Record<string, unknown>[]) || []).map(
          (s) => {
            let analytics = null;
            if (s.service_analytics) {
              analytics = Array.isArray(s.service_analytics)
                ? s.service_analytics[0]
                : s.service_analytics;
            }
            return {
              ...s,
              service_analytics: analytics,
            };
          },
        );
        setServices(formatted as ServiceItem[]);
      } catch (err: unknown) {
        console.error("Error loading analytics:", err);
        setError("Failed to load your services analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [router]);

  const handleSort = (field: keyof ServiceItem) => {
    const direction =
      sortField === field && sortDirection === "desc" ? "asc" : "desc";
    setSortField(field);
    setSortDirection(direction);
  };

  const sortedServices = [...services].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === "created_at") {
      return sortDirection === "desc"
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDirection === "desc"
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal);
    }

    const numA = (aVal as number) || 0;
    const numB = (bVal as number) || 0;
    return sortDirection === "desc" ? numB - numA : numA - numB;
  });

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">
            Aggregating service performance...
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-slate-800">
            Analytics Load Error
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  if (services.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-10 px-4">
        <div
          className="text-center bg-white border border-slate-200 rounded-3xl shadow-sm flex flex-col items-center gap-6 p-10"
          style={{ width: "clamp(340px, 50vw, 480px)" }}
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100/40 shadow-inner shrink-0">
            <BarChart3 className="h-7 w-7" />
          </div>

          <div className="space-y-2 w-full">
            <h2 className="text-xl font-extrabold text-slate-800 whitespace-nowrap">
              No Services Found
            </h2>
            <p className="text-sm text-slate-500 leading-6 font-medium">
              Create your first service to start receiving views, likes, and
              ratings. Performance charts will generate automatically.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/create-service")}
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold rounded-2xl shadow-md shadow-blue-500/10 transition active:scale-95 cursor-pointer w-full"
          >
            <Plus className="h-4 w-4" />
            <span>Create Service</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Stats summary ──────────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalServices = services.length;
  const totalViews = services.reduce((sum, s) => sum + (s.views_count || 0), 0);
  const totalLikes = services.reduce((sum, s) => sum + (s.likes_count || 0), 0);
  const totalReviews = services.reduce(
    (sum, s) => sum + (s.reviews_count || 0),
    0,
  );
  const totalPortfolioViews = services.reduce(
    (sum, s) =>
      sum +
      (s.service_analytics?.total_views ||
        s.service_analytics?.portfolio_views ||
        0),
    0,
  );
  const totalContacts = services.reduce(
    (sum, s) => sum + (s.service_analytics?.total_contacts || 0),
    0,
  );

  const ratedServices = services.filter((s) => (s.reviews_count || 0) > 0);
  const averageRating =
    ratedServices.length > 0
      ? parseFloat(
          (
            ratedServices.reduce((sum, s) => sum + (s.rating_average || 0), 0) /
            ratedServices.length
          ).toFixed(1),
        )
      : 0.0;

  // ── Chart data ─────────────────────────────────────────────────────────────
  const PIE_COLORS = ["#16a34a", "#2563eb", "#f59e0b", "#f97316", "#94a3b8"];

  const chartMaxValue = Math.max(
    5,
    ...services.flatMap((s) => [
      s.views_count || 0,
      s.likes_count || 0,
      s.reviews_count || 0,
    ]),
  );
  const yAxisMax = Math.max(5, Math.ceil(chartMaxValue * 1.2));
  const chartMargin = { top: 18, right: 18, left: 0, bottom: 8 };

  const barChartData = services.map((s) => ({
    name: s.title.length > 15 ? s.title.substring(0, 15) + "…" : s.title,
    fullName: s.title,
    Views: s.views_count || 0,
    Likes: s.likes_count || 0,
    Reviews: s.reviews_count || 0,
  }));

  const ratingDistribution = [
    {
      name: "5 Stars",
      value: services.filter((s) => Math.round(s.rating_average) === 5).length,
    },
    {
      name: "4 Stars",
      value: services.filter((s) => Math.round(s.rating_average) === 4).length,
    },
    {
      name: "3 Stars",
      value: services.filter((s) => Math.round(s.rating_average) === 3).length,
    },
    {
      name: "Under 3",
      value: services.filter(
        (s) => s.rating_average > 0 && Math.round(s.rating_average) < 3,
      ).length,
    },
    {
      name: "Unrated",
      value: services.filter((s) => (s.rating_average || 0) === 0).length,
    },
  ].filter((item) => item.value > 0);

  // SVG gradient ids
  const GRAD_VIEWS = "gradViews";
  const GRAD_LIKES = "gradLikes";
  const GRAD_REVIEWS = "gradReviews";

  const commonAxisProps = {
    stroke: "#64748b",
    fontSize: 11,
    fontWeight: "bold" as const,
    tickLine: false,
    axisLine: { stroke: "#cbd5e1" },
  };

  const tooltipStyle = {
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
    fontSize: "12px",
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track metrics and audience growth across your listed tutoring and
            teaching services.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/20">
              <Eye className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                App Views
              </span>
              <span className="text-lg font-black text-slate-850">
                {totalViews}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/20">
              <Globe className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Portfolio Views
              </span>
              <span className="text-lg font-black text-slate-850">
                {totalPortfolioViews}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/20">
              <Heart className="h-4.5 w-4.5 fill-red-500/10" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Likes
              </span>
              <span className="text-lg font-black text-slate-850">
                {totalLikes}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/20">
              <MessageSquare className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Reviews
              </span>
              <span className="text-lg font-black text-slate-850">
                {totalReviews}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/20">
              <Star className="h-4.5 w-4.5 fill-amber-55/10" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Avg Rating
              </span>
              <span className="text-lg font-black text-slate-850">
                {averageRating || "0.0"}
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/20">
              <Phone className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                Contacts
              </span>
              <span className="text-lg font-black text-slate-850">
                {totalContacts}
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {mounted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Views by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Views by Service
                </h3>
                <p className="text-[10px] text-slate-400">
                  Number of Customer hits per service listing.
                </p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={chartMargin}>
                    <defs>
                      <linearGradient
                        id={GRAD_VIEWS}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#2563eb"
                          stopOpacity={0.85}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis dataKey="name" {...commonAxisProps} />
                    <YAxis
                      {...commonAxisProps}
                      allowDecimals={false}
                      domain={[0, yAxisMax]}
                      tickCount={6}
                    />
                    <Tooltip
                      cursor={{ fill: "#eff6ff" }}
                      contentStyle={tooltipStyle}
                    />
                    <Bar
                      dataKey="Views"
                      fill={`url(#${GRAD_VIEWS})`}
                      radius={[8, 8, 0, 0]}
                      barSize={34}
                      minPointSize={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Likes by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Likes by Service
                </h3>
                <p className="text-[10px] text-slate-400">
                  Total saves/likes given by Customers.
                </p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={chartMargin}>
                    <defs>
                      <linearGradient
                        id={GRAD_LIKES}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#ec4899" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#db2777"
                          stopOpacity={0.85}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis dataKey="name" {...commonAxisProps} />
                    <YAxis
                      {...commonAxisProps}
                      allowDecimals={false}
                      domain={[0, yAxisMax]}
                      tickCount={6}
                    />
                    <Tooltip
                      cursor={{ fill: "#fdf2f8" }}
                      contentStyle={tooltipStyle}
                    />
                    <Bar
                      dataKey="Likes"
                      fill={`url(#${GRAD_LIKES})`}
                      radius={[8, 8, 0, 0]}
                      barSize={34}
                      minPointSize={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Rating Distribution */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Rating Distribution
                </h3>
                <p className="text-[10px] text-slate-400">
                  Proportional rating score splits.
                </p>
              </div>
              <div className="h-64 sm:h-72 flex items-center justify-center">
                {ratingDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="45%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {ratingDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconSize={10}
                        iconType="circle"
                        wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-slate-400 italic">
                    No ratings yet to group.
                  </span>
                )}
              </div>
            </div>

            {/* Chart 4: Reviews by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">
                  Reviews by Service
                </h3>
                <p className="text-[10px] text-slate-400">
                  Review counts written by Customers.
                </p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={chartMargin}>
                    <defs>
                      <linearGradient
                        id={GRAD_REVIEWS}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop
                          offset="100%"
                          stopColor="#059669"
                          stopOpacity={0.85}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke="#e2e8f0"
                    />
                    <XAxis dataKey="name" {...commonAxisProps} />
                    <YAxis
                      {...commonAxisProps}
                      allowDecimals={false}
                      domain={[0, yAxisMax]}
                      tickCount={6}
                    />
                    <Tooltip
                      cursor={{ fill: "#ecfdf5" }}
                      contentStyle={tooltipStyle}
                    />
                    <Bar
                      dataKey="Reviews"
                      fill={`url(#${GRAD_REVIEWS})`}
                      radius={[8, 8, 0, 0]}
                      barSize={34}
                      minPointSize={4}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Performance Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-extrabold text-slate-800">
              Performance Breakdown
            </h3>
            <p className="text-[10px] text-slate-400">
              Raw statistical logs for each service.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 border-b border-slate-200/60 text-[10px] uppercase text-slate-400 tracking-wider">
                <tr>
                  <th
                    className="px-6 py-3.5 select-none cursor-pointer hover:text-slate-600 transition"
                    onClick={() => handleSort("title")}
                  >
                    <span className="flex items-center gap-1">
                      Title <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3.5 select-none cursor-pointer hover:text-slate-600 transition"
                    onClick={() => handleSort("category")}
                  >
                    <span className="flex items-center gap-1">
                      Category <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition"
                    onClick={() => handleSort("views_count")}
                  >
                    <span className="flex items-center justify-center gap-1">
                      App Views <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Portfolio Views
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Likes
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Reviews
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Contacts
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Rating
                    </span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none">
                    <span className="flex items-center justify-center gap-1">
                      Created Date
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedServices.map((service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {service.title}
                    </td>
                    <td className="px-6 py-4">{service.category}</td>
                    <td className="px-6 py-4 text-center">
                      {service.views_count || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {service.service_analytics?.total_views ||
                        service.service_analytics?.portfolio_views ||
                        0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {service.likes_count || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {service.reviews_count || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {service.service_analytics?.total_contacts || 0}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold bg-amber-50/50 border border-amber-100/20 px-2 py-0.5 rounded-lg">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {service.rating_average || "0.0"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400">
                      {new Date(service.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
