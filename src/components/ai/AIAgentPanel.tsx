import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Send, Settings, Loader2, Volume2, VolumeX, UserPlus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import VoiceSettingsModal from './VoiceSettingsModal';
import RoundTableView from './RoundTableView';
import { ConversationMessage } from '@/types/aiAgent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth?: () => void;
  userAvatar?: string;
  initialRoundTable?: boolean;
}

const MIO_AVATAR = 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764950885968_0a766005.png';

const AIAgentPanel: React.FC<Props> = ({ isOpen, onClose, onOpenAuth, initialRoundTable = false }) => {
  const { user, isAuthenticated } = useAuth();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [knowledge, setKnowledge] = useState<any>(null);
  const [iqProfile, setIqProfile] = useState<any>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [roundTableMode, setRoundTableMode] = useState(initialRoundTable);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isListening, transcript, startListening, stopListening, resetTranscript, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, stop, isSpeaking, isSupported: ttsSupported, voices, selectedVoice, setSelectedVoice, rate, setRate, pitch, setPitch } = useTextToSpeech();

  useEffect(() => { if (initialRoundTable) setRoundTableMode(true); }, [initialRoundTable]);
  useEffect(() => { if (transcript) setMessage(prev => prev + transcript); }, [transcript]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  useEffect(() => {
    if (isOpen && isAuthenticated && user) loadKnowledge();
    else if (isOpen && !isAuthenticated) {
      setMessages([{ id: '1', role: 'assistant', content: 'Hallo! Ich bin Mio. Erstelle ein Konto, damit ich dir optimal helfen kann!', timestamp: new Date() }]);
    }
  }, [isOpen, user, isAuthenticated]);

  const loadKnowledge = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_knowledge_profiles').select('*').eq('user_id', user.id).single();
    const { data: iqData } = await supabase.from('user_iq_profiles').select('*').eq('user_id', user.id).single();
    if (iqData) setIqProfile(iqData);
    if (data) setKnowledge(data);
    const name = data?.nickname || user.full_name?.split(' ')[0] || '';
    setMessages([{ id: '1', role: 'assistant', content: `Hallo ${name}! Ich bin Mio. Aktiviere den "Runden Tisch" für Perspektiven aus 5 Lebensbereichen!`, timestamp: new Date() }]);
  };


  const handleSend = async () => {
    if (!message.trim() || isLoading) return;
    const userMsg = message;
    const newUserMsg: ConversationMessage = { id: Date.now().toString(), role: 'user', content: userMsg, timestamp: new Date() };
    setMessages(prev => [...prev, newUserMsg]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('round-table-ai', {
        body: { message: userMsg, mode: roundTableMode ? 'round_table' : 'chat', userKnowledge: knowledge, iqProfile, conversationHistory: messages.slice(-10) }
      });
      if (error) throw error;

      if (data.mode === 'round_table') {
        const rtMsg: ConversationMessage = { id: Date.now().toString(), role: 'round_table', content: data.summary, timestamp: new Date(), advisorResponses: data.advisorResponses, summary: data.summary };
        setMessages(prev => [...prev, rtMsg]);
        if (autoSpeak && ttsSupported) speak(data.summary);
      } else {
        const assistantMsg: ConversationMessage = { id: Date.now().toString(), role: 'assistant', content: data.response, timestamp: new Date() };
        setMessages(prev => [...prev, assistantMsg]);
        if (autoSpeak && ttsSupported) speak(data.response);
      }
    } catch {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Entschuldigung, es gab einen Fehler.', timestamp: new Date() }]);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className="relative ml-auto w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-800 h-full flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={MIO_AVATAR} alt="Mio" className="w-12 h-12 rounded-full border-2 border-cyan-500" />
              <div>
                <h2 className="text-white font-semibold">Mio-Lifepilot</h2>
                <p className="text-xs text-cyan-400">{isListening ? 'Höre zu...' : isSpeaking ? 'Spricht...' : 'Aktiv'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setRoundTableMode(!roundTableMode)} className={`p-2 rounded-lg transition-colors ${roundTableMode ? 'bg-purple-500/30 text-purple-400' : 'text-gray-400 hover:text-white'}`} title="Runder Tisch">
                <Users className="w-5 h-5" />
              </button>
              <button onClick={() => setAutoSpeak(!autoSpeak)} className={`p-2 rounded-lg ${autoSpeak ? 'text-cyan-400' : 'text-gray-500'}`}>
                {autoSpeak ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <button onClick={() => setShowVoiceSettings(true)} className="p-2 text-gray-400 hover:text-white"><Settings className="w-5 h-5" /></button>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
          </div>

          {roundTableMode && (
            <div className="px-4 py-2 bg-purple-500/20 border-b border-purple-500/30 text-center">
              <span className="text-purple-300 text-sm">Runder Tisch aktiv - 5 Perspektiven</span>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role !== 'user' && <img src={MIO_AVATAR} alt="Mio" className="w-8 h-8 rounded-full" />}
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-cyan-600 text-white p-3 rounded-2xl' : ''}`}>
                  {msg.role === 'round_table' && msg.advisorResponses ? (
                    <RoundTableView advisorResponses={msg.advisorResponses} summary={msg.summary || ''} onSpeak={speak} isSpeaking={isSpeaking} onStopSpeaking={stop} />
                  ) : msg.role !== 'user' ? (
                    <div className="bg-white/10 text-gray-200 p-3 rounded-2xl">{msg.content}</div>
                  ) : msg.content}
                </div>
              </div>
            ))}
            {isLoading && <div className="flex gap-3"><img src={MIO_AVATAR} alt="Mio" className="w-8 h-8 rounded-full" /><div className="bg-white/10 p-3 rounded-2xl flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin text-cyan-400" /><span className="text-gray-400 text-sm">{roundTableMode ? 'Berater diskutieren...' : 'Mio denkt...'}</span></div></div>}
            <div ref={messagesEndRef} />
          </div>

          {!isAuthenticated ? (
            <div className="p-4 bg-cyan-600/20 border-t border-cyan-500/30">
              <button onClick={() => { onClose(); onOpenAuth?.(); }} className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5" />Kostenlos registrieren
              </button>
            </div>
          ) : (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button onClick={() => isListening ? (stopListening(), resetTranscript()) : startListening()} disabled={!speechSupported} className={`p-3 rounded-xl ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-gray-400 hover:text-white'}`}>
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={roundTableMode ? 'Frage an den Runden Tisch...' : 'Frag Mio...'} className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500" />
                <button onClick={handleSend} disabled={isLoading || !message.trim()} className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl disabled:opacity-50"><Send className="w-5 h-5" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      <VoiceSettingsModal isOpen={showVoiceSettings} onClose={() => setShowVoiceSettings(false)} voices={voices} selectedVoice={selectedVoice} onSelectVoice={setSelectedVoice} rate={rate} onRateChange={setRate} pitch={pitch} onPitchChange={setPitch} onTestVoice={speak} />
    </>
  );
};

export default AIAgentPanel;
