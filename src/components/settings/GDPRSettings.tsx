import React, { useState } from 'react';
import { Download, Trash2, Loader2, Shield, AlertTriangle, CheckCircle, FileJson, Clock, Wifi, Radio } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtime } from '@/contexts/RealtimeContext';
import { exportUserDataComplete, downloadAsJSON, deleteAllUserData } from '@/services/userDataService';
import DeleteAccountModal from './DeleteAccountModal';
import RealtimeIndicator from '@/components/sync/RealtimeIndicator';

const GDPRSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const { connectionStatus, eventCount } = useRealtime();
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    setExportSuccess(false);
    try {
      const data = await exportUserDataComplete(user.id);
      const filename = `mio-daten-export-${new Date().toISOString().split('T')[0]}.json`;
      downloadAsJSON(data, filename);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 5000);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return false;
    const success = await deleteAllUserData(user.id);
    if (success) { await logout(); return true; }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-cyan-600" />
        <h3 className="text-lg font-bold text-gray-900">Datenschutz & GDPR</h3>
      </div>

      {/* Realtime Sync Status */}
      <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Radio className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Echtzeit-Synchronisation</h4>
            <p className="text-sm text-gray-600 mb-3">
              Deine Daten werden automatisch zwischen allen Geräten und Browser-Tabs synchronisiert.
            </p>
            <RealtimeIndicator showEventCount />
            {eventCount > 0 && (
              <p className="text-xs text-gray-500 mt-2">{eventCount} Änderungen in dieser Sitzung synchronisiert</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm"><FileJson className="w-6 h-6 text-blue-600" /></div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Meine Daten exportieren</h4>
            <p className="text-sm text-gray-600 mb-4">Lade alle deine Daten als JSON-Datei herunter.</p>
            <button onClick={handleExport} disabled={exporting} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50">
              {exporting ? <><Loader2 className="w-4 h-4 animate-spin" />Exportiere...</> : exportSuccess ? <><CheckCircle className="w-4 h-4" />Erfolgreich!</> : <><Download className="w-4 h-4" />Daten exportieren</>}
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">Konto löschen</h4>
            <p className="text-sm text-gray-600 mb-4">Lösche dein Konto und alle Daten unwiderruflich.</p>
            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all"><Trash2 className="w-4 h-4" />Konto löschen</button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="w-4 h-4" /><span>Deine Daten werden gemäß DSGVO/GDPR verarbeitet.</span></div>
      </div>

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} onConfirm={handleDeleteAccount} />}
    </div>
  );
};

export default GDPRSettings;
