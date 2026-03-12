/**
 * Security Enhancement Utilities
 * CSP headers, request signature validation, and security helpers
 */

import crypto from 'crypto';

/**
 * Content Security Policy Configuration
 */
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React
    "'unsafe-eval'", // Required for development
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://pagead2.googlesyndication.com'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled components
    'https://fonts.googleapis.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https:',
    'https://*.supabase.co',
    'https://www.google-analytics.com'
  ],
  'font-src': [
    "'self'",
    'data:',
    'https://fonts.gstatic.com'
  ],
  'connect-src': [
    "'self'",
    'https://*.supabase.co',
    'wss://*.supabase.co',
    'https://api.stripe.com',
    'https://api.openai.com',
    'https://api.anthropic.com',
    'https://api.perplexity.ai',
    'https://www.google-analytics.com'
  ],
  'frame-src': [
    "'self'",
    'https://js.stripe.com',
    'https://hooks.stripe.com'
  ],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Generate CSP header string
 */
export const generateCSPHeader = () => {
  return Object.entries(CSP_DIRECTIVES)?.map(([directive, sources]) => {
      if (sources?.length === 0) {
        return directive;
      }
      return `${directive} ${sources?.join(' ')}`;
    })?.join('; ');
};

/**
 * Security Headers Configuration
 */
export const SECURITY_HEADERS = {
  'Content-Security-Policy': generateCSPHeader(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

/**
 * Request signature validation
 */
export const generateRequestSignature = (payload, secret) => {
  const hmac = crypto?.createHmac('sha256', secret);
  hmac?.update(JSON.stringify(payload));
  return hmac?.digest('hex');
};

export const validateRequestSignature = (payload, signature, secret) => {
  const expectedSignature = generateRequestSignature(payload, secret);
  return crypto?.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

/**
 * Rate limiting helper
 */
const rateLimitStore = new Map();

export const checkRateLimit = (identifier, maxRequests = 100, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimitStore?.get(identifier) || [];
  
  // Remove old requests outside the window
  const validRequests = userRequests?.filter(timestamp => now - timestamp < windowMs);
  
  if (validRequests?.length >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: new Date(validRequests[0] + windowMs)
    };
  }
  
  validRequests?.push(now);
  rateLimitStore?.set(identifier, validRequests);
  
  return {
    allowed: true,
    remaining: maxRequests - validRequests?.length,
    resetAt: new Date(now + windowMs)
  };
};

/**
 * Input sanitization
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input?.replace(/[<>"']/g, (char) => {
      const entities = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return entities?.[char];
    });
};

/**
 * SQL injection prevention
 */
export const escapeSQLInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input?.replace(/'/g, "''")?.replace(/\\/g, '\\\\')?.replace(/;/g, '')?.replace(/--/g, '')?.replace(/\/\*/g, '')?.replace(/\*\//g, '');
};

/**
 * CSRF token generation and validation
 */
export const generateCSRFToken = () => {
  return crypto?.randomBytes(32)?.toString('hex');
};

export const validateCSRFToken = (token, storedToken) => {
  if (!token || !storedToken) return false;
  
  return crypto?.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
};

/**
 * Secure random string generation
 */
export const generateSecureRandom = (length = 32) => {
  return crypto?.randomBytes(length)?.toString('hex');
};

/**
 * Password strength validation
 */
export const validatePasswordStrength = (password) => {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/?.test(password);
  const hasLowerCase = /[a-z]/?.test(password);
  const hasNumbers = /\d/?.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/?.test(password);
  
  const strength = {
    isValid: password?.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
    score: 0,
    feedback: []
  };
  
  if (password?.length < minLength) {
    strength?.feedback?.push(`Password must be at least ${minLength} characters`);
  } else {
    strength.score += 25;
  }
  
  if (!hasUpperCase) {
    strength?.feedback?.push('Password must contain uppercase letters');
  } else {
    strength.score += 25;
  }
  
  if (!hasLowerCase) {
    strength?.feedback?.push('Password must contain lowercase letters');
  } else {
    strength.score += 25;
  }
  
  if (!hasNumbers) {
    strength?.feedback?.push('Password must contain numbers');
  } else {
    strength.score += 12.5;
  }
  
  if (!hasSpecialChar) {
    strength?.feedback?.push('Password must contain special characters');
  } else {
    strength.score += 12.5;
  }
  
  return strength;
};

/**
 * XSS prevention helper
 */
export const preventXSS = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div?.innerHTML;
};

/**
 * Secure cookie options
 */
export const SECURE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export default {
  CSP_DIRECTIVES,
  SECURITY_HEADERS,
  generateRequestSignature,
  validateRequestSignature,
  checkRateLimit,
  sanitizeInput,
  escapeSQLInput,
  generateCSRFToken,
  validateCSRFToken,
  generateSecureRandom,
  validatePasswordStrength,
  preventXSS,
  SECURE_COOKIE_OPTIONS
};