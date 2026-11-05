import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// Public/anon client for user-scoped or public operations
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin/service-role client for privileged backend operations (bypasses RLS safely from server-side)
export const supabaseAdmin = isSupabaseConfigured && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : supabase;

if (!isSupabaseConfigured) {
  console.log('----------------------------------------------------');
  console.log('[Supabase Config Notice]');
  console.log('Supabase credentials not yet supplied in backend/.env.');
  console.log('The backend will operate with high-fidelity in-memory demo data.');
  console.log('Add SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY');
  console.log('to connect to your live Supabase cloud database.');
  console.log('----------------------------------------------------');
}

