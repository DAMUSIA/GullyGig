-- GullyGig Database Setup Script
-- Paste and run this script in your Supabase SQL Editor to set up tables, unique constraints, RLS, and policies.

-- ==================== 1. TABLES CREATION ====================

-- Users Profile Table (with is_paid status: default false)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE,
  phone_no text UNIQUE,
  dob date,
  gender text,
  location text,
  about text,
  is_paid boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  social_links jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Services Table (Strict 1 service per user via UNIQUE(user_id) constraint)
CREATE TABLE IF NOT EXISTS public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  description text NOT NULL,
  service_modes text[] NOT NULL DEFAULT '{}'::text[],
  city text NOT NULL,
  area text,
  latitude double precision,
  longitude double precision,
  availability text[] NOT NULL DEFAULT '{}'::text[],
  languages text[] DEFAULT '{}'::text[],
  starting_price integer,
  price_unit text,
  is_active boolean DEFAULT true,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  likes_count integer DEFAULT 0,
  rating_average numeric DEFAULT 0,
  reviews_count integer DEFAULT 0,
  contact_numbers text[] DEFAULT '{}'::text[],
  CONSTRAINT services_pkey PRIMARY KEY (id),
  CONSTRAINT services_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT services_user_id_unique UNIQUE (user_id)
);

-- Service Likes Table
CREATE TABLE IF NOT EXISTS public.service_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_likes_pkey PRIMARY KEY (id),
  CONSTRAINT service_likes_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE,
  CONSTRAINT service_likes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT service_likes_user_service_unique UNIQUE (service_id, user_id)
);

-- Service Ratings / Reviews Table
CREATE TABLE IF NOT EXISTS public.service_ratings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL,
  user_id uuid NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT service_ratings_pkey PRIMARY KEY (id),
  CONSTRAINT service_ratings_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE,
  CONSTRAINT service_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT service_ratings_user_service_unique UNIQUE (service_id, user_id)
);

-- Service Analytics Table
CREATE TABLE IF NOT EXISTS public.service_analytics (
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
  CONSTRAINT service_analytics_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE
);

-- ==================== 2. ROW LEVEL SECURITY (RLS) ====================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_analytics ENABLE ROW LEVEL SECURITY;

-- ==================== 3. POLICIES ====================

-- --- USERS POLICIES ---
CREATE POLICY "Allow public read access to users"
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile"
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile"
  ON public.users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- --- SERVICES POLICIES ---
CREATE POLICY "Allow public read access to services"
  ON public.services FOR SELECT USING (true);

-- Allow authenticated and paid users to insert their single service
CREATE POLICY "Allow paid users to insert one service"
  ON public.services FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid() AND users.is_paid = true
    )
  );

CREATE POLICY "Allow owners to update services"
  ON public.services FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow owners to delete services"
  ON public.services FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Allow public update of service views"
  ON public.services FOR UPDATE USING (true) WITH CHECK (true);

-- --- SERVICE_LIKES POLICIES ---
CREATE POLICY "Allow public read access to service_likes"
  ON public.service_likes FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert service_likes"
  ON public.service_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own service_likes"
  ON public.service_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- --- SERVICE_RATINGS POLICIES ---
CREATE POLICY "Allow public read access to service_ratings"
  ON public.service_ratings FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert service_ratings"
  ON public.service_ratings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update/delete their own service_ratings"
  ON public.service_ratings FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- --- SERVICE_ANALYTICS POLICIES ---
CREATE POLICY "Allow public read access to service_analytics"
  ON public.service_analytics FOR SELECT USING (true);

-- --- TABLE GRANTS ---
GRANT SELECT ON TABLE public.users TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO authenticated;
GRANT ALL ON TABLE public.users TO postgres, service_role;

GRANT SELECT ON TABLE public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.services TO authenticated;
GRANT ALL ON TABLE public.services TO postgres, service_role;

GRANT SELECT ON TABLE public.service_likes TO anon;
GRANT SELECT, INSERT, DELETE ON TABLE public.service_likes TO authenticated;
GRANT ALL ON TABLE public.service_likes TO postgres, service_role;

GRANT SELECT ON TABLE public.service_ratings TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.service_ratings TO authenticated;
GRANT ALL ON TABLE public.service_ratings TO postgres, service_role;

GRANT SELECT ON TABLE public.service_analytics TO anon, authenticated;
GRANT ALL ON TABLE public.service_analytics TO postgres, service_role;

-- ==================== 4. MIGRATION & ADMIN QUERIES ====================
-- If you already have existing tables in Supabase, run these migration statements:
--
-- 1. Add is_paid column (default false):
-- ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false NOT NULL;
--
-- 2. Enforce 1 service per user limit with unique constraint:
-- ALTER TABLE public.services ADD CONSTRAINT services_user_id_unique UNIQUE (user_id);
--
-- 3. Update existing service insert RLS policy to enforce payment:
-- DROP POLICY IF EXISTS "Allow authenticated users to insert services" ON public.services;
-- CREATE POLICY "Allow paid users to insert one service"
--   ON public.services FOR INSERT TO authenticated
--   WITH CHECK (
--     auth.uid() = user_id AND
--     EXISTS (
--       SELECT 1 FROM public.users
--       WHERE users.id = auth.uid() AND users.is_paid = true
--     )
--   );
--
-- 4. MANUALLY MARK A USER AS PAID (Activate Provider):
-- UPDATE public.users SET is_paid = true WHERE email = 'user@example.com';
-- UPDATE public.users SET is_paid = true WHERE phone_no = '7559302315';
-- UPDATE public.users SET is_paid = true WHERE id = 'YOUR_USER_UUID_HERE';
--
-- 5. MANUALLY MARK A USER AS UNPAID (Deactivate):
-- UPDATE public.users SET is_paid = false WHERE email = 'user@example.com';
--
-- 6. VIEW ALL USERS & PAYMENT STATUS:
-- SELECT id, full_name, email, phone_no, is_paid, created_at FROM public.users ORDER BY created_at DESC;