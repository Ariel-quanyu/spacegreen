/*
  # Community Gamification Database Setup

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `username` (text, unique)
      - `full_name` (text)
      - `total_xp` (integer, default 0)
      - `events_attended` (integer, default 0)
      - `spaces_explored` (integer, default 0)
      - `events_created` (integer, default 0)
      - `created_at` (timestamp)

    - `user_activities`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `activity_type` (text)
      - `activity_name` (text)
      - `location` (text)
      - `xp_earned` (integer)
      - `created_at` (timestamp)

    - `user_achievements`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to user_profiles)
      - `achievement_type` (text)
      - `achievement_name` (text)
      - `description` (text)
      - `xp_reward` (integer)
      - `earned_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data only
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  full_name text,
  total_xp integer DEFAULT 0,
  events_attended integer DEFAULT 0,
  spaces_explored integer DEFAULT 0,
  events_created integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Create user_activities table
CREATE TABLE IF NOT EXISTS public.user_activities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  activity_name text NOT NULL,
  location text,
  xp_earned integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for user_activities
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_activities
CREATE POLICY "Users can view their own activities" 
  ON public.user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.user_activities 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.user_profiles(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  xp_reward integer NOT NULL,
  earned_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for user_achievements
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
  ON public.user_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
  ON public.user_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);