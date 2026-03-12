// Shared Zod validation for lottery API (same error keys as Web/Mobile for 400 responses)
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

export const TicketsVerifySchema = z.object({
  vote_id: z.string().uuid('INVALID_VOTE_ID'),
  election_id: z.string().uuid().optional(),
});
export type TicketsVerifyBody = z.infer<typeof TicketsVerifySchema>;

export const DrawsInitiateSchema = z.object({
  election_id: z.string().uuid('INVALID_ELECTION_ID'),
  draw_type: z.enum(['random', 'weighted']).optional(),
  num_winners: z.number().int().min(1).max(1000).optional(),
});
export type DrawsInitiateBody = z.infer<typeof DrawsInitiateSchema>;

export const AuditLogsSchema = z.object({
  election_id: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(500).optional(),
});
export type AuditLogsQuery = z.infer<typeof AuditLogsSchema>;

export function parseTicketsVerify(body: unknown): { success: true; data: TicketsVerifyBody } | { success: false; error: string; key: string } {
  const result = TicketsVerifySchema.safeParse(body);
  if (result.success) return { success: true, data: result.data };
  const first = result.error.errors[0];
  return { success: false, error: first?.message || 'Validation failed', key: first?.path?.[0] as string || 'validation' };
}

export function parseDrawsInitiate(body: unknown): { success: true; data: DrawsInitiateBody } | { success: false; error: string; key: string } {
  const result = DrawsInitiateSchema.safeParse(body);
  if (result.success) return { success: true, data: result.data };
  const first = result.error.errors[0];
  return { success: false, error: first?.message || 'Validation failed', key: first?.path?.[0] as string || 'validation' };
}

export function parseAuditLogs(query: Record<string, string>): { success: true; data: AuditLogsQuery } | { success: false; error: string; key: string } {
  const result = AuditLogsSchema.safeParse(query);
  if (result.success) return { success: true, data: result.data };
  const first = result.error.errors[0];
  return { success: false, error: first?.message || 'Validation failed', key: first?.path?.[0] as string || 'validation' };
}
