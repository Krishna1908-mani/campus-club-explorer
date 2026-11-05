import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Production or Cloud Storage Mode Detection
export const isProduction = process.env.NODE_ENV === 'production' || process.env.STORAGE_MODE === 'supabase';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('your-project')
);

// In production mode, require valid Supabase credentials (no silent fallback)
if (isProduction && !isSupabaseConfigured) {
  const errMsg = '[FATAL PRODUCTION CONFIG] Supabase credentials (SUPABASE_URL, SUPABASE_ANON_KEY) are required when NODE_ENV=production or STORAGE_MODE=supabase. In-memory storage fallback is disabled in production.';
  console.error(errMsg);
  if (process.env.NODE_ENV === 'production') {
    throw new Error(errMsg);
  }
}

// Guard helper: Throws a 503 Service Unavailable if production mode is active but database is not connected
export const assertDatabaseAvailable = () => {
  if (isProduction && !isSupabaseConfigured) {
    const error = new Error('Database service unavailable: Supabase Cloud PostgreSQL credentials are not configured. In-memory storage fallback is disabled in production.');
    error.statusCode = 503;
    throw error;
  }
};

// Public/anon client for user-scoped operations with RLS
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin/service-role client for privileged backend-only operations (bypasses RLS safely on the server)
// NEVER expose supabaseServiceKey to frontend or browser responses
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
  console.log('Supabase cloud credentials not detected in backend/.env.');
  console.log('Local Development Mode Active: Operating with in-memory fallback.');
  console.log('To connect to your hosted Supabase project:');
  console.log('1. Set SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in backend/.env');
  console.log('2. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env');
  console.log('----------------------------------------------------');
} else {
  try {
    const parsed = new URL(supabaseUrl);
    console.log('========================================================');
    console.log(`⚡ Supabase PostgreSQL Connected: ${parsed.hostname}`);
    console.log(`   Service-Role Key: ${supabaseServiceKey ? 'Configured (Server-Side Only)' : 'Not Set (Operating in Anon Key Mode)'}`);
    console.log('========================================================');
  } catch {
    console.log('[Supabase Config] Connected to provided SUPABASE_URL.');
  }
}
