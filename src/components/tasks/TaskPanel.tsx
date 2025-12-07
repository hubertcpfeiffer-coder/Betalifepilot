import React, { useState, useEffect } from 'react';
import { X, Plus, Filter, Calendar, CheckCircle2, Clock, AlertTriangle, ListTodo, Sparkles, RefreshCw, Wifi, Radio } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useUserKnowledge } from '@/hooks/useUserKnowledge';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TaskSuggestion, TaskCategory, TASK_CATEGORIES } from '@/types/tasks';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskSuggestions from './TaskSuggestions';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { trackOnboardingAction } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';

interface TaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterTab = 'all' | 'today' | 'overdue' | 'completed';

export const TaskPanel: React.FC<TaskPanelProps> = ({ isOpen, onClose }) => {
  const { tasks, loading, createTask, updateTask, deleteTask, completeTask, fetchTasks } = useTasks();
  const { profile } = useUserKnowledge();
  const { connectionStatus, lastEvent } = useRealtime();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [hasTrackedFirstTask, setHasTrackedFirstTask] = useState(false);

  // Show pulse animation when realtime event occurs
  useEffect(() => {
    if (lastEvent?.type === 'task') {
      setRealtimePulse(true);
      setTimeout(() => setRealtimePulse(false), 1000);
    }
  }, [lastEvent]);

  useEffect(() => {
    if (isOpen && tasks.length >= 0) {
      fetchAISuggestions();
    }
  }, [isOpen]);


  const fetchAISuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('task-ai-suggestions', {
        body: {
          userKnowledge: profile,
          existingTasks: tasks,
          currentTime: new Date().toISOString()
        }
      });
      if (data?.suggestions) setSuggestions(data.suggestions);
    } catch (e) {
      console.error('Failed to fetch suggestions:', e);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: TaskSuggestion) => {
    await createTask({
      title: suggestion.title,
      description: suggestion.description,
      priority: suggestion.priority,
      category: suggestion.category,
      due_date: suggestion.due_date,
      due_time: suggestion.due_time,
      estimated_duration: suggestion.estimated_duration,
      ai_suggested: true,
      ai_reasoning: suggestion.reasoning
    });
    setSuggestions(prev => prev.filter(s => s.title !== suggestion.title));
    
    // Track first task for onboarding
    await trackFirstTask();
  };

  const handleDismissSuggestion = (index: number) => {
    setSuggestions(prev => prev.filter((_, i) => i !== index));
  };

  // Track first task creation for onboarding
  const trackFirstTask = async () => {
    if (!user?.id || !user.is_beta_tester || hasTrackedFirstTask) return;
    
    try {
      const result = await trackOnboardingAction(user.id, 'task_created');
      if (result) {
        setHasTrackedFirstTask(true);
        toast({
          title: 'Onboarding-Schritt abgeschlossen!',
          description: 'Erste Aufgabe erstellt - +50 Punkte!',
        });
      }
    } catch (e) {
      console.error('Error tracking first task:', e);
    }
  };

  const handleCreateTask = async (data: any) => {
    await createTask(data);
    setShowForm(false);
    setEditingTask(null);
    
    // Track first task for onboarding
    await trackFirstTask();
  };

  const filteredTasks = tasks.filter(task => {
    const today = new Date().toISOString().split('T')[0];
    if (activeTab === 'today') return task.due_date === today && task.status !== 'completed';
    if (activeTab === 'overdue') return task.due_date && task.due_date < today && task.status !== 'completed';
    if (activeTab === 'completed') return task.status === 'completed';
    if (activeTab === 'all') return task.status !== 'completed';
    return true;
  }).filter(task => categoryFilter === 'all' || task.category === categoryFilter);

  const stats = {
    total: tasks.filter(t => t.status !== 'completed').length,
    today: tasks.filter(t => t.due_date === new Date().toISOString().split('T')[0] && t.status !== 'completed').length,
    overdue: tasks.filter(t => t.due_date && t.due_date < new Date().toISOString().split('T')[0] && t.status !== 'completed').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn("bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-all", realtimePulse && "ring-4 ring-green-400/50")}>
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-cyan-600 to-blue-600">
          <div className="flex items-center gap-3">
            <ListTodo className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Meine Aufgaben</h2>
            {connectionStatus === 'connected' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-full">
                <Radio className="w-3 h-3 text-green-300 animate-pulse" />
                <span className="text-xs text-white/90">Live</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm">
              <Plus className="w-4 h-4" />Neue Aufgabe
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>


        <div className="flex border-b overflow-x-auto">
          {[
            { id: 'all', label: 'Alle', icon: ListTodo, count: stats.total },
            { id: 'today', label: 'Heute', icon: Calendar, count: stats.today },
            { id: 'overdue', label: 'Überfällig', icon: AlertTriangle, count: stats.overdue },
            { id: 'completed', label: 'Erledigt', icon: CheckCircle2, count: stats.completed }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as FilterTab)}
              className={cn("flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id ? "border-cyan-600 text-cyan-600" : "border-transparent text-gray-500 hover:text-gray-700"
              )}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && <span className={cn("px-1.5 py-0.5 rounded-full text-xs",
                tab.id === 'overdue' ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"
              )}>{tab.count}</span>}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showSuggestions && activeTab !== 'completed' && (
            <TaskSuggestions suggestions={suggestions} loading={loadingSuggestions}
              onAccept={handleAcceptSuggestion} onDismiss={handleDismissSuggestion} onRefresh={fetchAISuggestions} />
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value as TaskCategory | 'all')}
              className="text-sm border rounded-lg px-2 py-1 focus:ring-2 focus:ring-cyan-500">
              <option value="all">Alle Kategorien</option>
              {TASK_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 text-cyan-600 animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ListTodo className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Keine Aufgaben gefunden</p>
              <button onClick={() => setShowForm(true)} className="mt-3 text-cyan-600 hover:text-cyan-700 font-medium">
                Erste Aufgabe erstellen
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={completeTask} onDelete={deleteTask}
                  onEdit={t => { setEditingTask(t); setShowForm(true); }}
                  onStart={id => updateTask(id, { status: 'in_progress' })} />
              ))}
            </div>
          )}
        </div>

        {(showForm || editingTask) && (
          <TaskForm task={editingTask}
            onSubmit={async data => {
              if (editingTask) {
                await updateTask(editingTask.id, data);
                setShowForm(false);
                setEditingTask(null);
              } else {
                await handleCreateTask(data);
              }
            }}
            onClose={() => { setShowForm(false); setEditingTask(null); }} />
        )}
      </div>
    </div>
  );
};

export default TaskPanel;
