import React from 'react';
import { Users, Brain, Heart, Briefcase, Sparkles, Target, MessageCircle, Trophy, Activity, Wallet, Lightbulb, Calendar } from 'lucide-react';

interface Props {
  moduleId: string;
  position: 'left' | 'right' | 'center';
  isVisible: boolean;
}

const moduleData: Record<string, { icon: React.ReactNode; title: string; subtitle: string; color: string; features: { icon: React.ReactNode; text: string }[] }> = {
  'welcome': {
    icon: <Sparkles className="w-16 h-16" />,
    title: 'Willkommen bei Mio',
    subtitle: 'Dein persönlicher KI-Lebensbegleiter',
    color: 'from-cyan-500 via-blue-500 to-indigo-600',
    features: [
      { icon: <MessageCircle className="w-5 h-5" />, text: 'Persönliche KI-Assistenz' },
      { icon: <Activity className="w-5 h-5" />, text: '24/7 Verfügbar' },
      { icon: <Target className="w-5 h-5" />, text: 'Datenschutz garantiert' },
    ],
  },
  'round-table': {
    icon: <Users className="w-16 h-16" />,
    title: 'Der Runde Tisch',
    subtitle: '5 KI-Experten beraten gemeinsam',
    color: 'from-purple-500 via-violet-500 to-fuchsia-600',
    features: [
      { icon: <Briefcase className="w-5 h-5" />, text: 'Karriere-Experte' },
      { icon: <Heart className="w-5 h-5" />, text: 'Beziehungs-Coach' },
      { icon: <Wallet className="w-5 h-5" />, text: 'Finanz-Berater' },
    ],
  },
  'knowledge': {
    icon: <Brain className="w-16 h-16" />,
    title: 'Mios Wissen',
    subtitle: 'Dein persönliches Profil',
    color: 'from-blue-500 via-cyan-500 to-teal-500',
    features: [
      { icon: <Trophy className="w-5 h-5" />, text: 'IQ & Begabungstests' },
      { icon: <Target className="w-5 h-5" />, text: 'Ziele & Träume' },
      { icon: <Lightbulb className="w-5 h-5" />, text: 'Interessen & Stärken' },
    ],
  },
  'contacts': {
    icon: <Heart className="w-16 h-16" />,
    title: 'Deine Kontakte',
    subtitle: 'Beziehungen pflegen',
    color: 'from-pink-500 via-rose-500 to-red-500',
    features: [
      { icon: <Calendar className="w-5 h-5" />, text: 'Geburtstags-Erinnerungen' },
      { icon: <MessageCircle className="w-5 h-5" />, text: 'Kontakt-Vorschläge' },
      { icon: <Users className="w-5 h-5" />, text: 'Beziehungs-Tipps' },
    ],
  },
  'coaches': {
    icon: <Briefcase className="w-16 h-16" />,
    title: 'Life Coaches',
    subtitle: 'Spezialisierte KI-Coaches',
    color: 'from-emerald-500 via-green-500 to-teal-500',
    features: [
      { icon: <Target className="w-5 h-5" />, text: 'Karriere-Coach' },
      { icon: <Activity className="w-5 h-5" />, text: 'Gesundheits-Coach' },
      { icon: <Wallet className="w-5 h-5" />, text: 'Finanz-Coach' },
    ],
  },
  'ready': {
    icon: <Target className="w-16 h-16" />,
    title: 'Bereit loszulegen!',
    subtitle: 'Starte jetzt mit Mio',
    color: 'from-orange-500 via-amber-500 to-yellow-500',
    features: [
      { icon: <MessageCircle className="w-5 h-5" />, text: 'Fragen stellen' },
      { icon: <Sparkles className="w-5 h-5" />, text: 'Leben optimieren' },
      { icon: <Trophy className="w-5 h-5" />, text: 'Ziele erreichen' },
    ],
  },
};

const ModulePreview: React.FC<Props> = ({ moduleId, position, isVisible }) => {
  const module = moduleData[moduleId] || moduleData['welcome'];
  
  const positionClasses = {
    left: 'left-16',
    right: 'right-16',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className={`fixed top-1/2 -translate-y-1/2 z-[95] transition-all duration-700 ease-out ${positionClasses[position]} ${
      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
    }`} style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
      <div className={`bg-gradient-to-br ${module.color} p-10 rounded-3xl shadow-2xl w-96 relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="text-white/90 mb-6 animate-pulse">{module.icon}</div>
          <h3 className="text-3xl font-bold text-white mb-2">{module.title}</h3>
          <p className="text-white/80 text-lg mb-8">{module.subtitle}</p>
          <ul className="space-y-3">
            {module.features.map((f, i) => (
              <li key={i} className="flex items-center gap-4 text-white bg-white/15 rounded-2xl px-5 py-3.5 backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-colors">
                <div className="text-white/90 p-2 bg-white/10 rounded-xl">{f.icon}</div>
                <span className="font-medium text-lg">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModulePreview;
