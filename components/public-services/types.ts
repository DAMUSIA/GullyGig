export interface UserProfile {
  id: string;
  full_name: string;
  location: string | null;
  about: string | null;
  phone_no: string | null;
  social_links: Record<string, string> | null;
}

export interface ServiceItem {
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
  created_at: string;
  contact_numbers: string[] | null;
  users?: UserProfile;
}
