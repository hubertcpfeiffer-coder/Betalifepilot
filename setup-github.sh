#!/bin/bash

# Mio Life Pilot - GitHub Setup Script
# Dieses Script automatisiert den GitHub-Upload-Prozess

set -e

echo "🚀 Mio Life Pilot - GitHub Setup"
echo "================================"
echo ""

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Benutzernamen abfragen
echo -e "${BLUE}Bitte gib deinen GitHub Benutzernamen ein:${NC}"
read -p "Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}❌ Benutzername erforderlich!${NC}"
    exit 1
fi

# 2. Repository Name
REPO_NAME="Betalifepilot"

# 3. Git initialisieren falls noch nicht geschehen
if [ ! -d .git ]; then
    echo -e "${YELLOW}📦 Initialisiere Git Repository...${NC}"
    git init
    git branch -M main
fi

# 4. Alle Dateien hinzufügen
echo -e "${YELLOW}📝 Füge alle Dateien hinzu...${NC}"
git add .

# 5. Initial Commit
if ! git rev-parse HEAD > /dev/null 2>&1; then
    echo -e "${YELLOW}💾 Erstelle initialen Commit...${NC}"
    git commit -m "Initial commit: Mio Life Pilot v1.0.0-beta

- Complete React + TypeScript application
- Supabase backend integration
- Full authentication system with email/password and face recognition
- AI voice assistant with multi-agent system
- Task management and contacts system
- IQ tests and knowledge management
- Real-time notifications
- Responsive design with dark mode
- Comprehensive onboarding flow
- Admin dashboard
- GDPR-compliant data management"
else
    echo -e "${YELLOW}💾 Erstelle Update Commit...${NC}"
    git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')" || echo -e "${BLUE}ℹ️  Keine Änderungen zum Committen${NC}"
fi

# 6. Remote hinzufügen
REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
if git remote | grep -q "^origin$"; then
    echo -e "${BLUE}ℹ️  Remote 'origin' existiert bereits. Aktualisiere URL...${NC}"
    git remote set-url origin "$REMOTE_URL"
else
    echo -e "${YELLOW}🔗 Füge Remote Repository hinzu...${NC}"
    git remote add origin "$REMOTE_URL"
fi

echo ""
echo -e "${GREEN}✅ Lokales Setup abgeschlossen!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 NÄCHSTE SCHRITTE AUF GITHUB:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}1. Repository erstellen:${NC}"
echo "   → https://github.com/new"
echo "   → Name: ${REPO_NAME}"
echo "   → Visibility: Public oder Private"
echo "   → NICHT initialisieren mit README/gitignore/license"
echo ""
echo -e "${BLUE}2. GitHub Secrets konfigurieren:${NC}"
echo "   → Gehe zu: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/secrets/actions"
echo "   → Klicke 'New repository secret'"
echo "   → Füge hinzu:"
echo "      • VITE_SUPABASE_URL"
echo "      • VITE_SUPABASE_ANON_KEY"
echo ""
echo -e "${BLUE}3. GitHub Pages aktivieren:${NC}"
echo "   → Gehe zu: https://github.com/${GITHUB_USERNAME}/${REPO_NAME}/settings/pages"
echo "   → Source: GitHub Actions"
echo ""
echo -e "${BLUE}4. Code hochladen:${NC}"
echo "   Führe folgenden Befehl aus:"
echo -e "   ${GREEN}git push -u origin main${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 TIPP:${NC} Nach dem Push wird automatisch der GitHub Actions"
echo "   Workflow gestartet und deine App auf GitHub Pages deployed!"
echo ""
echo -e "${GREEN}Deine App wird verfügbar sein unter:${NC}"
echo "https://${GITHUB_USERNAME}.github.io/${REPO_NAME}/"
echo ""
