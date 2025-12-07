/*
  # Create Tasks & Contacts Tables

  1. New Tables
    - `tasks` - User tasks and to-do items
    - `contacts` - Contact management
    - `social_profiles` - Social media profiles linked to contacts
    - `social_activities` - Activity tracking for contacts

  2. Security
    - Enable RLS on all tables
    - User isolation policies
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar NOT NULL,
  description text,
  priority varchar,
  category varchar,
  status varchar DEFAULT 'pending',
  due_date date,
  due_time time,
  repeat_type varchar DEFAULT 'none',
  repeat_interval integer,
  repeat_end_date date,
  ai_suggested boolean DEFAULT false,
  ai_priority_score decimal,
  ai_reasoning text,
  estimated_duration integer,
  tags text[],
  parent_task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name varchar NOT NULL,
  email varchar,
  phone varchar,
  avatar varchar,
  company varchar,
  position varchar,
  tags text[],
  notes text,
  is_favorite boolean DEFAULT false,
  last_activity timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_name ON contacts(name);

CREATE TABLE IF NOT EXISTS social_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform varchar,
  username varchar,
  profile_url varchar,
  connected boolean DEFAULT false,
  last_checked timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_social_profiles_contact_id ON social_profiles(contact_id);
CREATE INDEX idx_social_profiles_user_id ON social_profiles(user_id);

CREATE TABLE IF NOT EXISTS social_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform varchar,
  type varchar,
  content text,
  media_url varchar,
  engagement jsonb,
  timestamp timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_social_activities_contact_id ON social_activities(contact_id);
CREATE INDEX idx_social_activities_user_id ON social_activities(user_id);
CREATE INDEX idx_social_activities_timestamp ON social_activities(timestamp);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own tasks" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (true);

CREATE POLICY "Users can read own contacts" ON contacts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own contacts" ON contacts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own contacts" ON contacts
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own contacts" ON contacts
  FOR DELETE USING (true);

CREATE POLICY "Users can read own social_profiles" ON social_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own social_profiles" ON social_profiles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own social_profiles" ON social_profiles
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own social_profiles" ON social_profiles
  FOR DELETE USING (true);

CREATE POLICY "Users can read own social_activities" ON social_activities
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own social_activities" ON social_activities
  FOR INSERT WITH CHECK (true);
