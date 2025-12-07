import React from 'react';
import { Puzzle, BookOpen, Calculator, Box, Heart, Palette, Brain, Globe, ChevronRight, Trophy } from 'lucide-react';
import { IQ_CATEGORIES } from '@/types/iqTests';

interface Props {
  category: typeof IQ_CATEGORIES[number];
  score?: number;
  testsCompleted: number;
  onStart: () => void;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Puzzle, BookOpen, Calculator, Box, Heart, Palette, Brain, Globe
};

const IQTestCard: React.FC<Props> = ({ category, score, testsCompleted, onStart }) => {
  const Icon = iconMap[category.icon] || Brain;
  
  return (
    <button
      onClick={onStart}
      className={`w-full p-4 rounded-2xl bg-gradient-to-br ${category.color} text-white text-left transition-all hover:scale-[1.02] hover:shadow-lg group`}
    >
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        {score !== undefined && score > 0 && (
          <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-lg">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-bold">{Math.round(score)}%</span>
          </div>
        )}
      </div>
      <h3 className="font-bold mt-3">{category.name}</h3>
      <p className="text-sm text-white/80 mt-1">
        {testsCompleted > 0 ? `${testsCompleted} Tests absolviert` : 'Noch nicht getestet'}
      </p>
      <div className="flex items-center gap-1 mt-3 text-sm text-white/90 group-hover:text-white">
        <span>Test starten</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </button>
  );
};

export default IQTestCard;
