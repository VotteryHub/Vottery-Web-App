/**
 * PgBouncer Connection Pooling Configuration
 * Session mode at 20 max connections
 */

export const pgBouncerConfig = {
  pool_mode: 'session',
  pool_size: 20,
  default_pool_size: 10,
  max_client_conn: 100,
  server_idle_timeout: 600,
  client_idle_timeout: 0,
  server_connect_timeout: 15,
  query_timeout: 0,
  query_wait_timeout: 120,
  reserve_pool_size: 5,
  reserve_pool_timeout: 5,
  max_db_connections: 50,
  max_user_connections: 50,
  server_reset_query: 'DISCARD ALL',
  server_check_query: 'select 1',
  server_check_delay: 30,
  application_name_add_host: true,
  log_connections: false,
  log_disconnections: false,
  log_pooler_errors: true,
  stats_period: 60,
  verbose: 0,
};

export const connectionPoolLimits = {
  maxConnections: 20,
  warningThreshold: 0.8, // 80% of pool limit triggers alert
  criticalThreshold: 0.95,
  idleTimeout: 30000, // 30 seconds
  acquireTimeout: 10000, // 10 seconds
  connectionTimeout: 15000, // 15 seconds
};

export const retryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 8000, // 8 seconds
  backoffMultiplier: 2,
  retryableErrorCodes: [
    '57P03', // cannot_connect_now
    '53300', // too_many_connections
    '08006', // connection_failure
    '08001', // sqlclient_unable_to_establish_sqlconnection
    '08004', // sqlserver_rejected_establishment_of_sqlconnection
    'PGRST301', // Supabase connection error
  ],
  retryableMessages: [
    'remaining connection slots are reserved',
    'too many connections',
    'connection refused',
    'connection timeout',
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ENOTFOUND',
  ],
};

/**
 * Check if an error is retryable based on error code or message
 */
export function isRetryableError(error) {
  if (!error) return false;
  const code = error?.code || error?.hint || '';
  const message = error?.message || '';
  const isRetryableCode = retryConfig?.retryableErrorCodes?.some(c => code?.includes(c));
  const isRetryableMsg = retryConfig?.retryableMessages?.some(m =>
    message?.toLowerCase()?.includes(m?.toLowerCase())
  );
  return isRetryableCode || isRetryableMsg;
}

/**
 * Calculate exponential backoff delay
 */
export function calculateBackoffDelay(attempt) {
  const delay = Math.min(
    retryConfig?.baseDelay * Math.pow(retryConfig?.backoffMultiplier, attempt),
    retryConfig?.maxDelay
  );
  // Add jitter (±20%)
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.floor(delay + jitter);
}

/**
 * Sleep utility for retry delays
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default pgBouncerConfig;
