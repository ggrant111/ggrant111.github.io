import { createClient } from '@supabase/supabase-js';

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Get the Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key-for-build';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const LEADS_TABLE = 'leads';
export const SALESPEOPLE_TABLE = 'salespeople';

// Helper function to determine if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://example.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'mock-key-for-build'
  );
};

// Helper function to fetch data from Supabase REST API
export const fetchFromSupabase = async <T>(
  path: string, 
  options: RequestInit = {}
): Promise<T> => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured:', {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set'
    });
    throw new Error('Supabase is not configured properly');
  }

  const url = `${supabaseUrl}/rest/v1/${path}`;
  console.log(`Fetching from Supabase: ${url}`);
  
  const headers = {
    'apikey': supabaseAnonKey,
    'Authorization': `Bearer ${supabaseAnonKey}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
      console.error('Supabase API error:', error);
      throw new Error(error.message || `HTTP error ${response.status}`);
    }

    const data = await response.json();
    console.log(`Supabase response for ${path}:`, { dataLength: Array.isArray(data) ? data.length : 'object' });
    return data;
  } catch (error) {
    console.error('Fetch from Supabase failed:', error);
    throw error;
  }
}; 