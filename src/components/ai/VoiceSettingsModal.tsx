import React, { useMemo } from 'react';
import { X, Volume2, Play, Languages, User, Gauge, Music } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelectVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  onRateChange: (rate: number) => void;
  pitch: number;
  onPitchChange: (pitch: number) => void;
  onTestVoice: (text: string) => void;
}

const VoiceSettingsModal: React.FC<Props> = ({
  isOpen, onClose, voices, selectedVoice, onSelectVoice,
  rate, onRateChange, pitch, onPitchChange, onTestVoice
}) => {
  const groupedVoices = useMemo(() => {
    const groups: Record<string, SpeechSynthesisVoice[]> = {};
    voices.forEach(voice => {
      const lang = voice.lang.split('-')[0].toUpperCase();
      const langName = new Intl.DisplayNames(['de'], { type: 'language' }).of(voice.lang.split('-')[0]) || lang;
      if (!groups[langName]) groups[langName] = [];
      groups[langName].push(voice);
    });
    return groups;
  }, [voices]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/10 max-h-[85vh] flex flex-col">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg"><Volume2 className="w-5 h-5 text-cyan-400" /></div>
            <h2 className="text-white font-semibold text-lg">Mio Stimme einstellen</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Stimme auswählen</span>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
              {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                <div key={lang}>
                  <p className="text-xs text-gray-500 uppercase mb-1">{lang}</p>
                  <div className="space-y-1">
                    {langVoices.map((voice, i) => (
                      <button key={i} onClick={() => onSelectVoice(voice)}
                        className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 transition-colors ${
                          selectedVoice?.name === voice.name ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                        }`}>
                        <User className="w-4 h-4" />
                        <span className="truncate flex-1">{voice.name}</span>
                        {voice.localService && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Lokal</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Geschwindigkeit: {rate.toFixed(1)}x</span>
            </div>
            <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => onRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Langsam</span><span>Normal</span><span>Schnell</span></div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Music className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-medium">Tonhöhe: {pitch.toFixed(1)}</span>
            </div>
            <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => onPitchChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500" />
            <div className="flex justify-between text-xs text-gray-500 mt-1"><span>Tief</span><span>Normal</span><span>Hoch</span></div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => onTestVoice('Hallo! Ich bin Mio, deine persönliche KI-Assistentin. So klinge ich mit den aktuellen Einstellungen.')}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            <Play className="w-5 h-5" /> Stimme testen
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceSettingsModal;
