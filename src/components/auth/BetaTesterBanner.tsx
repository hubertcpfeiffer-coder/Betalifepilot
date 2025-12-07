import React from 'react';
import { Clock, CheckCircle, Sparkles, Info, Trophy, ChevronRight, Camera } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Props {
  status: 'pending_review' | 'approved' | 'active';
  userName?: string;
  onboardingProgress?: number;
  onOpenProgress?: () => void;
  avatarSetupCompleted?: boolean;
}

const BetaTesterBanner: React.FC<Props> = ({ status, userName, onboardingProgress = 0, onOpenProgress, avatarSetupCompleted }) => {
  if (status === 'active') return null;

  const configs = {
    pending_review: {
      bg: 'bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-indigo-200',
      icon: Clock,
      iconBg: 'bg-indigo-100 text-indigo-600',
      title: 'Willkommen als Beta-Tester!',
      message: `Hallo${userName ? ` ${userName}` : ''}! Dein Konto wird gerade überprüft. Du kannst die App bereits erkunden, während wir deine Registrierung bestätigen.`,
      badge: 'Wird überprüft',
      badgeColor: 'bg-amber-100 text-amber-700'
    },
    approved: {
      bg: 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200',
      icon: CheckCircle,
      iconBg: 'bg-green-100 text-green-600',
      title: 'Beta-Zugang genehmigt!',
      message: `Herzlichen Glückwunsch${userName ? `, ${userName}` : ''}! Du hast jetzt vollen Zugang zu allen Beta-Funktionen. Hilf uns, Mio noch besser zu machen!`,
      badge: 'Genehmigt',
      badgeColor: 'bg-green-100 text-green-700'
    }
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${config.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h3 className="font-semibold text-gray-900">{config.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {config.badge}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Beta-Tester
              </span>
              {avatarSetupCompleted && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-700 flex items-center gap-1">
                  <Camera className="w-3 h-3" /> Avatar aktiv
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 hidden sm:block">{config.message}</p>
          </div>
          
          {/* Onboarding Progress Section */}
          {onboardingProgress !== undefined && onOpenProgress && (
            <button
              onClick={onOpenProgress}
              className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/80 hover:bg-white rounded-xl border border-gray-200 transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Onboarding</p>
                  <p className="text-sm font-semibold text-gray-900">{onboardingProgress}%</p>
                </div>
              </div>
              <div className="w-20">
                <Progress value={onboardingProgress} className="h-2" />
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          )}
          
          <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4" />
            <span>Feedback? Schreib uns!</span>
          </div>
        </div>
        
        {/* Mobile Onboarding Progress */}
        {onboardingProgress !== undefined && onOpenProgress && (
          <button
            onClick={onOpenProgress}
            className="md:hidden mt-3 w-full flex items-center justify-between gap-3 px-4 py-2 bg-white/80 hover:bg-white rounded-xl border border-gray-200 transition-all"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">Onboarding-Fortschritt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24">
                <Progress value={onboardingProgress} className="h-2" />
              </div>
              <span className="text-sm font-bold text-gray-900">{onboardingProgress}%</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
};

export default BetaTesterBanner;
