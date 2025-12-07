import React, { useState } from 'react';
import { X, ScanFace, Shield, Zap, CheckCircle } from 'lucide-react';
import FaceRecognition from './FaceRecognition';
import { registerFace } from '@/services/faceRecognitionService';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const FaceSetupModal: React.FC<Props> = ({ isOpen, onClose, onComplete }) => {
  const [step, setStep] = useState<'intro' | 'capture' | 'success'>('intro');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleFaceCapture = async (faceData: string) => {
    if (!user) return;
    setIsLoading(true);
    setError('');

    const result = await registerFace(user.id, faceData);

    if (!result.success) {
      setError(result.error || 'Registrierung fehlgeschlagen');
      setIsLoading(false);
      return;
    }

    setStep('success');
    setIsLoading(false);
    setTimeout(() => onComplete(), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
        <div className="relative p-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <ScanFace className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Gesichtserkennung einrichten</h2>
              <p className="text-cyan-100">Melde dich schnell & sicher mit deinem Gesicht an</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">{error}</div>}

          {step === 'intro' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-50 rounded-xl">
                  <Shield className="w-8 h-8 text-cyan-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Sicher</h3>
                  <p className="text-sm text-gray-600">Deine Gesichtsdaten werden verschlüsselt gespeichert</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-xl">
                  <Zap className="w-8 h-8 text-blue-600 mb-2" />
                  <h3 className="font-semibold text-gray-900">Schnell</h3>
                  <p className="text-sm text-gray-600">Login in unter 2 Sekunden ohne Passwort</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep('capture')} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/30">
                  Jetzt einrichten
                </button>
                <button onClick={onClose} className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
                  Später
                </button>
              </div>
            </div>
          )}

          {step === 'capture' && <FaceRecognition mode="register" onSuccess={handleFaceCapture} onCancel={() => setStep('intro')} />}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Erfolgreich eingerichtet!</h3>
              <p className="text-gray-600">Du kannst dich jetzt mit deinem Gesicht anmelden.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceSetupModal;
