export interface IQQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IQTestCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questions: IQQuestion[];
}

export interface IQTestResult {
  id?: string;
  user_id: string;
  test_category: string;
  score: number;
  max_score: number;
  percentage: number;
  questions_answered: number;
  correct_answers: number;
  time_taken_seconds?: number;
  completed_at?: string;
}

export interface IQProfile {
  id?: string;
  user_id: string;
  logical_thinking: number;
  verbal_intelligence: number;
  mathematical_ability: number;
  spatial_reasoning: number;
  emotional_intelligence: number;
  creativity: number;
  memory: number;
  general_knowledge: number;
  overall_iq_estimate?: number;
  strengths?: string[];
  areas_to_improve?: string[];
  total_tests_taken: number;
  last_test_at?: string;
}

export const IQ_CATEGORIES = [
  { id: 'logical', name: 'Logisches Denken', icon: 'Puzzle', color: 'from-purple-500 to-indigo-600' },
  { id: 'verbal', name: 'Sprachliche Intelligenz', icon: 'BookOpen', color: 'from-blue-500 to-cyan-600' },
  { id: 'math', name: 'Mathematik', icon: 'Calculator', color: 'from-green-500 to-emerald-600' },
  { id: 'spatial', name: 'Räumliches Denken', icon: 'Box', color: 'from-orange-500 to-red-600' },
  { id: 'emotional', name: 'Emotionale Intelligenz', icon: 'Heart', color: 'from-pink-500 to-rose-600' },
  { id: 'creativity', name: 'Kreativität', icon: 'Palette', color: 'from-yellow-500 to-amber-600' },
  { id: 'memory', name: 'Gedächtnis', icon: 'Brain', color: 'from-teal-500 to-cyan-600' },
  { id: 'knowledge', name: 'Allgemeinwissen', icon: 'Globe', color: 'from-slate-500 to-gray-600' },
] as const;
