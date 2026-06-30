# google-oauth-start

Startet den Google-OAuth-Flow: authentifiziert den MIO-Nutzer über die Custom-Session,
legt einen one-time `oauth_states`-Eintrag an und leitet (302) zu Google weiter.
Gegenstück: `google-oauth-callback`.

## Deploy (verify_jwt MUSS false sein)
```bash
npx supabase functions deploy google-oauth-start --no-verify-jwt --project-ref nosbsubdaqqiqktfkztz
```

## Secrets
`GOOGLE_CLIENT_ID`, `GOOGLE_REDIRECT_URI` (= URL der Callback-Function),
optional `GOOGLE_OAUTH_SCOPES` (Default: "openid email profile" – für Gmail/Kalender erweitern).

## Aufruf aus der App (eingeloggter Nutzer)
Browser zu dieser Function leiten, Session-Token mitgeben (eines von):
- Header `Authorization: Bearer <session_token>`
- Query `?session_token=<...>&redirect_to=<app-url>`
- JSON-Body `{ "session_token": "...", "redirect_to": "..." }`

Die Function antwortet mit 302 → Google-Login. Nach Zustimmung ruft Google den
`google-oauth-callback` mit `code`+`state` auf; dieser speichert die Tokens verschlüsselt.

## Sicherheit
- Session-Validierung: SHA-256(hex) des Tokens gegen `user_devices.session_token_hash` (empirisch verifiziert).
- Token nie geloggt/gespeichert (nur Hash-Vergleich). `oauth_states` ist service_role-only, kurzlebig, one-time.
