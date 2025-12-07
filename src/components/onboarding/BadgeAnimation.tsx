import React, { useEffect, useState } from 'react';
import { 
  Sparkles, User, Camera, Palette, Mic, Heart, Star, Target, 
  CheckSquare, Volume2, Users, Award, Trophy, Medal, Zap, Settings
} from 'lucide-react';
import { ONBOARDING_BADGES } from '@/types/onboarding';

interface Props {
  badgeId: string;
  points: number;
  onComplete: () => void;
}

const iconMap: Record<string, React.ElementType> = {
  Sparkles, User, Camera, Palette, Mic, Heart, Star, Target,
  CheckSquare, Volume2, Users, Award, Trophy, Medal, Zap, Settings
};

const BadgeAnimation: React.FC<Props> = ({ badgeId, points, onComplete }) => {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');
  const badge = ONBOARDING_BADGES[badgeId];
  const IconComponent = badge ? iconMap[badge.icon] || Award : Award;

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('show'), 100);
    const showTimer = setTimeout(() => setPhase('exit'), 2500);
    const exitTimer = setTimeout(onComplete, 3000);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(showTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500
      ${phase === 'enter' ? 'opacity-0' : phase === 'show' ? 'opacity-100' : 'opacity-0'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-full animate-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              top: '-20px',
              backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][i % 7],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Badge content */}
      <div className={`relative transform transition-all duration-700 ease-out
        ${phase === 'enter' ? 'scale-50 opacity-0' : phase === 'show' ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}>
        
        {/* Glow effect */}
        <div className="absolute inset-0 -m-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full blur-3xl opacity-50 animate-pulse" />
        
        {/* Badge container */}
        <div className="relative bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-3xl p-8 shadow-2xl">
          {/* Inner glow */}
          <div className="absolute inset-2 bg-gradient-to-br from-yellow-300/50 to-transparent rounded-2xl" />
          
          {/* Stars decoration */}
          <div className="absolute -top-4 -left-4 text-yellow-300 animate-spin-slow">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute -top-4 -right-4 text-yellow-300 animate-spin-slow" style={{ animationDirection: 'reverse' }}>
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="absolute -bottom-4 -left-4 text-yellow-300 animate-spin-slow" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute -bottom-4 -right-4 text-yellow-300 animate-spin-slow" style={{ animationDelay: '0.5s', animationDirection: 'reverse' }}>
            <Sparkles className="w-6 h-6" />
          </div>

          <div className="relative text-center">
            {/* Badge icon */}
            <div className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border-4 border-white/40 shadow-inner">
              <div className="w-16 h-16 bg-gradient-to-br from-white to-yellow-100 rounded-full flex items-center justify-center shadow-lg">
                <IconComponent className="w-10 h-10 text-amber-600" />
              </div>
            </div>

            {/* Badge text */}
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">
              Badge erhalten!
            </h2>
            <h3 className="text-xl font-semibold text-yellow-100 mb-2">
              {badge?.name || 'Neues Badge'}
            </h3>
            <p className="text-yellow-100/80 text-sm mb-4 max-w-xs">
              {badge?.description || 'Du hast einen neuen Meilenstein erreicht!'}
            </p>

            {/* Points earned */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
              <Star className="w-5 h-5 text-yellow-200 fill-yellow-200" />
              <span className="text-white font-bold text-lg">+{points} Punkte</span>
            </div>
          </div>
        </div>
      </div>

      {/* Custom styles for confetti animation */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BadgeAnimation;
