import { supabase } from '@/lib/supabase';
import { AdminStats, AdminUser, AuditLogEntry, UserActivityData, TaskStatsData, APIUsageData } from '@/types/admin';

const invokeAdmin = async (action: string, adminId: string, params?: any, userId?: string) => {
  const { data, error } = await supabase.functions.invoke('admin-dashboard', {
    body: { action, adminId, userId, params }
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

export const getAdminStats = async (adminId: string): Promise<AdminStats> => {
  return invokeAdmin('getStats', adminId);
};

export const getUsers = async (
  adminId: string,
  params?: { page?: number; limit?: number; search?: string }
): Promise<{ users: AdminUser[]; total: number; page: number; limit: number }> => {
  return invokeAdmin('getUsers', adminId, params);
};

export const getAuditLogs = async (
  adminId: string,
  params?: { page?: number; limit?: number; action?: string }
): Promise<{ logs: AuditLogEntry[]; total: number; page: number; limit: number }> => {
  return invokeAdmin('getAuditLogs', adminId, params);
};

export const getUserActivity = async (adminId: string): Promise<UserActivityData[]> => {
  return invokeAdmin('getUserActivity', adminId);
};

export const getTaskStats = async (adminId: string): Promise<TaskStatsData> => {
  return invokeAdmin('getTaskStats', adminId);
};

export const getAPIUsage = async (adminId: string): Promise<APIUsageData[]> => {
  return invokeAdmin('getAPIUsage', adminId);
};

export const updateUserAdmin = async (adminId: string, userId: string, params: Partial<AdminUser>) => {
  return invokeAdmin('updateUser', adminId, params, userId);
};

export const deleteUserAdmin = async (adminId: string, userId: string) => {
  return invokeAdmin('deleteUser', adminId, undefined, userId);
};

export const toggleUserStatus = async (adminId: string, userId: string, status: string) => {
  return invokeAdmin('toggleUserStatus', adminId, { status }, userId);
};

// Beta-Tester-Verwaltung
export const approveBetaTester = async (adminId: string, userId: string) => {
  return invokeAdmin('approveBetaTester', adminId, undefined, userId);
};

export const rejectBetaTester = async (adminId: string, userId: string) => {
  return invokeAdmin('rejectBetaTester', adminId, undefined, userId);
};

export const verifyUserEmail = async (adminId: string, userId: string) => {
  return invokeAdmin('verifyUserEmail', adminId, undefined, userId);
};

export const getBetaTesters = async (adminId: string): Promise<AdminUser[]> => {
  return invokeAdmin('getBetaTesters', adminId);
};

export const getPendingReviewUsers = async (adminId: string): Promise<AdminUser[]> => {
  return invokeAdmin('getPendingReviewUsers', adminId);
};
