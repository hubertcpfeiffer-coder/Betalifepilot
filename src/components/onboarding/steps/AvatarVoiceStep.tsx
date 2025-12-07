import React, { useState } from 'react';
import { Mic, Check, Play, Pause, Volume2 } from 'lucide-react';

interface Props {
  onComplete: (voice: string) => void;
  onSkip: () => void;
}

const voiceOptions = [
  { id: 'friendly_male', name: 'Freundlich (männlich)', desc: 'Warme, einladende Stimme', pitch: 'mittel', speed: 'normal' },
  { id: 'friendly_female', name: 'Freundlich (weiblich)', desc: 'Warme, einladende Stimme', pitch: 'mittel', speed: 'normal' },
  { id: 'professional_male', name: 'Professionell (männlich)', desc: 'Klar und sachlich', pitch: 'tief', speed: 'normal' },
  { id: 'professional_female', name: 'Professionell (weiblich)', desc: 'Klar und sachlich', pitch: 'mittel', speed: 'normal' },
  { id: 'energetic', name: 'Energetisch', desc: 'Motivierend und dynamisch', pitch: 'hoch', speed: 'schnell' },
  { id: 'calm', name: 'Ruhig', desc: 'Entspannend und beruhigend', pitch: 'tief', speed: 'langsam' },
];

const AvatarVoiceStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  const handlePlaySample = (voiceId: string) => {
    if (playingVoice === voiceId) {
      setPlayingVoice(null);
      // Stop audio
      window.speechSynthesis.cancel();
    } else {
      setPlayingVoice(voiceId);
      // Play sample using Web Speech API
      const utterance = new SpeechSynthesisUtterance('Hallo! Ich bin Mio, dein persönlicher KI-Assistent.');
      utterance.lang = 'de-DE';
      utterance.onend = () => setPlayingVoice(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleComplete = () => {
    if (selectedVoice) {
      window.speechSynthesis.cancel();
      onComplete(selectedVoice);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Wähle eine Stimme</h3>
        <p className="text-gray-500 text-sm">Wie soll dein Avatar klingen?</p>
      </div>

      {/* Voice options */}
      <div className="space-y-3">
        {voiceOptions.map((voice) => (
          <button
            key={voice.id}
            onClick={() => setSelectedVoice(voice.id)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4 ${
              selectedVoice === voice.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              selectedVoice === voice.id ? 'bg-emerald-500' : 'bg-gray-100'
            }`}>
              <Volume2 className={`w-6 h-6 ${selectedVoice === voice.id ? 'text-white' : 'text-gray-400'}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900">{voice.name}</h4>
              <p className="text-xs text-gray-500">{voice.desc}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  Tonhöhe: {voice.pitch}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-600">
                  Tempo: {voice.speed}
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlaySample(voice.id);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                playingVoice === voice.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600'
              }`}
            >
              {playingVoice === voice.id ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            {selectedVoice === voice.id && (
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </button>
        ))}
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
          disabled={!selectedVoice}
          className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default AvatarVoiceStep;
