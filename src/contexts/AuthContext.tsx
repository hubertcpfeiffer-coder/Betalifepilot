import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '@/types/auth';
import { supabase } from '@/lib/supabase';
import { trackError } from '@/lib/errorTracking';
import { sendVerificationEmail, checkEmailVerified } from '@/services/emailVerificationService';

// R-12: Custom-Auth über serverseitige SECURITY-DEFINER-RPCs (app_register/login/session/logout).
// Kein direkter Zugriff auf public.users (durch DB-Härtung gesperrt), kein Supabase Auth / GoTrue.

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

const SESSION_KEY = 'mio_session';

function mapUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    email: String(u.email),
    full_name: (u.full_name as string) ?? undefined,
    role: (u.role as User['role']) ?? undefined,
    status: (u.status as User['status']) ?? undefined,
    email_verified: Boolean(u.email_verified),
    onboarding_completed: Boolean(u.onboarding_completed),
  };
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, isAuthenticated: false, isLoading: true });
  const [newDeviceAlert, setNewDeviceAlert] = useState(false);
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => { checkSession(); }, []);

  const checkSession = async () => {
    const token = localStorage.getItem(SESSION_KEY);
    if (token) {
      try {
        const { data, error } = await supabase.rpc('app_session_user', { p_session_token: token });
        const res = data as any;
        if (!error && res?.ok && res.user) {
          const user = mapUser(res.user);
          setState({ user, isAuthenticated: true, isLoading: false });
          setEmailVerified(Boolean(user.email_verified));
          return;
        }
      } catch (e) { console.error('Session check failed:', e); }
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('mio_user_id');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  };

  const checkVerification = async () => {
    if (!state.user) return;
    try {
      const verified = await checkEmailVerified(state.user.id);
      setEmailVerified(verified);
    } catch { /* Folge-Ticket R-12b: Verifikations-RPC */ }
  };

  const resendVerification = async () => {
    if (!state.user) return { success: false, error: 'Nicht angemeldet' };
    return sendVerificationEmail(state.user.id, state.user.email);
  };

  const refreshUser = async () => { await checkSession(); };

  const clearNewDeviceAlert = () => setNewDeviceAlert(false);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.rpc('app_login', {
        p_email: email,
        p_password: password,
        p_device_id: 'web',
        p_device_name: navigator.userAgent,
      });
      const res = data as any;
      if (error) return { success: false, error: 'Anmeldung fehlgeschlagen' };
      if (!res?.ok) {
        return {
          success: false,
          error: res?.error === 'invalid_credentials' ? 'E-Mail oder Passwort ist falsch' : 'Anmeldung fehlgeschlagen',
        };
      }
      localStorage.setItem(SESSION_KEY, res.session_token);
      const user = mapUser(res.user);
      setState({ user, isAuthenticated: true, isLoading: false });
      setEmailVerified(Boolean(user.email_verified));
      return { success: true, isNewDevice: false };
    } catch (e) {
      trackError(e instanceof Error ? e : new Error(String(e)), { component: 'AuthContext', action: 'login' });
      return { success: false, error: 'Anmeldung fehlgeschlagen' };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.rpc('app_register', {
        p_email: email,
        p_password: password,
        p_full_name: fullName,
      });
      const reg = data as any;
      if (error) return { success: false, error: 'Registrierung fehlgeschlagen' };
      if (!reg?.ok) {
        const map: Record<string, string> = {
          email_exists: 'Diese E-Mail ist bereits registriert',
          weak_password: 'Passwort zu kurz (mindestens 8 Zeichen)',
          invalid_email: 'Ungültige E-Mail-Adresse',
        };
        return { success: false, error: map[reg?.error] || 'Registrierung fehlgeschlagen' };
      }
      // Nach erfolgreicher Registrierung direkt einloggen (Session erstellen)
      const loginRes = await login(email, password);
      if (!loginRes.success) return { success: false, error: loginRes.error };
      return { success: true, isNewUser: true };
    } catch (e) {
      trackError(e instanceof Error ? e : new Error(String(e)), { component: 'AuthContext', action: 'signup' });
      return { success: false, error: 'Registrierung fehlgeschlagen' };
    }
  };

  const logout = async () => {
    const token = localStorage.getItem(SESSION_KEY);
    if (token) {
      try { await supabase.rpc('app_logout', { p_session_token: token }); } catch { /* ignore */ }
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('mio_user_id');
    Object.keys(localStorage).forEach((key) => { if (key.startsWith('mio_welcome_')) localStorage.removeItem(key); });
    setState({ user: null, isAuthenticated: false, isLoading: false });
    setNewDeviceAlert(false);
    setEmailVerified(true);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!state.user) return;
    // TODO(R-12b): Persistenz über app_update_profile-RPC. Vorerst nur lokaler State.
    setState((s) => ({ ...s, user: s.user ? { ...s.user, ...updates } : null }));
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
      resendVerification,
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
