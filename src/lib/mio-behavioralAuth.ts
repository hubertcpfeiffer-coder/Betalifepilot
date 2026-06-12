/**
 * BehavioralAuth – Zero-Knowledge-Edge (Phase A).
 *
 * Tipp- und Mausdynamik werden AUSSCHLIESSLICH lokal verarbeitet. Rohdaten
 * (Keydown/Keyup-Timestamps, Mauspositionen) verlassen das Gerät NIE – sie
 * liegen privat in der Collector-Instanz. Nach außen geht nur das Derivat:
 * der `authenticityScore` (0..1), klassifiziert als `cloudAccessible`.
 *
 * Norm-Bezug: DSGVO Art. 9 / EU AI Act Art. 10 (Data Minimization),
 * ISO 27001 A.8. Datenklasse erzwungen über @mio/contracts.classifyField.
 *
 * Framework-agnostisch: keine React-/DOM-Bindung, nur Event-Eingaben als Zahlen.
 */

import { classifyField } from "./mio-contracts";

/** Schwelle, ab der ein Nutzer als authentisch gilt (aus Konzept-Doku). */
export const AUTHENTICITY_THRESHOLD = 0.85;

/** Minimale Beobachtungen für einen belastbaren Score. */
const MIN_KEY_EVENTS = 8;

/** Aggregierter, anonymer Merkmalsvektor – enthält KEINE Rohdaten. */
export interface BehavioralFeatures {
  /** Tastenhaltezeit (key down→up), Mittelwert in ms. */
  meanDwellMs: number;
  /** Tastenhaltezeit, Standardabweichung in ms. */
  stdDwellMs: number;
  /** Flugzeit zwischen Tasten (up→next down), Mittelwert in ms. */
  meanFlightMs: number;
  /** Flugzeit, Standardabweichung in ms. */
  stdFlightMs: number;
  /** Mittlere Mausgeschwindigkeit in px/ms. */
  meanMouseSpeed: number;
}

const FEATURE_KEYS = [
  "meanDwellMs",
  "stdDwellMs",
  "meanFlightMs",
  "stdFlightMs",
  "meanMouseSpeed",
] as const;
type FeatureKey = (typeof FEATURE_KEYS)[number];

/** Eingelerntes Referenzprofil: pro Merkmal Mittelwert + Streuung. */
export interface BehavioralProfile {
  mean: Record<FeatureKey, number>;
  /** Streuung pro Merkmal; Untergrenze verhindert Division durch ~0. */
  std: Record<FeatureKey, number>;
  /** Anzahl der Enrollment-Samples (Audit-Info). */
  samples: number;
}

/** Nach außen sichtbares Signal – bewusst OHNE Rohdaten/Features-Detailpfade. */
export interface AuthenticitySignal {
  authenticityScore: number;
  authentic: boolean;
  /** False, wenn zu wenige Events für einen verlässlichen Score vorlagen. */
  sufficientData: boolean;
}

// --- Statistik-Helfer --------------------------------------------------------

function mean(xs: readonly number[]): number {
  if (xs.length === 0) return 0;
  let s = 0;
  for (const x of xs) s += x;
  return s / xs.length;
}

function std(xs: readonly number[], m: number): number {
  if (xs.length === 0) return 0;
  let s = 0;
  for (const x of xs) s += (x - m) * (x - m);
  return Math.sqrt(s / xs.length);
}

// --- Collector (hält Rohdaten privat) ---------------------------------------

interface KeyEvent {
  key: string;
  down: number;
  up: number | null;
}

/**
 * Sammelt Verhaltens-Rohdaten lokal. Die Roh-Arrays sind privat und werden
 * niemals zurückgegeben – nur aggregierte Features bzw. der Score verlassen
 * die Instanz.
 */
export class BehavioralCollector {
  #keys: KeyEvent[] = [];
  #flights: number[] = [];
  #lastUp: number | null = null;
  #mouseSpeeds: number[] = [];
  #lastMouse: { x: number; y: number; t: number } | null = null;

