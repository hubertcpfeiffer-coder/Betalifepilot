import { supabase } from '@/lib/supabase';

export interface DeviceInfo {
  id?: string;
  user_id: string;
  device_id: string;
  device_name: string;
  browser: string;
  browser_version: string;
  os: string;
  os_version: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  ip_address?: string;
  location?: string;
  is_current: boolean;
  is_trusted: boolean;
  last_active: string;
  created_at?: string;
  session_token?: string;
}

export const getDeviceInfo = (): Omit<DeviceInfo, 'id' | 'user_id' | 'is_current' | 'is_trusted' | 'last_active' | 'created_at' | 'session_token'> => {
  const ua = navigator.userAgent;
  let browser = 'Unbekannt', browserVersion = '', os = 'Unbekannt', osVersion = '', deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';

  // Browser detection
  if (ua.includes('Firefox/')) { browser = 'Firefox'; browserVersion = ua.match(/Firefox\/(\d+)/)?.[1] || ''; }
  else if (ua.includes('Edg/')) { browser = 'Edge'; browserVersion = ua.match(/Edg\/(\d+)/)?.[1] || ''; }
  else if (ua.includes('Chrome/')) { browser = 'Chrome'; browserVersion = ua.match(/Chrome\/(\d+)/)?.[1] || ''; }
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) { browser = 'Safari'; browserVersion = ua.match(/Version\/(\d+)/)?.[1] || ''; }

  // OS detection
  if (ua.includes('Windows')) { os = 'Windows'; osVersion = ua.match(/Windows NT (\d+\.\d+)/)?.[1] || ''; }
  else if (ua.includes('Mac OS')) { os = 'macOS'; osVersion = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || ''; }
  else if (ua.includes('Linux')) { os = 'Linux'; }
  else if (ua.includes('Android')) { os = 'Android'; osVersion = ua.match(/Android (\d+)/)?.[1] || ''; }
  else if (ua.includes('iPhone') || ua.includes('iPad')) { os = 'iOS'; osVersion = ua.match(/OS (\d+)/)?.[1] || ''; }

  // Device type
  if (/Mobile|Android|iPhone/.test(ua)) deviceType = 'mobile';
  else if (/iPad|Tablet/.test(ua)) deviceType = 'tablet';

  const deviceId = localStorage.getItem('mio_device_id') || crypto.randomUUID();
  localStorage.setItem('mio_device_id', deviceId);

  return { device_id: deviceId, device_name: `${browser} auf ${os}`, browser, browser_version: browserVersion, os, os_version: osVersion, device_type: deviceType };
};

export const registerDevice = async (userId: string, sessionToken: string): Promise<{ isNewDevice: boolean; device?: DeviceInfo }> => {
  try {
    const info = getDeviceInfo();
    
    // Try to get existing device
    const { data: existing, error: selectError } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('device_id', info.device_id)
      .single();
    
    // If table doesn't exist, return success
    if (selectError && selectError.code === '42P01') {
      console.log('user_devices table does not exist, skipping device registration');
      return { isNewDevice: false };
    }
    
    const isNewDevice = !existing;
    const now = new Date().toISOString();

    // Reset is_current for all devices
    await supabase
      .from('user_devices')
      .update({ is_current: false })
      .eq('user_id', userId)
      .catch(() => {});

    const deviceData = { 
      ...info, 
      user_id: userId, 
      is_current: true, 
      is_trusted: existing?.is_trusted || false, 
      last_active: now, 
      session_token: sessionToken 
    };

    if (existing) {
      await supabase
        .from('user_devices')
        .update(deviceData)
        .eq('id', existing.id)
        .catch(() => {});
    } else {
      await supabase
        .from('user_devices')
        .upsert(deviceData, { onConflict: 'user_id,device_id' })
        .catch(() => {});
      
      // Create notification for new device
      await supabase
        .from('device_login_notifications')
        .insert({ user_id: userId, device_id: info.device_id, notification_type: 'new_device' })
        .catch(() => {});
    }

    return { isNewDevice, device: deviceData as DeviceInfo };
  } catch (error) {
    console.error('Device registration error:', error);
    return { isNewDevice: false };
  }
};

export const getUserDevices = async (userId: string): Promise<DeviceInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('user_devices')
      .select('*')
      .eq('user_id', userId)
      .order('last_active', { ascending: false });
    
    if (error && error.code === '42P01') {
      return [];
    }
    
    return (data || []) as DeviceInfo[];
  } catch (error) {
    console.error('Get devices error:', error);
    return [];
  }
};

export const logoutDevice = async (userId: string, deviceId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_devices')
      .delete()
      .eq('user_id', userId)
      .eq('device_id', deviceId);
    return !error;
  } catch (error) {
    console.error('Logout device error:', error);
    return false;
  }
};

export const logoutAllOtherDevices = async (userId: string, currentDeviceId: string): Promise<number> => {
  try {
    const { data } = await supabase
      .from('user_devices')
      .delete()
      .eq('user_id', userId)
      .neq('device_id', currentDeviceId)
      .select();
    return data?.length || 0;
  } catch (error) {
    console.error('Logout all devices error:', error);
    return 0;
  }
};

export const getNewDeviceNotifications = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('device_login_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });
    
    if (error && error.code === '42P01') {
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Get notifications error:', error);
    return [];
  }
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  try {
    await supabase
      .from('device_login_notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  } catch (error) {
    console.error('Mark notification read error:', error);
  }
};
