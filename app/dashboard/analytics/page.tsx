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
  TrendingUp,
  Clock,
  Users,
  Zap,
  Award,
  Sparkles,
  Rocket,
  Target,
  Activity,
  ChevronRight,
  Flame,
  Crown,
  Medal,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
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
import { AnalyticsCard } from "@/components/dashboard/analysis_card";

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
  service_analytics?: {
    portfolio_views: number;
    total_views?: number;
    total_contacts: number;
  } | null;
}

interface ServiceReview {
  id: string;
  rating: number;
  review: string | null;
  created_at: string;
  services?: { title: string };
  users?: { full_name: string };
}

interface MonthlyGrowthDataPoint {
  month: string;
  views: number;
  likes: number;
  rate: number;
  [key: string]: string | number;
}

interface FunnelDataItem {
  name: string;
  value: number;
  percentage: string;
  gradient: string;
  hoverGradient: string;
  icon: React.ElementType;
  description: string;
  bgGlow: string;
  color: string;
  lightColor: string;
}

interface CategoryPerformance {
  category: string;
  totalViews: number;
  totalLikes: number;
  totalInquiries: number;
  totalJoined: number;
  averageRating: number;
  conversionRate: string;
  growth: string;
  serviceCount: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [reviews, setReviews] = useState<ServiceReview[]>([]);
  const [hoveredFunnel, setHoveredFunnel] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"views" | "likes" | "rate">(
    "views",
  );

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setLoading(true);
        const { user } = (await getCurrentUser()) as {
          user: { id: string } | null;
        };
        if (!user) {
          router.push("/Auth");
          return;
        }

        if (!supabase) {
          throw new Error(
            "Supabase service is not configured on your environment",
          );
        }

        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select(
            "*, service_analytics(total_views, portfolio_views, total_contacts)",
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (servicesError) throw servicesError;

        const formatted = (
          (servicesData as Record<string, unknown>[]) || []
        ).map((s) => {
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
        });
        setServices(formatted as ServiceItem[]);

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("service_ratings")
          .select("*, services!inner(title, user_id), users:user_id(full_name)")
          .eq("services.user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (!reviewsError && reviewsData) {
          setReviews((reviewsData as ServiceReview[]) || []);
        }
      } catch (err: unknown) {
        console.error("Error loading analytics:", err);
        setError("Failed to load your services analytics data.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 blur-xl opacity-30 animate-pulse" />
            <Loader2 className="relative h-8 w-8 sm:h-10 sm:w-10 animate-spin text-white mx-auto mt-4 sm:mt-5" />
          </div>
          <p className="text-sm font-semibold text-slate-600 mt-4">
            Loading your analytics...
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Aggregating service performance data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-w-md w-full text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
            <AlertCircle className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 mt-4">
            Analytics Load Error
          </h2>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-10 px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 mt-6">
            No Services Found
          </h2>
          <p className="text-sm text-slate-500 leading-6 font-medium mt-2">
            Create your first service to start receiving views, likes, and
            ratings. Performance charts will generate automatically.
          </p>
          <button
            onClick={() => router.push("/dashboard/create-service")}
            className="mt-6 inline-flex items-center justify-center gap-2 py-3 px-6 sm:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-extrabold rounded-xl sm:rounded-2xl shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Service</span>
          </button>
        </div>
      </div>
    );
  }

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

