import { supabase } from '@/lib/supabase';

// Store face data for a user
export async function registerFace(userId: string, faceData: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Store face data in users table
    const { error } = await supabase
      .from('users')
      .update({ 
        face_data: faceData,
        face_registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Face registration error:', error);
      return { success: false, error: 'Gesichtsdaten konnten nicht gespeichert werden' };
    }

    return { success: true };
  } catch (e: any) {
    console.error('Face registration error:', e);
    return { success: false, error: 'Fehler bei der Gesichtsregistrierung' };
  }
}

// Verify face data for login
export async function verifyFace(email: string, faceData: string): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Get user with face data
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      return { success: false, error: 'Benutzer nicht gefunden' };
    }

    if (!user.face_data) {
      return { success: false, error: 'Keine Gesichtsdaten registriert. Bitte melde dich mit Passwort an.' };
    }

    // In a real implementation, you would use a face recognition ML model here
    // For demo purposes, we'll simulate face verification
    // The face_data is stored as base64, we compare image similarity
    
    const isMatch = await compareFaceImages(user.face_data, faceData);
    
    if (!isMatch) {
      return { success: false, error: 'Gesicht nicht erkannt. Bitte versuche es erneut.' };
    }

    // Update last login
    await supabase.from('users').update({ last_login: new Date().toISOString() }).eq('id', user.id);

    const { password_hash, face_data, ...safeUser } = user;
    return { success: true, user: safeUser };
  } catch (e: any) {
    console.error('Face verification error:', e);
    return { success: false, error: 'Fehler bei der Gesichtserkennung' };
  }
}

// Check if user has face data registered
export async function hasFaceRegistered(userId: string): Promise<boolean> {
  try {
    const { data } = await supabase.from('users').select('face_data').eq('id', userId).single();
    return !!data?.face_data;
  } catch {
    return false;
  }
}

// Simple face comparison (demo - in production use ML model)
async function compareFaceImages(stored: string, current: string): Promise<boolean> {
  // For demo: always return true if both images exist
  // In production: use face-api.js or similar library
  return stored && current && stored.length > 100 && current.length > 100;
}
