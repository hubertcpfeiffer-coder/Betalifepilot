# google-oauth-callback

Tauscht den Google-OAuth-Code gegen Tokens und speichert sie verschlüsselt (Token-Vault).

## Deploy (verify_jwt MUSS false sein – Browser-Redirect)
```bash
npx supabase functions deploy google-oauth-callback --no-verify-jwt --project-ref nosbsubdaqqiqktfkztz
```

## Benötigte Secrets
`TOKEN_ENC_KEY` (gesetzt), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
(= die öffentliche URL DIESER Function, exakt so in der Google Cloud Console als Redirect-URI eintragen:
`https://nosbsubdaqqiqktfkztz.supabase.co/functions/v1/google-oauth-callback`).

## Flow / Voraussetzung
Beim OAuth-Start (separate kleine Function „oauth-start", Folgeschritt) wird ein Zeilen-Eintrag in
`oauth_states` (state→user_id, redirect_to, expires_at) angelegt und der Nutzer zu Google geschickt mit
`access_type=offline&prompt=consent` (sonst kein refresh_token). Dieser Callback validiert den state
(one-time, Ablauf), tauscht den Code und speichert via `storeGoogleTokens`.

DB: Tabelle `oauth_states` (Migration 0012) ist live. service_role-only.
