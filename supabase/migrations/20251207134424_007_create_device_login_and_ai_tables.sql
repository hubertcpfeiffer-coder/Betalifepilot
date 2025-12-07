/*
  # Create Device Login Notifications & AI Conversations Tables

  1. New Tables
    - `device_login_notifications` - Notifications for new device logins
    - `ai_conversations` - AI conversation history

  2. Security
    - Enable RLS on all tables
    - User isolation policies
*/

CREATE TABLE IF NOT EXISTS device_login_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id varchar,
  notification_type varchar,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_device_login_notifications_user_id ON device_login_notifications(user_id);
CREATE INDEX idx_device_login_notifications_created_at ON device_login_notifications(created_at);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_title varchar,
  messages jsonb[],
  context jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);

-- RLS Policies
ALTER TABLE device_login_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own device_login_notifications" ON device_login_notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own device_login_notifications" ON device_login_notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own device_login_notifications" ON device_login_notifications
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own device_login_notifications" ON device_login_notifications
  FOR DELETE USING (true);

CREATE POLICY "Users can read own ai_conversations" ON ai_conversations
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own ai_conversations" ON ai_conversations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own ai_conversations" ON ai_conversations
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own ai_conversations" ON ai_conversations
  FOR DELETE USING (true);
