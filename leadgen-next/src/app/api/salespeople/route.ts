import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Make this route compatible with dynamic functionality
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    console.log('Fetching salespeople from Supabase');
    const { data: salespeople, error } = await supabase
      .from('salespeople')
      .select('*');

    if (error) {
      console.error('Error fetching salespeople:', error);
      throw error;
    }

    console.log(`Found ${salespeople.length} salespeople`);
    return NextResponse.json(salespeople);
  } catch (error) {
    console.error('Error in salespeople API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch salespeople' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    console.log(`Adding salesperson: ${name}`);
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Valid name is required' },
        { status: 400 }
      );
    }
    
    const { data: salesperson, error } = await supabase
      .from('salespeople')
      .insert([{ name }])
      .select()
      .single();

    if (error) {
      console.error('Error adding salesperson:', error);
      throw error;
    }
    
    console.log(`Added salesperson: ${JSON.stringify(salesperson)}`);
    return NextResponse.json(salesperson);
  } catch (error) {
    console.error('Error in salespeople API:', error);
    return NextResponse.json(
      { error: 'Failed to add salesperson' },
      { status: 500 }
    );
  }
} 