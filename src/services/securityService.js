import DOMPurify from 'dompurify';

// Add this block
import { createClient } from '@supabase/supabase-js';

// Initialize supabase client
const supabase = createClient(
  import.meta.env.VITE_PUBLIC_SUPABASE_URL || '',
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const securityService = {
  /**
   * Sanitize HTML content to prevent XSS attacks
   * @param {string} dirty - Unsanitized HTML string
   * @param {object} options - DOMPurify configuration options
   * @returns {string} Sanitized HTML string
   */
  sanitizeHTML(dirty, options = {}) {
    const defaultConfig = {
      ALLOWED_TAGS: [
        'b', 'i', 'em', 'strong', 'a', 'p', 'br',
        'ul', 'ol', 'li', 'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target'],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
      ...options
    };

    return DOMPurify?.sanitize(dirty, defaultConfig);
  },

  /**
   * Sanitize text content (strip all HTML)
   * @param {string} dirty - Unsanitized text
   * @returns {string} Plain text without HTML
   */
  sanitizeText(dirty) {
    return DOMPurify?.sanitize(dirty, { ALLOWED_TAGS: [] });
  },

  /**
   * Validate file upload
   * @param {File} file - File object to validate
   * @param {object} options - Validation options
   * @returns {object} { valid: boolean, error: string }
   */
  validateFileUpload(file, options = {}) {
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      maxSize = 5 * 1024 * 1024, // 5MB default
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    } = options;

    // Check file exists
    if (!file) {
      return { valid: false, error: 'No file provided' };
    }

    // Check file type
    if (!allowedTypes?.includes(file?.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed types: ${allowedTypes?.join(', ')}`
      };
    }

    // Check file extension
    const fileExtension = file?.name?.substring(file?.name?.lastIndexOf('.'))?.toLowerCase();
    if (!allowedExtensions?.includes(fileExtension)) {
      return {
        valid: false,
        error: `Invalid file extension. Allowed extensions: ${allowedExtensions?.join(', ')}`
      };
    }

    // Check file size
    if (file?.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024))?.toFixed(2);
      return {
        valid: false,
        error: `File too large. Maximum size: ${maxSizeMB}MB`
      };
    }

    // Check for double extensions (potential security risk)
    const nameParts = file?.name?.split('.');
    if (nameParts?.length > 2) {
      return {
        valid: false,
        error: 'Files with multiple extensions are not allowed'
      };
    }

    // Basic filename validation (no special characters)
    const filenameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!filenameRegex?.test(file?.name)) {
      return {
        valid: false,
        error: 'Filename contains invalid characters. Use only letters, numbers, hyphens, and underscores'
      };
    }

    return { valid: true, error: null };
  },

  /**
   * Validate and sanitize URL
   * @param {string} url - URL to validate
   * @returns {object} { valid: boolean, sanitized: string, error: string }
   */
  validateURL(url) {
    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:']?.includes(urlObj?.protocol)) {
        return {
          valid: false,
          sanitized: null,
          error: 'Only HTTP and HTTPS URLs are allowed'
        };
      }

      // Block localhost and private IPs
      const hostname = urlObj?.hostname?.toLowerCase();
      if (
        hostname === 'localhost' || hostname?.startsWith('127.') ||
        hostname?.startsWith('192.168.') ||
        hostname?.startsWith('10.') ||
        hostname?.startsWith('172.')
      ) {
        return {
          valid: false,
          sanitized: null,
          error: 'Private and local URLs are not allowed'
        };
      }

      return {
        valid: true,
        sanitized: urlObj?.toString(),
        error: null
      };
    } catch (error) {
      return {
        valid: false,
        sanitized: null,
        error: 'Invalid URL format'
      };
    }
  },

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean}
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  },

  /**
   * Sanitize user input for database queries
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove null bytes
    let sanitized = input?.replace(/\0/g, '');
    
    // Trim whitespace
    sanitized = sanitized?.trim();
    
    // Remove control characters except newlines and tabs
    sanitized = sanitized?.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    return sanitized;
  },

  /**
   * Generate secure random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  generateSecureToken(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte?.toString(16)?.padStart(2, '0'))?.join('');
  },

  /**
   * Validate CAPTCHA response
   * @param {string} token - CAPTCHA token
   * @returns {Promise<boolean>}
   */
  async validateCaptcha(token) {
    try {
      // This should be validated server-side via Edge Function
      const { data, error } = await supabase?.functions?.invoke('validate-captcha', {
        body: { token }
      });

      if (error) throw error;
      return data?.success || false;
    } catch (error) {
      console.error('CAPTCHA validation error:', error);
      return false;
    }
  }
};
