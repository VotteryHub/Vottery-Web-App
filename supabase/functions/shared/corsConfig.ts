// Global declaration for Deno runtime
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Secure CORS configuration with environment-based origin validation
export const getAllowedOrigins = (): string[] => {
  const env = Deno.env.get('ENVIRONMENT') || 'development';
  
  if (env === 'production') {
    return [
      'https://vottery.com',
      'https://www.vottery.com',
      Deno.env.get('ALLOWED_ORIGINS') || ''
    ].filter(Boolean);
  }
  
  // Development origins
  return [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ];
};

export const getCorsHeaders = (origin: string | null): Record<string, string> => {
  const allowedOrigins = getAllowedOrigins();
  const isAllowed = origin && allowedOrigins.includes(origin);
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : 'null',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-request-id',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};