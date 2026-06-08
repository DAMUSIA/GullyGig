"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  DollarSign,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  TrendingUp,
  Award,
  Calendar,
  Edit3,
  AlertCircle,
  BarChart3,
  User,
} from "lucide-react";
import Image from "next/image";
import { getCurrentUser, getUserProfile } from "@/lib/supabase";
import type { UserProfile as SupabaseUserProfile } from "@/lib/supabase";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  bio: string;
}

interface StatisticsData {
  totalServices: number;
  totalHours: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  bio: string;
}

interface ProfessionalInfo {
  categories: string[];
  experience: string;
  skills: string[];
  languages: string[];
  hourlyRate: number;
}

interface LocationInfo {
  address: string;
  city: string;
  pincode: string;
  serviceRadius: string;
}

interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  backgroundCheck: boolean;
  trustScore: number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockUserProfile: UserProfile = {
  id: "user_123",
  fullName: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  joinDate: "January 15, 2024",
  bio: "Experienced service provider with expertise in home repairs and maintenance.",
};

const mockStatistics: StatisticsData = {
  totalServices: 24,
  totalHours: 156,
  averageRating: 4.8,
  totalReviews: 42,
  responseRate: 98,
  completionRate: 96,
};

const mockPersonalInfo: PersonalInfo = {
  fullName: "Alexander James Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "March 15, 1992",
  joinDate: "January 15, 2024",
  bio: "Experienced service provider with expertise in home repairs and maintenance. Dedicated to quality work and customer satisfaction.",
};

const mockProfessionalInfo: ProfessionalInfo = {
  categories: ["Home Repair", "Electrical Work", "Plumbing", "Carpentry"],
  experience: "8+ years in service industry",
  skills: [
    "Troubleshooting",
    "Installation",
    "Maintenance",
    "Customer Service",
  ],
  languages: ["English", "Spanish", "Mandarin"],
  hourlyRate: 55,
};

const mockLocationInfo: LocationInfo = {
  address: "123 Oak Street, Apt 4B",
  city: "San Francisco, California",
  pincode: "94102",
  serviceRadius: "15 miles",
};

