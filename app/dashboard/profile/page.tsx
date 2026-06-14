"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, getUserProfile, updateUserProfile, UserProfile } from "@/lib/supabase";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileDetails from "@/components/profile/ProfileDetails";
import ProfileSidebar from "@/components/profile/ProfileSidebar";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

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
          router.push("/login");
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
          const { success: createSuccess } = await updateUserProfile(user.id, newProfile);
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
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.address) {
            const addr = data.address;
            const neighborhood = addr.neighbourhood || addr.suburb || addr.village || addr.residential || "";
            const city = addr.city || addr.town || addr.state_district || "";
            const postcode = addr.postcode || "";
            const parts = [neighborhood, city, postcode].filter(Boolean);
            const locationStr = parts.length > 0 ? parts.join(", ") : data.display_name;
            handleInputChange("location", locationStr);
          }
        } catch (err) {
          console.error("GPS Reverse Geocoding Error:", err);
          alert("Could not retrieve clean location details. Please fill it manually.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("GPS Coordinates Error:", error);
        alert(`Failed to fetch coordinates: ${error.message}`);
        setIsLocating(false);
      }
    );
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    if (!formData.full_name.trim()) {
      alert("Full Name is required");
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
        alert("Profile updated successfully!");
      } else {
        alert(error || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save profile details:", err);
      alert("Failed to update profile. Please try again.");
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
          <p className="text-gray-600 font-medium mb-4">Could not load your profile details.</p>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}
