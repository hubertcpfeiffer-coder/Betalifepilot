import React, { useState } from 'react';
import { Check, Camera, Upload } from 'lucide-react';

interface Props {
  currentAvatar?: string;
  onSelect: (url: string) => void;
}

const defaultAvatars = [
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935308344_cf06b37d.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935310497_f117c196.png',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935313530_5e9bfc7b.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935308795_6f65f730.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935311744_e17c2315.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935315823_aba386a9.jpg',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935323841_3584028d.png',
  'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935320009_285f23b6.png',
];

const AvatarSelector: React.FC<Props> = ({ currentAvatar, onSelect }) => {
  const [selected, setSelected] = useState(currentAvatar || defaultAvatars[0]);

  const handleSelect = (url: string) => {
    setSelected(url);
    onSelect(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <img src={selected} alt="Selected avatar" className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-lg" />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-center text-sm text-gray-600">Wähle einen Avatar oder lade ein eigenes Bild hoch</p>
      <div className="grid grid-cols-4 gap-3">
        {defaultAvatars.map((url, i) => (
          <button key={i} onClick={() => handleSelect(url)}
            className={`relative rounded-xl overflow-hidden aspect-square transition-all duration-200 ${selected === url ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-105'}`}>
            <img src={url} alt={`Avatar ${i + 1}`} className="w-full h-full object-cover" />
            {selected === url && (
              <div className="absolute inset-0 bg-indigo-500/30 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2">
        <Upload className="w-5 h-5" />
        Eigenes Bild hochladen
      </button>
    </div>
  );
};

export default AvatarSelector;
