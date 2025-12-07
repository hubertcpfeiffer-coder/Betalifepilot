import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Volume2, VolumeX, SkipForward, Sparkles } from 'lucide-react';
import { tourSteps, TourStep } from './TourSteps';
import WalkingAvatar from './WalkingAvatar';
import ModulePreview from './ModulePreview';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: TourStep['action']) => void;
}

const GuidedTour: React.FC<Props> = ({ isOpen, onClose, onAction }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isWalking, setIsWalking] = useState(false);
  const [avatarPos, setAvatarPos] = useState({ x: 50, y: 45 });
  const [facingRight, setFacingRight] = useState(true);
  const [showModule, setShowModule] = useState(false);
  const { speak, stop, isSpeaking, isSupported } = useTextToSpeech();
  const advanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initRef = useRef(false);

  const step = tourSteps[currentStep];
  const isLast = currentStep === tourSteps.length - 1;

  const clearTimeouts = () => {
    if (advanceTimeoutRef.current) {
      clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
  };

  const advanceToNext = useCallback(() => {
    clearTimeouts();
    if (isLast) {
      if (step.action) onAction(step.action);
      stop();
      onClose();
      return;
    }
    
    const nextStep = tourSteps[currentStep + 1];
    setShowModule(false);
    setIsWalking(true);
    setFacingRight(nextStep.avatarPosition.x >= avatarPos.x);
    
    setTimeout(() => setAvatarPos(nextStep.avatarPosition), 100);
    setTimeout(() => {
      setIsWalking(false);
      setCurrentStep(s => s + 1);
    }, 1800);
  }, [currentStep, isLast, avatarPos, step.action, onAction, onClose, stop]);

  useEffect(() => {
    if (!isOpen) {
      initRef.current = false;
      clearTimeouts();
      stop();
      return;
    }
    if (initRef.current) return;
    initRef.current = true;
    
    setCurrentStep(0);
    setAvatarPos(tourSteps[0].avatarPosition);
    setShowModule(false);
    setIsWalking(false);
    
    setTimeout(() => {
      setShowModule(true);
      if (audioEnabled && isSupported) {
        speak(tourSteps[0].speechText, () => {
          advanceTimeoutRef.current = setTimeout(advanceToNext, 1500);
        });
      } else {
        advanceTimeoutRef.current = setTimeout(advanceToNext, tourSteps[0].duration || 6000);
      }
    }, 1000);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || currentStep === 0 || isWalking) return;
    
    if (step.action && step.action !== 'openAI') onAction(step.action);
    
    setTimeout(() => setShowModule(true), 400);
    
    if (audioEnabled && isSupported) {
      setTimeout(() => {
        speak(step.speechText, () => {
          advanceTimeoutRef.current = setTimeout(advanceToNext, 1500);
        });
      }, 500);
    } else {
      advanceTimeoutRef.current = setTimeout(advanceToNext, step.duration || 6000);
    }
  }, [currentStep, isWalking]);

  const handleClose = () => { clearTimeouts(); stop(); onClose(); };
  const toggleAudio = () => { if (audioEnabled) stop(); setAudioEnabled(!audioEnabled); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-indigo-900/95 to-slate-900/95 backdrop-blur-lg" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <div className="absolute top-6 left-6 z-[110] flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold">Mio-Lifepilot Tour</h2>
          <p className="text-white/50 text-sm">Schritt {currentStep + 1} von {tourSteps.length}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex gap-3 z-[110]">
        <button onClick={toggleAudio} className={`p-3 rounded-xl transition-all ${audioEnabled ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}>
          {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
        <button onClick={handleClose} className="p-3 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Skip */}
      <button onClick={handleClose} className="absolute bottom-8 right-8 z-[110] px-5 py-2.5 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 hover:text-white flex items-center gap-2 transition-all backdrop-blur-sm">
        <SkipForward className="w-4 h-4" />Tour überspringen
      </button>

      {/* Progress */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] flex gap-2">
        {tourSteps.map((_, i) => (
          <div key={i} className={`h-2.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50' : i < currentStep ? 'w-2.5 bg-cyan-400/60' : 'w-2.5 bg-white/20'}`} />
        ))}
      </div>

      {/* Speech bubble */}
      {(isSpeaking || !audioEnabled) && !isWalking && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[110] max-w-xl animate-fade-in">
          <div className="bg-white rounded-2xl px-8 py-5 shadow-2xl relative">
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45" />
            <p className="text-gray-800 text-lg leading-relaxed relative z-10">{step.speechText}</p>
            {isSpeaking && (
              <div className="flex justify-center gap-1 mt-4">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-2 h-5 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <WalkingAvatar position={avatarPos} isSpeaking={isSpeaking} isWalking={isWalking} facingRight={facingRight} />
      <ModulePreview moduleId={step.id} position={step.modulePosition || 'center'} isVisible={showModule && !isWalking} />
      
      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default GuidedTour;
