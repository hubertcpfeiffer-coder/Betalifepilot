import React, { useState } from 'react';
import { Mail, Calendar, Users, Wallet, Share2, ShoppingCart, Check, Link, Eye, Search, Brain, Sparkles, ListTodo } from 'lucide-react';
import ConnectionModal from '../connections/ConnectionModal';
import PriceComparisonPanel from '../shopping/PriceComparisonPanel';

interface OrganisationFeaturesProps {
  onOpenContacts?: () => void;
  onOpenKnowledge?: () => void;
  onOpenTasks?: () => void;
}

const features = [
  { icon: Mail, title: 'E-Mail', desc: 'Automatische E-Mail-Verwaltung', color: 'cyan', hasModal: true, modalType: 'email' as const, hasView: false, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: Calendar, title: 'Kalender', desc: 'Terminplanung und Erinnerungen', color: 'blue', hasModal: true, modalType: 'calendar' as const, hasView: false, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: ListTodo, title: 'Aufgaben', desc: 'KI-gestützte Aufgabenverwaltung', color: 'green', hasModal: false, modalType: null, hasView: false, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: true },
  { icon: Users, title: 'Kontakte', desc: 'Kontaktverwaltung und Beziehungspflege', color: 'indigo', hasModal: true, modalType: 'contacts' as const, hasView: true, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: Wallet, title: 'Finanzen', desc: 'Ausgaben tracken, Budgets verwalten', color: 'purple', hasModal: false, modalType: null, hasView: false, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: Share2, title: 'Social Media', desc: 'Posts planen, Engagement verwalten', color: 'pink', hasModal: true, modalType: 'social' as const, hasView: false, hasPriceCompare: false, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: ShoppingCart, title: 'Einkaufen', desc: 'REWE, Kaufland, Lidl verbinden', color: 'rose', hasModal: true, modalType: 'shopping' as const, hasView: false, hasPriceCompare: true, hasKnowledge: false, hasIQ: false, hasTasks: false },
  { icon: Brain, title: 'Mios Wissen', desc: 'Dein persönliches Profil für Mio', color: 'violet', hasModal: false, modalType: null, hasView: false, hasPriceCompare: false, hasKnowledge: true, hasIQ: false, hasTasks: false },
];

const colorClasses: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', border: 'border-cyan-200', gradient: 'from-cyan-500 to-cyan-600' },
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200', gradient: 'from-green-500 to-emerald-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', gradient: 'from-indigo-500 to-indigo-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', gradient: 'from-purple-500 to-purple-600' },
  pink: { bg: 'bg-pink-100', text: 'text-pink-600', border: 'border-pink-200', gradient: 'from-pink-500 to-pink-600' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200', gradient: 'from-rose-500 to-rose-600' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', border: 'border-violet-200', gradient: 'from-violet-500 to-purple-600' },
};

const OrganisationFeatures: React.FC<OrganisationFeaturesProps> = ({ onOpenContacts, onOpenKnowledge, onOpenTasks }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState<'email' | 'calendar' | 'social' | 'contacts' | 'shopping' | null>(null);
  const [connectedServices, setConnectedServices] = useState<Record<string, string[]>>({});
  const [priceCompareOpen, setPriceCompareOpen] = useState(false);

  const handleOpenModal = (category: 'email' | 'calendar' | 'social' | 'contacts' | 'shopping') => {
    setModalCategory(category);
    setModalOpen(true);
  };

  const handleConnect = (serviceId: string) => {
    if (modalCategory) {
      setConnectedServices(prev => ({ ...prev, [modalCategory]: [...(prev[modalCategory] || []), serviceId] }));
    }
  };

  const isConnected = (type: string | null) => type && connectedServices[type]?.length > 0;

  return (
    <section id="organisation" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Organisation</span> - Alles automatisiert
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Mio übernimmt alle deine organisatorischen Aufgaben.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const colors = colorClasses[f.color] || colorClasses.cyan;
            const connected = isConnected(f.modalType);
            return (
              <div key={i} className={`p-6 bg-white rounded-2xl border ${colors.border} shadow-lg hover:shadow-xl transition-all group relative`}>
                {connected && <div className="absolute top-3 right-3"><div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-green-600" /></div></div>}
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{f.desc}</p>
                <div className="flex gap-2 flex-wrap">
                  {f.hasModal && f.modalType && (
                    <button onClick={() => handleOpenModal(f.modalType!)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${connected ? 'bg-green-100 text-green-700' : `bg-gradient-to-r ${colors.gradient} text-white hover:opacity-90`}`}>
                      {connected ? <><Check className="w-4 h-4" /> Verbunden</> : <><Link className="w-4 h-4" /> Verbinden</>}
                    </button>
                  )}
                  {f.hasView && <button onClick={onOpenContacts} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center gap-1"><Eye className="w-4 h-4" /> Ansehen</button>}
                  {f.hasPriceCompare && (
                    <button onClick={() => setPriceCompareOpen(true)} className="w-full mt-2 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-orange-500 to-rose-500 text-white hover:opacity-90 flex items-center justify-center gap-2">
                      <Search className="w-4 h-4" /> Preisvergleich
                    </button>
                  )}
                  {f.hasKnowledge && (
                    <button onClick={onOpenKnowledge} className="w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-90 flex items-center justify-center gap-2">
                      <Brain className="w-4 h-4" /> Profil bearbeiten
                    </button>
                  )}
                  {f.hasTasks && (
                    <button onClick={onOpenTasks} className="w-full py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:opacity-90 flex items-center justify-center gap-2">
                      <ListTodo className="w-4 h-4" /> Aufgaben öffnen
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <ConnectionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} category={modalCategory} onConnect={handleConnect} />
      <PriceComparisonPanel isOpen={priceCompareOpen} onClose={() => setPriceCompareOpen(false)} />
    </section>
  );
};

export default OrganisationFeatures;
