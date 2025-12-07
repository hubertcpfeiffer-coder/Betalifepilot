import { supabase } from '@/lib/supabase';
import { UserKnowledgeProfile } from '@/types/userKnowledge';
import { IQProfile } from '@/types/iqTests';

export async function loadAllUserData(userId: string) {
  const results = await Promise.allSettled([
    supabase.from('user_knowledge_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('iq_profiles').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('iq_test_results').select('*').eq('user_id', userId).order('completed_at', { ascending: false }),
    supabase.from('contacts').select('*').eq('user_id', userId).order('name'),
    supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
    supabase.from('notifications').select('*').eq('user_id', userId).order('timestamp', { ascending: false })
  ]);

  return {
    knowledgeProfile: results[0].status === 'fulfilled' ? results[0].value.data : null,
    iqProfile: results[1].status === 'fulfilled' ? results[1].value.data : null,
    iqTests: results[2].status === 'fulfilled' ? results[2].value.data || [] : [],
    contacts: results[3].status === 'fulfilled' ? results[3].value.data || [] : [],
    tasks: results[4].status === 'fulfilled' ? results[4].value.data || [] : [],
    notifications: results[5].status === 'fulfilled' ? results[5].value.data || [] : []
  };
}

export async function exportUserDataComplete(userId: string) {
  const [userData, settings, mioProfile, devices, voiceSettings, priceAlerts, reminders, conversations, socialProfiles] = await Promise.all([
    supabase.from('users').select('*').eq('id', userId).single(),
    supabase.from('user_settings').select('*').eq('user_id', userId).single(),
    supabase.from('mio_profiles').select('*').eq('user_id', userId).single(),
    supabase.from('user_devices').select('*').eq('user_id', userId),
    supabase.from('voice_settings').select('*').eq('user_id', userId).single(),
    supabase.from('price_alerts').select('*').eq('user_id', userId),
    supabase.from('reminders').select('*').eq('user_id', userId),
    supabase.from('ai_conversations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(100),
    supabase.from('social_profiles').select('*').eq('user_id', userId)
  ]);

  const coreData = await loadAllUserData(userId);

  const exportData = {
    _meta: { exportedAt: new Date().toISOString(), version: '1.0', userId, format: 'GDPR-compliant' },
    profile: { user: userData.data, settings: settings.data, mioProfile: mioProfile.data, voiceSettings: voiceSettings.data },
    knowledge: { profile: coreData.knowledgeProfile, iqProfile: coreData.iqProfile, iqTests: coreData.iqTests },
    personal: { contacts: coreData.contacts, socialProfiles: socialProfiles.data || [], tasks: coreData.tasks, reminders: reminders.data || [] },
    activity: { notifications: coreData.notifications, conversations: conversations.data || [], priceAlerts: priceAlerts.data || [] },
    security: { devices: devices.data || [] }
  };

  return exportData;
}

export function downloadAsJSON(data: any, filename: string) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function deleteAllUserData(userId: string): Promise<boolean> {
  try {
    // Delete in order respecting foreign key constraints
    const tables = [
      'ai_conversations', 'reminders', 'voice_settings', 'price_alert_notifications', 
      'price_alerts', 'social_activities', 'social_profiles', 'notification_settings', 
      'notifications', 'iq_test_results', 'iq_profiles', 'user_knowledge_profiles', 
      'contacts', 'tasks', 'device_login_notifications', 'user_devices', 
      'face_recognition_data', 'mio_profiles', 'user_settings', 'user_goals',
      'user_routines', 'health_data', 'user_connections', 'file_uploads',
      'email_verification_tokens'
    ];
    
    for (const table of tables) { 
      await supabase.from(table).delete().eq('user_id', userId); 
    }
    
    // Log the deletion
    await supabase.from('audit_log').insert({ 
      user_id: userId, 
      action: 'account_deleted', 
      entity_type: 'user',
      metadata: { timestamp: new Date().toISOString() } 
    });
    
    // Finally delete the user record
    await supabase.from('users').delete().eq('id', userId);
    
    return true;
  } catch (error) { 
    console.error('Delete error:', error); 
    return false; 
  }
}


export function calculateProfileCompleteness(profile: Partial<UserKnowledgeProfile>): number {
  if (!profile) return 0;
  const fields = ['nickname', 'birth_date', 'gender', 'city', 'occupation', 'hobbies', 'interests', 'health_goals', 'short_term_goals', 'long_term_goals'];
  const filled = fields.filter(f => { const val = (profile as any)[f]; return val && (Array.isArray(val) ? val.length > 0 : true); });
  return Math.round((filled.length / fields.length) * 100);
}

export function calculateIQEstimate(profile: IQProfile): number {
  const scores = [profile.logical_thinking, profile.verbal_intelligence, profile.mathematical_ability, profile.spatial_reasoning, profile.emotional_intelligence].filter(s => s > 0);
  if (scores.length === 0) return 0;
  return Math.round(70 + (scores.reduce((a, b) => a + b, 0) / scores.length / 100) * 60);
}
