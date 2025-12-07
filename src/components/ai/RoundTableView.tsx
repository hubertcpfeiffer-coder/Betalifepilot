import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { LifeAdvisor } from '@/types/aiAgent';

interface Props {
  advisorResponses: LifeAdvisor[];
  summary: string;
  onSpeak?: (text: string) => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
}

const RoundTableView: React.FC<Props> = ({ advisorResponses, summary, onSpeak, isSpeaking, onStopSpeaking }) => {
  const [expandedAdvisor, setExpandedAdvisor] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(true);

  const toggleAdvisor = (id: string) => {
    setExpandedAdvisor(expandedAdvisor === id ? null : id);
  };

  return (
    <div className="space-y-3">
      {/* Round Table Visual */}
      <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-semibold">Der Runde Tisch</span>
        </div>
        
        {/* Circular Advisor Layout */}
        <div className="relative h-32 mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-500/30 flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          {advisorResponses.map((advisor, index) => {
            const angle = (index * 72 - 90) * (Math.PI / 180);
            const radius = 55;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            return (
              <button
                key={advisor.id}
                onClick={() => toggleAdvisor(advisor.id)}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:scale-110 ${
                  expandedAdvisor === advisor.id ? 'ring-2 ring-white scale-110' : ''
                }`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: advisor.color + '30',
                  border: `2px solid ${advisor.color}`
                }}
              >
                {advisor.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisor Responses */}
      <div className="space-y-2">
        {advisorResponses.map((advisor) => (
          <div
            key={advisor.id}
            className="bg-white/5 rounded-xl border border-white/10 overflow-hidden transition-all"
          >
            <button
              onClick={() => toggleAdvisor(advisor.id)}
              className="w-full p-3 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{advisor.emoji}</span>
                <span className="text-white font-medium text-sm">{advisor.name}</span>
              </div>
              {expandedAdvisor === advisor.id ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {expandedAdvisor === advisor.id && (
              <div className="px-3 pb-3 border-t border-white/10">
                <p className="text-gray-300 text-sm leading-relaxed pt-3">{advisor.response}</p>
                {onSpeak && (
                  <button
                    onClick={() => isSpeaking ? onStopSpeaking?.() : onSpeak(advisor.response || '')}
                    className="mt-2 text-cyan-400 hover:text-cyan-300 text-xs flex items-center gap-1"
                  >
                    {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    {isSpeaking ? 'Stoppen' : 'Vorlesen'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/30 p-4">
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="w-full flex items-center justify-between mb-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-semibold text-sm">Mios Zusammenfassung</span>
          </div>
          {showSummary ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-cyan-400" />}
        </button>
        {showSummary && (
          <p className="text-gray-200 text-sm leading-relaxed">{summary}</p>
        )}
      </div>
    </div>
  );
};

export default RoundTableView;
