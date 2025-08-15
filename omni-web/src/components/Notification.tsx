'use client';
import React, { useEffect, useState } from 'react';
import { Notification, useNotification } from '@/context/NotificationContext';

const NotificationComponent= ({ notification }: { notification: Notification }) => {
  const { removeNotification } = useNotification();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Give some time for the fade-out animation before removing
        setTimeout(() => removeNotification(notification.id), 500);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, notification.id, removeNotification]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => removeNotification(notification.id), 500);
  };

  const getTypeClasses = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-700 text-white';
    }
  };
  return (
    <div
      className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center justify-between transition-opacity duration-500 z-50 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTypeClasses(notification.type)}`}
    >
      <span>{notification.message}</span>
      <button onClick={handleClose} className="ml-4 text-lg font-bold">
        &times;
      </button>
    </div>
  );
};

export default NotificationComponent;
