import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';
import dns from 'node:dns';

// Force IPv4 to avoid IPv6 timeouts in local dev
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore if not supported
}

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
const fetchWithRetry = async (url: RequestInfo | URL, options?: RequestInit) => {
  const MAX_RETRIES = 3;
  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // Use standard fetch
      return await fetch(url, options);
    } catch (err: any) {
      if (i === MAX_RETRIES - 1) throw err;
      
      const isTimeout = err.name === 'ConnectTimeoutError' || err.code === 'UND_ERR_CONNECT_TIMEOUT' || err.message?.includes('fetch failed');
      
      if (isTimeout) {
        console.warn(`Supabase Admin request failed (attempt ${i + 1}/${MAX_RETRIES}). Retrying in ${(i + 1) * 500}ms...`);
        await new Promise(resolve => setTimeout(resolve, (i + 1) * 500));
        continue;
      }
      throw err;
    }
  }
  throw new Error('Unreachable');
};

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  global: {
    fetch: fetchWithRetry,
  },
});
