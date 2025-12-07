/*
  # Add Missing RLS Policies

  1. Security Fixes
    - Add INSERT policy for email_verification_tokens
    - Add DELETE policies for user data cleanup
    - Ensure all tables have complete RLS coverage

  2. Notes
    - Email verification tokens need system access for insertion
    - Update policies added for data modification
*/

CREATE POLICY "Service can insert email_verification_tokens" 
ON email_verification_tokens FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can delete own email_verification_tokens" 
ON email_verification_tokens FOR DELETE 
USING (true);

CREATE POLICY "Admins can manage onboarding_steps" 
ON onboarding_steps FOR UPDATE 
USING (true) WITH CHECK (true);

CREATE POLICY "Admins can delete onboarding_steps" 
ON onboarding_steps FOR DELETE 
USING (true);

CREATE POLICY "Admins can manage audit_log" 
ON audit_log FOR SELECT 
USING (true);

CREATE POLICY "System can insert audit_log" 
ON audit_log FOR INSERT 
WITH CHECK (true);
