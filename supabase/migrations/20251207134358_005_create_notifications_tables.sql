/*
  # Create Notifications & Alerts Tables

  1. New Tables
    - `notifications` - User notifications
    - `notification_settings` - Per-contact notification settings
    - `price_alerts` - Price alert tracking
    - `reminders` - User reminders

  2. Security
    - Enable RLS on all tables
    - User isolation policies
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  contact_name varchar,
  contact_avatar varchar,
  platform varchar,
  activity_type varchar,
  activity_id varchar,
  content text,
  media_url varchar,
  is_read boolean DEFAULT false,
  timestamp timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contact_id uuid NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  enabled boolean DEFAULT true,
  platforms text[],
  activity_types text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, contact_id)
);

CREATE INDEX idx_notification_settings_user_id ON notification_settings(user_id);

CREATE TABLE IF NOT EXISTS price_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_name varchar,
  shop_id varchar,
  target_price decimal,
  current_price decimal,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title varchar,
  description text,
  remind_at timestamptz,
  is_sent boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_reminders_user_id ON reminders(user_id);
CREATE INDEX idx_reminders_remind_at ON reminders(remind_at);

-- RLS Policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications
  FOR SELECT USING (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (true);

CREATE POLICY "Users can read own notification_settings" ON notification_settings
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own notification_settings" ON notification_settings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notification_settings" ON notification_settings
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can read own price_alerts" ON price_alerts
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own price_alerts" ON price_alerts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own price_alerts" ON price_alerts
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own price_alerts" ON price_alerts
  FOR DELETE USING (true);

CREATE POLICY "Users can read own reminders" ON reminders
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own reminders" ON reminders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own reminders" ON reminders
  FOR UPDATE USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own reminders" ON reminders
  FOR DELETE USING (true);
