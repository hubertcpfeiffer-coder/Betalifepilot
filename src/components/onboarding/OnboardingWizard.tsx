import React, { useState, useEffect } from 'react';
import { 
  X, ArrowRight, ArrowLeft, Check, Loader2, Star, Trophy, Award,
  Sparkles, User, Camera, Palette, Mic, Heart, Target, CheckSquare,
  Volume2, Users, Brain, Zap, Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getOnboardingSteps, 
  getOnboardingSummary, 
  completeOnboardingStep 
} from '@/services/onboardingService';
import { 
  OnboardingStep, 
  OnboardingStepStatus, 
  OnboardingProgressSummary,
  ONBOARDING_CATEGORIES,
  ONBOARDING_BADGES
} from '@/types/onboarding';
import BadgeAnimation from './BadgeAnimation';
import WelcomeStep from './steps/WelcomeStep';
import ProfileStep, { ProfileData } from './steps/ProfileStep';
import AvatarPhotosStep from './steps/AvatarPhotosStep';
import AvatarStyleStep from './steps/AvatarStyleStep';
import AvatarVoiceStep from './steps/AvatarVoiceStep';
import InterestsStep from './steps/InterestsStep';
import GoalsStep from './steps/GoalsStep';
import PersonalityStep, { PersonalityData } from './steps/PersonalityStep';

interface Props {
  onComplete: () => void;
  onClose: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles, User, Camera, Palette, Mic, Heart, Star, Target,
  CheckSquare, Volume2, Users, Award, Trophy, Brain, Zap, Settings
};

const categoryOrder = ['introduction', 'setup', 'avatar', 'knowledge', 'features', 'completion'];

