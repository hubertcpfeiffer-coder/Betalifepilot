import React, { useEffect } from 'react';
import { Mic, MicOff, HelpCircle, Volume2 } from 'lucide-react';

interface FloatingVoiceButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onToggle: () => void;
  onShowHelp: () => void;
  onOpenVoiceAssistant?: () => void;
}

const FloatingVoiceButton: React.FC<FloatingVoiceButtonProps> = ({
  isListening,
  isProcessing,
  isSupported,
  onToggle,
  onShowHelp,
  onOpenVoiceAssistant
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        onToggle();
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'v') {
        e.preventDefault();
        onOpenVoiceAssistant?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle, onOpenVoiceAssistant]);

  if (!isSupported) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <button onClick={onShowHelp} className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 text-gray-500 hover:text-cyan-600" title="Sprachbefehle anzeigen">
        <HelpCircle className="w-5 h-5" />
      </button>

      {onOpenVoiceAssistant && (
        <button onClick={onOpenVoiceAssistant} className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105" title="Mio Sprach-Assistent (Ctrl+Shift+V)">
          <Volume2 className="w-5 h-5" />
        </button>
      )}

      <button onClick={onToggle}
        className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${isListening ? 'bg-red-500 text-white shadow-red-500/50 scale-110' : isProcessing ? 'bg-green-500 text-white shadow-green-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-105'}`}
        title={isListening ? 'Sprachbefehl beenden (Ctrl+Shift+M)' : 'Sprachbefehl starten (Ctrl+Shift+M)'}>
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-50" />
            <span className="absolute inset-[-4px] rounded-full border-2 border-red-300 animate-pulse" />
          </>
        )}
        <span className="relative z-10">{isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}</span>
      </button>

      <div className="text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg shadow">Ctrl+Shift+M</div>
    </div>
  );
};

export default FloatingVoiceButton;
