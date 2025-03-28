import { NextRequest, NextResponse } from 'next/server';
import { getSalespeople, addSalesperson } from '@/lib/salespeople';

// Make this route compatible with dynamic functionality
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET() {
  try {
    console.log('API: Fetching salespeople');
    const salespeople = await getSalespeople();
    console.log(`API: Found ${salespeople.length} salespeople`);
    return NextResponse.json({ success: true, data: salespeople });
  } catch (error) {
    console.error('Error fetching salespeople:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch salespeople' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    console.log(`API: Adding salesperson ${name}`);
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Valid name is required' },
        { status: 400 }
      );
    }
    
    const salesperson = await addSalesperson(name);
    
    if (!salesperson) {
      return NextResponse.json(
        { success: false, error: 'Failed to add salesperson' },
        { status: 500 }
      );
    }
    
    console.log(`API: Added salesperson: ${JSON.stringify(salesperson)}`);
    return NextResponse.json({ success: true, data: salesperson });
  } catch (error) {
    console.error('Error adding salesperson:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 