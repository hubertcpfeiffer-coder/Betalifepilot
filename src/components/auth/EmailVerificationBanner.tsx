import React, { useState } from 'react';
import { Mail, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  email: string;
  userId: string;
  onDismiss?: () => void;
}

const EmailVerificationBanner: React.FC<Props> = ({ email, userId, onDismiss }) => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const resendEmail = async () => {
    setSending(true);
    setError('');
    try {
      const { data, error: fnError } = await supabase.functions.invoke('verify-email-sender', {
        body: { userId, email, baseUrl: window.location.origin }
      });
      
      if (fnError) throw fnError;
      if (data?.success) {
        setSent(true);
        setTimeout(() => setSent(false), 5000);
      } else {
        throw new Error(data?.error || 'Fehler beim Senden');
      }
    } catch (e: any) {
      setError('E-Mail konnte nicht gesendet werden');
      console.error('Resend error:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Mail className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">
                E-Mail-Adresse noch nicht bestätigt
              </p>
              <p className="text-xs text-amber-600">
                Bitte bestätige deine E-Mail ({email}) um alle Funktionen zu nutzen.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {sent ? (
              <span className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="w-4 h-4" /> E-Mail gesendet!
              </span>
            ) : error ? (
              <span className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" /> {error}
              </span>
            ) : null}
            
            <button onClick={resendEmail} disabled={sending || sent}
              className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center gap-2">
              {sending ? <><Loader2 className="w-4 h-4 animate-spin" /> Senden...</> : 'Erneut senden'}
            </button>
            
            {onDismiss && (
              <button onClick={onDismiss} className="p-1 text-amber-600 hover:text-amber-800">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
