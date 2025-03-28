import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission result:', permission);
    if (permission === 'granted') {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

export async function subscribeToPushNotifications(userId: string) {
  try {
    console.log('Starting push notification subscription for user:', userId);
    const registration = await navigator.serviceWorker.ready;
    console.log('Service worker is ready');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    });
    console.log('Push subscription created:', subscription);

    const subscriptionJson = subscription.toJSON();
    console.log('Subscription JSON:', subscriptionJson);

    // Store the subscription in Supabase
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        subscription: subscriptionJson,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing subscription in Supabase:', error);
      throw error;
    }
    console.log('Subscription stored in Supabase successfully');
    return true;
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return false;
  }
}

export async function unsubscribeFromPushNotifications(userId: string) {
  try {
    console.log('Starting push notification unsubscription for user:', userId);
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
      console.log('Push subscription unsubscribed');
      
      // Remove the subscription from Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('Error removing subscription from Supabase:', error);
        throw error;
      }
      console.log('Subscription removed from Supabase successfully');
    } else {
      console.log('No active subscription found');
    }
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return false;
  }
} 