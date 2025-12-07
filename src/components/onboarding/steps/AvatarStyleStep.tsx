import React, { useState } from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';

interface Props {
  onComplete: (style: string) => void;
  onSkip: () => void;
}

const avatarStyles = [
  { id: 'realistic', name: 'Realistisch', desc: 'Fotorealistischer Look', gradient: 'from-blue-500 to-cyan-500', preview: '👤' },
  { id: 'cartoon', name: 'Cartoon', desc: 'Freundlicher Cartoon-Stil', gradient: 'from-yellow-500 to-orange-500', preview: '🎨' },
  { id: 'anime', name: 'Anime', desc: 'Japanischer Anime-Stil', gradient: 'from-pink-500 to-purple-500', preview: '✨' },
  { id: '3d', name: '3D Pixar', desc: 'Pixar-ähnlicher 3D-Stil', gradient: 'from-green-500 to-teal-500', preview: '🎬' },
  { id: 'minimalist', name: 'Minimalistisch', desc: 'Einfacher, cleaner Look', gradient: 'from-gray-500 to-slate-600', preview: '◯' },
  { id: 'artistic', name: 'Künstlerisch', desc: 'Gemalter Kunststil', gradient: 'from-rose-500 to-red-500', preview: '🖼️' },
];

const AvatarStyleStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleComplete = () => {
    if (selectedStyle) {
      onComplete(selectedStyle);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Wähle deinen Avatar-Stil</h3>
        <p className="text-gray-500 text-sm">Wie soll dein KI-Avatar aussehen?</p>
      </div>

      {/* Style grid */}
      <div className="grid grid-cols-2 gap-3">
        {avatarStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`relative p-4 rounded-xl border-2 transition-all text-left group ${
              selectedStyle === style.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            {selectedStyle === style.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`w-12 h-12 bg-gradient-to-br ${style.gradient} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-2xl`}>
              {style.preview}
            </div>
            <h4 className="font-semibold text-gray-900">{style.name}</h4>
            <p className="text-xs text-gray-500">{style.desc}</p>
          </button>
        ))}
      </div>

      {/* Preview hint */}
      {selectedStyle && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {avatarStyles.find(s => s.id === selectedStyle)?.name} ausgewählt
            </p>
            <p className="text-sm text-gray-500">Dein Avatar wird in diesem Stil erstellt</p>
          </div>
        </div>
      )}

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
          disabled={!selectedStyle}
          className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default AvatarStyleStep;
