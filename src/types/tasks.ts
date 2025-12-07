export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskCategory = 'work' | 'personal' | 'health' | 'shopping' | 'finance' | 'social' | 'learning' | 'household' | 'other';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  due_date?: string;
  due_time?: string;
  repeat_type: RepeatType;
  repeat_interval: number;
  repeat_end_date?: string;
  ai_suggested: boolean;
  ai_priority_score?: number;
  ai_reasoning?: string;
  estimated_duration?: number;
  tags?: string[];
  parent_task_id?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskSuggestion {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
  due_date?: string;
  due_time?: string;
  reasoning: string;
  estimated_duration?: number;
}

export const TASK_CATEGORIES: { id: TaskCategory; label: string; icon: string; color: string }[] = [
  { id: 'work', label: 'Arbeit', icon: 'Briefcase', color: 'blue' },
  { id: 'personal', label: 'Persönlich', icon: 'User', color: 'purple' },
  { id: 'health', label: 'Gesundheit', icon: 'Heart', color: 'red' },
  { id: 'shopping', label: 'Einkaufen', icon: 'ShoppingCart', color: 'green' },
  { id: 'finance', label: 'Finanzen', icon: 'DollarSign', color: 'yellow' },
  { id: 'social', label: 'Soziales', icon: 'Users', color: 'pink' },
  { id: 'learning', label: 'Lernen', icon: 'BookOpen', color: 'indigo' },
  { id: 'household', label: 'Haushalt', icon: 'Home', color: 'orange' },
  { id: 'other', label: 'Sonstiges', icon: 'MoreHorizontal', color: 'gray' },
];

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  low: { label: 'Niedrig', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  medium: { label: 'Mittel', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  high: { label: 'Hoch', color: 'text-orange-600', bgColor: 'bg-orange-100' },
  urgent: { label: 'Dringend', color: 'text-red-600', bgColor: 'bg-red-100' },
};

export const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'none', label: 'Keine Wiederholung' },
  { value: 'daily', label: 'Täglich' },
  { value: 'weekly', label: 'Wöchentlich' },
  { value: 'monthly', label: 'Monatlich' },
  { value: 'yearly', label: 'Jährlich' },
];
