// supabase/functions/google-oauth-start/index.ts
// MIO – startet den Google-OAuth-Flow. Authentifiziert den Nutzer über die
// MIO-Custom-Session, legt einen one-time `oauth_states`-Eintrag an und leitet
// zu Google weiter. Browser-Redirect → deploy mit --no-verify-jwt.
//
// Session-Modell (EMPIRISCH verifiziert 2026-06-14):
//   Plaintext-Session-Token --SHA-256(hex)--> user_devices.session_token_hash --> user_id.
// Token-Übergabe: Authorization: Bearer <session_token>  ODER  ?session_token=...  ODER JSON-Body.
//
// Benötigte Secrets: GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI, optional GOOGLE_OAUTH_SCOPES.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const DEFAULT_SCOPES = "openid email profile";

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function randomState(): string {
  const b = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function extractSessionToken(req: Request, url: URL, body: Record<string, unknown> | null): string | null {
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  const q = url.searchParams.get("session_token");
  if (q) return q;
  if (body && typeof body.session_token === "string") return body.session_token;
  return null;
}

Deno.serve(async (req) => {
  const url = new URL(req.url);
  let body: Record<string, unknown> | null = null;
  if (req.method === "POST") { try { body = await req.json(); } catch { body = null; } }

  const sessionToken = extractSessionToken(req, url, body);
  if (!sessionToken) return new Response(JSON.stringify({ error: "missing_session_token" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  // Session validieren: SHA-256(hex) gegen user_devices.session_token_hash
  const tokenHash = await sha256Hex(sessionToken);
  const { data: dev } = await sb.from("user_devices").select("user_id").eq("session_token_hash", tokenHash).single();
  if (!dev?.user_id) return new Response(JSON.stringify({ error: "invalid_session" }), { status: 401, headers: { "Content-Type": "application/json" } });

  const redirectTo = (body?.redirect_to as string) || url.searchParams.get("redirect_to") || null;

  // one-time state anlegen (CSRF + User-Mapping)
  const state = randomState();
  const { error: stErr } = await sb.from("oauth_states").insert({ state, user_id: dev.user_id, provider: "google", redirect_to: redirectTo });
  if (stErr) return new Response(JSON.stringify({ error: "state_insert_failed" }), { status: 500, headers: { "Content-Type": "application/json" } });

  // Google Authorize-URL bauen
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID") ?? "";
  const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") ?? "";
  const scopes = Deno.env.get("GOOGLE_OAUTH_SCOPES") ?? DEFAULT_SCOPES;
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("access_type", "offline"); // refresh_token erzwingen
  authUrl.searchParams.set("prompt", "consent");      // refresh_token auch bei Re-Auth
  authUrl.searchParams.set("include_granted_scopes", "true");
  authUrl.searchParams.set("state", state);

  return new Response(null, { status: 302, headers: { Location: authUrl.toString() } });
});
