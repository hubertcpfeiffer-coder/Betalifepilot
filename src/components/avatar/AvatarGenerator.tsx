import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Loader2, RefreshCw, Check, ChevronLeft, ChevronRight,
  Shirt, Image, Gem, Wand2, Download, Share2, Save
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { 
  AvatarStyleType, ClothingOption, BackgroundOption, AccessoryOption,
  CLOTHING_STYLES, BACKGROUND_STYLES, ACCESSORY_ITEMS
} from '@/types/avatarGeneration';
import { AVATAR_STYLES } from '@/types/avatar';

interface Props {
  userId: string;
  photoUrls: string[];
  initialStyle?: AvatarStyleType;
  onAvatarGenerated?: (avatarUrl: string) => void;
  onBack?: () => void;
  onComplete?: () => void;
}

type CustomizationTab = 'style' | 'clothing' | 'background' | 'accessories';

const AvatarGenerator: React.FC<Props> = ({
  userId,
  photoUrls,
  initialStyle = 'realistic',
  onAvatarGenerated,
  onBack,
  onComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  // Customization state
  const [activeTab, setActiveTab] = useState<CustomizationTab>('style');
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyleType>(initialStyle);
  const [selectedClothing, setSelectedClothing] = useState<ClothingOption>('casual');
  const [selectedBackground, setSelectedBackground] = useState<BackgroundOption>('studio');
  const [selectedAccessories, setSelectedAccessories] = useState<AccessoryOption[]>([]);
  
  // Generation history
  const [generationHistory, setGenerationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const generateAvatar = async () => {
    if (!userId || photoUrls.length === 0) {
      setError('Keine Fotos vorhanden. Bitte lade zuerst Fotos hoch.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setProgressMessage('Analysiere deine Fotos...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          const increment = Math.random() * 15;
          const newProgress = Math.min(prev + increment, 90);
          
          if (newProgress < 30) {
            setProgressMessage('Analysiere deine Fotos...');
          } else if (newProgress < 60) {
            setProgressMessage('Erstelle deinen Avatar...');
          } else {
            setProgressMessage('Füge Details hinzu...');
          }
          
          return newProgress;
        });
      }, 500);

      const { data, error: invokeError } = await supabase.functions.invoke('generate-avatar', {
        body: {
          userId,
          photoUrls,
          style: selectedStyle,
          clothing: selectedClothing,
          background: selectedBackground,
          accessories: selectedAccessories.length > 0 ? selectedAccessories : undefined
        }
      });

      clearInterval(progressInterval);

      if (invokeError) {
        throw new Error(invokeError.message || 'Avatar-Generierung fehlgeschlagen');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Avatar-Generierung fehlgeschlagen');
      }

      setProgress(100);
      setProgressMessage('Avatar erstellt!');
      
      const avatarUrl = data.avatarUrl;
      setGeneratedAvatarUrl(avatarUrl);
      
      // Add to history
      setGenerationHistory(prev => [...prev, avatarUrl]);
      setHistoryIndex(generationHistory.length);
      
      if (onAvatarGenerated) {
        onAvatarGenerated(avatarUrl);
      }

    } catch (err: any) {
      console.error('Avatar generation error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAccessory = (accessory: AccessoryOption) => {
    setSelectedAccessories(prev => {
      if (prev.includes(accessory)) {
        return prev.filter(a => a !== accessory);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, accessory];
    });
  };

  const regenerateAvatar = () => {
    generateAvatar();
  };

  const saveAvatar = async () => {
    if (!generatedAvatarUrl) return;
    
    try {
      // Save to user's avatar settings
      await supabase
        .from('user_avatars')
        .update({
          generated_avatar_url: generatedAvatarUrl,
          avatar_style: selectedStyle,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      await supabase
        .from('users')
        .update({
          personal_avatar_url: generatedAvatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Error saving avatar:', err);
    }
  };

  const downloadAvatar = () => {
    if (!generatedAvatarUrl) return;
    
    const link = document.createElement('a');
    link.href = generatedAvatarUrl;
    link.download = `mio-avatar-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs: { id: CustomizationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'style', label: 'Stil', icon: <Wand2 className="w-4 h-4" /> },
    { id: 'clothing', label: 'Kleidung', icon: <Shirt className="w-4 h-4" /> },
    { id: 'background', label: 'Hintergrund', icon: <Image className="w-4 h-4" /> },
    { id: 'accessories', label: 'Accessoires', icon: <Gem className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Preview Area */}
      <div className="relative">
        <div className="aspect-square max-w-md mx-auto rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 shadow-xl">
          {isGenerating ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
                <div 
                  className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
                  style={{ animationDuration: '1.5s' }}
                ></div>
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>
              </div>
              
              <div className="w-full max-w-xs">
                <div className="h-2 bg-white/50 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-center text-indigo-700 font-medium">{progressMessage}</p>
                <p className="text-center text-indigo-500 text-sm mt-1">{Math.round(progress)}%</p>
              </div>
            </div>
          ) : generatedAvatarUrl ? (
            <img 
              src={generatedAvatarUrl} 
              alt="Generierter Avatar" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="w-24 h-24 rounded-full bg-white/50 flex items-center justify-center mb-4">
                <Sparkles className="w-12 h-12 text-indigo-400" />
              </div>
              <p className="text-indigo-700 font-medium text-center">
                Passe deinen Avatar an und klicke auf "Avatar generieren"
              </p>
              <p className="text-indigo-500 text-sm text-center mt-2">
                Die KI erstellt einen einzigartigen Avatar basierend auf deinen Fotos
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons on Generated Avatar */}
        {generatedAvatarUrl && !isGenerating && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            <button
              onClick={regenerateAvatar}
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              title="Neu generieren"
            >
              <RefreshCw className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={downloadAvatar}
              className="p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-colors"
              title="Herunterladen"
            >
              <Download className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* Customization Tabs */}
      <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Customization Content */}
      <div className="min-h-[200px]">
        {/* Style Tab */}
        {activeTab === 'style' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {AVATAR_STYLES.map(style => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id as AvatarStyleType)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedStyle === style.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl">{style.preview}</span>
                <p className="font-medium text-gray-900 mt-2">{style.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{style.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Clothing Tab */}
        {activeTab === 'clothing' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CLOTHING_STYLES.map(clothing => (
              <button
                key={clothing.id}
                onClick={() => setSelectedClothing(clothing.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedClothing === clothing.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-2xl">{clothing.icon}</span>
                <p className="font-medium text-gray-900 mt-2">{clothing.name}</p>
                <p className="text-xs text-gray-500">{clothing.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Background Tab */}
        {activeTab === 'background' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BACKGROUND_STYLES.map(bg => (
              <button
                key={bg.id}
                onClick={() => setSelectedBackground(bg.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedBackground === bg.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${bg.color} mb-2`} />
                <p className="font-medium text-gray-900">{bg.name}</p>
                <p className="text-xs text-gray-500">{bg.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Accessories Tab */}
        {activeTab === 'accessories' && (
          <div>
            <p className="text-sm text-gray-500 mb-3">Wähle bis zu 3 Accessoires</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {ACCESSORY_ITEMS.map(accessory => (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    selectedAccessories.includes(accessory.id)
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-2xl">{accessory.icon}</span>
                  <p className="text-xs text-gray-700 mt-1">{accessory.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Zurück
          </button>
        )}
        
        <button
          onClick={generateAvatar}
          disabled={isGenerating}
          className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Avatar wird generiert...
            </>
          ) : generatedAvatarUrl ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Neu generieren
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Avatar generieren
            </>
          )}
        </button>
      </div>

      {/* Save Button (shown after generation) */}
      {generatedAvatarUrl && !isGenerating && (
        <button
          onClick={saveAvatar}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30"
        >
          <Save className="w-5 h-5" />
          Avatar speichern & fortfahren
        </button>
      )}

      {/* Photo Preview */}
      {photoUrls.length > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Deine Fotos als Grundlage:</p>
          <div className="flex gap-2">
            {photoUrls.slice(0, 3).map((url, index) => (
              <div key={index} className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                <img src={url} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarGenerator;
