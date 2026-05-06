import { createClient } from '@supabase/supabase-js';
import { isRetryableError, calculateBackoffDelay, sleep, retryConfig } from '../services/supabasePoolConfig';

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

// KERNEL GUARD: Never throw at module level — that crashes the entire bundle before React mounts.
// Instead, export null and let each call site degrade gracefully via optional chaining (supabase?.from(...)).
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    console.error(
      '[Vottery] ⚠️  MISSING SUPABASE ENV VARS\n' +
      'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.\n' +
      'The app will boot but all database calls will return null.'
    );
  }
}

// Null-safe client: supabase is null when env vars are missing.
// All callers use optional chaining (supabase?.from(...)) so this is safe.
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-application-name': 'vottery',
        },
      },
    })
  : null;

/**
 * Execute a Supabase query with automatic retry logic and exponential backoff.
 * Retries on connection timeout errors (57P03, 53300) and "remaining connection slots" errors.
 *
 * @param {Function} queryFn - Async function that returns a Supabase query result
 * @param {Object} options - Optional overrides for retry behavior
 * @returns {Promise<{data, error}>}
 */
export async function withRetry(queryFn, options = {}) {
  const maxRetries = options?.maxRetries ?? retryConfig?.maxRetries;
  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();

      // Check for connection-related errors in the result
      if (result?.error) {
        const err = result?.error;
        const isConnectionError =
          isRetryableError(err) ||
          (err?.message || '')?.toLowerCase()?.includes('remaining connection slots are reserved') ||
          (err?.message || '')?.toLowerCase()?.includes('too many connections');

        if (isConnectionError && attempt < maxRetries) {
          lastError = err;
          const delay = calculateBackoffDelay(attempt);
          console.warn(
            `[Supabase] Connection error on attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay}ms...`,
            err?.message
          );
          await sleep(delay);
          continue;
        }
      }

      return result;
    } catch (error) {
      lastError = error;

      const isConnectionError =
        isRetryableError(error) ||
        (error?.message || '')?.toLowerCase()?.includes('remaining connection slots are reserved') ||
        (error?.message || '')?.toLowerCase()?.includes('too many connections');

      if (isConnectionError && attempt < maxRetries) {
        const delay = calculateBackoffDelay(attempt);
        console.warn(
          `[Supabase] Exception on attempt ${attempt + 1}/${maxRetries + 1}. Retrying in ${delay}ms...`,
          error?.message
        );
        await sleep(delay);
        continue;
      }

      // Non-retryable error or max retries exceeded
      return { data: null, error: { message: error?.message, code: error?.code } };
    }
  }

  // All retries exhausted
  console.error('[Supabase] All retry attempts exhausted.', lastError?.message);
  return {
    data: null,
    error: {
      message: lastError?.message || 'Connection failed after multiple retries',
      code: lastError?.code || 'CONNECTION_EXHAUSTED',
      retried: maxRetries,
    },
  };
}

/**
 * Handle "remaining connection slots are reserved" errors gracefully
 */
export function handleConnectionSlotError(error) {
  if (!error) return false;
  const msg = (error?.message || '')?.toLowerCase();
  return (msg?.includes('remaining connection slots are reserved') ||
  msg?.includes('too many connections') ||
  error?.code === '53300' || error?.code === '57P03');
}
