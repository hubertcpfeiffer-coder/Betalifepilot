import React from 'react';
import { Clock, Sun, Moon, Briefcase } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const KnowledgeBoxRoutines: React.FC<Props> = ({ profile, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Tägliche Routinen</h3>
          <p className="text-sm text-gray-500">Hilft Mio, dich besser zu unterstützen</p>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Sun className="w-4 h-4 text-amber-500" /> Morgenroutine
        </label>
        <textarea value={profile.morning_routine || ''} onChange={(e) => onChange({ morning_routine: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4} placeholder="Beschreibe deinen typischen Morgen...&#10;z.B. 6:30 Aufstehen, Meditation, Frühstück, Sport..." />
        <p className="text-xs text-gray-500 mt-1">Mio kann dich an wichtige Morgenaktivitäten erinnern</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Briefcase className="w-4 h-4 text-blue-500" /> Arbeitsroutine
        </label>
        <textarea value={profile.work_routine || ''} onChange={(e) => onChange({ work_routine: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4} placeholder="Wie sieht dein Arbeitstag aus?&#10;z.B. 9:00 Start, Mittagspause 12-13 Uhr, Meetings nachmittags..." />
        <p className="text-xs text-gray-500 mt-1">Hilft Mio, Termine und Pausen optimal zu planen</p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Moon className="w-4 h-4 text-indigo-500" /> Abendroutine
        </label>
        <textarea value={profile.evening_routine || ''} onChange={(e) => onChange({ evening_routine: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none"
          rows={4} placeholder="Wie verbringst du deine Abende?&#10;z.B. 18:00 Feierabend, Kochen, Familie, Lesen, 23:00 Schlafen..." />
        <p className="text-xs text-gray-500 mt-1">Mio kann Abend-Erinnerungen und Schlafenszeit-Hinweise geben</p>
      </div>

      <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-200">
        <h4 className="font-medium text-indigo-800 mb-2">Warum Routinen wichtig sind</h4>
        <ul className="text-sm text-indigo-700 space-y-1">
          <li>• Mio lernt, wann du am produktivsten bist</li>
          <li>• Bessere Terminvorschläge basierend auf deinem Rhythmus</li>
          <li>• Personalisierte Erinnerungen zur richtigen Zeit</li>
          <li>• Unterstützung bei der Bildung neuer Gewohnheiten</li>
        </ul>
      </div>
    </div>
  );
};

export default KnowledgeBoxRoutines;
