import React from 'react';
import { SocialActivity, activityTypeLabels, platformColors } from '@/types/contacts';
import PlatformIcon from './PlatformIcon';
import { Heart, MessageCircle, Share2, Clock } from 'lucide-react';

interface ActivityItemProps {
  activity: SocialActivity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const colors = platformColors[activity.platform];
  
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 60) return `vor ${minutes} Min.`;
    if (hours < 24) return `vor ${hours} Std.`;
    return `vor ${Math.floor(hours / 24)} Tagen`;
  };

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${colors.bg}`}>
          <PlatformIcon platform={activity.platform} className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm font-medium ${colors.text} capitalize`}>
              {activity.platform}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
              {activityTypeLabels[activity.type]}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto">
              <Clock className="w-3 h-3" />
              {formatTime(activity.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-800 text-sm leading-relaxed">{activity.content}</p>
          
          {activity.mediaUrl && (
            <div className="mt-3 rounded-lg overflow-hidden">
              <img 
                src={activity.mediaUrl} 
                alt="Media" 
                className="w-full max-h-48 object-cover"
              />
            </div>
          )}
          
          {activity.engagement && (activity.engagement.likes > 0 || activity.engagement.comments > 0) && (
            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Heart className="w-4 h-4 text-red-400" />
                {activity.engagement.likes.toLocaleString()}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle className="w-4 h-4 text-blue-400" />
                {activity.engagement.comments.toLocaleString()}
              </span>
              {activity.engagement.shares > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Share2 className="w-4 h-4 text-green-400" />
                  {activity.engagement.shares.toLocaleString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
