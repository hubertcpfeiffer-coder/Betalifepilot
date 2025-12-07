import React, { useMemo } from 'react';
import { X, Volume2, Play, User } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';

interface Props {
  onClose: () => void;
}

const VoiceAssistantSettings: React.FC<Props> = ({ onClose }) => {
  const { voices, selectedVoice, setSelectedVoice, settings, updateSettings, speak, stop, isSpeaking } = useVoiceAssistant();

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

  const testVoice = () => {
    if (isSpeaking) { stop(); return; }
    speak('Hallo! Ich bin Mio, deine persönliche KI-Assistentin. So klinge ich mit den aktuellen Einstellungen.', { type: 'response', priority: 'high' });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2"><Volume2 className="w-5 h-5 text-cyan-400" />Stimm-Einstellungen</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Voice Selection */}
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Stimme auswählen</label>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
              {Object.entries(groupedVoices).map(([lang, langVoices]) => (
                <div key={lang}>
                  <p className="text-xs text-gray-500 uppercase mb-1">{lang}</p>
                  {langVoices.slice(0, 3).map((voice, i) => (
                    <button key={i} onClick={() => setSelectedVoice(voice)}
                      className={`w-full p-2 rounded-lg text-left text-sm flex items-center gap-2 mb-1 ${selectedVoice?.name === voice.name ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>
                      <User className="w-4 h-4" /><span className="truncate flex-1">{voice.name}</span>
                      {voice.localService && <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Lokal</span>}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Rate */}
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Geschwindigkeit</span><span className="text-cyan-400">{settings.rate.toFixed(2)}x</span></div>
            <input type="range" min="0.5" max="2" step="0.05" value={settings.rate} onChange={(e) => updateSettings({ rate: parseFloat(e.target.value) })} className="w-full accent-cyan-500" />
          </div>

          {/* Pitch */}
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Tonhöhe</span><span className="text-cyan-400">{settings.pitch.toFixed(2)}</span></div>
            <input type="range" min="0.5" max="2" step="0.05" value={settings.pitch} onChange={(e) => updateSettings({ pitch: parseFloat(e.target.value) })} className="w-full accent-cyan-500" />
          </div>

          {/* Volume */}
          <div>
            <div className="flex justify-between text-sm mb-2"><span className="text-gray-400">Lautstärke</span><span className="text-cyan-400">{Math.round(settings.volume * 100)}%</span></div>
            <input type="range" min="0" max="1" step="0.05" value={settings.volume} onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })} className="w-full accent-cyan-500" />
          </div>

          {/* Auto-speak toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300 text-sm">Erinnerungen vorlesen</span>
              <input type="checkbox" checked={settings.autoSpeakReminders} onChange={(e) => updateSettings({ autoSpeakReminders: e.target.checked })} className="w-5 h-5 accent-cyan-500" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-300 text-sm">Antworten vorlesen</span>
              <input type="checkbox" checked={settings.autoSpeakResponses} onChange={(e) => updateSettings({ autoSpeakResponses: e.target.checked })} className="w-5 h-5 accent-cyan-500" />
            </label>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button onClick={testVoice} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90">
            <Play className="w-5 h-5" />{isSpeaking ? 'Stoppen' : 'Stimme testen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantSettings;