  /** Taste gedrückt (t = performance.now()-Zeitstempel in ms). */
  recordKeyDown(key: string, t: number): void {
    if (this.#lastUp !== null) this.#flights.push(Math.max(0, t - this.#lastUp));
    this.#keys.push({ key, down: t, up: null });
  }

  /** Taste losgelassen. */
  recordKeyUp(_key: string, t: number): void {
    for (let i = this.#keys.length - 1; i >= 0; i--) {
      const ev = this.#keys[i];
      if (ev && ev.up === null) {
        ev.up = t;
        break;
      }
    }
    this.#lastUp = t;
  }

  /** Mausbewegung; Geschwindigkeit wird inkrementell aus Wegstrecke/Zeit berechnet. */
  recordMouseMove(x: number, y: number, t: number): void {
    if (this.#lastMouse) {
      const dt = t - this.#lastMouse.t;
      if (dt > 0) {
        const dx = x - this.#lastMouse.x;
        const dy = y - this.#lastMouse.y;
        this.#mouseSpeeds.push(Math.hypot(dx, dy) / dt);
      }
    }
    this.#lastMouse = { x, y, t };
  }

  /** Anzahl abgeschlossener Tastenanschläge (für Datensuffizienz). */
  get keyEventCount(): number {
    return this.#keys.filter((k) => k.up !== null).length;
  }

  /** Aggregiert die gesammelten Rohdaten zu einem anonymen Merkmalsvektor. */
  computeFeatures(): BehavioralFeatures {
    const dwells = this.#keys
      .filter((k): k is KeyEvent & { up: number } => k.up !== null)
      .map((k) => k.up - k.down);
    const mDwell = mean(dwells);
    const mFlight = mean(this.#flights);
    return {
      meanDwellMs: mDwell,
      stdDwellMs: std(dwells, mDwell),
      meanFlightMs: mFlight,
      stdFlightMs: std(this.#flights, mFlight),
      meanMouseSpeed: mean(this.#mouseSpeeds),
    };
  }

  /** Löscht alle Rohdaten (z. B. nach Score-Berechnung). */
  reset(): void {
    this.#keys = [];
    this.#flights = [];
    this.#lastUp = null;
    this.#mouseSpeeds = [];
    this.#lastMouse = null;
  }
}

// --- Enrollment & Scoring ----------------------------------------------------

/** Erstellt ein Referenzprofil aus mehreren Enrollment-Merkmalsvektoren. */
export function enrollProfile(samples: readonly BehavioralFeatures[]): BehavioralProfile {
  if (samples.length === 0) throw new Error("enrollProfile: mindestens ein Sample nötig");
  const meanRec = {} as Record<FeatureKey, number>;
  const stdRec = {} as Record<FeatureKey, number>;
  for (const key of FEATURE_KEYS) {
    const vals = samples.map((s) => s[key]);
    const m = mean(vals);
    meanRec[key] = m;
    // Untergrenze der Streuung: 5 % des Mittelwerts bzw. 1.0 – verhindert Überanpassung.
    stdRec[key] = Math.max(std(vals, m), Math.abs(m) * 0.05, 1.0);
  }
  return { mean: meanRec, std: stdRec, samples: samples.length };
}

/**
 * Bewertet einen aktuellen Merkmalsvektor gegen das Profil.
 * Score = Mittel der gaußschen Ähnlichkeit exp(-0.5·z²) je Merkmal → [0,1].
 * 1.0 = identisch zum Profil, →0 = weit entfernt (Imposter).
 */
export function scoreFeatures(profile: BehavioralProfile, features: BehavioralFeatures): number {
  let acc = 0;
  for (const key of FEATURE_KEYS) {
    const z = (features[key] - profile.mean[key]) / profile.std[key];
    acc += Math.exp(-0.5 * z * z);
  }
  return acc / FEATURE_KEYS.length;
}

/**
 * Erzeugt das nach außen sichtbare Authentizitäts-Signal.
 * Gibt NUR den Score + abgeleitete Booleans zurück – keine Rohdaten/Features.
 */
export function buildAuthenticitySignal(
  profile: BehavioralProfile,
  collector: BehavioralCollector,
): AuthenticitySignal {
  const sufficientData = collector.keyEventCount >= MIN_KEY_EVENTS;
  const score = sufficientData ? scoreFeatures(profile, collector.computeFeatures()) : 0;
  const rounded = Math.round(score * 1000) / 1000;
  return {
    authenticityScore: rounded,
    authentic: sufficientData && rounded >= AUTHENTICITY_THRESHOLD,
    sufficientData,
  };
}

/**
 * Verpackt den Score als cloud-taugliches Feld – mit Laufzeit-Assertion,
 * dass `auth.authenticityScore` tatsächlich `cloudAccessible` ist (Defense-in-Depth).
 */
export function toCloudField(score: number): { field: "auth.authenticityScore"; value: number } {
  const policy = classifyField("auth.authenticityScore");
  if (policy.dataClass !== "cloudAccessible") {
    throw new Error(`EdgeProcessing-Verstoß: auth.authenticityScore ist ${policy.dataClass}`);
  }
  if (score < 0 || score > 1) throw new Error("authenticityScore außerhalb [0,1]");
  return { field: "auth.authenticityScore", value: score };
}
