import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // First, get the salesperson's UUID from the salespeople table
    const { data: salesperson, error: salespersonError } = await supabase
      .from('salespeople')
      .select('id')
      .eq('id', userId)
      .single();

    if (salespersonError) {
      console.error('Error fetching salesperson:', salespersonError);
      return NextResponse.json(
        { error: `Failed to find salesperson: ${salespersonError.message}` },
        { status: 404 }
      );
    }

    // Get all push subscriptions for the salesperson using their UUID
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('subscription')
      .eq('user_id', salesperson.id);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      hasSubscription: subscriptions && subscriptions.length > 0
    });
  } catch (error) {
    console.error('Error checking subscription:', error);
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
} 