import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Play, Pause, Check, RefreshCw, 
  Volume2, Loader2, ChevronRight, AlertCircle, Waveform
} from 'lucide-react';

interface Props {
  onComplete: (audioUrl: string) => void;
  onSkip: () => void;
  onBack: () => void;
}

// Sample texts for voice recording
const SAMPLE_TEXTS = [
  {
    id: 'greeting',
    title: 'Begrüßung',
    text: 'Hallo! Ich bin dein persönlicher Assistent und freue mich, dir heute zu helfen. Wie kann ich dir behilflich sein?',
    duration: '~8 Sekunden'
  },
  {
    id: 'weather',
    title: 'Wetterbericht',
    text: 'Das Wetter heute ist sonnig mit Temperaturen um die zwanzig Grad. Am Nachmittag kann es vereinzelt zu Wolken kommen, aber Regen ist nicht zu erwarten.',
    duration: '~12 Sekunden'
  },
  {
    id: 'motivation',
    title: 'Motivation',
    text: 'Jeder Tag ist eine neue Chance, etwas Großartiges zu erreichen. Glaube an dich selbst und deine Fähigkeiten. Du schaffst das!',
    duration: '~10 Sekunden'
  }
];

const VoiceRecordingStep: React.FC<Props> = ({ onComplete, onSkip, onBack }) => {
  const [selectedText, setSelectedText] = useState(SAMPLE_TEXTS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      stopRecording();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const checkMicrophonePermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      return false;
    }
  };

  const startRecording = async () => {
    setError('');
    setPermissionDenied(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        }
      });

      streamRef.current = stream;

      // Set up audio context for visualization
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Start visualization
      visualize();

      // Set up MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedAudio(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      mediaRecorderRef.current.start(100);
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Error starting recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionDenied(true);
        setError('Mikrofonzugriff wurde verweigert. Bitte erlaube den Zugriff in deinen Browser-Einstellungen.');
      } else {
        setError('Fehler beim Starten der Aufnahme. Bitte überprüfe dein Mikrofon.');
      }
    }
  };

  const visualize = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const update = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(average / 255);
      
      animationRef.current = requestAnimationFrame(update);
    };
    
    update();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    setIsRecording(false);
    setIsPaused(false);
    setAudioLevel(0);
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setRecordedAudio(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
  };

  const playRecording = () => {
    if (!audioUrl || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const handleComplete = async () => {
    if (!recordedAudio) return;

    setIsUploading(true);
    setError('');

    try {
      // Convert blob to base64 for upload
      const reader = new FileReader();
      reader.readAsDataURL(recordedAudio);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        onComplete(base64Audio);
      };

      reader.onerror = () => {
        setError('Fehler beim Verarbeiten der Aufnahme.');
        setIsUploading(false);
      };
    } catch (err) {
      console.error('Error processing recording:', err);
      setError('Fehler beim Verarbeiten der Aufnahme.');
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Mic className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Stimmprobe aufnehmen</h3>
        <p className="text-gray-500 text-sm mt-1">
          Lies den Text vor, damit dein Avatar mit deiner Stimme sprechen kann
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Permission Denied Help */}
      {permissionDenied && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h4 className="font-medium text-amber-800 mb-2">Mikrofonzugriff erforderlich</h4>
          <p className="text-sm text-amber-700 mb-3">
            Um deine Stimme aufzunehmen, benötigen wir Zugriff auf dein Mikrofon.
          </p>
          <ol className="text-sm text-amber-700 list-decimal list-inside space-y-1">
            <li>Klicke auf das Schloss-Symbol in der Adressleiste</li>
            <li>Wähle "Website-Einstellungen"</li>
            <li>Erlaube den Mikrofonzugriff</li>
            <li>Lade die Seite neu</li>
          </ol>
        </div>
      )}

      {/* Text Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Wähle einen Text zum Vorlesen:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {SAMPLE_TEXTS.map((text) => (
            <button
              key={text.id}
              onClick={() => setSelectedText(text)}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                selectedText.id === text.id
                  ? 'border-violet-500 bg-violet-50'
                  : 'border-gray-200 hover:border-violet-300'
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">{text.title}</p>
              <p className="text-xs text-gray-500">{text.duration}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Text to Read */}
      <div className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200">
        <div className="flex items-center gap-2 mb-2">
          <Volume2 className="w-4 h-4 text-violet-500" />
          <span className="text-sm font-medium text-violet-700">Lies diesen Text vor:</span>
        </div>
        <p className="text-gray-800 leading-relaxed text-lg">
          "{selectedText.text}"
        </p>
      </div>

      {/* Recording Interface */}
      <div className="bg-gray-50 rounded-2xl p-6">
        {/* Audio Visualization */}
        <div className="flex items-center justify-center gap-1 h-16 mb-4">
          {isRecording ? (
            // Live visualization bars
            Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-violet-500 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(8, audioLevel * 64 * (0.5 + Math.random() * 0.5))}px`,
                  opacity: 0.5 + audioLevel * 0.5
                }}
              />
            ))
          ) : recordedAudio ? (
            // Static waveform for recorded audio
            Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 bg-green-500 rounded-full"
                style={{
                  height: `${8 + Math.sin(i * 0.5) * 20 + Math.random() * 16}px`
                }}
              />
            ))
          ) : (
            // Idle state
            Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gray-300 rounded-full"
              />
            ))
          )}
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          <span className={`text-3xl font-mono font-bold ${isRecording ? 'text-red-500' : 'text-gray-700'}`}>
            {formatTime(recordingTime)}
          </span>
          {isRecording && (
            <span className="ml-2 inline-flex items-center gap-1 text-red-500 text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Aufnahme läuft
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {!recordedAudio ? (
            <>
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-red-700 transition-all"
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <>
                  {isPaused ? (
                    <button
                      onClick={resumeRecording}
                      className="w-12 h-12 bg-violet-500 rounded-full flex items-center justify-center text-white hover:bg-violet-600 transition-colors"
                    >
                      <Mic className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={pauseRecording}
                      className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white hover:bg-amber-600 transition-colors"
                    >
                      <Pause className="w-6 h-6" />
                    </button>
                  )}
                  <button
                    onClick={stopRecording}
                    className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    <MicOff className="w-8 h-8" />
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              <button
                onClick={resetRecording}
                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-300 transition-colors"
              >
                <RefreshCw className="w-6 h-6" />
              </button>
              <button
                onClick={playRecording}
                className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:from-green-600 hover:to-emerald-700 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8 ml-1" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Hidden audio element for playback */}
        {audioUrl && (
          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={handleAudioEnded}
          />
        )}
      </div>

      {/* Tips */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Tipps für eine gute Aufnahme:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Sprich in einem ruhigen Raum ohne Hintergrundgeräusche
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Halte das Mikrofon etwa 20-30 cm vom Mund entfernt
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Sprich natürlich und in deinem normalen Tempo
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-4 h-4 flex-shrink-0" />
            Vermeide Räuspern oder Husten während der Aufnahme
          </li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Zurück
        </button>
        <button
          onClick={onSkip}
          className="px-6 py-3 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
        >
          Überspringen
        </button>
        <button
          onClick={handleComplete}
          disabled={!recordedAudio || isUploading}
          className="flex-1 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Wird gespeichert...
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              Stimmprobe speichern
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VoiceRecordingStep;
