#!/bin/bash

# Mio Life Pilot - Secrets Helper
# Zeigt die Supabase Keys für GitHub Secrets Konfiguration

echo "🔐 Mio Life Pilot - GitHub Secrets"
echo "===================================="
echo ""

# Farben
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env Datei nicht gefunden!${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Folgende Secrets musst du in GitHub konfigurieren:${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Lese und zeige VITE_SUPABASE_URL
if grep -q "VITE_SUPABASE_URL" .env; then
    SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    echo -e "${BLUE}Secret Name:${NC} VITE_SUPABASE_URL"
    echo -e "${GREEN}Wert:${NC} ${SUPABASE_URL}"
    echo ""
else
    echo -e "${RED}❌ VITE_SUPABASE_URL nicht in .env gefunden${NC}"
    echo ""
fi

# Lese und zeige VITE_SUPABASE_ANON_KEY
if grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    ANON_KEY=$(grep "VITE_SUPABASE_ANON_KEY" .env | cut -d '=' -f2- | tr -d '"' | tr -d "'")
    echo -e "${BLUE}Secret Name:${NC} VITE_SUPABASE_ANON_KEY"
    echo -e "${GREEN}Wert:${NC} ${ANON_KEY}"
    echo ""
else
    echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY nicht in .env gefunden${NC}"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 Wie füge ich diese Secrets zu GitHub hinzu?${NC}"
echo ""
echo "1. Gehe zu deinem Repository auf GitHub"
echo "2. Klicke: Settings → Secrets and variables → Actions"
echo "3. Klicke: New repository secret"
echo "4. Kopiere den Secret Name und Wert von oben"
echo "5. Klicke: Add secret"
echo "6. Wiederhole für beide Secrets"
echo ""
echo -e "${GREEN}✅ Fertig! Die Secrets sind dann für den Build verfügbar.${NC}"
echo ""
