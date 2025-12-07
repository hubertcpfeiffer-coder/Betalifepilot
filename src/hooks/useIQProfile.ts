import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { IQProfile, IQTestResult } from '@/types/iqTests';
import { useAuth } from '@/contexts/AuthContext';

export function useIQProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<IQProfile | null>(null);
  const [testHistory, setTestHistory] = useState<IQTestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      setLoading(true);
      const [profileRes, testsRes] = await Promise.all([
        supabase.from('iq_profiles').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('iq_test_results').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(50)
      ]);

      if (profileRes.error) throw profileRes.error;
      if (testsRes.error) throw testsRes.error;

      setProfile(profileRes.data || createDefaultProfile(user.id));
      setTestHistory(testsRes.data || []);
    } catch (e: any) {
      console.error('Error fetching IQ data:', e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const saveTestResult = async (result: Omit<IQTestResult, 'id' | 'user_id'>) => {
    if (!user?.id) return { success: false, error: 'Nicht angemeldet' };
    try {
      const testData = { ...result, user_id: user.id, completed_at: new Date().toISOString() };
      const { data, error: insertError } = await supabase.from('iq_test_results').insert(testData).select().single();
      if (insertError) throw insertError;

      setTestHistory(prev => [data, ...prev]);
      await updateProfile(result.test_category, result.percentage);
      return { success: true, data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  };

  const updateProfile = async (category: string, score: number) => {
    if (!user?.id) return;
    const categoryMap: Record<string, keyof IQProfile> = {
      logical: 'logical_thinking', verbal: 'verbal_intelligence', math: 'mathematical_ability',
      spatial: 'spatial_reasoning', emotional: 'emotional_intelligence', creativity: 'creativity',
      memory: 'memory', knowledge: 'general_knowledge'
    };
    const field = categoryMap[category];
    if (!field) return;

    const currentProfile = profile || createDefaultProfile(user.id);
    const newProfile = { ...currentProfile, [field]: Math.round(score), total_tests_taken: (currentProfile.total_tests_taken || 0) + 1, last_test_at: new Date().toISOString() };
    newProfile.overall_iq_estimate = calculateOverallIQ(newProfile);
    newProfile.strengths = calculateStrengths(newProfile);
    newProfile.areas_to_improve = calculateWeaknesses(newProfile);

    const { data: existing } = await supabase.from('iq_profiles').select('id').eq('user_id', user.id).maybeSingle();
    if (existing) {
      await supabase.from('iq_profiles').update(newProfile).eq('user_id', user.id);
    } else {
      await supabase.from('iq_profiles').insert(newProfile);
    }
    setProfile(newProfile);
  };

  return { profile, testHistory, loading, error, saveTestResult, refreshData: fetchData };
}

function createDefaultProfile(userId: string): IQProfile {
  return { user_id: userId, logical_thinking: 0, verbal_intelligence: 0, mathematical_ability: 0, spatial_reasoning: 0, emotional_intelligence: 0, creativity: 0, memory: 0, general_knowledge: 0, total_tests_taken: 0 };
}

function calculateOverallIQ(p: IQProfile): number {
  const scores = [p.logical_thinking, p.verbal_intelligence, p.mathematical_ability, p.spatial_reasoning, p.emotional_intelligence, p.creativity, p.memory, p.general_knowledge].filter(s => s > 0);
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(70 + (avg / 100) * 60);
}

function calculateStrengths(p: IQProfile): string[] {
  const categories = [{ name: 'Logisches Denken', score: p.logical_thinking }, { name: 'Sprachliche Intelligenz', score: p.verbal_intelligence }, { name: 'Mathematik', score: p.mathematical_ability }, { name: 'Räumliches Denken', score: p.spatial_reasoning }, { name: 'Emotionale Intelligenz', score: p.emotional_intelligence }, { name: 'Kreativität', score: p.creativity }, { name: 'Gedächtnis', score: p.memory }, { name: 'Allgemeinwissen', score: p.general_knowledge }];
  return categories.filter(c => c.score >= 70).sort((a, b) => b.score - a.score).slice(0, 3).map(c => c.name);
}

function calculateWeaknesses(p: IQProfile): string[] {
  const categories = [{ name: 'Logisches Denken', score: p.logical_thinking }, { name: 'Sprachliche Intelligenz', score: p.verbal_intelligence }, { name: 'Mathematik', score: p.mathematical_ability }, { name: 'Räumliches Denken', score: p.spatial_reasoning }, { name: 'Emotionale Intelligenz', score: p.emotional_intelligence }, { name: 'Kreativität', score: p.creativity }, { name: 'Gedächtnis', score: p.memory }, { name: 'Allgemeinwissen', score: p.general_knowledge }];
  return categories.filter(c => c.score > 0 && c.score < 50).sort((a, b) => a.score - b.score).slice(0, 3).map(c => c.name);
}
