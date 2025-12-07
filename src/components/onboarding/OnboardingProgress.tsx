import React, { useState, useEffect } from 'react';
import { 
  Star, Trophy, Award, ChevronRight, Sparkles, User, Camera, 
  Palette, Mic, Heart, Target, CheckSquare, Volume2, Users, 
  Brain, Zap, Settings, Check, Lock, X, Play, ArrowRight
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getOnboardingSummary } from '@/services/onboardingService';
import { 
  OnboardingProgressSummary, 
  ONBOARDING_CATEGORIES, 
  ONBOARDING_BADGES 
} from '@/types/onboarding';

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate?: (action: string) => void;
  onContinue?: () => void;
  compact?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles, User, Camera, Palette, Mic, Heart, Star, Target,
  CheckSquare, Volume2, Users, Award, Trophy, Brain, Zap, Settings
};

// Map step keys to navigation actions
const stepToAction: Record<string, string> = {
  'knowledge_interests': 'openKnowledge',
  'knowledge_goals': 'openKnowledge',
  'first_task': 'openTasks',
  'voice_test': 'startVoice',
  'round_table': 'openRoundTable',
  'avatar_photos': 'openAvatarSetup',
  'avatar_style': 'openAvatarSetup',
  'avatar_voice': 'openAvatarSetup',
  'avatar_personality': 'openAvatarSetup',
};

const OnboardingProgress: React.FC<Props> = ({ 
  isOpen = true, 
  onClose, 
  onNavigate,
  onContinue, 
  compact = false 
}) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<OnboardingProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgress = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const data = await getOnboardingSummary(user.id);
        setSummary(data);
      } catch (error) {
        console.error('Error loading progress:', error);
      }
      setLoading(false);
    };

    if (isOpen) {
      loadProgress();
    }
  }, [user, isOpen]);

  const handleStepClick = (stepKey: string) => {
    const action = stepToAction[stepKey];
    if (action && onNavigate) {
      onNavigate(action);
      onClose?.();
    }
  };

  if (!isOpen) return null;

  if (loading) {
    return compact ? (
      <div className="animate-pulse bg-gray-100 rounded-xl p-4 h-24" />
    ) : (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Fortschritt wird geladen...</p>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  // Compact inline version
  if (compact) {
    return (
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl p-4 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Onboarding</span>
          </div>
          <span className="text-sm">{summary.progress_percentage}%</span>
        </div>
        
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${summary.progress_percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              {summary.earned_points} Punkte
            </span>
            <span className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              {summary.badges.length} Badges
            </span>
          </div>
          
          {onContinue && !summary.onboarding_completed && (
            <button 
              onClick={onContinue}
              className="text-sm font-medium flex items-center gap-1 hover:underline"
            >
              Fortsetzen
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Full modal version
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white relative">
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">Dein Onboarding-Fortschritt</h3>
              <p className="text-white/80 text-sm">
                {summary.completed_steps} von {summary.total_steps} Schritten abgeschlossen
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{summary.progress_percentage}%</div>
            </div>
          </div>

          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${summary.progress_percentage}%` }}
            />
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-yellow-300 text-yellow-300" />
              <span className="font-semibold">{summary.earned_points}</span>
              <span className="text-white/70">/ {summary.total_points} Punkte</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-300" />
              <span className="font-semibold">{summary.badges.length}</span>
              <span className="text-white/70">Badges</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Badges section */}
          <div className="p-6 border-b border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Verdiente Badges ({summary.badges.length})
            </h4>
            
            <div className="flex flex-wrap gap-3">
              {Object.entries(ONBOARDING_BADGES).map(([badgeId, badge]) => {
                const isUnlocked = summary.badges.includes(badgeId);
                const Icon = iconMap[badge.icon] || Award;
                
                return (
                  <div
                    key={badgeId}
                    className={`relative group ${isUnlocked ? '' : 'opacity-40'}`}
                    title={badge.name}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' 
                        : 'bg-gray-200'
                    }`}>
                      {isUnlocked ? (
                        <Icon className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      <div className="font-semibold">{badge.name}</div>
                      <div className="text-gray-300">{badge.description}</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Steps by category */}
          <div className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Schritte nach Kategorie</h4>
            
            <div className="space-y-4">
              {Object.entries(ONBOARDING_CATEGORIES).map(([catKey, cat]) => {
                const catSteps = summary.steps.filter(s => s.category === catKey);
                if (catSteps.length === 0) return null;
                
                const completedInCat = catSteps.filter(s => s.completed).length;
                const Icon = iconMap[cat.icon] || Sparkles;
                const isComplete = completedInCat === catSteps.length;

                return (
                  <div key={catKey} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isComplete 
                            ? 'bg-green-500' 
                            : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        }`}>
                          {isComplete ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Icon className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{cat.name}</h5>
                          <p className="text-xs text-gray-500">{cat.description}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-medium ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
                        {completedInCat}/{catSteps.length}
                      </span>
                    </div>

                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-green-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${(completedInCat / catSteps.length) * 100}%` }}
                      />
                    </div>

                    {/* Individual steps */}
                    <div className="space-y-2">
                      {catSteps.map((step) => {
                        const StepIcon = iconMap[step.icon] || Sparkles;
                        const hasAction = stepToAction[step.key] && onNavigate;
                        
                        return (
                          <div 
                            key={step.key}
                            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                              step.completed 
                                ? 'bg-green-50' 
                                : hasAction 
                                  ? 'bg-white hover:bg-indigo-50 cursor-pointer' 
                                  : 'bg-white'
                            }`}
                            onClick={() => !step.completed && hasAction && handleStepClick(step.key)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                step.completed ? 'bg-green-500' : 'bg-gray-200'
                              }`}>
                                {step.completed ? (
                                  <Check className="w-4 h-4 text-white" />
                                ) : (
                                  <StepIcon className="w-4 h-4 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${step.completed ? 'text-green-700' : 'text-gray-700'}`}>
                                  {step.title}
                                </p>
                                <p className="text-xs text-gray-500">+{step.reward_points} Punkte</p>
                              </div>
                            </div>
                            
                            {!step.completed && hasAction && (
                              <button className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                                <Play className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        {summary.onboarding_completed ? (
          <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-green-800 text-lg">Onboarding abgeschlossen!</h4>
                <p className="text-green-600">Du hast alle erforderlichen Schritte gemeistert.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => {
                const nextIncomplete = summary.steps.find(s => !s.completed);
                if (nextIncomplete) {
                  const action = stepToAction[nextIncomplete.key];
                  if (action && onNavigate) {
                    onNavigate(action);
                    onClose?.();
                  }
                }
              }}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
            >
              Nächsten Schritt starten
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingProgress;
