import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type TableName = 'tasks' | 'notifications' | 'contacts';
type EventType = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface SubscriptionConfig {
  table: TableName;
  event?: EventType;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  onChange?: (payload: any) => void;
}

export function useRealtimeSubscription(
  config: SubscriptionConfig,
  userId: string | undefined,
  enabled: boolean = true
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  const handleChange = useCallback((payload: RealtimePostgresChangesPayload<any>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    config.onChange?.(payload);
    
    switch (eventType) {
      case 'INSERT':
        config.onInsert?.(newRecord);
        break;
      case 'UPDATE':
        config.onUpdate?.(newRecord);
        break;
      case 'DELETE':
        config.onDelete?.(oldRecord);
        break;
    }
  }, [config]);

  useEffect(() => {
    if (!enabled || !userId) return;

    const channelName = `${config.table}_${userId}_${Date.now()}`;
    const filter = config.filter || `user_id=eq.${userId}`;

    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: config.event || '*',
          schema: 'public',
          table: config.table,
          filter
        },
        handleChange
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [config.table, config.event, config.filter, userId, enabled, handleChange]);

  return channelRef.current;
}
