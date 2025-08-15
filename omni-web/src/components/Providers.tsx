'use client';

import React from 'react';
import { NotificationProvider, useNotification } from '@/context/NotificationContext';
import NotificationComponent from '@/components/Notification';

interface ProvidersProps {
  children: React.ReactNode;
}

// Component to display notifications
function NotificationDisplay() {
  const { notifications } = useNotification();
  return (
    <>
      {notifications.map((notification) => (
        <NotificationComponent key={notification.id} notification={notification} />
      ))}
    </>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <NotificationProvider>
      {children}
      <NotificationDisplay />
    </NotificationProvider>
  );
}
