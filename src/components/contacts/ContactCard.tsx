import React from 'react';
import { Contact } from '@/types/contacts';
import { mockNotificationSettings } from '@/data/mockNotifications';
import PlatformIcon from './PlatformIcon';
import { Star, Building2, Bell } from 'lucide-react';

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
  isSelected?: boolean;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onClick, isSelected }) => {
  const activityCount = contact.activities?.length || 0;
  const hasNotifications = mockNotificationSettings.some(s => s.contactId === contact.id && s.enabled);
  
  return (
    <div onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-cyan-500 bg-cyan-50 shadow-md' : 'border-gray-200 bg-white hover:border-cyan-300'
      }`}>
      <div className="flex items-start gap-3">
        <div className="relative">
          <img src={contact.avatar || '/placeholder.svg'} alt={contact.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
          {contact.isFavorite && (
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 absolute -top-1 -right-1" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
            {hasNotifications && (
              <Bell className="w-3.5 h-3.5 text-indigo-500 fill-indigo-200" title="Benachrichtigungen aktiv" />
            )}
          </div>
          {contact.position && contact.company && (
            <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
              <Building2 className="w-3 h-3" />
              {contact.position} @ {contact.company}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            {contact.socialProfiles.slice(0, 4).map((profile, idx) => (
              <div key={idx} className="p-1 rounded-full bg-gray-100">
                <PlatformIcon platform={profile.platform} className="w-4 h-4" />
              </div>
            ))}
            {contact.socialProfiles.length > 4 && (
              <span className="text-xs text-gray-500">+{contact.socialProfiles.length - 4}</span>
            )}
          </div>
        </div>
        
        {activityCount > 0 && (
          <div className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full text-xs font-medium">
            {activityCount} neu
          </div>
        )}
      </div>
      
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {contact.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactCard;
