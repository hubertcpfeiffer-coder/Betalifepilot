# MIO – CLAUDE.md (Coding-Repo: Betalifepilot)

Dies ist das **Programmier-Repo** für MIO. Claude Code arbeitet hier am echten App-Code.
Governance, Decision-Log und Strategie liegen im Schwester-Repo `mio-lifepilot-app`
(lokal: `mio-lifepilot-main`). Wegweisende Entscheidungen dort als MIO-XXX dokumentieren.

## Stack (verbindlich, MIO-008)
- Frontend: **Vite + React 18 + TypeScript** (SPA), Deploy via GitHub Pages.
- Backend: **Supabase** (PostgreSQL + RLS) + **Edge Functions (Deno)**.
- Pfad-Alias: `@/*` → `./src/*`. Validierung: **zod**.
- Kein Next.js / Cloudflare (alte Annahme MIO-001 ist superseded).

## Wo liegt was
- `src/lib/mio-contracts.ts` → ActionVector + EdgeProcessing (PII-frei, Zod). Einzige ausgehende Struktur = `ActionVector` (MIO-002).
- `src/lib/mio-edge-auth.ts` → lokale BehavioralAuth; nur `authenticityScore` verlässt die Edge.
- `src/services/goapService.ts` → BehavioralAuth-Gate → ActionVector → `goap-planner`.
- `supabase/functions/goap-planner/` → validierender Gateway (Schema + PII + SIL/Veto).
- `src/services/aiService.ts`, `supabase/functions/round-table-ai/` → bestehende KI-Schicht.

## Subagenten (.claude/agents) und Workflow
1. **mio-orchestrator** zerlegt Features in Arbeitspakete und delegiert.
2. Fach-Agenten bauen gegen die Contracts in `src/lib/mio-*`:
   - `edge-privacy-architect` (Phase A, Edge/Anonymisierung)
   - `neuraverse-bridge-engineer` (Phase B, 4NE1-Bridge)
   - `frontend-avatar-engineer` (UI, Avatar, Veto-UI)
   - `compliance-auditor` (EU AI Act, ISO 27001, Decision-Log)
   - `qa-safety-tester` (Tests, Veto-/Safety-Validierung)
3. **security-reviewer** prüft jeden Diff VOR dem Merge (MIO-005). Critical/High blockiert.

## Unverhandelbare Invarianten (deterministisch, nicht LLM-abhängig)
- Verhaltens-/Biometrie-Rohdaten verlassen das Gerät nie (Zero-Knowledge-Edge).
- Nur PII-freie, Zod-validierte `ActionVector` gehen in die Cloud (MIO-002).
- SIL2/SIL3 ⇒ Human-Approval + Nutzer-Veto erzwungen (EU AI Act Art. 14; MIO-003/004).
- `.env` / Secrets nie lesen oder committen (Repo ist öffentlich!).

## Befehle
- Dev: `npm install` · `npm run dev`
- Tests/Typen: `npm test` · `npx tsc --noEmit`
- Edge Function lokal: `npx supabase functions serve goap-planner`
- Deploy (nach Review/Merge): `npx supabase functions deploy goap-planner`

## Arbeitsweise mit dem Nutzer (C-Level)
Antworte pragmatisch und lösungsorientiert. Bei MIO-Themen Struktur:
Status → Lösung (lauffähig, keine Platzhalter) → Risk/Compliance-Check → nächster Schritt.
