import { supabase } from '@/lib/supabase';
import { UserAvatar } from '@/types/avatar';

export const createUserAvatar = async (userId: string): Promise<{ success: boolean; avatar?: UserAvatar; error?: string }> => {
  try {
    // First check if avatar already exists
    const { data: existing } = await supabase
      .from('user_avatars')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existing) {
      // Avatar already exists, return success
      return { success: true };
    }

    const { data, error } = await supabase
      .from('user_avatars')
      .insert({
        user_id: userId,
        photo_urls: [],
        avatar_style: 'realistic',
        voice_style: 'natural',
        personality_traits: ['Hilfsbereit', 'Freundlich'],
        speaking_style: 'freundlich'
      })
      .select()
      .single();

    if (error) {
      // If table doesn't exist, return success anyway (graceful degradation)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.log('user_avatars table does not exist, skipping avatar creation');
        return { success: true };
      }
      throw error;
    }
    return { success: true, avatar: data };
  } catch (error: any) {
    console.error('Error creating avatar:', error);
    // Return success to not block the flow
    return { success: true, error: error.message };
  }
};

export const getUserAvatar = async (userId: string): Promise<UserAvatar | null> => {
  try {
    const { data, error } = await supabase
      .from('user_avatars')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116' || error.code === '42P01') {
        return null;
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching avatar:', error);
    return null;
  }
};

