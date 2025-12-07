import React from 'react';
import { X, Mic, MessageSquare } from 'lucide-react';
import { VOICE_COMMANDS } from '@/types/voiceCommands';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceHelpModal: React.FC<VoiceHelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-cyan-500 to-blue-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Sprachbefehle</h2>
                <p className="text-cyan-100 text-sm">Steuere Mio mit deiner Stimme</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Commands list */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <p className="text-gray-600 mb-4 text-sm">
            Klicke auf das Mikrofon-Symbol und sage einen der folgenden Befehle:
          </p>
          
          <div className="space-y-3">
            {VOICE_COMMANDS.map((command, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-xl hover:bg-cyan-50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">{command.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {command.patterns.slice(0, 3).map((pattern, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-white rounded-lg text-xs text-cyan-600 border border-cyan-200"
                        >
                          "{pattern}"
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Tipp: Sprich deutlich und warte auf das Feedback
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceHelpModal;
