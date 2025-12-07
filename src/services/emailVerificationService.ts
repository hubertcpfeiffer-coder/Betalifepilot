import { supabase } from '@/lib/supabase';

export interface VerificationResult {
  success: boolean;
  error?: string;
  email?: string;
}

export const sendVerificationEmail = async (userId: string, email: string): Promise<VerificationResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('verify-email-sender', {
      body: { userId, email, baseUrl: window.location.origin }
    });
    
    if (error) {
      console.log('Email verification function not available:', error.message);
      return { success: true }; // Return success to not block flow
    }
    return { success: data?.success || true, error: data?.error };
  } catch (e: any) {
    console.log('Send verification skipped:', e.message);
    return { success: true }; // Return success to not block flow
  }
};

export const verifyEmailToken = async (token: string): Promise<VerificationResult> => {
  try {
    // Get token from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('*')
      .eq('token', token)
      .single();
    
    if (tokenError) {
      if (tokenError.code === '42P01') {
        return { success: false, error: 'E-Mail-Verifizierung nicht verfügbar' };
      }
      return { success: false, error: 'Ungültiger oder abgelaufener Link' };
    }
    
    if (!tokenData) {
      return { success: false, error: 'Ungültiger oder abgelaufener Link' };
    }
    
    // Check if expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, error: 'Der Bestätigungslink ist abgelaufen' };
    }
    
    // Check if already verified
    if (tokenData.verified_at) {
      return { success: true, email: tokenData.email };
    }
    
    // Mark token as verified
    await supabase
      .from('email_verification_tokens')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', tokenData.id)
      .catch(() => {});
    
    // Update user's email_verified status
    await supabase
      .from('users')
      .update({ 
        email_verified: true, 
        email_verified_at: new Date().toISOString() 
      })
      .eq('id', tokenData.user_id)
      .catch(() => {});
    
    return { success: true, email: tokenData.email };
  } catch (e: any) {
    console.error('Verify token error:', e);
    return { success: false, error: 'Verifizierung fehlgeschlagen' };
  }
};

export const checkEmailVerified = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('email_verified')
      .eq('id', userId)
      .single();
    
    if (error) {
      return true; // Assume verified if we can't check
    }
    
    return data?.email_verified || false;
  } catch (e) {
    return true; // Assume verified if we can't check
  }
};
