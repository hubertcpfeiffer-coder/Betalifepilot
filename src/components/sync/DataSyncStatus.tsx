import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle2, AlertCircle, Radio, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { supabase } from '@/lib/supabase';

interface Props {
  compact?: boolean;
}

const DataSyncStatus: React.FC<Props> = ({ compact = false }) => {
  const { user, isAuthenticated } = useAuth();
  const { connectionStatus, eventCount, lastEvent } = useRealtime();
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline' | 'error'>('synced');
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [dataCounts, setDataCounts] = useState({ knowledge: false, iq: 0, contacts: 0, tasks: 0 });
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (lastEvent) {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }
  }, [lastEvent]);

  useEffect(() => {
    if (isAuthenticated && user) checkSyncStatus();
  }, [isAuthenticated, user]);

  const checkSyncStatus = async () => {
    if (!user) return;
    setSyncStatus('syncing');
    try {
      const [knowledgeRes, iqRes, contactsRes, tasksRes] = await Promise.all([
        supabase.from('user_knowledge_profiles').select('id').eq('user_id', user.id).maybeSingle(),
        supabase.from('user_iq_tests').select('id').eq('user_id', user.id),
        supabase.from('contacts').select('id').eq('user_id', user.id),
        supabase.from('tasks').select('id').eq('user_id', user.id)
      ]);
      setDataCounts({
        knowledge: !!knowledgeRes.data,
        iq: iqRes.data?.length || 0,
        contacts: contactsRes.data?.length || 0,
        tasks: tasksRes.data?.length || 0
      });
      setSyncStatus('synced');
      setLastSync(new Date());
    } catch (e) {
      console.error('Sync check error:', e);
      setSyncStatus('error');
    }
  };

  if (!isAuthenticated) {
    return compact ? null : (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <CloudOff className="w-4 h-4" /><span>Nicht synchronisiert</span>
      </div>
    );
  }

  if (compact) {
    return (
      <button onClick={checkSyncStatus} className={`relative p-2 rounded-lg transition-all ${pulse ? 'scale-110' : ''} ${
        connectionStatus === 'connected' ? 'text-green-500 bg-green-50 hover:bg-green-100' :
        connectionStatus === 'connecting' ? 'text-yellow-500 bg-yellow-50' :
        connectionStatus === 'error' ? 'text-red-500 bg-red-50' : 'text-gray-400 bg-gray-50'
      }`} title={connectionStatus === 'connected' ? `Live verbunden (${eventCount} Sync-Events)` : 'Synchronisieren'}>
        {connectionStatus === 'connecting' ? <RefreshCw className="w-4 h-4 animate-spin" /> :
         connectionStatus === 'connected' ? <Wifi className="w-4 h-4" /> :
         connectionStatus === 'error' ? <AlertCircle className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
        {connectionStatus === 'connected' && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
      </button>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all ${connectionStatus === 'connected' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' : 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {connectionStatus === 'connected' ? <Radio className="w-5 h-5 text-green-600 animate-pulse" /> :
           connectionStatus === 'connecting' ? <RefreshCw className="w-5 h-5 text-yellow-600 animate-spin" /> :
           <AlertCircle className="w-5 h-5 text-red-500" />}
          <span className="font-medium text-gray-900">
            {connectionStatus === 'connected' ? 'Echtzeit-Sync aktiv' :
             connectionStatus === 'connecting' ? 'Verbinde...' : 'Verbindungsfehler'}
          </span>
        </div>
        <button onClick={checkSyncStatus} className="text-sm text-green-600 hover:text-green-700"><RefreshCw className="w-4 h-4" /></button>
      </div>
      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: 'Profil', value: dataCounts.knowledge ? 'Aktiv' : '-', color: 'green' },
          { label: 'Aufgaben', value: dataCounts.tasks, color: 'cyan' },
          { label: 'Kontakte', value: dataCounts.contacts, color: 'blue' },
          { label: 'IQ-Tests', value: dataCounts.iq, color: 'purple' }
        ].map(item => (
          <div key={item.label} className="p-2 bg-white rounded-lg">
            <p className="text-xs text-gray-500">{item.label}</p>
            <p className={`font-bold text-${item.color}-600`}>{item.value}</p>
          </div>
        ))}
      </div>
      {lastSync && <p className="text-xs text-gray-400 mt-2 text-center">Zuletzt: {lastSync.toLocaleTimeString('de-DE')}</p>}
      {eventCount > 0 && <p className="text-xs text-green-600 mt-1 text-center">{eventCount} Echtzeit-Updates in dieser Sitzung</p>}
    </div>
  );
};

export default DataSyncStatus;
