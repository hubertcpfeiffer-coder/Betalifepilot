import React from 'react';
import { Bot, Sparkles, Brain, Shield, Zap, Heart, MessageCircle, Calendar } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const WelcomeStep: React.FC<Props> = ({ onComplete }) => {
  const features = [
    { icon: Brain, title: 'Personalisierte KI', desc: 'Mio lernt deine Vorlieben', color: 'from-purple-500 to-pink-500' },
    { icon: MessageCircle, title: 'Natürliche Gespräche', desc: 'Sprich wie mit einem Freund', color: 'from-blue-500 to-cyan-500' },
    { icon: Calendar, title: 'Aufgaben-Management', desc: 'Behalte den Überblick', color: 'from-green-500 to-emerald-500' },
    { icon: Shield, title: 'Datenschutz', desc: 'Deine Daten sind sicher', color: 'from-orange-500 to-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Animated Avatar */}
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-16 h-16 text-indigo-600" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-6 h-6 text-yellow-800" />
          </div>
        </div>
      </div>

      {/* Welcome text */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Hallo! Ich bin Mio
        </h3>
        <p className="text-gray-600">
          Dein persönlicher KI-Assistent, der dir hilft, deinen Alltag zu organisieren 
          und deine Ziele zu erreichen.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div 
            key={index}
            className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
          >
            <div className={`w-10 h-10 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
            <p className="text-xs text-gray-500">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onComplete}
        className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30"
      >
        <Heart className="w-5 h-5" />
        Lass uns starten!
      </button>
    </div>
  );
};

export default WelcomeStep;
