import { useState, useCallback, useEffect, useRef } from 'react';

interface TextToSpeechHook {
  speak: (text: string, onEnd?: () => void) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  setSelectedVoice: (voice: SpeechSynthesisVoice) => void;
  rate: number;
  setRate: (rate: number) => void;
  pitch: number;
  setPitch: (pitch: number) => void;
}

export const useTextToSpeech = (): TextToSpeechHook => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRate] = useState(0.95); // Slightly slower for friendlier tone
  const [pitch, setPitch] = useState(1.1); // Slightly higher for friendlier tone
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndCallbackRef = useRef<(() => void) | null>(null);

  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Prefer German female voice for Mio - friendlier sounding
      const germanFemale = availableVoices.find(
        v => v.lang.startsWith('de') && (
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('anna') || 
          v.name.toLowerCase().includes('petra') ||
          v.name.toLowerCase().includes('marlene') ||
          v.name.toLowerCase().includes('vicki')
        )
      );
      const germanVoice = availableVoices.find(v => v.lang.startsWith('de'));
      const defaultVoice = germanFemale || germanVoice || availableVoices[0];
      
      if (defaultVoice && !selectedVoice) {
        setSelectedVoice(defaultVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel();
    onEndCallbackRef.current = onEnd || null;

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = selectedVoice?.lang || 'de-DE';
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEndCallbackRef.current) {
        onEndCallbackRef.current();
        onEndCallbackRef.current = null;
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onEndCallbackRef.current) {
        onEndCallbackRef.current();
        onEndCallbackRef.current = null;
      }
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, selectedVoice, rate, pitch]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    onEndCallbackRef.current = null;
  }, [isSupported]);

  return {
    speak, stop, isSpeaking, isSupported, voices,
    selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch
  };
};
