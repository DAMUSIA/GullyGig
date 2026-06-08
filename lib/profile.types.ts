/**
 * Profile-related TypeScript interfaces and types
 * These interfaces are designed for easy integration with Supabase backend
 */

// ============================================================================
// USER PROFILE INTERFACES
// ============================================================================

/**
 * Core user profile data
 * Maps to: users table in Supabase
 */
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  bio: string;
}

/**
 * Extended user profile with all details
 * Used for complete profile page
 */
export interface ExtendedUserProfile extends UserProfile {
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  locationInfo: LocationInfo;
  verificationStatus: VerificationStatus;
  statistics: StatisticsData;
}

// ============================================================================
// STATISTICS INTERFACES
// ============================================================================

/**
 * User performance statistics
 * Future tables: services, reviews, completions
 */
export interface StatisticsData {
  totalServices: number;
  totalHours: number;
  averageRating: number;
  totalReviews: number;
  responseRate: number;
  completionRate: number;
}

// ============================================================================
// PERSONAL INFORMATION INTERFACE
// ============================================================================

/**
 * Personal user information
 * Maps to: users table (extended fields)
 */
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  joinDate: string;
  bio: string;
}

// ============================================================================
// PROFESSIONAL INFORMATION INTERFACE
// ============================================================================

/**
 * Professional details and expertise
 * Future tables: user_skills, user_languages, user_services, user_categories
 */
export interface ProfessionalInfo {
  categories: string[];
  experience: string;
  skills: string[];
  languages: string[];
  hourlyRate: number;
}

/**
 * Individual skill entry
 */
export interface UserSkill {
  id: string;
  userId: string;
  skillName: string;
  proficiencyLevel: "beginner" | "intermediate" | "advanced" | "expert";
  yearsOfExperience: number;
}

/**
 * Individual language entry
 */
export interface UserLanguage {
  id: string;
  userId: string;
  languageName: string;
  proficiencyLevel: "basic" | "conversational" | "fluent" | "native";
}

/**
 * Service category entry
 */
export interface ServiceCategory {
  id: string;
  userId: string;
  categoryName: string;
  yearsInCategory: number;
}

// ============================================================================
// LOCATION INFORMATION INTERFACE
// ============================================================================

/**
 * Service location and availability
 * Maps to: users table (extended fields) + locations table (future)
 */
export interface LocationInfo {
  address: string;
  city: string;
  pincode: string;
  serviceRadius: string;
  latitude?: number;
  longitude?: number;
  serviceAreas?: string[];
}

// ============================================================================
// VERIFICATION INTERFACES
// ============================================================================

/**
 * Trust and verification status
 * Future table: user_verifications
 */
export interface VerificationStatus {
  emailVerified: boolean;
  phoneVerified: boolean;
  idVerified: boolean;
  backgroundCheck: boolean;
  trustScore: number;
  verificationDetails?: VerificationDetail[];
}

/**
 * Individual verification record
 */
export interface VerificationDetail {
  id: string;
  userId: string;
  verificationType: "email" | "phone" | "id" | "background";
  status: "pending" | "verified" | "expired" | "failed";
  verificationDate?: string;
  expiryDate?: string;
  documentUrl?: string;
}

// ============================================================================
// PROFILE UPDATE/EDIT INTERFACES
// ============================================================================

/**
 * Profile update payload
 * Used for PUT/PATCH requests to update profile
 */
export interface ProfileUpdatePayload {
  personalInfo?: Partial<PersonalInfo>;
  professionalInfo?: Partial<ProfessionalInfo>;
  locationInfo?: Partial<LocationInfo>;
}

/**
 * Profile creation payload
 * Used for POST requests
 */
export interface ProfileCreationPayload {
  userId: string;
  personalInfo: PersonalInfo;
  professionalInfo: ProfessionalInfo;
  locationInfo: LocationInfo;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

/**
 * Standard API response for profile operations
 */
export interface ProfileApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Profile fetch response
 */
export type FetchProfileResponse = ProfileApiResponse<ExtendedUserProfile>;

/**
 * Profile update response
 */
export type UpdateProfileResponse = ProfileApiResponse<ExtendedUserProfile>;

// ============================================================================
// FORM DATA INTERFACES
// ============================================================================

/**
 * Form state for profile editing
 */
export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  address: string;
  city: string;
  pincode: string;
  serviceRadius: string;
  categories: string[];
  experience: string;
  skills: string[];
  languages: string[];
  hourlyRate: number;
}

/**
 * Form validation errors
 */
export interface FormErrors {
  [key: string]: string;
}

// ============================================================================
// RATING AND REVIEW INTERFACES (Future Enhancement)
// ============================================================================

/**
 * User review/rating
 * Future table: reviews
 */
export interface UserReview {
  id: string;
  userId: string;
  reviewerId: string;
  rating: number;
  comment: string;
  createdAt: string;
  serviceId: string;
}

/**
 * Aggregated rating data
 */
export interface RatingAggregate {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    fiveStar: number;
    fourStar: number;
    threeStar: number;
    twoStar: number;
    oneStar: number;
  };
}
