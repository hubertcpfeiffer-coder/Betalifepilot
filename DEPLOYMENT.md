# GitHub Pages Deployment Guide

## Setup-Schritte

### 1. Repository auf GitHub erstellen
Erstelle ein neues Repository mit dem Namen `mio-lifepilot` auf GitHub.

### 2. Code zu GitHub pushen
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/mio-lifepilot.git
git push -u origin main
```

### 3. GitHub Secrets konfigurieren
Gehe zu deinem Repository auf GitHub:
- **Settings** → **Secrets and variables** → **Actions**
- Klicke auf **New repository secret**

Füge diese beiden Secrets hinzu:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://sjvbuqzckduoboqherqz.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqdmJ1cXpja2R1b2JvcWhlcnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwOTg5MDgsImV4cCI6MjA4MDY3NDkwOH0.zdbrziUrNGEuooJTNFR3-DrzOMoIS6Fq7FyRWC_3BBI`

### 4. GitHub Pages aktivieren
- Gehe zu **Settings** → **Pages**
- Unter **Source**: Wähle **GitHub Actions**
- Speichern

### 5. Deployment
Der GitHub Actions Workflow startet automatisch bei jedem Push zum `main` Branch.

Die App wird verfügbar sein unter:
```
https://DEIN-USERNAME.github.io/mio-lifepilot/
```

## Was wurde konfiguriert?

### GitHub Actions Workflow
- `.github/workflows/deploy.yml` - Automatisches Build und Deployment

### Vite Konfiguration
- `base` path für GitHub Pages gesetzt
- Production/Development Mode unterschieden

### React Router
- `basename` für GitHub Pages konfiguriert
- SPA-Routing Support über 404.html

### 404 Handling
- `public/404.html` - Redirect für SPA-Routing
- `index.html` - Client-side Routing Support

## Lokales Testen
```bash
npm run dev
```

## Production Build
```bash
npm run build
```

## Troubleshooting

### Deployment schlägt fehl
- Überprüfe, ob die Secrets korrekt gesetzt sind
- Überprüfe die GitHub Actions Logs

### 404 Fehler nach Deployment
- Stelle sicher, dass GitHub Pages auf "GitHub Actions" als Source eingestellt ist
- Warte einige Minuten nach dem ersten Deployment

### Assets werden nicht geladen
- Überprüfe, ob der Repository-Name mit dem `base` path in `vite.config.ts` übereinstimmt
