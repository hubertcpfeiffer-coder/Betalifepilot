import React, { useState } from 'react';
import { Target, Check, Plus, X, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (goals: Goal[]) => void;
  onSkip: () => void;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

const goalCategories = [
  { id: 'health', name: 'Gesundheit', icon: '💪', color: 'from-green-500 to-emerald-600' },
  { id: 'career', name: 'Karriere', icon: '💼', color: 'from-blue-500 to-indigo-600' },
  { id: 'finance', name: 'Finanzen', icon: '💰', color: 'from-amber-500 to-orange-600' },
  { id: 'personal', name: 'Persönlich', icon: '🌟', color: 'from-purple-500 to-pink-600' },
  { id: 'learning', name: 'Lernen', icon: '📚', color: 'from-cyan-500 to-blue-600' },
  { id: 'relationships', name: 'Beziehungen', icon: '❤️', color: 'from-rose-500 to-red-600' },
];

const suggestedGoals = [
  { title: 'Regelmäßig Sport treiben', category: 'health' },
  { title: 'Gesünder ernähren', category: 'health' },
  { title: 'Beförderung anstreben', category: 'career' },
  { title: 'Neue Fähigkeiten lernen', category: 'career' },
  { title: 'Geld sparen', category: 'finance' },
  { title: 'Investieren lernen', category: 'finance' },
  { title: 'Mehr lesen', category: 'personal' },
  { title: 'Meditation praktizieren', category: 'personal' },
  { title: 'Neue Sprache lernen', category: 'learning' },
  { title: 'Online-Kurs abschließen', category: 'learning' },
  { title: 'Mehr Zeit mit Familie', category: 'relationships' },
  { title: 'Neue Freundschaften', category: 'relationships' },
];

const GoalsStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([]);
  const [customGoal, setCustomGoal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('personal');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const addGoal = (title: string, category: string) => {
    if (selectedGoals.some(g => g.title === title)) return;
    
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title,
      category,
      priority: 'medium'
    };
    setSelectedGoals(prev => [...prev, newGoal]);
  };

  const removeGoal = (id: string) => {
    setSelectedGoals(prev => prev.filter(g => g.id !== id));
  };

  const addCustomGoal = () => {
    if (customGoal.trim()) {
      addGoal(customGoal.trim(), selectedCategory);
      setCustomGoal('');
      setShowCustomInput(false);
    }
  };

  const updatePriority = (id: string, priority: 'high' | 'medium' | 'low') => {
    setSelectedGoals(prev => prev.map(g => 
      g.id === id ? { ...g, priority } : g
    ));
  };

  const handleComplete = () => {
    if (selectedGoals.length >= 1) {
      onComplete(selectedGoals);
    }
  };

  const getCategoryInfo = (categoryId: string) => {
    return goalCategories.find(c => c.id === categoryId) || goalCategories[3];
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Deine Ziele</h3>
        <p className="text-gray-500 text-sm">Was möchtest du erreichen? Mio hilft dir dabei!</p>
      </div>

      {/* Selected Goals */}
      {selectedGoals.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Deine Ziele ({selectedGoals.length}):</p>
          <div className="space-y-2">
            {selectedGoals.map((goal) => {
              const category = getCategoryInfo(goal.category);
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl group"
                >
                  <span className="text-xl">{category.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{goal.title}</p>
                    <p className="text-xs text-gray-500">{category.name}</p>
                  </div>
                  
                  {/* Priority selector */}
                  <div className="flex gap-1">
                    {(['high', 'medium', 'low'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => updatePriority(goal.id, p)}
                        className={`w-2 h-6 rounded-full transition-all ${
                          goal.priority === p
                            ? p === 'high' ? 'bg-red-500' : p === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        title={p === 'high' ? 'Hoch' : p === 'medium' ? 'Mittel' : 'Niedrig'}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => removeGoal(goal.id)}
                    className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Kategorie wählen:</p>
        <div className="flex flex-wrap gap-2">
          {goalCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Goals for selected category */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Vorschläge:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedGoals
            .filter(g => g.category === selectedCategory)
            .map((goal, index) => {
              const isSelected = selectedGoals.some(sg => sg.title === goal.title);
              return (
                <button
                  key={index}
                  onClick={() => !isSelected && addGoal(goal.title, goal.category)}
                  disabled={isSelected}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-100 text-indigo-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {goal.title}
                  {isSelected && <Check className="w-3 h-3 ml-1 inline" />}
                </button>
              );
            })}
        </div>
      </div>

      {/* Custom Goal Input */}
      {showCustomInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomGoal())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Eigenes Ziel eingeben..."
            autoFocus
          />
          <button
            onClick={addCustomGoal}
            disabled={!customGoal.trim()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => { setShowCustomInput(false); setCustomGoal(''); }}
            className="px-4 py-2 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowCustomInput(true)}
          className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Eigenes Ziel hinzufügen
        </button>
      )}

      {/* Mio Hint */}
      {selectedGoals.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Mio wird dich unterstützen!</p>
            <p className="text-sm text-gray-600">
              Ich werde dich an deine Ziele erinnern und dir helfen, sie zu erreichen.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Überspringen
        </button>
        <button
          onClick={handleComplete}
          disabled={selectedGoals.length === 0}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default GoalsStep;
