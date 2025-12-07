/*
  # Create Knowledge & IQ Test Tables

  1. New Tables
    - `user_knowledge_profiles` - Detailed personal knowledge base
    - `iq_profiles` - IQ assessment profiles
    - `iq_test_results` - Individual test results

  2. Security
    - Enable RLS on all tables
    - User isolation policies
*/

CREATE TABLE IF NOT EXISTS user_knowledge_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  nickname varchar,
  birth_date date,
  gender varchar,
  relationship_status varchar,
  phone varchar,
  city varchar,
  country varchar,
  timezone varchar,
  occupation varchar,
  company varchar,
  work_schedule varchar,
  income_range varchar,
  personality_traits text[],
  communication_style varchar,
  languages text[],
  hobbies text[],
  interests text[],
  favorite_music text[],
  favorite_movies text[],
  favorite_books text[],
  sports text[],
  dietary_preferences text[],
  allergies text[],
  health_goals text[],
  sleep_schedule jsonb,
  fitness_level varchar,
  short_term_goals text[],
  long_term_goals text[],
  life_dreams text[],
  family_members jsonb[],
  close_friends jsonb[],
  pets jsonb[],
  morning_routine text,
  evening_routine text,
  work_routine text,
  favorite_brands text[],
  shopping_preferences jsonb,
  budget_priorities text[],
  important_dates jsonb[],
  notes text,
  completeness_score integer,
  last_updated timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_user_knowledge_user_id ON user_knowledge_profiles(user_id);

CREATE TABLE IF NOT EXISTS iq_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  logical_thinking integer DEFAULT 0,
  verbal_intelligence integer DEFAULT 0,
  mathematical_ability integer DEFAULT 0,
  spatial_reasoning integer DEFAULT 0,
  emotional_intelligence integer DEFAULT 0,
  creativity integer DEFAULT 0,
  memory integer DEFAULT 0,
  general_knowledge integer DEFAULT 0,
  overall_iq_estimate integer,
  strengths text[],
  areas_to_improve text[],
  total_tests_taken integer DEFAULT 0,
  last_test_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_iq_profiles_user_id ON iq_profiles(user_id);

CREATE TABLE IF NOT EXISTS iq_test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_category varchar,
  score integer,
  max_score integer,
  percentage decimal,
  questions_answered integer,
  correct_answers integer,
  time_taken_seconds integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_iq_test_results_user_id ON iq_test_results(user_id);
CREATE INDEX idx_iq_test_results_category ON iq_test_results(test_category);

-- RLS Policies
ALTER TABLE user_knowledge_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iq_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE iq_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own knowledge_profile" ON user_knowledge_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own knowledge_profile" ON user_knowledge_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own knowledge_profile" ON user_knowledge_profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own iq_profile" ON iq_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own iq_profile" ON iq_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own iq_profile" ON iq_profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own iq_test_results" ON iq_test_results
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own iq_test_results" ON iq_test_results
  FOR INSERT WITH CHECK (true);
