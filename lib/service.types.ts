export interface ServiceFormData {
  category: string;
  subCategory: string;
  description: string;
  experience: string;
  priceType: "hourly" | "fixed";
  price: string;
  city: string;
  locality: string;
  pincode: string;
  selectedDays: string[];
  fromTime: string;
  toTime: string;
  languages: string;
  qualifications: string;
  shortBio: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
}

export interface ServicePreview {
  id: string;
  name: string;
  isVerified: boolean;
  title: string;
  category: string;
  price: string;
  rating: number;
  reviewCount: number;
  description: string;
  experience: string;
  location: string;
  availableDays: string[];
  availableTime: string;
  languages: string;
}

export interface PricingTier {
  id?: string;
  label: string; // e.g. "10-15 year old", "School Students", "15+ year old", "Beginner Batch"
  price: number | string; // e.g. 500, 1000
  unit: string; // e.g. "per month", "per service", "per session", "per hour"
}

export interface CustomSocialLink {
  name: string;
  url: string;
}

export interface TutorServiceFormData {
  title: string;
  category: string;
  customCategory?: string;
  description: string;
  service_modes: string[]; // At My Place, At Customer's Place, Online
  city: string;
  area: string;
  address?: string; // Custom full address / street / landmark
  latitude: number | null;
  longitude: number | null;
  availability: string[]; // Weekdays, Weekends, Morning, Afternoon, Evening, Flexible, or custom tags
  custom_availability?: string; // Freeform custom schedule/timing (e.g. "Mon-Fri 4 PM - 8 PM, Sat 10 AM - 2 PM")
  languages: string[];
  starting_price: number | null;
  price_unit: string; // Flexible string: Per Service, Per Month, etc.
  pricing_tiers?: PricingTier[]; // Multiple custom customizable pricing tiers (e.g. 10-15 yr -> 500/mo, 15+ -> 1000/mo)
  pricing_note?: string; // Custom fee details e.g., "School students: ₹300, College: ₹600"
  contact_numbers?: string[];
  intro_video_url?: string; // YouTube Video Intro URL
  social_links?: {
    instagram?: string;
    facebook?: string;
    linkedin?: string;
    discord?: string;
    telegram?: string;
    youtube?: string;
    whatsapp?: string;
    twitter?: string;
    website?: string;
    custom_links?: CustomSocialLink[];
  };
}
