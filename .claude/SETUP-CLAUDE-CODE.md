# Claude Code – Einrichtung für MIO (Betalifepilot)

Einmalige Einrichtung, danach programmiert Claude Code direkt in diesem Repo mit den
MIO-Subagenten aus `.claude/agents/`.

## 1. Voraussetzungen
- Node.js ≥ 18 (`node -v`).
- Git + dieses Repo lokal geklont.

## 2. Claude Code installieren (Terminal)
```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

## 3. Anmelden
```bash
claude            # startet die interaktive Session; beim ersten Start durch den Login führen
```
Anmeldung per Anthropic-Konto (Pro/Max) oder API-Key – dem Prompt folgen.

## 4. Im Repo starten
```bash
cd <pfad>/Betalifepilot
npm install
claude
```
Claude Code lädt automatisch `CLAUDE.md` (Projektkontext) und die Subagenten in `.claude/agents/`.

## 5. Subagenten nutzen
- Prüfen: `/agents` (listet die 7 MIO-Agenten).
- Delegieren: „Nutze den mio-orchestrator, um Feature X in Arbeitspakete zu zerlegen."
- Vor jedem Merge: „Lass den security-reviewer den Diff prüfen."

## 6. Sicherheits-Defaults (`.claude/settings.json`)
- `.env`, `*secret*`, Service-Role-Keys sind **deny** (kein Lesen/Leak).
- `git push`, `supabase functions deploy`, `supabase db push` erfordern Rückfrage (**ask**).
- `rm -rf`, `curl`, `wget` sind blockiert.

## 7. Empfohlener erster Lauf
```text
> Nutze den mio-orchestrator: Wir sind in Phase A. Plane die Anbindung von goapService
> an ein Gesundheits-Dashboard mit „Plan genehmigen"/Veto-Button. Danach security-reviewer.
```

> Governance/Decision-Log werden im Repo `mio-lifepilot-app` gepflegt (compliance-auditor).
