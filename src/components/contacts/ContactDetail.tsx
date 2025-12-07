import React, { useState } from 'react';
import { Contact, SocialActivity, SocialPlatform, ActivityType } from '@/types/contacts';
import { NotificationSettings } from '@/types/notifications';
import { mockNotificationSettings } from '@/data/mockNotifications';
import PlatformIcon from './PlatformIcon';
import ActivityItem from './ActivityItem';
import NotificationSettingsComponent from '@/components/notifications/NotificationSettings';
import { Star, Mail, Building2, ExternalLink, Filter, X, Bell } from 'lucide-react';

interface ContactDetailProps {
  contact: Contact;
  activities: SocialActivity[];
  onClose: () => void;
}

const ContactDetail: React.FC<ContactDetailProps> = ({ contact, activities, onClose }) => {
  const [platformFilter, setPlatformFilter] = useState<SocialPlatform | 'all'>('all');
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  const existingSettings = mockNotificationSettings.find(s => s.contactId === contact.id);
  const [notifSettings, setNotifSettings] = useState<NotificationSettings | null>(
    existingSettings || null
  );

  const filteredActivities = platformFilter === 'all' 
    ? activities : activities.filter(a => a.platform === platformFilter);

  const platforms = [...new Set(activities.map(a => a.platform))];
  const availablePlatforms = contact.socialProfiles.map(p => p.platform);

  const handleToggleEnabled = () => {
    if (notifSettings) {
      setNotifSettings({ ...notifSettings, enabled: !notifSettings.enabled });
    } else {
      setNotifSettings({
        contactId: contact.id, enabled: true,
        platforms: availablePlatforms, activityTypes: ['post', 'story', 'article'],
        createdAt: new Date()
      });
    }
  };

  const handleTogglePlatform = (p: SocialPlatform) => {
    if (!notifSettings) return;
    const newPlatforms = notifSettings.platforms.includes(p)
      ? notifSettings.platforms.filter(x => x !== p) : [...notifSettings.platforms, p];
    setNotifSettings({ ...notifSettings, platforms: newPlatforms });
  };

  const handleToggleActivityType = (t: ActivityType) => {
    if (!notifSettings) return;
    const newTypes = notifSettings.activityTypes.includes(t)
      ? notifSettings.activityTypes.filter(x => x !== t) : [...notifSettings.activityTypes, t];
    setNotifSettings({ ...notifSettings, activityTypes: newTypes });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white relative">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <button onClick={() => setShowNotificationSettings(!showNotificationSettings)}
            className={`p-2 rounded-full transition ${showNotificationSettings ? 'bg-white/30' : 'hover:bg-white/20'}`}
            title="Benachrichtigungen">
            <Bell className={`w-5 h-5 ${notifSettings?.enabled ? 'fill-yellow-300 text-yellow-300' : ''}`} />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <img src={contact.avatar || '/placeholder.svg'} alt={contact.name}
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{contact.name}</h2>
              {contact.isFavorite && <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
            </div>
            {contact.position && contact.company && (
              <p className="text-cyan-100 flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {contact.position} @ {contact.company}
              </p>
            )}
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="text-sm text-cyan-100 hover:text-white flex items-center gap-1 mt-2">
                <Mail className="w-4 h-4" /> {contact.email}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Notification Settings (collapsible) */}
      {showNotificationSettings && (
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <NotificationSettingsComponent settings={notifSettings} contactName={contact.name}
            availablePlatforms={availablePlatforms} onToggleEnabled={handleToggleEnabled}
            onTogglePlatform={handleTogglePlatform} onToggleActivityType={handleToggleActivityType} />
        </div>
      )}

      {/* Social Profiles */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Verbundene Profile</h3>
        <div className="flex flex-wrap gap-2">
          {contact.socialProfiles.map((profile, idx) => (
            <a key={idx} href={profile.profileUrl || '#'} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-cyan-300 hover:shadow transition">
              <PlatformIcon platform={profile.platform} className="w-5 h-5" />
              <span className="text-sm text-gray-700">@{profile.username}</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Activity Filter */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Filter:</span>
          <button onClick={() => setPlatformFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${platformFilter === 'all' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            Alle
          </button>
          {platforms.map(platform => (
            <button key={platform} onClick={() => setPlatformFilter(platform)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition flex items-center gap-1 ${platformFilter === platform ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <PlatformIcon platform={platform} className="w-3 h-3" />
              <span className="capitalize">{platform}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activities */}
      <div className="p-4 max-h-80 overflow-y-auto space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Aktivitäten ({filteredActivities.length})</h3>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => <ActivityItem key={activity.id} activity={activity} />)
        ) : (
          <p className="text-center text-gray-500 py-8">Keine Aktivitäten gefunden</p>
        )}
      </div>
    </div>
  );
};

export default ContactDetail;
