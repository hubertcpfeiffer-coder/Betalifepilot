// MIO-Lifepilot: Runder Tisch - Supabase Edge Function
// Fuenf KI-Berater parallel via Claude API
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

const ADVISORS = [
  { id: 'career', name: 'Karriere-Berater', emoji: '💼', color: '#3B82F6', systemPrompt: 'Du bist ein Karriere-Berater. Analysiere aus Sicht von Beruf und Zielen. Antworte Deutsch in 2-3 Saetzen.' },
  { id: 'health', name: 'Gesundheits-Coach', emoji: '🏃', color: '#10B981', systemPrompt: 'Du bist ein Gesundheits-Coach. Analysiere aus Sicht von Gesundheit. Antworte Deutsch in 2-3 Saetzen.' },
  { id: 'finance', name: 'Finanz-Experte', emoji: '💰', color: '#F59E0B', systemPrompt: 'Du bist ein Finanzberater. Analysiere aus Sicht von Budget. Antworte Deutsch in 2-3 Saetzen.' },
  { id: 'relationships', name: 'Beziehungs-Berater', emoji: '❤️', color: '#EC4899', systemPrompt: 'Du bist ein Beziehungs-Coach. Analysiere aus Sicht von Verbindungen. Antworte Deutsch in 2-3 Saetzen.' },
  { id: 'creativity', name: 'Kreativ-Mentor', emoji: '🎨', color: '#8B5CF6', systemPrompt: 'Du bist ein Kreativ-Mentor. Analysiere kreativ. Antworte Deutsch in 2-3 Saetzen.' },
];

async function callClaude(system, userMsg, apiKey, maxTokens = 300) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: maxTokens, system, messages: [{ role: 'user', content: userMsg }] }),
  });
  if (!r.ok) return null;
  const d = await r.json(); return d.content[0].text;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY fehlt' }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
    const { message, mode = 'chat', userKnowledge, iqProfile, conversationHistory = [] } = await req.json();
    if (!message?.trim()) return new Response(JSON.stringify({ error: 'Keine Nachricht' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } });
    const ctx = [iqProfile?.dominant_intelligence ? 'IQ: ' + iqProfile.dominant_intelligence : '', userKnowledge?.goals ? 'Ziele: ' + userKnowledge.goals : ''].filter(Boolean).join(', ');

    if (mode === 'round_table') {
      const results = await Promise.all(ADVISORS.map(async a => {
        const r = await callClaude(a.systemPrompt + (ctx ? ' Kontext: ' + ctx : ''), message, apiKey);
        return { ...a, response: r || a.emoji + ' Nicht verfuegbar.' };
      }));
      const summaryParts = results.map(a => a.name + ': ' + a.response).join(' | ');
      const summary = await callClaude('Du bist MIO. Fasse 5 Perspektiven zu 3-4 Saetzen zusammen. Deutsch.', 'Frage: "' + message + '" Perspektiven: ' + summaryParts, apiKey, 400) || 'Schau dir die Perspektiven an!';
      return new Response(JSON.stringify({ mode: 'round_table', advisorResponses: results, summary }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    }

    const msgs = [...conversationHistory.slice(-8).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })), { role: 'user', content: message }];
    const r2 = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST', headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 500, system: 'Du bist MIO, ein proaktiver KI-Lebensassistent. Hilf mit Karriere, Gesundheit, Finanzen, Beziehungen. Deutsch.' + (ctx ? ' Profil: ' + ctx : ''), messages: msgs }),
    });
    const response = r2.ok ? (await r2.json()).content[0].text : 'Kurzer Aussetzer - bitte nochmal!';
    return new Response(JSON.stringify({ mode: 'chat', response }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { ...CORS, 'Content-Type': 'application/json' } });
  }
});
