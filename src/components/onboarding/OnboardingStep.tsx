import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

const OnboardingStep: React.FC<Props> = ({ icon: Icon, title, description, children, currentStep, totalSteps }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
          <Icon className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <span className="text-sm text-gray-400">Schritt {currentStep} von {totalSteps}</span>
          </div>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
      <div className="flex gap-1 mb-4">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < currentStep ? 'bg-cyan-500' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

export default OnboardingStep;
