import { supabase } from '@/lib/supabase';
import { SystemHealthOverview, SystemAlert, PerformanceHistory } from '@/types/systemHealth';

const invoke = async (action: string, adminId: string, params?: any) => {
  const { data, error } = await supabase.functions.invoke('admin-dashboard', {
    body: { action, adminId, params }
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data;
};

export const getSystemHealth = async (adminId: string): Promise<SystemHealthOverview> => {
  return invoke('getSystemHealth', adminId);
};

export const getAlerts = async (adminId: string, resolved = false): Promise<SystemAlert[]> => {
  return invoke('getAlerts', adminId, { resolved });
};

export const getPerformanceHistory = async (adminId: string, hours = 24): Promise<PerformanceHistory[]> => {
  return invoke('getPerformanceHistory', adminId, { hours });
};

export const acknowledgeAlert = async (adminId: string, alertId: string): Promise<void> => {
  return invoke('acknowledgeAlert', adminId, { alertId });
};

export const resolveAlert = async (adminId: string, alertId: string): Promise<void> => {
  return invoke('resolveAlert', adminId, { alertId });
};
