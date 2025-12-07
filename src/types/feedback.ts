export type FeedbackCategory = 'bug' | 'feature' | 'feedback' | 'question';
export type FeedbackPriority = 'low' | 'medium' | 'high' | 'critical';
export type FeedbackStatus = 'new' | 'in_review' | 'in_progress' | 'resolved' | 'closed' | 'wont_fix';

export interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  timezone: string;
}

export interface BetaFeedback {
  id: string;
  user_id?: string;
  category: FeedbackCategory;
  title: string;
  description: string;
  priority: FeedbackPriority;
  status: FeedbackStatus;
  screenshot_urls: string[];
  browser_info: BrowserInfo;
  page_url: string;
  user_email?: string;
  user_name?: string;
  admin_notes?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackFormData {
  category: FeedbackCategory;
  title: string;
  description: string;
  priority: FeedbackPriority;
  screenshots: File[];
}

export interface FeedbackStats {
  total: number;
  byCategory: Record<FeedbackCategory, number>;
  byStatus: Record<FeedbackStatus, number>;
  byPriority: Record<FeedbackPriority, number>;
  recentFeedback: BetaFeedback[];
}
