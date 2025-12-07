export interface FamilyMember {
  name: string;
  relationship: string;
  birthday?: string;
}

export interface Pet {
  name: string;
  type: string;
  breed?: string;
}

export interface SleepSchedule {
  bedtime: string;
  wakeTime: string;
  hoursNeeded: number;
}

export interface ShoppingPreferences {
  preferOnline: boolean;
  favoriteStores: string[];
  priceConscious: boolean;
}

export interface ImportantDate {
  date: string;
  description: string;
  recurring: boolean;
}

export interface UserKnowledgeProfile {
  id?: string;
  user_id: string;
  nickname?: string;
  birth_date?: string;
  gender?: string;
  relationship_status?: string;
  phone?: string;
  city?: string;
  country?: string;
  timezone?: string;
  occupation?: string;
  company?: string;
  work_schedule?: string;
  income_range?: string;
  personality_traits?: string[];
  communication_style?: string;
  languages?: string[];
  hobbies?: string[];
  interests?: string[];
  favorite_music?: string[];
  favorite_movies?: string[];
  favorite_books?: string[];
  sports?: string[];
  dietary_preferences?: string[];
  allergies?: string[];
  health_goals?: string[];
  sleep_schedule?: SleepSchedule;
  fitness_level?: string;
  short_term_goals?: string[];
  long_term_goals?: string[];
  life_dreams?: string[];
  family_members?: FamilyMember[];
  close_friends?: FamilyMember[];
  pets?: Pet[];
  morning_routine?: string;
  evening_routine?: string;
  work_routine?: string;
  favorite_brands?: string[];
  shopping_preferences?: ShoppingPreferences;
  budget_priorities?: string[];
  important_dates?: ImportantDate[];
  notes?: string;
  completeness_score?: number;
  last_updated?: string;
  created_at?: string;
}

export const KNOWLEDGE_CATEGORIES = [
  { id: 'personal', label: 'Persönliches', icon: 'User' },
  { id: 'work', label: 'Beruf', icon: 'Briefcase' },
  { id: 'interests', label: 'Interessen', icon: 'Heart' },
  { id: 'health', label: 'Gesundheit', icon: 'Activity' },
  { id: 'goals', label: 'Ziele', icon: 'Target' },
  { id: 'people', label: 'Menschen', icon: 'Users' },
  { id: 'routines', label: 'Routinen', icon: 'Clock' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag' },
] as const;
