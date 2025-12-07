import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Check, X, Sparkles, Rocket } from 'lucide-react';

interface Props {
  onSubmit: (email: string, password: string, fullName: string) => Promise<void>;
  isLoading: boolean;
}

const SignupForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const isValidPassword = password.length >= 6;
  const isFormValid = fullName.trim() && email.trim() && passwordsMatch && isValidPassword && acceptTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    try {
      await onSubmit(email.trim(), password, fullName.trim());
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Beta-Tester Welcome */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl border border-indigo-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-indigo-700">Werde Beta-Tester</span>
            <p className="text-xs text-gray-600">
              Erstelle deinen persönlichen KI-Assistenten, der aussieht und spricht wie du!
            </p>
          </div>
        </div>
      </div>

      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Wie heißt du?</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Dein Name" 
            required 
            autoComplete="name" 
          />
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">E-Mail-Adresse</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="deine@email.de" 
            required 
            autoComplete="email" 
          />
        </div>
      </div>

      {/* Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Passwort erstellen</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type={showPassword ? 'text' : 'password'} 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Mindestens 6 Zeichen" 
            required 
            minLength={6} 
            autoComplete="new-password" 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {password && (
          <div className="flex items-center gap-1 mt-1">
            {isValidPassword ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <X className="w-3 h-3 text-gray-400" />
            )}
            <p className={`text-xs ${isValidPassword ? 'text-green-600' : 'text-gray-500'}`}>
              {isValidPassword ? 'Passwort ist gültig' : 'Mindestens 6 Zeichen erforderlich'}
            </p>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Passwort bestätigen</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Passwort wiederholen" 
            required 
            autoComplete="new-password" 
          />
          {confirmPassword && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              {passwordsMatch ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </span>
          )}
        </div>
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-red-500 mt-1">Passwörter stimmen nicht überein</p>
        )}
      </div>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <input 
          type="checkbox" 
          checked={acceptTerms} 
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="w-5 h-5 mt-0.5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300" 
        />
        <span className="text-sm text-gray-600">
          Ich akzeptiere die{' '}
          <a href="#" className="text-indigo-600 hover:underline font-medium">Nutzungsbedingungen</a>
          {' '}und{' '}
          <a href="#" className="text-indigo-600 hover:underline font-medium">Datenschutzrichtlinien</a>
        </span>
      </label>

      {/* Submit Button */}
      <button 
        type="submit" 
        disabled={isLoading || !isFormValid}
        className="w-full py-4 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Konto wird erstellt...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Kostenlos registrieren & Avatar erstellen
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="text-center text-xs text-gray-500">
        Nach der Registrierung kannst du Fotos für deinen persönlichen Avatar machen
      </p>
    </form>
  );
};

export default SignupForm;
