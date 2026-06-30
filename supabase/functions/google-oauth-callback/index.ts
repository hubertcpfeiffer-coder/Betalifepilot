// supabase/functions/google-oauth-callback/index.ts
// MIO – Google OAuth Callback. Tauscht den Authorization-Code gegen Tokens und
// speichert sie verschlüsselt über den Token-Vault. Browser-Redirect-Ziel → verify_jwt MUSS false sein.
//
// Sicherheit:
//  * CSRF/User-Zuordnung über one-time `oauth_states` (unguessable state, expires_at, service_role-only).
//  * Tokens nie in URL/Logs; Speicherung AES-256-GCM via _shared/tokenVault.ts.
// Voraussetzungen (Supabase-Secrets): GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, TOKEN_ENC_KEY.

import { storeGoogleTokens } from "../_shared/tokenVault.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const APP_DEFAULT_REDIRECT = "https://hubertcpfeiffer-coder.github.io/Betalifepilot/";

function redirect(to: string, params: Record<string, string> = {}): Response {
  const url = new URL(to);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return new Response(null, { status: 302, headers: { Location: url.toString() } });
}

Deno.serve(async (req) => {
  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  const state = u.searchParams.get("state");
  const oauthErr = u.searchParams.get("error");
  if (oauthErr) return redirect(APP_DEFAULT_REDIRECT, { google: "error", reason: oauthErr });
  if (!code || !state) return redirect(APP_DEFAULT_REDIRECT, { google: "error", reason: "missing_code_or_state" });

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // CSRF + User-Lookup (one-time, darf nicht abgelaufen sein)
  const { data: st } = await sb.from("oauth_states")
    .select("user_id, redirect_to, expires_at").eq("state", state).single();
  if (!st) return redirect(APP_DEFAULT_REDIRECT, { google: "error", reason: "invalid_state" });
  await sb.from("oauth_states").delete().eq("state", state); // one-time use
  if (new Date(st.expires_at).getTime() < Date.now()) {
    return redirect(APP_DEFAULT_REDIRECT, { google: "error", reason: "state_expired" });
  }
  const dest = st.redirect_to || APP_DEFAULT_REDIRECT;

  // Authorization-Code -> Tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
      redirect_uri: Deno.env.get("GOOGLE_REDIRECT_URI") ?? "",
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) return redirect(dest, { google: "error", reason: "token_exchange_failed" });
  const tok = await tokenRes.json();
  // refresh_token kommt nur bei access_type=offline & prompt=consent (Erst-Einwilligung)
  if (!tok.refresh_token) return redirect(dest, { google: "error", reason: "no_refresh_token" });

  await storeGoogleTokens(st.user_id, {
    refreshToken: tok.refresh_token,
    accessToken: tok.access_token,
    expiresAt: new Date(Date.now() + (tok.expires_in ?? 3600) * 1000),
  });

  return redirect(dest, { google: "connected" });
});
