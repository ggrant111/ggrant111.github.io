import { NextResponse } from 'next/server';
import { sendLeadEmail } from '@/lib/email';
import { supabase, LEADS_TABLE } from '@/lib/supabase';
import { generateAdfXml } from '@/lib/xml-generator';

// Define a proper error type
interface AppError extends Error {
  message: string;
  status?: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
    emailResult = await sendLeadEmail(xmlContent, destination);

    // Store the lead in Supabase
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
      throw new Error('Failed to record lead in database');
    }

    return NextResponse.json({ 
      success: emailResult.success, 
      lead: lead.id,
      message: emailResult.success ? 'Lead sent successfully' : 'Failed to send lead'
    });
  } catch (error: unknown) {
    console.error('Error in send-lead API:', error);
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