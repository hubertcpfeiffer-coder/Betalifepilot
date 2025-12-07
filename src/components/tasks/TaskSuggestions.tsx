import React, { useState } from 'react';
import { TaskSuggestion, PRIORITY_CONFIG, TASK_CATEGORIES } from '@/types/tasks';
import { Sparkles, Plus, X, Loader2, Calendar, Clock, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskSuggestionsProps {
  suggestions: TaskSuggestion[];
  loading: boolean;
  onAccept: (suggestion: TaskSuggestion) => void;
  onDismiss: (index: number) => void;
  onRefresh: () => void;
}

export const TaskSuggestions: React.FC<TaskSuggestionsProps> = ({
  suggestions, loading, onAccept, onDismiss, onRefresh
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
          <span className="text-purple-700 font-medium">Mio analysiert deinen Tag...</span>
        </div>
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700">Keine Vorschläge verfügbar</span>
          </div>
          <button onClick={onRefresh} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
            Neu generieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-cyan-50 rounded-xl border border-purple-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-purple-200">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-900">Mios Vorschläge</span>
          <span className="text-sm text-purple-600">({suggestions.length})</span>
        </div>
        <button onClick={onRefresh} className="text-sm text-purple-600 hover:text-purple-800 font-medium">
          Aktualisieren
        </button>
      </div>
      
      <div className="divide-y divide-purple-100">
        {suggestions.map((suggestion, index) => {
          const priority = PRIORITY_CONFIG[suggestion.priority];
          const category = TASK_CATEGORIES.find(c => c.id === suggestion.category);
          const isExpanded = expandedIndex === index;
          
          return (
            <div key={index} className="p-4 hover:bg-white/50 transition-colors">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onAccept(suggestion)}
                  className="mt-0.5 p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-600 rounded-full transition-colors"
                  title="Aufgabe hinzufügen"
                >
                  <Plus className="w-4 h-4" />
                </button>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                    <span className={cn("px-2 py-0.5 rounded-full", priority.bgColor, priority.color)}>
                      {priority.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white text-gray-600">
                      {category?.label}
                    </span>
                    {suggestion.due_date && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Calendar className="w-3 h-3" />{suggestion.due_date}
                      </span>
                    )}
                    {suggestion.estimated_duration && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock className="w-3 h-3" />{suggestion.estimated_duration}min
                      </span>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="mt-2 p-2 bg-white/70 rounded-lg text-sm text-gray-600">
                      <p className="font-medium text-purple-700 mb-1">Warum diese Aufgabe?</p>
                      <p>{suggestion.reasoning}</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="mt-1 text-xs text-purple-600 hover:text-purple-800"
                  >
                    {isExpanded ? 'Weniger anzeigen' : 'Mehr erfahren'}
                  </button>
                </div>
                
                <button
                  onClick={() => onDismiss(index)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Ablehnen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskSuggestions;
