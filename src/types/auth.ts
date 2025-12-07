export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  interests?: string[];
  location?: string;
  created_at?: string;
  last_login?: string;
  phone?: string;
  role?: 'user' | 'admin' | 'moderator' | 'beta_tester';
  status?: 'active' | 'suspended' | 'banned' | 'pending_review' | 'approved';
  email_verified?: boolean;
  is_beta_tester?: boolean;
  beta_approved_at?: string;
  beta_approved_by?: string;
  onboarding_completed?: boolean;
  avatar_setup_completed?: boolean;
  avatar_photos?: string[];
  avatar_style_preferences?: {
    style: string;
    voiceStyle: string;
    personalityTraits: string[];
    speakingStyle: string;
  };
  personal_avatar_url?: string;
}




export interface MioProfile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url?: string;
  avatar_style?: string;
  ai_preferences?: {
    personality: string;
    communication_style: string;
    proactivity_level: number;
  };
  connected_services?: string[];
  goals?: string[];
  life_areas?: {
    organisation: boolean;
    health: boolean;
    success: boolean;
    learning: boolean;
  };
}

export interface UserSettings {
  id: string;
  user_id: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  profile_visibility: string;
  theme: string;
  language: string;
  face_recognition_enabled?: boolean;
  voice_recognition_enabled?: boolean;
  ai_autonomy_level?: 'low' | 'medium' | 'high';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AICoach {
  id: string;
  name: string;
  type: 'success' | 'health' | 'knowledge';
  description: string;
  icon: string;
  color: string;
  features: string[];
}

export interface OrganisationModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  lastSync?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}
