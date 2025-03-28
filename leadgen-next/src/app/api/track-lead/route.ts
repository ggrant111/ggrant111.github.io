import { NextResponse } from 'next/server';
import { LEADS_TABLE, isSupabaseConfigured, fetchFromSupabase } from '@/lib/supabase';

// Make this route compatible with static export
export const dynamic = "force-dynamic";
export const fetchCache = 'force-no-store';

// Define a proper error type
interface AppError extends Error {
  message: string;
  status?: number;
}

// Define the lead type from the database
interface LeadRecord {
  id: string;
  first_name: string;
  last_name: string;
  destination: string;
  sent_at: string;
  success: boolean;
  vehicle_make: string;
  vehicle_model: string;
  sent_by: string;
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
    if (!isSupabaseConfigured()) {
      console.log('Using mock lead data during build');
      return NextResponse.json({ 
        success: true, 
        leads: MOCK_LEADS,
        count: MOCK_LEADS.length
      });
    }

    console.log('API: Fetching leads from Supabase');
    
    // Get the URL parameters
    const { searchParams } = new URL(req.url);
    const sentBy = searchParams.get('sentBy');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    console.log('API: Query parameters:', { sentBy, startDate, endDate });
    
    // Build the Supabase REST API query
    let queryPath = `${LEADS_TABLE}?select=id,first_name,last_name,destination,sent_at,success,vehicle_make,vehicle_model,sent_by`;
    
    // Apply filters - fix the query parameter format
    const queryParams = [];
    
    if (sentBy) {
      queryParams.push(`sent_by=eq.${encodeURIComponent(sentBy)}`);
    }
    
    if (startDate) {
      queryParams.push(`sent_at=gte.${encodeURIComponent(`${startDate}T00:00:00.000Z`)}`);
    }
    
    if (endDate) {
      queryParams.push(`sent_at=lte.${encodeURIComponent(`${endDate}T23:59:59.999Z`)}`);
    }
    
    // Add sorting
    queryParams.push('order=sent_at.desc');
    
    // Combine the query parameters
    if (queryParams.length > 0) {
      queryPath += `&${queryParams.join('&')}`;
    }
    
    console.log(`API: Final query path: ${queryPath}`);
    
    // Execute the query
    const leads = await fetchFromSupabase<LeadRecord[]>(queryPath);
    console.log(`API: Fetched ${leads.length} leads`);
    
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