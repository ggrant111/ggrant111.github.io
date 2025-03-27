import { NextResponse } from 'next/server';
import { supabase, LEADS_TABLE } from '@/lib/supabase';

// Make this route compatible with static export
export const dynamic = "force-static";

// Define a proper error type
interface AppError extends Error {
  message: string;
  status?: number;
}

// Mock leads for build environment
const MOCK_LEADS = [
  {
    _id: '1',
    firstName: 'John',
    lastName: 'Doe',
    destination: 'Sales Department',
    sentAt: new Date().toISOString(),
    success: true,
    sentBy: 'Jane Smith',
    vehicle: {
      make: 'Toyota',
      model: 'Camry'
    }
  },
  {
    _id: '2',
    firstName: 'Alice',
    lastName: 'Johnson',
    destination: 'Service Center',
    sentAt: new Date().toISOString(),
    success: true,
    sentBy: 'Bob Wilson',
    vehicle: {
      make: 'Honda',
      model: 'Civic'
    }
  }
];

export async function GET(req: Request) {
  try {
    // Mock data for build environment or when Supabase is not configured
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('Using mock lead data during build');
      return NextResponse.json({ 
        success: true, 
        leads: MOCK_LEADS,
        count: MOCK_LEADS.length
      });
    }

    // Get the URL parameters
    const { searchParams } = new URL(req.url);
    const sentBy = searchParams.get('sentBy');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build the Supabase query
    let query = supabase
      .from(LEADS_TABLE)
      .select(`
        id,
        first_name,
        last_name,
        destination,
        sent_at,
        success,
        vehicle_make,
        vehicle_model,
        sent_by
      `)
      .order('sent_at', { ascending: false });
    
    // Apply filters
    if (sentBy) {
      query = query.eq('sent_by', sentBy);
    }
    
    if (startDate) {
      query = query.gte('sent_at', `${startDate}T00:00:00.000Z`);
    }
    
    if (endDate) {
      query = query.lte('sent_at', `${endDate}T23:59:59.999Z`);
    }
    
    // Execute the query
    const { data: leads, error } = await query;
    
    if (error) {
      console.error('Error fetching leads from Supabase:', error);
      throw new Error('Failed to fetch leads from database');
    }
    
    // Transform the data to match the expected format in the frontend
    const transformedLeads = leads.map(lead => ({
      _id: lead.id,
      firstName: lead.first_name,
      lastName: lead.last_name,
      destination: lead.destination,
      sentAt: lead.sent_at,
      success: lead.success,
      sentBy: lead.sent_by || '',
      vehicle: {
        make: lead.vehicle_make,
        model: lead.vehicle_model
      }
    }));
    
    return NextResponse.json({ 
      success: true, 
      leads: transformedLeads,
      count: transformedLeads.length
    });
    
  } catch (error: unknown) {
    console.error('Error in track-lead API:', error);
    const appError = error as AppError;
    return NextResponse.json(
      { 
        success: false, 
        error: appError.message || 'An unknown error occurred'
      },
      { status: 500 }
    );
  }
} 