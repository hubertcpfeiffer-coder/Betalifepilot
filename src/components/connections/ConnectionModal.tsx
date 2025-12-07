import React, { useState } from 'react';
import { X, Check, Sparkles, Loader2, Plus } from 'lucide-react';
import { ConnectionService, emailServices, calendarServices, socialServices, contactServices, shoppingServices } from './ConnectionTypes';
import ServiceIcon from './ServiceIcon';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  category: 'email' | 'calendar' | 'social' | 'contacts' | 'shopping' | null;
  onConnect: (serviceId: string) => void;
}

const ConnectionModal: React.FC<Props> = ({ isOpen, onClose, category, onConnect }) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);
  const [showCustom, setShowCustom] = useState(false);
  const [customService, setCustomService] = useState('');
  const [aiProcessing, setAiProcessing] = useState(false);

  if (!isOpen || !category) return null;

  const serviceMap = { email: emailServices, calendar: calendarServices, social: socialServices, contacts: contactServices, shopping: shoppingServices };
  const titleMap = { email: 'E-Mail Dienste', calendar: 'Kalender Dienste', social: 'Social Media', contacts: 'Kontakte Dienste', shopping: 'Shopping & Kundenkarten' };
  const services = serviceMap[category];
  const title = titleMap[category];

  const handleConnect = async (service: ConnectionService) => {
    setConnecting(service.id);
    await new Promise(r => setTimeout(r, 1500));
    setConnected(prev => [...prev, service.id]);
    setConnecting(null);
    onConnect(service.id);
  };

  const handleCustomConnect = async () => {
    if (!customService.trim()) return;
    setAiProcessing(true);
    await new Promise(r => setTimeout(r, 2500));
    setAiProcessing(false);
    setShowCustom(false);
    setCustomService('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">{title} verbinden</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-lg"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          <div className="grid gap-3">
            {services.map(service => (
              <button key={service.id} onClick={() => handleConnect(service)} disabled={connecting !== null || connected.includes(service.id)}
                className="flex items-center gap-4 p-4 rounded-xl border-2 hover:border-cyan-400 hover:bg-cyan-50 transition-all disabled:opacity-50">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: service.color + '20' }}>
                  <ServiceIcon service={service.icon} className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                {connecting === service.id ? <Loader2 className="w-5 h-5 animate-spin text-cyan-500" /> :
                 connected.includes(service.id) ? <Check className="w-5 h-5 text-green-500" /> : null}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50">
          {!showCustom ? (
            <button onClick={() => setShowCustom(true)} className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90">
              <Sparkles className="w-5 h-5" /><Plus className="w-4 h-4" /> Neue Verbindung mit Mio erstellen
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Beschreibe den Dienst, den du verbinden möchtest:</p>
              <input type="text" value={customService} onChange={e => setCustomService(e.target.value)} placeholder="z.B. Mein Firmen-Adressbuch..."
                className="w-full px-4 py-3 rounded-xl border-2 focus:border-purple-400 outline-none" />
              <div className="flex gap-2">
                <button onClick={() => setShowCustom(false)} className="flex-1 py-2 rounded-lg border hover:bg-gray-100">Abbrechen</button>
                <button onClick={handleCustomConnect} disabled={aiProcessing} className="flex-1 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 flex items-center justify-center gap-2">
                  {aiProcessing ? <><Loader2 className="w-4 h-4 animate-spin" /> Mio arbeitet...</> : <><Sparkles className="w-4 h-4" /> Erstellen</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
