import React, { useState } from 'react';
import { Target, Heart, GraduationCap, Sparkles, MessageCircle, Play } from 'lucide-react';

interface CoachCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  gradient: string;
  onClick?: () => void;
  onStartSession?: () => void;
}

const CoachCard: React.FC<CoachCardProps> = ({ icon: Icon, title, subtitle, description, features, gradient, onClick, onStartSession }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
    >
      <div className={`p-6 ${gradient} relative`}>
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{subtitle}</p>
        {isHovered && (
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={onStartSession} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Play className="w-5 h-5 text-white" />
            </button>
            <button onClick={onClick} className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
      <div className="p-6">
        <p className="text-gray-600 mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <Sparkles className="w-4 h-4 text-cyan-500 flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <button onClick={onClick} className={`w-full mt-4 py-3 ${gradient} text-white rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}>
          <MessageCircle className="w-5 h-5" />
          Session starten
        </button>
      </div>
    </div>
  );
};

interface Props {
  onOpenAIAgent?: () => void;
}

const LifeCoaches: React.FC<Props> = ({ onOpenAIAgent }) => {
  const coaches = [
    {
      icon: Target,
      title: 'Erfolgscoach',
      subtitle: 'Dein Weg zum Erfolg',
      description: 'Entwickelt mit dir deine persönlichen Ziele und begleitet dich bei deren Umsetzung. Schritt für Schritt zu deinem besten Ich.',
      features: ['Zielsetzung & Planung', 'Fortschrittstracking', 'Motivationsbooster', 'Gewohnheitsbildung'],
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    },
    {
      icon: Heart,
      title: 'Gesundheitscoach',
      subtitle: 'Körper & Geist im Einklang',
      description: 'Unterstützt dich bei Ernährung, Fitness und mentalem Wohlbefinden. Für ein gesundes und ausgeglichenes Leben.',
      features: ['Ernährungsberatung', 'Fitness-Pläne', 'Schlafoptimierung', 'Stressmanagement'],
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      icon: GraduationCap,
      title: 'Private Professor',
      subtitle: 'Dein Wissenscoach',
      description: 'Dein persönlicher Lehrer für lebenslanges Lernen. Erklärt komplexe Themen einfach und passt sich deinem Lerntempo an.',
      features: ['Personalisiertes Lernen', 'Alle Wissensgebiete', 'Interaktive Erklärungen', 'Prüfungsvorbereitung'],
      gradient: 'bg-gradient-to-br from-violet-500 to-purple-600',
    },
  ];

  return (
    <section id="coaches" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Leben</span> - Deine persönlichen Coaches
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Drei spezialisierte KI-Coaches begleiten dich auf deinem Weg zur besten Version deiner selbst.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {coaches.map((coach, i) => (
            <CoachCard key={i} {...coach} onClick={onOpenAIAgent} onStartSession={onOpenAIAgent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default LifeCoaches;
