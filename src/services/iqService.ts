import { supabase } from '@/lib/supabase';
import { IQProfile, IQTestResult } from '@/types/iqTests';

// Get IQ profile for a user
export async function getIQProfile(userId: string): Promise<IQProfile | null> {
  const { data, error } = await supabase
    .from('iq_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching IQ profile:', error);
    return null;
  }
  return data;
}

// Get all IQ test results for a user
export async function getIQTestResults(userId: string): Promise<IQTestResult[]> {
  const { data, error } = await supabase
    .from('iq_test_results')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching IQ test results:', error);
    return [];
  }
  return data || [];
}

// Save a new IQ test result
export async function saveIQTestResult(result: Omit<IQTestResult, 'id'>): Promise<IQTestResult | null> {
  const { data, error } = await supabase
    .from('iq_test_results')
    .insert(result)
    .select()
    .single();
  
  if (error) {
    console.error('Error saving IQ test result:', error);
    return null;
  }
  
  // Update the IQ profile with new scores
  await updateIQProfileFromResult(result);
  
  return data;
}

// Update IQ profile based on test results
async function updateIQProfileFromResult(result: Omit<IQTestResult, 'id'>) {
  const { data: profile } = await supabase
    .from('iq_profiles')
    .select('*')
    .eq('user_id', result.user_id)
    .single();
  
  if (!profile) return;
  
  const categoryMap: Record<string, keyof IQProfile> = {
    'logical': 'logical_thinking',
    'verbal': 'verbal_intelligence',
    'math': 'mathematical_ability',
    'spatial': 'spatial_reasoning',
    'emotional': 'emotional_intelligence',
    'creativity': 'creativity',
    'memory': 'memory',
    'knowledge': 'general_knowledge'
  };
  
  const field = categoryMap[result.test_category];
  if (!field) return;
  
  const currentScore = (profile[field] as number) || 0;
  const newScore = Math.round((currentScore + result.percentage) / 2);
  
  await supabase
    .from('iq_profiles')
    .update({
      [field]: newScore,
      total_tests_taken: (profile.total_tests_taken || 0) + 1,
      last_test_at: new Date().toISOString()
    })
    .eq('user_id', result.user_id);
}

// Calculate overall IQ estimate
export function calculateOverallIQ(profile: IQProfile): number {
  const scores = [
    profile.logical_thinking,
    profile.verbal_intelligence,
    profile.mathematical_ability,
    profile.spatial_reasoning,
    profile.emotional_intelligence,
    profile.creativity,
    profile.memory,
    profile.general_knowledge
  ].filter(s => s > 0);
  
  if (scores.length === 0) return 0;
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return Math.round(70 + (avg / 100) * 60);
}

// Get strengths and weaknesses
export function analyzeProfile(profile: IQProfile): { strengths: string[]; weaknesses: string[] } {
  const abilities = [
    { name: 'Logisches Denken', score: profile.logical_thinking },
    { name: 'Sprachliche Intelligenz', score: profile.verbal_intelligence },
    { name: 'Mathematische Fähigkeit', score: profile.mathematical_ability },
    { name: 'Räumliches Denken', score: profile.spatial_reasoning },
    { name: 'Emotionale Intelligenz', score: profile.emotional_intelligence },
    { name: 'Kreativität', score: profile.creativity },
    { name: 'Gedächtnis', score: profile.memory },
    { name: 'Allgemeinwissen', score: profile.general_knowledge }
  ].filter(a => a.score > 0);
  
  return {
    strengths: abilities.filter(a => a.score >= 70).map(a => a.name),
    weaknesses: abilities.filter(a => a.score < 50).map(a => a.name)
  };
}
