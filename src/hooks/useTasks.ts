import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { Task, TaskStatus, TaskPriority, TaskCategory } from '@/types/tasks';
import { toast } from '@/components/ui/use-toast';

export function useTasks() {
  const { user } = useAuth();
  const { subscribe } = useRealtime();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true, nullsFirst: false })
        .order('priority', { ascending: false });
      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type !== 'task') return;
      
      switch (event.action) {
        case 'insert':
          setTasks(prev => {
            if (prev.some(t => t.id === event.data.id)) return prev;
            toast({ title: 'Neue Aufgabe', description: event.data.title, duration: 3000 });
            return [...prev, event.data];
          });
          break;
        case 'update':
          setTasks(prev => prev.map(t => t.id === event.data.id ? event.data : t));
          break;
        case 'delete':
          setTasks(prev => prev.filter(t => t.id !== event.data.id));
          break;
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const createTask = async (task: Partial<Task>) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      const { data, error } = await supabase.from('tasks')
        .insert({ ...task, user_id: user.id }).select().single();
      if (error) throw error;
      return { success: true, task: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase.from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id).select().single();
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const completeTask = async (id: string) => {
    return updateTask(id, { status: 'completed', completed_at: new Date().toISOString() });
  };

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);
  const getTasksByCategory = (category: TaskCategory) => tasks.filter(t => t.category === category);
  const getOverdueTasks = () => tasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed');
  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(t => t.due_date === today && t.status !== 'completed');
  };

  return { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, fetchTasks, getTasksByStatus, getTasksByCategory, getOverdueTasks, getTodayTasks };
}

