import React, { useState } from 'react';
import { User, MapPin, Briefcase, Calendar, Check } from 'lucide-react';

interface Props {
  onComplete: (data: ProfileData) => void;
  initialData?: ProfileData;
}

export interface ProfileData {
  nickname: string;
  birthDate: string;
  city: string;
  occupation: string;
}

const ProfileStep: React.FC<Props> = ({ onComplete, initialData }) => {
  const [profile, setProfile] = useState<ProfileData>(initialData || {
    nickname: '',
    birthDate: '',
    city: '',
    occupation: ''
  });

  const isValid = profile.nickname.trim().length >= 2;

  const handleSubmit = () => {
    if (isValid) {
      onComplete(profile);
    }
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Erzähl mir von dir</h3>
        <p className="text-gray-500 text-sm">So kann ich dich besser kennenlernen</p>
      </div>

      <div className="space-y-4">
        {/* Nickname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              Wie soll ich dich nennen? *
            </span>
          </label>
          <input
            type="text"
            value={profile.nickname}
            onChange={(e) => setProfile(p => ({ ...p, nickname: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Dein Spitzname"
          />
        </div>

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              Geburtsdatum (optional)
            </span>
          </label>
          <input
            type="date"
            value={profile.birthDate}
            onChange={(e) => setProfile(p => ({ ...p, birthDate: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              Stadt (optional)
            </span>
          </label>
          <input
            type="text"
            value={profile.city}
            onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Wo wohnst du?"
          />
        </div>

        {/* Occupation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-400" />
              Beruf (optional)
            </span>
          </label>
          <input
            type="text"
            value={profile.occupation}
            onChange={(e) => setProfile(p => ({ ...p, occupation: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Was machst du beruflich?"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-5 h-5" />
        Weiter
      </button>
    </div>
  );
};

export default ProfileStep;
