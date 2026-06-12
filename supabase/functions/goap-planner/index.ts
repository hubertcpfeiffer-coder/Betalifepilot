// MIO-Lifepilot: supabase/functions/goap-planner/index.ts
// Validierender GOAP-Gateway (Phase A Integration).
//
// Nimmt einen ActionVector entgegen, validiert ihn deterministisch
// (Schema -> SIL -> PII-Tripwire -> Veto), und gibt einen SIL-gated
// Ausfuehrungsplan zurueck. SIL2/SIL3 werden NIE autonom ausgefuehrt,
// sondern als genehmigungspflichtig markiert (EU AI Act Art. 14).
//
// Kanonische Schema-Quelle: packages/contracts (@mio/contracts).
// Hier vendored, da Deno-Edge-Functions kein node_modules nutzen.
//
// Norm-Bezug: EU AI Act Art. 10 + 14, ISO 27001 A.8.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "https://esm.sh/zod@3.23.8";

const MAX_STRING_LEN = 256;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const PHONE_RE = /(?:\+?\d[\s\-()]?){7,}/;
const IBAN_RE = /\b[A-Z]{2}\d{2}[A-Z0-9]{10,30}\b/;

function scanForPii(value: unknown, path = "$"): string[] {
  const out: string[] = [];
  if (typeof value === "string") {
    if (value.length > MAX_STRING_LEN) out.push(`${path}: Freitext > ${MAX_STRING_LEN}`);
    if (EMAIL_RE.test(value)) out.push(`${path}: E-Mail`);
    if (IBAN_RE.test(value)) out.push(`${path}: IBAN`);
    if (PHONE_RE.test(value)) out.push(`${path}: Telefon`);
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => out.push(...scanForPii(v, `${path}[${i}]`)));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) out.push(...scanForPii(v, `${path}.${k}`));
  }
  return out;
}

const OpaqueId = z.string().min(8).max(128).regex(/^[A-Za-z0-9._-]+$/);
const SafetyLevel = z.enum(["SIL1", "SIL2", "SIL3"]);

const ActionVector = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    id: OpaqueId,
    issuedAt: z.string().datetime(),
    module: z.enum([
      "health", "finance", "learning", "productivity", "social", "contacts",
      "coaching", "avatar", "products", "social_media", "mail", "robot",
    ]),
    actionType: z.string().min(2).max(64).regex(/^[a-z][a-z0-9_]*$/),
    sil: SafetyLevel,
    payload: z
      .record(z.string(), z.union([z.number(), z.boolean(), z.string().max(MAX_STRING_LEN)]))
      .superRefine((p, ctx) => {
        for (const f of scanForPii(p, "payload"))
          ctx.addIssue({ code: z.ZodIssueCode.custom, message: `PII-Tripwire: ${f}` });
      }),
    authenticityScore: z.number().min(0).max(1),
    requiresHumanApproval: z.boolean(),
    vetoable: z.boolean(),
    provenance: z.object({ planId: OpaqueId, goalId: OpaqueId }),
    ttlMs: z.number().int().positive().max(60000),
  })
  .superRefine((v, ctx) => {
    if ((v.sil === "SIL2" || v.sil === "SIL3") && !v.requiresHumanApproval)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["requiresHumanApproval"], message: "SIL2/3 erfordert Human-Approval" });
    if ((v.sil === "SIL2" || v.sil === "SIL3") && !v.vetoable)
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["vetoable"], message: "SIL2/3 muss vetoable sein" });
    if (v.module === "robot" && v.sil !== "SIL3")
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["sil"], message: "Modul robot = SIL3" });
  });

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const body = await req.json();
    const parsed = ActionVector.safeParse(body?.actionVector ?? body);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ ok: false, error: "INVALID_ACTION_VECTOR", issues: parsed.error.issues }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } },
      );
    }
    const v = parsed.data;

    // Deterministischer Plan-Envelope. (A*-Planung folgt in spaeterer Phase.)
    const steps = planForAction(v.module, v.actionType, v.payload);
    const autoExecutable = v.sil === "SIL1" && !v.requiresHumanApproval;

    return new Response(
      JSON.stringify({
        ok: true,
        plan: {
          forVectorId: v.id,
          module: v.module,
          actionType: v.actionType,
          sil: v.sil,
          steps,
          status: autoExecutable ? "ready_to_execute" : "awaiting_human_approval",
          vetoable: v.vetoable,
          expiresAt: new Date(Date.parse(v.issuedAt) + v.ttlMs).toISOString(),
        },
      }),
      { status: 200, headers: { ...CORS, "Content-Type": "application/json" } },
    );
  } catch (_e) {
    return new Response(JSON.stringify({ ok: false, error: "BAD_REQUEST" }), {
      status: 400, headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});

// Minimaler, deterministischer Aktions-zu-Schritte-Mapper (Health-MVP).
function planForAction(module: string, actionType: string, payload: Record<string, unknown>): string[] {
  if (module === "health") {
    switch (actionType) {
      case "remind_workout":
        return [
          `Erinnerung planen (${payload.durationMin ?? 30} min)`,
          "Benachrichtigung an Avatar senden",
          "Nach Bestaetigung: Streak aktualisieren",
        ];
      case "track_water":
        return [`Wasseraufnahme erfassen (${payload.amountMl ?? 250} ml)`, "Tagesziel-Fortschritt aktualisieren"];
      case "optimize_sleep":
        return ["Schlaffenster vorschlagen", "Bildschirmzeit-Hinweis setzen"];
      default:
        return [`Health-Aktion '${actionType}' vormerken`, "Human-Review anfordern"];
    }
  }
  return [`Aktion '${actionType}' (${module}) vormerken`];
}
