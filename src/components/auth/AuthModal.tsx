import React, { useState, useEffect } from 'react';
import { X, Bot, ScanFace, Mail, Sparkles, Rocket } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import SocialLoginButtons from './SocialLoginButtons';
import FaceRecognition from './FaceRecognition';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { generateSessionToken } from '@/lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSignupComplete?: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose, initialMode = 'login', onSignupComplete }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'face-login' | 'face-register' | 'face-email'>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [faceLoginEmail, setFaceLoginEmail] = useState('');
  const { login, signup, signInWithOAuth } = useAuth();

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

  const handleFaceEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (faceLoginEmail) setMode('face-login');
  };

  const handleFaceSuccess = async (userData: string) => {
    if (mode === 'face-login') {
      try {
        const user = JSON.parse(userData);
        localStorage.setItem('mio_session', generateSessionToken());
        localStorage.setItem('mio_user_id', user.id);
        setSuccess('Anmeldung erfolgreich!');
        setTimeout(() => { window.location.reload(); }, 1500);
      } catch { 
        setError('Fehler bei der Anmeldung'); 
      }
    } else {
      setSuccess('Gesicht registriert!');
      setTimeout(() => { 
        onClose(); 
        onSignupComplete?.(); 
      }, 1500);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    const providerMap: { [key: string]: 'google' | 'apple' | 'facebook' | 'github' } = {
      google: 'google',
      apple: 'apple',
      facebook: 'facebook',
      github: 'github'
    };
    
    const oauthProvider = providerMap[provider];
    
    if (!oauthProvider) {
      setError(`${provider} Login wird bald verfügbar.`);
      setIsLoading(false);
      return;
    }
    
    const result = await signInWithOAuth(oauthProvider);
    
    if (!result.success) {
      setError(result.error || `${provider} Anmeldung fehlgeschlagen`);
      setIsLoading(false);
    }
    // If successful, the user will be redirected to OAuth provider
    // Loading state will remain until redirect happens
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
                {mode === 'login' && 'Willkommen zurück!'}
                {mode === 'signup' && 'Starte mit deinem Lifepilot'}
                {mode === 'face-email' && 'Gesichtserkennung'}
                {mode === 'face-login' && 'Gesichtserkennung'}
                {mode === 'face-register' && 'Gesicht registrieren'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'signup' && 'Erstelle deinen persönlichen KI-Assistenten'}
                {mode === 'login' && 'Melde dich bei Mio an'}
                {mode === 'face-email' && 'Gib deine E-Mail ein'}
                {mode === 'face-login' && 'Schaue in die Kamera'}
                {mode === 'face-register' && 'Erfasse dein Gesicht'}
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
          
          {/* Face Email Step */}
          {mode === 'face-email' && (
            <form onSubmit={handleFaceEmailSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">
                Gib deine E-Mail-Adresse ein, um dich mit Gesichtserkennung anzumelden.
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  value={faceLoginEmail} 
                  onChange={(e) => setFaceLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500"
                  placeholder="deine@email.de" 
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700"
              >
                Weiter zur Kamera
              </button>
              <button 
                type="button" 
                onClick={() => setMode('login')} 
                className="w-full py-2 text-gray-600 hover:text-gray-800"
              >
                Zurück zur Anmeldung
              </button>
            </form>
          )}

          {/* Face Login */}
          {mode === 'face-login' && (
            <FaceRecognition 
              mode="login" 
              userEmail={faceLoginEmail} 
              onSuccess={handleFaceSuccess} 
              onCancel={() => setMode('face-email')} 
            />
          )}

          {/* Face Register */}
          {mode === 'face-register' && (
            <FaceRecognition 
              mode="register" 
              onSuccess={handleFaceSuccess} 
              onCancel={() => setMode('signup')} 
            />
          )}

          {/* Login/Signup Forms */}
          {(mode === 'login' || mode === 'signup') && (
            <>
              {/* Social Login */}
              <SocialLoginButtons onSocialLogin={handleSocialLogin} isLoading={isLoading} />
              
              {/* Face Recognition Button */}
              <button 
                onClick={() => setMode(mode === 'login' ? 'face-email' : 'face-register')}
                className="w-full py-3 px-4 border-2 border-dashed border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 flex items-center justify-center gap-2 transition-colors"
              >
                <ScanFace className="w-5 h-5" />
                {mode === 'login' ? 'Mit Gesicht anmelden' : 'Gesicht für Avatar erfassen'}
              </button>
              
              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">oder mit E-Mail</span>
                </div>
              </div>
              
              {/* Forms */}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
