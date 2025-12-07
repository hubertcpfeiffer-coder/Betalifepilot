import { supabase } from '@/lib/supabase';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '@/types/tasks';

// Get all tasks for a user
export async function getTasks(userId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('due_date', { ascending: true, nullsFirst: false });
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  return data || [];
}

// Create a new task
export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating task:', error);
    return null;
  }
  return data;
}

// Update a task
export async function updateTask(taskId: string, updates: Partial<Task>): Promise<Task | null> {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task:', error);
    return null;
  }
  return data;
}

// Delete a task
export async function deleteTask(taskId: string): Promise<boolean> {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) {
    console.error('Error deleting task:', error);
    return false;
  }
  return true;
}

// Complete a task
export async function completeTask(taskId: string): Promise<Task | null> {
  return updateTask(taskId, {
    status: 'completed',
    completed_at: new Date().toISOString()
  });
}

// Get tasks by status
export async function getTasksByStatus(userId: string, status: TaskStatus): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status)
    .order('due_date', { ascending: true });
  
  if (error) return [];
  return data || [];
}

// Get overdue tasks
export async function getOverdueTasks(userId: string): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .neq('status', 'completed')
    .neq('status', 'cancelled')
    .lt('due_date', today);
  
  if (error) return [];
  return data || [];
}

// Get today's tasks
export async function getTodaysTasks(userId: string): Promise<Task[]> {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .eq('due_date', today)
    .neq('status', 'completed')
    .order('priority', { ascending: false });
  
  if (error) return [];
  return data || [];
}
