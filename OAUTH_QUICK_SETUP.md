# 🔐 OAuth Quick Setup Guide - Google & Apple

## ✅ Code Fix Applied

Die OAuth-Anmeldung wurde korrigiert! Der Redirect-URL verwendet jetzt den korrekten Pfad für GitHub Pages:

```
https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback
```

## 📋 Nächste Schritte für Admins

Um Google und Apple Login zu aktivieren, müssen die OAuth-Apps in den jeweiligen Developer-Portalen konfiguriert werden:

### 1️⃣ Google OAuth einrichten

#### Schritt 1: Google Cloud Console
1. Gehe zu: [Google Cloud Console](https://console.cloud.google.com/)
2. Erstelle ein neues Projekt oder wähle ein bestehendes aus
3. Navigiere zu: **APIs & Services** → **Credentials**
4. Klicke: **Create Credentials** → **OAuth client ID**
5. Wähle: **Web application**

#### Schritt 2: Redirect URIs konfigurieren
Füge diese URLs als **Authorized redirect URIs** hinzu:

```
https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback
http://localhost:8080/auth/callback
```

Optional (für zukünftige Domains):
```
https://mio-lifepilot.app/auth/callback
https://mio-lifepilot.com/auth/callback
```

#### Schritt 3: Credentials kopieren
- **Client ID** notieren
- **Client Secret** notieren
- Diese werden in Supabase benötigt

#### Schritt 4: In Supabase konfigurieren
1. Gehe zu: [Supabase Dashboard](https://app.supabase.com/)
2. Wähle dein Projekt
3. Navigiere zu: **Authentication** → **Providers**
4. Finde **Google** und aktiviere es
5. Trage ein:
   - **Client ID** (von Google)
   - **Client Secret** (von Google)
6. Klicke: **Save**

#### Schritt 5: OAuth Consent Screen
1. In Google Cloud Console: **APIs & Services** → **OAuth consent screen**
2. Wähle: **External** (für öffentliche Apps)
3. Fülle aus:
   - **App name**: Mio Life Pilot
   - **User support email**: Deine E-Mail
   - **Developer contact**: Deine E-Mail
4. Füge Scopes hinzu:
   - `email`
   - `profile`
   - `openid`
5. Speichern

---

### 2️⃣ Apple OAuth einrichten

#### Schritt 1: Apple Developer Portal
1. Gehe zu: [Apple Developer Portal](https://developer.apple.com/)
2. Navigiere zu: **Certificates, Identifiers & Profiles**

#### Schritt 2: App ID erstellen (falls nicht vorhanden)
1. Klicke: **Identifiers** → **+** (neues Identifier)
2. Wähle: **App IDs**
3. Beschreibung: `Mio Life Pilot App`
4. Bundle ID: z.B. `com.betalifepilot.mio`
5. Aktiviere: **Sign in with Apple**
6. Speichern

#### Schritt 3: Service ID erstellen
1. Klicke: **Identifiers** → **+** (neues Identifier)
2. Wähle: **Services IDs**
3. Beschreibung: `Mio Life Pilot Web`
4. Identifier: z.B. `com.betalifepilot.mio.web`
5. Aktiviere: **Sign in with Apple**
6. Klicke: **Configure**

#### Schritt 4: Domains und URLs konfigurieren
In der Service ID Konfiguration:

**Domains:**
```
hubertcpfeiffer-coder.github.io
localhost
```

**Return URLs:**
```
https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback
http://localhost:8080/auth/callback
```

Optional (für Zukunft):
```
https://mio-lifepilot.app/auth/callback
https://mio-lifepilot.com/auth/callback
```

7. Speichern

#### Schritt 5: Private Key erstellen
1. Navigiere zu: **Keys** → **+** (neuer Key)
2. Name: `Sign in with Apple Key`
3. Aktiviere: **Sign in with Apple**
4. Configure und wähle deine App ID
5. **Key herunterladen** (.p8 Datei)
   - ⚠️ **Wichtig**: Diese Datei kann nur einmal heruntergeladen werden!
6. Notiere:
   - **Key ID** (steht oben auf der Seite)
   - **Team ID** (in deinem Account unter Membership)

#### Schritt 6: In Supabase konfigurieren
1. Gehe zu: [Supabase Dashboard](https://app.supabase.com/)
2. Wähle dein Projekt
3. Navigiere zu: **Authentication** → **Providers**
4. Finde **Apple** und aktiviere es
5. Trage ein:
   - **Service ID**: (z.B. `com.betalifepilot.mio.web`)
   - **Team ID**: Aus Apple Developer Portal
   - **Key ID**: Von dem erstellten Key
   - **Private Key**: Inhalt der .p8 Datei (gesamten Text kopieren)
6. Klicke: **Save**

---

## 🧪 Testing

### Lokal testen (Development)
1. Stelle sicher, dass `.env` existiert mit:
   ```env
   VITE_SUPABASE_URL=deine_supabase_url
   VITE_SUPABASE_ANON_KEY=dein_supabase_key
   ```

2. Starte dev server:
   ```bash
   npm run dev
   ```

3. Öffne: `http://localhost:8080`

4. Klicke auf Login und wähle Google oder Apple

5. Du wirst zum Provider umgeleitet

6. Nach erfolgreicher Anmeldung kommst du zurück zur App

### Production testen
1. Gehe zu: `https://hubertcpfeiffer-coder.github.io/Betalifepilot/`

2. Klicke auf Registrieren oder Login

3. Wähle Google oder Apple Button

4. Melde dich beim Provider an

5. Du wirst zurück zur App geleitet

6. Wenn erfolgreich, solltest du eingeloggt sein

---

## 🔍 Troubleshooting

### "Redirect URI mismatch" Fehler

**Ursache:** Die Redirect-URL in der OAuth-App stimmt nicht überein

**Lösung:**
1. Prüfe, ob die URL **exakt** übereinstimmt:
   - `https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback`
2. Achte auf:
   - `https` (nicht `http` in Production)
   - Großschreibung in `Betalifepilot`
   - Kein Trailing Slash am Ende

### "OAuth not configured" Fehler

**Ursache:** Provider nicht in Supabase aktiviert oder Credentials fehlen

**Lösung:**
1. Gehe zu Supabase → Authentication → Providers
2. Stelle sicher, dass Google/Apple aktiviert ist (Toggle auf grün)
3. Prüfe, ob Client ID/Secret korrekt eingegeben sind
4. Klicke "Save"
5. Warte 1-2 Minuten bis Änderungen übernommen sind

### User wird nicht eingeloggt nach Redirect

**Ursache:** Möglicherweise Session-Problem oder Supabase-Konfiguration

**Lösung:**
1. Öffne Browser Console (F12)
2. Suche nach Fehlern
3. Prüfe Supabase Logs:
   - Gehe zu Supabase Dashboard → Logs → Auth Logs
4. Schaue nach Fehlermeldungen

### Apple "Invalid client" Fehler

**Ursache:** Service ID, Team ID, Key ID oder Private Key falsch

**Lösung:**
1. Überprüfe alle IDs noch einmal
2. Stelle sicher, dass Private Key komplett kopiert wurde (inklusive `-----BEGIN PRIVATE KEY-----` und `-----END PRIVATE KEY-----`)
3. Prüfe, ob Service ID mit "Sign in with Apple" konfiguriert ist
4. Warte nach Änderungen ein paar Minuten

---

## 📱 User Flow

### Neuer Benutzer via OAuth
1. Klickt "Mit Google/Apple fortfahren"
2. Wird zu Google/Apple weitergeleitet
3. Meldet sich an und gibt Berechtigung
4. Wird zurück zur App geleitet (`/auth/callback`)
5. Account wird automatisch erstellt
6. User wird eingeloggt
7. Onboarding-Flow startet

### Bestehender Benutzer via OAuth
1. Klickt "Mit Google/Apple fortfahren"
2. Wird zu Google/Apple weitergeleitet (oft automatisch wenn schon angemeldet)
3. Wird zurück zur App geleitet
4. User wird direkt eingeloggt
5. Zur Hauptseite weitergeleitet

---

## ✅ Checkliste

### Google Setup
- [ ] Google Cloud Projekt erstellt
- [ ] OAuth Client ID erstellt
- [ ] Redirect URIs konfiguriert (mit `/Betalifepilot/auth/callback`)
- [ ] OAuth Consent Screen ausgefüllt
- [ ] Client ID in Supabase eingetragen
- [ ] Client Secret in Supabase eingetragen
- [ ] Google Provider in Supabase aktiviert
- [ ] Lokal getestet
- [ ] Production getestet

### Apple Setup
- [ ] Apple Developer Account aktiv
- [ ] App ID erstellt
- [ ] Service ID erstellt
- [ ] Domains konfiguriert (github.io)
- [ ] Return URLs konfiguriert (mit `/Betalifepilot/auth/callback`)
- [ ] Private Key erstellt und heruntergeladen (.p8)
- [ ] Team ID notiert
- [ ] Key ID notiert
- [ ] Service ID in Supabase eingetragen
- [ ] Team ID in Supabase eingetragen
- [ ] Key ID in Supabase eingetragen
- [ ] Private Key in Supabase eingetragen
- [ ] Apple Provider in Supabase aktiviert
- [ ] Lokal getestet
- [ ] Production getestet

---

## 📖 Weitere Dokumentation

- Vollständige Setup-Anleitung: [OAUTH_SETUP.md](OAUTH_SETUP.md)
- Implementation Details: [OAUTH_IMPLEMENTATION_SUMMARY.md](OAUTH_IMPLEMENTATION_SUMMARY.md)
- Deployment Info: [LIVE_LINK.md](LIVE_LINK.md)

---

**Status:** ✅ Code fix implementiert  
**Nächster Schritt:** OAuth-Apps in Google/Apple konfigurieren  
**Letztes Update:** 10. Dezember 2024
