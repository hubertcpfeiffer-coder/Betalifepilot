export interface UserAvatar {
  id: string;
  user_id: string;
  photo_urls: string[];
  front_photo_url?: string;
  left_photo_url?: string;
  right_photo_url?: string;
  generated_avatar_url?: string;
  voice_sample_url?: string;
  avatar_style: 'realistic' | 'cartoon' | 'anime' | '3d' | 'minimalist';
  voice_style: 'natural' | 'professional' | 'friendly' | 'energetic';
  personality_traits: string[];
  speaking_style: string;
  clothing_style?: string;
  background_style?: string;
  accessories?: string[];
  custom_colors?: Record<string, string>;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}



export interface UserProfile {
  id: string;
  user_id: string;
  avatar_setup_completed: boolean;
  avatar_photos: string[];
  avatar_style_preferences: AvatarStylePreferences;
  display_name?: string;
  bio?: string;
  timezone?: string;
  language: string;
  onboarding_completed: boolean;
  onboarding_completed_at?: string;
  total_reward_points: number;
  created_at: string;
  updated_at: string;
}

export interface AvatarStylePreferences {
  style?: string;
  voiceStyle?: string;
  personalityTraits?: string[];
  speakingStyle?: string;
  clothing?: string;
  background?: string;
  accessories?: string[];
}

export interface AvatarSetupStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

export interface PhotoCapture {
  type: 'front' | 'left' | 'right';
  label: string;
  instruction: string;
  captured: boolean;
  dataUrl?: string;
}

export interface AvatarStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface VoiceStyle {
  id: string;
  name: string;
  description: string;
}

export interface ClothingStyle {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface BackgroundStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
}

export interface Accessory {
  id: string;
  name: string;
  category: 'glasses' | 'hat' | 'jewelry' | 'other';
  icon: string;
}

export const AVATAR_STYLES: AvatarStyle[] = [
  { id: 'realistic', name: 'Realistisch', description: 'Ein lebensechter Avatar, der dir ähnlich sieht', preview: 'realistic' },
  { id: 'cartoon', name: 'Cartoon', description: 'Ein freundlicher Cartoon-Stil', preview: 'cartoon' },
  { id: 'anime', name: 'Anime', description: 'Inspiriert von japanischem Anime', preview: 'anime' },
  { id: '3d', name: '3D Modern', description: 'Moderner 3D-Render-Stil', preview: '3d' },
  { id: 'minimalist', name: 'Minimalistisch', description: 'Einfach und elegant', preview: 'minimalist' },
];

export const VOICE_STYLES: VoiceStyle[] = [
  { id: 'natural', name: 'Natürlich', description: 'Eine warme, natürliche Stimme' },
  { id: 'professional', name: 'Professionell', description: 'Klar und geschäftsmäßig' },
  { id: 'friendly', name: 'Freundlich', description: 'Warm und einladend' },
  { id: 'energetic', name: 'Energetisch', description: 'Dynamisch und motivierend' },
];

export const CLOTHING_STYLES: ClothingStyle[] = [
  { id: 'casual', name: 'Casual', description: 'Lässig und entspannt', icon: 'shirt' },
  { id: 'business', name: 'Business', description: 'Professionell und elegant', icon: 'briefcase' },
  { id: 'sporty', name: 'Sportlich', description: 'Aktiv und dynamisch', icon: 'dumbbell' },
  { id: 'creative', name: 'Kreativ', description: 'Künstlerisch und individuell', icon: 'palette' },
  { id: 'tech', name: 'Tech', description: 'Modern und minimalistisch', icon: 'laptop' },
];

export const BACKGROUND_STYLES: BackgroundStyle[] = [
  { id: 'gradient', name: 'Gradient', description: 'Weicher Farbverlauf', preview: 'gradient' },
  { id: 'office', name: 'Büro', description: 'Professionelle Büroumgebung', preview: 'office' },
  { id: 'nature', name: 'Natur', description: 'Natürliche Umgebung', preview: 'nature' },
  { id: 'abstract', name: 'Abstrakt', description: 'Künstlerischer Hintergrund', preview: 'abstract' },
  { id: 'solid', name: 'Einfarbig', description: 'Schlichter einfarbiger Hintergrund', preview: 'solid' },
];

export const ACCESSORIES: Accessory[] = [
  { id: 'glasses', name: 'Brille', category: 'glasses', icon: 'glasses' },
  { id: 'sunglasses', name: 'Sonnenbrille', category: 'glasses', icon: 'sun' },
  { id: 'cap', name: 'Kappe', category: 'hat', icon: 'hard-hat' },
  { id: 'headphones', name: 'Kopfhörer', category: 'other', icon: 'headphones' },
  { id: 'watch', name: 'Uhr', category: 'jewelry', icon: 'watch' },
  { id: 'earrings', name: 'Ohrringe', category: 'jewelry', icon: 'gem' },
];

export const PERSONALITY_TRAITS = [
  'Hilfsbereit', 'Motivierend', 'Geduldig', 'Humorvoll', 
  'Direkt', 'Einfühlsam', 'Analytisch', 'Kreativ',
  'Strukturiert', 'Flexibel', 'Optimistisch', 'Pragmatisch'
];

export const SPEAKING_STYLES = [
  { id: 'casual', name: 'Locker', description: 'Entspannt und freundlich' },
  { id: 'formal', name: 'Formell', description: 'Höflich und professionell' },
  { id: 'motivating', name: 'Motivierend', description: 'Aufbauend und ermutigend' },
  { id: 'concise', name: 'Prägnant', description: 'Kurz und auf den Punkt' },
];
