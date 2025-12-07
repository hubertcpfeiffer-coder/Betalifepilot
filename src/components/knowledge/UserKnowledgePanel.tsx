import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Brain, User, Briefcase, Heart, Activity, Target, Users, Clock, CheckCircle2, Trophy, RefreshCw } from 'lucide-react';
import { useUserKnowledge } from '@/hooks/useUserKnowledge';
import { useAuth } from '@/contexts/AuthContext';
import { UserKnowledgeProfile } from '@/types/userKnowledge';
import KnowledgeBoxPersonal from './KnowledgeBoxPersonal';
import KnowledgeBoxWork from './KnowledgeBoxWork';
import KnowledgeBoxInterests from './KnowledgeBoxInterests';
import KnowledgeBoxHealth from './KnowledgeBoxHealth';
import KnowledgeBoxGoals from './KnowledgeBoxGoals';
import KnowledgeBoxPeople from './KnowledgeBoxPeople';
import KnowledgeBoxRoutines from './KnowledgeBoxRoutines';
import KnowledgeBoxIQTests from './KnowledgeBoxIQTests';
import { trackOnboardingAction, completeOnboardingStep } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';

interface Props { onClose: () => void; isOnboarding?: boolean; initialTab?: string; }

const tabs = [
  { id: 'personal', label: 'Persönlich', icon: User, description: 'Grundlegende Infos' },
  { id: 'work', label: 'Beruf', icon: Briefcase, description: 'Karriere & Arbeit' },
  { id: 'interests', label: 'Interessen', icon: Heart, description: 'Hobbys & Vorlieben' },
  { id: 'health', label: 'Gesundheit', icon: Activity, description: 'Fitness & Ernährung' },
  { id: 'goals', label: 'Ziele', icon: Target, description: 'Träume & Pläne' },
  { id: 'people', label: 'Menschen', icon: Users, description: 'Kontakte & Familie' },
  { id: 'routines', label: 'Routinen', icon: Clock, description: 'Tagesabläufe' },
  { id: 'iq', label: 'IQ & Begabungen', icon: Trophy, description: 'Tests & Stärken', highlight: true },
];

