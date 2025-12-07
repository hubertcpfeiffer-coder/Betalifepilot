import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { verifyEmailToken } from '@/services/emailVerificationService';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Kein Bestätigungstoken gefunden');
      return;
    }

    const verify = async () => {
      const result = await verifyEmailToken(token);
      if (result.success) {
        setStatus('success');
        setEmail(result.email || '');
        setMessage('Deine E-Mail-Adresse wurde erfolgreich bestätigt!');
      } else {
        setStatus('error');
        setMessage(result.error || 'Verifizierung fehlgeschlagen');
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-cyan-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-cyan-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Mail wird bestätigt...</h1>
              <p className="text-gray-600">Bitte warte einen Moment.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">E-Mail bestätigt!</h1>
              <p className="text-gray-600 mb-2">{message}</p>
              {email && <p className="text-sm text-cyan-600 mb-6">{email}</p>}
              <button onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2">
                Zur App <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Bestätigung fehlgeschlagen</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button onClick={() => navigate('/')}
                className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                <Mail className="w-5 h-5" /> Zurück zur Startseite
              </button>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Mio Lifepilot - Dein persönlicher KI-Lebensassistent
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
