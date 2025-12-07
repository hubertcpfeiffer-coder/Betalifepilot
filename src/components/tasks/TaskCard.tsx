import React from 'react';
import { Task, PRIORITY_CONFIG, TASK_CATEGORIES } from '@/types/tasks';
import { Check, Clock, Calendar, Repeat, Trash2, Edit2, Play, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onStart?: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete, onEdit, onStart }) => {
  const priority = PRIORITY_CONFIG[task.priority];
  const category = TASK_CATEGORIES.find(c => c.id === task.category);
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed';
  const isCompleted = task.status === 'completed';

  const formatDate = (date: string) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Heute';
    if (d.toDateString() === tomorrow.toDateString()) return 'Morgen';
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className={cn(
      "group p-4 rounded-xl border transition-all duration-200 hover:shadow-md",
      isCompleted ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200 hover:border-cyan-300",
      isOverdue && !isCompleted && "border-red-300 bg-red-50"
    )}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onComplete(task.id)}
          className={cn(
            "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
            isCompleted ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-cyan-500"
          )}
        >
          {isCompleted && <Check className="w-3 h-3" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn("font-medium text-gray-900 truncate", isCompleted && "line-through text-gray-500")}>
              {task.title}
            </h4>
            {task.ai_suggested && (
              <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" title="KI-Vorschlag" />
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2">{task.description}</p>
          )}
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className={cn("px-2 py-0.5 rounded-full", priority.bgColor, priority.color)}>
              {priority.label}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {category?.label || task.category}
            </span>
            {task.due_date && (
              <span className={cn("flex items-center gap-1", isOverdue ? "text-red-600" : "text-gray-500")}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.due_date)}
                {task.due_time && ` ${task.due_time}`}
              </span>
            )}
            {task.estimated_duration && (
              <span className="flex items-center gap-1 text-gray-500">
                <Clock className="w-3 h-3" />{task.estimated_duration}min
              </span>
            )}
            {task.repeat_type !== 'none' && (
              <span className="flex items-center gap-1 text-purple-500">
                <Repeat className="w-3 h-3" />
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isCompleted && onStart && task.status === 'pending' && (
            <button onClick={() => onStart(task.id)} className="p-1.5 text-gray-400 hover:text-green-500 rounded">
              <Play className="w-4 h-4" />
            </button>
          )}
          <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-cyan-500 rounded">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(task.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
