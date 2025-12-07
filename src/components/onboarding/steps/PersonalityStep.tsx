import React, { useState } from 'react';
import { Heart, Check, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (personality: PersonalityData) => void;
  onSkip: () => void;
}

export interface PersonalityData {
  traits: string[];
  communicationStyle: string;
  humor: string;
  formality: string;
}

const personalityTraits = [
  { id: 'hilfsbereit', label: 'Hilfsbereit', icon: '🤝' },
  { id: 'freundlich', label: 'Freundlich', icon: '😊' },
  { id: 'geduldig', label: 'Geduldig', icon: '🧘' },
  { id: 'motivierend', label: 'Motivierend', icon: '💪' },
  { id: 'analytisch', label: 'Analytisch', icon: '🔍' },
  { id: 'kreativ', label: 'Kreativ', icon: '🎨' },
  { id: 'empathisch', label: 'Empathisch', icon: '💗' },
  { id: 'direkt', label: 'Direkt', icon: '🎯' },
  { id: 'humorvoll', label: 'Humorvoll', icon: '😄' },
  { id: 'ruhig', label: 'Ruhig', icon: '🌿' },
  { id: 'enthusiastisch', label: 'Enthusiastisch', icon: '🌟' },
  { id: 'strukturiert', label: 'Strukturiert', icon: '📋' },
];

const communicationStyles = [
  { id: 'casual', label: 'Locker & Entspannt', desc: 'Wie mit einem guten Freund', icon: '💬' },
  { id: 'professional', label: 'Professionell', desc: 'Sachlich und respektvoll', icon: '👔' },
  { id: 'encouraging', label: 'Aufmunternd', desc: 'Immer positiv und motivierend', icon: '🎉' },
  { id: 'concise', label: 'Kurz & Knapp', desc: 'Direkt auf den Punkt', icon: '⚡' },
];

const humorLevels = [
  { id: 'none', label: 'Kein Humor', desc: 'Immer sachlich' },
  { id: 'light', label: 'Leichter Humor', desc: 'Ab und zu ein Witz' },
  { id: 'moderate', label: 'Moderater Humor', desc: 'Regelmäßig humorvoll' },
  { id: 'high', label: 'Viel Humor', desc: 'So oft wie möglich' },
];

const formalityLevels = [
  { id: 'du', label: 'Du', desc: 'Informell, per Du' },
  { id: 'sie', label: 'Sie', desc: 'Formell, per Sie' },
];

const PersonalityStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['hilfsbereit', 'freundlich']);
  const [communicationStyle, setCommunicationStyle] = useState('casual');
  const [humor, setHumor] = useState('light');
  const [formality, setFormality] = useState('du');

  const toggleTrait = (traitId: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(traitId)) {
        return prev.filter(t => t !== traitId);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, traitId];
    });
  };

  const handleComplete = () => {
    onComplete({
      traits: selectedTraits,
      communicationStyle,
      humor,
      formality
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Mios Persönlichkeit</h3>
        <p className="text-gray-500 text-sm">Wie soll Mio mit dir kommunizieren?</p>
      </div>

      {/* Personality Traits */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          Persönlichkeitsmerkmale (max. 4):
        </p>
        <div className="flex flex-wrap gap-2">
          {personalityTraits.map((trait) => (
            <button
              key={trait.id}
              onClick={() => toggleTrait(trait.id)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                selectedTraits.includes(trait.id)
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-rose-100 hover:text-rose-700'
              }`}
            >
              <span>{trait.icon}</span>
              {trait.label}
            </button>
          ))}
        </div>
      </div>

      {/* Communication Style */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Kommunikationsstil:</p>
        <div className="grid grid-cols-2 gap-2">
          {communicationStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setCommunicationStyle(style.id)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                communicationStyle === style.id
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span>{style.icon}</span>
                <span className="font-medium text-gray-900">{style.label}</span>
              </div>
              <p className="text-xs text-gray-500">{style.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Formality */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Anrede:</p>
        <div className="flex gap-3">
          {formalityLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setFormality(level.id)}
              className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                formality === level.id
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-rose-300'
              }`}
            >
              <span className="font-bold text-lg text-gray-900">{level.label}</span>
              <p className="text-xs text-gray-500 mt-1">{level.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Humor Level */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Humor-Level:</p>
        <div className="flex gap-2">
          {humorLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setHumor(level.id)}
              className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
                humor === level.id
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-rose-100'
              }`}
              title={level.desc}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900 mb-1">Vorschau:</p>
            <p className="text-sm text-gray-600 italic">
              {formality === 'du' ? '"Hey! ' : '"Guten Tag! '}
              {communicationStyle === 'casual' && 'Schön, dass du da bist! '}
              {communicationStyle === 'professional' && 'Ich freue mich, Ihnen behilflich zu sein. '}
              {communicationStyle === 'encouraging' && 'Das wird super! '}
              {communicationStyle === 'concise' && 'Wie kann ich helfen? '}
              {humor !== 'none' && '😊'}
              "
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Überspringen
        </button>
        <button
          onClick={handleComplete}
          className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default PersonalityStep;
