import { supabase } from '@/lib/supabase';
import { 
  OnboardingStep, 
  UserOnboardingProgress, 
  OnboardingProgressSummary,
  OnboardingStepStatus
} from '@/types/onboarding';

// Default onboarding steps (used when database table doesn't exist)
const DEFAULT_STEPS: OnboardingStep[] = [
  { id: '1', key: 'welcome', title: 'Willkommen bei Mio', description: 'Lerne deinen persönlichen KI-Assistenten kennen', icon: 'sparkles', order: 1, required: true, reward_points: 10, reward_badge: 'welcome_badge', active: true, category: 'introduction' },
  { id: '2', key: 'profile_setup', title: 'Profil einrichten', description: 'Erzähle uns etwas über dich', icon: 'user', order: 2, required: true, reward_points: 20, reward_badge: 'profile_badge', active: true, category: 'setup' },
  { id: '3', key: 'avatar_photos', title: 'Fotos hochladen', description: 'Lade Fotos für deinen personalisierten Avatar hoch', icon: 'camera', order: 3, required: false, reward_points: 30, reward_badge: 'photo_badge', active: true, category: 'avatar' },
  { id: '4', key: 'avatar_style', title: 'Avatar-Stil wählen', description: 'Wähle den Stil für deinen KI-Avatar', icon: 'palette', order: 4, required: false, reward_points: 25, reward_badge: 'style_badge', active: true, category: 'avatar' },
  { id: '5', key: 'avatar_voice', title: 'Stimme auswählen', description: 'Wähle die Stimme für deinen Avatar', icon: 'mic', order: 5, required: false, reward_points: 20, reward_badge: 'voice_badge', active: true, category: 'avatar' },
  { id: '6', key: 'avatar_personality', title: 'Persönlichkeit definieren', description: 'Definiere die Persönlichkeit deines Avatars', icon: 'heart', order: 6, required: false, reward_points: 25, reward_badge: 'personality_badge', active: true, category: 'avatar' },
  { id: '7', key: 'knowledge_interests', title: 'Interessen angeben', description: 'Teile deine Interessen mit Mio', icon: 'star', order: 7, required: false, reward_points: 15, reward_badge: 'interests_badge', active: true, category: 'knowledge' },
  { id: '8', key: 'knowledge_goals', title: 'Ziele setzen', description: 'Definiere deine persönlichen Ziele', icon: 'target', order: 8, required: false, reward_points: 20, reward_badge: 'goals_badge', active: true, category: 'knowledge' },
  { id: '9', key: 'first_task', title: 'Erste Aufgabe erstellen', description: 'Erstelle deine erste Aufgabe mit Mio', icon: 'check-square', order: 9, required: false, reward_points: 15, reward_badge: 'task_badge', active: true, category: 'features' },
  { id: '10', key: 'voice_test', title: 'Sprachsteuerung testen', description: 'Teste die Sprachsteuerung von Mio', icon: 'volume-2', order: 10, required: false, reward_points: 20, reward_badge: 'voice_control_badge', active: true, category: 'features' },
  { id: '11', key: 'round_table', title: 'Round Table entdecken', description: 'Entdecke die KI-Experten am Round Table', icon: 'users', order: 11, required: false, reward_points: 25, reward_badge: 'round_table_badge', active: true, category: 'features' },
  { id: '12', key: 'completion', title: 'Onboarding abgeschlossen', description: 'Du hast das Onboarding erfolgreich abgeschlossen!', icon: 'award', order: 12, required: true, reward_points: 50, reward_badge: 'completion_badge', active: true, category: 'completion' },
];

// In-memory progress storage (fallback when database not available)
const localProgress: Map<string, Map<string, boolean>> = new Map();

