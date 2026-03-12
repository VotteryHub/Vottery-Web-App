// Comprehensive input validation with Zod schemas
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Election validation schema
export const ElectionSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be less than 200 characters')
    .regex(/^[a-zA-Z0-9\s\-.,!?'"]+$/, 'Invalid characters in title'),
  
  description: z.string()
    .max(2000, 'Description too long')
    .optional(),
    
  options: z.array(z.object({
    text: z.string()
      .min(1, 'Option text required')
      .max(100, 'Option text too long'),
    image: z.string().url().optional()
  }))
  .min(2, 'At least 2 options required')
  .max(10, 'Maximum 10 options allowed'),
  
  vp_reward: z.number()
    .int()
    .min(1, 'VP reward must be positive')
    .max(1000, 'VP reward too high'),
    
  ends_at: z.string()
    .datetime()
    .refine(date => new Date(date) > new Date(), 'End date must be in future')
});

// Vote validation schema
export const VoteSchema = z.object({
  election_id: z.string().uuid('Invalid election ID'),
  option_id: z.string().uuid('Invalid option ID'),
  user_id: z.string().uuid('Invalid user ID')
});

// Search query sanitization
export const sanitizeSearchTerm = (term: string): string => {
  return term
    .replace(/[%_\\]/g, '\\$&')
    .replace(/[<>"']/g, '')
    .substring(0, 100);
};

// SQL column validation
export const validateSortColumn = (column: string, allowedColumns: string[]): string => {
  return allowedColumns.includes(column) ? column : allowedColumns[0];
};

export const validateSortOrder = (order: string): 'asc' | 'desc' => {
  return order === 'asc' || order === 'desc' ? order as 'asc' | 'desc' : 'desc';
};

// VP transaction validation
export const VPTransactionSchema = z.object({
  user_id: z.string().uuid(),
  amount: z.number().int().min(1).max(10000),
  transaction_type: z.enum(['earn', 'spend', 'transfer']),
  source_type: z.string().max(50),
  source_id: z.string().uuid().optional()
});

// User input sanitization
export const sanitizeUserInput = (input: string, maxLength: number = 500): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, maxLength);
};