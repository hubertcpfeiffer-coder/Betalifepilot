import React, { useState } from 'react';
import { Bot, Bell, Settings, LogOut, Menu, X, Loader2, Sparkles, Brain, UserPlus, Mic, MicOff, ListTodo, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockNotifications, mockPriceAlertNotifications } from '@/data/mockNotifications';
import NotificationPanel from '@/components/notifications/NotificationPanel';
import DataSyncStatus from '@/components/sync/DataSyncStatus';
import RealtimeIndicator from '@/components/sync/RealtimeIndicator';
import { Notification, PriceAlertNotification } from '@/types/notifications';


interface Props {
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenAIAgent: () => void;
  onOpenContacts?: () => void;
  onOpenKnowledge?: () => void;
  onOpenTasks?: () => void;
  onVoiceCommand?: () => void;
  isVoiceListening?: boolean;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const Header: React.FC<Props> = ({ onOpenAuth, onOpenSettings, onOpenAIAgent, onOpenContacts, onOpenKnowledge, onOpenTasks, onVoiceCommand, isVoiceListening, isMobileMenuOpen, setMobileMenuOpen }) => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlertNotification[]>(mockPriceAlertNotifications);
  const unreadCount = notifications.filter(n => !n.isRead).length + priceAlerts.filter(p => !p.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setPriceAlerts(prev => prev.map(p => p.id === id ? { ...p, isRead: true } : p));
  };
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setPriceAlerts(prev => prev.map(p => ({ ...p, isRead: true })));
  };
  const handleNotificationClick = () => { setShowNotifications(false); onOpenContacts?.(); };

  const handleAdminClick = () => {
    window.location.href = '/admin';
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Mio-Lifepilot</span>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <a href="#features" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Architektur</a>
              <a href="#organisation" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Organisation</a>
              <a href="#coaches" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">Life Coaches</a>
              {onVoiceCommand && (
                <button onClick={onVoiceCommand} className={`relative p-2.5 rounded-xl transition-all ${isVoiceListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/50' : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'}`} title="Sprachsteuerung">
                  {isVoiceListening && <span className="absolute inset-0 rounded-xl bg-red-400 animate-ping opacity-50" />}
                  {isVoiceListening ? <MicOff className="w-4 h-4 relative z-10" /> : <Mic className="w-4 h-4 relative z-10" />}
                </button>
              )}
              <button onClick={onOpenAIAgent} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4" />Mein Mio
              </button>
            </nav>
            <div className="flex items-center gap-2">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-cyan-600" /> : isAuthenticated && user ? (
                <>
                  <button onClick={onOpenAIAgent} className="md:hidden p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl"><Sparkles className="w-5 h-5" /></button>
                  {onVoiceCommand && <button onClick={onVoiceCommand} className={`md:hidden relative p-2 rounded-xl ${isVoiceListening ? 'bg-red-500 text-white' : 'text-cyan-500 hover:bg-cyan-50'}`}>{isVoiceListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button>}
                  <RealtimeIndicator compact showEventCount />
                  <DataSyncStatus compact />
                  <button onClick={() => setShowNotifications(true)} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl relative">
                    <Bell className="w-5 h-5" />{unreadCount > 0 && <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">{unreadCount > 9 ? '9+' : unreadCount}</span>}
                  </button>
                  <button onClick={() => onOpenTasks?.()} className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-xl" title="Aufgaben"><ListTodo className="w-5 h-5" /></button>
                  <button onClick={() => onOpenKnowledge?.()} className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl" title="Mios Wissen"><Brain className="w-5 h-5" /></button>
                  {user.role === 'admin' && (
                    <button onClick={handleAdminClick} className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-xl" title="Admin Dashboard">
                      <Shield className="w-5 h-5" />
                    </button>
                  )}
                  <button onClick={onOpenSettings} className="p-2 text-gray-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl" title="Einstellungen"><Settings className="w-5 h-5" /></button>
                  <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
                    <img src={user.avatar_url || 'https://d64gsuwffb70l.cloudfront.net/6932b0274d696a2352ce10ff_1764935308344_cf06b37d.jpg'} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-cyan-200 cursor-pointer hover:border-cyan-400" onClick={onOpenSettings} />
                    <button onClick={logout} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl" title="Abmelden"><LogOut className="w-5 h-5" /></button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  {onVoiceCommand && <button onClick={onVoiceCommand} className={`relative p-2 rounded-xl ${isVoiceListening ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>{isVoiceListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}</button>}
                  <button onClick={onOpenAuth} className="hidden sm:flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl hover:from-cyan-700 hover:to-blue-700 shadow-lg shadow-cyan-500/20"><UserPlus className="w-4 h-4" />Registrieren</button>
                  <button onClick={onOpenAuth} className="sm:hidden px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl">Anmelden</button>
                </div>
              )}
              <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl">{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
            </div>
          </div>
        </div>
      </header>
      {showNotifications && <NotificationPanel notifications={notifications} priceAlerts={priceAlerts} onMarkAsRead={handleMarkAsRead} onMarkAllAsRead={handleMarkAllAsRead} onClose={() => setShowNotifications(false)} onNotificationClick={handleNotificationClick} />}
    </>
  );
};

export default Header;
