import React, { useEffect } from 'react';
import { Bell, CheckCircle2, MessageSquare, Shield, X } from 'lucide-react';
import { TeamNotification } from '../types';

interface NotificationToastProps {
  notification: TeamNotification | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'approval':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'security':
        return <Shield className="w-4 h-4 text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-800 shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white">{notification.title}</h4>
            <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notification.message}</p>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {notification.authorName} • Baru saja
          </span>
        </div>
      </div>
    </div>
  );
};
