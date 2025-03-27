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

// Helper function to determine if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return (
    isBrowser && 
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://example.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'mock-key-for-build'
  );
}; 