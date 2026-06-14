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
