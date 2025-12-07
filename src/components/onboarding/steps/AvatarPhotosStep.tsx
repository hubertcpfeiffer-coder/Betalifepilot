import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Image, Sparkles, AlertCircle } from 'lucide-react';

interface Props {
  onComplete: (photos: string[]) => void;
  onSkip: () => void;
}

const AvatarPhotosStep: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    
    // Convert files to base64 for preview (in production, upload to storage)
    const newPhotos: string[] = [];
    for (let i = 0; i < Math.min(files.length, 5 - photos.length); i++) {
      const file = files[i];
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      newPhotos.push(base64);
    }

    setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
    setUploading(false);
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplete = () => {
    if (photos.length >= 1) {
      onComplete(photos);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Fotos für deinen Avatar</h3>
        <p className="text-gray-500 text-sm">Lade 1-5 Fotos hoch, um einen personalisierten Avatar zu erstellen</p>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
            <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => removePhoto(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <span className="text-xs text-white font-medium">Hauptfoto</span>
              </div>
            )}
          </div>
        ))}
        
        {photos.length < 5 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-pink-400 hover:bg-pink-50 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-pink-500"
          >
            {uploading ? (
              <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6" />
                <span className="text-xs">Hochladen</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-amber-800 mb-1">Tipps für beste Ergebnisse:</p>
            <ul className="text-amber-700 space-y-1">
              <li>• Verwende gut beleuchtete Fotos</li>
              <li>• Zeige dein Gesicht deutlich</li>
              <li>• Verschiedene Winkel helfen</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview info */}
      {photos.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">KI-Avatar wird erstellt</p>
            <p className="text-sm text-gray-500">{photos.length} Foto{photos.length !== 1 ? 's' : ''} ausgewählt</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onSkip}
          className="flex-1 py-3 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Überspringen
        </button>
        <button
          onClick={handleComplete}
          disabled={photos.length === 0}
          className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-rose-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Check className="w-5 h-5" />
          Weiter
        </button>
      </div>
    </div>
  );
};

export default AvatarPhotosStep;
