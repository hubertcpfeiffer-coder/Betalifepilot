import React, { useState } from 'react';
import { Star, Check, Plus, X } from 'lucide-react';

interface Props {
  onComplete: (interests: string[]) => void;
  onSkip: () => void;
}

const suggestedInterests = [
  'Sport', 'Musik', 'Filme', 'Bücher', 'Reisen', 'Kochen',
  'Gaming', 'Fotografie', 'Kunst', 'Technologie', 'Natur', 'Fitness',
  'Mode', 'Wissenschaft', 'Geschichte', 'Sprachen', 'Handwerk', 'Meditation'
];

const InterestsStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest('');
    }
  };

  const handleComplete = () => {
    if (selectedInterests.length >= 1) {
      onComplete(selectedInterests);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Deine Interessen</h3>
        <p className="text-gray-500 text-sm">Wähle mindestens ein Interesse aus</p>
      </div>

      {/* Selected interests */}
      {selectedInterests.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-amber-50 rounded-xl">
          {selectedInterests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-500 text-white rounded-full text-sm font-medium"
            >
              {interest}
              <button
                onClick={() => toggleInterest(interest)}
                className="hover:bg-amber-600 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Suggested interests */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Vorschläge:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedInterests.map((interest) => (
            <button
              key={interest}
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedInterests.includes(interest)
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-amber-100 hover:text-amber-700'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Custom interest */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Eigenes Interesse:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="Eigenes Interesse eingeben..."
          />
          <button
            onClick={addCustomInterest}
            disabled={!customInterest.trim()}
            className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="text-center text-sm text-gray-500">
        {selectedInterests.length} Interesse{selectedInterests.length !== 1 ? 'n' : ''} ausgewählt
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
          disabled={selectedInterests.length === 0}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default InterestsStep;
