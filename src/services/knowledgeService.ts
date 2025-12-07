import { supabase } from '@/lib/supabase';
import { UserKnowledgeProfile } from '@/types/userKnowledge';

// Get knowledge profile for a user
export async function getKnowledgeProfile(userId: string): Promise<UserKnowledgeProfile | null> {
  const { data, error } = await supabase
    .from('user_knowledge_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching knowledge profile:', error);
    return null;
  }
  return data;
}

// Update knowledge profile
export async function updateKnowledgeProfile(
  userId: string,
  updates: Partial<UserKnowledgeProfile>
): Promise<UserKnowledgeProfile | null> {
  const completeness = calculateCompleteness({ ...updates, user_id: userId });
  
  const { data, error } = await supabase
    .from('user_knowledge_profiles')
    .update({
      ...updates,
      completeness_score: completeness,
      last_updated: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating knowledge profile:', error);
    return null;
  }
  return data;
}

// Calculate profile completeness
export function calculateCompleteness(profile: Partial<UserKnowledgeProfile>): number {
  if (!profile) return 0;
  
  const fields = [
    { key: 'nickname', weight: 1 },
    { key: 'birth_date', weight: 1 },
    { key: 'gender', weight: 0.5 },
    { key: 'city', weight: 1 },
    { key: 'country', weight: 0.5 },
    { key: 'occupation', weight: 1 },
    { key: 'company', weight: 0.5 },
    { key: 'hobbies', weight: 1.5 },
    { key: 'interests', weight: 1.5 },
    { key: 'health_goals', weight: 1 },
    { key: 'short_term_goals', weight: 1.5 },
    { key: 'long_term_goals', weight: 1 },
    { key: 'fitness_level', weight: 0.5 },
    { key: 'dietary_preferences', weight: 0.5 },
    { key: 'sleep_schedule', weight: 1 },
    { key: 'family_members', weight: 1 },
    { key: 'morning_routine', weight: 0.5 },
    { key: 'evening_routine', weight: 0.5 }
  ];
  
  let totalWeight = 0;
  let filledWeight = 0;
  
  fields.forEach(field => {
    totalWeight += field.weight;
    const val = (profile as any)[field.key];
    if (val && (Array.isArray(val) ? val.length > 0 : typeof val === 'object' ? Object.keys(val).length > 0 : true)) {
      filledWeight += field.weight;
    }
  });
  
  return Math.round((filledWeight / totalWeight) * 100);
}

// Get profile summary for AI context
export function getProfileSummary(profile: UserKnowledgeProfile): string {
  const parts: string[] = [];
  
  if (profile.nickname) parts.push(`Name: ${profile.nickname}`);
  if (profile.city) parts.push(`Wohnort: ${profile.city}`);
  if (profile.occupation) parts.push(`Beruf: ${profile.occupation}`);
  if (profile.hobbies?.length) parts.push(`Hobbys: ${profile.hobbies.join(', ')}`);
  if (profile.interests?.length) parts.push(`Interessen: ${profile.interests.join(', ')}`);
  if (profile.short_term_goals?.length) parts.push(`Kurzfristige Ziele: ${profile.short_term_goals.join(', ')}`);
  if (profile.long_term_goals?.length) parts.push(`Langfristige Ziele: ${profile.long_term_goals.join(', ')}`);
  if (profile.fitness_level) parts.push(`Fitness: ${profile.fitness_level}`);
  
  return parts.join('\n');
}

// Update specific field
export async function updateProfileField(
  userId: string,
  field: keyof UserKnowledgeProfile,
  value: any
): Promise<boolean> {
  const { error } = await supabase
    .from('user_knowledge_profiles')
    .update({ [field]: value, last_updated: new Date().toISOString() })
    .eq('user_id', userId);
  
  return !error;
}

// Add item to array field
export async function addToArrayField(
  userId: string,
  field: keyof UserKnowledgeProfile,
  item: string
): Promise<boolean> {
  const profile = await getKnowledgeProfile(userId);
  if (!profile) return false;
  
  const currentArray = (profile[field] as string[]) || [];
  if (currentArray.includes(item)) return true;
  
  return updateProfileField(userId, field, [...currentArray, item]);
}

// Remove item from array field
export async function removeFromArrayField(
  userId: string,
  field: keyof UserKnowledgeProfile,
  item: string
): Promise<boolean> {
  const profile = await getKnowledgeProfile(userId);
  if (!profile) return false;
  
  const currentArray = (profile[field] as string[]) || [];
  return updateProfileField(userId, field, currentArray.filter(i => i !== item));
}
