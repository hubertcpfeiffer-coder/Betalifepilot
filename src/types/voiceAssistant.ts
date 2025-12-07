export interface VoiceSettings {
  voiceName: string | null;
  voiceLang: string;
  rate: number;
  pitch: number;
  volume: number;
  autoSpeakReminders: boolean;
  autoSpeakNotifications: boolean;
  autoSpeakResponses: boolean;
}

export interface SpeechQueueItem {
  id: string;
  text: string;
  priority: 'high' | 'normal' | 'low';
  onEnd?: () => void;
  type: 'reminder' | 'task' | 'response' | 'notification' | 'greeting';
}

export interface VoiceAssistantState {
  isSpeaking: boolean;
  isPaused: boolean;
  currentItem: SpeechQueueItem | null;
  queue: SpeechQueueItem[];
  settings: VoiceSettings;
}

export const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  voiceName: null,
  voiceLang: 'de-DE',
  rate: 0.95,
  pitch: 1.1,
  volume: 1.0,
  autoSpeakReminders: true,
  autoSpeakNotifications: false,
  autoSpeakResponses: true,
};

export interface MioResponse {
  text: string;
  emotion: 'happy' | 'neutral' | 'thinking' | 'excited' | 'caring';
  action?: string;
}
