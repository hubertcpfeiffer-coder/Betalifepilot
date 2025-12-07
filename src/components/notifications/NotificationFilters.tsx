import React from 'react';
import { SocialPlatform, ActivityType, activityTypeLabels } from '@/types/contacts';
import PlatformIcon from '@/components/contacts/PlatformIcon';
import { Filter, Eye, EyeOff } from 'lucide-react';

interface NotificationFiltersProps {
  selectedPlatforms: SocialPlatform[];
  selectedActivityTypes: ActivityType[];
  showUnreadOnly: boolean;
  onPlatformToggle: (platform: SocialPlatform) => void;
  onActivityTypeToggle: (type: ActivityType) => void;
  onUnreadToggle: () => void;
}

const platforms: SocialPlatform[] = ['whatsapp', 'facebook', 'instagram', 'linkedin', 'twitter', 'tiktok'];
const activityTypes: ActivityType[] = ['post', 'story', 'status', 'article', 'like', 'comment', 'share'];

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  selectedPlatforms, selectedActivityTypes, showUnreadOnly,
  onPlatformToggle, onActivityTypeToggle, onUnreadToggle
}) => {
  return (
    <div className="p-4 bg-gray-50 border-b space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="w-4 h-4" /> Filter
      </div>
      
      {/* Unread Toggle */}
      <button onClick={onUnreadToggle}
        className={`w-full px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition ${
          showUnreadOnly ? 'bg-blue-100 text-blue-700' : 'bg-white text-gray-600 border'
        }`}>
        {showUnreadOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        {showUnreadOnly ? 'Nur ungelesene' : 'Alle anzeigen'}
      </button>

      {/* Platforms */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Plattformen</p>
        <div className="flex flex-wrap gap-1">
          {platforms.map(p => (
            <button key={p} onClick={() => onPlatformToggle(p)}
              className={`p-2 rounded-lg transition ${
                selectedPlatforms.includes(p) ? 'bg-indigo-100 ring-2 ring-indigo-400' : 'bg-white border hover:bg-gray-100'
              }`}>
              <PlatformIcon platform={p} className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Activity Types */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Aktivitätstypen</p>
        <div className="flex flex-wrap gap-1">
          {activityTypes.map(type => (
            <button key={type} onClick={() => onActivityTypeToggle(type)}
              className={`px-2 py-1 rounded-lg text-xs transition ${
                selectedActivityTypes.includes(type) ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400' : 'bg-white border text-gray-600 hover:bg-gray-100'
              }`}>
              {activityTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