// Get all onboarding steps
export const getOnboardingSteps = async (): Promise<OnboardingStep[]> => {
  try {
    const { data, error } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('onboarding_steps table does not exist, using defaults');
        return DEFAULT_STEPS;
      }
      throw error;
    }
    
    // Map database columns to our interface
    const mappedData = data?.map(step => ({
      ...step,
      order: step.sort_order || step.order
    }));
    
    return mappedData?.length ? mappedData : DEFAULT_STEPS;
  } catch (error) {
    console.error('Error fetching onboarding steps:', error);
    return DEFAULT_STEPS;
  }
};


// Get user's onboarding progress
export const getUserOnboardingProgress = async (userId: string): Promise<UserOnboardingProgress[]> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding_progress')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      if (error.code === '42P01') {
        // Return local progress if available
        const userProgress = localProgress.get(userId);
        if (userProgress) {
          return Array.from(userProgress.entries()).map(([key, completed]) => ({
            id: key,
            user_id: userId,
            step_key: key,
            completed,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
        }
        return [];
      }
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user progress:', error);
    return [];
  }
};

// Get user's earned badges
export const getUserBadges = async (userId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('user_onboarding_rewards')
      .select('badge_id')
      .eq('user_id', userId);
    
    if (error) {
      if (error.code === '42P01') {
        return [];
      }
      throw error;
    }
    
    return data?.map(r => r.badge_id) || [];
  } catch (error) {
    console.error('Error fetching user badges:', error);
    return [];
  }
};

// Get complete onboarding summary for a user
export const getOnboardingSummary = async (userId: string): Promise<OnboardingProgressSummary> => {
  const [steps, progress, badges] = await Promise.all([
    getOnboardingSteps(),
    getUserOnboardingProgress(userId),
    getUserBadges(userId)
  ]);
  
  const progressMap = new Map(progress.map(p => [p.step_key, p]));
  
  const stepsWithStatus: OnboardingStepStatus[] = steps.map(step => ({
    ...step,
    completed: progressMap.get(step.key)?.completed || false,
    completed_at: progressMap.get(step.key)?.completed_at
  }));
  
  const completedSteps = stepsWithStatus.filter(s => s.completed).length;
  const totalPoints = steps.reduce((sum, s) => sum + s.reward_points, 0);
  const earnedPoints = stepsWithStatus
    .filter(s => s.completed)
    .reduce((sum, s) => sum + s.reward_points, 0);
  
  const requiredSteps = steps.filter(s => s.required);
  const completedRequired = stepsWithStatus.filter(s => s.required && s.completed).length;
  const onboardingCompleted = completedRequired === requiredSteps.length;
  
  const completedDates = progress
    .filter(p => p.completed && p.completed_at)
    .map(p => new Date(p.completed_at!).getTime());
  
  return {
    user_id: userId,
    total_steps: steps.length,
    completed_steps: completedSteps,
    progress_percentage: Math.round((completedSteps / steps.length) * 100),
    total_points: totalPoints,
    earned_points: earnedPoints,
    badges,
    steps: stepsWithStatus,
    onboarding_completed: onboardingCompleted,
    started_at: completedDates.length > 0 
      ? new Date(Math.min(...completedDates)).toISOString() 
      : undefined,
    completed_at: onboardingCompleted && completedDates.length > 0
      ? new Date(Math.max(...completedDates)).toISOString()
      : undefined
  };
};

