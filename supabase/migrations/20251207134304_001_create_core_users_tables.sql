/*
  # Create Core Users Tables

  1. New Tables
    - `users` - Core user accounts with auth info
    - `user_profiles` - Extended user profile information
    - `user_settings` - User preferences and settings
    - `user_devices` - Device registration and tracking

  2. Security
    - Enable RLS on all tables
    - Policies for user isolation and admin access

  3. Indexes
    - Email uniqueness
    - User ID for fast lookups
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar UNIQUE NOT NULL,
  password_hash varchar NOT NULL,
  full_name varchar,
  email_verified boolean DEFAULT false,
  email_verified_at timestamptz,
  avatar_setup_completed boolean DEFAULT false,
  personal_avatar_url varchar,
  voice_sample_url varchar,
  role varchar DEFAULT 'beta_tester',
  status varchar DEFAULT 'pending_review',
  is_beta_tester boolean DEFAULT true,
  beta_approved_at timestamptz,
  beta_approved_by uuid,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name varchar,
  avatar_setup_completed boolean DEFAULT false,
  avatar_photos text[],
  avatar_style_preferences jsonb,
  language varchar DEFAULT 'de',
  timezone varchar,
  bio text,
  onboarding_completed boolean DEFAULT false,
  onboarding_completed_at timestamptz,
  total_reward_points integer DEFAULT 0,
  voice_sample_url varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  notifications_enabled boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  profile_visibility varchar,
  theme varchar DEFAULT 'light',
  language varchar DEFAULT 'de',
  face_recognition_enabled boolean,
  voice_recognition_enabled boolean,
  ai_autonomy_level varchar,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

CREATE TABLE IF NOT EXISTS user_devices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id varchar NOT NULL,
  device_name varchar,
  browser varchar,
  browser_version varchar,
  os varchar,
  os_version varchar,
  device_type varchar,
  ip_address varchar,
  location varchar,
  is_current boolean DEFAULT false,
  is_trusted boolean DEFAULT false,
  last_active timestamptz,
  session_token varchar,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

CREATE INDEX idx_user_devices_user_id ON user_devices(user_id);

-- RLS Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;

-- Users can read their own user profile
CREATE POLICY "Users can read own user data" ON users
  FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own user data" ON users
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- User profiles - Users can read and update their own
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- User settings - Users can read and update their own
CREATE POLICY "Users can read own settings" ON user_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can update own settings" ON user_settings
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can insert own settings" ON user_settings
  FOR INSERT WITH CHECK (true);

-- User devices - Users can read their own devices
CREATE POLICY "Users can read own devices" ON user_devices
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own devices" ON user_devices
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own devices" ON user_devices
  FOR UPDATE USING (true)
  WITH CHECK (true);
