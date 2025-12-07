import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Radio, Zap, RefreshCw, Activity } from 'lucide-react';
import { useRealtime } from '@/contexts/RealtimeContext';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  compact?: boolean;
  showEventCount?: boolean;
}

const RealtimeIndicator: React.FC<Props> = ({ compact = false, showEventCount = false }) => {
  const { connectionStatus, eventCount, lastEvent } = useRealtime();
  const { isAuthenticated } = useAuth();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (lastEvent) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  if (!isAuthenticated) return null;

  const statusConfig = {
    connected: { icon: Wifi, color: 'text-green-500', bg: 'bg-green-100', label: 'Live verbunden' },
    connecting: { icon: RefreshCw, color: 'text-yellow-500', bg: 'bg-yellow-100', label: 'Verbinde...' },
    disconnected: { icon: WifiOff, color: 'text-gray-400', bg: 'bg-gray-100', label: 'Offline' },
    error: { icon: WifiOff, color: 'text-red-500', bg: 'bg-red-100', label: 'Verbindungsfehler' }
  };

  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`relative p-2 rounded-lg ${config.bg} transition-all duration-300 ${pulse ? 'scale-110' : ''}`}>
        <Icon className={`w-4 h-4 ${config.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
        {connectionStatus === 'connected' && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
        {showEventCount && eventCount > 0 && (
          <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[10px] px-1 rounded-full">
            {eventCount > 99 ? '99+' : eventCount}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${config.bg} transition-all duration-300 ${pulse ? 'ring-2 ring-indigo-300' : ''}`}>
      <div className="relative">
        <Icon className={`w-5 h-5 ${config.color} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
        {connectionStatus === 'connected' && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900 text-sm">{config.label}</span>
          {connectionStatus === 'connected' && (
            <Radio className="w-3 h-3 text-green-500 animate-pulse" />
          )}
        </div>
        {lastEvent && connectionStatus === 'connected' && (
          <p className="text-xs text-gray-500">
            Letzte Änderung: {lastEvent.type} ({lastEvent.action})
          </p>
        )}
      </div>
      {showEventCount && eventCount > 0 && (
        <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full">
          <Activity className="w-3 h-3 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-600">{eventCount}</span>
        </div>
      )}
    </div>
  );
};

export default RealtimeIndicator;
