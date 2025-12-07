import { supabase } from '@/lib/supabase';
import { BetaFeedback, FeedbackFormData, BrowserInfo, FeedbackStats, FeedbackStatus } from '@/types/feedback';

// Collect browser information
export const collectBrowserInfo = (): BrowserInfo => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

// Upload screenshot to Supabase Storage
export const uploadScreenshot = async (file: File, userId?: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId || 'anonymous'}_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `screenshots/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('feedback-screenshots')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Screenshot upload error:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('feedback-screenshots')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading screenshot:', error);
    return null;
  }
};

// Submit feedback
export const submitFeedback = async (
  formData: FeedbackFormData,
  userId?: string,
  userEmail?: string,
  userName?: string
): Promise<{ success: boolean; feedbackId?: string; error?: string }> => {
  try {
    // Upload screenshots first
    const screenshotUrls: string[] = [];
    for (const file of formData.screenshots) {
      const url = await uploadScreenshot(file, userId);
      if (url) {
        screenshotUrls.push(url);
      }
    }

    // Collect browser info
    const browserInfo = collectBrowserInfo();

    // Insert feedback
    const { data, error } = await supabase
      .from('beta_feedback')
      .insert({
        user_id: userId || null,
        category: formData.category,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        screenshot_urls: screenshotUrls,
        browser_info: browserInfo,
        page_url: window.location.href,
        user_email: userEmail,
        user_name: userName,
        status: 'new'
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error submitting feedback:', error);
      return { success: false, error: error.message };
    }

    return { success: true, feedbackId: data.id };
  } catch (error) {
    console.error('Error in submitFeedback:', error);
    return { success: false, error: 'Ein unerwarteter Fehler ist aufgetreten' };
  }
};

// Get user's feedback history
export const getUserFeedback = async (userId: string): Promise<BetaFeedback[]> => {
  try {
    const { data, error } = await supabase
      .from('beta_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user feedback:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserFeedback:', error);
    return [];
  }
};

// Get all feedback (admin only)
export const getAllFeedback = async (
  filters?: {
    category?: string;
    status?: string;
    priority?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ feedback: BetaFeedback[]; total: number }> => {
  try {
    let query = supabase
      .from('beta_feedback')
      .select('*', { count: 'exact' });

    if (filters?.category) {
      query = query.eq('category', filters.category);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    query = query.order('created_at', { ascending: false });

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching all feedback:', error);
      return { feedback: [], total: 0 };
    }

    return { feedback: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getAllFeedback:', error);
    return { feedback: [], total: 0 };
  }
};

// Update feedback status (admin only)
export const updateFeedbackStatus = async (
  feedbackId: string,
  status: FeedbackStatus,
  adminNotes?: string
): Promise<boolean> => {
  try {
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    };

    if (adminNotes !== undefined) {
      updateData.admin_notes = adminNotes;
    }

    if (status === 'resolved' || status === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('beta_feedback')
      .update(updateData)
      .eq('id', feedbackId);

    if (error) {
      console.error('Error updating feedback status:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateFeedbackStatus:', error);
    return false;
  }
};

// Get feedback statistics
export const getFeedbackStats = async (): Promise<FeedbackStats> => {
  try {
    const { data, error } = await supabase
      .from('beta_feedback')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return {
        total: 0,
        byCategory: { bug: 0, feature: 0, feedback: 0, question: 0 },
        byStatus: { new: 0, in_review: 0, in_progress: 0, resolved: 0, closed: 0, wont_fix: 0 },
        byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
        recentFeedback: []
      };
    }

    const stats: FeedbackStats = {
      total: data.length,
      byCategory: { bug: 0, feature: 0, feedback: 0, question: 0 },
      byStatus: { new: 0, in_review: 0, in_progress: 0, resolved: 0, closed: 0, wont_fix: 0 },
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      recentFeedback: data.slice(0, 5)
    };

    data.forEach(item => {
      if (item.category in stats.byCategory) {
        stats.byCategory[item.category as keyof typeof stats.byCategory]++;
      }
      if (item.status in stats.byStatus) {
        stats.byStatus[item.status as keyof typeof stats.byStatus]++;
      }
      if (item.priority in stats.byPriority) {
        stats.byPriority[item.priority as keyof typeof stats.byPriority]++;
      }
    });

    return stats;
  } catch (error) {
    console.error('Error in getFeedbackStats:', error);
    return {
      total: 0,
      byCategory: { bug: 0, feature: 0, feedback: 0, question: 0 },
      byStatus: { new: 0, in_review: 0, in_progress: 0, resolved: 0, closed: 0, wont_fix: 0 },
      byPriority: { low: 0, medium: 0, high: 0, critical: 0 },
      recentFeedback: []
    };
  }
};

// Take screenshot of current page (using html2canvas if available)
export const captureScreenshot = async (): Promise<File | null> => {
  try {
    // Try to use html2canvas if available
    const html2canvas = (window as any).html2canvas;
    if (html2canvas) {
      const canvas = await html2canvas(document.body, {
        logging: false,
        useCORS: true,
        scale: 0.5 // Reduce size
      });
      
      return new Promise((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) {
            resolve(new File([blob], `screenshot_${Date.now()}.png`, { type: 'image/png' }));
          } else {
            resolve(null);
          }
        }, 'image/png', 0.8);
      });
    }
    return null;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
};
