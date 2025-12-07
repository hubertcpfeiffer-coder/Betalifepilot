import { useState, useCallback, useEffect, useRef } from 'react';
import { VoiceSettings, SpeechQueueItem, DEFAULT_VOICE_SETTINGS } from '@/types/voiceAssistant';

const STORAGE_KEY = 'mio_voice_settings';

export const useVoiceAssistant = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [queue, setQueue] = useState<SpeechQueueItem[]>([]);
  const [currentItem, setCurrentItem] = useState<SpeechQueueItem | null>(null);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch {}
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Load voices
  useEffect(() => {
    if (!isSupported) return;
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      const savedName = settings.voiceName;
      const voice = savedName ? available.find(v => v.name === savedName) : 
        available.find(v => v.lang.startsWith('de') && v.name.toLowerCase().includes('female')) ||
        available.find(v => v.lang.startsWith('de')) || available[0];
      if (voice) setSelectedVoice(voice);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.cancel(); };
  }, [isSupported, settings.voiceName]);

  const processQueue = useCallback(() => {
    if (queue.length === 0 || isSpeaking) return;
    const [next, ...rest] = queue;
    setQueue(rest);
    speakItem(next);
  }, [queue, isSpeaking]);

  useEffect(() => { processQueue(); }, [queue, isSpeaking, processQueue]);

  const speakItem = (item: SpeechQueueItem) => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.text);
    utteranceRef.current = utterance;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = settings.voiceLang;
    utterance.rate = settings.rate;
    utterance.pitch = settings.pitch;
    utterance.volume = settings.volume;
    utterance.onstart = () => { setIsSpeaking(true); setCurrentItem(item); };
    utterance.onend = () => { setIsSpeaking(false); setCurrentItem(null); item.onEnd?.(); };
    utterance.onerror = () => { setIsSpeaking(false); setCurrentItem(null); };
    window.speechSynthesis.speak(utterance);
  };

  const speak = useCallback((text: string, options?: Partial<SpeechQueueItem>) => {
    const item: SpeechQueueItem = { id: Date.now().toString(), text, priority: 'normal', type: 'response', ...options };
    if (item.priority === 'high') { setQueue(prev => [item, ...prev]); }
    else { setQueue(prev => [...prev, item]); }
  }, []);

  const stop = useCallback(() => { window.speechSynthesis.cancel(); setIsSpeaking(false); setCurrentItem(null); setQueue([]); }, []);
  const pause = useCallback(() => { window.speechSynthesis.pause(); setIsPaused(true); }, []);
  const resume = useCallback(() => { window.speechSynthesis.resume(); setIsPaused(false); }, []);
  const clearQueue = useCallback(() => setQueue([]), []);

  return { speak, stop, pause, resume, clearQueue, isSpeaking, isPaused, isSupported, voices, selectedVoice, setSelectedVoice: (v: SpeechSynthesisVoice) => { setSelectedVoice(v); updateSettings({ voiceName: v.name }); }, settings, updateSettings, queue, currentItem };
};