const OnboardingWizard: React.FC<Props> = ({ onComplete, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [steps, setSteps] = useState<OnboardingStepStatus[]>([]);
  const [summary, setSummary] = useState<OnboardingProgressSummary | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showBadgeAnimation, setShowBadgeAnimation] = useState<{ badgeId: string; points: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});

  // Load steps and progress
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const summaryData = await getOnboardingSummary(user.id);
        setSummary(summaryData);
        setSteps(summaryData.steps);
        
        // Find first incomplete step
        const firstIncomplete = summaryData.steps.findIndex(s => !s.completed);
        if (firstIncomplete >= 0) {
          setCurrentStepIndex(firstIncomplete);
        }
      } catch (error) {
        console.error('Error loading onboarding data:', error);
        // Set default steps on error
        setSteps([]);
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  const currentStep = steps[currentStepIndex];
  const currentCategory = currentStep?.category || 'introduction';

  // Group steps by category
  const stepsByCategory = steps.reduce((acc, step) => {
    const cat = step.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(step);
    return acc;
  }, {} as Record<string, OnboardingStepStatus[]>);

  const handleStepComplete = async (stepKey: string, data?: any) => {
    if (!user) return;
    
    setSaving(true);
    try {
      // Save collected data
      if (data) {
        setCollectedData(prev => ({ ...prev, [stepKey]: data }));
      }

      const result = await completeOnboardingStep(user.id, stepKey, data);
      
      if (result.success) {
        // Update local state
        setSteps(prev => prev.map(s => 
          s.key === stepKey ? { ...s, completed: true, completed_at: new Date().toISOString() } : s
        ));
        
        // Update summary
        if (summary) {
          setSummary({
            ...summary,
            completed_steps: summary.completed_steps + 1,
            earned_points: summary.earned_points + (result.points || 0),
            progress_percentage: Math.round(((summary.completed_steps + 1) / summary.total_steps) * 100)
          });
        }

        // Show badge animation if earned
        if (result.badge && result.points) {
          setShowBadgeAnimation({ badgeId: result.badge, points: result.points });
        } else {
          // Move to next step
          moveToNextStep();
        }
      }
    } catch (error) {
      console.error('Error completing step:', error);
      // Move to next step anyway to not block the user
      moveToNextStep();
    }
    setSaving(false);
  };

  const handleBadgeAnimationComplete = () => {
    setShowBadgeAnimation(null);
    moveToNextStep();
  };

  const moveToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkipStep = () => {
    moveToNextStep();
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    if (!currentStep) return null;

    switch (currentStep.key) {
      case 'welcome':
        return <WelcomeStep onComplete={() => handleStepComplete('welcome')} />;
      case 'profile_setup':
        return (
          <ProfileStep 
            onComplete={(data) => handleStepComplete('profile_setup', data)}
            initialData={collectedData.profile_setup}
          />
        );
      case 'avatar_photos':
        return (
          <AvatarPhotosStep 
            onComplete={(photos) => handleStepComplete('avatar_photos', { photos })}
            onSkip={handleSkipStep}
          />
        );
      case 'avatar_style':
        return (
          <AvatarStyleStep 
            onComplete={(style) => handleStepComplete('avatar_style', { style })}
            onSkip={handleSkipStep}
          />
        );
      case 'avatar_voice':
        return (
          <AvatarVoiceStep 
            onComplete={(voice) => handleStepComplete('avatar_voice', { voice })}
            onSkip={handleSkipStep}
          />
        );
      case 'avatar_personality':
        return (
          <PersonalityStep 
            onComplete={(personality) => handleStepComplete('avatar_personality', { personality })}
            onSkip={handleSkipStep}
          />
        );
      case 'knowledge_interests':
        return (
          <InterestsStep 
            onComplete={(interests) => handleStepComplete('knowledge_interests', { interests })}
            onSkip={handleSkipStep}
          />
        );
      case 'knowledge_goals':
        return (
          <GoalsStep 
            onComplete={(goals) => handleStepComplete('knowledge_goals', { goals })}
            onSkip={handleSkipStep}
          />
        );
      default:
        return (
          <DefaultStepContent 
            step={currentStep} 
            onComplete={() => handleStepComplete(currentStep.key)}
            onSkip={handleSkipStep}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Onboarding wird geladen...</p>
        </div>
      </div>
    );
  }

  // Handle case when no steps are loaded
  if (steps.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center">
          <Sparkles className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Willkommen bei Mio!</h3>
          <p className="text-gray-600 mb-6">
            Dein persönlicher KI-Assistent ist bereit. Lass uns loslegen!
          </p>
          <button
            onClick={onComplete}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all"
          >
            Los geht's!
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Badge Animation Overlay */}
      {showBadgeAnimation && (
        <BadgeAnimation
          badgeId={showBadgeAnimation.badgeId}
          points={showBadgeAnimation.points}
          onComplete={handleBadgeAnimationComplete}
        />
      )}

      {/* Main Wizard */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header with progress */}
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Mio einrichten</h2>
                  <p className="text-sm text-white/80">Schritt {currentStepIndex + 1} von {steps.length}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${summary?.progress_percentage || 0}%` }}
              />
            </div>

            {/* Points display */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                <span>{summary?.earned_points || 0} / {summary?.total_points || 0} Punkte</span>
              </div>
              <div className="flex items-center gap-1">
                {(summary?.badges || []).slice(0, 5).map((badgeId, i) => {
                  const badge = ONBOARDING_BADGES[badgeId];
                  const Icon = badge ? iconMap[badge.icon] || Award : Award;
                  return (
                    <div key={i} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center" title={badge?.name}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                  );
                })}
                {(summary?.badges?.length || 0) > 5 && (
                  <span className="text-xs text-white/80 ml-1">+{(summary?.badges?.length || 0) - 5}</span>
                )}
              </div>
            </div>
          </div>

          {/* Category navigation */}
          <div className="px-4 py-3 border-b border-gray-100 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {categoryOrder.map((catKey) => {
                const cat = ONBOARDING_CATEGORIES[catKey];
                if (!cat || !stepsByCategory[catKey]) return null;
                
                const catSteps = stepsByCategory[catKey];
                const completedInCat = catSteps.filter(s => s.completed).length;
                const isActive = currentCategory === catKey;
                const Icon = iconMap[cat.icon] || Sparkles;

                return (
                  <div
                    key={catKey}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : completedInCat === catSteps.length
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium whitespace-nowrap">{cat.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                      completedInCat === catSteps.length 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {completedInCat}/{catSteps.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 overflow-y-auto p-6">
            {renderStepContent()}
          </div>

          {/* Footer navigation */}
          <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
            {currentStepIndex > 0 ? (
              <button 
                onClick={handleBack}
                disabled={saving}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Zurück
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
              {currentStep?.required && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  Erforderlich
                </span>
              )}
              {currentStep?.estimated_time_minutes && (
                <span>~{currentStep.estimated_time_minutes} Min.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Default step content for steps without custom components
const DefaultStepContent: React.FC<{
  step: OnboardingStepStatus;
  onComplete: () => void;
  onSkip: () => void;
}> = ({ step, onComplete, onSkip }) => {
  const Icon = iconMap[step.icon] || Sparkles;

  return (
    <div className="space-y-6 text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
        <Icon className="w-10 h-10 text-white" />
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{step.title}</h3>
        <p className="text-gray-600">{step.description}</p>
      </div>

      <div className="bg-indigo-50 rounded-xl p-4 flex items-center justify-center gap-3">
        <Star className="w-5 h-5 text-indigo-600" />
        <span className="text-indigo-700 font-medium">+{step.reward_points} Punkte</span>
      </div>

      <div className="flex gap-3">
        {!step.required && (
          <button
            onClick={onSkip}
            className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            Überspringen
          </button>
        )}
        <button
          onClick={onComplete}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30"
        >
          <Check className="w-5 h-5" />
          {step.key === 'completion' ? 'Abschließen' : 'Erledigt'}
        </button>
      </div>
    </div>
  );
};

export default OnboardingWizard;

