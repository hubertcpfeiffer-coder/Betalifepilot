import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Anmeldung wird verarbeitet...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // The AuthContext will handle the auth state change automatically
        // via the onAuthStateChange listener
        
        // Wait a moment for the auth state to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if we have a session in localStorage
        const userId = localStorage.getItem('mio_user_id');
        
        if (userId) {
          setStatus('success');
          setMessage('Anmeldung erfolgreich! Du wirst weitergeleitet...');
          
          // Redirect to home page after a short delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 1500);
        } else {
          // No session found, likely an error
          setStatus('error');
          setMessage('Anmeldung fehlgeschlagen. Bitte versuche es erneut.');
          
          // Redirect to home after delay
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setMessage('Ein Fehler ist aufgetreten. Bitte versuche es erneut.');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="flex flex-col items-center text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
              <h2 className="text-2xl font-bold text-gray-900">Einen Moment...</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Erfolgreich!</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Fehler</h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
