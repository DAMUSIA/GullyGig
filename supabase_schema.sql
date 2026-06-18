-- ====================================================================
-- KAAMAO CONNECT - DATABASE SCHEMA DEFINITION
-- ====================================================================

-- 1. Users Table Structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone_no TEXT UNIQUE,
  dob DATE,
  gender TEXT,
  location TEXT,
  about TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- users table policies
CREATE POLICY "Allow public read access to profiles" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);


-- 2. Services Table Structure
CREATE TABLE IF NOT EXISTS public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  service_modes TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  city TEXT NOT NULL,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  availability TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  languages TEXT[] DEFAULT '{}'::TEXT[],
  starting_price INTEGER,
  price_unit TEXT,
  is_active BOOLEAN DEFAULT true,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  rating_average NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on services table
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- services table policies
CREATE POLICY "Allow public read access to services" ON public.services 
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own services" ON public.services 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own services" ON public.services 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own services" ON public.services 
  FOR DELETE USING (auth.uid() = user_id);


-- 3. Service Likes Table Structure
CREATE TABLE IF NOT EXISTS public.service_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT service_likes_user_service_unique UNIQUE (user_id, service_id)
);

-- Enable RLS on service_likes table
ALTER TABLE public.service_likes ENABLE ROW LEVEL SECURITY;

-- service_likes table policies
CREATE POLICY "Allow public read access to service_likes" ON public.service_likes 
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own service_likes" ON public.service_likes 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own service_likes" ON public.service_likes 
  FOR DELETE USING (auth.uid() = user_id);


-- 4. Service Ratings / Reviews Table Structure
CREATE TABLE IF NOT EXISTS public.service_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT service_ratings_user_service_unique UNIQUE (user_id, service_id)
);

-- Enable RLS on service_ratings table
ALTER TABLE public.service_ratings ENABLE ROW LEVEL SECURITY;

-- service_ratings table policies
CREATE POLICY "Allow public read access to service_ratings" ON public.service_ratings 
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own service_ratings" ON public.service_ratings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to update their own service_ratings" ON public.service_ratings 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow users to delete their own service_ratings" ON public.service_ratings 
  FOR DELETE USING (auth.uid() = user_id);


-- 5. Service Analytics Table Structure
CREATE TABLE IF NOT EXISTS public.service_analytics (
  service_id UUID NOT NULL PRIMARY KEY REFERENCES public.services(id) ON DELETE CASCADE,
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_contacts INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  average_rating NUMERIC DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on service_analytics table
ALTER TABLE public.service_analytics ENABLE ROW LEVEL SECURITY;

-- service_analytics table policies
CREATE POLICY "Allow public read access to service_analytics" ON public.service_analytics 
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert to service_analytics" ON public.service_analytics 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update to service_analytics" ON public.service_analytics 
  FOR UPDATE USING (true) WITH CHECK (true);
