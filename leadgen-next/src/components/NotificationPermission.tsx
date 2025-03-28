import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';
import { requestNotificationPermission, subscribeToPushNotifications, unsubscribeFromPushNotifications } from '@/utils/pushNotifications';

interface NotificationPermissionProps {
  userId: string;
}

export function NotificationPermission({ userId }: NotificationPermissionProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if notifications are already enabled
    if ('Notification' in window) {
      setIsSubscribed(Notification.permission === 'granted');
    }
  }, []);

  const handleNotificationToggle = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const success = await unsubscribeFromPushNotifications(userId);
        setIsSubscribed(!success);
      } else {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          const success = await subscribeToPushNotifications(userId);
          setIsSubscribed(success);
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleNotificationToggle}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isSubscribed ? (
        <>
          <Bell className="h-4 w-4" />
          <span>Notifications Enabled</span>
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          <span>Enable Notifications</span>
        </>
      )}
    </Button>
  );
} 