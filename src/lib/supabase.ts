import { createClient } from '@supabase/supabase-js';

// Initialize database client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://nosbsubdaqqiqktfkztz.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_jeTTXzFXL3g1PpMuIwXUeA_tZ6DnVqq";

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing required Supabase environment variables');
}

// R-12b (Option A): Custom-Auth-RLS. Bei jedem Request den Klartext-Session-Token
// als Header `x-mio-session` mitschicken. Der PostgREST db-pre-request-Hook löst ihn
// serverseitig zu app.user_id auf; RLS filtert jede Tabelle auf den Owner.
// Kein Token -> kein Header -> RLS liefert 0 Zeilen (deny-by-default).
const mioFetch: typeof fetch = (input, init = {}) => {
  const headers = new Headers(init.headers as HeadersInit | undefined);
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('mio_session') : null;
    if (token) headers.set('x-mio-session', token);
  } catch {
    /* localStorage nicht verfügbar (SSR/Guard) – ohne Header weiter */
  }
  return fetch(input, { ...init, headers });
};

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: { fetch: mioFetch },
});

// Simple hash function for password (Note: In production, use server-side bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'mio_lifepilot_salt_2025');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate session token
export function generateSessionToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}

export { supabase };
