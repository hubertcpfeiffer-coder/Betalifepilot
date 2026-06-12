// MIO-Lifepilot: src/services/goapService.ts
// Frontend-Client fuer proaktive GOAP-Planung (Phase A Integration).
//
// Verantwortung:
//  1. Aus Nutzer-/Weltzustand einen PII-freien ActionVector bauen.
//  2. BehavioralAuth-Gate: nur mit ausreichendem authenticityScore weitermachen.
//  3. Edge Function `goap-planner` aufrufen und den (ggf. genehmigungs-
//     pflichtigen) Plan zurueckgeben.
//
// Konvention angelehnt an aiService.ts (supabase.functions.invoke).
// ActionVector-Schema: aus dem vendored Contract @/lib/mio-contracts
// (kopiert aus packages/contracts — siehe INTEGRATION.md).

import { supabase } from '@/lib/supabase';
import {
  parseActionVector,
  ACTION_VECTOR_SCHEMA_VERSION,
  type ActionVector,
  type ModuleScope,
  type SafetyLevel,
} from '@/lib/mio-contracts';
import { buildAuthenticitySignal, type BehavioralProfile, type BehavioralCollector } from '@/lib/mio-edge-auth';

export interface GoapPlan {
  forVectorId: string;
  module: ModuleScope;
  actionType: string;
  sil: SafetyLevel;
  steps: string[];
  status: 'ready_to_execute' | 'awaiting_human_approval';
  vetoable: boolean;
  expiresAt: string;
}

export class GoapError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'GoapError';
  }
}

let counter = 0;
/** Erzeugt eine opake, PII-freie ID (UUID falls verfuegbar, sonst Fallback). */
function opaqueId(prefix: string): string {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ? `${prefix}_${uuid.replace(/-/g, '').slice(0, 16)}` : `${prefix}_${Date.now()}${counter++}`;
}

export interface HealthActionInput {
  actionType: 'remind_workout' | 'track_water' | 'optimize_sleep';
  payload?: Record<string, number | boolean | string>;
  goalId: string;
  planId: string;
  authenticityScore: number;
}

/** Baut einen validierten, PII-freien ActionVector fuer das Health-Modul (SIL1). */
export function buildHealthActionVector(input: HealthActionInput): ActionVector {
  return parseActionVector({
    schemaVersion: ACTION_VECTOR_SCHEMA_VERSION,
    id: opaqueId('av'),
    issuedAt: new Date().toISOString(),
    module: 'health',
    actionType: input.actionType,
    sil: 'SIL1',
    payload: input.payload ?? {},
    authenticityScore: input.authenticityScore,
    requiresHumanApproval: false,
    vetoable: false,
    provenance: { planId: input.planId, goalId: input.goalId },
    ttlMs: 10_000,
  });
}

/** Mindest-Score, ab dem proaktive Plaene erstellt werden. */
export const PROACTIVE_MIN_SCORE = 0.85;

/**
 * Fordert einen GOAP-Plan an. Voraussetzung: ausreichende Verhaltens-Authentizitaet.
 * Rohdaten verlassen das Geraet nicht — nur der ActionVector (inkl. Score) geht raus.
 */
export async function requestPlan(vector: ActionVector): Promise<GoapPlan> {
  const { data, error } = await supabase.functions.invoke('goap-planner', {
    body: { actionVector: vector },
  });
  if (error) throw new GoapError(`GOAP-Planung fehlgeschlagen: ${error.message}`, 'EDGE_FUNCTION_ERROR');
  if (!data?.ok) throw new GoapError(data?.error ?? 'Unbekannter Fehler', data?.error);
  return data.plan as GoapPlan;
}

/**
 * Komfort-Flow: BehavioralAuth-Gate -> ActionVector -> Plan.
 * Gibt `null` zurueck, wenn die Authentizitaet nicht ausreicht (kein Datenabfluss).
 */
export async function planHealthAction(
  profile: BehavioralProfile,
  collector: BehavioralCollector,
  action: Omit<HealthActionInput, 'authenticityScore'>,
): Promise<GoapPlan | null> {
  const signal = buildAuthenticitySignal(profile, collector);
  if (!signal.authentic || signal.authenticityScore < PROACTIVE_MIN_SCORE) return null;
  const vector = buildHealthActionVector({ ...action, authenticityScore: signal.authenticityScore });
  return requestPlan(vector);
}
