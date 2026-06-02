// MIO-Lifepilot: aiService.ts
// Zentraler KI-Service — ruft die Supabase Edge Function auf

import { supabase } from '@/lib/supabase';
import { LifeAdvisor } from '@/types/aiAgent';

export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  userKnowledge?: Record<string, unknown>;
  iqProfile?: Record<string, unknown>;
}

export interface ChatResponse {
  mode: 'chat';
  response: string;
}

export interface RoundTableResponse {
  mode: 'round_table';
  advisorResponses: LifeAdvisor[];
  summary: string;
}

export type AIResponse = ChatResponse | RoundTableResponse;

export class AIServiceError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = 'AIServiceError';
  }
}

export async function sendMessage(request: ChatRequest & { mode?: 'chat' | 'round_table' }): Promise<AIResponse> {
  const { data, error } = await supabase.functions.invoke('round-table-ai', {
    body: {
      message: request.message,
      mode: request.mode ?? 'chat',
      userKnowledge: request.userKnowledge ?? null,
      iqProfile: request.iqProfile ?? null,
      conversationHistory: request.conversationHistory ?? [],
    },
  });
  if (error) throw new AIServiceError(`KI-Anfrage fehlgeschlagen: ${error.message}`, 'EDGE_FUNCTION_ERROR');
  if (!data) throw new AIServiceError('Keine Antwort vom KI-Service erhalten', 'EMPTY_RESPONSE');
  return data as AIResponse;
}

export async function chat(message: string, options?: Omit<ChatRequest, 'message'>): Promise<string> {
  const result = await sendMessage({ message, mode: 'chat', ...options });
  if (result.mode === 'chat') return result.response;
  throw new AIServiceError('Unerwarteter Antwort-Modus');
}

export async function roundTable(message: string, options?: Omit<ChatRequest, 'message'>): Promise<RoundTableResponse> {
  const result = await sendMessage({ message, mode: 'round_table', ...options });
  if (result.mode === 'round_table') return result;
  throw new AIServiceError('Unerwarteter Antwort-Modus');
}

export async function suggestTasks(userKnowledge: Record<string, unknown>, iqProfile?: Record<string, unknown>): Promise<string[]> {
  const prompt = `Schlage 3 konkrete, umsetzbare Aufgaben für heute vor. Nur nummerierte Liste, kein Text drumherum. Format: "1. Aufgabe"`;
  try {
    const response = await chat(prompt, { userKnowledge, iqProfile });
    return response.split('\n').filter(l => /^\d+\./.test(l.trim())).map(l => l.replace(/^\d+\.\s*/, '').trim()).filter(Boolean).slice(0, 3);
  } catch { return ['Plane deinen Tag', 'Überprüfe deine Ziele', 'Lerne etwas Neues']; }
}

export async function getDailyGreeting(userName: string, userKnowledge?: Record<string, unknown>): Promise<string> {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'Morgen' : hour < 18 ? 'Nachmittag' : 'Abend';
  const prompt = `Kurze, motivierende Begrüßung für ${userName} am ${timeOfDay} (1-2 Sätze, persönlich und warm).`;
  try { return await chat(prompt, { userKnowledge }); }
  catch { return `Guten ${timeOfDay}, ${userName}! Wie kann ich dir heute helfen?`; }
}
