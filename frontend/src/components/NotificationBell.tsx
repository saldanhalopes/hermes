import React, { useState } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getIcon = (type?: string) => {
    switch (type) {
      case 'RFC_SUBMITTED': return <Info className="w-5 h-5 text-blue-500" />;
      case 'RFC_APPROVED': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'RFC_REJECTED': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'RFC_ASSIGNED': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default: return <Bell className="w-5 h-5 text-indigo-500" />;
    }
  };

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    if (notification.data?.firestoreId) {
      navigate(`/rfc/${notification.data.firestoreId}`);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-surface-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-all active:scale-95"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-80 sm:w-96 bg-white glass-card z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                <h3 className="font-bold text-surface-900">Notificações</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => markAllAsRead()}
                    className="text-xs text-primary-600 hover:underline flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Marcarlas como lidas
                  </button>
                )}
              </div>

              <div className="max-height-[400px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-surface-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-6 h-6 text-surface-400" />
                    </div>
                    <p className="text-surface-500 text-sm">Nenhuma notificação por enquanto.</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full p-4 flex gap-4 text-left hover:bg-primary-50/30 transition-colors border-b border-surface-50 last:border-0 relative ${!n.read ? 'bg-indigo-50/20' : ''}`}
                    >
                      {!n.read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-600 rounded-full" />
                      )}
                      <div className="flex-shrink-0 pt-1">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold mb-1 truncate ${!n.read ? 'text-surface-900' : 'text-surface-600'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-surface-500 line-clamp-2 mb-2">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-surface-400">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
              
              <div className="p-3 text-center border-t border-surface-100 bg-surface-50/50">
                <button 
                  className="text-xs font-medium text-surface-500 hover:text-primary-600 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
