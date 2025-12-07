import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';
import { RealtimeChannel } from '@supabase/supabase-js';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface RealtimeEvent {
  type: 'task' | 'notification' | 'contact';
  action: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: Date;
}

interface RealtimeContextType {
  connectionStatus: ConnectionStatus;
  lastEvent: RealtimeEvent | null;
  eventCount: number;
  subscribe: (callback: (event: RealtimeEvent) => void) => () => void;
  broadcastToTabs: (event: RealtimeEvent) => void;
}

const RealtimeContext = createContext<RealtimeContextType>({
  connectionStatus: 'disconnected',
  lastEvent: null,
  eventCount: 0,
  subscribe: () => () => {},
  broadcastToTabs: () => {}
});

export const useRealtime = () => useContext(RealtimeContext);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [lastEvent, setLastEvent] = useState<RealtimeEvent | null>(null);
  const [eventCount, setEventCount] = useState(0);
  const channelsRef = useRef<RealtimeChannel[]>([]);
  const listenersRef = useRef<Set<(event: RealtimeEvent) => void>>(new Set());
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  const notifyListeners = useCallback((event: RealtimeEvent) => {
    setLastEvent(event);
    setEventCount(c => c + 1);
    listenersRef.current.forEach(cb => cb(event));
  }, []);

  const broadcastToTabs = useCallback((event: RealtimeEvent) => {
    broadcastChannelRef.current?.postMessage(event);
  }, []);

  const subscribe = useCallback((callback: (event: RealtimeEvent) => void) => {
    listenersRef.current.add(callback);
    return () => { listenersRef.current.delete(callback); };
  }, []);

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannelRef.current = new BroadcastChannel('mio_realtime_sync');
      broadcastChannelRef.current.onmessage = (e) => notifyListeners(e.data);
    }
    return () => broadcastChannelRef.current?.close();
  }, [notifyListeners]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');
    const tables = ['tasks', 'notifications', 'contacts'] as const;

    tables.forEach(table => {
      const channel = supabase.channel(`${table}_${user.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table, filter: `user_id=eq.${user.id}` },
          (payload) => {
            const event: RealtimeEvent = {
              type: table.slice(0, -1) as any,
              action: payload.eventType.toLowerCase() as any,
              data: payload.new || payload.old,
              timestamp: new Date()
            };
            notifyListeners(event);
            broadcastToTabs(event);
          })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') setConnectionStatus('connected');
          else if (status === 'CHANNEL_ERROR') setConnectionStatus('error');
        });
      channelsRef.current.push(channel);
    });

    return () => {
      channelsRef.current.forEach(ch => supabase.removeChannel(ch));
      channelsRef.current = [];
    };
  }, [isAuthenticated, user?.id, notifyListeners, broadcastToTabs]);

  return (
    <RealtimeContext.Provider value={{ connectionStatus, lastEvent, eventCount, subscribe, broadcastToTabs }}>
      {children}
    </RealtimeContext.Provider>
  );
};
