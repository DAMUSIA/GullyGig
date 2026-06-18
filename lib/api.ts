// lib/api.ts
export interface ServiceData {
  id: string;
  title: string;
  category: string;
  city: string;
  area?: string;
  startingPrice: number;
  priceUnit: string;
  averageRating: number;
  reviewCount: number;
  description: string;
  availability: string[];
  languages: string[];
  serviceModes: string[]; // e.g., ['Online','Offline','Home Visit']
  contactNumbers: string[];
  provider: {
    fullName: string;
    location: string;
    about: string;
    memberSince: string;
    avatarUrl?: string;
  };
  stats: {
    portfolioViews: number;
    likes: number;
    averageRating: number;
    reviewCount: number;
  };
}

/** Fetch service data by ID. */
export async function fetchService(id: string): Promise<ServiceData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/services/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    console.warn('Failed to fetch service, using mock data');
    return {
      id,
      title: 'Sample Service Title',
      category: 'Tutoring',
      city: 'Mumbai',
      area: 'Andheri West',
      startingPrice: 500,
      priceUnit: 'INR/hour',
      averageRating: 4.5,
      reviewCount: 23,
      description: 'Detailed description of the service goes here. It should be engaging and trustworthy.',
      availability: ['Monday-Friday', 'Evening'],
      languages: ['English', 'Hindi'],
      serviceModes: ['Online', 'Offline'],
      contactNumbers: ['+91 9876543210', '+91 9123456780'],
      provider: {
        fullName: 'John Doe',
        location: 'Mumbai, India',
        about: 'Professional tutor with 5 years of experience.',
        memberSince: '2021-04-15',
        avatarUrl: undefined,
      },
      stats: {
        portfolioViews: 1245,
        likes: 89,
        averageRating: 4.5,
        reviewCount: 23,
      },
    } as ServiceData;
  }
  return (await res.json()) as ServiceData;
}
