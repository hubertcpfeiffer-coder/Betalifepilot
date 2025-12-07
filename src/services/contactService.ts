import { supabase } from '@/lib/supabase';
import { Contact, SocialProfile, SocialActivity } from '@/types/contacts';

// Get all contacts for a user
export async function getContacts(userId: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select(`
      *,
      social_profiles (*),
      social_activities (*)
    `)
    .eq('user_id', userId)
    .order('name');
  
  if (error) {
    console.error('Error fetching contacts:', error);
    return [];
  }
  
  return (data || []).map(contact => ({
    ...contact,
    socialProfiles: contact.social_profiles || [],
    activities: contact.social_activities || []
  }));
}

// Create a new contact
export async function createContact(userId: string, contact: Partial<Contact>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .insert({
      user_id: userId,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      avatar: contact.avatar,
      company: contact.company,
      position: contact.position,
      tags: contact.tags || [],
      notes: contact.notes,
      is_favorite: contact.isFavorite || false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating contact:', error);
    return null;
  }
  return { ...data, socialProfiles: [], activities: [] };
}

// Update a contact
export async function updateContact(contactId: string, updates: Partial<Contact>): Promise<Contact | null> {
  const { data, error } = await supabase
    .from('contacts')
    .update({
      name: updates.name,
      email: updates.email,
      phone: updates.phone,
      avatar: updates.avatar,
      company: updates.company,
      position: updates.position,
      tags: updates.tags,
      notes: updates.notes,
      is_favorite: updates.isFavorite
    })
    .eq('id', contactId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating contact:', error);
    return null;
  }
  return data;
}

// Delete a contact
export async function deleteContact(contactId: string): Promise<boolean> {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId);
  
  if (error) {
    console.error('Error deleting contact:', error);
    return false;
  }
  return true;
}

// Toggle favorite status
export async function toggleFavorite(contactId: string, isFavorite: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('contacts')
    .update({ is_favorite: isFavorite })
    .eq('id', contactId);
  
  return !error;
}

// Add social profile to contact
export async function addSocialProfile(contactId: string, profile: Partial<SocialProfile>): Promise<SocialProfile | null> {
  const { data, error } = await supabase
    .from('social_profiles')
    .insert({
      contact_id: contactId,
      platform: profile.platform,
      username: profile.username,
      profile_url: profile.profileUrl,
      connected: profile.connected || false
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding social profile:', error);
    return null;
  }
  return data;
}

// Search contacts
export async function searchContacts(userId: string, query: string): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId)
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`);
  
  if (error) return [];
  return data || [];
}
