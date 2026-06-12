/**
 * ActionVector – die EINZIGE ausgehende Datenstruktur (MIO-002).
 *
 * Phase A · Zero-Knowledge-Edge: Verhaltens- und Biometrie-Rohdaten verlassen das
 * Gerät NIE. Was die Edge-Enklave verlässt, ist ausschließlich ein anonymisierter
 * Handlungsvektor (ActionVector): strukturiert, Zod-validiert, PII-frei.
 *
 * Norm-Bezug: EU AI Act Art. 10 (Data Governance / Minimization), ISO 27001 A.8.
 *
 * Architektur-neutral: läuft im Vite-Frontend UND in Supabase Deno Edge Functions.
 */

import { z } from "zod";

/** Schema-Version – erzwingt explizite Migration bei Feldänderungen. */
export const ACTION_VECTOR_SCHEMA_VERSION = "1.0.0" as const;

/** Die 12 Modul-Scopes (11 Produktmodule + Roboter). */
export const ModuleScope = z.enum([
  "health",
  "finance",
  "learning",
  "productivity",
  "social",
  "contacts",
  "coaching",
  "avatar",
  "products",
  "social_media",
  "mail",
  "robot",
]);
export type ModuleScope = z.infer<typeof ModuleScope>;

/**
 * Safety Integrity Level.
 * SIL1 = autonom · SIL2 = Human-in-the-Loop · SIL3 = physisch (Roboter), Veto zwingend.
 */
export const SafetyLevel = z.enum(["SIL1", "SIL2", "SIL3"]);
export type SafetyLevel = z.infer<typeof SafetyLevel>;

/**
 * Opaque-ID: serverseitig deterministisch, ohne Personenbezug.
 * Erlaubt sind UUID v4 oder gehashte Tokens (hex/base64url, >= 8 Zeichen).
 * Klartext-Identifikatoren (E-Mail, Name) sind hier strukturell ausgeschlossen.
 */
export const OpaqueId = z
  .string()
  .min(8)
  .max(128)
  .regex(/^[A-Za-z0-9._-]+$/, "OpaqueId darf nur [A-Za-z0-9._-] enthalten (kein Klartext-PII)");
export type OpaqueId = z.infer<typeof OpaqueId>;

// ---------------------------------------------------------------------------
// PII-Tripwire: laufzeitseitige Data-Minimization-Control.
// Verhindert, dass versehentlich Klartext-PII in den Payload gelangt.
// ---------------------------------------------------------------------------

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?\d[\s\-()]?){7,}/;
const IBAN_RE = /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/;
/** Sehr lange Freitext-Strings sind ein Indikator für unstrukturierte (potenziell PII-) Daten. */
const MAX_STRING_LEN = 256;

export type PiiFinding = { path: string; reason: string };

/** Prüft einen beliebigen Wert rekursiv auf Klartext-PII-Indikatoren. */
export function scanForPii(value: unknown, path = "$"): PiiFinding[] {
  const findings: PiiFinding[] = [];
  if (typeof value === "string") {
    if (value.length > MAX_STRING_LEN)
      findings.push({ path, reason: `String > ${MAX_STRING_LEN} Zeichen (Freitext-Risiko)` });
    if (EMAIL_RE.test(value)) findings.push({ path, reason: "E-Mail-Adresse erkannt" });
    if (IBAN_RE.test(value)) findings.push({ path, reason: "IBAN erkannt" });
    if (PHONE_RE.test(value)) findings.push({ path, reason: "Telefonnummer erkannt" });
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => findings.push(...scanForPii(v, `${path}[${i}]`)));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) findings.push(...scanForPii(v, `${path}.${k}`));
  }
  return findings;
}

/**
 * Payload eines ActionVector: ausschließlich primitive, strukturierte Werte.
 * Keine verschachtelten Objekte mit Freitext – nur Zahl/Bool/kurze Enum-Strings/OpaqueId.
 * Der PII-Tripwire (.superRefine) blockiert Klartext-PII zur Laufzeit.
 */
