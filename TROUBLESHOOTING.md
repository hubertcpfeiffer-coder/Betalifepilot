# 🔧 Troubleshooting Guide - Mio Life Pilot Beta

Häufige Probleme und deren Lösungen für Beta-Tester.

## 🌐 Site-Zugriff

### Problem: "Site kann nicht geladen werden" oder Weiße Seite

**Lösungen:**

1. **Cache leeren:**
   - **Windows/Linux:** Drücken Sie `Ctrl + Shift + R` oder `Ctrl + F5`
   - **Mac:** Drücken Sie `Cmd + Shift + R`

2. **Browser aktualisieren:**
   - Stellen Sie sicher, dass Sie die neueste Browser-Version verwenden

3. **Anderer Browser:**
   - Versuchen Sie Chrome, Firefox oder Edge (neueste Versionen)

4. **Inkognito-Modus:**
   - Öffnen Sie die Site im Inkognito/Privat-Modus

5. **Warten:**
   - Nach einem neuen Deployment kann es 2-3 Minuten dauern, bis die Site verfügbar ist

### Problem: "404 Not Found" Fehler

**Ursachen:**
- GitHub Pages wurde noch nicht aktiviert
- Deployment läuft noch

**Lösung:**
- Warten Sie 5 Minuten und versuchen Sie es erneut
- URL überprüfen: `https://hubertcpfeiffer-coder.github.io/Betalifepilot/`

### Problem: Assets (Bilder, CSS, JS) werden nicht geladen

**Lösung:**
1. Cache leeren (siehe oben)
2. Überprüfen Sie die Browser-Konsole auf Fehler (F12)
3. Melden Sie das Problem mit Screenshots

## 🔐 Anmeldung & Registrierung

### Problem: "E-Mail bereits registriert"

**Lösung:**
- Nutzen Sie die "Passwort vergessen" Funktion
- Oder verwenden Sie eine andere E-Mail-Adresse

### Problem: Bestätigungs-E-Mail kommt nicht an

**Lösungen:**

1. **Spam-Ordner prüfen:**
   - Die E-Mail könnte im Spam/Junk gelandet sein

2. **E-Mail erneut senden:**
   - Warten Sie 5 Minuten und versuchen Sie erneut zu registrieren

3. **E-Mail-Adresse prüfen:**
   - Stellen Sie sicher, dass Sie keine Tippfehler haben

4. **Alternative E-Mail:**
   - Versuchen Sie eine andere E-Mail-Adresse (Gmail, Outlook, etc.)

### Problem: "Falsches Passwort" trotz korrekter Eingabe

**Lösungen:**
- Passwort zurücksetzen über "Passwort vergessen"
- Kopieren Sie das Passwort nicht (Leerzeichen könnten kopiert werden)
- Caps Lock überprüfen

### Problem: Login-Seite lädt endlos

**Lösung:**
1. Seite neu laden (F5)
2. Cache leeren
3. Browser-Konsole prüfen (F12 → Console)
4. Problem mit Details melden

## 🎤 Voice Assistant

### Problem: Mikrofon funktioniert nicht

**Lösungen:**

1. **Browser-Berechtigung:**
   - Klicken Sie auf das Mikrofon-Symbol in der Adressleiste
   - Erlauben Sie Mikrofon-Zugriff

2. **Systemeinstellungen:**
   - **Windows:** Einstellungen → Datenschutz → Mikrofon
   - **Mac:** Systemeinstellungen → Sicherheit → Datenschutz → Mikrofon
   - **Linux:** Überprüfen Sie PulseAudio/ALSA Einstellungen

3. **Mikrofon testen:**
   - Testen Sie in anderen Apps (z.B. Voice Recorder)
   - Prüfen Sie, ob das richtige Mikrofon ausgewählt ist

4. **HTTPS erforderlich:**
   - Mikrofon funktioniert nur über HTTPS (GitHub Pages ist HTTPS)
   - Funktioniert NICHT in HTTP-Umgebungen

### Problem: Voice Assistant versteht mich nicht

**Tipps:**
- Sprechen Sie deutlich und in normaler Lautstärke
- Reduzieren Sie Hintergrundgeräusche
- Verwenden Sie ein besseres Mikrofon (Headset)
- Stellen Sie sicher, dass Ihre Sprache unterstützt wird

### Problem: "Spracherkennung nicht verfügbar"

**Ursachen:**
- Browser unterstützt keine Web Speech API
- Keine Internetverbindung

**Lösung:**
- Verwenden Sie Chrome, Edge oder Safari
- Überprüfen Sie Ihre Internetverbindung

## 📱 Mobile Nutzung

### Problem: Layout sieht auf dem Handy seltsam aus

**Lösung:**
- Die mobile Ansicht wird noch optimiert
- Bitte dokumentieren Sie das Problem mit Screenshots
- Versuchen Sie die Desktop-Ansicht bis zur Behebung

