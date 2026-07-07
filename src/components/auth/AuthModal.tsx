import React, { useState, useEffect } from 'react';
import { X, Bot, Sparkles, Rocket } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '@/contexts/AuthContext';

// R-13: Face-Login/-Register entfernt (Beta). Der bisherige Pfad war ein Demo-Stub
// ohne echten Gesichtsabgleich (compareFaceImages() lieferte immer true) und hätte
// als echte Session einen passwortlosen Login-Bypass bedeutet. Auth erfolgt nur
// noch per E-Mail + Passwort (Custom-Auth-RPCs). Echte Biometrie ist ein separates,
// compliance-geprüftes Projekt (EU AI Act / DSGVO Art. 9).

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSignupComplete?: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, initialMode = 'login', onSignupComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, signup } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
      setSuccess('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const result = await login(email, password);
    if (result.success) {
      setSuccess('Willkommen zurück!');
      setTimeout(() => onClose(), 1000);
    } else {
      setError(result.error || 'Anmeldung fehlgeschlagen');
    }
    setIsLoading(false);
  };

  const handleSignup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    const result = await signup(email, password, fullName);
    if (result.success) {
      setSuccess('Konto erstellt! Lass uns deinen Avatar einrichten...');
      setTimeout(() => {
        onClose();
        onSignupComplete?.();
      }, 1500);
    } else {
      setError(result.error || 'Registrierung fehlgeschlagen');
    }
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
              mode === 'signup'
                ? 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/30'
                : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'
            }`}>
              {mode === 'signup' ? (
                <Rocket className="w-6 h-6 text-white" />
              ) : (
                <Bot className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {mode === 'login' ? 'Willkommen zurück!' : 'Starte mit deinem Lifepilot'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'login' ? 'Melde dich bei Mio an' : 'Erstelle deinen persönlichen KI-Assistenten'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-50 text-green-600 text-sm rounded-xl border border-green-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* Login/Signup Forms */}
          {mode === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={() => setError('Passwort-Reset wird bald verfügbar.')}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              isLoading={isLoading}
            />
          )}

          {/* Toggle Mode */}
          <p className="text-center text-sm text-gray-600">
            {mode === 'login' ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Jetzt registrieren' : 'Anmelden'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
