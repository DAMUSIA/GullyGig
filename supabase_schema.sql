-- ====================================================================
-- KAAMAO CONNECT - DATABASE SCHEMA DEFINITION
-- ====================================================================

-- 1. Users Table Structure
-- Tracks detailed user profiles. Both email and phone_no are nullable to support
-- passwordless phone registration and Google OAuth without requiring fake data.
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

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- users table policies
CREATE POLICY "Allow public read access to profiles" ON public.users 
  FOR SELECT USING (true);

CREATE POLICY "Allow users to insert their own profile" ON public.users 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow users to update their own profile" ON public.users 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ====================================================================
-- ALTER SCHEMA MIGRATION CODE (FOR EXISTING DATABASES)
-- ====================================================================
-- Run this code in your Supabase SQL Editor to apply constraints updates,
-- add new columns, and ensure they are all nullable.

-- Drop old location-related columns if they exist
ALTER TABLE public.users DROP COLUMN IF EXISTS location_city;
ALTER TABLE public.users DROP COLUMN IF EXISTS neighborhood;
ALTER TABLE public.users DROP COLUMN IF EXISTS pincode;

-- Ensure columns are nullable and exist with correct types
ALTER TABLE public.users 
  ALTER COLUMN email DROP NOT NULL,
  ALTER COLUMN phone_no DROP NOT NULL,
  ALTER COLUMN dob DROP NOT NULL;

-- Add gender, location, and about columns to existing users table if they do not exist
ALTER TABLE public.users 
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS about TEXT;

-- ====================================================================
-- SERVICES TABLE STRUCTURE & POLICIES
-- ====================================================================

-- 2. Services Table Structure
CREATE TABLE IF NOT EXISTS public.services (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title text not null,
  category text not null,
  description text not null,
  service_modes text[] not null default '{}'::text[],
  city text not null,
  area text null,
  latitude double precision null,
  longitude double precision null,
  availability text[] not null default '{}'::text[],
  languages text[] null default '{}'::text[],
  starting_price integer null,
  price_unit text null,
  is_active boolean null default true,
  views_count integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint services_pkey primary key (id),
  constraint services_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE
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
