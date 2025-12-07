import React, { useState } from 'react';
import { AlertTriangle, X, Loader2, Trash2, Shield } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

const DeleteAccountModal: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'LÖSCHEN') {
      setError('Bitte gib "LÖSCHEN" ein um fortzufahren.');
      return;
    }
    setDeleting(true);
    setError('');
    const success = await onConfirm();
    if (!success) {
      setError('Fehler beim Löschen. Bitte versuche es später erneut.');
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Konto löschen</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-800 font-medium mb-2">Achtung! Diese Aktion ist unwiderruflich.</p>
                <p className="text-red-700 text-sm">Folgende Daten werden gelöscht:</p>
                <ul className="mt-2 space-y-1 text-sm text-red-600">
                  <li>• Dein Profil und alle Einstellungen</li>
                  <li>• Alle Aufgaben und Erinnerungen</li>
                  <li>• Kontakte und Social-Profile</li>
                  <li>• IQ-Tests und Wissensprofil</li>
                  <li>• Alle Gespräche mit Mio</li>
                  <li>• Geräte und Sicherheitsdaten</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Tipp: Exportiere zuerst deine Daten, bevor du dein Konto löschst.
                </p>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                Ich verstehe, fortfahren
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Zur Bestätigung gib bitte <span className="font-bold text-red-600">LÖSCHEN</span> ein:
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="LÖSCHEN"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none text-center font-mono text-lg tracking-widest"
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm text-center">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Zurück
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting || confirmText !== 'LÖSCHEN'}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Lösche...</>
                  ) : (
                    <><Trash2 className="w-4 h-4" />Endgültig löschen</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
