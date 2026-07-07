import { supabase } from '@/lib/supabase';

// MIO WP-3: Echte Google-Kalender-Integration (Frontend-Client).
// - startGoogleConnect(): Browser-Redirect in den OAuth-Flow (google-oauth-start, R-01).
// - getCalendarEvents(): liest die naechsten Termine ueber die Edge Function google-calendar.
// Der MIO-Session-Token wird als x-mio-session-Header (global in supabase.ts) UND im Body mitgeschickt.

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://nosbsubdaqqiqktfkztz.supabase.co';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_jeTTXzFXL3g1PpMuIwXUeA_tZ6DnVqq';

export interface CalendarEvent {
  id: string;
  summary: string;
  start: string | null;
  end: string | null;
  location: string | null;
  allDay: boolean;
}

export interface CalendarResult {
  connected: boolean;
  events: CalendarEvent[];
  error?: string;
}

// Startet den Google-OAuth-Flow. google-oauth-start validiert die MIO-Session,
// legt einen one-time state an und leitet zu Google weiter; nach Consent kommt der
// Nutzer via google-oauth-callback mit ?google=connected zurueck.
export function startGoogleConnect(): void {
  const token = localStorage.getItem('mio_session');
  if (!token) {
    // Sollte nach Login immer vorhanden sein.
    console.warn('[google] kein mio_session-Token – bitte erneut anmelden');
    return;
  }
  const redirectTo = window.location.origin + window.location.pathname;
  const url =
    `${SUPABASE_URL}/functions/v1/google-oauth-start` +
    `?session_token=${encodeURIComponent(token)}` +
    `&redirect_to=${encodeURIComponent(redirectTo)}` +
    `&apikey=${encodeURIComponent(ANON_KEY)}`;
  window.location.href = url;
}

// Liest die naechsten Kalendertermine. connected=false, wenn Google (noch) nicht verbunden ist.
export async function getCalendarEvents(): Promise<CalendarResult> {
  try {
    const token = localStorage.getItem('mio_session') || '';
    const { data, error } = await supabase.functions.invoke('google-calendar', {
      body: { session_token: token },
    });
    if (error) return { connected: false, events: [], error: error.message };
    return {
      connected: !!(data as any)?.connected,
      events: ((data as any)?.events ?? []) as CalendarEvent[],
      error: (data as any)?.error,
    };
  } catch (e) {
    return { connected: false, events: [], error: String(e) };
  }
}

// Liest ?google=connected|error aus der URL (nach dem OAuth-Rücksprung) und säubert die URL.
export function readGoogleReturnStatus(): 'connected' | 'error' | null {
  const params = new URLSearchParams(window.location.search);
  const g = params.get('google');
  if (g === 'connected' || g === 'error') {
    params.delete('google');
    params.delete('reason');
    const clean = window.location.pathname + (params.toString() ? `?${params}` : '') + window.location.hash;
    window.history.replaceState({}, '', clean);
    return g;
  }
  return null;
}
