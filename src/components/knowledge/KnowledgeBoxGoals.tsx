import React, { useState } from 'react';
import { Target, Rocket, Star, Plus, X } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const GoalInput: React.FC<{ goals: string[]; onChange: (goals: string[]) => void; placeholder: string; icon: React.ReactNode; color: string }> = 
  ({ goals, onChange, placeholder, icon, color }) => {
  const [input, setInput] = useState('');
  const addGoal = () => {
    if (input.trim() && !goals.includes(input.trim())) { onChange([...goals, input.trim()]); setInput(''); }
  };

  return (
    <div className="space-y-3">
      {goals.map((goal, i) => (
        <div key={i} className={`flex items-center gap-3 p-3 ${color} rounded-xl`}>
          <div className="w-6 h-6 bg-white/50 rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</div>
          <span className="flex-1 text-sm">{goal}</span>
          <button onClick={() => onChange(goals.filter((_, idx) => idx !== i))} className="hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          placeholder={placeholder} />
        <button onClick={addGoal} className="px-4 py-2.5 bg-amber-500 text-white rounded-xl hover:bg-amber-600 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Hinzufügen
        </button>
      </div>
    </div>
  );
};

const KnowledgeBoxGoals: React.FC<Props> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
          <Target className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Ziele & Träume</h3>
          <p className="text-sm text-gray-500">Woran Mio dich erinnern soll</p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Target className="w-4 h-4 text-amber-500" /> Kurzfristige Ziele (nächste Monate)
        </label>
        <GoalInput goals={profile.short_term_goals || []} onChange={(short_term_goals) => onChange({ short_term_goals })}
          placeholder="z.B. 5kg abnehmen, Neuen Job finden..." icon={<Target />} color="bg-amber-50 text-amber-800" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Rocket className="w-4 h-4 text-purple-500" /> Langfristige Ziele (1-5 Jahre)
        </label>
        <GoalInput goals={profile.long_term_goals || []} onChange={(long_term_goals) => onChange({ long_term_goals })}
          placeholder="z.B. Haus kaufen, Beförderung..." icon={<Rocket />} color="bg-purple-50 text-purple-800" />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Star className="w-4 h-4 text-pink-500" /> Lebensträume
        </label>
        <GoalInput goals={profile.life_dreams || []} onChange={(life_dreams) => onChange({ life_dreams })}
          placeholder="z.B. Weltreise, Eigenes Unternehmen..." icon={<Star />} color="bg-pink-50 text-pink-800" />
      </div>

      <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
        <p className="text-sm text-amber-800">
          <strong>Tipp:</strong> Mio wird dich regelmäßig an deine Ziele erinnern und dir helfen, 
          Fortschritte zu machen. Je konkreter deine Ziele, desto besser kann Mio dich unterstützen!
        </p>
      </div>
    </div>
  );
};

export default KnowledgeBoxGoals;
