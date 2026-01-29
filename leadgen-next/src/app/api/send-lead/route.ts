import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email';
import { supabase, LEADS_TABLE } from '@/lib/supabase';
import { generateAdfXml } from '@/lib/xml-generator';

// API routes must be dynamic, not static
export const dynamic = "force-dynamic";

// Define a proper error type
interface AppError extends Error {
  message: string;
  status?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received lead submission:', {
      hasFirstName: !!body.firstName,
      hasDestination: !!body.destination,
      hasSentBy: !!body.sentBy
    });

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      vehicle,
      comment,
      destination,
      sentBy
    } = body;

    // Validate required fields
    if (!destination) {
      throw new Error('Destination is required');
    }
    if (!sentBy) {
      throw new Error('Sales person (sentBy) is required');
    }

    // Generate the XML content
    const xmlContent = generateAdfXml({
      firstName,
      lastName,
      email,
      phone,
      address,
      vehicle,
      comment
    });

    let emailResult = { success: false };

    // For build environment or when Supabase is not configured
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.log('Using mock data during build');
      emailResult = { success: true };
      return NextResponse.json({
        success: true,
        lead: 'mock-lead-id',
        message: 'Lead sent successfully (mock)'
      });
    }

    // Send the email
    console.log('Sending email to:', destination);
    emailResult = await sendLeadEmail(xmlContent, destination);
    console.log('Email result:', { success: emailResult.success, error: emailResult.error });

    // Store the lead in Supabase
    console.log('Storing lead in Supabase...');
    const { data: lead, error } = await supabase
      .from(LEADS_TABLE)
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address_street: address.street,
        address_city: address.city,
        address_state: address.state,
        address_postal_code: address.postalCode,
        vehicle_year: vehicle?.year,
        vehicle_make: vehicle?.make,
        vehicle_model: vehicle?.model,
        vehicle_vin: vehicle?.vin,
        vehicle_stock: vehicle?.stock,
        vehicle_trim: vehicle?.trim,
        vehicle_transmission: vehicle?.transmission,
        comment,
        destination,
        sent_by: sentBy,
        sent_at: new Date().toISOString(),
        success: emailResult.success
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting lead into Supabase:', error);
      console.error('Supabase error details:', JSON.stringify(error, null, 2));
      throw new Error(`Failed to record lead in database: ${error.message || 'Unknown database error'}`);
    }

    console.log('Lead stored successfully with ID:', lead?.id);

    return NextResponse.json({
      success: emailResult.success,
      lead: lead.id,
      message: emailResult.success ? 'Lead sent successfully' : 'Failed to send lead'
    });
  } catch (error: unknown) {
    console.error('Error in send-lead API:', error);
    const appError = error as AppError;
    const errorMessage = appError.message || 'An unknown error occurred';
    console.error('Returning error response:', errorMessage);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage
      },
      { status: appError.status || 500 }
    );
  }
} 