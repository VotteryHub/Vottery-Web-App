/**
 * Supabase Admin Client
 * Uses the service role key to bypass Row Level Security (RLS) for admin operations.
 * 
 * SECURITY WARNING:
 * - NEVER expose this client or the service role key to the browser/frontend.
 * - This file should only be used in server-side contexts (Edge Functions, server/index.js).
 * - The SUPABASE_SERVICE_ROLE_KEY must be kept secret and never committed to version control.
 * 
 * Setup Instructions:
 * 1. Go to your Supabase project dashboard → Settings → API
 * 2. Copy the "service_role" key (NOT the anon key)
 * 3. Add to your .env file: SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
 * 4. For Vite frontend use: VITE_SUPABASE_SERVICE_ROLE_KEY (only if absolutely necessary)
 *    WARNING: This exposes the key to the browser — use Edge Functions instead.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = import.meta.env?.VITE_SUPABASE_SERVICE_ROLE_KEY || import.meta.env?.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Validate that service role key is properly configured
 */
export const validateServiceRoleConfig = () => {
  const issues = [];

  if (!SUPABASE_URL) {
    issues?.push('VITE_SUPABASE_URL is not configured');
  }

  if (!SERVICE_ROLE_KEY || SERVICE_ROLE_KEY === 'your-supabase-service-role-key-here') {
    issues?.push('SUPABASE_SERVICE_ROLE_KEY is not configured or still has placeholder value');
  }

  if (SERVICE_ROLE_KEY && SERVICE_ROLE_KEY?.length < 100) {
    issues?.push('SUPABASE_SERVICE_ROLE_KEY appears to be invalid (too short)');
  }

  return {
    isValid: issues?.length === 0,
    issues,
    isConfigured: !!SERVICE_ROLE_KEY && SERVICE_ROLE_KEY !== 'your-supabase-service-role-key-here',
  };
};

/**
 * Create admin Supabase client that bypasses RLS.
 * Returns null if service role key is not configured.
 */
export const createAdminClient = () => {
  const validation = validateServiceRoleConfig();

  if (!validation?.isValid) {
    console.warn('[SupabaseAdmin] Service role not configured:', validation?.issues?.join(', '));
    console.warn('[SupabaseAdmin] Admin operations requiring RLS bypass will fail.');
    console.warn('[SupabaseAdmin] Setup: Add SUPABASE_SERVICE_ROLE_KEY to your .env file.');
    return null;
  }

  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-admin-client': 'vottery-admin',
      },
    },
  });
};

/**
 * Singleton admin client instance.
 * Will be null if service role key is not configured.
 */
export const supabaseAdmin = createAdminClient();

/**
 * Admin operations that bypass RLS.
 * Use these for server-side admin tasks only.
 */
export const adminOperations = {
  /**
   * Get all users (bypasses RLS)
   */
  async getAllUsers(limit = 100, offset = 0) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not configured. Set SUPABASE_SERVICE_ROLE_KEY.' } };
    }
    return supabaseAdmin?.from('user_profiles')?.select('*')?.range(offset, offset + limit - 1)?.order('created_at', { ascending: false });
  },

  /**
   * Admin update user (bypasses RLS)
   */
  async adminUpdateUser(userId, updates) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not configured.' } };
    }
    return supabaseAdmin?.from('user_profiles')?.update(updates)?.eq('id', userId)?.select()?.single();
  },

  /**
   * Admin delete record (bypasses RLS)
   */
  async adminDelete(table, id) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not configured.' } };
    }
    return supabaseAdmin?.from(table)?.delete()?.eq('id', id);
  },

  /**
   * Bulk insert bypassing RLS
   */
  async adminBulkInsert(table, records) {
    if (!supabaseAdmin) {
      return { data: null, error: { message: 'Admin client not configured.' } };
    }
    return supabaseAdmin?.from(table)?.insert(records)?.select();
  },

  /**
   * Check service role configuration status
   */
  getConfigStatus() {
    return validateServiceRoleConfig();
  },
};

export default supabaseAdmin;