const UserKnowledgePanel: React.FC<Props> = ({ onClose, isOnboarding = false, initialTab }) => {
  const { user } = useAuth();
  const { profile: dbProfile, loading, saving, saveProfile, refreshProfile } = useUserKnowledge();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(initialTab || 'personal');
  const [localProfile, setLocalProfile] = useState<UserKnowledgeProfile>({ user_id: user?.id || '' });
  const [message, setMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const [hasTrackedKnowledge, setHasTrackedKnowledge] = useState(false);
  const [hasTrackedProfile, setHasTrackedProfile] = useState(false);

  useEffect(() => { if (initialTab) setActiveTab(initialTab); }, [initialTab]);
  useEffect(() => { if (dbProfile) setLocalProfile(dbProfile); }, [dbProfile]);

  const calculateCompleteness = (): number => {
    let filled = 0;
    if (localProfile.nickname) filled++; if (localProfile.birth_date) filled++; if (localProfile.city) filled++;
    if (localProfile.occupation) filled++; if (localProfile.hobbies?.length) filled++; if (localProfile.interests?.length) filled++;
    if (localProfile.fitness_level) filled++; if (localProfile.dietary_preferences?.length) filled++;
    if (localProfile.short_term_goals?.length) filled++; if (localProfile.long_term_goals?.length) filled++;
    if (localProfile.family_members?.length) filled++; if (localProfile.morning_routine) filled++;
    if (localProfile.favorite_music?.length) filled++; if (localProfile.sports?.length) filled++;
    if (localProfile.health_goals?.length) filled++; if (localProfile.life_dreams?.length) filled++;
    if (localProfile.pets?.length) filled++; if (localProfile.close_friends?.length) filled++;
    if (localProfile.evening_routine) filled++; if (localProfile.work_routine) filled++;
    return Math.round((filled / 20) * 100);
  };

  const handleSave = async () => {
    const result = await saveProfile(localProfile);
    if (result.success) {
      setMessage('Erfolgreich in Datenbank gespeichert!');
      setHasChanges(false);
      
      // Track onboarding steps for beta testers
      if (user?.id && user.is_beta_tester) {
        // Track knowledge added
        if (!hasTrackedKnowledge) {
          const knowledgeResult = await trackOnboardingAction(user.id, 'knowledge_added').catch(() => null);
          if (knowledgeResult) {
            setHasTrackedKnowledge(true);
            toast({
              title: 'Onboarding-Schritt abgeschlossen!',
              description: 'Wissen hinzugefügt - +50 Punkte!',
            });
          }
        }
        
        // Track profile completion if completeness >= 50%
        const completeness = calculateCompleteness();
        if (completeness >= 50 && !hasTrackedProfile) {
          const profileResult = await completeOnboardingStep(user.id, 'profile_complete', { completeness }).catch(() => null);
          if (profileResult?.success) {
            setHasTrackedProfile(true);
            toast({
              title: 'Onboarding-Schritt abgeschlossen!',
              description: 'Profil vervollständigt - +100 Punkte!',
            });
          }
        }
      }
    } else {
      setMessage(`Fehler: ${result.error}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleChange = (updates: Partial<UserKnowledgeProfile>) => {
    setLocalProfile(p => ({ ...p, ...updates }));
    setHasChanges(true);
  };

  // Track IQ test completion when switching to IQ tab
  const handleTabChange = async (tabId: string) => {
    setActiveTab(tabId);
    
    // Track IQ test visit for onboarding
    if (tabId === 'iq' && user?.id && user.is_beta_tester) {
      // The actual IQ test completion tracking happens in KnowledgeBoxIQTests
    }
  };

  const completeness = calculateCompleteness();

  if (loading) return <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-8"><Loader2 className="w-8 h-8 animate-spin text-cyan-600" /></div></div>;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center"><Brain className="w-8 h-8 text-white" /></div>
              <div>
                <h2 className="text-xl font-bold text-white">{isOnboarding ? 'Willkommen! Lass uns starten' : 'Mios Wissen über dich'}</h2>
                <p className="text-cyan-100 text-sm flex items-center gap-2">
                  {user ? <><CheckCircle2 className="w-4 h-4" /> Mit Datenbank synchronisiert</> : 'Lokaler Modus - Melde dich an zum Speichern'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user && <button onClick={refreshProfile} className="text-white/80 hover:text-white p-2"><RefreshCw className="w-5 h-5" /></button>}
              {!isOnboarding && <button onClick={onClose} className="text-white/80 hover:text-white"><X className="w-6 h-6" /></button>}
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-white/80 mb-1"><span>Profil-Vollständigkeit</span><span className="font-bold text-white">{completeness}%</span></div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full transition-all" style={{ width: `${completeness}%` }} /></div>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-56 bg-gray-50 p-3 space-y-1 overflow-y-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => handleTabChange(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id 
                    ? tab.highlight ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg' : 'bg-cyan-100 text-cyan-700' 
                    : tab.highlight ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <tab.icon className="w-5 h-5" />
                <div><span className="font-medium text-sm block">{tab.label}</span><span className={`text-xs ${activeTab === tab.id ? 'opacity-80' : 'text-gray-400'}`}>{tab.description}</span></div>
              </button>
            ))}
          </div>
          <div className="flex-1 p-6 overflow-y-auto">
            {message && <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${message.includes('Fehler') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}><CheckCircle2 className="w-5 h-5" />{message}</div>}
            {activeTab === 'personal' && <KnowledgeBoxPersonal profile={localProfile} onChange={handleChange} />}
            {activeTab === 'work' && <KnowledgeBoxWork profile={localProfile} onChange={handleChange} />}
            {activeTab === 'interests' && <KnowledgeBoxInterests profile={localProfile} onChange={handleChange} />}
            {activeTab === 'health' && <KnowledgeBoxHealth profile={localProfile} onChange={handleChange} />}
            {activeTab === 'goals' && <KnowledgeBoxGoals profile={localProfile} onChange={handleChange} />}
            {activeTab === 'people' && <KnowledgeBoxPeople profile={localProfile} onChange={handleChange} />}
            {activeTab === 'routines' && <KnowledgeBoxRoutines profile={localProfile} onChange={handleChange} />}
            {activeTab === 'iq' && <KnowledgeBoxIQTests />}
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
          <p className="text-sm text-gray-500">{hasChanges ? 'Ungespeicherte Änderungen' : 'Alle Daten werden sicher in der Cloud gespeichert.'}</p>
          <div className="flex gap-3">
            {!isOnboarding && <button onClick={onClose} className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl">Abbrechen</button>}
            <button onClick={handleSave} disabled={saving || !user} className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 flex items-center gap-2 disabled:opacity-50">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{saving ? 'Speichert...' : 'Speichern'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserKnowledgePanel;
