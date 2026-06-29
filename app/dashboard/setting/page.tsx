"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserProfile,
  UserProfile,
  supabase,
  signOut,
} from "@/lib/supabase";
import {
  User,
  Mail,
  Phone,
  LogOut,
  Settings as SettingsIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

/**
 * Renders the settings page for the signed-in user.
 *
 * Shows profile details, support contact links, and a logout flow with confirmation.
 */
export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // States
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Loading states
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // WhatsApp Community states
  const [isWhatsAppJoined, setIsWhatsAppJoined] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { user } = (await getCurrentUser()) as {
          user: {
            id: string;
            email?: string | null;
            user_metadata?: {
              full_name?: string;
              phone_no?: string;
            };
          } | null;
        };
        if (!user) {
          router.push("/Auth");
          return;
        }

        const { success, profile: dbProfile } = await getUserProfile(user.id);

        if (success && dbProfile) {
          setProfile(dbProfile);
        } else {
          const fallback: UserProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || "User",
            email: user.email || null,
            phone_no: user.user_metadata?.phone_no || null,
            dob: null,
            gender: null,
            location: null,
            about: null,
            created_at: new Date().toISOString(),
          };
          setProfile(fallback);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const status = localStorage.getItem("gullygig_whatsapp_joined");
      setIsWhatsAppJoined(status === "true");
    }
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { success, error } = await signOut();

      if (!success) {
        throw new Error(error || "Failed to sign out");
      }

      router.push("/Auth");
      router.refresh();
    } catch (err: unknown) {
      console.error("Failed to logout:", err);
      const errorObj = err as { message?: string } | null;
      alert(errorObj?.message || "Failed to logout. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-xl max-w-sm">
          <p className="text-gray-600 font-medium mb-4">
            Could not load your settings.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <SettingsIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 text-sm">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
          {/* Profile Information - View Only */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500">
                  View your personal details
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Full Name
                  </p>
                </div>
                <p className="text-gray-900 font-medium sm:ml-auto break-all">
                  {profile.full_name || "Not set"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-purple-50 rounded-lg">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Email
                  </p>
                </div>
                <p className="text-gray-900 sm:ml-auto break-all">
                  {profile.email || "Not set"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 bg-green-50 rounded-lg">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Phone
                  </p>
                </div>
                <p className="text-gray-900 sm:ml-auto break-all">
                  {profile.phone_no || "Not set"}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Community Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100 bg-emerald-50/15">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="p-2.5 bg-[#25D366] rounded-full text-white mt-0.5 flex-shrink-0 shadow-sm flex items-center justify-center">
                  <FaWhatsapp className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-semibold text-gray-900">
                      WhatsApp Community
                    </h2>
                    {isWhatsAppJoined && (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 flex-shrink-0">
                        <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
                        Joined
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-550 mt-1 leading-relaxed">
                    {isWhatsAppJoined
                      ? "You are part of our official WhatsApp community."
                      : "Join our official community to get local job alerts, service orders and updates."}
                  </p>
                  <p className="text-xs text-gray-605 font-medium mt-2 bg-white/70 border border-emerald-100/50 p-2.5 rounded-xl leading-relaxed">
                    Follow this link to join my WhatsApp community:{" "}
                    <a
                      href="https://chat.whatsapp.com/HG3U2hP7IEu0EHAiftscCq"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-600 hover:text-blue-800 font-semibold break-all"
                    >
                      https://chat.whatsapp.com/HG3U2hP7IEu0EHAiftscCq
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto self-start md:self-center mt-2 md:mt-0">
                <a
                  href="https://chat.whatsapp.com/HG3U2hP7IEu0EHAiftscCq"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    localStorage.setItem("gullygig_whatsapp_joined", "true");
                    setIsWhatsAppJoined(true);
                  }}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-xs hover:shadow-md cursor-pointer"
                >
                  {isWhatsAppJoined ? "Visit Community" : "Join Now"}
                </a>
              </div>
            </div>
          </div>

          {/* Contact Us Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Contact Us
                </h2>
                <p className="text-sm text-gray-500">
                  Need support? Get in touch with our team
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-xs border border-gray-100">
                  <Mail className="w-4 h-4 text-slate-650" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-505 uppercase tracking-wider">
                    Email Support
                  </p>
                  <a
                    href="mailto:support@gullygig.in"
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    support@gullygig.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                <div className="p-2 bg-white rounded-lg shadow-xs border border-gray-100">
                  <Phone className="w-4 h-4 text-slate-650" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-550 uppercase tracking-wider">
                    Phone Support
                  </p>
                  <a
                    href="tel:7559302315"
                    className="text-gray-900 text-sm font-semibold hover:text-blue-600"
                  >
                    7559302315
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Logout Section */}
          <div className="p-4 sm:p-6">
            {!showLogoutConfirm ? (
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-red-50/50 hover:bg-red-50 rounded-xl border-2 border-red-200/50 hover:border-red-300 transition-all group"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      Logout
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Sign out of your account
                    </p>
                  </div>
                </div>
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
              </button>
            ) : (
              // Logout Confirmation - Mobile Friendly
              <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="flex items-center sm:items-start gap-3">
                    <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        Confirm Logout
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                        Are you sure you want to logout?
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2 disabled:opacity-70 text-sm"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
