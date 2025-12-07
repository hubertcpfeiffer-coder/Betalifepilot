import React from 'react';
import { Briefcase, Building2, Clock, Wallet } from 'lucide-react';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

interface Props {
  profile: UserKnowledgeProfile;
  onChange: (updates: Partial<UserKnowledgeProfile>) => void;
}

const KnowledgeBoxWork: React.FC<Props> = ({ profile, onChange }) => {
  const scheduleOptions = ['Vollzeit (9-17)', 'Teilzeit', 'Schichtarbeit', 'Freelancer/Flexibel', 'Remote', 'Hybrid', 'Student', 'Rentner', 'Arbeitssuchend'];
  const incomeOptions = ['Unter 30.000€', '30.000€ - 50.000€', '50.000€ - 75.000€', '75.000€ - 100.000€', 'Über 100.000€', 'Keine Angabe'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Berufliches</h3>
          <p className="text-sm text-gray-500">Deine Arbeit und Karriere</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Beruf / Position</label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={profile.occupation || ''} onChange={(e) => onChange({ occupation: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="z.B. Software Entwickler" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unternehmen</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={profile.company || ''} onChange={(e) => onChange({ company: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
            placeholder="z.B. Tech GmbH" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Arbeitszeit-Modell</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select value={profile.work_schedule || ''} onChange={(e) => onChange({ work_schedule: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 appearance-none">
            <option value="">Auswählen...</option>
            {scheduleOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Einkommensbereich (optional)</label>
        <div className="relative">
          <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select value={profile.income_range || ''} onChange={(e) => onChange({ income_range: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 appearance-none">
            <option value="">Auswählen...</option>
            {incomeOptions.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <p className="text-xs text-gray-500 mt-1">Hilft Mio bei Budget- und Finanzempfehlungen</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Arbeitsroutine</label>
        <textarea value={profile.work_routine || ''} onChange={(e) => onChange({ work_routine: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3} placeholder="Beschreibe deinen typischen Arbeitstag..." />
      </div>
    </div>
  );
};

export default KnowledgeBoxWork;
