import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Trash2, Shield, AlertTriangle, Loader2, LogOut } from 'lucide-react';
import { DeviceInfo, getUserDevices, logoutDevice, logoutAllOtherDevices } from '@/services/deviceService';
import { useAuth } from '@/contexts/AuthContext';

const DeviceList: React.FC = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const currentDeviceId = localStorage.getItem('mio_device_id');

  useEffect(() => { if (user) loadDevices(); }, [user]);

  const loadDevices = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserDevices(user.id);
    setDevices(data);
    setLoading(false);
  };

  const handleLogoutDevice = async (deviceId: string) => {
    if (!user) return;
    setActionLoading(deviceId);
    await logoutDevice(user.id, deviceId);
    await loadDevices();
    setActionLoading(null);
  };

  const handleLogoutAllOthers = async () => {
    if (!user || !currentDeviceId) return;
    setActionLoading('all');
    const count = await logoutAllOtherDevices(user.id, currentDeviceId);
    await loadDevices();
    setActionLoading(null);
    alert(`${count} Gerät(e) abgemeldet`);
  };

  const getDeviceIcon = (type: string) => {
    if (type === 'mobile') return <Smartphone className="w-5 h-5" />;
    if (type === 'tablet') return <Tablet className="w-5 h-5" />;
    return <Monitor className="w-5 h-5" />;
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 60000) return 'Gerade eben';
    if (diff < 3600000) return `vor ${Math.floor(diff / 60000)} Min.`;
    if (diff < 86400000) return `vor ${Math.floor(diff / 3600000)} Std.`;
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-600" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900">Angemeldete Geräte</h4>
        <span className="text-sm text-gray-500">{devices.length} Gerät(e)</span>
      </div>

      <div className="space-y-3">
        {devices.map((device) => (
          <div key={device.device_id} className={`p-4 rounded-xl border ${device.device_id === currentDeviceId ? 'bg-cyan-50 border-cyan-200' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${device.device_id === currentDeviceId ? 'bg-cyan-100 text-cyan-600' : 'bg-gray-200 text-gray-600'}`}>
                {getDeviceIcon(device.device_type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">{device.device_name}</span>
                  {device.device_id === currentDeviceId && (
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full">Dieses Gerät</span>
                  )}
                  {device.is_trusted && <Shield className="w-4 h-4 text-green-500" />}
                </div>
                <p className="text-sm text-gray-500">{device.browser} {device.browser_version} • {device.os} {device.os_version}</p>
                <p className="text-xs text-gray-400 mt-1">Letzte Aktivität: {formatDate(device.last_active)}</p>
              </div>
              {device.device_id !== currentDeviceId && (
                <button onClick={() => handleLogoutDevice(device.device_id)} disabled={actionLoading === device.device_id}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                  {actionLoading === device.device_id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {devices.length > 1 && (
        <button onClick={handleLogoutAllOthers} disabled={actionLoading === 'all'}
          className="w-full py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {actionLoading === 'all' ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Alle anderen Geräte abmelden
        </button>
      )}

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">Wenn du ein Gerät abmeldest, muss sich diese Person erneut anmelden, um auf dein Konto zuzugreifen.</p>
      </div>
    </div>
  );
};

export default DeviceList;
