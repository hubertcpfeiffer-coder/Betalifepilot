import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, Check, ChevronRight, ChevronLeft, Sparkles, User, 
  Volume2, Loader2, X, RefreshCw, Image, Palette, MessageSquare, Wand2, Mic
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AVATAR_STYLES, VOICE_STYLES, PERSONALITY_TRAITS } from '@/types/avatar';
import AvatarGenerator from '@/components/avatar/AvatarGenerator';
import VoiceRecordingStep from '@/components/onboarding/steps/VoiceRecordingStep';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type SetupStep = 'welcome' | 'photos' | 'generate' | 'voice' | 'style' | 'personality' | 'complete';

interface CapturedPhoto {
  type: 'front' | 'left' | 'right';
  dataUrl: string;
  uploaded: boolean;
  url?: string;
}

const AvatarSetupWizard: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const { user, refreshUser } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [currentStep, setCurrentStep] = useState<SetupStep>('welcome');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [currentPhotoType, setCurrentPhotoType] = useState<'front' | 'left' | 'right'>('front');
  const [capturedPhotos, setCapturedPhotos] = useState<CapturedPhoto[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [generatedAvatarUrl, setGeneratedAvatarUrl] = useState<string | null>(null);
  const [voiceSampleUrl, setVoiceSampleUrl] = useState<string | null>(null);
  
  // Style preferences
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedVoiceStyle, setSelectedVoiceStyle] = useState('natural');
  const [selectedTraits, setSelectedTraits] = useState<string[]>(['Hilfsbereit', 'Freundlich']);
  const [speakingStyle, setSpeakingStyle] = useState('freundlich');

  useEffect(() => {
    if (isOpen && user) {
      // Try to create avatar record, but don't block on failure
      import('@/services/avatarService').then(({ createUserAvatar }) => {
        createUserAvatar(user.id).catch(e => console.log('Avatar init skipped:', e));
      }).catch(() => {});
    }
    return () => stopCamera();
  }, [isOpen, user]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setCameraActive(true);
      setError('');
    } catch (err) {
      setError('Kamera-Zugriff verweigert. Bitte erlaube den Zugriff in deinen Browser-Einstellungen.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(interval);
          capturePhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mirror the image for selfie view
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    const newPhoto: CapturedPhoto = {
      type: currentPhotoType,
      dataUrl,
      uploaded: false
    };

    setCapturedPhotos(prev => {
      const filtered = prev.filter(p => p.type !== currentPhotoType);
      return [...filtered, newPhoto];
    });

    // Move to next photo type or finish
    if (currentPhotoType === 'front') {
      setCurrentPhotoType('left');
    } else if (currentPhotoType === 'left') {
      setCurrentPhotoType('right');
    }
  };

  const retakePhoto = (type: 'front' | 'left' | 'right') => {
    setCapturedPhotos(prev => prev.filter(p => p.type !== type));
    setCurrentPhotoType(type);
  };

  const uploadPhotos = async () => {
    if (!user || capturedPhotos.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      const { uploadAvatarPhoto, saveAvatarPhotos } = await import('@/services/avatarService');
      const uploadedPhotos: CapturedPhoto[] = [];

      for (const photo of capturedPhotos) {
        const result = await uploadAvatarPhoto(user.id, photo.type, photo.dataUrl);
        if (result.success && result.url) {
          uploadedPhotos.push({ ...photo, uploaded: true, url: result.url });
        } else {
          // Use data URL as fallback
          uploadedPhotos.push({ ...photo, uploaded: true, url: photo.dataUrl });
        }
      }

      const frontPhoto = uploadedPhotos.find(p => p.type === 'front');
      const leftPhoto = uploadedPhotos.find(p => p.type === 'left');
      const rightPhoto = uploadedPhotos.find(p => p.type === 'right');

      if (frontPhoto?.url) {
        await saveAvatarPhotos(
          user.id,
          frontPhoto.url,
          leftPhoto?.url,
          rightPhoto?.url
        );
      }

      setCapturedPhotos(uploadedPhotos);
      stopCamera();
      // Go to avatar generation step
      setCurrentStep('generate');
    } catch (err) {
      console.error('Photo upload error:', err);
      // Continue anyway
      stopCamera();
      setCurrentStep('generate');
    } finally {
      setIsUploading(false);
    }
  };

  const toggleTrait = (trait: string) => {
    setSelectedTraits(prev => {
      if (prev.includes(trait)) {
        return prev.filter(t => t !== trait);
      }
      if (prev.length >= 4) {
        return prev;
      }
      return [...prev, trait];
    });
  };

  const handleVoiceRecordingComplete = async (audioUrl: string) => {
    if (!user) {
      setCurrentStep('style');
      return;
    }

    setIsUploading(true);
    try {
      const { uploadVoiceSample, saveVoiceSample } = await import('@/services/avatarService');
      
      // Upload the voice sample
      const uploadResult = await uploadVoiceSample(user.id, audioUrl);
      
      if (uploadResult.success && uploadResult.url) {
        // Save the URL to the database
        await saveVoiceSample(user.id, uploadResult.url);
        setVoiceSampleUrl(uploadResult.url);
      }
      
      setCurrentStep('style');
    } catch (err) {
      console.error('Voice upload error:', err);
      // Continue anyway
      setCurrentStep('style');
    } finally {
      setIsUploading(false);
    }
  };

  const savePreferences = async () => {
    if (!user) return;

    setIsUploading(true);
    try {
      const { updateAvatarStyle, completeAvatarSetup } = await import('@/services/avatarService');
      
      await updateAvatarStyle(
        user.id,
        selectedStyle,
        selectedVoiceStyle,
        selectedTraits,
        speakingStyle
      );
      await completeAvatarSetup(user.id);
      await refreshUser();
      setCurrentStep('complete');
    } catch (err) {
      console.error('Save preferences error:', err);
      // Continue to complete step anyway
      setCurrentStep('complete');
    } finally {
      setIsUploading(false);
    }
  };

  const skipToComplete = async () => {
    if (!user) {
      setCurrentStep('complete');
      return;
    }
    
    setIsUploading(true);
    try {
      const { completeAvatarSetup } = await import('@/services/avatarService');
      await completeAvatarSetup(user.id);
      await refreshUser();
    } catch (e) {
      console.log('Skip complete error:', e);
    } finally {
      setIsUploading(false);
      setCurrentStep('complete');
    }
  };

  const handleAvatarGenerated = (avatarUrl: string) => {
    setGeneratedAvatarUrl(avatarUrl);
  };

  const handleGenerationComplete = () => {
    setCurrentStep('voice');
  };

  const getPhotoInstruction = () => {
    switch (currentPhotoType) {
      case 'front': return 'Schaue direkt in die Kamera';
      case 'left': return 'Drehe deinen Kopf leicht nach links';
      case 'right': return 'Drehe deinen Kopf leicht nach rechts';
    }
  };

  const getPhotoLabel = (type: 'front' | 'left' | 'right') => {
    switch (type) {
      case 'front': return 'Frontal';
      case 'left': return 'Links';
      case 'right': return 'Rechts';
    }
  };

  const getPhotoUrls = () => {
    return capturedPhotos.map(p => p.url || p.dataUrl);
  };

  if (!isOpen) return null;

  const steps = ['welcome', 'photos', 'generate', 'voice', 'style', 'personality', 'complete'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {currentStep === 'welcome' && 'Willkommen bei Mio!'}
                {currentStep === 'photos' && 'Dein persönlicher Avatar'}
                {currentStep === 'generate' && 'KI-Avatar erstellen'}
                {currentStep === 'voice' && 'Deine Stimme aufnehmen'}
                {currentStep === 'style' && 'Avatar-Stil wählen'}
                {currentStep === 'personality' && 'Persönlichkeit definieren'}
                {currentStep === 'complete' && 'Fertig!'}
              </h2>
              <p className="text-white/80 text-sm">
                {currentStep === 'welcome' && 'Lass uns deinen persönlichen KI-Assistenten erstellen'}
                {currentStep === 'photos' && 'Mache ein paar Fotos für deinen Avatar'}
                {currentStep === 'generate' && 'Die KI erstellt deinen einzigartigen Avatar'}
                {currentStep === 'voice' && 'Nimm eine Stimmprobe auf für personalisierte Sprachausgabe'}
                {currentStep === 'style' && 'Wie soll dein Avatar aussehen?'}
                {currentStep === 'personality' && 'Wie soll dein Avatar kommunizieren?'}
                {currentStep === 'complete' && 'Dein Avatar ist bereit!'}
              </p>
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="flex gap-2 mt-6">
            {steps.map((step, index) => (
              <div 
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  steps.indexOf(currentStep) >= index
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <div className="text-center space-y-6">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                <User className="w-16 h-16 text-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Hallo{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Mio ist dein persönlicher KI-Assistent, der aussieht und spricht wie du. 
                  Lass uns in wenigen Schritten deinen Avatar erstellen.
                </p>
              </div>
              
              <div className="grid grid-cols-5 gap-3 max-w-lg mx-auto">
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <Camera className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Fotos</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Wand2 className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">KI-Avatar</p>
                </div>
                <div className="p-3 bg-violet-50 rounded-xl">
                  <Mic className="w-6 h-6 text-violet-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Stimme</p>
                </div>
                <div className="p-3 bg-pink-50 rounded-xl">
                  <Palette className="w-6 h-6 text-pink-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Stil</p>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-rose-500 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Persönlichkeit</p>
                </div>
              </div>

              <button
                onClick={() => { setCurrentStep('photos'); startCamera(); }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30 flex items-center gap-2 mx-auto"
              >
                Los geht's
                <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => { setCurrentStep('style'); }}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                Überspringen und später einrichten
              </button>
            </div>
          )}

          {/* Photos Step */}
          {currentStep === 'photos' && (
            <div className="space-y-6">
              {/* Camera View */}
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden">
                {cameraActive ? (
                  <>
                    <video 
                      ref={videoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover transform scale-x-[-1]" 
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Face Guide */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-48 h-64 border-4 border-white/50 rounded-[50%] border-dashed" />
                    </div>
                    
                    {/* Instruction */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="px-4 py-2 bg-black/50 text-white rounded-full text-sm">
                        {getPhotoInstruction()}
                      </span>
                    </div>
                    
                    {/* Countdown */}
                    {countdown !== null && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-8xl font-bold text-white animate-pulse">{countdown}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <button
                      onClick={startCamera}
                      className="px-6 py-3 bg-white text-gray-900 rounded-xl font-medium flex items-center gap-2 hover:bg-gray-100"
                    >
                      <Camera className="w-5 h-5" />
                      Kamera starten
                    </button>
                  </div>
                )}
              </div>

              {/* Captured Photos Preview */}
              <div className="grid grid-cols-3 gap-4">
                {(['front', 'left', 'right'] as const).map((type) => {
                  const photo = capturedPhotos.find(p => p.type === type);
                  return (
                    <div key={type} className="relative">
                      <div className={`aspect-square rounded-xl overflow-hidden border-2 ${
                        photo ? 'border-green-500' : currentPhotoType === type ? 'border-indigo-500' : 'border-gray-200'
                      }`}>
                        {photo ? (
                          <img src={photo.dataUrl} alt={type} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">{getPhotoLabel(type)}</p>
                      {photo && (
                        <button
                          onClick={() => retakePhoto(type)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-600" />
                        </button>
                      )}
                      {photo && (
                        <div className="absolute top-2 left-2 p-1.5 bg-green-500 rounded-full">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {cameraActive && !capturedPhotos.find(p => p.type === currentPhotoType) && (
                  <button
                    onClick={startCountdown}
                    disabled={countdown !== null}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Camera className="w-5 h-5" />
                    Foto aufnehmen ({getPhotoLabel(currentPhotoType)})
                  </button>
                )}
                
                {capturedPhotos.length > 0 && (
                  <button
                    onClick={uploadPhotos}
                    disabled={isUploading}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Wird hochgeladen...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        {capturedPhotos.length === 3 ? 'Avatar erstellen' : `${capturedPhotos.length} Foto(s) - Avatar erstellen`}
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => { stopCamera(); setCurrentStep('welcome'); }}
                  className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Zurück
                </button>
                <button
                  onClick={() => { stopCamera(); setCurrentStep('voice'); }}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Überspringen
                </button>
              </div>
            </div>
          )}

          {/* Generate Step - AI Avatar Generation */}
          {currentStep === 'generate' && user && (
            <AvatarGenerator
              userId={user.id}
              photoUrls={getPhotoUrls()}
              initialStyle={selectedStyle as any}
              onAvatarGenerated={handleAvatarGenerated}
              onBack={() => setCurrentStep('photos')}
              onComplete={handleGenerationComplete}
            />
          )}

          {/* Voice Recording Step */}
          {currentStep === 'voice' && (
            <VoiceRecordingStep
              onComplete={handleVoiceRecordingComplete}
              onSkip={() => setCurrentStep('style')}
              onBack={() => setCurrentStep(capturedPhotos.length > 0 ? 'generate' : 'photos')}
            />
          )}

          {/* Style Step */}
          {currentStep === 'style' && (
            <div className="space-y-6">
              {/* Show generated avatar if available */}
              {generatedAvatarUrl && (
                <div className="flex justify-center mb-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-200">
                    <img src={generatedAvatarUrl} alt="Dein Avatar" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Avatar-Stil</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {AVATAR_STYLES.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedStyle === style.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{style.preview}</span>
                      <p className="font-medium text-gray-900 mt-2">{style.name}</p>
                      <p className="text-xs text-gray-500">{style.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Stimm-Stil</h3>
                <div className="grid grid-cols-2 gap-3">
                  {VOICE_STYLES.map(voice => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoiceStyle(voice.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedVoiceStyle === voice.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Volume2 className={`w-5 h-5 ${selectedVoiceStyle === voice.id ? 'text-purple-500' : 'text-gray-400'}`} />
                        <p className="font-medium text-gray-900">{voice.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{voice.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice sample indicator */}
              {voiceSampleUrl && (
                <div className="p-4 bg-violet-50 rounded-xl border border-violet-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-500 rounded-full flex items-center justify-center">
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-violet-800">Stimmprobe gespeichert</p>
                      <p className="text-sm text-violet-600">Dein Avatar kann jetzt mit deiner Stimme sprechen</p>
                    </div>
                    <Check className="w-6 h-6 text-violet-500 ml-auto" />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('voice')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Zurück
                </button>
                <button
                  onClick={() => setCurrentStep('personality')}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2"
                >
                  Weiter
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Personality Step */}
          {currentStep === 'personality' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Persönlichkeitsmerkmale</h3>
                <p className="text-sm text-gray-500 mb-3">Wähle bis zu 4 Eigenschaften für deinen Avatar</p>
                <div className="flex flex-wrap gap-2">
                  {PERSONALITY_TRAITS.map(trait => (
                    <button
                      key={trait}
                      onClick={() => toggleTrait(trait)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedTraits.includes(trait)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {trait}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Kommunikationsstil</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'freundlich', label: 'Freundlich & Locker', desc: 'Du-Form, entspannt' },
                    { id: 'professionell', label: 'Professionell', desc: 'Sie-Form, förmlich' },
                    { id: 'motivierend', label: 'Motivierend', desc: 'Aufmunternd, positiv' },
                    { id: 'direkt', label: 'Direkt & Klar', desc: 'Auf den Punkt gebracht' },
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSpeakingStyle(style.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        speakingStyle === style.id
                          ? 'border-pink-500 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-gray-900">{style.label}</p>
                      <p className="text-xs text-gray-500">{style.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep('style')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Zurück
                </button>
                <button
                  onClick={savePreferences}
                  disabled={isUploading}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Wird gespeichert...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Avatar fertigstellen
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-6 py-8">
              {generatedAvatarUrl ? (
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-indigo-200">
                  <img src={generatedAvatarUrl} alt="Dein Avatar" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-32 h-32 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                  <Check className="w-16 h-16 text-green-500" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Dein Avatar ist bereit!
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {generatedAvatarUrl 
                    ? 'Dein personalisierter KI-Avatar wurde erfolgreich erstellt. Du kannst ihn jederzeit in deinen Einstellungen anpassen.'
                    : 'Mio wird jetzt basierend auf deinen Einstellungen personalisiert. Du kannst die Einstellungen jederzeit in deinem Profil anpassen.'
                  }
                </p>
              </div>

              {/* Features summary */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {generatedAvatarUrl && (
                  <div className="p-3 bg-indigo-50 rounded-xl flex items-center gap-2">
                    <Check className="w-5 h-5 text-indigo-500" />
                    <span className="text-sm text-indigo-700">Avatar erstellt</span>
                  </div>
                )}
                {voiceSampleUrl && (
                  <div className="p-3 bg-violet-50 rounded-xl flex items-center gap-2">
                    <Check className="w-5 h-5 text-violet-500" />
                    <span className="text-sm text-violet-700">Stimme gespeichert</span>
                  </div>
                )}
                <div className="p-3 bg-pink-50 rounded-xl flex items-center gap-2">
                  <Check className="w-5 h-5 text-pink-500" />
                  <span className="text-sm text-pink-700">Stil gewählt</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl flex items-center gap-2">
                  <Check className="w-5 h-5 text-rose-500" />
                  <span className="text-sm text-rose-700">Persönlichkeit</span>
                </div>
              </div>

              <div className="p-4 bg-indigo-50 rounded-xl max-w-sm mx-auto">
                <p className="text-sm text-indigo-700">
                  <strong>Tipp:</strong> Sprich mit Mio, um deinen Avatar kennenzulernen! 
                  Klicke auf das Mikrofon-Symbol oder tippe deine Nachricht.
                </p>
              </div>

              <button
                onClick={() => { onComplete(); onClose(); }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/30"
              >
                Mio starten
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarSetupWizard;
