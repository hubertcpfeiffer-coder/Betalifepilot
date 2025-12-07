import React, { useState, useMemo, useEffect } from 'react';
import { Contact, SocialPlatform } from '@/types/contacts';
import { useContacts } from '@/hooks/useContacts';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { mockContacts } from '@/data/mockContacts';
import { mockActivities } from '@/data/mockActivities';
import ContactCard from './ContactCard';
import ContactDetail from './ContactDetail';
import PlatformIcon from './PlatformIcon';
import { Search, X, Users, Star, Plus, Loader2, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trackOnboardingAction } from '@/services/onboardingService';
import { useToast } from '@/hooks/use-toast';

interface ContactsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactsPanel: React.FC<ContactsPanelProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { contacts: dbContacts, loading, addContact, toggleFavorite } = useContacts();
  const { connectionStatus, lastEvent } = useRealtime();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', email: '', phone: '', company: '' });
  const [realtimePulse, setRealtimePulse] = useState(false);
  const [hasTrackedContact, setHasTrackedContact] = useState(false);

  // Show pulse animation when realtime contact event occurs
  useEffect(() => {
    if (lastEvent?.type === 'contact') {
      setRealtimePulse(true);
      setTimeout(() => setRealtimePulse(false), 1000);
    }
  }, [lastEvent]);

  // Use database contacts if logged in, otherwise use mock data
  const contacts = useMemo(() => {
    if (user && dbContacts.length > 0) return dbContacts;
    return mockContacts.map(c => ({ ...c, activities: mockActivities.filter(a => a.contactId === c.id) }));
  }, [user, dbContacts]);

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = !showFavorites || contact.isFavorite;
      const matchesPlatform = !platformFilter || contact.socialProfiles.some(p => p.platform === platformFilter);
      return matchesSearch && matchesFavorite && matchesPlatform;
    });
  }, [contacts, searchQuery, showFavorites, platformFilter]);

  const handleAddContact = async () => {
    if (!newContact.name.trim()) return;
    await addContact({ ...newContact, socialProfiles: [], tags: [], isFavorite: false });
    setNewContact({ name: '', email: '', phone: '', company: '' });
    setShowAddForm(false);
    
    // Track first contact for onboarding
    if (user?.id && user.is_beta_tester && !hasTrackedContact) {
      try {
        const result = await trackOnboardingAction(user.id, 'contact_added');
        if (result) {
          setHasTrackedContact(true);
          toast({
            title: 'Onboarding-Schritt abgeschlossen!',
            description: 'Ersten Kontakt hinzugefügt - +50 Punkte!',
          });
        }
      } catch (e) {
        console.error('Error tracking contact:', e);
      }
    }
  };

  const platforms: SocialPlatform[] = ['whatsapp', 'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={cn("w-full max-w-6xl h-[85vh] bg-gray-50 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all", realtimePulse && "ring-4 ring-green-400/50")}>
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold">Kontakte & Aktivitäten</h2>
              {user && connectionStatus === 'connected' && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 rounded-full">
                  <Radio className="w-3 h-3 text-green-300 animate-pulse" />
                  <span className="text-xs">Live</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-300" />
              <input type="text" placeholder="Kontakte durchsuchen..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50" />
            </div>
            {user && <button onClick={() => setShowAddForm(true)} className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 flex items-center gap-2"><Plus className="w-4 h-4" />Neu</button>}
          </div>
        </div>


        <div className="p-3 bg-white border-b flex items-center gap-2 overflow-x-auto">
          <button onClick={() => setShowFavorites(!showFavorites)}
            className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition ${showFavorites ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
            <Star className="w-4 h-4" /> Favoriten
          </button>
          <div className="w-px h-6 bg-gray-200" />
          {platforms.map(p => (
            <button key={p} onClick={() => setPlatformFilter(platformFilter === p ? null : p)}
              className={`p-2 rounded-full transition ${platformFilter === p ? 'bg-indigo-100' : 'bg-gray-100 hover:bg-gray-200'}`}>
              <PlatformIcon platform={p} className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/3 border-r overflow-y-auto p-4 space-y-3">
            {loading ? <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-indigo-600" /></div> : (
              <>
                <p className="text-sm text-gray-500 mb-2">{filteredContacts.length} Kontakte</p>
                {filteredContacts.map(contact => (
                  <ContactCard key={contact.id} contact={contact} onClick={() => setSelectedContact(contact)} isSelected={selectedContact?.id === contact.id} />
                ))}
              </>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedContact ? <ContactDetail contact={selectedContact} activities={selectedContact.activities || []} onClose={() => setSelectedContact(null)} /> : (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center"><Users className="w-16 h-16 mx-auto mb-4 opacity-50" /><p>Wähle einen Kontakt aus</p></div>
              </div>
            )}
          </div>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Neuer Kontakt</h3>
              <div className="space-y-3">
                <input placeholder="Name *" value={newContact.name} onChange={e => setNewContact(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                <input placeholder="E-Mail" value={newContact.email} onChange={e => setNewContact(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                <input placeholder="Telefon" value={newContact.phone} onChange={e => setNewContact(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
                <input placeholder="Firma" value={newContact.company} onChange={e => setNewContact(p => ({ ...p, company: e.target.value }))} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 border rounded-lg">Abbrechen</button>
                <button onClick={handleAddContact} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg">Speichern</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactsPanel;
