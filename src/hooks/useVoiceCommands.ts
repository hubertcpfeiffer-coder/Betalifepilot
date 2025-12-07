import { useState, useEffect, useCallback, useRef } from 'react';
import { useSpeechRecognition } from './useSpeechRecognition';
import { VOICE_COMMANDS, VoiceCommand, VoiceCommandAction, VoiceCommandResult } from '@/types/voiceCommands';

interface UseVoiceCommandsOptions {
  onCommand?: (result: VoiceCommandResult) => void;
  autoStop?: boolean;
  commandTimeout?: number;
}

interface UseVoiceCommandsReturn {
  isListening: boolean;
  isProcessing: boolean;
  lastCommand: VoiceCommandResult | null;
  transcript: string;
  isSupported: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  availableCommands: VoiceCommand[];
}

export const useVoiceCommands = (options: UseVoiceCommandsOptions = {}): UseVoiceCommandsReturn => {
  const { onCommand, autoStop = true, commandTimeout = 5000 } = options;
  const { isListening, transcript, isSupported, startListening: startSpeech, stopListening: stopSpeech, resetTranscript, error } = useSpeechRecognition();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastCommand, setLastCommand] = useState<VoiceCommandResult | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const processedRef = useRef<string>('');

  const findCommand = useCallback((text: string): VoiceCommandResult => {
    const normalized = text.toLowerCase().trim();
    let bestMatch: VoiceCommand | null = null;
    let bestConfidence = 0;

    for (const command of VOICE_COMMANDS) {
      for (const pattern of command.patterns) {
        if (normalized.includes(pattern)) {
          const confidence = pattern.length / normalized.length;
          if (confidence > bestConfidence) {
            bestConfidence = confidence;
            bestMatch = command;
          }
        }
      }
    }

    return {
      action: bestMatch?.action || 'unknown',
      command: bestMatch,
      confidence: bestConfidence,
      transcript: text
    };
  }, []);

  useEffect(() => {
    if (!transcript || transcript === processedRef.current) return;
    
    const result = findCommand(transcript);
    if (result.action !== 'unknown' && result.confidence > 0.1) {
      processedRef.current = transcript;
      setIsProcessing(true);
      setLastCommand(result);
      onCommand?.(result);
      
      if (autoStop) {
        stopSpeech();
        resetTranscript();
      }
      
      setTimeout(() => setIsProcessing(false), 1500);
    }
  }, [transcript, findCommand, onCommand, autoStop, stopSpeech, resetTranscript]);

  useEffect(() => {
    if (isListening) {
      timeoutRef.current = setTimeout(() => {
        stopSpeech();
        resetTranscript();
      }, commandTimeout);
    }
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [isListening, commandTimeout, stopSpeech, resetTranscript]);

  const startListening = useCallback(() => {
    processedRef.current = '';
    setLastCommand(null);
    startSpeech();
  }, [startSpeech]);

  return {
    isListening, isProcessing, lastCommand, transcript, isSupported, error,
    startListening, stopListening: stopSpeech, availableCommands: VOICE_COMMANDS
  };
};
