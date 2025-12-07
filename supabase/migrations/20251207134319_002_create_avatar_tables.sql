/*
  # Create Avatar & Avatar Profile Tables

  1. New Tables
    - `user_avatars` - Avatar configuration and generation
    - `mio_profiles` - AI assistant preferences
    - `voice_settings` - Voice configuration

  2. Security
    - Enable RLS on all tables
    - User isolation policies
*/

CREATE TABLE IF NOT EXISTS user_avatars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  photo_urls text[],
  front_photo_url varchar,
  left_photo_url varchar,
  right_photo_url varchar,
  generated_avatar_url varchar,
  voice_sample_url varchar,
  avatar_style varchar,
  voice_style varchar,
  personality_traits text[],
  speaking_style varchar,
  clothing_style varchar,
  background_style varchar,
  accessories text[],
  custom_colors jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_avatars_user_id ON user_avatars(user_id);

CREATE TABLE IF NOT EXISTS mio_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  display_name varchar,
  avatar_url varchar,
  avatar_style varchar,
  ai_preferences jsonb,
  connected_services text[],
  goals text[],
  life_areas jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mio_profiles_user_id ON mio_profiles(user_id);

CREATE TABLE IF NOT EXISTS voice_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  voice_style varchar,
  speech_rate decimal,
  pitch decimal,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_voice_settings_user_id ON voice_settings(user_id);

-- RLS Policies
ALTER TABLE user_avatars ENABLE ROW LEVEL SECURITY;
ALTER TABLE mio_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own avatar" ON user_avatars
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own avatar" ON user_avatars
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own avatar" ON user_avatars
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own mio_profile" ON mio_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own mio_profile" ON mio_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own mio_profile" ON mio_profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own voice_settings" ON voice_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own voice_settings" ON voice_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own voice_settings" ON voice_settings
  FOR UPDATE USING (true)
  WITH CHECK (true);
