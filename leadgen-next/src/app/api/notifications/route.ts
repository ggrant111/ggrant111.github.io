import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { lead, salespersonName, demoEnvironment } = await request.json();

    // First, get the salesperson's ID from their name
    const { data: salespeople, error: salespersonError } = await supabase
      .from('salespeople')
      .select('id')
      .eq('name', salespersonName);

    if (salespersonError) {
      console.error('Error finding salesperson:', salespersonError);
      throw salespersonError;
    }

    if (!salespeople || salespeople.length === 0) {
      console.error('No salesperson found with name:', salespersonName);
      return NextResponse.json({ message: 'Salesperson not found' });
    }

    // Use the first matching salesperson
    const salesperson = salespeople[0];

    // Get all push subscriptions for the salesperson
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', salesperson.id);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No subscriptions found for:', salespersonName);
      return NextResponse.json({ message: 'No subscriptions found' });
    }

    console.log('Found subscriptions:', subscriptions);

    // Send push notification to all subscriptions
    const notificationPromises = subscriptions.map(async ({ subscription }) => {
      const payload = JSON.stringify({
        title: 'New Lead Submitted',
        body: `${salespersonName} submitted a new lead for ${demoEnvironment}`,
        data: {
          leadId: lead.id,
          demoEnvironment
        }
      });

      try {
        await webpush.sendNotification(subscription, payload);
        console.log('Notification sent successfully');
      } catch (error: any) {
        console.error('Error sending push notification:', error);
        // If the subscription is invalid, remove it from the database
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('subscription', subscription);
          console.log('Removed invalid subscription');
        }
      }
    });

    await Promise.all(notificationPromises);

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error in notifications API:', error);
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
} 