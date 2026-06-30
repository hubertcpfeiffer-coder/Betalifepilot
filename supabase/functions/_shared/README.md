# _shared/tokenVault.ts — App-Layer Token-Vault (Deno)

**Server-side only.** Verschlüsselt Google-OAuth-Tokens (AES-256-GCM) und legt sie in
`user_profiles.google_*_token_enc` ab. Kein eigener HTTP-Endpoint — von anderen Edge
Functions importieren (z. B. OAuth-Callback):

```ts
import { storeGoogleTokens, getGoogleTokens, refreshGoogleAccessToken, revokeGoogleTokens }
  from "../_shared/tokenVault.ts";
```

## Benötigte Secrets (Supabase)
- `TOKEN_ENC_KEY` — base64, **32 Byte** (AES-256). `supabase secrets set TOKEN_ENC_KEY=…`
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — von Supabase automatisch injiziert.
- (für Refresh) `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## Format / Interop
Persistiert als BYTEA: `iv(12) ‖ authTag(16) ‖ ciphertext` — identisch zur Node-Referenz,
DB-Blobs sind zwischen beiden lesbar. Verifiziert: Round-Trip + Tamper-Detection (Node-WebCrypto).

## Deploy
Shared-Code wird mit der importierenden Function deployt:
`npx supabase functions deploy <function-die-tokenVault-nutzt> --project-ref nosbsubdaqqiqktfkztz`

## Sicherheit
- Schlüssel nie in DB/Repo/Client. Bei Key-Verlust sind Tokens unlesbar → Recovery (R-07).
- `user_profiles` ist service_role-only (RLS + REVOKE, MIO-009). Vault nutzt SERVICE_ROLE_KEY.
