export interface AvatarGenerationRequest {
  userId: string;
  photoUrls: string[];
  style: AvatarStyleType;
  clothing?: ClothingOption;
  background?: BackgroundOption;
  accessories?: AccessoryOption[];
  customPrompt?: string;
}

export interface AvatarGenerationResponse {
  success: boolean;
  avatarUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export type AvatarStyleType = 'realistic' | 'cartoon' | 'anime' | '3d' | 'minimalist';

export type ClothingOption = 'casual' | 'business' | 'sporty' | 'creative' | 'tech' | 'elegant';

export type BackgroundOption = 'studio' | 'nature' | 'office' | 'abstract' | 'city' | 'space' | 'gradient';

export type AccessoryOption = 'glasses' | 'headphones' | 'watch' | 'hat' | 'earrings' | 'necklace' | 'scarf';

export interface ClothingStyle {
  id: ClothingOption;
  name: string;
  description: string;
  icon: string;
}

export interface BackgroundStyle {
  id: BackgroundOption;
  name: string;
  description: string;
  color: string;
}

export interface AccessoryItem {
  id: AccessoryOption;
  name: string;
  icon: string;
}

export const CLOTHING_STYLES: ClothingStyle[] = [
  { id: 'casual', name: 'Casual', description: 'T-Shirt & Jeans', icon: '👕' },
  { id: 'business', name: 'Business', description: 'Anzug & Krawatte', icon: '👔' },
  { id: 'sporty', name: 'Sportlich', description: 'Sportbekleidung', icon: '🏃' },
  { id: 'creative', name: 'Kreativ', description: 'Künstlerisch', icon: '🎨' },
  { id: 'tech', name: 'Tech', description: 'Futuristisch', icon: '🚀' },
  { id: 'elegant', name: 'Elegant', description: 'Formell', icon: '✨' },
];

export const BACKGROUND_STYLES: BackgroundStyle[] = [
  { id: 'studio', name: 'Studio', description: 'Professioneller Hintergrund', color: 'from-gray-100 to-gray-200' },
  { id: 'nature', name: 'Natur', description: 'Outdoor-Szene', color: 'from-green-100 to-emerald-200' },
  { id: 'office', name: 'Büro', description: 'Modernes Office', color: 'from-blue-100 to-slate-200' },
  { id: 'abstract', name: 'Abstrakt', description: 'Geometrische Formen', color: 'from-purple-100 to-pink-200' },
  { id: 'city', name: 'Stadt', description: 'Urbane Szene', color: 'from-slate-200 to-zinc-300' },
  { id: 'space', name: 'Weltraum', description: 'Kosmischer Look', color: 'from-indigo-200 to-purple-300' },
  { id: 'gradient', name: 'Gradient', description: 'Farbverlauf', color: 'from-rose-100 to-teal-100' },
];

export const ACCESSORY_ITEMS: AccessoryItem[] = [
  { id: 'glasses', name: 'Brille', icon: '👓' },
  { id: 'headphones', name: 'Kopfhörer', icon: '🎧' },
  { id: 'watch', name: 'Uhr', icon: '⌚' },
  { id: 'hat', name: 'Hut', icon: '🎩' },
  { id: 'earrings', name: 'Ohrringe', icon: '💎' },
  { id: 'necklace', name: 'Kette', icon: '📿' },
  { id: 'scarf', name: 'Schal', icon: '🧣' },
];

export interface GeneratedAvatar {
  id: string;
  userId: string;
  avatarUrl: string;
  thumbnailUrl: string;
  style: AvatarStyleType;
  clothing?: ClothingOption;
  background?: BackgroundOption;
  accessories?: AccessoryOption[];
  createdAt: string;
  isActive: boolean;
}
