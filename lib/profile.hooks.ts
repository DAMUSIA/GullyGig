/**
 * React hooks for profile-related operations
 * These hooks will handle data fetching, caching, and state management
 *
 * MIGRATION PLAN:
 * 1. Replace mock data with useEffect + fetch calls
 * 2. Add error handling and loading states
 * 3. Integrate with Supabase auth for current user
 * 4. Implement real-time updates with Supabase subscriptions
 */

import { useState, useEffect, useCallback } from "react";
import type {
  ExtendedUserProfile,
  StatisticsData,
  PersonalInfo,
  ProfessionalInfo,
  LocationInfo,
  VerificationStatus,
  ProfileUpdatePayload,
  FormErrors,
} from "./profile.types";

// ============================================================================
// FUTURE: useProfile Hook
// ============================================================================

/**
 * Hook to fetch and manage user profile data
 *
 * IMPLEMENTATION NOTES:
 * - Call fetchProfile() with userId from useAuth()
 * - Implement caching to avoid excessive API calls
 * - Handle real-time updates via Supabase subscriptions
 *
 * EXAMPLE USAGE:
 * const { profile, loading, error, refetch } = useProfile(userId);
 */
export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/profile/${userId}`);
      // const data = await response.json();
      // setProfile(data.data);

      console.warn("useProfile: Not yet implemented - awaiting backend API");
      setError("Profile loading not yet implemented");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void (async () => {
      await fetchProfile();
    })();
  }, [fetchProfile]);

  return { profile, loading, error, refetch: fetchProfile };
}

// ============================================================================
// FUTURE: useProfileUpdate Hook
// ============================================================================

/**
 * Hook to handle profile updates
 *
 * IMPLEMENTATION NOTES:
 * - Validate form data before submission
 * - Show optimistic updates
 * - Handle conflicts and errors gracefully
 *
 * EXAMPLE USAGE:
 * const { updateProfile, updating, error } = useProfileUpdate();
 * await updateProfile(userId, updatePayload);
 */
export function useProfileUpdate() {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProfile = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async (userId: string, payload: ProfileUpdatePayload) => {
      setUpdating(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/profile/${userId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(payload),
        // });
        // const data = await response.json();
        // return data;

        console.warn(
          "useProfileUpdate: Not yet implemented - awaiting backend API",
        );
        throw new Error("Profile update not yet implemented");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update profile";
        setError(errorMessage);
        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  return { updateProfile, updating, error };
}

// ============================================================================
// FUTURE: useStatistics Hook
// ============================================================================

/**
 * Hook to fetch user statistics
 *
 * FUTURE IMPLEMENTATION:
 * - Real-time stats via Supabase subscriptions
 * - Polling for updates
 * - Cache with stale-while-revalidate pattern
 */
export function useStatistics(userId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatistics = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: Implement actual fetch
      // const response = await fetch(`/api/profile/${userId}/statistics`);
      // const data = await response.json();
      // setStats(data.data);

      console.warn("useStatistics: Not yet implemented");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void (async () => {
      await fetchStatistics();
    })();
  }, [fetchStatistics]);

  return { stats, loading, refetch: fetchStatistics };
}

// ============================================================================
// FORM VALIDATION HOOK
// ============================================================================

/**
 * Hook for profile form validation
 *
 * USAGE:
 * const { errors, validateField, validateForm, clearErrors } = useFormValidation();
 */
export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});

  const validateField = useCallback((name: string, value: unknown): boolean => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value || typeof value !== "string" || value.trim().length < 2) {
          error = "Full name must be at least 2 characters";
        }
        break;

      case "email":
        if (!value || typeof value !== "string") {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "phone":
        if (!value || typeof value !== "string") {
          error = "Phone number is required";
        } else if (!/^\+?[\d\s\-()]{10,}$/.test(value.replace(/\D/g, ""))) {
          error = "Invalid phone number";
        }
        break;

      case "hourlyRate":
        if (typeof value !== "number" || value <= 0) {
          error = "Hourly rate must be greater than 0";
        }
        break;

      case "serviceRadius":
        if (!value || typeof value !== "string") {
          error = "Service radius is required";
        }
        break;

      case "address":
        if (!value || typeof value !== "string" || value.trim().length < 5) {
          error = "Address must be at least 5 characters";
        }
        break;

      case "city":
        if (!value || typeof value !== "string" || value.trim().length < 2) {
          error = "City is required";
        }
        break;

      case "pincode":
        if (!value || typeof value !== "string") {
          error = "Pincode is required";
        } else if (!/^\d{5,6}$/.test(value.replace(/\D/g, ""))) {
          error = "Invalid pincode";
        }
        break;

      case "bio":
        if (value && typeof value === "string" && value.length > 500) {
          error = "Bio cannot exceed 500 characters";
        }
        break;

      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    return !error;
  }, []);

  const validateForm = useCallback(
    (formData: Record<string, unknown>): boolean => {
      const newErrors: FormErrors = {};
      let isValid = true;

      Object.entries(formData).forEach(([name, value]) => {
        if (!validateField(name, value)) {
          isValid = false;
          if (errors[name]) {
            newErrors[name] = errors[name];
          }
        }
      });

      return isValid;
    },
    [validateField, errors],
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}

// ============================================================================
// CURRENT USER HOOK (Future Auth Integration)
// ============================================================================

/**
 * Hook to get current authenticated user
 *
 * IMPLEMENTATION NOTES:
 * - Use Supabase auth session
 * - Handle loading states
 * - Provide logout functionality
 */
export function useCurrentUser() {
  // TODO: Implement with Supabase auth
  // const { data: { session } } = await supabase.auth.getSession();
  // return session?.user;

  return {
    user: null,
    loading: false,
    error: null,
  };
}

// ============================================================================
// VERIFICATION STATUS HOOK
// ============================================================================

/**
 * Hook to fetch and monitor verification status
 *
 * TODO: Implement with Supabase
 */
export function useVerificationStatus(userId?: string) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, setStatus] = useState<VerificationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // TODO: API call
      console.warn("useVerificationStatus: Not yet implemented");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void (async () => {
      await fetchStatus();
    })();
  }, [fetchStatus]);

  return { status, loading, refetch: fetchStatus };
}