### Problem: Touch-Gesten funktionieren nicht

**Lösung:**
1. Seite neu laden
2. Browser aktualisieren
3. Problem mit Geräte-Details melden

## 🎨 Design & Layout

### Problem: Dark Mode funktioniert nicht

**Lösung:**
1. Klicken Sie auf das Sonnen/Mond-Symbol
2. Leeren Sie den Cache
3. Überprüfen Sie Systemeinstellungen (Auto-Dark-Mode)

### Problem: Text ist zu klein/groß

**Lösung:**
- Browser-Zoom anpassen: `Ctrl + Plus/Minus` oder `Cmd + Plus/Minus`
- Standard-Zoom: `Ctrl + 0` oder `Cmd + 0`

## 📊 Funktionen

### Problem: Aufgaben werden nicht gespeichert

**Lösungen:**
1. Überprüfen Sie Ihre Internetverbindung
2. Melden Sie sich ab und wieder an
3. Browser-Konsole auf Fehler prüfen (F12)

### Problem: Kontakte können nicht hinzugefügt werden

**Lösung:**
1. Alle Pflichtfelder ausfüllen
2. E-Mail-Format überprüfen
3. Seite neu laden und erneut versuchen

### Problem: IQ-Test lädt nicht

**Lösung:**
1. Warten Sie 10-15 Sekunden
2. Seite neu laden
3. Cache leeren
4. Problem melden falls es weiterhin auftritt

## 🔧 Technische Probleme

### Problem: Browser-Konsole zeigt Fehler

**Was tun:**
1. Screenshot der Fehler machen (F12 → Console)
2. Beschreiben Sie, was Sie getan haben
3. Senden Sie beides an das Beta-Team

### Problem: Langsame Performance

**Lösungen:**
1. **Browser-Cache leeren**
2. **Andere Tabs schließen**
3. **Browser neu starten**
4. **Systemressourcen prüfen:**
   - Schließen Sie unnötige Programme
   - Mindestens 4GB RAM empfohlen

### Problem: "Verbindung zum Server verloren"

**Lösungen:**
1. **Internetverbindung prüfen**
2. **Seite neu laden**
3. **Warten Sie 1-2 Minuten** (Server könnte neu starten)
4. **Problem persistent?** → Melden Sie es dem Team

## 🆘 Notfall-Lösungen

### Wenn gar nichts funktioniert:

1. **Komplettes Zurücksetzen:**
   ```
   1. Browser-Cache komplett leeren
   2. Cookies für die Site löschen
   3. Browser neu starten
   4. Inkognito-Modus versuchen
   ```

2. **Account-Probleme:**
   - E-Mail an Support senden
   - Alternative E-Mail für neue Registrierung verwenden

3. **Daten-Export:**
   - Falls verfügbar, exportieren Sie Ihre Daten
   - Nutzen Sie die Export-Funktion im Profil

## 📞 Support kontaktieren

### Informationen für effektiven Support:

Bitte geben Sie folgendes an:

1. **Browser & Version:** (z.B. Chrome 120, Firefox 121)
2. **Betriebssystem:** (z.B. Windows 11, macOS 14, Ubuntu 22.04)
3. **Fehlerbeschreibung:** Was ist passiert?
4. **Erwartetes Verhalten:** Was sollte passieren?
5. **Schritte zur Reproduktion:** Wie kann man den Fehler nachstellen?
6. **Screenshots:** Falls relevant
7. **Browser-Konsole:** Fehler aus der Konsole (F12)

### Support-Kanäle:

- **E-Mail:** [Beta Support E-Mail einfügen]
- **GitHub Issues:** https://github.com/hubertcpfeiffer-coder/Betalifepilot/issues
- **Feedback-System:** Im Admin-Bereich der App (falls verfügbar)

## 🔍 Browser-Konsole nutzen

So öffnen Sie die Browser-Konsole:

- **Windows/Linux:** `F12` oder `Ctrl + Shift + I`
- **Mac:** `Cmd + Option + I`

In der Konsole sehen Sie:
- Fehler (rot)
- Warnungen (gelb)
- Informationen (blau)

→ Screenshots von Fehlern helfen uns sehr!

## ✅ Best Practices

**Für die beste Beta-Test-Erfahrung:**

1. ✅ Verwenden Sie einen modernen Browser (Chrome, Edge, Firefox)
2. ✅ Halten Sie Ihren Browser aktuell
3. ✅ Stabile Internetverbindung (5+ Mbit/s)
4. ✅ Erlauben Sie Mikrofon/Kamera-Zugriff für Features
5. ✅ Melden Sie Probleme zeitnah
6. ✅ Dokumentieren Sie Fehler mit Screenshots
7. ✅ Seien Sie geduldig - dies ist eine Beta-Version! 😊

---

**Danke für Ihre Geduld und Ihr Feedback!**

Ihr Beitrag hilft uns, Mio Life Pilot zu verbessern.