const mockVerificationStatus: VerificationStatus = {
  emailVerified: true,
  phoneVerified: true,
  idVerified: true,
  backgroundCheck: true,
  trustScore: 98,
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  label,
  value,
  unit,
  trend,
}) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200/80">
    <div className="flex items-center justify-between mb-4">
      <div className="p-2.5 bg-gradient-to-br from-brand-primary/10 to-brand-teal/10 rounded-lg">
        <Icon className="h-5 w-5 text-brand-primary" />
      </div>
      {trend !== undefined && (
        <div
          className={`text-xs font-semibold flex items-center gap-1 ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-headline-md font-bold text-gray-900">{value}</div>
    {unit && <div className="text-label-sm text-gray-600 mt-0.5">{unit}</div>}
    <div className="text-label-sm text-gray-500 mt-3">{label}</div>
  </div>
);

interface InfoFieldProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
}

const InfoField: React.FC<InfoFieldProps> = ({ label, value, icon: Icon }) => (
  <div>
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon className="h-4 w-4 text-brand-primary" />}
      <label className="text-label-md font-semibold text-gray-700">
        {label}
      </label>
    </div>
    <p className="text-body-md text-gray-900 pl-6">{value}</p>
  </div>
);

interface VerificationBadgeProps {
  icon: React.ElementType;
  label: string;
  verified: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  icon: Icon,
  label,
  verified,
}) => (
  <div
    className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
      verified ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
    }`}
  >
    <div
      className={`p-2 rounded-full ${verified ? "bg-green-100" : "bg-gray-100"}`}
    >
      <Icon
        className={`h-5 w-5 ${verified ? "text-green-600" : "text-gray-400"}`}
      />
    </div>
    <div className="flex-1">
      <p
        className={`text-label-md font-semibold ${verified ? "text-green-900" : "text-gray-600"}`}
      >
        {label}
      </p>
      <p
        className={`text-label-sm ${verified ? "text-green-700" : "text-gray-500"}`}
      >
        {verified ? "Verified" : "Pending"}
      </p>
    </div>
    {verified && (
      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
    )}
  </div>
);

interface SectionTitleProps {
  icon: React.ElementType;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-gradient-to-br from-brand-primary/10 to-brand-teal/10 rounded-lg">
      <Icon className="h-5 w-5 text-brand-primary" />
    </div>
    <h2 className="text-headline-md font-bold text-gray-900">{title}</h2>
  </div>
);

// ============================================================================
// MAIN PROFILE PAGE COMPONENT
// ============================================================================

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(
    null,
  );

  // Format date from ISO string to readable format
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Extract initials from name
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  // Fetch user profile from Supabase on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current authenticated user
        const { user } = await getCurrentUser();

        if (!user) {
          setError("No authenticated user found. Please log in.");
          setLoading(false);
          return;
        }

        // Get user's profile from database
        const userId = (user as { id?: string })?.id;
        if (!userId) {
          setError("User ID not available. Please log in again.");
          setLoading(false);
          return;
        }

        const result = await getUserProfile(userId);

        if (!result.success || !result.profile) {
          setError(result.error || "Failed to load profile. Please try again.");
          setLoading(false);
          return;
        }

        setUserProfile(result.profile);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-brand-bg-light py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">
            <div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-brand-bg-light py-8 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-md border border-red-200 p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-headline-md font-bold text-gray-900 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-body-md text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-teal text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Map Supabase data to display variables with fallbacks
  const displayData = {
    fullName: userProfile?.full_name || mockUserProfile.fullName,
    email: userProfile?.email || mockUserProfile.email,
    phone: userProfile?.phone_no || mockUserProfile.phone,
    dob: userProfile?.dob
      ? formatDate(userProfile.dob)
      : mockPersonalInfo.dateOfBirth,
    joinDate: userProfile?.created_at
      ? formatDate(userProfile.created_at)
      : mockPersonalInfo.joinDate,
    city: userProfile?.location_city || mockLocationInfo.city,
    pincode: userProfile?.pincode || mockLocationInfo.pincode,
  };

  return (
    <div className="w-full min-h-screen bg-brand-bg-light py-8">
      {/* ──────────────────────────────────────────────────────────────────── */
      /* PROFILE HEADER SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-200/80 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-primary to-brand-teal flex items-center justify-center text-white shadow-lg">
                <span className="text-4xl font-bold">
                  {getInitials(displayData.fullName)}
                </span>
              </div>
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-headline-lg font-bold text-gray-900">
                {displayData.fullName}
              </h1>
              <p className="text-body-md text-gray-600 mt-1">
                Premium Pro Member
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="flex items-center gap-2 text-body-md text-gray-700">
                  <Mail className="h-4 w-4 text-brand-primary" />
                  {displayData.email}
                </div>
                <div className="flex items-center gap-2 text-body-md text-gray-700">
                  <Phone className="h-4 w-4 text-brand-primary" />
                  {displayData.phone}
                </div>
              </div>
              <p className="text-body-md text-gray-600 mt-3 max-w-2xl">
                {mockUserProfile.bio}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-teal text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2 whitespace-nowrap"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* STATISTICS SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle icon={BarChart3} title="Performance Overview" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard
            icon={Briefcase}
            label="Total Services"
            value={mockStatistics.totalServices}
            unit="completed"
            trend={12}
          />
          <StatCard
            icon={Clock}
            label="Total Hours"
            value={mockStatistics.totalHours}
            unit="hours worked"
            trend={8}
          />
          <StatCard
            icon={Star}
            label="Average Rating"
            value={mockStatistics.averageRating.toFixed(1)}
            unit="out of 5.0"
            trend={5}
          />
          <StatCard
            icon={MessageSquare}
            label="Total Reviews"
            value={mockStatistics.totalReviews}
            unit="reviews"
            trend={15}
          />
          <StatCard
            icon={Clock}
            label="Response Rate"
            value={`${mockStatistics.responseRate}%`}
            unit="average response"
            trend={2}
          />
          <StatCard
            icon={Award}
            label="Completion Rate"
            value={`${mockStatistics.completionRate}%`}
            unit="jobs completed"
            trend={3}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* PERSONAL INFORMATION SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle icon={User} title="Personal Information" />
        <div className="bg-white rounded-xl shadow-md border border-gray-200/80 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoField label="Full Name" value={displayData.fullName} />
            <InfoField
              label="Email Address"
              value={displayData.email}
              icon={Mail}
            />
            <InfoField
              label="Phone Number"
              value={displayData.phone}
              icon={Phone}
            />
            <InfoField
              label="Date of Birth"
              value={displayData.dob}
              icon={Calendar}
            />
            <div className="md:col-span-2">
              <div>
                <label className="text-label-md font-semibold text-gray-700 block mb-1.5">
                  Bio
                </label>
                <p className="text-body-md text-gray-900">
                  {mockUserProfile.bio}
                </p>
              </div>
            </div>
            <div>
              <div>
                <label className="text-label-md font-semibold text-gray-700 block mb-1.5">
                  Member Since
                </label>
                <p className="text-body-md text-gray-900">
                  {displayData.joinDate}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* PROFESSIONAL INFORMATION SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle icon={Briefcase} title="Professional Information" />
        <div className="bg-white rounded-xl shadow-md border border-gray-200/80 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Categories */}
            <div>
              <label className="text-label-md font-semibold text-gray-700 block mb-3">
                Service Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {mockProfessionalInfo.categories.map((category, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gradient-to-r from-brand-primary/10 to-brand-teal/10 text-brand-primary rounded-full text-label-sm font-semibold border border-brand-primary/20"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            <InfoField
              label="Experience"
              value={mockProfessionalInfo.experience}
              icon={Award}
            />

            {/* Skills */}
            <div>
              <label className="text-label-md font-semibold text-gray-700 block mb-3">
                Key Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {mockProfessionalInfo.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-label-sm font-medium border border-gray-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="text-label-md font-semibold text-gray-700 block mb-3">
                Languages
              </label>
              <div className="flex flex-wrap gap-2">
                {mockProfessionalInfo.languages.map((language, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-label-sm font-medium border border-blue-200"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Hourly Rate */}
            <div className="flex items-end">
              <div className="w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <DollarSign className="h-4 w-4 text-brand-primary" />
                  <label className="text-label-md font-semibold text-gray-700">
                    Hourly Rate
                  </label>
                </div>
                <p className="text-body-md text-gray-900 pl-6">
                  ${mockProfessionalInfo.hourlyRate}/hour
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* LOCATION INFORMATION SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle icon={MapPin} title="Location Information" />
        <div className="bg-white rounded-xl shadow-md border border-gray-200/80 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InfoField
              label="Street Address"
              value={mockLocationInfo.address}
              icon={MapPin}
            />
            <InfoField
              label="City & State"
              value={displayData.city}
              icon={MapPin}
            />
            <InfoField
              label="Zip Code"
              value={displayData.pincode}
              icon={MapPin}
            />
            <InfoField
              label="Service Radius"
              value={mockLocationInfo.serviceRadius}
              icon={Globe}
            />
          </div>

          {/* Map Placeholder */}
          <div className="mt-8 w-full h-64 bg-gradient-to-br from-brand-bg-light to-blue-50 rounded-lg border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-brand-primary/30 mx-auto mb-3" />
              <p className="text-body-md text-gray-500">
                Map integration coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* VERIFICATION SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <SectionTitle icon={CheckCircle} title="Trust & Verification" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <VerificationBadge
            icon={Mail}
            label="Email Verification"
            verified={mockVerificationStatus.emailVerified}
          />
          <VerificationBadge
            icon={Phone}
            label="Phone Verification"
            verified={mockVerificationStatus.phoneVerified}
          />
          <VerificationBadge
            icon={Award}
            label="ID Verification"
            verified={mockVerificationStatus.idVerified}
          />
          <VerificationBadge
            icon={CheckCircle}
            label="Background Check"
            verified={mockVerificationStatus.backgroundCheck}
          />
        </div>

        {/* Trust Score Card */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border border-green-200 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-headline-md font-bold text-green-900 mb-2">
                Trust Score
              </h3>
              <p className="text-body-md text-green-700">
                Your trust score is based on your verification status, customer
                reviews, and service completion rate.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <div className="text-4xl font-bold text-white">
                    {mockVerificationStatus.trustScore}
                  </div>
                </div>
                <p className="text-label-sm text-green-700 mt-2 font-semibold">
                  out of 100
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────── */
      /* BOTTOM ACTION SECTION
      /* ──────────────────────────────────────────────────────────────────── */}
      <div className="flex gap-4 justify-center md:justify-start">
        <button className="px-8 py-3 bg-gradient-to-r from-brand-primary to-brand-teal text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
          Save Changes
        </button>
        <button className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200">
          Cancel
        </button>
      </div>
    </div>
  );
}
