export interface OnboardingStep {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  reward_points: number;
  reward_badge?: string;
  order: number;
  sort_order?: number;
  required: boolean;
  active?: boolean;
  category?: string;
  estimated_time_minutes?: number;
  prerequisites?: string[];
}

export interface UserOnboardingProgress {
  id: string;
  user_id: string;
  step_key: string;
  completed: boolean;
  completed_at?: string;
  started_at?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UserOnboardingReward {
  id: string;
  user_id: string;
  badge_id: string;
  badge_name?: string;
  badge_icon?: string;
  points_earned: number;
  earned_at: string;
  source_step_key?: string;
  created_at: string;
}

export interface OnboardingProgressSummary {
  user_id: string;
  total_steps: number;
  completed_steps: number;
  progress_percentage: number;
  total_points: number;
  earned_points: number;
  badges: string[];
  steps: OnboardingStepStatus[];
  onboarding_completed: boolean;
  started_at?: string;
  completed_at?: string;
}

export interface OnboardingStepStatus extends OnboardingStep {
  completed: boolean;
  completed_at?: string;
}

export interface OnboardingReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  badge_image?: string;
  unlocked: boolean;
  unlocked_at?: string;
}

export interface AdminOnboardingOverview {
  total_beta_testers: number;
  completed_onboarding: number;
  in_progress: number;
  not_started: number;
  average_progress: number;
  step_completion_rates: StepCompletionRate[];
  users_progress: UserOnboardingOverview[];
}

export interface StepCompletionRate {
  step_key: string;
  step_title: string;
  completed_count: number;
  total_users: number;
  completion_rate: number;
}

export interface UserOnboardingOverview {
  user_id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  progress_percentage: number;
  completed_steps: number;
  total_steps: number;
  earned_points: number;
  last_activity?: string;
  created_at: string;
  status: 'not_started' | 'in_progress' | 'completed';
}

// Default onboarding steps (matching database schema)
export const DEFAULT_ONBOARDING_STEPS: Omit<OnboardingStep, 'id'>[] = [
  {
    key: 'welcome',
    title: 'Willkommen bei Mio',
    description: 'Lerne deinen persönlichen KI-Assistenten kennen',
    icon: 'Sparkles',
    reward_points: 10,
    reward_badge: 'welcome_badge',
    order: 1,
    required: true,
    active: true,
    category: 'introduction',
    estimated_time_minutes: 2
  },
  {
    key: 'profile_setup',
    title: 'Profil einrichten',
    description: 'Erzähle uns etwas über dich',
    icon: 'User',
    reward_points: 20,
    reward_badge: 'profile_badge',
    order: 2,
    required: true,
    active: true,
    category: 'setup',
    estimated_time_minutes: 5
  },
  {
    key: 'avatar_photos',
    title: 'Fotos hochladen',
    description: 'Lade Fotos für deinen personalisierten Avatar hoch',
    icon: 'Camera',
    reward_points: 30,
    reward_badge: 'photo_badge',
    order: 3,
    required: false,
    active: true,
    category: 'avatar',
    estimated_time_minutes: 5
  },
  {
    key: 'avatar_style',
    title: 'Avatar-Stil wählen',
    description: 'Wähle den Stil für deinen KI-Avatar',
    icon: 'Palette',
    reward_points: 25,
    reward_badge: 'style_badge',
    order: 4,
    required: false,
    active: true,
    category: 'avatar',
    estimated_time_minutes: 3
  },
  {
    key: 'avatar_voice',
    title: 'Stimme auswählen',
    description: 'Wähle die Stimme für deinen Avatar',
    icon: 'Mic',
    reward_points: 20,
    reward_badge: 'voice_badge',
    order: 5,
    required: false,
    active: true,
    category: 'avatar',
    estimated_time_minutes: 2
  },
  {
    key: 'avatar_personality',
    title: 'Persönlichkeit definieren',
    description: 'Definiere die Persönlichkeit deines Avatars',
    icon: 'Heart',
    reward_points: 25,
    reward_badge: 'personality_badge',
    order: 6,
    required: false,
    active: true,
    category: 'avatar',
    estimated_time_minutes: 5
  },
  {
    key: 'knowledge_interests',
    title: 'Interessen angeben',
    description: 'Teile deine Interessen mit Mio',
    icon: 'Star',
    reward_points: 15,
    reward_badge: 'interests_badge',
    order: 7,
    required: false,
    active: true,
    category: 'knowledge',
    estimated_time_minutes: 3
  },
  {
    key: 'knowledge_goals',
    title: 'Ziele setzen',
    description: 'Definiere deine persönlichen Ziele',
    icon: 'Target',
    reward_points: 20,
    reward_badge: 'goals_badge',
    order: 8,
    required: false,
    active: true,
    category: 'knowledge',
    estimated_time_minutes: 5
  },
  {
    key: 'first_task',
    title: 'Erste Aufgabe erstellen',
    description: 'Erstelle deine erste Aufgabe mit Mio',
    icon: 'CheckSquare',
    reward_points: 15,
    reward_badge: 'task_badge',
    order: 9,
    required: false,
    active: true,
    category: 'features',
    estimated_time_minutes: 2
  },
  {
    key: 'voice_test',
    title: 'Sprachsteuerung testen',
    description: 'Teste die Sprachsteuerung von Mio',
    icon: 'Volume2',
    reward_points: 20,
    reward_badge: 'voice_control_badge',
    order: 10,
    required: false,
    active: true,
    category: 'features',
    estimated_time_minutes: 3
  },
  {
    key: 'round_table',
    title: 'Round Table entdecken',
    description: 'Entdecke die KI-Experten am Round Table',
    icon: 'Users',
    reward_points: 25,
    reward_badge: 'round_table_badge',
    order: 11,
    required: false,
    active: true,
    category: 'features',
    estimated_time_minutes: 5
  },
  {
    key: 'completion',
    title: 'Onboarding abgeschlossen',
    description: 'Du hast das Onboarding erfolgreich abgeschlossen!',
    icon: 'Award',
    reward_points: 50,
    reward_badge: 'completion_badge',
    order: 12,
    required: true,
    active: true,
    category: 'completion',
    estimated_time_minutes: 1
  }
];

