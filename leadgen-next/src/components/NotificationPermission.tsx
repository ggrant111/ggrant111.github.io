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
  const [salespersonId, setSalespersonId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the salesperson's ID from their name and check subscription status
    const fetchSalespersonId = async () => {
      try {
        console.log('Fetching salesperson ID for:', userId);
        const response = await fetch('/api/salespeople');
        if (!response.ok) {
          throw new Error('Failed to fetch salespeople');
        }
        const data = await response.json();
        console.log('Salespeople data:', data);
        
        const salesperson = data.find((s: any) => s.name === userId);
        if (salesperson) {
          console.log('Found salesperson:', salesperson);
          setSalespersonId(salesperson.id);
          
          // Check if we have a subscription for this salesperson
          const subscriptionResponse = await fetch(`/api/notifications/subscription?userId=${salesperson.id}`);
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json();
            setIsSubscribed(subscriptionData.hasSubscription);
          }
        } else {
          console.log('No salesperson found with name:', userId);
          setError('Salesperson not found');
        }
      } catch (error) {
        console.error('Error fetching salesperson ID:', error);
        setError('Failed to fetch salesperson data');
      }
    };

    fetchSalespersonId();
  }, [userId]);

  const handleNotificationToggle = async () => {
    if (!salespersonId) {
      console.error('No salesperson ID available');
      return;
    }
    
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const success = await unsubscribeFromPushNotifications(salespersonId);
        setIsSubscribed(!success);
      } else {
        const permissionGranted = await requestNotificationPermission();
        if (permissionGranted) {
          const success = await subscribeToPushNotifications(salespersonId);
          setIsSubscribed(success);
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      setError('Failed to toggle notifications');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!salespersonId) {
    return null;
  }

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