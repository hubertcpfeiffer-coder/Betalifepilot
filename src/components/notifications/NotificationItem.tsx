import React from 'react';
import { Notification } from '@/types/notifications';
import { activityTypeLabels, platformColors } from '@/types/contacts';
import PlatformIcon from '@/components/contacts/PlatformIcon';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onClick?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead, onClick }) => {
  const colors = platformColors[notification.platform];
  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true, locale: de });

  const handleClick = () => {
    if (!notification.isRead) onMarkAsRead(notification.id);
    onClick?.();
  };

  return (
    <div onClick={handleClick}
      className={`p-3 rounded-lg cursor-pointer transition-all hover:shadow-md ${
        notification.isRead ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500'
      }`}>
      <div className="flex gap-3">
        <img src={notification.contactAvatar || '/placeholder.svg'} alt={notification.contactName}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-gray-900 truncate">{notification.contactName}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${colors.bg} ${colors.text}`}>
              {activityTypeLabels[notification.activityType]}
            </span>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{notification.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <PlatformIcon platform={notification.platform} className="w-4 h-4" />
            <span className="text-xs text-gray-400">{timeAgo}</span>
            {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </div>
        </div>
        {notification.mediaUrl && (
          <img src={notification.mediaUrl} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
