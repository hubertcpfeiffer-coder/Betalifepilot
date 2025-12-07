import { supabase } from '@/lib/supabase';

export interface Reminder {
  id: string;
  user_id: string;
  task_id?: string;
  title: string;
  message?: string;
  remind_at: string;
  repeat_type: 'none' | 'daily' | 'weekly' | 'monthly';
  is_sent: boolean;
  is_dismissed: boolean;
  created_at: string;
}

// Get all reminders for a user
export async function getReminders(userId: string): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_dismissed', false)
    .order('remind_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }
  return data || [];
}

// Get pending reminders (due now or overdue)
export async function getPendingReminders(userId: string): Promise<Reminder[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .eq('is_sent', false)
    .eq('is_dismissed', false)
    .lte('remind_at', now);
  
  if (error) return [];
  return data || [];
}

// Create a new reminder
export async function createReminder(reminder: Omit<Reminder, 'id' | 'is_sent' | 'is_dismissed' | 'created_at'>): Promise<Reminder | null> {
  const { data, error } = await supabase
    .from('reminders')
    .insert(reminder)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating reminder:', error);
    return null;
  }
  return data;
}

// Mark reminder as sent
export async function markReminderSent(reminderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('reminders')
    .update({ is_sent: true })
    .eq('id', reminderId);
  
  return !error;
}

// Dismiss a reminder
export async function dismissReminder(reminderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('reminders')
    .update({ is_dismissed: true })
    .eq('id', reminderId);
  
  return !error;
}

// Delete a reminder
export async function deleteReminder(reminderId: string): Promise<boolean> {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', reminderId);
  
  return !error;
}

// Create reminder from task
export async function createTaskReminder(
  userId: string,
  taskId: string,
  title: string,
  remindAt: Date,
  message?: string
): Promise<Reminder | null> {
  return createReminder({
    user_id: userId,
    task_id: taskId,
    title,
    message,
    remind_at: remindAt.toISOString(),
    repeat_type: 'none'
  });
}
