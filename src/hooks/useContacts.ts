import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Contact, SocialActivity } from '@/types/contacts';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { toast } from '@/components/ui/use-toast';

export function useContacts() {
  const { user } = useAuth();
  const { subscribe } = useRealtime();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mapContact = (c: any): Contact => ({
    id: c.id, name: c.name, email: c.email, phone: c.phone, avatar: c.avatar,
    company: c.company, position: c.position,
    socialProfiles: c.social_profiles || [],
    activities: (c.social_activities || []).map((a: any) => ({
      id: a.id, contactId: c.id, platform: a.platform, type: a.activity_type,
      content: a.content, mediaUrl: a.media_url, timestamp: new Date(a.timestamp),
      engagement: a.engagement
    })),
    lastActivity: c.last_activity ? new Date(c.last_activity) : undefined,
    tags: c.tags || [], notes: c.notes, isFavorite: c.is_favorite
  });

  const fetchContacts = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('contacts')
        .select('*, social_profiles(*), social_activities(*)')
        .eq('user_id', user.id)
        .order('name');
      if (fetchError) throw fetchError;
      setContacts((data || []).map(mapContact));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  // Subscribe to realtime updates
  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type !== 'contact') return;
      
      switch (event.action) {
        case 'insert':
          setContacts(prev => {
            if (prev.some(c => c.id === event.data.id)) return prev;
            toast({ title: 'Neuer Kontakt', description: event.data.name, duration: 3000 });
            return [...prev, { ...event.data, socialProfiles: [], activities: [], tags: event.data.tags || [] }];
          });
          break;
        case 'update':
          setContacts(prev => prev.map(c => c.id === event.data.id 
            ? { ...c, ...event.data, tags: event.data.tags || c.tags } : c));
          break;
        case 'delete':
          setContacts(prev => prev.filter(c => c.id !== event.data.id));
          break;
      }
    });
    return unsubscribe;
  }, [subscribe]);

  const addContact = async (contact: Omit<Contact, 'id' | 'activities'>) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      const { data, error: insertError } = await supabase.from('contacts').insert({
        user_id: user.id, name: contact.name, email: contact.email, phone: contact.phone,
        avatar: contact.avatar, company: contact.company, position: contact.position,
        tags: contact.tags, notes: contact.notes, is_favorite: contact.isFavorite || false
      }).select().single();
      if (insertError) throw insertError;
      return { success: true, data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      const { error: updateError } = await supabase.from('contacts').update({
        name: updates.name, email: updates.email, phone: updates.phone, avatar: updates.avatar,
        company: updates.company, position: updates.position,
        tags: updates.tags, notes: updates.notes, is_favorite: updates.isFavorite
      }).eq('id', id).eq('user_id', user.id);
      if (updateError) throw updateError;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const deleteContact = async (id: string) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      const { error: deleteError } = await supabase.from('contacts').delete().eq('id', id).eq('user_id', user.id);
      if (deleteError) throw deleteError;
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const toggleFavorite = async (id: string) => {
    const contact = contacts.find(c => c.id === id);
    if (contact) return updateContact(id, { isFavorite: !contact.isFavorite });
    return { success: false, error: 'Kontakt nicht gefunden' };
  };

  return { contacts, loading, error, addContact, updateContact, deleteContact, toggleFavorite, refreshContacts: fetchContacts };
}
