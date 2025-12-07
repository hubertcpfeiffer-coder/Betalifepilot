# 🚀 Mio Life Pilot - Schnellstart

## Automatisches GitHub Deployment in 3 Schritten

### Schritt 1: Setup-Script ausführen

```bash
./setup-github.sh
```

Das Script wird dich nach deinem GitHub Benutzernamen fragen und alles vorbereiten.

### Schritt 2: Repository auf GitHub erstellen

1. Öffne: https://github.com/new
2. Repository Name: `Betalifepilot`
3. Visibility: **Public**
4. ❌ NICHT initialisieren mit README, .gitignore oder License
5. Klicke **"Create repository"**

### Schritt 3: Secrets konfigurieren

Um deine Supabase Keys anzuzeigen:

```bash
./show-secrets.sh
```

Dann:
1. Gehe zu: `https://github.com/DEIN-USERNAME/Betalifepilot/settings/secrets/actions`
2. Klicke **"New repository secret"**
3. Füge beide Secrets hinzu (Name und Wert von show-secrets.sh kopieren)

### Schritt 4: Pages aktivieren

1. Gehe zu: `https://github.com/DEIN-USERNAME/Betalifepilot/settings/pages`
2. Source: **GitHub Actions** auswählen

### Schritt 5: Code hochladen

```bash
git push -u origin main
```

**Fertig!** 🎉

Deine App wird automatisch gebaut und deployed.

Nach 2-3 Minuten ist sie verfügbar unter:
```
https://DEIN-USERNAME.github.io/Betalifepilot/
```

---

## 🛠️ Zusätzliche Befehle

### Build lokal testen
```bash
./test-build.sh
```

### Secrets anzeigen
```bash
./show-secrets.sh
```

### Updates deployen
```bash
git add .
git commit -m "Beschreibung"
git push
```

---

## 📚 Ausführliche Dokumentation

Für detaillierte Informationen siehe: [GITHUB_SETUP.md](GITHUB_SETUP.md)

---

## ⚡ Projekt lokal entwickeln

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build
```

Die App läuft dann auf: http://localhost:5173

---

**Viel Erfolg! 🚀**
