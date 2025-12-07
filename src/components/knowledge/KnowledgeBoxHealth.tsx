import React, { useState } from 'react';
import { Activity, Moon, Utensils, AlertTriangle, Target, Plus, X } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const TagInput: React.FC<{ tags: string[]; onChange: (tags: string[]) => void; placeholder: string; color: string }> = 
  ({ tags, onChange, placeholder, color }) => {
  const [input, setInput] = useState('');
  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) { onChange([...tags, input.trim()]); setInput(''); }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, i) => (
          <span key={i} className={`px-3 py-1 ${color} rounded-full text-sm flex items-center gap-1`}>
            {tag}<button onClick={() => onChange(tags.filter((_, idx) => idx !== i))}><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500" placeholder={placeholder} />
        <button onClick={addTag} className="px-3 py-2 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-200">
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const KnowledgeBoxHealth: React.FC<Props> = ({ profile, onChange }) => {
  const fitnessLevels = ['Anfänger', 'Gelegentlich aktiv', 'Regelmäßig aktiv', 'Sehr aktiv', 'Athlet'];
  const dietaryOptions = ['Vegetarisch', 'Vegan', 'Pescetarisch', 'Glutenfrei', 'Laktosefrei', 'Low-Carb', 'Keto', 'Halal', 'Koscher'];
  const sleepSchedule = profile.sleep_schedule || { bedtime: '23:00', wakeTime: '07:00', hoursNeeded: 8 };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Gesundheit & Lifestyle</h3>
          <p className="text-sm text-gray-500">Für personalisierte Empfehlungen</p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Activity className="w-4 h-4 text-emerald-500" /> Fitness-Level
        </label>
        <select value={profile.fitness_level || ''} onChange={(e) => onChange({ fitness_level: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500">
          <option value="">Auswählen...</option>
          {fitnessLevels.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Moon className="w-4 h-4 text-indigo-500" /> Schlafgewohnheiten
        </label>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <span className="text-xs text-gray-500">Schlafenszeit</span>
            <input type="time" value={sleepSchedule.bedtime}
              onChange={(e) => onChange({ sleep_schedule: { ...sleepSchedule, bedtime: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <span className="text-xs text-gray-500">Aufwachzeit</span>
            <input type="time" value={sleepSchedule.wakeTime}
              onChange={(e) => onChange({ sleep_schedule: { ...sleepSchedule, wakeTime: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <span className="text-xs text-gray-500">Stunden</span>
            <input type="number" min={4} max={12} value={sleepSchedule.hoursNeeded}
              onChange={(e) => onChange({ sleep_schedule: { ...sleepSchedule, hoursNeeded: parseInt(e.target.value) } })}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Utensils className="w-4 h-4 text-orange-500" /> Ernährungspräferenzen
        </label>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map(d => (
            <button key={d} onClick={() => {
              const current = profile.dietary_preferences || [];
              onChange({ dietary_preferences: current.includes(d) ? current.filter(x => x !== d) : [...current, d] });
            }} className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              (profile.dietary_preferences || []).includes(d) ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{d}</button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <AlertTriangle className="w-4 h-4 text-red-500" /> Allergien & Unverträglichkeiten
        </label>
        <TagInput tags={profile.allergies || []} onChange={(allergies) => onChange({ allergies })}
          placeholder="z.B. Nüsse, Milch..." color="bg-red-100 text-red-700" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Target className="w-4 h-4 text-teal-500" /> Gesundheitsziele
        </label>
        <TagInput tags={profile.health_goals || []} onChange={(health_goals) => onChange({ health_goals })}
          placeholder="z.B. Abnehmen, Mehr Bewegung..." color="bg-teal-100 text-teal-700" />
      </div>
    </div>
  );
};

export default KnowledgeBoxHealth;