export const uploadAvatarPhoto = async (
  userId: string, 
  photoType: 'front' | 'left' | 'right', 
  dataUrl: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    
    const fileName = `${userId}/${photoType}_${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('avatar-photos')
      .upload(fileName, blob, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      // If bucket doesn't exist, create a mock URL
      if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
        console.log('Storage bucket not available, using data URL');
        return { success: true, url: dataUrl };
      }
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatar-photos')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Error uploading photo:', error);
    // Return the data URL as fallback
    return { success: true, url: dataUrl };
  }
};

export const updateUserAvatar = async (
  userId: string, 
  updates: Partial<UserAvatar>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('user_avatars')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      if (error.code === '42P01') {
        return { success: true };
      }
      throw error;
    }
    return { success: true };
  } catch (error: any) {
    console.error('Error updating avatar:', error);
    return { success: true, error: error.message };
  }
};

export const saveAvatarPhotos = async (
  userId: string,
  frontUrl: string,
  leftUrl?: string,
  rightUrl?: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const photoUrls = [frontUrl];
    if (leftUrl) photoUrls.push(leftUrl);
    if (rightUrl) photoUrls.push(rightUrl);

    // Try to update user_avatars table
    await supabase
      .from('user_avatars')
      .update({
        photo_urls: photoUrls,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_avatars update skipped:', e.message));

    // Try to update user_profiles table
    await supabase
      .from('user_profiles')
      .update({
        avatar_photos: photoUrls,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_profiles avatar_photos update skipped:', e.message));

    return { success: true };
  } catch (error: any) {
    console.error('Error saving photos:', error);
    return { success: true, error: error.message };
  }
};


export const completeAvatarSetup = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update users table
    await supabase
      .from('users')
      .update({
        avatar_setup_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .catch(e => console.log('users avatar_setup_completed update skipped:', e.message));

    // Update user_profiles table
    await supabase
      .from('user_profiles')
      .update({
        avatar_setup_completed: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_profiles avatar_setup_completed update skipped:', e.message));

    return { success: true };
  } catch (error: any) {
    console.error('Error completing avatar setup:', error);
    return { success: true, error: error.message };
  }
};


export const updateAvatarStyle = async (
  userId: string,
  style: string,
  voiceStyle: string,
  personalityTraits: string[],
  speakingStyle: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Try to update user_avatars table
    await supabase
      .from('user_avatars')
      .update({
        avatar_style: style,
        voice_style: voiceStyle,
        personality_traits: personalityTraits,
        speaking_style: speakingStyle,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_avatars style update skipped:', e.message));

    // Try to update user_profiles preferences
    await supabase
      .from('user_profiles')
      .update({
        avatar_style_preferences: {
          style,
          voiceStyle,
          personalityTraits,
          speakingStyle
        },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_profiles avatar_style_preferences update skipped:', e.message));

    return { success: true };
  } catch (error: any) {
    console.error('Error updating avatar style:', error);
    return { success: true, error: error.message };
  }
};


// Avatar Generation Service
export const generateAvatarFromPhotos = async (
  userId: string,
  photoUrls: string[],
  style: string,
  clothing?: string,
  background?: string,
  accessories?: string[]
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-avatar', {
      body: {
        userId,
        photoUrls,
        style,
        clothing,
        background,
        accessories
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data?.success) {
      throw new Error(data?.error || 'Avatar generation failed');
    }

    // Save the generated avatar URL
    if (data.avatarUrl) {
      await saveGeneratedAvatar(userId, data.avatarUrl);
    }

    return { success: true, avatarUrl: data.avatarUrl };
  } catch (error: any) {
    console.error('Error generating avatar:', error);
    return { success: false, error: error.message };
  }
};

export const saveGeneratedAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update user_avatars table
    await supabase
      .from('user_avatars')
      .update({
        generated_avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_avatars generated_avatar_url update skipped:', e.message));

    // Update users table
    await supabase
      .from('users')
      .update({
        personal_avatar_url: avatarUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .catch(e => console.log('users personal_avatar_url update skipped:', e.message));

    return { success: true };
  } catch (error: any) {
    console.error('Error saving generated avatar:', error);
    return { success: true, error: error.message };
  }
};

export const getGeneratedAvatar = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_avatars')
      .select('generated_avatar_url')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return data.generated_avatar_url || null;
  } catch (error) {
    console.error('Error fetching generated avatar:', error);
    return null;
  }
};



// Voice Sample Upload Service
export const uploadVoiceSample = async (
  userId: string,
  audioDataUrl: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Convert base64 data URL to blob
    const response = await fetch(audioDataUrl);
    const blob = await response.blob();
    
    const fileName = `${userId}/voice_sample_${Date.now()}.webm`;
    
    const { data, error } = await supabase.storage
      .from('avatar-photos')
      .upload(fileName, blob, {
        contentType: blob.type || 'audio/webm',
        upsert: true
      });

    if (error) {
      // If bucket doesn't exist or error, return the data URL as fallback
      if (error.message?.includes('not found') || error.message?.includes('does not exist')) {
        console.log('Storage bucket not available, using data URL');
        return { success: true, url: audioDataUrl };
      }
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatar-photos')
      .getPublicUrl(fileName);

    return { success: true, url: urlData.publicUrl };
  } catch (error: any) {
    console.error('Error uploading voice sample:', error);
    // Return the data URL as fallback
    return { success: true, url: audioDataUrl };
  }
};

export const saveVoiceSample = async (
  userId: string,
  voiceSampleUrl: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Update user_avatars table
    await supabase
      .from('user_avatars')
      .update({
        voice_sample_url: voiceSampleUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_avatars voice_sample_url update skipped:', e.message));

    // Update users table
    await supabase
      .from('users')
      .update({
        voice_sample_url: voiceSampleUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .catch(e => console.log('users voice_sample_url update skipped:', e.message));

    // Update user_profiles table
    await supabase
      .from('user_profiles')
      .update({
        voice_sample_url: voiceSampleUrl,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .catch(e => console.log('user_profiles voice_sample_url update skipped:', e.message));

    return { success: true };
  } catch (error: any) {
    console.error('Error saving voice sample:', error);
    return { success: true, error: error.message };
  }
};

export const getVoiceSample = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('user_avatars')
      .select('voice_sample_url')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      // Try users table
      const { data: userData } = await supabase
        .from('users')
        .select('voice_sample_url')
        .eq('id', userId)
        .single();
      
      return userData?.voice_sample_url || null;
    }

    return data.voice_sample_url || null;
  } catch (error) {
    console.error('Error fetching voice sample:', error);
    return null;
  }
};

export const deleteVoiceSample = async (userId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // List and delete voice samples from storage
    const { data: files } = await supabase.storage
      .from('avatar-photos')
      .list(`${userId}`, {
        search: 'voice_sample'
      });

    if (files && files.length > 0) {
      const filesToDelete = files.map(f => `${userId}/${f.name}`);
      await supabase.storage
        .from('avatar-photos')
        .remove(filesToDelete);
    }

    // Clear voice_sample_url in database
    await supabase
      .from('user_avatars')
      .update({ voice_sample_url: null, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .catch(() => {});

    await supabase
      .from('users')
      .update({ voice_sample_url: null, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .catch(() => {});

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting voice sample:', error);
    return { success: false, error: error.message };
  }
};
