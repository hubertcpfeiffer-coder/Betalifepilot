import React from 'react';
import { User, MapPin, Phone, Heart, Calendar, Globe } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const KnowledgeBoxPersonal: React.FC<Props> = ({ profile, onChange }) => {
  const genderOptions = ['Männlich', 'Weiblich', 'Divers', 'Keine Angabe'];
  const relationshipOptions = ['Single', 'In einer Beziehung', 'Verheiratet', 'Verlobt', 'Geschieden', 'Verwitwet', 'Keine Angabe'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Persönliche Daten</h3>
          <p className="text-sm text-gray-500">Grundlegende Informationen über dich</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spitzname</label>
          <input type="text" value={profile.nickname || ''} onChange={(e) => onChange({ nickname: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="Wie soll Mio dich nennen?" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Geburtsdatum</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="date" value={profile.birth_date || ''} onChange={(e) => onChange({ birth_date: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Geschlecht</label>
          <select value={profile.gender || ''} onChange={(e) => onChange({ gender: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500">
            <option value="">Auswählen...</option>
            {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Beziehungsstatus</label>
          <select value={profile.relationship_status || ''} onChange={(e) => onChange({ relationship_status: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500">
            <option value="">Auswählen...</option>
            {relationshipOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stadt</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={profile.city || ''} onChange={(e) => onChange({ city: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
              placeholder="Berlin" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Land</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={profile.country || ''} onChange={(e) => onChange({ country: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
              placeholder="Deutschland" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="tel" value={profile.phone || ''} onChange={(e) => onChange({ phone: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500"
            placeholder="+49 123 456789" />
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBoxPersonal;
