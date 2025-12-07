import React, { useState } from 'react';
import { Bot, ArrowRight, Sparkles, Brain, Shield, Zap, Camera, User, Star, Trophy } from 'lucide-react';
import OnboardingWizard from './OnboardingWizard';

interface Props {
  userName: string;
  onStartOnboarding: () => void;
  onSkip: () => void;
}

const WelcomeModal: React.FC<Props> = ({ userName, onStartOnboarding, onSkip }) => {
  const [showWizard, setShowWizard] = useState(false);

  const features = [
    { icon: Camera, title: 'Dein persönlicher Avatar', desc: 'Mio sieht aus und spricht wie du', color: 'from-indigo-500 to-purple-600' },
    { icon: Brain, title: 'Personalisierte KI', desc: 'Mio lernt deine Vorlieben und Gewohnheiten', color: 'from-purple-500 to-pink-600' },
    { icon: Zap, title: 'Smarte Automatisierung', desc: 'Routineaufgaben werden automatisch erledigt', color: 'from-pink-500 to-rose-600' },
    { icon: Shield, title: 'Datenschutz', desc: 'Deine Daten bleiben sicher und privat', color: 'from-rose-500 to-orange-600' },
  ];

  const rewards = [
    { icon: Star, label: '275 Punkte', desc: 'zu verdienen' },
    { icon: Trophy, label: '14 Badges', desc: 'freizuschalten' },
  ];

  const handleStartWizard = () => {
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    onStartOnboarding();
  };

  const handleWizardClose = () => {
    setShowWizard(false);
  };

  if (showWizard) {
    return (
      <OnboardingWizard 
        onComplete={handleWizardComplete}
        onClose={handleWizardClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-600 p-8 text-center relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-8 w-20 h-20 bg-white rounded-full blur-2xl" />
            <div className="absolute bottom-4 right-8 w-32 h-32 bg-white rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 rounded-full blur-2xl" />
          </div>
          
          <div className="relative">
            {/* Avatar placeholder */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full mx-auto flex items-center justify-center mb-4 border-4 border-white/30 animate-pulse">
              <div className="w-16 h-16 bg-gradient-to-br from-white/40 to-white/20 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Willkommen, {userName}!
            </h1>
            <p className="text-purple-100 text-lg">Dein Avatar ist fast bereit</p>
            
            {/* Beta badge */}
            <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Beta-Tester Zugang aktiviert
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-gray-600 text-center text-lg">
            Lass uns Mio einrichten, damit er dir optimal helfen kann. 
            Das dauert nur <strong>2-3 Minuten</strong>!
          </p>

          {/* Rewards preview */}
          <div className="flex justify-center gap-6">
            {rewards.map((reward, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-amber-500/30">
                  <reward.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-bold text-gray-900">{reward.label}</p>
                <p className="text-xs text-gray-500">{reward.desc}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${f.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 pt-0 space-y-3">
          <button 
            onClick={handleStartWizard}
            className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 group"
          >
            <Sparkles className="w-5 h-5 group-hover:animate-spin" />
            Mio einrichten
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={onSkip} 
            className="w-full py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Später einrichten
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
