import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { UserKnowledgeProfile } from '@/types/userKnowledge';
import { useAuth } from '@/contexts/AuthContext';

export function useUserKnowledge() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserKnowledgeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('user_knowledge_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      setProfile(data ? { ...data, user_id: user.id } : { user_id: user.id });
    } catch (e: any) {
      console.error('Error fetching profile:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const saveProfile = async (updates: Partial<UserKnowledgeProfile>) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      setSaving(true);
      setError(null);
      const completeness = calculateCompleteness({ ...profile, ...updates });
      const dataToSave = { ...updates, user_id: user.id, completeness_score: completeness, updated_at: new Date().toISOString() };

      const { data: existing } = await supabase.from('user_knowledge_profiles').select('id').eq('user_id', user.id).maybeSingle();

      let result;
      if (existing) {
        result = await supabase.from('user_knowledge_profiles').update(dataToSave).eq('user_id', user.id).select().single();
      } else {
        result = await supabase.from('user_knowledge_profiles').insert({ ...dataToSave, created_at: new Date().toISOString() }).select().single();
      }

      if (result.error) throw result.error;
      setProfile(result.data);
      return { success: true };
    } catch (e: any) {
      setError(e.message);
      return { success: false, error: e.message };
    } finally {
      setSaving(false);
    }
  };

  return { profile, loading, saving, error, saveProfile, refreshProfile: fetchProfile };
}

function calculateCompleteness(profile: Partial<UserKnowledgeProfile> | null): number {
  if (!profile) return 0;
  const fields = ['nickname','birth_date','gender','city','occupation','hobbies','interests','health_goals','short_term_goals','long_term_goals'];
  const filled = fields.filter(f => {
    const val = (profile as any)[f];
    return val && (Array.isArray(val) ? val.length > 0 : true);
  });
  return Math.round((filled.length / fields.length) * 100);
}
