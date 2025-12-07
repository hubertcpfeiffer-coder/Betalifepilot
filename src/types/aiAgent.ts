export interface LifeAdvisor {
  id: string;
  name: string;
  emoji: string;
  color: string;
  response?: string;
}

export interface RoundTableResponse {
  advisorResponses: LifeAdvisor[];
  summary: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'round_table';
  content: string;
  timestamp: Date;
  advisorResponses?: LifeAdvisor[];
  summary?: string;
}

export const LIFE_ADVISORS: LifeAdvisor[] = [
  { id: 'career', name: 'Karriere-Berater', emoji: '💼', color: '#3B82F6' },
  { id: 'health', name: 'Gesundheits-Coach', emoji: '🏃', color: '#10B981' },
  { id: 'finance', name: 'Finanz-Experte', emoji: '💰', color: '#F59E0B' },
  { id: 'relationships', name: 'Beziehungs-Berater', emoji: '❤️', color: '#EC4899' },
  { id: 'creativity', name: 'Kreativ-Mentor', emoji: '🎨', color: '#8B5CF6' },
];
