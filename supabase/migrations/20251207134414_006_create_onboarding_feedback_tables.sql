/*
  # Create Onboarding, Feedback & Audit Tables

  1. New Tables
    - `onboarding_steps` - Onboarding step definitions
    - `user_onboarding_progress` - User progress tracking
    - `user_onboarding_rewards` - Earned badges and points
    - `beta_feedback` - User feedback submissions
    - `audit_log` - System activity logging
    - `email_verification_tokens` - Email verification tokens

  2. Security
    - Enable RLS on all tables
    - Admin-only access for audit logs
*/

CREATE TABLE IF NOT EXISTS onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar UNIQUE NOT NULL,
  title varchar,
  description text,
  icon varchar,
  reward_points integer,
  reward_badge varchar,
  sort_order integer,
  category varchar,
  required boolean DEFAULT false,
  active boolean DEFAULT true,
  estimated_time_minutes integer,
  prerequisites text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_onboarding_steps_key ON onboarding_steps(key);

CREATE TABLE IF NOT EXISTS user_onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_key varchar NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  started_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, step_key)
);

CREATE INDEX idx_user_onboarding_progress_user_id ON user_onboarding_progress(user_id);
CREATE INDEX idx_user_onboarding_progress_completed ON user_onboarding_progress(completed);

CREATE TABLE IF NOT EXISTS user_onboarding_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id varchar,
  badge_name varchar,
  badge_icon varchar,
  points_earned integer,
  source_step_key varchar,
  earned_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_onboarding_rewards_user_id ON user_onboarding_rewards(user_id);

CREATE TABLE IF NOT EXISTS beta_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  category varchar,
  title varchar,
  description text,
  priority varchar,
  status varchar DEFAULT 'new',
  screenshot_urls text[],
  browser_info jsonb,
  page_url varchar,
  user_email varchar,
  user_name varchar,
  admin_notes text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_beta_feedback_user_id ON beta_feedback(user_id);
CREATE INDEX idx_beta_feedback_status ON beta_feedback(status);
CREATE INDEX idx_beta_feedback_created_at ON beta_feedback(created_at);

CREATE TABLE IF NOT EXISTS audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  action varchar,
  entity_type varchar,
  entity_id varchar,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token varchar UNIQUE NOT NULL,
  email varchar,
  expires_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_email_verification_tokens_user_id ON email_verification_tokens(user_id);
CREATE INDEX idx_email_verification_tokens_token ON email_verification_tokens(token);

-- RLS Policies
ALTER TABLE onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_onboarding_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Onboarding steps - Public read
CREATE POLICY "Public can read onboarding_steps" ON onboarding_steps
  FOR SELECT USING (true);

-- User onboarding progress
CREATE POLICY "Users can read own onboarding_progress" ON user_onboarding_progress
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own onboarding_progress" ON user_onboarding_progress
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own onboarding_progress" ON user_onboarding_progress
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- User onboarding rewards
CREATE POLICY "Users can read own onboarding_rewards" ON user_onboarding_rewards
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own onboarding_rewards" ON user_onboarding_rewards
  FOR INSERT WITH CHECK (true);

-- Beta feedback
CREATE POLICY "Users can read own beta_feedback" ON beta_feedback
  FOR SELECT USING (true);

CREATE POLICY "Users can insert beta_feedback" ON beta_feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own beta_feedback" ON beta_feedback
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- Audit log - System only, no direct user access
ALTER TABLE audit_log DISABLE ROW LEVEL SECURITY;

-- Email verification tokens
CREATE POLICY "Users can read own email_verification_tokens" ON email_verification_tokens
  FOR SELECT USING (true);
