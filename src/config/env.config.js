import { z } from 'zod';

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_API_URL: z.string().url().default('http://localhost:3000'),
  VITE_GA_MEASUREMENT_ID: z.string().optional(),
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  VITE_GOOGLE_MAPS_API_KEY: z.string().optional(),
  VITE_HCAPTCHA_SITE_KEY: z.string().optional(),
  VITE_GEMINI_API_KEY: z.string().optional(),
  VITE_CLAUDE_API_KEY: z.string().optional(),
  VITE_PERPLEXITY_API_KEY: z.string().optional(),
  VITE_SHAPED_API_KEY: z.string().optional(),
  VITE_ENV: z.enum(['development', 'staging', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse({
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  VITE_HCAPTCHA_SITE_KEY: import.meta.env.VITE_HCAPTCHA_SITE_KEY,
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  VITE_CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY,
  VITE_PERPLEXITY_API_KEY: import.meta.env.VITE_PERPLEXITY_API_KEY,
  VITE_SHAPED_API_KEY: import.meta.env.VITE_SHAPED_API_KEY,
  VITE_ENV: import.meta.env.MODE,
});

if (!_env.success) {
  console.warn('⚠️ Environment Validation Failed:', _env.error.format());
  if (import.meta.env.MODE === 'production' || import.meta.env.MODE === 'staging') {
    throw new Error('Critical environment configuration missing for production');
  }
}

// Ensure at least basic keys exist to prevent downstream crashes, 
// using simple fallbacks if validation failed
export const env = _env.success ? _env.data : {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  VITE_ENV: import.meta.env.MODE,
  VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY,
  VITE_CLAUDE_API_KEY: import.meta.env.VITE_CLAUDE_API_KEY,
  VITE_PERPLEXITY_API_KEY: import.meta.env.VITE_PERPLEXITY_API_KEY,
  VITE_SHAPED_API_KEY: import.meta.env.VITE_SHAPED_API_KEY,
};
