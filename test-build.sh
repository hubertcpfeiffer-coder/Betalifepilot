#!/bin/bash

# Mio Life Pilot - Build Test Script
# Testet den Build-Prozess lokal vor dem GitHub Upload

set -e

echo "🔨 Mio Life Pilot - Build Test"
echo "=============================="
echo ""

# Farben
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env Datei nicht gefunden!${NC}"
    echo "Bitte erstelle eine .env Datei mit:"
    echo "  VITE_SUPABASE_URL=deine-url"
    echo "  VITE_SUPABASE_ANON_KEY=dein-key"
    exit 1
fi

# 2. Prüfe ob node_modules existiert
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}📦 Installiere Dependencies...${NC}"
    npm install
else
    echo -e "${GREEN}✅ Dependencies bereits installiert${NC}"
fi

# 3. Führe Build aus
echo -e "${YELLOW}🔨 Starte Production Build...${NC}"
npm run build

# 4. Prüfe ob Build erfolgreich war
if [ -d dist ]; then
    echo ""
    echo -e "${GREEN}✅ Build erfolgreich!${NC}"
    echo ""
    echo "📊 Build-Statistik:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Größe des dist Ordners
    DIST_SIZE=$(du -sh dist | cut -f1)
    echo -e "   Gesamt-Größe: ${BLUE}${DIST_SIZE}${NC}"

    # Anzahl Dateien
    FILE_COUNT=$(find dist -type f | wc -l)
    echo -e "   Anzahl Dateien: ${BLUE}${FILE_COUNT}${NC}"

    # Größte Dateien
    echo ""
    echo "   Top 5 größte Dateien:"
    find dist -type f -exec du -h {} + | sort -rh | head -5 | while read size file; do
        echo -e "   ${BLUE}${size}${NC} - ${file#dist/}"
    done

    echo ""
    echo -e "${GREEN}🚀 Build ist bereit für Deployment!${NC}"
    echo ""
    echo "Nächste Schritte:"
    echo "1. Führe ./setup-github.sh aus"
    echo "2. Folge den Anweisungen für GitHub Setup"
    echo "3. Push deinen Code mit: git push -u origin main"
    echo ""
else
    echo -e "${RED}❌ Build fehlgeschlagen!${NC}"
    echo "Bitte prüfe die Fehlermeldungen oben."
    exit 1
fi
