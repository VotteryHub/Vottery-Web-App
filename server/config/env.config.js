import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().transform(Number).default('3001'),
  SUPABASE_URL: z.string().url().default(process.env.VITE_SUPABASE_URL || ''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',')).default('http://localhost:5173'),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  TELNYX_API_KEY: z.string().min(1),
  TELNYX_MESSAGING_PROFILE_ID: z.string().min(1),
  TELNYX_PHONE_NUMBER: z.string().min(1),
  SENTRY_DSN: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Server environment validation failed:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
