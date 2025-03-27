import { NextResponse } from 'next/server';
import { supabase, LEADS_TABLE } from '@/lib/supabase';

// Define a proper error type
interface AppError extends Error {
  message: string;
  status?: number;
}

export async function GET(req: Request) {
  try {
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