import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://example.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key-for-build';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database table names
export const LEADS_TABLE = 'leads'; 