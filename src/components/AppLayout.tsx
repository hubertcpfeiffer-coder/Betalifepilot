import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

import Header from '@/components/layout/Header';
import HeroSection from '@/components/layout/HeroSection';
import Footer from '@/components/layout/Footer';
import AuthModal from '@/components/auth/AuthModal';
import FaceSetupModal from '@/components/auth/FaceSetupModal';
import EmailVerificationBanner from '@/components/auth/EmailVerificationBanner';
import BetaTesterBanner from '@/components/auth/BetaTesterBanner';
import SettingsPanel from '@/components/settings/SettingsPanel';
import AIAgentPanel from '@/components/ai/AIAgentPanel';
import ArchitectureSection from '@/components/ai/ArchitectureSection';
import OrganisationFeatures from '@/components/features/OrganisationFeatures';
import LifeCoaches from '@/components/features/LifeCoaches';
import ContactsPanel from '@/components/contacts/ContactsPanel';
import UserKnowledgePanel from '@/components/knowledge/UserKnowledgePanel';
import GuidedTour from '@/components/tour/GuidedTour';
import WelcomeModal from '@/components/onboarding/WelcomeModal';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import AvatarSetupWizard from '@/components/onboarding/AvatarSetupWizard';
import VoiceCommandOverlay from '@/components/voice/VoiceCommandOverlay';
import VoiceHelpModal from '@/components/voice/VoiceHelpModal';
import FloatingVoiceButton from '@/components/voice/FloatingVoiceButton';
import MioVoiceAssistant from '@/components/voice/MioVoiceAssistant';
import TaskPanel from '@/components/tasks/TaskPanel';
import FeedbackButton from '@/components/feedback/FeedbackButton';
import { useVoiceCommands } from '@/hooks/useVoiceCommands';
import { VoiceCommandResult } from '@/types/voiceCommands';
import { TourStep } from '@/components/tour/TourSteps';
import { Bot, Sparkles, Trophy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { trackOnboardingAction, initializeOnboarding, getOnboardingSummary } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';



const CTASection: React.FC<{ onGetStarted: () => void; onOpenAIAgent: () => void }> = ({ onGetStarted, onOpenAIAgent }) => (
  <section className="py-20 bg-gradient-to-r from-cyan-600 to-blue-600">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">Bereit, dein Leben zu optimieren?</h2>
      <p className="text-lg text-cyan-100 mb-8 max-w-2xl mx-auto">Starte jetzt mit Mio-Lifepilot und erlebe, wie KI dein Leben einfacher macht.</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={onGetStarted} className="px-8 py-4 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 flex items-center justify-center gap-2 shadow-lg"><Bot className="w-5 h-5" />Kostenlos starten</button>
        <button onClick={onOpenAIAgent} className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl hover:bg-white/10 border-2 border-white flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" />Demo ausprobieren</button>
      </div>
    </div>
  </section>
);

const AppContent: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [faceSetupOpen, setFaceSetupOpen] = useState(false);
  const [avatarSetupOpen, setAvatarSetupOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiAgentOpen, setAIAgentOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [knowledgeOpen, setKnowledgeOpen] = useState(false);
  const [knowledgeTab, setKnowledgeTab] = useState<string | undefined>();
  const [tasksOpen, setTasksOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingProgressOpen, setOnboardingProgressOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tourOpen, setTourOpen] = useState(false);
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [voiceHelpOpen, setVoiceHelpOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);
  const [roundTableMode, setRoundTableMode] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState<number>(0);
  const { user, isAuthenticated, emailVerified, refreshUser } = useAuth();
  const [dismissedVerificationBanner, setDismissedVerificationBanner] = useState(false);
  const { toast } = useToast();
  
  const architectureRef = useRef<HTMLDivElement>(null);
  const coachesRef = useRef<HTMLDivElement>(null);


  const handleVoiceCommand = useCallback((result: VoiceCommandResult) => {
    switch (result.action) {
      case 'openContacts': setContactsOpen(true); break;
      case 'openKnowledge': setKnowledgeOpen(true); setKnowledgeTab(undefined); break;
      case 'openSettings': setSettingsOpen(true); break;
      case 'openAIAgent': setAIAgentOpen(true); setRoundTableMode(false); break;
      case 'openIQTest': setKnowledgeOpen(true); setKnowledgeTab('iq'); break;
      case 'openTasks': setTasksOpen(true); break;
      case 'startTour': setTourOpen(true); break;
      case 'closeAll': setContactsOpen(false); setKnowledgeOpen(false); setSettingsOpen(false); setAIAgentOpen(false); setTourOpen(false); setVoiceHelpOpen(false); setTasksOpen(false); break;
      case 'showHelp': setVoiceHelpOpen(true); break;
      case 'scrollUp': window.scrollBy({ top: -400, behavior: 'smooth' }); break;
      case 'scrollDown': window.scrollBy({ top: 400, behavior: 'smooth' }); break;
      case 'goHome': window.scrollTo({ top: 0, behavior: 'smooth' }); break;
      case 'openRoundTable': setAIAgentOpen(true); setRoundTableMode(true); break;
      case 'login': setAuthModalOpen(true); break;
    }
  }, []);

  const { isListening, isProcessing, lastCommand, transcript, isSupported, startListening, stopListening } = useVoiceCommands({ onCommand: handleVoiceCommand });
  const toggleVoice = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      // Track voice command usage for onboarding
      if (user?.id) {
        trackOnboardingAction(user.id, 'voice_used').then(result => {
          if (result) {
            toast({ title: 'Onboarding-Schritt abgeschlossen!', description: 'Sprachsteuerung getestet' });
          }
        }).catch(() => {});
      }
    }
  }, [isListening, startListening, stopListening, user?.id, toast]);

  // Load onboarding progress
  useEffect(() => {
    const loadOnboardingProgress = async () => {
      if (isAuthenticated && user?.id && user.is_beta_tester) {
        try {
          const summary = await getOnboardingSummary(user.id);
          setOnboardingProgress(summary.progress_percentage);
        } catch (e) {
          console.error('Error loading onboarding progress:', e);
        }
      }
    };
    loadOnboardingProgress();
  }, [isAuthenticated, user?.id, user?.is_beta_tester]);

  // Check if user needs avatar setup after login
  useEffect(() => {
    const checkAvatarSetup = async () => {
      if (isAuthenticated && user?.id && user.is_beta_tester) {
        // Check if avatar setup is completed
        const { data } = await supabase
          .from('users')
          .select('avatar_setup_completed')
          .eq('id', user.id)
          .single();
        
        if (data && !data.avatar_setup_completed) {
          // Check if this is a new user (just registered)
          const hasSeenWelcome = localStorage.getItem(`mio_welcome_${user.id}`);
          if (!hasSeenWelcome) {
            // New user - avatar setup will be shown after signup
          }
        }
      }
    };
    checkAvatarSetup();
  }, [isAuthenticated, user?.id, user?.is_beta_tester]);

  useEffect(() => {
    const checkNewUser = async () => {
      if (isAuthenticated && user?.id) {
        const hasSeenWelcome = localStorage.getItem(`mio_welcome_${user.id}`);
        if (!hasSeenWelcome) {
          const { data } = await supabase.from('user_knowledge_profiles').select('id').eq('user_id', user.id).single();
          if (!data) setShowWelcome(true);
        }
        
        // Initialize onboarding for beta testers
        if (user.is_beta_tester) {
          await initializeOnboarding(user.id).catch(() => {});
        }
      }
    };
    checkNewUser();
  }, [isAuthenticated, user]);

  // After signup, show avatar setup wizard
  const handleSignupComplete = () => {
    setTimeout(() => setAvatarSetupOpen(true), 500);
  };

  // After avatar setup complete
  const handleAvatarSetupComplete = async () => {
    setAvatarSetupOpen(false);
    await refreshUser();
    
    // Track profile completion for onboarding
    if (user?.id) {
      await trackOnboardingAction(user.id, 'profile_completed').catch(() => {});
      const summary = await getOnboardingSummary(user.id).catch(() => null);
      if (summary) setOnboardingProgress(summary.progress_percentage);
    }
    
    // Show welcome modal after avatar setup
    setTimeout(() => setShowWelcome(true), 300);
  };

  // After face setup (complete or skip), show welcome
  const handleFaceSetupComplete = () => {
    setFaceSetupOpen(false);
    setTimeout(() => setShowWelcome(true), 300);
  };

  const handleStartOnboarding = () => { setShowWelcome(false); setShowOnboarding(true); if (user?.id) localStorage.setItem(`mio_welcome_${user.id}`, 'true'); };
  const handleSkipOnboarding = () => { setShowWelcome(false); if (user?.id) localStorage.setItem(`mio_welcome_${user.id}`, 'true'); };
  const handleOnboardingComplete = async () => { 
    setShowOnboarding(false); 
    setAIAgentOpen(true);
    
    // Track profile completion
    if (user?.id) {
      const result = await trackOnboardingAction(user.id, 'knowledge_added').catch(() => null);
      if (result) {
        toast({ title: 'Onboarding-Schritt abgeschlossen!', description: 'Profil vervollständigt' });
        // Refresh progress
        const summary = await getOnboardingSummary(user.id).catch(() => null);
        if (summary) setOnboardingProgress(summary.progress_percentage);
      }
    }
  };
  const handleOpenAuth = (mode: 'login' | 'signup' = 'login') => { setAuthMode(mode); setAuthModalOpen(true); };

  const handleTourAction = (action: TourStep['action']) => {
    if (!action) return;
    switch (action) {
      case 'openKnowledge': setHighlightSection('knowledge'); break;
      case 'openContacts': setHighlightSection('contacts'); break;
      case 'openSettings': setSettingsOpen(true); break;
      case 'openAI': setTourOpen(false); setTimeout(() => setAIAgentOpen(true), 300); break;
      case 'scrollToArchitecture': setHighlightSection('roundtable'); architectureRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
      case 'scrollToCoaches': setHighlightSection('leben'); coachesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); break;
    }
    if (action !== 'openAI') setTimeout(() => setHighlightSection(null), 4000);
  };

  // Handle onboarding navigation from progress panel
  const handleOnboardingNavigate = async (action: string) => {
    switch (action) {
      case 'openKnowledge':
        setKnowledgeOpen(true);
        break;
      case 'openTasks':
        setTasksOpen(true);
        break;
      case 'openAI':
        setAIAgentOpen(true);
        setRoundTableMode(false);
        // Track AI usage
        if (user?.id) {
          trackOnboardingAction(user.id, 'ai_used').catch(() => {});
        }
        break;
      case 'openContacts':
        setContactsOpen(true);
        break;
      case 'startVoice':
        if (isSupported) {
          startListening();
          if (user?.id) {
            trackOnboardingAction(user.id, 'voice_used').catch(() => {});
          }
        }
        break;
      case 'openRoundTable':
        setAIAgentOpen(true);
        setRoundTableMode(true);
        // Track Round Table visit
        if (user?.id) {
          trackOnboardingAction(user.id, 'round_table').catch(() => {});
        }
        break;
      case 'openIQTest':
        setKnowledgeOpen(true);
        setKnowledgeTab('iq');
        break;
      case 'openAvatarSetup':
        setAvatarSetupOpen(true);
        break;
    }
  };

  // Track AI Agent usage when opened
  const handleOpenAIAgent = useCallback(async () => {
    setAIAgentOpen(true);
    if (user?.id) {
      const result = await trackOnboardingAction(user.id, 'ai_used').catch(() => null);
      if (result) {
        toast({ title: 'Onboarding-Schritt abgeschlossen!', description: 'KI-Assistent genutzt' });
        const summary = await getOnboardingSummary(user.id).catch(() => null);
        if (summary) setOnboardingProgress(summary.progress_percentage);
      }
    }
  }, [user?.id, toast]);

  // Track Round Table visit
  const handleOpenRoundTable = useCallback(async () => {
    setAIAgentOpen(true);
    setRoundTableMode(true);
    if (user?.id) {
      const result = await trackOnboardingAction(user.id, 'round_table').catch(() => null);
      if (result) {
        toast({ title: 'Onboarding-Schritt abgeschlossen!', description: 'Round Table besucht' });
        const summary = await getOnboardingSummary(user.id).catch(() => null);
        if (summary) setOnboardingProgress(summary.progress_percentage);
      }
    }
  }, [user?.id, toast]);

  return (
    <div className="min-h-screen bg-white">
      {/* Beta Tester Banner with Onboarding Progress */}
      {isAuthenticated && user?.is_beta_tester && (user.status === 'pending_review' || user.status === 'approved') && (
        <BetaTesterBanner 
          status={user.status as 'pending_review' | 'approved'} 
          userName={user.full_name}
          onboardingProgress={onboardingProgress}
          onOpenProgress={() => setOnboardingProgressOpen(true)}
          avatarSetupCompleted={user.avatar_setup_completed}
        />
      )}
      {/* Email Verification Banner - nur anzeigen wenn nicht Beta-Tester oder nach Genehmigung */}
      {isAuthenticated && user && !emailVerified && !dismissedVerificationBanner && !user.is_beta_tester && (
        <EmailVerificationBanner 
          email={user.email} 
          userId={user.id} 
          onDismiss={() => setDismissedVerificationBanner(true)} 
        />
      )}
      <Header 
        onOpenAuth={() => handleOpenAuth('login')} 
        onOpenSettings={() => setSettingsOpen(true)} 
        onOpenAIAgent={handleOpenAIAgent} 
        onOpenContacts={() => setContactsOpen(true)} 
        onOpenKnowledge={() => setKnowledgeOpen(true)} 
        onOpenTasks={() => setTasksOpen(true)} 
        onVoiceCommand={isSupported ? toggleVoice : undefined} 
        isVoiceListening={isListening} 
        isMobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
      />
      <main>
        <HeroSection onGetStarted={() => handleOpenAuth('signup')} onOpenAIAgent={() => setTourOpen(true)} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div ref={architectureRef}><ArchitectureSection onOpenAIAgent={handleOpenAIAgent} highlightSection={highlightSection} /></div>
        <OrganisationFeatures onOpenContacts={() => setContactsOpen(true)} onOpenKnowledge={() => setKnowledgeOpen(true)} onOpenTasks={() => setTasksOpen(true)} />
        <div ref={coachesRef}><LifeCoaches onOpenAIAgent={handleOpenAIAgent} /></div>
        <CTASection onGetStarted={() => handleOpenAuth('signup')} onOpenAIAgent={handleOpenAIAgent} />
      </main>

      <Footer />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} onSignupComplete={handleSignupComplete} />
      <FaceSetupModal isOpen={faceSetupOpen} onClose={handleFaceSetupComplete} onComplete={handleFaceSetupComplete} />
      <AvatarSetupWizard isOpen={avatarSetupOpen} onClose={() => setAvatarSetupOpen(false)} onComplete={handleAvatarSetupComplete} />
      <AIAgentPanel isOpen={aiAgentOpen} onClose={() => { setAIAgentOpen(false); setRoundTableMode(false); }} userAvatar={user?.avatar_url} onOpenAuth={() => handleOpenAuth('signup')} initialRoundTable={roundTableMode} />
      <ContactsPanel isOpen={contactsOpen} onClose={() => setContactsOpen(false)} />
      <TaskPanel isOpen={tasksOpen} onClose={() => setTasksOpen(false)} />
      <GuidedTour isOpen={tourOpen} onClose={() => setTourOpen(false)} onAction={handleTourAction} />
      {showWelcome && user && <WelcomeModal userName={user.full_name || 'Freund'} onStartOnboarding={handleStartOnboarding} onSkip={handleSkipOnboarding} />}
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} onClose={() => setShowOnboarding(false)} />}
      <OnboardingProgress 
        isOpen={onboardingProgressOpen} 
        onClose={() => setOnboardingProgressOpen(false)}
        onNavigate={handleOnboardingNavigate}
      />
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <SettingsPanel 
            onClose={() => setSettingsOpen(false)} 
            onOpenKnowledge={() => { setSettingsOpen(false); setKnowledgeOpen(true); }} 
            onOpenFaceSetup={() => { setSettingsOpen(false); setFaceSetupOpen(true); }} 
            onOpenAvatarSetup={() => { setSettingsOpen(false); setAvatarSetupOpen(true); }} 
          />
        </div>
      )}
      {knowledgeOpen && <UserKnowledgePanel onClose={() => setKnowledgeOpen(false)} initialTab={knowledgeTab} />}
      <VoiceCommandOverlay isListening={isListening} isProcessing={isProcessing} transcript={transcript} lastCommand={lastCommand} onClose={stopListening} />
      <VoiceHelpModal isOpen={voiceHelpOpen} onClose={() => setVoiceHelpOpen(false)} />
      <FloatingVoiceButton isListening={isListening} isProcessing={isProcessing} isSupported={isSupported} onToggle={toggleVoice} onShowHelp={() => setVoiceHelpOpen(true)} onOpenVoiceAssistant={() => setVoiceAssistantOpen(true)} />
      <MioVoiceAssistant isOpen={voiceAssistantOpen} onClose={() => setVoiceAssistantOpen(false)} onOpenAI={handleOpenAIAgent} />
      
      {/* Floating Onboarding Progress Button for Beta Testers */}
      {isAuthenticated && user?.is_beta_tester && !user.onboarding_completed && onboardingProgress < 100 && (
        <button
          onClick={() => setOnboardingProgressOpen(true)}
          className="fixed bottom-24 right-6 z-40 p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
          title="Onboarding-Fortschritt"
        >
          <Trophy className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-amber-600 text-xs font-bold rounded-full flex items-center justify-center shadow">
            {onboardingProgress}%
          </span>
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Onboarding-Fortschritt
          </span>
        </button>
      )}
      
      {/* Beta Feedback Button - nur für Beta-Tester anzeigen */}
      {isAuthenticated && user?.is_beta_tester && (
        <FeedbackButton variant="floating" />
      )}
    </div>


  );
};
// AppContent is the main component - AuthProvider is in App.tsx
const AppLayout: React.FC = () => <AppContent />;
export default AppLayout;
