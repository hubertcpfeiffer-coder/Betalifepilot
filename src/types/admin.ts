export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalTasks: number;
  pendingReviewUsers: number;
  betaTesters: number;
}

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  created_at?: string;
  last_login?: string;
  role: 'user' | 'admin' | 'moderator' | 'beta_tester';
  status: 'active' | 'suspended' | 'banned' | 'pending_review' | 'approved';
  email_verified: boolean;
  is_beta_tester?: boolean;
  beta_approved_at?: string;
  beta_approved_by?: string;
  onboarding_completed?: boolean;
}



export interface AuditLogEntry {
  id: string;
  user_id?: string;
  action: string;
  details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface UserActivityData {
  date: string;
  active: number;
  newUsers: number;
}

export interface TaskStatsData {
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
}

export interface APIUsageData {
  endpoint: string;
  request_count: number;
  last_request: string;
}
