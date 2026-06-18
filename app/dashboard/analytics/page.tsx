"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart3, 
  Eye, 
  Heart, 
  Star, 
  MessageSquare, 
  Briefcase, 
  Plus, 
  Loader2, 
  AlertCircle,
  ArrowUpDown
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
  Cell 
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
        const { user } = (await getCurrentUser()) as { user: { id: string } | null };
        if (!user) {
          router.push("/login");
          return;
        }

        if (!supabase) {
          throw new Error("Supabase service is not configured on your environment");
        }

        // Fetch user's services
        const { data, error: servicesError } = await supabase
          .from("services")
          .select("id, title, category, views_count, likes_count, reviews_count, rating_average, created_at")
          .eq("user_id", user.id);

        if (servicesError) throw servicesError;
        setServices((data as ServiceItem[]) || []);
      } catch (err: unknown) {
        console.error("Error loading analytics:", err);
        setError("Failed to load your services analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [router]);

  // Sorting function
  const handleSort = (field: keyof ServiceItem) => {
    const direction = sortField === field && sortDirection === "desc" ? "asc" : "desc";
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

    // Number comparison
    const numA = (aVal as number) || 0;
    const numB = (bVal as number) || 0;
    return sortDirection === "desc" ? numB - numA : numA - numB;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Aggregating service performance...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-xl max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-extrabold text-slate-800">Analytics Load Error</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{error}</p>
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

  // 1. Empty State Check
  if (services.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-slate-50/20">
        <div className="text-center bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm max-w-md w-full flex flex-col items-center gap-5">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100/40 shadow-inner">
            <BarChart3 className="h-7 w-7" />
          </div>
          
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-800">No Services Found</h2>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              Create your first service to start receiving views, likes, and ratings. Performance charts will generate automatically.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard/create-service")}
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-2xl shadow-md shadow-blue-500/10 transition active:scale-98 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create Service</span>
          </button>
        </div>
      </div>
    );
  }

  // Calculate stats summaries
  const totalServices = services.length;
  const totalViews = services.reduce((sum, s) => sum + (s.views_count || 0), 0);
  const totalLikes = services.reduce((sum, s) => sum + (s.likes_count || 0), 0);
  const totalReviews = services.reduce((sum, s) => sum + (s.reviews_count || 0), 0);
  
  const ratedServices = services.filter((s) => (s.reviews_count || 0) > 0);
  const averageRating = ratedServices.length > 0
    ? parseFloat((ratedServices.reduce((sum, s) => sum + (s.rating_average || 0), 0) / ratedServices.length).toFixed(1))
    : 0.0;

  // Chart Colors
  const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];

  // Chart data: Views, Likes, Reviews, Ratings
  const barChartData = services.map((s) => ({
    name: s.title.length > 15 ? s.title.substring(0, 15) + "..." : s.title,
    Views: s.views_count || 0,
    Likes: s.likes_count || 0,
    Reviews: s.reviews_count || 0,
  }));

  // Pie chart calculation: Rating distribution grouping
  const ratingDistribution = [
    { name: "5 Stars", value: services.filter(s => Math.round(s.rating_average) === 5).length },
    { name: "4 Stars", value: services.filter(s => Math.round(s.rating_average) === 4).length },
    { name: "3 Stars", value: services.filter(s => Math.round(s.rating_average) === 3).length },
    { name: "Under 3 Stars", value: services.filter(s => s.rating_average > 0 && Math.round(s.rating_average) < 3).length },
    { name: "Unrated", value: services.filter(s => (s.rating_average || 0) === 0).length },
  ].filter(item => item.value > 0); // Only show segments with > 0 values

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track metrics and audience growth across your listed tutoring and teaching services.
          </p>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {/* Card 1: Services */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Services</span>
              <span className="text-xl font-extrabold text-slate-800">{totalServices}</span>
            </div>
          </div>

          {/* Card 2: Views */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100/20">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Views</span>
              <span className="text-xl font-extrabold text-slate-800">{totalViews}</span>
            </div>
          </div>

          {/* Card 3: Likes */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0 border border-red-100/20">
              <Heart className="h-5 w-5 fill-red-500/10" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Likes</span>
              <span className="text-xl font-extrabold text-slate-800">{totalLikes}</span>
            </div>
          </div>

          {/* Card 4: Rating */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0 border border-amber-100/20">
              <Star className="h-5 w-5 fill-amber-500/10" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Rating</span>
              <span className="text-xl font-extrabold text-slate-800">{averageRating || "0.0"} <span className="text-xs font-semibold text-slate-400">/ 5</span></span>
            </div>
          </div>

          {/* Card 5: Reviews */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reviews</span>
              <span className="text-xl font-extrabold text-slate-800">{totalReviews}</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        {mounted && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Views by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Views by Service</h3>
                <p className="text-[10px] text-slate-400">Number of student hits per service listing.</p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="Views" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Likes by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Likes by Service</h3>
                <p className="text-[10px] text-slate-400">Total saves/likes given by students.</p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="Likes" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Rating Distribution */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Rating Distribution</h3>
                <p className="text-[10px] text-slate-400">Proportional rating score splits.</p>
              </div>
              <div className="h-64 sm:h-72 flex items-center justify-center">
                {ratingDistribution.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingDistribution}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ratingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36} iconSize={10} iconType="circle" wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="text-xs text-slate-400 italic">No ratings yet to group.</span>
                )}
              </div>
            </div>

            {/* Chart 4: Reviews by Service */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800">Reviews by Service</h3>
                <p className="text-[10px] text-slate-400">Review counts written by students.</p>
              </div>
              <div className="h-64 sm:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" tickLine={false} />
                    <Tooltip cursor={{ fill: "#f8fafc" }} contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                    <Bar dataKey="Reviews" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* Analytics Table */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="text-sm font-extrabold text-slate-800">Performance Breakdown</h3>
            <p className="text-[10px] text-slate-400">Raw statistical logs for each service.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead className="bg-slate-50 border-b border-slate-200/60 text-[10px] uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-3.5 select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("title")}>
                    <span className="flex items-center gap-1">Title <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("category")}>
                    <span className="flex items-center gap-1">Category <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("views_count")}>
                    <span className="flex items-center justify-center gap-1">Views <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("likes_count")}>
                    <span className="flex items-center justify-center gap-1">Likes <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("reviews_count")}>
                    <span className="flex items-center justify-center gap-1">Reviews <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("rating_average")}>
                    <span className="flex items-center justify-center gap-1">Rating <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                  <th className="px-6 py-3.5 text-center select-none cursor-pointer hover:text-slate-600 transition" onClick={() => handleSort("created_at")}>
                    <span className="flex items-center justify-center gap-1">Created Date <ArrowUpDown className="h-3 w-3" /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {sortedServices.map((service) => (
                  <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800">{service.title}</td>
                    <td className="px-6 py-4">{service.category}</td>
                    <td className="px-6 py-4 text-center">{service.views_count || 0}</td>
                    <td className="px-6 py-4 text-center">{service.likes_count || 0}</td>
                    <td className="px-6 py-4 text-center">{service.reviews_count || 0}</td>
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
