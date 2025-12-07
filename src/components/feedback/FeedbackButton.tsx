import React, { useState } from 'react';
import { MessageSquarePlus, Bug, Lightbulb, MessageSquare, HelpCircle, X } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

interface FeedbackButtonProps {
  variant?: 'floating' | 'inline' | 'header';
  className?: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({ variant = 'floating', className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors ${className}`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span className="hidden sm:inline">Feedback</span>
        </button>
        <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === 'inline') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg ${className}`}
        >
          <MessageSquarePlus className="w-5 h-5" />
          Feedback geben
        </button>
        <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Floating variant (default)
  return (
    <>
      {/* Floating Button */}
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        {/* Expanded Quick Actions */}
        {isExpanded && (
          <div className="absolute bottom-16 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 space-y-1">
              <button
                onClick={() => { setIsModalOpen(true); setIsExpanded(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-red-50 rounded-lg transition-colors group"
              >
                <div className="p-1.5 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors">
                  <Bug className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Bug melden</div>
                  <div className="text-xs text-gray-500">Etwas funktioniert nicht</div>
                </div>
              </button>
              
              <button
                onClick={() => { setIsModalOpen(true); setIsExpanded(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-amber-50 rounded-lg transition-colors group"
              >
                <div className="p-1.5 bg-amber-100 rounded-lg group-hover:bg-amber-200 transition-colors">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Feature-Wunsch</div>
                  <div className="text-xs text-gray-500">Neue Idee vorschlagen</div>
                </div>
              </button>
              
              <button
                onClick={() => { setIsModalOpen(true); setIsExpanded(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-blue-50 rounded-lg transition-colors group"
              >
                <div className="p-1.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Feedback</div>
                  <div className="text-xs text-gray-500">Allgemeine Rückmeldung</div>
                </div>
              </button>
              
              <button
                onClick={() => { setIsModalOpen(true); setIsExpanded(false); }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-purple-50 rounded-lg transition-colors group"
              >
                <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <HelpCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Frage stellen</div>
                  <div className="text-xs text-gray-500">Hilfe benötigt</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded 
              ? 'bg-gray-700 hover:bg-gray-800 rotate-45' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 hover:scale-110'
          }`}
        >
          {isExpanded ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageSquarePlus className="w-6 h-6 text-white" />
          )}
          
          {/* Pulse Animation */}
          {!isExpanded && (
            <span className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-25" />
          )}
        </button>

        {/* Tooltip */}
        {!isExpanded && (
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 hover:opacity-100 pointer-events-none whitespace-nowrap">
            Beta Feedback
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        )}
      </div>

      <FeedbackModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default FeedbackButton;
