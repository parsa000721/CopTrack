import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Notification } from '../types';
import * as api from '../services/api';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: () => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = useCallback(async () => {
    if (user) {
      const userNotifications = await api.getNotifications(user.id);
      setNotifications(userNotifications);
      setUnreadCount(userNotifications.filter(n => !n.read).length);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
        fetchNotifications();
    }

    const handleNewNotification = (event: Event) => {
        const newNotif = (event as CustomEvent).detail as Notification;
        if(newNotif.userId === user?.id){
            fetchNotifications();
        }
    }
    const handleNotificationsReadOrCleared = () => {
        if (user) {
            fetchNotifications();
        }
    }

    window.addEventListener('newNotification', handleNewNotification);
    window.addEventListener('notificationsRead', handleNotificationsReadOrCleared);
    window.addEventListener('notificationsCleared', handleNotificationsReadOrCleared);

    return () => {
        window.removeEventListener('newNotification', handleNewNotification);
        window.removeEventListener('notificationsRead', handleNotificationsReadOrCleared);
        window.removeEventListener('notificationsCleared', handleNotificationsReadOrCleared);
    }

  }, [user, fetchNotifications]);

  const markAsRead = async () => {
    if (user && unreadCount > 0) {
      await api.markNotificationsAsRead(user.id);
      // The event listener will trigger a re-fetch
    }
  };

  const clearAll = async () => {
    if (user) {
      await api.clearAllNotifications(user.id);
      // The event listener will trigger a re-fetch
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
