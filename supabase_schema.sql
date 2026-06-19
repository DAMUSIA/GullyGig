-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.users (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE,
  phone_no text UNIQUE,
  dob date,
  gender text,
  location text,
  about text,
  created_at timestamp with time zone DEFAULT now(),
  social_links jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  service_modes ARRAY NOT NULL DEFAULT '{}'::text[],
  city text NOT NULL,
  area text,
  latitude double precision,
  longitude double precision,
  availability ARRAY NOT NULL DEFAULT '{}'::text[],
  languages ARRAY DEFAULT '{}'::text[],
  starting_price integer,
  price_unit text,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  likes_count integer DEFAULT 0,
  rating_average numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  contact_numbers ARRAY DEFAULT '{}'::text[],
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.service_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_likes_pkey PRIMARY KEY (id),
  CONSTRAINT service_likes_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT service_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.service_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT service_ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id),
  CONSTRAINT service_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.service_analytics (
  service_id uuid NOT NULL,
  total_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  total_likes integer DEFAULT 0,
  total_contacts integer DEFAULT 0,
  total_reviews integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now(),
  portfolio_views integer DEFAULT 0,
  CONSTRAINT service_analytics_pkey PRIMARY KEY (service_id),
  CONSTRAINT service_analytics_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id)
);