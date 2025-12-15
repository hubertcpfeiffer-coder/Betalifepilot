# 🛠️ Entwicklungsumgebung einrichten - Mio Life Pilot

Diese Anleitung erklärt Schritt für Schritt, wie du die Mio Life Pilot Anwendung lokal einrichtest, damit Login und Datenverarbeitung funktionieren.

## 📋 Voraussetzungen

- **Node.js 18+** und npm installiert
- **Git** für Versionskontrolle
- **Supabase Account** (kostenlos bei [supabase.com](https://supabase.com))
- **Code Editor** (z.B. VS Code)

## 🚀 Schnellstart

### 1. Repository klonen

```bash
git clone https://github.com/hubertcpfeiffer-coder/Betalifepilot.git
cd Betalifepilot
```

### 2. Dependencies installieren

```bash
npm install
```

### 3. Supabase Projekt einrichten

#### A. Neues Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle einen Account
2. Klicke auf "New Project"
3. Wähle einen Projektnamen (z.B. "mio-lifepilot-dev")
4. Wähle eine Region (am besten Europa für bessere Performance)
5. Setze ein sicheres Datenbankpasswort
6. Klicke "Create new project"

#### B. Supabase Credentials abrufen

1. In deinem Supabase Dashboard gehe zu: **Settings** → **API**
2. Kopiere die folgenden Werte:
   - **Project URL** (z.B. `https://abcdefghijklm.supabase.co`)
   - **Anon/Public Key** (beginnt mit `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

#### C. Datenbank-Schema migrieren

Die Datenbank-Migrationen befinden sich im `supabase/migrations` Verzeichnis.

**Option 1: Supabase CLI (empfohlen)**
```bash
# Supabase CLI installieren
npm install -g supabase

# Mit deinem Projekt verbinden
supabase link --project-ref YOUR_PROJECT_REF

# Migrationen ausführen
supabase db push
```

**Option 2: Manuell via SQL Editor**
1. Gehe zu deinem Supabase Dashboard → **SQL Editor**
2. Kopiere den Inhalt jeder Migrationsdatei aus `supabase/migrations` (in chronologischer Reihenfolge)
3. Führe jede Migration einzeln aus

### 4. Umgebungsvariablen konfigurieren

1. Kopiere die `.env.example` Datei zu `.env`:
   ```bash
   cp .env.example .env
   ```

2. Öffne `.env` und trage deine Supabase Credentials ein:
   ```env
   VITE_SUPABASE_URL=https://dein-projekt-id.supabase.co
   VITE_SUPABASE_ANON_KEY=dein-anon-key-hier
   ```

3. Speichere die Datei

⚠️ **Wichtig**: Die `.env` Datei ist in `.gitignore` eingetragen und wird **nicht** committet!

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung läuft jetzt unter: **http://localhost:8080**

## 🔐 Authentifizierung einrichten

### Email/Passwort Login (Standard)

Nach den obigen Schritten funktioniert Email/Passwort-Login bereits! 

**Test:**
1. Öffne http://localhost:8080
2. Klicke auf "Registrieren"
3. Gib Email, Passwort und Namen ein
4. Account wird erstellt und du wirst eingeloggt

### OAuth Social Login (Optional)

Für Google, Apple, Facebook oder GitHub Login benötigst du zusätzliche Konfiguration:

📖 **Vollständige Anleitung**: Siehe [OAUTH_SETUP.md](OAUTH_SETUP.md)  
🚀 **Schnellanleitung**: Siehe [OAUTH_QUICK_SETUP.md](OAUTH_QUICK_SETUP.md)

**Kurzübersicht:**

#### Google OAuth
1. Google Cloud Console → OAuth Client ID erstellen
2. Redirect URI hinzufügen: `http://localhost:8080/auth/callback`
3. In Supabase: Authentication → Providers → Google aktivieren
4. Client ID und Secret eingeben

#### Apple OAuth
1. Apple Developer Portal → Service ID erstellen
2. Return URL hinzufügen: `http://localhost:8080/auth/callback`
3. Private Key (.p8) herunterladen
4. In Supabase: Authentication → Providers → Apple aktivieren
5. Service ID, Team ID, Key ID und Private Key eingeben

## 📂 Projektstruktur

```
/src
  /components     - React Komponenten (UI, Forms, Layout)
  /contexts       - React Contexts (Auth, App, Realtime)
  /hooks          - Custom Hooks (useAuth, useTasks, etc.)
  /lib            - Utilities (Supabase client, helpers)
  /pages          - Seiten-Komponenten (Index, AdminDashboard)
  /services       - Business Logic (auth, tasks, notifications)
  /types          - TypeScript Typen
  /docs           - Dokumentation

/supabase
  /functions      - Edge Functions
  /migrations     - Datenbank-Migrationen

/public           - Statische Assets
```

## 🧪 Testen

### Entwicklungsserver
```bash
npm run dev        # Startet Vite dev server auf Port 8080
```

### Production Build (lokal testen)
```bash
npm run build      # Baut die Anwendung für Production
npm run preview    # Vorschau des Production Builds
```

### Linting
```bash
npm run lint       # ESLint prüfen
```

## 🔧 Häufige Probleme

### "Failed to fetch" beim Login

**Problem**: Supabase URL oder Key ist falsch  
**Lösung**: 
1. Überprüfe `.env` Datei
2. Stelle sicher, dass keine Leerzeichen in den Werten sind
3. Restart den dev server (`Ctrl+C` und `npm run dev`)

### "CORS error" beim OAuth Login

**Problem**: Redirect URL stimmt nicht überein  
**Lösung**:
1. In OAuth Provider Settings: `http://localhost:8080/auth/callback` hinzufügen
2. In Supabase Auth Settings: Gleiche URL eintragen

### "User already exists" Fehler

**Problem**: Email bereits registriert  
**Lösung**:
1. Entweder andere Email verwenden
2. Oder existierenden Account löschen via Supabase Dashboard → Authentication → Users

### Build Fehler "Cannot find module '@/...'"

**Problem**: Path alias nicht richtig konfiguriert  
**Lösung**:
1. Überprüfe `tsconfig.json` → `paths` Konfiguration
2. Überprüfe `vite.config.ts` → `resolve.alias`
3. VS Code neu starten

## 🌐 Deployment

### GitHub Pages (Production)

Das Projekt ist konfiguriert für automatisches Deployment zu GitHub Pages:

1. Push zu `main` Branch
2. GitHub Actions baut und deployed automatisch
3. Live unter: `https://hubertcpfeiffer-coder.github.io/Betalifepilot/`

📖 **Details**: Siehe [LIVE_LINK.md](LIVE_LINK.md) und [DEPLOYMENT.md](DEPLOYMENT.md)

### Wichtig für Deployment

⚠️ **Supabase Secrets in GitHub Actions**

Für Production Deployment müssen Supabase Credentials als GitHub Secrets gesetzt werden:

1. Gehe zu: Repository → Settings → Secrets and variables → Actions
2. Füge hinzu:
   - `VITE_SUPABASE_URL`: Deine Production Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Dein Production Supabase Anon Key

⚠️ **OAuth Redirect URLs für Production**

Füge diese URLs in deinen OAuth Provider Settings hinzu:
- `https://hubertcpfeiffer-coder.github.io/Betalifepilot/auth/callback`

## 📚 Weitere Dokumentation

- **Datenbank-Schema**: [docs/DATABASE_SCHEMA.md](src/docs/DATABASE_SCHEMA.md)
- **Security Guidelines**: [docs/SECURITY.md](src/docs/SECURITY.md)
- **OAuth Setup**: [OAUTH_SETUP.md](OAUTH_SETUP.md)
- **Beta Tester Guide**: [BETA_TESTER_GUIDE.md](BETA_TESTER_GUIDE.md)
- **Deployment**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🆘 Hilfe und Support

### Entwickler-Dokumentation
- Siehe `src/docs/` für technische Details
- Siehe GitHub Issues für bekannte Probleme

### Supabase Dokumentation
- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- Realtime: https://supabase.com/docs/guides/realtime

### React & TypeScript
- React 18: https://react.dev
- TypeScript: https://www.typescriptlang.org/docs/
- Vite: https://vitejs.dev

## ✅ Checkliste

Stelle sicher, dass du alle diese Schritte durchgeführt hast:

- [ ] Node.js 18+ installiert
- [ ] Repository geklont
- [ ] `npm install` ausgeführt
- [ ] Supabase Projekt erstellt
- [ ] Datenbank-Migrationen ausgeführt
- [ ] `.env` Datei mit korrekten Werten erstellt
- [ ] Dev server startet ohne Fehler (`npm run dev`)
- [ ] Registrierung mit Email/Passwort funktioniert
- [ ] Login mit Email/Passwort funktioniert
- [ ] (Optional) OAuth Provider konfiguriert

## 🎯 Nächste Schritte

Nach erfolgreicher Einrichtung:

1. **Teste die Funktionen**: Probiere Login, Tasks, Kontakte, etc.
2. **Erkunde den Code**: Schau dir `src/` Struktur an
3. **Lies die Docs**: Verstehe Database Schema und Architecture
4. **Entwickle Features**: Siehe GitHub Issues für offene Aufgaben

---

**Happy Coding! 🚀**

Bei Fragen: Erstelle ein GitHub Issue oder schau in die existierende Dokumentation.
