# ⚠️ WICHTIG: E-Mail-Konfiguration für Beta-Testing

## 📧 E-Mail-Adressen konfigurieren

Die folgenden E-Mail-Adressen werden in der Dokumentation verwendet und **müssen vor dem Start des Beta-Tests eingerichtet werden**:

### 1. Beta Feedback E-Mail
**Adresse:** `beta-feedback@betalifepilot.com`  
**Verwendet in:** `BETA_TESTER_GUIDE.md`  
**Zweck:** Sammlung von Beta-Tester Feedback und Erfahrungsberichten

### 2. Beta Support E-Mail
**Adresse:** `beta-support@betalifepilot.com`  
**Verwendet in:** `TROUBLESHOOTING.md`  
**Zweck:** Technischer Support für Beta-Tester bei Problemen

## ✅ Optionen zur Einrichtung

### Option 1: E-Mail-Adressen einrichten (Empfohlen)

1. **Domain-basierte E-Mails:**
   - Richten Sie `beta-feedback@betalifepilot.com` ein
   - Richten Sie `beta-support@betalifepilot.com` ein
   - Konfigurieren Sie Weiterleitungen an Ihr Team

2. **Alternative Domain:**
   Falls Sie keine `betalifepilot.com` Domain haben:
   - Verwenden Sie Ihre eigene Domain (z.B. `beta-feedback@ihre-domain.com`)
   - Aktualisieren Sie die Adressen in den entsprechenden Dateien

### Option 2: Alternative Kontaktmethoden

Falls Sie keine E-Mail-Adressen einrichten möchten:

1. **Nur GitHub Issues verwenden:**
   - Entfernen Sie die E-Mail-Optionen aus der Dokumentation
   - Verweisen Sie ausschließlich auf GitHub Issues

2. **Anderer Feedback-Kanal:**
   - Google Forms für Feedback
   - Typeform oder ähnliche Tools
   - Discord/Slack Community

## 📝 Dateien zum Aktualisieren

Falls Sie andere E-Mail-Adressen verwenden möchten:

### BETA_TESTER_GUIDE.md
**Zeile ~72:**
```markdown
**Per E-Mail:**
- Senden Sie Ihre Erfahrungsberichte an: IHRE-EMAIL@domain.com
```

### TROUBLESHOOTING.md
**Zeile ~242:**
```markdown
### Support-Kanäle:
- **E-Mail:** IHRE-SUPPORT-EMAIL@domain.com
```

### SETUP_COMPLETE.md
**Zeile ~133-135:**
```markdown
- **Wichtig:** Konfigurieren Sie E-Mail-Adressen für Feedback/Support:
  - IHRE-FEEDBACK-EMAIL@domain.com (in BETA_TESTER_GUIDE.md)
  - IHRE-SUPPORT-EMAIL@domain.com (in TROUBLESHOOTING.md)
```

## 🔍 Schnellsuche und Ersetzen

Verwenden Sie diese Befehle, um alle E-Mail-Vorkommen zu finden:

```bash
# Finde alle Vorkommen von beta-feedback@betalifepilot.com
grep -r "beta-feedback@betalifepilot.com" *.md

# Finde alle Vorkommen von beta-support@betalifepilot.com
grep -r "beta-support@betalifepilot.com" *.md
```

Um alle Vorkommen zu ersetzen:

```bash
# Ersetze beta-feedback@betalifepilot.com
sed -i 's/beta-feedback@betalifepilot.com/IHRE-EMAIL@domain.com/g' BETA_TESTER_GUIDE.md SETUP_COMPLETE.md

# Ersetze beta-support@betalifepilot.com
sed -i 's/beta-support@betalifepilot.com/IHRE-EMAIL@domain.com/g' TROUBLESHOOTING.md SETUP_COMPLETE.md
```

## ✅ Checkliste vor Beta-Start

Bevor Sie Beta-Tester einladen, stellen Sie sicher:

- [ ] E-Mail-Adressen sind eingerichtet und funktionieren
- [ ] E-Mails werden an das richtige Team weitergeleitet
- [ ] Auto-Responder sind konfiguriert (optional)
- [ ] Team ist bereit, auf Feedback/Support-Anfragen zu reagieren
- [ ] Alternative Kanäle (GitHub Issues) sind vorbereitet
- [ ] Alle E-Mail-Adressen in der Dokumentation wurden verifiziert

## 📌 Status

**Aktuelle E-Mails in Dokumentation:**
- ✉️ `beta-feedback@betalifepilot.com` (für Feedback)
- ✉️ `beta-support@betalifepilot.com` (für Support)

**Zusätzliche Kanäle:**
- 🐛 GitHub Issues: https://github.com/hubertcpfeiffer-coder/Betalifepilot/issues

---

**Hinweis:** Diese E-Mail-Adressen sind derzeit als Platzhalter konfiguriert und müssen vor dem Start des Beta-Tests entweder eingerichtet oder durch funktionierende Alternativen ersetzt werden.
