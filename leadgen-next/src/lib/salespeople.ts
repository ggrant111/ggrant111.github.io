import { supabase, isSupabaseConfigured, SALESPEOPLE_TABLE, fetchFromSupabase } from './supabase';
import { Salesperson } from '@/types/lead';

// Mock salespeople data for when Supabase is not available (during build)
const MOCK_SALESPEOPLE: Salesperson[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Johnson' }
];

/**
 * Fetch all salespeople from Supabase
 */
export const getSalespeople = async (): Promise<Salesperson[]> => {
  try {
    // If we're in a build environment or Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      console.log('Using mock salespeople data (Supabase not configured)');
      return MOCK_SALESPEOPLE;
    }

    // This matches the format we tested in test-supabase.mjs
    const data = await fetchFromSupabase<any[]>(`${SALESPEOPLE_TABLE}?select=*`);
    
    // Transform to match expected format if needed
    const salespeople = data.map(item => ({
      id: item.id.toString(),
      name: item.name
    }));
    
    console.log(`Fetched ${salespeople.length} salespeople`);
    return salespeople.length > 0 ? salespeople : MOCK_SALESPEOPLE;
  } catch (error) {
    console.error('Failed to fetch salespeople:', error);
    return MOCK_SALESPEOPLE;
  }
};

/**
 * Add a new salesperson to Supabase if they don't already exist
 */
export const addSalesperson = async (name: string): Promise<Salesperson | null> => {
  try {
    // If we're in a build environment or Supabase is not configured, return mock data
    if (!isSupabaseConfigured()) {
      console.log('Using mock salespeople data (Supabase not configured)');
      return { id: '999', name };
    }

    // Check if the salesperson already exists - fix URL encoding
    const encodedName = encodeURIComponent(name);
    const existingData = await fetchFromSupabase<any[]>(`${SALESPEOPLE_TABLE}?name=ilike.${encodedName}&limit=1`);
    
    // If salesperson already exists, return it
    if (existingData && existingData.length > 0) {
      return {
        id: existingData[0].id.toString(),
        name: existingData[0].name
      };
    }
    
    // Otherwise, create a new salesperson
    const newSalesperson = {
      name: name.trim()
    };
    
    const data = await fetchFromSupabase<any[]>(SALESPEOPLE_TABLE, {
      method: 'POST',
      body: JSON.stringify([newSalesperson]),
      headers: {
        'Prefer': 'return=representation'
      }
    });
    
    if (data && data.length > 0) {
      return {
        id: data[0].id.toString(),
        name: data[0].name
      };
    }
    
    return null;
  } catch (error) {
    console.error('Failed to add salesperson:', error);
    return null;
  }
}; 