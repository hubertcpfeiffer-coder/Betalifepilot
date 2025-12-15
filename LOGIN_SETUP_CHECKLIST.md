# ✅ Login & Authentifizierung - Setup Checkliste

Diese Checkliste hilft dir sicherzustellen, dass alle notwendigen Komponenten für einen funktionierenden Login und Datenverarbeitung korrekt eingerichtet sind.

## 📝 Schnell-Checkliste

### Lokale Entwicklung

- [ ] **Node.js 18+** installiert
- [ ] **Repository** geklont
- [ ] **Dependencies** installiert (`npm install`)
- [ ] **Supabase Projekt** erstellt
- [ ] **`.env` Datei** erstellt (von `.env.example` kopiert)
- [ ] **Supabase URL** in `.env` eingetragen
- [ ] **Supabase Anon Key** in `.env` eingetragen
- [ ] **Datenbank Migrationen** ausgeführt
- [ ] **Dev Server** läuft (`npm run dev`)
- [ ] **Login mit Email/Passwort** funktioniert

### Production Deployment (GitHub Pages)

- [ ] **GitHub Secrets** gesetzt:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] **GitHub Actions Workflow** aktiviert
- [ ] **GitHub Pages** konfiguriert (Source: GitHub Actions)
- [ ] **Build** erfolgreich durchgelaufen
- [ ] **Live Link** funktioniert: https://hubertcpfeiffer-coder.github.io/Betalifepilot/

### OAuth Social Login (Optional)

#### Google Login
- [ ] **Google Cloud Projekt** erstellt
- [ ] **OAuth Client ID** erstellt
- [ ] **Redirect URIs** konfiguriert:
  - Development: `http://localhost:8080/auth/callback`
  - Production: `https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback`
- [ ] **OAuth Consent Screen** konfiguriert
- [ ] **Scopes** hinzugefügt (email, profile, openid)
- [ ] **Client ID** in Supabase eingetragen
- [ ] **Client Secret** in Supabase eingetragen
- [ ] **Google Provider** in Supabase aktiviert
- [ ] **Login mit Google** getestet

#### Apple Login
- [ ] **Apple Developer Account** vorhanden
- [ ] **App ID** erstellt
- [ ] **Service ID** erstellt
- [ ] **Domains** konfiguriert
- [ ] **Return URLs** konfiguriert:
  - Development: `http://localhost:8080/auth/callback`
  - Production: `https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback`
- [ ] **Private Key (.p8)** erstellt und heruntergeladen
- [ ] **Team ID** notiert
- [ ] **Key ID** notiert
- [ ] **Service ID** in Supabase eingetragen
- [ ] **Team ID** in Supabase eingetragen
- [ ] **Key ID** in Supabase eingetragen
- [ ] **Private Key** in Supabase eingetragen
- [ ] **Apple Provider** in Supabase aktiviert
- [ ] **Login mit Apple** getestet

## 🔗 Was ist für einen funktionierenden Login-Link notwendig?

### Minimum-Anforderungen (Email/Passwort)

Damit Login und Datenverarbeitung funktionieren, braucht man mindestens:

1. ✅ **Supabase Projekt** mit konfigurierten Credentials
2. ✅ **Environment Variables** (`.env` oder GitHub Secrets)
3. ✅ **Datenbank-Schema** (via Migrationen eingespielt)
4. ✅ **Korrekte Base Path** Konfiguration (`/Betalifepilot/` für Production)
5. ✅ **Auth Callback Route** (`/auth/callback` in App.tsx)

### Zusätzlich für OAuth Social Login

6. ⚙️ **OAuth Provider** konfiguriert (Google/Apple/etc.)
7. ⚙️ **Redirect URLs** in Provider Settings
8. ⚙️ **Provider Credentials** in Supabase eingetragen
9. ⚙️ **Provider aktiviert** in Supabase Auth Settings

## 🎯 Wo wird was konfiguriert?

### Code (bereits implementiert ✅)

| Was | Wo | Status |
|-----|-----|--------|
| Auth Context | `src/contexts/AuthContext.tsx` | ✅ Implementiert |
| OAuth Redirect URL | `AuthContext.tsx` Zeile 389 | ✅ Korrekt konfiguriert |
| Auth Callback Route | `src/App.tsx` Zeile 30 | ✅ Vorhanden |
| Auth Callback Page | `src/pages/AuthCallback.tsx` | ✅ Implementiert |
| Login Form | `src/components/auth/LoginForm.tsx` | ✅ Implementiert |
| Signup Form | `src/components/auth/SignupForm.tsx` | ✅ Implementiert |
| Social Login Buttons | `src/components/auth/SocialLoginButtons.tsx` | ✅ Implementiert |
| Base Path (Production) | `vite.config.ts` Zeile 7 | ✅ `/Betalifepilot/` |
| Router Basename | `src/App.tsx` Zeile 16 | ✅ Korrekt |

