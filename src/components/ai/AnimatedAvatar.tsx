import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface Props {
  avatarUrl?: string;
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
  onMicClick: () => void;
}

const AnimatedAvatar: React.FC<Props> = ({ avatarUrl, isListening, isSpeaking, isThinking, onMicClick }) => {
  const defaultAvatar = 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764950885968_0a766005.png';
  

  return (
    <div className="relative flex flex-col items-center">
      {/* Avatar Container */}
      <div className={`relative w-32 h-32 rounded-full overflow-hidden border-4 transition-all duration-300 ${
        isListening ? 'border-green-500 shadow-lg shadow-green-500/30' :
        isSpeaking ? 'border-blue-500 shadow-lg shadow-blue-500/30 animate-pulse' :
        isThinking ? 'border-purple-500 shadow-lg shadow-purple-500/30' :
        'border-indigo-500'
      }`}>
        <img
          src={avatarUrl || defaultAvatar}
          alt="AI Avatar"
          className="w-full h-full object-cover"
        />
        
        {/* Speaking animation overlay */}
        {isSpeaking && (
          <div className="absolute inset-0 flex items-end justify-center pb-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div
                  key={i}
                  className="w-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ height: `${8 + Math.random() * 12}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Thinking overlay */}
        {isThinking && (
          <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Microphone Button */}
      <button
        onClick={onMicClick}
        className={`mt-4 p-4 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-110'
            : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-600'
        }`}
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>
      
      {/* Status Text */}
      <p className="mt-2 text-sm text-gray-500">
        {isListening ? 'Ich höre zu...' :
         isSpeaking ? 'Spreche...' :
         isThinking ? 'Denke nach...' :
         'Tippe auf das Mikrofon'}
      </p>
      
      {/* Speaking indicator */}
      {isSpeaking && (
        <div className="flex items-center gap-2 mt-2 text-blue-500">
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="text-xs">Audio aktiv</span>
        </div>
      )}
    </div>
  );
};

export default AnimatedAvatar;
