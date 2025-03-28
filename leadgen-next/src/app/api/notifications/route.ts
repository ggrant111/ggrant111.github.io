import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configure web-push with VAPID keys
webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { lead, salespersonName, demoEnvironment } = await request.json();

    // Get all push subscriptions for the salesperson
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', lead.salesperson_id);

    if (error) throw error;

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions found' });
    }

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
      } catch (error) {
        console.error('Error sending push notification:', error);
        // If the subscription is invalid, remove it from the database
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('subscription', subscription);
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