### Konfiguration (muss eingerichtet werden ⚙️)

| Was | Wo | Anleitung |
|-----|-----|-----------|
| Supabase URL | `.env` oder GitHub Secrets | [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) |
| Supabase Anon Key | `.env` oder GitHub Secrets | [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) |
| Datenbank Schema | Supabase Dashboard oder CLI | [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md) |
| Google OAuth | Google Cloud Console | [OAUTH_SETUP.md](OAUTH_SETUP.md) |
| Apple OAuth | Apple Developer Portal | [OAUTH_SETUP.md](OAUTH_SETUP.md) |
| Supabase Auth Providers | Supabase Dashboard → Auth | [OAUTH_QUICK_SETUP.md](OAUTH_QUICK_SETUP.md) |

## 🚀 Nächste Schritte

### Für Entwickler (Lokale Entwicklung)

1. Folge der **kompletten Anleitung**: [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
2. Erstelle `.env` mit deinen Supabase Credentials
3. Führe Datenbank-Migrationen aus
4. Starte Dev Server: `npm run dev`
5. Teste Login: http://localhost:8080

### Für OAuth Setup (Optional)

1. Folge der **OAuth Anleitung**: [OAUTH_SETUP.md](OAUTH_SETUP.md)
2. Oder nutze die **Schnellanleitung**: [OAUTH_QUICK_SETUP.md](OAUTH_QUICK_SETUP.md)
3. Konfiguriere gewünschte Provider (Google, Apple, etc.)
4. Teste Social Login

### Für Production Deployment

1. Setze **GitHub Secrets** (siehe [DEPLOYMENT.md](DEPLOYMENT.md))
2. Konfiguriere **OAuth Redirect URLs** für Production
3. Push zu `main` Branch
4. Warte auf GitHub Actions Build (2-3 Minuten)
5. Teste Live Link: https://hubertcpfeiffer-coder.github.io/Betalifepilot/

## ❓ Häufige Fragen

### "Wo ist der Link zum Anmelden?"

Der Login-Link ist die deployed Anwendung selbst:
- **Production**: https://hubertcpfeiffer-coder.github.io/Betalifepilot/
- **Development**: http://localhost:8080

Auf der Startseite gibt es Buttons für:
- "Registrieren" (Signup)
- "Anmelden" (Login)

### "Warum funktioniert der Login nicht?"

Prüfe diese Punkte:

1. ✅ Sind Supabase Credentials korrekt in `.env` oder GitHub Secrets?
2. ✅ Sind die Datenbank-Migrationen ausgeführt?
3. ✅ Ist der Dev Server neu gestartet nach `.env` Änderungen?
4. ✅ Gibt es Fehler in der Browser Console (F12)?
5. ✅ Ist das Supabase Projekt aktiv und erreichbar?

### "Warum funktioniert OAuth nicht?"

OAuth benötigt zusätzliche Konfiguration:

1. ⚙️ Provider (Google/Apple) muss in Developer Console eingerichtet sein
2. ⚙️ Redirect URLs müssen exakt übereinstimmen
3. ⚙️ Provider muss in Supabase aktiviert sein
4. ⚙️ Credentials müssen in Supabase eingetragen sein

**Lösung**: Folge [OAUTH_SETUP.md](OAUTH_SETUP.md) Schritt für Schritt

### "Wo wird die Redirect URL konfiguriert?"

Die Redirect URL wird an **mehreren Stellen** benötigt:

1. **Im Code** (bereits korrekt ✅):
   - `src/contexts/AuthContext.tsx` Zeile 389
   - Generiert automatisch: `${window.location.origin}${basename}/auth/callback`

2. **In OAuth Provider Settings** (muss konfiguriert werden ⚙️):
   - Google Cloud Console → OAuth Client → Redirect URIs
   - Apple Developer Portal → Service ID → Return URLs

3. **In Supabase** (automatisch von Supabase Auth verwaltet):
   - Wird aus OAuth Provider Settings übernommen

## 📚 Weiterführende Dokumentation

- 🛠️ **Entwicklungsumgebung**: [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md)
- 🔐 **OAuth Setup**: [OAUTH_SETUP.md](OAUTH_SETUP.md)
- 🚀 **OAuth Schnellstart**: [OAUTH_QUICK_SETUP.md](OAUTH_QUICK_SETUP.md)
- 📡 **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)
- 🌐 **Live Link Info**: [LIVE_LINK.md](LIVE_LINK.md)
- 👥 **Beta Tester Guide**: [BETA_TESTER_GUIDE.md](BETA_TESTER_GUIDE.md)

---

**Status der Implementierung**: ✅ Code vollständig implementiert  
**Erforderliche Aktion**: ⚙️ Konfiguration von Supabase und OAuth Providern  
**Letzte Aktualisierung**: 15. Dezember 2024
