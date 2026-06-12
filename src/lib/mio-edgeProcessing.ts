/**
 * EdgeProcessing-Contract – Data-Minimization-Klassifizierung (Phase A).
 *
 * Definiert verbindlich, welche Datenklasse das Gerät verlassen darf und wie.
 * Dies ist die maschinenlesbare Umsetzung der Zero-Knowledge-Edge-Grenze:
 *
 *   neverLeaveEdge  → bleibt physisch im Browser/in der Enklave (Rohdaten)
 *   encryptedOnly   → nur als JWE/verschlüsselter Container, kurze TTL
 *   cloudAccessible → darf als Klartext-Feld in die Cloud (nur PII-freie Derivate)
 *
 * Norm-Bezug: EU AI Act Art. 10 (Data Governance), DSGVO Art. 9 (Biometrie),
 * ISO 27001 A.8 (Asset-/Krypto-Management).
 */

import { z } from "zod";

export const DataClass = z.enum(["neverLeaveEdge", "encryptedOnly", "cloudAccessible"]);
export type DataClass = z.infer<typeof DataClass>;

/** Ein klassifiziertes Datenfeld der MIO-Datenlandschaft. */
export interface FieldPolicy {
  /** Logischer Feldname / Pfad. */
  field: string;
  /** Erlaubte Datenklasse. */
  dataClass: DataClass;
  /** Begründung (Audit-Spur). */
  rationale: string;
}

/**
 * Verbindliche Klassifizierungs-Tabelle für Phase A.
 * Neue Felder MÜSSEN hier eingetragen werden, bevor sie verarbeitet werden
 * (Default-Deny über `classifyField`).
 */
export const FIELD_POLICIES: readonly FieldPolicy[] = [
  // --- neverLeaveEdge: Rohdaten, verlassen das Gerät nie -----------------
  { field: "biometric.raw", dataClass: "neverLeaveEdge", rationale: "DSGVO Art. 9 – biometrische Rohdaten" },
  { field: "behavior.keystroke", dataClass: "neverLeaveEdge", rationale: "Tippdynamik-Rohdaten – nur lokal" },
  { field: "behavior.mouse", dataClass: "neverLeaveEdge", rationale: "Mausdynamik-Rohdaten – nur lokal" },
  { field: "behavior.gaze", dataClass: "neverLeaveEdge", rationale: "Blickdynamik-Rohdaten – nur lokal" },
  { field: "vault.masterKey", dataClass: "neverLeaveEdge", rationale: "Schlüsselmaterial verlässt die Enklave nie" },

  // --- encryptedOnly: nur verschlüsselt, kurze Lebensdauer ---------------
  { field: "personality.embedding", dataClass: "encryptedOnly", rationale: "INT8 + Laplace-DP + JWE, TTL 300s" },
  { field: "biometric.template", dataClass: "encryptedOnly", rationale: "Cancelable Template (BioHashing)" },

  // --- cloudAccessible: nur PII-freie Derivate ---------------------------
  { field: "auth.authenticityScore", dataClass: "cloudAccessible", rationale: "Abgeleiteter Score 0..1, kein Rohdatum" },
  { field: "action.vector", dataClass: "cloudAccessible", rationale: "ActionVector – Zod-validiert, PII-frei (MIO-002)" },
  { field: "world.stateChecksum", dataClass: "cloudAccessible", rationale: "SHA-256-Checksum, kein Inhalt" },
] as const;

const POLICY_INDEX = new Map(FIELD_POLICIES.map((p) => [p.field, p]));

/**
 * Klassifiziert ein Feld. Unbekannte Felder gelten als `neverLeaveEdge`
 * (Default-Deny) – ein Feld muss explizit freigegeben werden, um die Edge
 * zu verlassen.
 */
export function classifyField(field: string): FieldPolicy {
  return (
    POLICY_INDEX.get(field) ?? {
      field,
      dataClass: "neverLeaveEdge",
      rationale: "Default-Deny: nicht klassifiziert → bleibt auf dem Gerät",
    }
  );
}

/** True, wenn das Feld die Edge in IRGENDEINER Form verlassen darf. */
export function mayLeaveEdge(field: string): boolean {
  return classifyField(field).dataClass !== "neverLeaveEdge";
}

/** True, wenn das Feld unverschlüsselt in die Cloud darf. */
export function mayGoCloudPlaintext(field: string): boolean {
  return classifyField(field).dataClass === "cloudAccessible";
}

/** Spezifikation des verschlüsselten Personality-Containers (Phase A). */
export const PersonalityContainerSpec = z.object({
  /** JSON Web Encryption Compact Serialization. */
  format: z.literal("JWE"),
  enc: z.literal("A256GCM"),
  /** INT8-Quantisierung des Embeddings. */
  quantization: z.literal("INT8"),
  /** Differential Privacy: Laplace-Mechanismus, ε ≤ 0.1. */
  dpEpsilon: z.number().min(0).max(0.1),
  /** Time-to-live in Sekunden (max. 300s). */
  ttlSeconds: z.number().int().positive().max(300),
});
export type PersonalityContainerSpec = z.infer<typeof PersonalityContainerSpec>;
