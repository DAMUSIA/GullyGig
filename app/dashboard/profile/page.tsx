"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getUserProfile,
  updateUserProfile,
  UserProfile,
} from "@/lib/supabase";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, AlertCircle, X } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_no: "",
    dob: "",
    gender: "",
    location: "",
    about: "",
  });

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
          setFormData({
            full_name: dbProfile.full_name || "",
            email: dbProfile.email || "",
            phone_no: dbProfile.phone_no || "",
            dob: dbProfile.dob || "",
            gender: dbProfile.gender || "",
            location: dbProfile.location || "",
            about: dbProfile.about || "",
          });
        } else {
          // If no database profile exists, auto-initialize a default profile to avoid page crash
          const newProfile: UserProfile = {
            id: user.id,
            full_name: user.user_metadata?.full_name || "New User",
            email: user.email || null,
            phone_no: user.user_metadata?.phone_no || null,
            dob: null,
            gender: null,
            location: null,
            about: null,
            created_at: new Date().toISOString(),
          };
          const { success: createSuccess } = await updateUserProfile(
            user.id,
            newProfile,
          );
          if (createSuccess) {
            setProfile(newProfile);
            setFormData({
              full_name: newProfile.full_name || "",
              email: newProfile.email || "",
              phone_no: newProfile.phone_no || "",
              dob: "",
              gender: "",
              location: "",
              about: "",
            });
          }
        }
      } catch (err) {
        console.error("Error loading profile page:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser", "error");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        let data;
        let isNominatim = false;
        try {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
              { signal: controller.signal }
            );
            clearTimeout(timeoutId);

            if (response.ok) {
              data = await response.json();
              isNominatim = true;
            } else {
              throw new Error("Nominatim response not OK");
            }
          } catch (nominatimErr) {
            console.warn("Nominatim reverse geocode failed, attempting BigDataCloud fallback...", nominatimErr);
            try {
              const response = await fetch(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
              );
              if (response.ok) {
                data = await response.json();
              } else {
                throw new Error("BigDataCloud response not OK");
              }
            } catch (bdcErr) {
              console.error("All reverse geocoding services failed:", bdcErr);
            }
          }

          if (data) {
            let neighborhood = "";
            let city = "";
            let postcode = "";
            let displayName = "";

            if (isNominatim && data.address) {
              const addr = data.address;
              neighborhood =
                addr.neighbourhood ||
                addr.suburb ||
                addr.village ||
                addr.residential ||
                "";
              city = addr.city || addr.town || addr.state_district || "";
              postcode = addr.postcode || "";
              displayName = data.display_name || "";
            } else if (data.locality !== undefined) {
              city = data.city || data.locality || "";
              const informative = data.localityInfo?.informative || [];
              const areaItem = informative.find((i: { name: string; description?: string }) =>
                ["suburb", "neighbourhood", "subdistrict", "locality"].includes(i.description?.toLowerCase() || "")
              );
              neighborhood = areaItem?.name || data.locality || "";
              postcode = data.postcode || "";
              displayName = `${neighborhood}, ${city}, ${data.countryName || ""}`;
            }

            const parts = [neighborhood, city, postcode].filter(Boolean);
            const locationStr =
              parts.length > 0 ? parts.join(", ") : displayName;
            handleInputChange("location", locationStr);
          } else {
            showToast("Could not retrieve clean location details. Please fill it manually.", "error");
          }
        } catch (err) {
          console.error("GPS Reverse Geocoding Error:", err);
          showToast("Could not retrieve clean location details. Please fill it manually.", "error");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("GPS Coordinates Error:", error?.message || error?.code || String(error));
        let errorMsg = "Failed to fetch coordinates. Please fill manually.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg =
            "Location permission denied or disabled by permissions policy. Please fill manually.";
        } else if (error.message) {
          errorMsg = `Failed to fetch coordinates: ${error.message}`;
        }
        showToast(errorMsg, "error");
        setIsLocating(false);
      },
    );
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    if (!formData.full_name.trim()) {
      showToast("Full Name is required", "error");
      return;
    }

    setIsSaving(true);
    try {
      // Clean up fields to preserve null rather than empty string
      const payload: Partial<UserProfile> = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim() || null,
        phone_no: formData.phone_no.trim() || null,
        gender: formData.gender || null,
        dob: formData.dob || null,
        location: formData.location.trim() || null,
        about: formData.about.trim() || null,
      };

      const { success, error } = await updateUserProfile(profile.id, payload);
      if (success) {
        setProfile((prev) => (prev ? { ...prev, ...payload } : null));
        setIsEditing(false);
        showToast("Profile updated successfully!", "success");
      } else {
        showToast(error || "Failed to update profile. Please try again.", "error");
      }
    } catch (err) {
      console.error("Failed to save profile details:", err);
      showToast("Failed to update profile. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || "",
        phone_no: profile.phone_no || "",
        dob: profile.dob || "",
        gender: profile.gender || "",
        location: profile.location || "",
        about: profile.about || "",
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm">
          <p className="text-gray-600 font-medium mb-4">
            Could not load your profile details.
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileHeader
              profile={profile}
              isEditing={isEditing}
              isSaving={isSaving}
              formData={formData}
              isLocating={isLocating}
              onEdit={() => setIsEditing(true)}
              onSave={handleSaveProfile}
              onCancel={handleCancel}
              onInputChange={handleInputChange}
              onGPSLocation={handleGPSLocation}
            />
            <ProfileDetails
              profile={profile}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <ProfileSidebar
              profile={profile}
              isEditing={isEditing}
              formData={formData}
              onInputChange={handleInputChange}
              onShowToast={showToast}
            />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-2xl text-xs font-bold whitespace-nowrap"
          >
            {toast.type === "success" ? (
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
            )}
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="p-1 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