export const ONBOARDING_BADGES: Record<string, OnboardingReward> = {
  welcome_badge: {
    id: 'welcome_badge',
    name: 'Willkommen',
    description: 'Du hast Mio kennengelernt',
    icon: 'Sparkles',
    points_required: 10,
    unlocked: false
  },
  profile_badge: {
    id: 'profile_badge',
    name: 'Profil-Meister',
    description: 'Du hast dein Profil eingerichtet',
    icon: 'User',
    points_required: 20,
    unlocked: false
  },
  photo_badge: {
    id: 'photo_badge',
    name: 'Fotograf',
    description: 'Du hast Fotos für deinen Avatar hochgeladen',
    icon: 'Camera',
    points_required: 30,
    unlocked: false
  },
  style_badge: {
    id: 'style_badge',
    name: 'Stilbewusst',
    description: 'Du hast deinen Avatar-Stil gewählt',
    icon: 'Palette',
    points_required: 25,
    unlocked: false
  },
  voice_badge: {
    id: 'voice_badge',
    name: 'Stimm-Experte',
    description: 'Du hast eine Stimme für deinen Avatar gewählt',
    icon: 'Mic',
    points_required: 20,
    unlocked: false
  },
  personality_badge: {
    id: 'personality_badge',
    name: 'Persönlichkeits-Designer',
    description: 'Du hast die Persönlichkeit deines Avatars definiert',
    icon: 'Heart',
    points_required: 25,
    unlocked: false
  },
  interests_badge: {
    id: 'interests_badge',
    name: 'Interessen-Entdecker',
    description: 'Du hast deine Interessen geteilt',
    icon: 'Star',
    points_required: 15,
    unlocked: false
  },
  goals_badge: {
    id: 'goals_badge',
    name: 'Zielstrebig',
    description: 'Du hast deine Ziele definiert',
    icon: 'Target',
    points_required: 20,
    unlocked: false
  },
  task_badge: {
    id: 'task_badge',
    name: 'Aufgaben-Starter',
    description: 'Du hast deine erste Aufgabe erstellt',
    icon: 'CheckSquare',
    points_required: 15,
    unlocked: false
  },
  voice_control_badge: {
    id: 'voice_control_badge',
    name: 'Sprach-Pionier',
    description: 'Du hast die Sprachsteuerung getestet',
    icon: 'Volume2',
    points_required: 20,
    unlocked: false
  },
  round_table_badge: {
    id: 'round_table_badge',
    name: 'Round Table Mitglied',
    description: 'Du hast den Round Table entdeckt',
    icon: 'Users',
    points_required: 25,
    unlocked: false
  },
  completion_badge: {
    id: 'completion_badge',
    name: 'Onboarding-Champion',
    description: 'Du hast das Onboarding abgeschlossen',
    icon: 'Award',
    points_required: 50,
    unlocked: false
  },
  onboarding_champion: {
    id: 'onboarding_champion',
    name: 'Mio-Meister',
    description: 'Du hast alle erforderlichen Schritte abgeschlossen',
    icon: 'Trophy',
    points_required: 80,
    unlocked: false
  },
  completionist: {
    id: 'completionist',
    name: 'Perfektionist',
    description: 'Du hast alle Onboarding-Schritte abgeschlossen',
    icon: 'Medal',
    points_required: 275,
    unlocked: false
  }
};

// Category labels for grouping steps
export const ONBOARDING_CATEGORIES: Record<string, { name: string; icon: string; description: string }> = {
  introduction: {
    name: 'Einführung',
    icon: 'Sparkles',
    description: 'Lerne Mio kennen'
  },
  setup: {
    name: 'Einrichtung',
    icon: 'Settings',
    description: 'Richte dein Profil ein'
  },
  avatar: {
    name: 'Avatar',
    icon: 'User',
    description: 'Erstelle deinen persönlichen Avatar'
  },
  knowledge: {
    name: 'Wissen',
    icon: 'Brain',
    description: 'Teile dein Wissen mit Mio'
  },
  features: {
    name: 'Funktionen',
    icon: 'Zap',
    description: 'Entdecke die Funktionen von Mio'
  },
  completion: {
    name: 'Abschluss',
    icon: 'Award',
    description: 'Schließe das Onboarding ab'
  }
};
