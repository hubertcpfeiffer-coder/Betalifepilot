import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play, SkipForward, Settings, X, Mic, MicOff } from 'lucide-react';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import VoiceAssistantSettings from './VoiceAssistantSettings';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI?: () => void;
}

const MIO_AVATAR = 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764950885968_0a766005.png';

const MioVoiceAssistant: React.FC<Props> = ({ isOpen, onClose, onOpenAI }) => {
  const { speak, stop, pause, resume, isSpeaking, isPaused, isSupported, currentItem, queue, clearQueue } = useVoiceAssistant();
  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported: speechSupported } = useSpeechRecognition();
  const [showSettings, setShowSettings] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');

  useEffect(() => {
    if (isOpen && isSupported) {
      speak('Hallo! Ich bin Mio, deine Sprach-Assistentin. Wie kann ich dir helfen?', { type: 'greeting', priority: 'high' });
    }
  }, [isOpen]);

  useEffect(() => {
    if (transcript && !isListening) {
      handleVoiceInput(transcript);
      resetTranscript();
    }
  }, [isListening, transcript]);

  const handleVoiceInput = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes('aufgaben') || lower.includes('tasks')) {
      speak('Ich öffne deine Aufgaben und lese sie dir vor.', { type: 'response' });
    } else if (lower.includes('stopp') || lower.includes('stop')) {
      stop();
    } else if (lower.includes('pause')) {
      pause();
    } else if (lower.includes('weiter')) {
      resume();
    } else {
      speak(`Du hast gesagt: ${input}. Ich leite das an Mio weiter.`, { type: 'response' });
      onOpenAI?.();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={MIO_AVATAR} alt="Mio" className={`w-16 h-16 rounded-full border-2 ${isSpeaking ? 'border-cyan-400 animate-pulse' : 'border-cyan-600'}`} />
                {isSpeaking && <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center"><Volume2 className="w-3 h-3 text-white" /></span>}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Mio Sprach-Assistent</h2>
                <p className="text-cyan-400 text-sm">{isSpeaking ? 'Spricht...' : isPaused ? 'Pausiert' : isListening ? 'Höre zu...' : 'Bereit'}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"><Settings className="w-5 h-5" /></button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {/* Speech visualization */}
          <div className="bg-black/30 rounded-2xl p-6 mb-6">
            <div className="flex justify-center gap-1 h-16 items-end">
              {[...Array(12)].map((_, i) => (
                <div key={i} className={`w-2 rounded-full transition-all duration-150 ${isSpeaking ? 'bg-gradient-to-t from-cyan-500 to-blue-400' : 'bg-gray-600'}`}
                  style={{ height: isSpeaking ? `${20 + Math.sin(Date.now() / 100 + i) * 30}px` : '8px', animationDelay: `${i * 50}ms` }} />
              ))}
            </div>
            <p className="text-center text-gray-300 mt-4 min-h-[48px]">{currentItem?.text || (isListening ? `"${transcript}"` : 'Sage etwas oder tippe auf das Mikrofon')}</p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mb-6">
            <button onClick={() => isListening ? stopListening() : startListening()} disabled={!speechSupported}
              className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            {isSpeaking && !isPaused && <button onClick={pause} className="p-4 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"><Pause className="w-6 h-6" /></button>}
            {isPaused && <button onClick={resume} className="p-4 rounded-full bg-cyan-500 text-white hover:bg-cyan-600"><Play className="w-6 h-6" /></button>}
            {(isSpeaking || queue.length > 0) && <button onClick={stop} className="p-4 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"><VolumeX className="w-6 h-6" /></button>}
            {queue.length > 0 && <button onClick={clearQueue} className="p-4 rounded-full bg-white/10 text-gray-300 hover:bg-white/20"><SkipForward className="w-6 h-6" /></button>}
          </div>

          {queue.length > 0 && <p className="text-center text-gray-500 text-sm">{queue.length} weitere Nachrichten in der Warteschlange</p>}
        </div>
      </div>
      {showSettings && <VoiceAssistantSettings onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default MioVoiceAssistant;