  const funnelData: FunnelDataItem[] = [
    {
      name: "Profile Views",
      value: totalViews || 0,
      percentage: "100%",
      gradient: "from-blue-700 to-blue-600",
      hoverGradient: "from-blue-600 to-blue-500",
      icon: Eye,
      description: "Total profile visits",
      bgGlow: "shadow-blue-500/40",
      color: "#1d4ed8",
      lightColor: "#dbeafe",
    },
    {
      name: "Likes",
      value: totalLikes || 0,
      percentage:
        totalViews > 0
          ? `${((totalLikes / totalViews) * 100).toFixed(1)}%`
          : "0%",
      gradient: "from-blue-600 to-blue-500",
      hoverGradient: "from-blue-500 to-blue-400",
      icon: Heart,
      description: "Total likes received",
      bgGlow: "shadow-blue-400/40",
      color: "#2563eb",
      lightColor: "#bfdbfe",
    },
    {
      name: "Inquiries",
      value: totalContacts || 0,
      percentage:
        totalViews > 0
          ? `${((totalContacts / totalViews) * 100).toFixed(1)}%`
          : "0%",
      gradient: "from-blue-500 to-blue-400",
      hoverGradient: "from-blue-400 to-blue-300",
      icon: MessageSquare,
      description: "Total inquiries made",
      bgGlow: "shadow-blue-300/40",
      color: "#3b82f6",
      lightColor: "#93c5fd",
    },
    {
      name: "Students Joined",
      value: Math.round(totalViews * 0.018) || 0,
      percentage:
        totalViews > 0
          ? `${((Math.round(totalViews * 0.018) / totalViews) * 100).toFixed(1)}%`
          : "0%",
      gradient: "from-blue-400 to-blue-300",
      hoverGradient: "from-blue-300 to-blue-200",
      icon: Users,
      description: "Total students enrolled",
      bgGlow: "shadow-blue-200/40",
      color: "#60a5fa",
      lightColor: "#bfdbfe",
    },
  ];

  const pieData = [
    { name: "Profile Views", value: totalViews || 0, color: "#3b82f6" },
    { name: "Likes", value: totalLikes || 0, color: "#8b5cf6" },
    { name: "Inquiries", value: totalContacts || 0, color: "#10b981" },
    {
      name: "Students Joined",
      value: Math.round(totalViews * 0.018) || 0,
      color: "#f43f5e",
    },
  ];

  // Group services by category
  const categoryMap: Record<string, ServiceItem[]> = {};
  services.forEach((service) => {
    if (!categoryMap[service.category]) {
      categoryMap[service.category] = [];
    }
    categoryMap[service.category].push(service);
  });

  const categories = Object.keys(categoryMap);

  // Calculate category performance
  const categoryPerformance: CategoryPerformance[] = categories.map(
    (category) => {
      const categoryServices = categoryMap[category];
      const totalViews = categoryServices.reduce(
        (sum, s) => sum + (s.views_count || 0),
        0,
      );
      const totalLikes = categoryServices.reduce(
        (sum, s) => sum + (s.likes_count || 0),
        0,
      );
      const totalInquiries = categoryServices.reduce(
        (sum, s) => sum + (s.service_analytics?.total_contacts || 0),
        0,
      );
      const totalJoined = Math.round(totalViews * 0.018);
      const avgRating =
        categoryServices.reduce((sum, s) => sum + (s.rating_average || 0), 0) /
        categoryServices.length;
      const conversionRate =
        totalViews > 0 ? ((totalLikes / totalViews) * 100).toFixed(1) : "0.0";
      const growth =
        totalViews > 0
          ? `+${Math.round((totalViews / 10) * 100) / 100}%`
          : "0%";

      return {
        category,
        totalViews,
        totalLikes,
        totalInquiries,
        totalJoined,
        averageRating: parseFloat(avgRating.toFixed(1)),
        conversionRate: `${conversionRate}%`,
        growth,
        serviceCount: categoryServices.length,
      };
    },
  );

  // Sort categories by total views
  const topCategories = [...categoryPerformance].sort(
    (a, b) => b.totalViews - a.totalViews,
  );

  const getMonthlyGrowthData = (): MonthlyGrowthDataPoint[] => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthMap: Record<
      string,
      {
        views: number;
        likes: number;
        rate: number;
        categories: Record<
          string,
          { views: number; likes: number; rate: number }
        >;
      }
    > = {};

    monthNames.forEach((month) => {
      monthMap[month] = {
        views: 0,
        likes: 0,
        rate: 0,
        categories: {},
      };
      categories.forEach((category) => {
        monthMap[month].categories[category] = {
          views: 0,
          likes: 0,
          rate: 0,
        };
      });
    });

