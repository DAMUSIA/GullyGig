import { createClient } from "@supabase/supabase-js";
import { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import PortfolioPageClient from "@/components/portfolio/PortfolioPageClient";
import { getBaseUrl } from "@/lib/url";

interface PageProps {
  params: Promise<{ id: string }>;
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "mockKeyPart1.mockKeyPart2.mockKeyPart3";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Loads portfolio data for a service identifier or slug.
 *
 * @param idOrSlug - The service UUID or slug suffix to resolve
 * @returns The portfolio service data and associated reviews, or `null` if the portfolio cannot be resolved or loaded
 */
async function getPortfolioData(idOrSlug: string) {
  try {
    let resolvedId = idOrSlug;

    // Check if idOrSlug is a valid UUID
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(idOrSlug)) {
      // It's a slug, e.g. "guitar-lessons-uuid-here"
      // Extract the UUID from the end
      const parts = idOrSlug.split("-");
      // The last 5 parts should be the UUID (8-4-4-4-12 hex segments)
      if (parts.length >= 5) {
        const possibleUuid = parts.slice(-5).join("-");
        if (uuidRegex.test(possibleUuid)) {
          resolvedId = possibleUuid;
        } else {
          console.error(`Invalid UUID in slug: ${idOrSlug}`);
          return null;
        }
      } else {
        console.error(`Invalid slug format: ${idOrSlug}`);
        return null;
      }
    }

    // 1. Fetch service detail with user profile and analytics
    const { data: serviceData, error: serviceError } = await supabaseAdmin
      .from("services")
      .select(
        "*, users:user_id(full_name, location, about, phone_no, created_at, social_links), service_analytics(*)",
      )
      .eq("id", resolvedId)
      .single();

    if (serviceError || !serviceData) {
      console.error("Error fetching service data:", serviceError);
      return null;
    }

    // Normalize nested service_analytics if it returns as an array
    let service_analytics = serviceData.service_analytics;
    if (Array.isArray(service_analytics)) {
      service_analytics = service_analytics[0] || null;
    }

    // 2. Fetch reviews
    const { data: reviewsData } = await supabaseAdmin
      .from("service_ratings")
      .select("*, users:user_id(full_name)")
      .eq("service_id", resolvedId)
      .order("created_at", { ascending: false });

    return {
      service: {
        ...serviceData,
        service_analytics,
      },
      reviews: reviewsData || [],
    };
  } catch (error) {
    console.error("Error in getPortfolioData:", error);
    return null;
  }
}

// Generate dynamic Metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const data = await getPortfolioData(id);

  if (!data || !data.service) {
    return {
      title: "Portfolio Not Found | GullyGig",
      description:
        "This service listing could not be found or has been deactivated.",
    };
  }

  const service = data.service;
  const providerName = service.users?.full_name || "Verified Tutor";
  const location = [service.area, service.city].filter(Boolean).join(", ");
  const priceStr = service.starting_price
    ? ` starting at ₹${service.starting_price}/${service.price_unit || "hour"}`
    : "";

  const title = `${service.title} by ${providerName} - GullyGig`;
  const description = `${service.category} service in ${location}${priceStr}. ${service.description.substring(
    0,
    150,
  )}...`;

  // Use getBaseUrl() for dynamic URL generation
  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/p/${id}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `/p/${id}`,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "GullyGig Connect",
      locale: "en_IN",
      type: "profile",
      images: [
        {
          url: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pageUrl)}`,
          width: 250,
          height: 250,
          alt: `${service.title} Portfolio QR Code`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [
        `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pageUrl)}`,
      ],
    },
  };
}

/**
 * Renders the public portfolio page for the requested portfolio identifier.
 *
 * @returns The portfolio page for a matching service, or a not found message when no service is available.
 */
export default async function PublicPortfolioPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getPortfolioData(id);

  if (!data || !data.service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 font-sans transition-colors duration-300">
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl max-w-none w-full text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-extrabold text-slate-850 dark:text-slate-105">
            Portfolio Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The service portfolio you are looking for does not exist or has been
            deactivated.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer text-center"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  // IMPORTANT: Pass portfolioId, not portfolioUrl
  return (
    <PortfolioPageClient
      initialService={data.service}
      initialReviews={data.reviews}
      portfolioId={data.service.id} // Pass the ID instead of the URL
    />
  );
}
