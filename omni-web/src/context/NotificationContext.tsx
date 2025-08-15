'use client';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number; // in milliseconds, 0 for sticky
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (message: string, type?: NotificationType, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notif) => notif.id !== id));
  }, []);

  const addNotification = useCallback(
    (message: string, type: NotificationType = 'info', duration: number = 3000) => {
      const id = uuidv4();
      const newNotification: Notification = {
        id,
        message,
        type,
        duration,
      };
      setNotifications((prevNotifications) => [...prevNotifications, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification],
  );

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
