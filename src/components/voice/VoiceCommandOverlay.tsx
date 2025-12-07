import React, { useEffect } from 'react';
import { Mic, CheckCircle } from 'lucide-react';
import { VoiceCommandResult } from '@/types/voiceCommands';

interface VoiceCommandOverlayProps {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  lastCommand: VoiceCommandResult | null;
  onClose: () => void;
}

const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({
  isListening,
  isProcessing,
  transcript,
  lastCommand,
  onClose
}) => {
  // Play feedback sound when command is recognized
  useEffect(() => {
    if (isProcessing && lastCommand?.command) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } catch (e) { /* Audio not supported */ }
    }
  }, [isProcessing, lastCommand]);

  if (!isListening && !isProcessing) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 min-w-[320px] max-w-md">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <div className="flex justify-center mb-6">
            <div className={`relative p-6 rounded-full ${isProcessing ? 'bg-green-500' : 'bg-gradient-to-r from-cyan-500 to-blue-500'}`}>
              {isListening && !isProcessing && (
                <>
                  <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-50" />
                  <span className="absolute inset-[-8px] rounded-full border-4 border-cyan-300 animate-pulse" />
                  <span className="absolute inset-[-16px] rounded-full border-2 border-cyan-200 animate-pulse" style={{ animationDelay: '0.5s' }} />
                </>
              )}
              {isProcessing ? <CheckCircle className="w-10 h-10 text-white relative z-10" /> : <Mic className="w-10 h-10 text-white relative z-10" />}
            </div>
          </div>

          <div className="text-center">
            {isProcessing && lastCommand?.command ? (
              <>
                <p className="text-lg font-semibold text-green-600 mb-2">{lastCommand.command.feedback}</p>
                <p className="text-sm text-gray-500">Erkannt: "{lastCommand.transcript}"</p>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-gray-800 mb-2">Ich höre zu...</p>
                {transcript ? <p className="text-sm text-cyan-600 font-medium">"{transcript}"</p> : <p className="text-sm text-gray-500">Sage einen Befehl wie "Öffne Kontakte"</p>}
              </>
            )}
          </div>

          {isListening && !isProcessing && (
            <div className="flex justify-center gap-1 mt-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ height: `${20 + Math.random() * 20}px`, animationDelay: `${i * 0.1}s`, animationDuration: '0.5s' }} />
              ))}
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Sage "Hilfe" für alle Befehle</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceCommandOverlay;
