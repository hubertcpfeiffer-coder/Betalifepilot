import { supabase } from '@/lib/supabase';
import { Notification, NotificationSettings } from '@/types/notifications';

// Get all notifications for a user
export async function getNotifications(userId: string, limit = 50): Promise<Notification[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data || [];
}

// Get unread notifications count
export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  if (error) return 0;
  return count || 0;
}

// Mark notification as read
export async function markAsRead(notificationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  
  return !error;
}

// Mark all notifications as read
export async function markAllAsRead(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  
  return !error;
}

// Delete a notification
export async function deleteNotification(notificationId: string): Promise<boolean> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  
  return !error;
}

// Delete all read notifications
export async function deleteReadNotifications(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', userId)
    .eq('is_read', true)
    .select();
  
  if (error) return 0;
  return data?.length || 0;
}

// Create a notification
export async function createNotification(notification: Omit<Notification, 'id'>): Promise<Notification | null> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: notification.contactId, // This should be user_id
      contact_id: notification.contactId,
      contact_name: notification.contactName,
      contact_avatar: notification.contactAvatar,
      platform: notification.platform,
      activity_type: notification.activityType,
      activity_id: notification.activityId,
      content: notification.content,
      media_url: notification.mediaUrl,
      is_read: false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating notification:', error);
    return null;
  }
  return data;
}

// Get notification settings for a contact
export async function getNotificationSettings(userId: string, contactId: string): Promise<NotificationSettings | null> {
  const { data, error } = await supabase
    .from('notification_settings')
    .select('*')
    .eq('user_id', userId)
    .eq('contact_id', contactId)
    .single();
  
  if (error) return null;
  return data;
}

// Update notification settings
export async function updateNotificationSettings(
  userId: string,
  contactId: string,
  settings: Partial<NotificationSettings>
): Promise<boolean> {
  const { error } = await supabase
    .from('notification_settings')
    .upsert({
      user_id: userId,
      contact_id: contactId,
      enabled: settings.enabled,
      platforms: settings.platforms,
      activity_types: settings.activityTypes
    }, { onConflict: 'user_id,contact_id' });
  
  return !error;
}