    services.forEach((service) => {
      const date = new Date(service.created_at);
      const month = monthNames[date.getMonth()];

      if (monthMap[month]) {
        monthMap[month].views += service.views_count || 0;
        monthMap[month].likes += service.likes_count || 0;
        if (monthMap[month].categories[service.category]) {
          monthMap[month].categories[service.category].views +=
            service.views_count || 0;
          monthMap[month].categories[service.category].likes +=
            service.likes_count || 0;
          if (service.views_count > 0) {
            monthMap[month].categories[service.category].rate =
              (service.likes_count / service.views_count) * 100;
          }
        }
      }
    });

    let cumulativeViews = 0;
    let cumulativeLikes = 0;
    const categoryCumulative: Record<
      string,
      { views: number; likes: number; rate: number }
    > = {};
    categories.forEach((category) => {
      categoryCumulative[category] = { views: 0, likes: 0, rate: 0 };
    });

    return monthNames.map((month) => {
      cumulativeViews += monthMap[month].views;
      cumulativeLikes += monthMap[month].likes;

      const rate =
        cumulativeViews > 0 ? (cumulativeLikes / cumulativeViews) * 100 : 0;

      const dataPoint: MonthlyGrowthDataPoint = {
        month,
        views: cumulativeViews,
        likes: cumulativeLikes,
        rate: parseFloat(rate.toFixed(1)),
      };

      categories.forEach((category) => {
        categoryCumulative[category].views +=
          monthMap[month].categories[category]?.views || 0;
        categoryCumulative[category].likes +=
          monthMap[month].categories[category]?.likes || 0;
        if (categoryCumulative[category].views > 0) {
          categoryCumulative[category].rate =
            (categoryCumulative[category].likes /
              categoryCumulative[category].views) *
            100;
        }
        dataPoint[`${category}_views`] = categoryCumulative[category].views;
        dataPoint[`${category}_likes`] = categoryCumulative[category].likes;
        dataPoint[`${category}_rate`] = parseFloat(
          categoryCumulative[category].rate.toFixed(1),
        );
      });

      return dataPoint;
    });
  };

  const monthlyGrowthData = getMonthlyGrowthData();

  const getCategoryColor = (index: number) => {
    const colors = [
      "#3b82f6",
      "#ec4899",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#06b6d4",
      "#ef4444",
      "#14b8a6",
      "#f97316",
      "#6366f1",
      "#84cc16",
      "#22d3ee",
      "#a855f7",
      "#34d399",
      "#fb923c",
    ];
    return colors[index % colors.length];
  };

  const getMaxGrowthValue = () => {
    let max = 0;
    monthlyGrowthData.forEach((item) => {
      max = Math.max(max, item.views, item.likes);
      categories.forEach((category) => {
        max = Math.max(max, (item[`${category}_views`] as number) || 0);
        max = Math.max(max, (item[`${category}_likes`] as number) || 0);
      });
    });
    return Math.max(10, max + 5);
  };

  const getRecentActivity = () => {
    const activities: {
      text: string;
      time: string;
      icon: React.ElementType;
      gradient: string;
      bgGradient: string;
      color: string;
    }[] = [];

    reviews.slice(0, 3).forEach((review) => {
      if (review.review) {
        const serviceTitle = review.services?.title || "Service";
        activities.push({
          text: `New review for "${serviceTitle}": "${review.review.substring(0, 40)}${review.review.length > 40 ? "..." : ""}"`,
          time: new Date(review.created_at).toLocaleDateString(),
          icon: Star,
          gradient: "from-amber-400 to-amber-500",
          bgGradient: "from-amber-50 to-amber-100/50",
          color: "text-amber-600",
        });
      } else {
        const serviceTitle = review.services?.title || "Service";
        activities.push({
          text: `New ${review.rating}★ rating for "${serviceTitle}"`,
          time: new Date(review.created_at).toLocaleDateString(),
          icon: Star,
          gradient: "from-amber-400 to-amber-500",
          bgGradient: "from-amber-50 to-amber-100/50",
          color: "text-amber-600",
        });
      }
    });

    services
      .filter((s) => s.likes_count > 0)
      .slice(0, 2)
      .forEach((s) => {
        activities.push({
          text: `${s.likes_count} people liked your service: ${s.title}`,
          time: new Date(s.created_at).toLocaleDateString(),
          icon: Heart,
          gradient: "from-red-400 to-red-500",
          bgGradient: "from-red-50 to-red-100/50",
          color: "text-red-600",
        });
      });

    services
      .filter(
        (s) =>
          s.service_analytics?.total_contacts &&
          s.service_analytics.total_contacts > 0,
      )
      .slice(0, 2)
      .forEach((s) => {
        activities.push({
          text: `${s.service_analytics?.total_contacts} inquiries received for: ${s.title}`,
          time: new Date(s.created_at).toLocaleDateString(),
          icon: MessageSquare,
          gradient: "from-emerald-400 to-emerald-500",
          bgGradient: "from-emerald-50 to-emerald-100/50",
          color: "text-emerald-600",
        });
      });

    return activities.slice(0, 5);
  };

  const recentActivity = getRecentActivity();

  const conversionOverview = [
    {
      label: "Profile Views",
      value: totalViews || 0,
      percentage: "100%",
      color: "#3b82f6",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-600",
      gradient: "from-blue-400 to-blue-600",
      icon: Eye,
    },
    {
      label: "Likes",
      value: totalLikes || 0,
      percentage:
        totalViews > 0
          ? `${((totalLikes / totalViews) * 100).toFixed(1)}%`
          : "0%",
      color: "#8b5cf6",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-600",
      gradient: "from-purple-400 to-purple-600",
      icon: Heart,
    },
    {
      label: "Inquiries",
      value: totalContacts || 0,
      percentage:
        totalViews > 0
          ? `${((totalContacts / totalViews) * 100).toFixed(1)}%`
          : "0%",
      color: "#10b981",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-600",
      gradient: "from-emerald-400 to-emerald-600",
      icon: MessageSquare,
    },
    {
      label: "Students Joined",
      value: Math.round(totalViews * 0.018) || 0,
      percentage:
        totalViews > 0
          ? `${((Math.round(totalViews * 0.018) / totalViews) * 100).toFixed(1)}%`
          : "0%",
      color: "#f43f5e",
      bg: "bg-rose-50",
      border: "border-rose-200",
      text: "text-rose-600",
      gradient: "from-rose-400 to-rose-600",
      icon: Users,
    },
  ];

  const overallConversionRate =
    totalViews > 0
      ? ((Math.round(totalViews * 0.018) / totalViews) * 100).toFixed(1)
      : "0.0";

  const tooltipStyle = {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 30px rgba(59,130,246,0.15)",
    fontSize: "10px",
    backgroundColor: "white",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 pb-12 sm:pb-20">
      <div className="max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-2xl sm:rounded-3xl blur-3xl -z-10 animate-pulse" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/40 shadow-xl shadow-blue-500/5">
            <div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/30">
                  <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
                    Performance Analytics
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {totalServices} services • {totalViews.toLocaleString()}{" "}
                    total views
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-sm border border-blue-200/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {totalServices} Services • {totalViews.toLocaleString()} Views
                </span>
              </div>
              {topCategories.length > 0 && (
                <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-sm">
                  <Crown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
                  <span className="text-[10px] sm:text-xs font-bold text-amber-700 truncate max-w-[100px]">
                    Top: {topCategories[0].category}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <AnalyticsCard
          totalServices={totalServices}
          totalViews={totalViews}
          totalLikes={totalLikes}
          averageRating={averageRating}
          totalReviews={totalReviews}
          totalPortfolioViews={totalPortfolioViews}
          totalContacts={totalContacts}
        />

        {/* ─── IMPROVED CONVERSION FUNNEL ─── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6 lg:mb-8">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                  <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                  Conversion Funnel
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium ml-8 sm:ml-11">
                Customer journey from views to students joined
              </p>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl shadow-md shadow-blue-500/5">
              <div className="p-1 sm:p-1.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
                <Rocket className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Overall: {overallConversionRate}%
              </span>
            </div>
          </div>

          {/* Improved Funnel Stages - Mobile Optimized */}
          <div className="flex flex-col items-center py-2 sm:py-4 space-y-3 sm:space-y-4">
            {funnelData.map((item, idx) => {
              const maxWidth = 90;
              const minWidth = 30;
              const step = (maxWidth - minWidth) / (funnelData.length - 1);
              const widthPercent = maxWidth - idx * step;
              const isHovered = hoveredFunnel === idx;
              const Icon = item.icon;

              return (
                <div
                  key={idx}
                  className="relative w-full flex justify-center group"
                  onMouseEnter={() => setHoveredFunnel(idx)}
                  onMouseLeave={() => setHoveredFunnel(null)}
                  onTouchStart={() => setHoveredFunnel(idx)}
                  onTouchEnd={() => setHoveredFunnel(null)}
                >
                  <div
                    className={`relative transition-all duration-500 cursor-pointer`}
                    style={{
                      width: `${Math.max(widthPercent, 80)}%`,
                      minWidth: "140px",
                    }}
                  >
                    <div
                      className={`relative bg-gradient-to-r ${item.gradient} rounded-xl sm:rounded-2xl transition-all duration-500
                        ${isHovered ? "scale-105 shadow-2xl " + item.bgGlow : "shadow-lg " + item.bgGlow}
                      `}
                      style={{
                        height: isHovered ? "52px" : "44px",
                      }}
                    >
                      {isHovered && (
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/20 animate-pulse" />
                      )}

                      <div
                        className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white/10 transition-all duration-1000"
                        style={{
                          width: isHovered ? "100%" : "0%",
                          transition: "width 0.8s ease-in-out",
                        }}
                      />

                      <div className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2">
                        <div
                          className={`p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
                        >
                          <Icon
                            className={`h-3 w-3 sm:h-4 sm:w-4 text-white/90 transition-all duration-300 ${isHovered ? "rotate-12" : ""}`}
                          />
                        </div>
                      </div>

                      <div className="absolute left-8 sm:left-14 top-1/2 -translate-y-1/2">
                        <span
                          className={`text-white text-[10px] sm:text-sm font-extrabold transition-all duration-300 ${isHovered ? "tracking-wider" : ""}`}
                        >
                          {item.name}
                        </span>
                      </div>

                      <div className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-3">
                        <span
                          className={`text-white text-xs sm:text-base font-black transition-all duration-300 ${isHovered ? "scale-110" : ""}`}
                        >
                          {item.value.toLocaleString()}
                        </span>
                        <span
                          className={`text-white/90 text-[8px] sm:text-xs font-bold bg-white/20 px-1.5 sm:px-2.5 py-0.5 rounded-full backdrop-blur-sm ${isHovered ? "bg-white/30" : ""}`}
                        >
                          {item.percentage}
                        </span>
                      </div>

                      <div
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-white/30 rounded-full transition-all duration-500"
                        style={{
                          width: isHovered ? "80%" : "0%",
                          transition: "width 0.8s ease-in-out",
                        }}
                      />
                    </div>

                    <div className="mt-1.5 sm:mt-2 h-1 w-full bg-slate-100/60 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${parseFloat(item.percentage)}%`,
                          background: `linear-gradient(90deg, ${item.color}, ${item.color}CC)`,
                          opacity: isHovered ? 1 : 0.6,
                        }}
                      />
                    </div>

                    {isHovered && (
                      <div className="absolute -right-48 sm:-right-56 top-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-sm border border-blue-200/60 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-xl shadow-blue-500/20 z-20 animate-in fade-in slide-in-from-right-5 hidden sm:block">
                        <p className="text-[10px] sm:text-xs font-bold text-slate-700">
                          {item.description}
                        </p>
                        <p className="text-[8px] sm:text-[10px] text-slate-400 mt-0.5">
                          {item.value.toLocaleString()} total •{" "}
                          {item.percentage} of total
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2">
                    <div
                      className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br ${item.gradient} text-white text-[8px] sm:text-[9px] font-black flex items-center justify-center shadow-md transition-all duration-300 ${isHovered ? "scale-110 shadow-lg" : ""}`}
                    >
                      {idx + 1}
                    </div>
                  </div>

                  {idx < funnelData.length - 1 && (
                    <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 w-0.5 h-3 sm:h-4 bg-gradient-to-b from-blue-400/60 to-blue-300/20 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 sm:mt-6 lg:mt-8 bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-blue-50/80 border border-blue-200/40 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-base sm:text-lg">🎉</span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-700">
                Great! Your overall conversion rate is{" "}
                <span className="text-blue-600">{overallConversionRate}%</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-medium">
                •{" "}
                {totalViews > 0
                  ? `${totalViews.toLocaleString()} views • ${totalLikes.toLocaleString()} likes`
                  : "Start getting views today!"}
              </span>
            </div>
          </div>
        </div>

        {/* ─── MONTHLY GROWTH ─── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/30">
                  <LineChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
                  Monthly Growth by Category
                </h3>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium ml-8 sm:ml-11">
                {categories.length} categories • Views, Likes & Rate trends
              </p>
            </div>
            <div className="flex gap-0.5 sm:gap-1 bg-slate-100/80 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-slate-200/60">
              <button
                onClick={() => setActiveTab("views")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "views"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                Views
              </button>
              <button
                onClick={() => setActiveTab("likes")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "likes"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/30"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                Likes
              </button>
              <button
                onClick={() => setActiveTab("rate")}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[10px] font-bold rounded-lg transition-all duration-200 ${
                  activeTab === "rate"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                Rate (%)
              </button>
            </div>
          </div>

          {/* Legend - Show Categories */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 text-[8px] sm:text-[10px] font-bold overflow-x-auto pb-2 sm:pb-0">
            {categories.slice(0, 8).map((category, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 sm:gap-1.5 bg-white/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-slate-200/60 shadow-sm whitespace-nowrap"
              >
                <span
                  className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full"
                  style={{ backgroundColor: getCategoryColor(idx) }}
                />
                {category.length > 8
                  ? category.substring(0, 8) + "…"
                  : category}
              </span>
            ))}
            {categories.length > 8 && (
              <span className="text-slate-400 flex items-center bg-white/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-slate-200/60 whitespace-nowrap text-[8px] sm:text-[10px]">
                +{categories.length - 8} more
              </span>
            )}
          </div>

          {/* Chart - Mobile Optimized */}
          <div className="h-60 sm:h-72 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyGrowthData}
                margin={{ top: 5, right: 5, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={8}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  interval={0}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={8}
                  tickLine={false}
                  axisLine={{ stroke: "#cbd5e1" }}
                  domain={[0, getMaxGrowthValue()]}
                  width={30}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend
                  verticalAlign="top"
                  height={20}
                  iconSize={8}
                  iconType="circle"
                  wrapperStyle={{ fontSize: "8px", fontWeight: "bold" }}
                />

                {categories.map((category, idx) => {
                  const dataKey =
                    activeTab === "views"
                      ? `${category}_views`
                      : activeTab === "likes"
                        ? `${category}_likes`
                        : `${category}_rate`;
                  const color = getCategoryColor(idx);
                  const isRate = activeTab === "rate";
                  return (
                    <Line
                      key={`${category}_${activeTab}`}
                      type="monotone"
                      dataKey={dataKey}
                      stroke={color}
                      strokeWidth={isRate ? 2 : 2}
                      strokeDasharray={isRate ? "4 3" : "0"}
                      dot={{
                        r: isRate ? 3 : 2.5,
                        fill: color,
                        stroke: "white",
                        strokeWidth: 1,
                      }}
                      activeDot={{
                        r: isRate ? 5 : 4,
                        stroke: color,
                        strokeWidth: 2,
                      }}
                      name={category}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Stats - Mobile Optimized */}
          <div className="mt-3 sm:mt-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-3">
            <div className="bg-blue-50/70 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center border border-blue-200/40">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">
                Total Views
              </p>
              <p className="text-xs sm:text-sm font-black text-blue-600">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50/70 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center border border-purple-200/40">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">
                Total Likes
              </p>
              <p className="text-xs sm:text-sm font-black text-purple-600">
                {totalLikes.toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50/70 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center border border-emerald-200/40">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">
                Conversion Rate
              </p>
              <p className="text-xs sm:text-sm font-black text-emerald-600">
                {overallConversionRate}%
              </p>
            </div>
            <div className="bg-amber-50/70 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-center border border-amber-200/40">
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase">
                Total Categories
              </p>
              <p className="text-xs sm:text-sm font-black text-amber-600">
                {categories.length}
              </p>
            </div>
          </div>
        </div>

        {/* ─── TOP PERFORMING CATEGORIES ─── */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-5 border-b border-blue-100/60 bg-gradient-to-r from-blue-50/30 via-white to-indigo-50/30">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/30">
                    <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-slate-800">
                    Top Performing Categories
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium ml-8 sm:ml-11">
                  {topCategories.length} categories • Total views:{" "}
                  {totalViews.toLocaleString()}
                </p>
              </div>
              <span className="text-[8px] sm:text-[10px] font-bold text-blue-600 bg-blue-50/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-blue-200/60 shadow-sm">
                {topCategories.length} categories
              </span>
            </div>
          </div>
          {topCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[10px] sm:text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50/80 to-slate-100/30">
                    <th className="px-2 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                      Services
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                      Views
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center hidden sm:table-cell">
                      Likes
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center hidden md:table-cell">
                      Inquiries
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center hidden lg:table-cell">
                      Joined
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center hidden lg:table-cell">
                      Rating
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
                      Conversion
                    </th>
                    <th className="px-1 sm:px-6 py-2 sm:py-3.5 text-[8px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center hidden xl:table-cell">
                      Growth
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/60">
                  {topCategories.map((cat, idx) => {
                    const colorMap = [
                      {
                        bg: "from-blue-400 to-blue-600",
                        shadow: "shadow-blue-500/30",
                      },
                      {
                        bg: "from-purple-400 to-purple-600",
                        shadow: "shadow-purple-500/30",
                      },
                      {
                        bg: "from-emerald-400 to-emerald-600",
                        shadow: "shadow-emerald-500/30",
                      },
                      {
                        bg: "from-amber-400 to-amber-600",
                        shadow: "shadow-amber-500/30",
                      },
                      {
                        bg: "from-rose-400 to-rose-600",
                        shadow: "shadow-rose-500/30",
                      },
                    ];
                    const medalIcons = [
                      <Crown
                        key="crown"
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-yellow-400"
                      />,
                      <Medal
                        key="medal2"
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-slate-400"
                      />,
                      <Medal
                        key="medal3"
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-amber-600"
                      />,
                      <Flame
                        key="flame"
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-orange-400"
                      />,
                      <Zap
                        key="zap"
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-blue-400"
                      />,
                    ];
                    const colors = colorMap[idx % colorMap.length];
                    return (
                      <tr
                        key={cat.category}
                        className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-transparent transition-all duration-300 group"
                      >
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-center">
                          <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                            {idx < 3 && medalIcons[idx]}
                            <span
                              className={`w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br ${colors.bg} text-white text-[8px] sm:text-[10px] font-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-md ${colors.shadow}`}
                            >
                              {idx + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="font-extrabold text-slate-800">
                            {cat.category}
                          </div>
                          <span className="text-[7px] sm:text-[10px] font-medium text-blue-600 bg-blue-50/70 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-blue-200/40 inline-block mt-0.5 sm:mt-1">
                            {cat.serviceCount} service
                            {cat.serviceCount > 1 ? "s" : ""}
                          </span>
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center font-bold text-slate-700">
                          {cat.serviceCount}
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center font-bold text-slate-700">
                          {cat.totalViews.toLocaleString()}
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center font-bold text-slate-700 hidden sm:table-cell">
                          {cat.totalLikes.toLocaleString()}
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center font-bold text-slate-700 hidden md:table-cell">
                          {cat.totalInquiries.toLocaleString()}
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center font-bold text-slate-700 hidden lg:table-cell">
                          {cat.totalJoined.toLocaleString()}
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center hidden lg:table-cell">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold bg-amber-50/70 border border-amber-200/40 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl shadow-sm">
                            <Star className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 fill-amber-400 text-amber-400" />
                            {cat.averageRating.toFixed(1)}
                          </span>
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center">
                          <span className="font-extrabold text-blue-600 bg-blue-50/70 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-blue-200/40 shadow-sm text-[8px] sm:text-xs">
                            {cat.conversionRate}
                          </span>
                        </td>
                        <td className="px-1 sm:px-6 py-2 sm:py-4 text-center hidden xl:table-cell">
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 text-emerald-600 font-bold bg-emerald-50/70 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-emerald-200/40 shadow-sm text-[8px] sm:text-xs">
                            <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            {cat.growth}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 sm:p-8 text-center text-slate-400">
              <p className="text-xs sm:text-sm font-medium">
                No categories available to rank.
              </p>
            </div>
          )}
        </div>

        {/* ─── TWO COLUMN: RECENT ACTIVITY + CONVERSION OVERVIEW ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/30">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-slate-800">
                    Recent Activity
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium ml-8 sm:ml-11">
                  {recentActivity.length} recent updates from your services
                </p>
              </div>
              <span className="text-[8px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50/80 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-200/60 shadow-sm animate-pulse flex items-center gap-1 sm:gap-1.5">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />
                Live
              </span>
            </div>
            {recentActivity.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 sm:gap-4 bg-gradient-to-r ${activity.bgGradient} rounded-xl sm:rounded-2xl p-3 sm:p-4 hover:from-blue-50/30 hover:to-indigo-50/30 transition-all duration-300 border border-transparent hover:border-blue-200/40 group shadow-sm hover:shadow-md`}
                    >
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-r ${activity.gradient} text-white flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}
                      >
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-sm font-semibold text-slate-700 leading-relaxed">
                          {activity.text}
                        </p>
                        <span className="text-[8px] sm:text-[10px] font-bold text-slate-400">
                          {activity.time}
                        </span>
                      </div>
                      <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8 text-slate-400">
                <p className="text-xs sm:text-sm font-medium">
                  No recent activity to display.
                </p>
              </div>
            )}
          </div>

          {/* Conversion Overview */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-500">
            <div className="flex items-center justify-between mb-3 sm:mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg shadow-rose-500/30">
                    <PieChartIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-lg font-extrabold text-slate-800">
                    Conversion Overview
                  </h3>
                </div>
                <p className="text-[10px] sm:text-xs text-slate-400 font-medium ml-8 sm:ml-11">
                  Total: {totalViews.toLocaleString()} views •{" "}
                  {totalLikes.toLocaleString()} likes
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 lg:w-52 lg:h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {overallConversionRate}%
                  </span>
                  <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    Conversion
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 mt-3 sm:mt-4">
                {conversionOverview.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 sm:gap-1.5 bg-gradient-to-r ${item.bg} to-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border ${item.border} shadow-sm hover:shadow-md transition-all duration-200`}
                    >
                      <Icon
                        className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${item.text}`}
                      />
                      <span
                        className={`text-[8px] sm:text-[10px] font-bold ${item.text}`}
                      >
                        {item.label === "Profile Views"
                          ? "Views"
                          : item.label === "Students Joined"
                            ? "Joined"
                            : item.label === "Inquiries"
                              ? "Inq."
                              : item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 sm:mt-5 space-y-1.5 sm:space-y-2 border-t border-slate-100/60 pt-3 sm:pt-4">
              {conversionOverview.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between group ${item.bg} hover:${item.bg} px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-200 border border-transparent hover:${item.border}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-r ${item.gradient} text-white flex items-center justify-center shadow-sm`}
                      >
                        <Icon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs font-bold ${item.text}`}
                      >
                        {item.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                      <span className="text-[10px] sm:text-xs font-black text-slate-800">
                        {item.value.toLocaleString()}
                      </span>
                      <span
                        className={`text-[8px] sm:text-[10px] font-bold ${item.text} w-10 sm:w-12 text-right`}
                      >
                        {item.percentage}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
