import { NextRequest, NextResponse } from 'next/server';
import { getSalespeople, addSalesperson } from '@/lib/salespeople';

// Make this route compatible with static export
export const dynamic = "force-static";

export async function GET() {
  try {
    const salespeople = await getSalespeople();
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
    
    return NextResponse.json({ success: true, data: salesperson });
  } catch (error) {
    console.error('Error adding salesperson:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 