export const ActionPayload = z
  .record(z.string(), z.union([z.number(), z.boolean(), z.string().max(MAX_STRING_LEN), OpaqueId]))
  .superRefine((payload, ctx) => {
    for (const f of scanForPii(payload, "payload")) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `PII-Tripwire: ${f.reason} @ ${f.path}` });
    }
  });
export type ActionPayload = z.infer<typeof ActionPayload>;

/** Optionale ECDSA-Signatur – erst in Phase B (Neuraverse-Bridge) zwingend. */
export const VectorSignature = z.object({
  alg: z.literal("ES256"),
  /** base64url-codierte Signatur über den kanonisierten Vektor (ohne dieses Feld). */
  value: z.string().min(1),
  keyId: OpaqueId,
});
export type VectorSignature = z.infer<typeof VectorSignature>;

/**
 * ActionVector – kanonische, PII-freie Repräsentation einer geplanten Handlung.
 */
export const ActionVector = z
  .object({
    schemaVersion: z.literal(ACTION_VECTOR_SCHEMA_VERSION),
    /** Eindeutige ID dieses Vektors (UUID/Opaque). */
    id: OpaqueId,
    /** Erzeugungszeitpunkt (UTC, ISO-8601). Kein Personenbezug. */
    issuedAt: z.string().datetime(),
    module: ModuleScope,
    /** Aktionstyp aus der ActionLibrary, z. B. "remind_workout", "grasp". */
    actionType: z
      .string()
      .min(2)
      .max(64)
      .regex(/^[a-z][a-z0-9_]*$/, "actionType: snake_case, keine Freitext-/PII-Werte"),
    sil: SafetyLevel,
    /** Strukturierte, PII-freie Parameter der Aktion. */
    payload: ActionPayload,
    /** Aus Behavioral-Auth abgeleiteter Score (0..1) – nur das Derivat, nie Rohdaten. */
    authenticityScore: z.number().min(0).max(1),
    /** True bei SIL2/SIL3 – muss vor Ausführung bestätigt werden. */
    requiresHumanApproval: z.boolean(),
    /** Nutzer-Veto-fähig (MIO-004). Für SIL2/SIL3 immer true. */
    vetoable: z.boolean(),
    /** Herkunft – opake Verweise auf GOAP-Plan/Goal, kein Inhalt. */
    provenance: z.object({ planId: OpaqueId, goalId: OpaqueId }),
    /** Gültigkeitsdauer in ms; abgelaufene Vektoren werden verworfen. */
    ttlMs: z.number().int().positive().max(60_000),
    signature: VectorSignature.optional(),
  })
  .superRefine((v, ctx) => {
    // Sicherheits-Invarianten (deterministisch, nicht LLM-abhängig – MIO-003).
    if ((v.sil === "SIL2" || v.sil === "SIL3") && !v.requiresHumanApproval) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["requiresHumanApproval"],
        message: "SIL2/SIL3 erfordert requiresHumanApproval=true (EU AI Act Art. 14).",
      });
    }
    if ((v.sil === "SIL2" || v.sil === "SIL3") && !v.vetoable) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vetoable"],
        message: "SIL2/SIL3 muss vetoable=true sein (Nutzer-Veto, MIO-004).",
      });
    }
    if (v.module === "robot" && v.sil !== "SIL3") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["sil"],
        message: "Modul 'robot' ist zwingend SIL3.",
      });
    }
    if (v.module === "robot" && !v.signature) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["signature"],
        message: "Physische Roboter-Aktionen erfordern eine ES256-Signatur (Phase B).",
      });
    }
  });
export type ActionVector = z.infer<typeof ActionVector>;

/**
 * Validiert und parst einen unbekannten Wert als ActionVector.
 * Wirft ZodError mit detaillierten Issues (inkl. PII-Tripwire) bei Verstoß.
 */
export function parseActionVector(input: unknown): ActionVector {
  return ActionVector.parse(input);
}

/** Safe-Variante ohne throw. */
export function safeParseActionVector(input: unknown) {
  return ActionVector.safeParse(input);
}
