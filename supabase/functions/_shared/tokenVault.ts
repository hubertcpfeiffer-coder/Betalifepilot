// supabase/functions/_shared/tokenVault.ts
// MIO – App-Layer Token-Vault (Deno / Web Crypto). SERVER-SIDE ONLY.
//
// Speichert Google-OAuth-Tokens AES-256-GCM-verschlüsselt in user_profiles.
//  * Persistiertes BYTEA-Format:  iv(12) ‖ authTag(16) ‖ ciphertext  (kompatibel zur Node-Variante)
//  * Schlüssel: Deno.env.get('TOKEN_ENC_KEY') (base64, exakt 32 Byte). NIE im Client-Bundle.
//  * DB-Zugriff über SERVICE_ROLE (Supabase injiziert SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).
// ISO 27001 A.10 (Krypto), EU AI Act Art. 10. Nicht als eigener HTTP-Endpoint exponieren –
// von anderen Edge Functions (z. B. OAuth-Callback) importieren.

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

const IV_LEN = 12;
const TAG_LEN = 16;

let keyPromise: Promise<CryptoKey> | null = null;
function getKey(): Promise<CryptoKey> {
  if (keyPromise) return keyPromise;
  const raw = Deno.env.get("TOKEN_ENC_KEY");
  if (!raw) throw new Error("TOKEN_ENC_KEY is not set");
  const bytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
  if (bytes.length !== 32) throw new Error("TOKEN_ENC_KEY must decode to 32 bytes (AES-256)");
  keyPromise = crypto.subtle.importKey("raw", bytes, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
  return keyPromise;
}

function serviceClient(): SupabaseClient {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
  return createClient(url, key, { auth: { persistSession: false } });
}

// WebCrypto liefert ct‖tag (Tag = letzte 16 Byte). Wir persistieren iv‖tag‖ct.
async function encrypt(plain: string): Promise<Uint8Array> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const enc = new TextEncoder().encode(plain);
  const out = new Uint8Array(
    await crypto.subtle.encrypt({ name: "AES-GCM", iv, tagLength: TAG_LEN * 8 }, key, enc),
  );
  const ct = out.subarray(0, out.length - TAG_LEN);
  const tag = out.subarray(out.length - TAG_LEN);
  const blob = new Uint8Array(IV_LEN + TAG_LEN + ct.length);
  blob.set(iv, 0);
  blob.set(tag, IV_LEN);
  blob.set(ct, IV_LEN + TAG_LEN);
  return blob;
}

async function decrypt(blob: Uint8Array | null): Promise<string | null> {
  if (!blob || blob.length < IV_LEN + TAG_LEN) return null;
  const key = await getKey();
  const iv = blob.subarray(0, IV_LEN);
  const tag = blob.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ct = blob.subarray(IV_LEN + TAG_LEN);
  const webInput = new Uint8Array(ct.length + TAG_LEN);
  webInput.set(ct, 0);
  webInput.set(tag, ct.length);
  const dec = await crypto.subtle.decrypt({ name: "AES-GCM", iv, tagLength: TAG_LEN * 8 }, key, webInput);
  return new TextDecoder().decode(dec);
}

// Postgres/PostgREST BYTEA <-> hex ("\x...")
function toPgBytea(buf: Uint8Array): string {
  let hex = "";
  for (const b of buf) hex += b.toString(16).padStart(2, "0");
  return "\\x" + hex;
}
function fromPgBytea(val: string | null): Uint8Array | null {
  if (!val) return null;
  const hex = val.startsWith("\\x") ? val.slice(2) : val;
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

export interface GoogleTokens {
  refreshToken: string;
  accessToken: string;
  expiresAt: Date;
}

export async function storeGoogleTokens(userId: string, t: GoogleTokens): Promise<void> {
  const sb = serviceClient();
  const { error } = await sb.from("user_profiles").update({
    google_refresh_token_enc: toPgBytea(await encrypt(t.refreshToken)),
    google_access_token_enc: toPgBytea(await encrypt(t.accessToken)),
    google_token_expires_at: t.expiresAt.toISOString(),
  }).eq("user_id", userId);
  if (error) throw new Error(`Failed to store tokens: ${error.message}`);
}

export async function getGoogleTokens(userId: string): Promise<GoogleTokens | null> {
  const sb = serviceClient();
  const { data, error } = await sb.from("user_profiles")
    .select("google_refresh_token_enc, google_access_token_enc, google_token_expires_at")
    .eq("user_id", userId).single();
  if (error || !data?.google_refresh_token_enc) return null;
  const refreshToken = await decrypt(fromPgBytea(data.google_refresh_token_enc));
  const accessToken = await decrypt(fromPgBytea(data.google_access_token_enc));
  if (!refreshToken || !accessToken) return null;
  return { refreshToken, accessToken, expiresAt: new Date(data.google_token_expires_at) };
}

export async function refreshGoogleAccessToken(userId: string): Promise<string> {
  const t = await getGoogleTokens(userId);
  if (!t) throw new Error("No Google tokens found for user");
  if (t.expiresAt.getTime() >= Date.now() + 5 * 60 * 1000) return t.accessToken;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: Deno.env.get("GOOGLE_CLIENT_ID") ?? "",
      client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET") ?? "",
      refresh_token: t.refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google token refresh failed: ${res.statusText}`);
  const { access_token, expires_in } = await res.json();
  await storeGoogleTokens(userId, {
    refreshToken: t.refreshToken,
    accessToken: access_token,
    expiresAt: new Date(Date.now() + expires_in * 1000),
  });
  return access_token;
}

export async function revokeGoogleTokens(userId: string): Promise<void> {
  const sb = serviceClient();
  await sb.from("user_profiles").update({
    google_refresh_token_enc: null,
    google_access_token_enc: null,
    google_token_expires_at: null,
  }).eq("user_id", userId);
}
