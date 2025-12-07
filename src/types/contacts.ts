// Kontakte und Social Media Typen

export type SocialPlatform = 'whatsapp' | 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok';

export type ActivityType = 'post' | 'story' | 'status' | 'article' | 'message' | 'like' | 'comment' | 'share';

export interface SocialProfile {
  platform: SocialPlatform;
  username: string;
  profileUrl?: string;
  connected: boolean;
  lastChecked?: Date;
}

export interface SocialActivity {
  id: string;
  contactId: string;
  platform: SocialPlatform;
  type: ActivityType;
  content: string;
  mediaUrl?: string;
  timestamp: Date;
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
}

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar?: string;
  company?: string;
  position?: string;
  socialProfiles: SocialProfile[];
  activities: SocialActivity[];
  lastActivity?: Date;
  tags?: string[];
  notes?: string;
  isFavorite?: boolean;
}

export interface ContactsFilter {
  searchQuery: string;
  platforms: SocialPlatform[];
  activityTypes: ActivityType[];
  showFavoritesOnly: boolean;
  sortBy: 'name' | 'lastActivity' | 'activityCount';
}

export const platformColors: Record<SocialPlatform, { bg: string; text: string; icon: string }> = {
  whatsapp: { bg: 'bg-green-100', text: 'text-green-600', icon: '#25D366' },
  facebook: { bg: 'bg-blue-100', text: 'text-blue-600', icon: '#1877F2' },
  instagram: { bg: 'bg-pink-100', text: 'text-pink-600', icon: '#E4405F' },
  linkedin: { bg: 'bg-sky-100', text: 'text-sky-700', icon: '#0A66C2' },
  twitter: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '#000000' },
  tiktok: { bg: 'bg-slate-100', text: 'text-slate-800', icon: '#000000' },
};

export const activityTypeLabels: Record<ActivityType, string> = {
  post: 'Beitrag',
  story: 'Story',
  status: 'Status',
  article: 'Artikel',
  message: 'Nachricht',
  like: 'Like',
  comment: 'Kommentar',
  share: 'Geteilt',
};
