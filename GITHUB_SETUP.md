# 🚀 Mio Life Pilot - GitHub Deployment Anleitung

## Schnellstart

### Automatisches Setup (Empfohlen)

1. **Setup-Script ausführen:**
   ```bash
   chmod +x setup-github.sh
   ./setup-github.sh
   ```

2. **Folge den Anweisungen im Terminal**

3. **Führe nach dem Setup aus:**
   ```bash
   git push -u origin main
   ```

---

## Manuelle Schritt-für-Schritt Anleitung

### 1️⃣ Lokales Git Repository vorbereiten

```bash
# Git initialisieren
git init
git branch -M main

# Alle Dateien hinzufügen
git add .

# Initial Commit
git commit -m "Initial commit: Mio Life Pilot v1.0.0-beta"
```

### 2️⃣ GitHub Repository erstellen

1. Gehe zu: https://github.com/new
2. Repository Name: `Betalifepilot`
3. Visibility: **Public** (für GitHub Pages)
4. ❌ **NICHT** initialisieren mit README, .gitignore oder License
5. Klicke **"Create repository"**

### 3️⃣ Supabase Secrets konfigurieren

**WICHTIG:** Diese Secrets sind für den Build-Prozess erforderlich!

1. Gehe zu deinem Repository auf GitHub
2. Klicke auf **Settings** → **Secrets and variables** → **Actions**
3. Klicke **"New repository secret"**
4. Füge folgende Secrets hinzu:

   | Name | Wert |
   |------|------|
   | `VITE_SUPABASE_URL` | Deine Supabase Project URL |
   | `VITE_SUPABASE_ANON_KEY` | Dein Supabase Anon Key |

**Wo finde ich diese Werte?**
- In deiner `.env` Datei (lokal)
- Oder im Supabase Dashboard: Project Settings → API

### 4️⃣ GitHub Pages aktivieren

1. Gehe zu: **Settings** → **Pages**
2. Bei **Source** wähle: **GitHub Actions**
3. Speichern (erfolgt automatisch)

### 5️⃣ Code zu GitHub pushen

```bash
# Remote Repository hinzufügen (ersetze DEIN-USERNAME)
git remote add origin https://github.com/DEIN-USERNAME/Betalifepilot.git

# Code hochladen
git push -u origin main
```

### 6️⃣ Deployment überprüfen

1. Gehe zum **Actions** Tab in deinem Repository
2. Du solltest einen laufenden Workflow sehen
3. Warte bis der Workflow abgeschlossen ist (✅ grünes Häkchen)
4. Deine App ist jetzt live unter:
   ```
   https://DEIN-USERNAME.github.io/Betalifepilot/
   ```

---

## 🔄 Updates deployen

Nach dem initialen Setup kannst du Updates einfach pushen:

```bash
# Änderungen hinzufügen
git add .

# Commit erstellen
git commit -m "Beschreibung deiner Änderungen"

# Zu GitHub pushen
git push
```

Der Deployment-Prozess startet automatisch! 🎉

---

## ⚙️ GitHub Actions Workflow

Die Datei `.github/workflows/deploy.yml` enthält den Deployment-Workflow:

- **Trigger:** Push zu `main` Branch oder manuell
- **Schritte:**
  1. Code auschecken
  2. Node.js 20 installieren
  3. Dependencies installieren (`npm ci`)
  4. Production Build erstellen (`npm run build`)
  5. Build-Artefakte zu GitHub Pages hochladen
  6. Deployment durchführen

---

## 🔒 Sicherheit

### Environment Variables

Die Supabase Keys werden als **GitHub Secrets** gespeichert und sind:
- ✅ Verschlüsselt
- ✅ Nicht im Code sichtbar
- ✅ Nur im Workflow verfügbar
- ✅ Werden zur Build-Zeit in die App eingebaut

### Wichtige Hinweise

⚠️ **Der Anon Key ist öffentlich:**
- Der `VITE_SUPABASE_ANON_KEY` wird im Frontend-Build eingebaut
- Er ist für jeden sichtbar, der deine App nutzt
- Das ist **normal und sicher**, weil:
  - Row Level Security (RLS) die Daten schützt
  - Der Anon Key nur limitierte Berechtigungen hat
  - Alle sensiblen Operationen durch RLS-Policies geschützt sind

🔐 **NIEMALS committen:**
- Service Role Key
- Private Keys
- Passwörter
- API Tokens mit erweiterten Berechtigungen

---

## 🐛 Troubleshooting

### Problem: "Repository not found" beim Push

**Lösung:**
```bash
# Prüfe Remote URL
git remote -v

# Korrigiere falls nötig
git remote set-url origin https://github.com/DEIN-USERNAME/Betalifepilot.git
```

### Problem: Build schlägt fehl (GitHub Actions)

**Lösung:**
1. Überprüfe ob alle Secrets korrekt gesetzt sind
2. Gehe zu Actions Tab → Klicke auf den fehlgeschlagenen Workflow
3. Lies die Fehlermeldung
4. Häufige Ursachen:
   - Fehlende oder falsche Supabase Secrets
   - Tippfehler in Secret-Namen
   - Ungültige Supabase Keys

### Problem: GitHub Pages zeigt 404

**Lösung:**
1. Warte 2-3 Minuten nach erfolgreichem Deployment
2. Prüfe ob GitHub Pages auf "GitHub Actions" Source eingestellt ist
3. Prüfe ob der Workflow erfolgreich durchgelaufen ist (✅)
4. Lösche Browser-Cache und versuche erneut

### Problem: "Permission denied" beim Push

**Lösung:**
- Stelle sicher, dass du als richtiger User angemeldet bist
- Nutze einen Personal Access Token (PAT) falls 2FA aktiviert ist:
  1. Gehe zu: Settings → Developer settings → Personal access tokens
  2. Generiere neuen Token mit `repo` Berechtigung
  3. Nutze Token als Passwort beim Push

---

## 📊 Build-Statistiken

Der Production Build erstellt:
- Optimierte und minimierte JavaScript Bundles
- Komprimierte CSS
- Optimierte Assets
- Source Maps für Debugging

Typische Build-Größe: **~500KB** (gzipped)

---

## 🎯 Nächste Schritte

Nach erfolgreichem Deployment:

1. ✅ Teste deine App unter der GitHub Pages URL
2. ✅ Überprüfe alle Features
3. ✅ Teste die Supabase-Verbindung
4. ✅ Prüfe Authentication-Flow
5. ✅ Teile den Link!

---

## 📞 Support

Bei Fragen oder Problemen:
- Prüfe die [GitHub Actions Logs](https://github.com/DEIN-USERNAME/Betalifepilot/actions)
- Überprüfe die [Supabase Logs](https://app.supabase.com)
- Lies die [GitHub Pages Dokumentation](https://docs.github.com/pages)

---

**Viel Erfolg mit dem Deployment! 🚀**
