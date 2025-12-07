import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { supabase, hashPassword, verifyPassword, generateSessionToken } from '@/lib/supabase';
import { registerDevice, getNewDeviceNotifications } from '@/services/deviceService';
import { trackError } from '@/lib/errorTracking';
import { sendVerificationEmail, checkEmailVerified } from '@/services/emailVerificationService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; isNewDevice?: boolean }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string; isNewUser?: boolean }>;
  logout: () => void;
  updateUser: (user: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  newDeviceAlert: boolean;
  clearNewDeviceAlert: () => void;
  emailVerified: boolean;
  checkVerification: () => Promise<void>;
  resendVerification: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });
  const [newDeviceAlert, setNewDeviceAlert] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => { checkSession(); }, []);

  const checkSession = async () => {
    const sessionToken = localStorage.getItem('mio_session');
    const userId = localStorage.getItem('mio_user_id');
    if (sessionToken && userId) {
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
        if (data && !error) {
          const { password_hash, ...safeUser } = data;
          setState({ user: safeUser as User, isAuthenticated: true, isLoading: false });
          setEmailVerified(data.email_verified || false);
          const notifications = await getNewDeviceNotifications(userId);
          if (notifications.length > 0) setNewDeviceAlert(true);
          return;
        }
      } catch (e) { console.error('Session check failed:', e); }
    }
    localStorage.removeItem('mio_session');
    localStorage.removeItem('mio_user_id');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const checkVerification = async () => {
    if (!state.user) return;
    const verified = await checkEmailVerified(state.user.id);
    setEmailVerified(verified);
  };

  const resendVerification = async () => {
    if (!state.user) return { success: false, error: 'Nicht angemeldet' };
    return sendVerificationEmail(state.user.id, state.user.email);
  };

  const refreshUser = async () => {
    const userId = localStorage.getItem('mio_user_id');
    if (!userId) return;
    try {
      const { data } = await supabase.from('users').select('*').eq('id', userId).single();
      if (data) {
        const { password_hash, ...safeUser } = data;
        setState(s => ({ ...s, user: safeUser as User }));
        setEmailVerified(data.email_verified || false);
      }
    } catch (e) { console.error('Refresh error:', e); }
  };

  const clearNewDeviceAlert = () => setNewDeviceAlert(false);

  const login = async (email: string, password: string) => {
    try {
      const { data: user, error } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).single();
      if (error || !user) return { success: false, error: 'Benutzer nicht gefunden' };
      const isValid = await verifyPassword(password, user.password_hash);
      if (!isValid) return { success: false, error: 'Falsches Passwort' };
      const sessionToken = generateSessionToken();
      localStorage.setItem('mio_session', sessionToken);
      localStorage.setItem('mio_user_id', user.id);
      const { isNewDevice } = await registerDevice(user.id, sessionToken);
      if (isNewDevice) setNewDeviceAlert(true);
      await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id).catch(() => {});
      const { password_hash, ...safeUser } = user;
      setState({ user: safeUser as User, isAuthenticated: true, isLoading: false });
      setEmailVerified(user.email_verified || false);
      return { success: true, isNewDevice };
    } catch (e: any) {
      trackError(e instanceof Error ? e : new Error(String(e)), { component: 'AuthContext', action: 'login' });
      return { success: false, error: 'Anmeldung fehlgeschlagen' };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Starting signup for:', email);
      
      // Check if email already exists
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('email', email.toLowerCase())
        .maybeSingle();
      
      if (existing) {
        return { success: false, error: 'Diese E-Mail ist bereits registriert' };
      }

      // Hash password
      const passwordHash = await hashPassword(password);
      const userId = crypto.randomUUID();
      const now = new Date().toISOString();
      
      console.log('Creating user with ID:', userId);
      
      // Create user with only essential fields that definitely exist
      const { error: insertError } = await supabase.from('users').insert({
        id: userId, 
        email: email.toLowerCase(), 
        password_hash: passwordHash, 
        full_name: fullName,
        email_verified: false, 
        created_at: now, 
        updated_at: now, 
        last_login: now,
        role: 'beta_tester', 
        status: 'pending_review', 
        is_beta_tester: true, 
        onboarding_completed: false
      });
      
      if (insertError) {
        console.error('User insert error:', insertError);
        return { success: false, error: `Registrierung fehlgeschlagen: ${insertError.message}` };
      }
      
      console.log('User created successfully');
      
      // Create user_profiles record (new table)
      await supabase.from('user_profiles').insert({
        user_id: userId,
        display_name: fullName,
        avatar_setup_completed: false,
        avatar_photos: [],
        avatar_style_preferences: {},
        language: 'de',
        onboarding_completed: false,
        total_reward_points: 0
      }).catch(e => {
        console.log('user_profiles creation skipped:', e.message);
      });
      
      // Create user_avatars record (new table)
      await supabase.from('user_avatars').insert({
        user_id: userId,
        photo_urls: [],
        avatar_style: 'realistic',
        voice_style: 'friendly',
        personality_traits: ['Hilfsbereit', 'Freundlich'],
        speaking_style: 'casual',
        clothing_style: 'casual',
        background_style: 'gradient',
        accessories: [],
        custom_colors: {},
        is_active: true
      }).catch(e => {
        console.log('user_avatars creation skipped:', e.message);
      });
      
      // Create user_settings (optional, don't block on failure)
      await supabase.from('user_settings').insert({ 
        user_id: userId, 
        notifications_enabled: true, 
        email_notifications: true, 
        theme: 'light', 
        language: 'de' 
      }).catch(e => {
        console.log('user_settings creation skipped:', e.message);
      });
      
      // Create user_knowledge_profiles (optional)
      await supabase.from('user_knowledge_profiles').insert({ 
        user_id: userId 
      }).catch(e => {
        console.log('user_knowledge_profiles creation skipped:', e.message);
      });
      
      // Create iq_profiles (optional)
      await supabase.from('iq_profiles').insert({ 
        user_id: userId 
      }).catch(e => {
        console.log('iq_profiles creation skipped:', e.message);
      });
      
      // Create mio_profiles (optional)
      await supabase.from('mio_profiles').insert({ 
        user_id: userId 
      }).catch(e => {
        console.log('mio_profiles creation skipped:', e.message);
      });
      
      // Initialize onboarding progress (optional)
      try {
        const { initializeOnboarding } = await import('@/services/onboardingService');
        await initializeOnboarding(userId);
        console.log('Onboarding initialized');
      } catch (e: any) {
        console.log('Onboarding init skipped:', e.message);
      }
      
      // Set session
      const sessionToken = generateSessionToken();
      localStorage.setItem('mio_session', sessionToken);
      localStorage.setItem('mio_user_id', userId);
      
      // Register device (optional)
      await registerDevice(userId, sessionToken).catch(e => {
        console.log('Device registration skipped:', e.message);
      });
      
      // Send verification email (optional, don't wait)
      sendVerificationEmail(userId, email.toLowerCase()).catch(e => {
        console.log('Verification email skipped:', e.message);
      });
      
      console.log('Signup completed successfully');
      
      // Set state
      setState({ 
        user: { 
          id: userId, 
          email: email.toLowerCase(), 
          full_name: fullName, 
          created_at: now, 
          role: 'beta_tester', 
          status: 'pending_review', 
          is_beta_tester: true,
          avatar_setup_completed: false
        }, 
        isAuthenticated: true, 
        isLoading: false 
      });
      setEmailVerified(false);
      
      return { success: true, isNewUser: true };
    } catch (e: any) {
      console.error('Signup error:', e);
      trackError(e instanceof Error ? e : new Error(String(e)), { component: 'AuthContext', action: 'signup' });
      return { success: false, error: e.message || 'Registrierung fehlgeschlagen' };
    }
  };


  const logout = () => {
    localStorage.removeItem('mio_session');
    localStorage.removeItem('mio_user_id');
    Object.keys(localStorage).forEach(key => { 
      if (key.startsWith('mio_welcome_')) localStorage.removeItem(key); 
    });
    setState({ user: null, isAuthenticated: false, isLoading: false });
    setNewDeviceAlert(false);
    setEmailVerified(true);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!state.user) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', state.user.id);
      if (!error) {
        setState(s => ({ ...s, user: s.user ? { ...s.user, ...updates } : null }));
      }
    } catch (e) { 
      console.error('Update error:', e); 
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      signup, 
      logout, 
      updateUser, 
      refreshUser, 
      newDeviceAlert, 
      clearNewDeviceAlert, 
      emailVerified, 
      checkVerification, 
      resendVerification 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
