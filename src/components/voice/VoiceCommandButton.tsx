import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceCommandButtonProps {
  isListening: boolean;
  isProcessing: boolean;
  isSupported: boolean;
  onClick: () => void;
  className?: string;
}

const VoiceCommandButton: React.FC<VoiceCommandButtonProps> = ({
  isListening,
  isProcessing,
  isSupported,
  onClick,
  className = ''
}) => {
  if (!isSupported) return null;

  return (
    <button
      onClick={onClick}
      className={`relative p-3 rounded-full transition-all duration-300 ${
        isListening
          ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 scale-110'
          : isProcessing
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
          : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30 hover:scale-105'
      } ${className}`}
      title={isListening ? 'Sprachbefehl beenden' : 'Sprachbefehl starten'}
    >
      {/* Pulse animation when listening */}
      {isListening && (
        <>
          <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
          <span className="absolute inset-0 rounded-full bg-red-400 animate-pulse" />
        </>
      )}
      
      {/* Icon */}
      <span className="relative z-10">
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-5 h-5" />
        ) : (
          <Mic className="w-5 h-5" />
        )}
      </span>
    </button>
  );
};

export default VoiceCommandButton;
