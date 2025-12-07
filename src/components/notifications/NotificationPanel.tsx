import React, { useState, useMemo } from 'react';
import { Notification, PriceAlertNotification, AnyNotification } from '@/types/notifications';
import { SocialPlatform, ActivityType } from '@/types/contacts';
import { shopInfo } from '@/types/priceComparison';
import NotificationItem from './NotificationItem';
import NotificationFilters from './NotificationFilters';
import { Bell, X, CheckCheck, Filter, ChevronDown, ChevronUp, Tag, ShoppingCart } from 'lucide-react';

interface NotificationPanelProps {
  notifications: Notification[];
  priceAlerts?: PriceAlertNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
  notifications, priceAlerts = [], onMarkAsRead, onMarkAllAsRead, onClose, onNotificationClick
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<ActivityType[]>([]);
  const [showPriceAlerts, setShowPriceAlerts] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'contacts' | 'prices'>('all');

  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (showUnreadOnly && n.isRead) return false;
      if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(n.platform)) return false;
      if (selectedActivityTypes.length > 0 && !selectedActivityTypes.includes(n.activityType)) return false;
      return true;
    });
  }, [notifications, showUnreadOnly, selectedPlatforms, selectedActivityTypes]);

  const filteredPriceAlerts = useMemo(() => {
    return priceAlerts.filter(p => !showUnreadOnly || !p.isRead);
  }, [priceAlerts, showUnreadOnly]);

  const unreadCount = notifications.filter(n => !n.isRead).length + priceAlerts.filter(p => !p.isRead).length;

  const togglePlatform = (p: SocialPlatform) => setSelectedPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleActivityType = (t: ActivityType) => setSelectedActivityTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const displayItems = activeTab === 'prices' ? [] : filteredNotifications;
  const displayPriceAlerts = activeTab === 'contacts' ? [] : filteredPriceAlerts;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden mt-16 mr-4 max-h-[80vh] flex flex-col">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h2 className="font-bold">Benachrichtigungen</h2>
              {unreadCount > 0 && <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={onMarkAllAsRead} className="p-2 hover:bg-white/20 rounded-full" title="Alle als gelesen markieren"><CheckCheck className="w-4 h-4" /></button>
              <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {['all', 'contacts', 'prices'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1 rounded-full text-sm ${activeTab === tab ? 'bg-white text-indigo-600' : 'bg-white/20 hover:bg-white/30'}`}>
                {tab === 'all' ? 'Alle' : tab === 'contacts' ? 'Kontakte' : 'Preise'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {displayPriceAlerts.map(p => (
            <div key={p.id} onClick={() => onMarkAsRead(p.id)}
              className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-md ${p.isRead ? 'bg-gray-50 border-gray-200' : 'bg-rose-50 border-rose-200'}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: shopInfo[p.shopId]?.color || '#666' }}>{p.shopName.substring(0, 2)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-rose-500" />
                    <span className="font-semibold text-gray-900">{p.productName}</span>
                  </div>
                  <p className="text-sm text-gray-600">Jetzt <span className="font-bold text-green-600">{p.currentPrice.toFixed(2)}€</span>
                    {p.originalPrice && <span className="line-through text-gray-400 ml-1">{p.originalPrice.toFixed(2)}€</span>}
                    <span className="text-rose-500 ml-2">bei {p.shopName}</span></p>
                </div>
                {p.savedAmount && <div className="text-green-600 font-bold text-sm">-{p.savedAmount.toFixed(2)}€</div>}
              </div>
            </div>
          ))}
          {displayItems.map(n => <NotificationItem key={n.id} notification={n} onMarkAsRead={onMarkAsRead} onClick={() => onNotificationClick?.(n)} />)}
          {displayItems.length === 0 && displayPriceAlerts.length === 0 && (
            <div className="text-center py-12 text-gray-400"><Bell className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>Keine Benachrichtigungen</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
