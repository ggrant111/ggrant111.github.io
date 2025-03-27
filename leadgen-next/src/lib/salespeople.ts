import { supabase } from './supabase';
import { Salesperson } from '@/types/lead';

const SALESPEOPLE_TABLE = 'salespeople';

/**
 * Fetch all salespeople from Supabase
 */
export const getSalespeople = async (): Promise<Salesperson[]> => {
  try {
    const { data, error } = await supabase
      .from(SALESPEOPLE_TABLE)
      .select('*')
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error fetching salespeople:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch salespeople:', error);
    return [];
  }
};

/**
 * Add a new salesperson to Supabase if they don't already exist
 */
export const addSalesperson = async (name: string): Promise<Salesperson | null> => {
  try {
    // Check if the salesperson already exists
    const { data: existingData, error: existingError } = await supabase
      .from(SALESPEOPLE_TABLE)
      .select('*')
      .ilike('name', name)
      .single();
    
    if (existingError && existingError.code !== 'PGRST116') {
      // PGRST116 means no rows returned, which is expected if the salesperson doesn't exist
      console.error('Error checking if salesperson exists:', existingError);
      return null;
    }
    
    // If salesperson already exists, return it
    if (existingData) {
      return existingData as Salesperson;
    }
    
    // Otherwise, create a new salesperson
    const newSalesperson: Omit<Salesperson, 'id'> = {
      name: name.trim()
    };
    
    const { data, error } = await supabase
      .from(SALESPEOPLE_TABLE)
      .insert([newSalesperson])
      .select()
      .single();
    
    if (error) {
      console.error('Error adding salesperson:', error);
      return null;
    }
    
    return data as Salesperson;
  } catch (error) {
    console.error('Failed to add salesperson:', error);
    return null;
  }
}; 