// Complete an onboarding step
export const completeOnboardingStep = async (
  userId: string, 
  stepKey: string,
  metadata?: Record<string, any>
): Promise<{ success: boolean; badge?: string; points?: number }> => {
  try {
    // Get the step info
    const steps = await getOnboardingSteps();
    const step = steps.find(s => s.key === stepKey);
    
    if (!step) {
      return { success: false };
    }
    
    // Try database first
    try {
      // Check if already completed
      const { data: existing } = await supabase
        .from('user_onboarding_progress')
        .select('completed')
        .eq('user_id', userId)
        .eq('step_key', stepKey)
        .single();
      
      if (existing?.completed) {
        return { success: true }; // Already completed
      }
      
      // Upsert progress
      const { error: progressError } = await supabase
        .from('user_onboarding_progress')
        .upsert({
          user_id: userId,
          step_key: stepKey,
          completed: true,
          completed_at: new Date().toISOString(),
          metadata: metadata || {},
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,step_key' });
      
      if (progressError && progressError.code !== '42P01') {
        console.error('Error completing step:', progressError);
      }
    } catch (dbError) {
      console.log('Database update skipped, using local storage');
    }
    
    // Update local progress
    if (!localProgress.has(userId)) {
      localProgress.set(userId, new Map());
    }
    localProgress.get(userId)!.set(stepKey, true);
    
    // Award badge if applicable
    let awardedBadge: string | undefined;
    if (step.reward_badge) {
      try {
        await supabase
          .from('user_onboarding_rewards')
          .upsert({
            user_id: userId,
            badge_id: step.reward_badge,
            earned_at: new Date().toISOString()
          }, { onConflict: 'user_id,badge_id' });
        awardedBadge = step.reward_badge;
      } catch (e) {
        console.log('Badge award skipped');
      }
    }
    
    // Check if all required steps are completed
    const summary = await getOnboardingSummary(userId);
    if (summary.onboarding_completed) {
      try {
        await supabase
          .from('user_onboarding_rewards')
          .upsert({
            user_id: userId,
            badge_id: 'onboarding_champion',
            earned_at: new Date().toISOString()
          }, { onConflict: 'user_id,badge_id' });
        
        await supabase
          .from('users')
          .update({ onboarding_completed: true })
          .eq('id', userId);
      } catch (e) {
        console.log('Champion badge/status update skipped');
      }
    }
    
    return { 
      success: true, 
      badge: awardedBadge,
      points: step.reward_points
    };
  } catch (error) {
    console.error('Error in completeOnboardingStep:', error);
    return { success: true }; // Return success to not block UI
  }
};

// Initialize onboarding for a new user
export const initializeOnboarding = async (userId: string): Promise<void> => {
  try {
    const steps = await getOnboardingSteps();
    
    const progressEntries = steps.map(step => ({
      user_id: userId,
      step_key: step.key,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    await supabase
      .from('user_onboarding_progress')
      .upsert(progressEntries, { onConflict: 'user_id,step_key' });
    
    // Initialize local progress
    localProgress.set(userId, new Map(steps.map(s => [s.key, false])));
  } catch (error) {
    console.log('Onboarding initialization skipped:', error);
    // Initialize local progress anyway
    localProgress.set(userId, new Map(DEFAULT_STEPS.map(s => [s.key, false])));
  }
};

// Admin: Get onboarding overview for all beta testers
export const getAdminOnboardingOverview = async (adminId: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('admin-dashboard', {
      body: { action: 'getOnboardingOverview', adminId }
    });
    
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    
    return data;
  } catch (error) {
    console.error('Error fetching admin overview:', error);
    return {
      total_beta_testers: 0,
      completed_onboarding: 0,
      in_progress: 0,
      average_progress: 0,
      step_completion_rates: [],
      users: []
    };
  }
};

// Track specific actions for automatic step completion
export const trackOnboardingAction = async (
  userId: string,
  action: 'task_created' | 'ai_used' | 'knowledge_added' | 'contact_added' | 'voice_used' | 'round_table' | 'iq_test' | 'profile_completed'
): Promise<{ success: boolean; badge?: string; points?: number } | null> => {
  const actionToStep: Record<string, string> = {
    'profile_completed': 'profile_completed',
    'task_created': 'first_task',
    'ai_used': 'ai_assistant_used',
    'knowledge_added': 'knowledge_added',
    'contact_added': 'contact_added',
    'voice_used': 'voice_command_used',
    'round_table': 'round_table_joined',
    'iq_test': 'iq_test_completed'
  };
  
  const stepKey = actionToStep[action];
  if (stepKey) {
    return await completeOnboardingStep(userId, stepKey, { action, timestamp: new Date().toISOString() });
  }
  return null;
};
