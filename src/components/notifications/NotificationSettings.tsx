import React from 'react';
import { NotificationSettings as NotificationSettingsType } from '@/types/notifications';
import { SocialPlatform, ActivityType, activityTypeLabels } from '@/types/contacts';
import PlatformIcon from '@/components/contacts/PlatformIcon';
import { Bell, BellOff, Check } from 'lucide-react';

interface NotificationSettingsProps {
  settings: NotificationSettingsType | null;
  contactName: string;
  availablePlatforms: SocialPlatform[];
  onToggleEnabled: () => void;
  onTogglePlatform: (platform: SocialPlatform) => void;
  onToggleActivityType: (type: ActivityType) => void;
}

const activityTypes: ActivityType[] = ['post', 'story', 'status', 'article', 'like', 'comment'];

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings, contactName, availablePlatforms,
  onToggleEnabled, onTogglePlatform, onToggleActivityType
}) => {
  const isEnabled = settings?.enabled ?? false;
  const selectedPlatforms = settings?.platforms ?? [];
  const selectedTypes = settings?.activityTypes ?? [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-800">Benachrichtigungen</span>
        </div>
        <button onClick={onToggleEnabled}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
            isEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
          {isEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          {isEnabled ? 'Aktiv' : 'Inaktiv'}
        </button>
      </div>

      {isEnabled && (
        <>
          <p className="text-sm text-gray-500">
            Erhalte Benachrichtigungen wenn <strong>{contactName}</strong> neue Aktivitäten zeigt.
          </p>

          {/* Platforms */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Plattformen überwachen</p>
            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map(p => (
                <button key={p} onClick={() => onTogglePlatform(p)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${
                    selectedPlatforms.includes(p) ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                  <PlatformIcon platform={p} className="w-4 h-4" />
                  <span className="capitalize">{p}</span>
                  {selectedPlatforms.includes(p) && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Types */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2">Aktivitätstypen</p>
            <div className="flex flex-wrap gap-2">
              {activityTypes.map(type => (
                <button key={type} onClick={() => onToggleActivityType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition ${
                    selectedTypes.includes(type) ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-300' : 'bg-gray-100 text-gray-600'
                  }`}>
                  {activityTypeLabels[type]}
                  {selectedTypes.includes(type) && <Check className="w-3 h-3 inline ml-1" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSettings;
