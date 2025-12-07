import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { verifyFace } from '@/services/faceRecognitionService';

interface Props {
  onSuccess: (faceData: string) => void;
  onCancel: () => void;
  mode: 'register' | 'login';
  userEmail?: string;
}

const FaceRecognition: React.FC<Props> = ({ onSuccess, onCancel, mode, userEmail }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setStatus('idle');
      setMessage(mode === 'register' ? 'Positioniere dein Gesicht im Rahmen' : 'Schaue in die Kamera zur Anmeldung');
    } catch {
      setStatus('error');
      setMessage('Kamera-Zugriff verweigert. Bitte erlaube den Zugriff.');
    }
  };

  const stopCamera = () => stream?.getTracks().forEach(track => track.stop());

  const startCountdown = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) { clearInterval(interval); captureAndAnalyze(); return null; }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setStatus('scanning');
    setMessage('Analysiere Gesicht...');
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    if (mode === 'register') {
      setStatus('success');
      setMessage('Gesicht erfolgreich erfasst!');
      setTimeout(() => onSuccess(imageData), 1000);
    } else {
      const result = await verifyFace(userEmail || '', imageData);
      if (!result.success) {
        setStatus('error');
        setMessage(result.error || 'Gesicht nicht erkannt.');
        return;
      }
      setStatus('success');
      setMessage('Gesicht erkannt! Anmeldung erfolgreich.');
      setTimeout(() => onSuccess(JSON.stringify(result.user)), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-48 h-64 border-4 rounded-[50%] transition-colors ${
            status === 'scanning' ? 'border-cyan-400 animate-pulse' :
            status === 'success' ? 'border-green-500' :
            status === 'error' ? 'border-red-500' : 'border-white/50'
          }`} />
        </div>
        {countdown !== null && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-7xl font-bold text-white animate-pulse">{countdown}</span>
          </div>
        )}
        {status !== 'idle' && countdown === null && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            {status === 'scanning' && <Loader2 className="w-16 h-16 text-white animate-spin" />}
            {status === 'success' && <CheckCircle className="w-16 h-16 text-green-500" />}
            {status === 'error' && <XCircle className="w-16 h-16 text-red-500" />}
          </div>
        )}
      </div>
      <p className="text-center text-sm text-gray-600">{message}</p>
      <div className="flex gap-3">
        {status === 'error' && (
          <button onClick={() => { setStatus('idle'); setMessage('Positioniere dein Gesicht'); }}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5" /> Erneut versuchen
          </button>
        )}
        {status === 'idle' && (
          <button onClick={startCountdown}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30">
            <Camera className="w-5 h-5" /> {mode === 'register' ? 'Gesicht aufnehmen' : 'Mit Gesicht anmelden'}
          </button>
        )}
        <button onClick={() => { stopCamera(); onCancel(); }}
          className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50">
          Abbrechen
        </button>
      </div>
    </div>
  );
};

export default FaceRecognition;
