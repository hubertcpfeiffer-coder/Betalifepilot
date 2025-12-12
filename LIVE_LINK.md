# 🌐 Betalifepilot Live Link

## Aktueller funktionsfähiger Link

Die Beta-Version von Mio Life Pilot ist **jetzt live** und kann über diesen Link aufgerufen werden:

### 🔗 **https://hubertcpfeiffer-coder.github.io/Betalifepilot/**

---

## Was funktioniert bereits?

✅ **Automatisches Deployment via GitHub Actions**
- Bei jedem Push zum `main` Branch wird die App automatisch neu gebaut und deployed
- Build dauert ca. 2-3 Minuten
- Keine manuellen Schritte erforderlich

✅ **GitHub Pages Hosting**
- Die App wird über GitHub Pages gehostet
- Kostenlos und zuverlässig
- SSL-Verschlüsselung (HTTPS) inklusive

✅ **Korrekte Konfiguration**
- Vite base path: `/Betalifepilot/`
- React Router basename: `/Betalifepilot` (im production mode)
- 404-Handling für Single Page Application (SPA)
- Alle Assets werden korrekt geladen

---

## Deployment Status

| Komponente | Status | Beschreibung |
|------------|--------|--------------|
| GitHub Actions Workflow | ✅ Aktiv | Automatisches Build & Deploy |
| GitHub Pages | ✅ Konfiguriert | Source: GitHub Actions |
| Supabase Secrets | ✅ Gesetzt | VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY |
| Build-Prozess | ✅ Erfolgreich | Letzter Build: Erfolgreich |
| Live-Link | ✅ Funktionsfähig | https://hubertcpfeiffer-coder.github.io/Betalifepilot/ |

---

## Zugriff für Beta-Tester

### Für neue Tester:

1. **Link öffnen:** [https://hubertcpfeiffer-coder.github.io/Betalifepilot/](https://hubertcpfeiffer-coder.github.io/Betalifepilot/)
2. **Registrieren:** Klicke auf "Registrieren" und erstelle einen Account
3. **E-Mail verifizieren:** Checke dein Postfach und bestätige die E-Mail
4. **Loslegen:** Folge dem Onboarding-Prozess

### Dokumentation für Tester:

📖 Ausführliche Anleitung: [BETA_TESTER_GUIDE.md](BETA_TESTER_GUIDE.md)

---

## Technische Details

### Repository Konfiguration

```
Repository: hubertcpfeiffer-coder/Betalifepilot
Branch: main
Base Path: /Betalifepilot/
Deploy: GitHub Actions → GitHub Pages
```

### Workflow

```
Push zu main → GitHub Actions startet
  ↓
npm ci (Dependencies installieren)
  ↓
npm run build (Production Build)
  ↓
Upload Pages Artifact
  ↓
Deploy to GitHub Pages
  ↓
✅ Live unter: https://hubertcpfeiffer-coder.github.io/Betalifepilot/
```

### Build-Konfiguration

- **Build Tool:** Vite 5
- **Framework:** React 18 + TypeScript
- **Mode:** Production
- **Base Path:** `/Betalifepilot/`
- **Output:** `dist/` Verzeichnis

---

## Zukünftige Domains

Die aktuellen GitHub Pages werden später durch dedizierte Domains ersetzt:

- **Production:** `mio-lifepilot.app` (geplant)
- **Beta:** `mio-lifepilot.com` (geplant)

> **Hinweis:** Die Marke "Mio Life Pilot" wird für die Produktion verwendet, während "Betalifepilot" der technische Repository-Name für die Beta-Phase ist. Die Konfiguration ist bereits vorbereitet und kann einfach auf die neuen Domains umgestellt werden.

---

## Troubleshooting

### Link funktioniert nicht?

1. **Warte 2-3 Minuten** nach dem letzten Commit
2. **Leere den Browser-Cache:** Strg+F5 (Windows) oder Cmd+Shift+R (Mac)
3. **Prüfe GitHub Actions:** Gehe zu [Actions Tab](https://github.com/hubertcpfeiffer-coder/Betalifepilot/actions) und schaue ob der Workflow erfolgreich war
4. **Prüfe GitHub Pages Settings:** Gehe zu [Pages Settings](https://github.com/hubertcpfeiffer-coder/Betalifepilot/settings/pages) und stelle sicher, dass "GitHub Actions" als Source ausgewählt ist

### Weiße Seite oder 404-Fehler?

- Stelle sicher, dass der `base` path in `vite.config.ts` mit dem Repository-Namen übereinstimmt
- Prüfe ob der `basename` in `App.tsx` korrekt gesetzt ist
- Schaue in die Browser-Console für Fehler

### Assets laden nicht?

- Prüfe ob alle Asset-Pfade relativ sind oder den korrekten base path verwenden
- Checke die Browser-Konsole für 404-Fehler bei Assets
- Stelle sicher, dass der Build erfolgreich war

---

## Updates und Wartung

### Neue Version deployen:

```bash
# Änderungen committen
git add .
git commit -m "Beschreibung der Änderungen"

# Zu GitHub pushen
git push origin main

# GitHub Actions baut und deployed automatisch
# Nach 2-3 Minuten ist die neue Version live
```

### Workflow Status prüfen:

1. Gehe zu: https://github.com/hubertcpfeiffer-coder/Betalifepilot/actions
2. Schaue den Status des letzten Workflow Runs
3. Bei Fehlern: Klicke auf den Run für Details

---

## Support

Bei Fragen oder Problemen:

- **GitHub Issues:** https://github.com/hubertcpfeiffer-coder/Betalifepilot/issues
- **Beta Feedback:** beta-feedback@betalifepilot.com (wird eingerichtet)
- **Dokumentation:** Siehe [README.md](README.md) und [BETA_TESTER_GUIDE.md](BETA_TESTER_GUIDE.md)

---

**Version:** 1.0.0-beta  
**Letztes Update:** 10. Dezember 2024  
**Status:** ✅ Live und funktionsfähig
