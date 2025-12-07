import React from 'react';
import { AI_PERSONALITIES, RoundTableResponse } from '@/types/aiAgent';
import { BarChart3, Search, Target, Wrench, Lightbulb } from 'lucide-react';

interface Props {
  activePersonality?: string;
  responses: RoundTableResponse[];
  isThinking: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  analyst: <BarChart3 className="w-5 h-5" />,
  critic: <Search className="w-5 h-5" />,
  strategist: <Target className="w-5 h-5" />,
  technical: <Wrench className="w-5 h-5" />,
  creative: <Lightbulb className="w-5 h-5" />,
};

const RoundTableVisual: React.FC<Props> = ({ activePersonality, responses, isThinking }) => {
  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      {/* Central Engine */}
      <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-2xl z-10">
        <div className="text-center text-white">
          <div className={`text-xs font-bold ${isThinking ? 'animate-pulse' : ''}`}>Round Table</div>
          <div className="text-[10px] opacity-80">AI Engine</div>
        </div>
      </div>
      
      {/* Personalities around the table */}
      {AI_PERSONALITIES.map((p, i) => {
        const angle = (i * 72 - 90) * (Math.PI / 180);
        const radius = 42;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        const isActive = activePersonality === p.id;
        const hasResponse = responses.some(r => r.personality === p.id);
        
        return (
          <div
            key={p.id}
            className={`absolute w-14 h-14 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
              isActive ? 'scale-125 shadow-lg ring-2 ring-white' : hasResponse ? 'scale-110' : ''
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              backgroundColor: p.color,
            }}
          >
            <div className="text-white">{iconMap[p.id]}</div>
            <span className="text-[8px] text-white font-medium mt-0.5">{p.name}</span>
          </div>
        );
      })}
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {AI_PERSONALITIES.map((p, i) => {
          const angle = (i * 72 - 90) * (Math.PI / 180);
          const x = 50 + 35 * Math.cos(angle);
          const y = 50 + 35 * Math.sin(angle);
          const isActive = activePersonality === p.id;
          
          return (
            <line
              key={p.id}
              x1="50" y1="50" x2={x} y2={y}
              stroke={isActive ? p.color : '#E5E7EB'}
              strokeWidth={isActive ? 2 : 1}
              className={isActive ? 'animate-pulse' : ''}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default RoundTableVisual;
