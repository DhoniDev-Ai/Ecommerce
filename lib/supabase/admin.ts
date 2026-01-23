import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase admin environment variables. Make sure SUPABASE_SERVICE_ROLE_KEY is set.');
}

/**
 * Server-side Supabase Admin Client
 * 
 * ⚠️ CRITICAL: This client bypasses Row Level Security (RLS)
 * Only use in:
 * - API routes
 * - Server components
 * - Server actions
 * 
 * NEVER expose this client to the browser!
 */
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
