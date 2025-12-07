import React, { useState } from 'react';
import { Award, Sparkles, Trophy, Target, Lightbulb, TrendingUp, Loader2 } from 'lucide-react';
import { useIQProfile } from '@/hooks/useIQProfile';
import { useAuth } from '@/contexts/AuthContext';
import { IQ_CATEGORIES } from '@/types/iqTests';
import IQTestCard from './IQTestCard';
import IQTestRunner from './IQTestRunner';
import { trackOnboardingAction } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';

const KnowledgeBoxIQTests: React.FC = () => {
  const { profile, testHistory, loading, saveTestResult } = useIQProfile();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTest, setActiveTest] = useState<string | null>(null);
  const [hasTrackedIQTest, setHasTrackedIQTest] = useState(false);

  const getTestCount = (categoryId: string): number => {
    return testHistory.filter(t => t.test_category === categoryId).length;
  };

  const getScore = (cat: string): number => {
    if (!profile) return 0;
    const categoryMap: Record<string, keyof typeof profile> = {
      logical: 'logical_thinking', verbal: 'verbal_intelligence', math: 'mathematical_ability',
      spatial: 'spatial_reasoning', emotional: 'emotional_intelligence', creativity: 'creativity',
      memory: 'memory', knowledge: 'general_knowledge'
    };
    const field = categoryMap[cat];
    return field ? (profile[field] as number) || 0 : 0;
  };

  const handleTestComplete = async (score: number, total: number, correct: number) => {
    if (!activeTest) return;
    await saveTestResult({
      test_category: activeTest, score, max_score: 100, percentage: score,
      questions_answered: total, correct_answers: correct
    });
    
    // Track IQ test completion for onboarding
    if (user?.id && user.is_beta_tester && !hasTrackedIQTest) {
      try {
        const result = await trackOnboardingAction(user.id, 'iq_test');
        if (result) {
          setHasTrackedIQTest(true);
          toast({
            title: 'Onboarding-Schritt abgeschlossen!',
            description: 'IQ-Test absolviert - +150 Punkte!',
          });
        }
      } catch (e) {
        console.error('Error tracking IQ test:', e);
      }
    }
    
    setActiveTest(null);
  };

  const strengths = IQ_CATEGORIES.filter(c => getScore(c.id) >= 70).map(c => c.name);
  const avgScore = profile ? Math.round(
    (profile.logical_thinking + profile.verbal_intelligence + profile.mathematical_ability +
     profile.spatial_reasoning + profile.emotional_intelligence + profile.creativity +
     profile.memory + profile.general_knowledge) / 8
  ) : 0;

  if (loading) return <div className="flex items-center justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><Trophy className="w-8 h-8" /></div>
          <div>
            <h3 className="text-xl font-bold">IQ & Begabungen</h3>
            <p className="text-purple-100">Entdecke deine einzigartigen Stärken</p>
          </div>
        </div>
        <p className="mt-4 text-purple-100 text-sm">
          Mit unseren Tests analysiert Mio deine kognitiven Fähigkeiten und kann dir so bessere, personalisierte Empfehlungen geben.
        </p>
        {user?.is_beta_tester && !hasTrackedIQTest && profile?.total_tests_taken === 0 && (
          <div className="mt-4 p-3 bg-white/20 rounded-xl flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm">Absolviere einen Test für +150 Onboarding-Punkte!</span>
          </div>
        )}
      </div>

      {profile && profile.total_tests_taken > 0 ? (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-600" />
              <span className="font-bold text-gray-900">Dein Begabungsprofil</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">{avgScore}%</span>
              {profile.overall_iq_estimate && (
                <span className="text-sm text-gray-500 ml-2">~IQ {profile.overall_iq_estimate}</span>
              )}
            </div>
          </div>
          {strengths.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Deine Stärken:</p>
              <div className="flex flex-wrap gap-2">
                {strengths.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />{s}
                  </span>
                ))}
              </div>
            </div>
          )}
          {profile.areas_to_improve && profile.areas_to_improve.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Verbesserungspotenzial:</p>
              <div className="flex flex-wrap gap-2">
                {profile.areas_to_improve.map(a => (
                  <span key={a} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm">{a}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500">{profile.total_tests_taken} Tests absolviert</p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-100">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb className="w-6 h-6 text-amber-600" />
            <span className="font-bold text-gray-900">Starte deine Begabungsanalyse</span>
          </div>
          <p className="text-sm text-gray-600">
            Absolviere verschiedene Tests, um dein persönliches Begabungsprofil zu erstellen. Mio nutzt diese Informationen, um dir bessere Empfehlungen zu geben.
          </p>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />Verfügbare Tests
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {IQ_CATEGORIES.map(cat => (
            <IQTestCard key={cat.id} category={cat} score={getScore(cat.id)} testsCompleted={getTestCount(cat.id)} onStart={() => setActiveTest(cat.id)} />
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Jeder Test enthält zufällige Fragen. Wiederhole Tests für genauere Ergebnisse!</p>

      {activeTest && <IQTestRunner categoryId={activeTest} onComplete={handleTestComplete} onClose={() => setActiveTest(null)} />}
    </div>
  );
};

export default KnowledgeBoxIQTests;
