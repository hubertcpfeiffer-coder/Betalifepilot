import React, { useState, useEffect } from 'react';
import { Bell, Shield, Scan, Save, Loader2, Bot, Brain, Monitor, Volume2, FileText, User, Camera, Palette, Wand2, Sparkles, RefreshCw, Mic, Play, Pause, Trash2 } from 'lucide-react';
import AvatarSelector from '@/components/avatar/AvatarSelector';
import DeviceList from '@/components/settings/DeviceList';
import GDPRSettings from '@/components/settings/GDPRSettings';
import VoiceAssistantSettings from '@/components/voice/VoiceAssistantSettings';
import AvatarGenerator from '@/components/avatar/AvatarGenerator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { hasFaceRegistered } from '@/services/faceRecognitionService';
import { getUserAvatar, getVoiceSample, deleteVoiceSample } from '@/services/avatarService';
import { UserAvatar } from '@/types/avatar';

interface Props { 
  onClose: () => void; 
  onOpenKnowledge?: () => void; 
  onOpenFaceSetup?: () => void;
  onOpenAvatarSetup?: () => void;
}

const SettingsPanel: React.FC<Props> = ({ onClose, onOpenKnowledge, onOpenFaceSetup, onOpenAvatarSetup }) => {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState({ notifications: true, emailNotifications: true, profileVisibility: 'public', theme: 'light', language: 'de', faceRecognition: false, aiAutonomy: 'medium' });
  const [profile, setProfile] = useState({ displayName: '', bio: '', avatar: '' });
  const [knowledgeScore, setKnowledgeScore] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [userAvatar, setUserAvatar] = useState<UserAvatar | null>(null);
  const [showAvatarGenerator, setShowAvatarGenerator] = useState(false);
  const [voiceSampleUrl, setVoiceSampleUrl] = useState<string | null>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceAudioRef, setVoiceAudioRef] = useState<HTMLAudioElement | null>(null);

  useEffect(() => { 
    if (user) { 
      setProfile({ displayName: user.full_name || '', bio: user.bio || '', avatar: user.avatar_url || '' }); 
      loadSettings(); 
      loadKnowledgeScore(); 
      checkFaceRegistration();
      loadUserAvatar();
      loadVoiceSample();
    } 
  }, [user]);

  useEffect(() => {
    return () => {
      if (voiceAudioRef) {
        voiceAudioRef.pause();
      }
    };
  }, [voiceAudioRef]);

  const loadUserAvatar = async () => {
    if (!user) return;
    const avatar = await getUserAvatar(user.id);
    if (avatar) setUserAvatar(avatar);
  };

  const loadVoiceSample = async () => {
    if (!user) return;
    const url = await getVoiceSample(user.id);
    if (url) setVoiceSampleUrl(url);
  };

  const handlePlayVoiceSample = () => {
    if (!voiceSampleUrl) return;
    
    if (isPlayingVoice && voiceAudioRef) {
      voiceAudioRef.pause();
      voiceAudioRef.currentTime = 0;
      setIsPlayingVoice(false);
    } else {
      const audio = new Audio(voiceSampleUrl);
      audio.onended = () => setIsPlayingVoice(false);
      audio.play();
      setVoiceAudioRef(audio);
      setIsPlayingVoice(true);
    }
  };

  const handleDeleteVoiceSample = async () => {
    if (!user || !confirm('Möchtest du deine Stimmprobe wirklich löschen?')) return;
    
    const result = await deleteVoiceSample(user.id);
    if (result.success) {
      setVoiceSampleUrl(null);
      setMessage('Stimmprobe gelöscht');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const checkFaceRegistration = async () => { if (!user) return; const hasface = await hasFaceRegistered(user.id); if (hasface) setSettings(s => ({ ...s, faceRecognition: true })); };
  const loadSettings = async () => { if (!user) return; const { data } = await supabase.from('user_settings').select('*').eq('user_id', user.id).single(); if (data) setSettings({ notifications: data.notifications_enabled ?? true, emailNotifications: data.email_notifications ?? true, profileVisibility: data.profile_visibility ?? 'public', theme: data.theme ?? 'light', language: data.language ?? 'de', faceRecognition: data.face_recognition_enabled ?? false, aiAutonomy: data.ai_autonomy_level ?? 'medium' }); };
  const loadKnowledgeScore = async () => { if (!user) return; const { data } = await supabase.from('user_knowledge_profiles').select('completeness_score').eq('user_id', user.id).single(); if (data) setKnowledgeScore(data.completeness_score || 0); };
  const handleSave = async () => { if (!user) return; setSaving(true); await updateUser({ full_name: profile.displayName, bio: profile.bio, avatar_url: profile.avatar }); await supabase.from('user_settings').upsert({ user_id: user.id, notifications_enabled: settings.notifications, email_notifications: settings.emailNotifications, profile_visibility: settings.profileVisibility, theme: settings.theme, language: settings.language, face_recognition_enabled: settings.faceRecognition, ai_autonomy_level: settings.aiAutonomy, updated_at: new Date().toISOString() }).catch(() => {}); setMessage('Gespeichert!'); setSaving(false); setTimeout(() => setMessage(''), 3000); };

  const handleAvatarGenerated = (avatarUrl: string) => {
    // Update local state
    if (userAvatar) {
      setUserAvatar({ ...userAvatar, generated_avatar_url: avatarUrl });
    }
  };

  const handleGenerationComplete = () => {
    setShowAvatarGenerator(false);
    loadUserAvatar(); // Reload avatar data
    setMessage('Avatar erfolgreich generiert!');
    setTimeout(() => setMessage(''), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User }, 
    { id: 'avatar', label: 'Mein Avatar', icon: Camera },
    { id: 'knowledge', label: 'Mios Wissen', icon: Brain }, 
    { id: 'mio', label: 'Mio-Einstellungen', icon: Bot }, 
    { id: 'voice', label: 'Sprach-Assistent', icon: Volume2 }, 
    { id: 'notifications', label: 'Benachrichtigungen', icon: Bell }, 
    { id: 'security', label: 'Sicherheit', icon: Scan }, 
    { id: 'devices', label: 'Geräte', icon: Monitor }, 
    { id: 'gdpr', label: 'Datenschutz', icon: FileText }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
      <div className="flex border-b border-gray-200">
        <div className="w-48 bg-gray-50 p-4 space-y-1 overflow-y-auto max-h-[60vh]">
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left ${activeTab === tab.id ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh]">
          {message && <div className="mb-4 p-3 rounded-lg text-sm bg-green-50 text-green-600">{message}</div>}
          
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Profil</h3>
              <AvatarSelector currentAvatar={profile.avatar} onSelect={(url) => setProfile({ ...profile, avatar: url })} />
              <input 
                type="text" 
                value={profile.displayName} 
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} 
                className="w-full px-4 py-3 border rounded-xl" 
                placeholder="Name" 
              />
              <textarea 
                value={profile.bio} 
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })} 
                className="w-full px-4 py-3 border rounded-xl" 
                rows={3} 
                placeholder="Bio" 
              />
            </div>
          )}
          
          {activeTab === 'avatar' && !showAvatarGenerator && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Mein persönlicher Avatar</h3>
              <p className="text-gray-600 text-sm">
                Dein Avatar ist ein digitales Abbild von dir, das in der App erscheint und mit dir interagiert.
              </p>
              
              {/* Generated Avatar Display */}
              {userAvatar?.generated_avatar_url && (
                <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                      <img 
                        src={userAvatar.generated_avatar_url} 
                        alt="Dein KI-Avatar" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-500" />
                        Dein KI-Avatar
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Generiert basierend auf deinen Fotos
                      </p>
                      <button
                        onClick={() => setShowAvatarGenerator(true)}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Neu generieren
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Avatar Status */}
              <div className={`p-6 rounded-2xl ${user?.avatar_setup_completed ? 'bg-gradient-to-br from-green-50 to-emerald-50' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {userAvatar?.front_photo_url ? (
                    <img 
                      src={userAvatar.front_photo_url} 
                      alt="Dein Avatar" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {user?.avatar_setup_completed ? 'Avatar eingerichtet' : 'Avatar nicht eingerichtet'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {user?.avatar_setup_completed 
                        ? 'Dein Avatar ist bereit und kann angepasst werden.'
                        : 'Richte deinen Avatar ein, um ein personalisiertes Erlebnis zu erhalten.'}
                    </p>
                  </div>
                </div>
                
                {userAvatar && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 bg-white/70 rounded-xl">
                      <p className="text-xs text-gray-500">Stil</p>
                      <p className="font-medium text-gray-900 capitalize">{userAvatar.avatar_style}</p>
                    </div>
                    <div className="p-3 bg-white/70 rounded-xl">
                      <p className="text-xs text-gray-500">Stimme</p>
                      <p className="font-medium text-gray-900 capitalize">{userAvatar.voice_style}</p>
                    </div>
                    <div className="p-3 bg-white/70 rounded-xl col-span-2">
                      <p className="text-xs text-gray-500 mb-1">Persönlichkeit</p>
                      <div className="flex flex-wrap gap-1">
                        {userAvatar.personality_traits.map((trait, i) => (
                          <span key={i} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => { onClose(); onOpenAvatarSetup?.(); }}
                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                      user?.avatar_setup_completed 
                        ? 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                    }`}
                  >
                    <Palette className="w-5 h-5" />
                    {user?.avatar_setup_completed ? 'Avatar anpassen' : 'Avatar einrichten'}
                  </button>
                  
                  {userAvatar?.photo_urls && userAvatar.photo_urls.length > 0 && (
                    <button 
                      onClick={() => setShowAvatarGenerator(true)}
                      className="py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 transition-colors"
                    >
                      <Wand2 className="w-5 h-5" />
                      KI-Avatar
                    </button>
                  )}
                </div>
              </div>
              
              {/* Avatar Photos Preview */}
              {userAvatar && userAvatar.photo_urls.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Deine Fotos</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {userAvatar.front_photo_url && (
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <img src={userAvatar.front_photo_url} alt="Frontal" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {userAvatar.left_photo_url && (
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <img src={userAvatar.left_photo_url} alt="Links" className="w-full h-full object-cover" />
                      </div>
                    )}
                    {userAvatar.right_photo_url && (
                      <div className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <img src={userAvatar.right_photo_url} alt="Rechts" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Voice Sample Section */}
              <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center ${voiceSampleUrl ? 'bg-violet-500' : 'bg-gray-300'}`}>
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">
                      {voiceSampleUrl ? 'Stimmprobe gespeichert' : 'Keine Stimmprobe'}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {voiceSampleUrl 
                        ? 'Dein Avatar kann mit deiner Stimme sprechen.'
                        : 'Nimm eine Stimmprobe auf, damit dein Avatar mit deiner Stimme spricht.'}
                    </p>
                  </div>
                </div>
                
                {voiceSampleUrl ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handlePlayVoiceSample}
                      className="flex-1 py-3 bg-violet-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-violet-600 transition-colors"
                    >
                      {isPlayingVoice ? (
                        <>
                          <Pause className="w-5 h-5" />
                          Stoppen
                        </>
                      ) : (
                        <>
                          <Play className="w-5 h-5" />
                          Anhören
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => { onClose(); onOpenAvatarSetup?.(); }}
                      className="py-3 px-4 bg-white text-violet-600 border border-violet-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-violet-50 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5" />
                      Neu
                    </button>
                    <button
                      onClick={handleDeleteVoiceSample}
                      className="py-3 px-4 bg-white text-red-600 border border-red-200 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onClose(); onOpenAvatarSetup?.(); }}
                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:from-violet-600 hover:to-purple-700 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    Stimmprobe aufnehmen
                  </button>
                )}
              </div>
            </div>
          )}

          
          {activeTab === 'avatar' && showAvatarGenerator && user && userAvatar && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold">KI-Avatar generieren</h3>
                <button
                  onClick={() => setShowAvatarGenerator(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Zurück
                </button>
              </div>
              <AvatarGenerator
                userId={user.id}
                photoUrls={userAvatar.photo_urls || []}
                initialStyle={userAvatar.avatar_style}
                onAvatarGenerated={handleAvatarGenerated}
                onComplete={handleGenerationComplete}
              />
            </div>
          )}
          

          
          {activeTab === 'devices' && <DeviceList />}
          {activeTab === 'gdpr' && <GDPRSettings />}
          
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Sicherheit</h3>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Scan className="w-5 h-5" />
                    <span>{settings.faceRecognition ? 'Gesichtserkennung aktiv' : 'Nicht eingerichtet'}</span>
                  </div>
                </div>
                {!settings.faceRecognition && (
                  <button onClick={() => { onClose(); onOpenFaceSetup?.(); }} className="w-full py-2 bg-cyan-600 text-white rounded-lg">
                    Einrichten
                  </button>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Benachrichtigungen</h3>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span>Push</span>
                <input 
                  type="checkbox" 
                  checked={settings.notifications} 
                  onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })} 
                  className="w-5 h-5 accent-cyan-600" 
                />
              </label>
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <span>E-Mail</span>
                <input 
                  type="checkbox" 
                  checked={settings.emailNotifications} 
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })} 
                  className="w-5 h-5 accent-cyan-600" 
                />
              </label>
            </div>
          )}
          
          {activeTab === 'mio' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Mio-Einstellungen</h3>
              <label className="block">
                <span className="text-sm text-gray-600 mb-2 block">AI Autonomie-Level</span>
                <select 
                  value={settings.aiAutonomy} 
                  onChange={(e) => setSettings({ ...settings, aiAutonomy: e.target.value })} 
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  <option value="low">Niedrig - Fragt immer nach</option>
                  <option value="medium">Mittel - Handelt bei Routine</option>
                  <option value="high">Hoch - Handelt selbstständig</option>
                </select>
              </label>
            </div>
          )}
          
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Sprach-Assistent</h3>
              <p className="text-gray-600 text-sm">Konfiguriere Mios Stimme und Spracheinstellungen.</p>
              <button 
                onClick={() => setShowVoiceSettings(true)} 
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl flex items-center justify-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                Stimm-Einstellungen öffnen
              </button>
            </div>
          )}
          
          {activeTab === 'knowledge' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Mios Wissen über dich</h3>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <Brain className="w-8 h-8 text-purple-500" />
                  <div>
                    <span className="text-2xl font-bold text-purple-600">{knowledgeScore}%</span>
                    <p className="text-sm text-purple-500">Profil-Vollständigkeit</p>
                  </div>
                </div>
                <button 
                  onClick={() => { onClose(); onOpenKnowledge?.(); }} 
                  className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                >
                  Wissensprofil bearbeiten
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 border-t flex justify-end gap-3">
        <button onClick={onClose} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">
          Abbrechen
        </button>
        <button onClick={handleSave} disabled={saving} className="px-6 py-2 bg-cyan-600 text-white rounded-xl flex items-center gap-2 hover:bg-cyan-700 transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Speichern
        </button>
      </div>
      {showVoiceSettings && <VoiceAssistantSettings onClose={() => setShowVoiceSettings(false)} />}
    </div>
  );
};

export default SettingsPanel;
