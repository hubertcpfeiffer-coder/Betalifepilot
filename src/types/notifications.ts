// Benachrichtigungssystem Typen
import { SocialPlatform, ActivityType } from './contacts';
import { ShopId } from './priceComparison';

export interface NotificationSettings {
  contactId: string;
  enabled: boolean;
  platforms: SocialPlatform[];
  activityTypes: ActivityType[];
  createdAt: Date;
}

export interface Notification {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar?: string;
  platform: SocialPlatform;
  activityType: ActivityType;
  activityId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  mediaUrl?: string;
}

export interface PriceAlertNotification {
  id: string;
  type: 'price_alert';
  productName: string;
  shopId: ShopId;
  shopName: string;
  currentPrice: number;
  originalPrice?: number;
  savedAmount?: number;
  isOnSale: boolean;
  timestamp: Date;
  isRead: boolean;
}

export type AnyNotification = Notification | PriceAlertNotification;

export interface NotificationFilter {
  platforms: SocialPlatform[];
  activityTypes: ActivityType[];
  showUnreadOnly: boolean;
  dateRange?: { start: Date; end: Date };
  includePriceAlerts: boolean;
}

export const defaultNotificationSettings: Omit<NotificationSettings, 'contactId' | 'createdAt'> = {
  enabled: true,
  platforms: ['whatsapp', 'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'],
  activityTypes: ['post', 'story', 'status', 'article'],
};
