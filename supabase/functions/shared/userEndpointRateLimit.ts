/**
 * Per-user hourly counters using public.user_endpoint_rate_counters (same as ai-proxy).
 */

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; remaining: 0; limit: number };

export async function enforceUserEndpointHourlyLimit(
  supabaseUserScoped: {
    from: (t: string) => {
      select: (c: string) => {
        eq: (a: string, v: string) => {
          eq: (a2: string, v2: string) => { maybeSingle: () => Promise<{ data: Record<string, unknown> | null }> };
        };
      };
      upsert: (row: Record<string, unknown>) => Promise<unknown>;
    };
  },
  userId: string,
  endpoint: string,
  hourlyLimit: number
): Promise<RateLimitResult> {
  const { data: rateLimitData } = await supabaseUserScoped
    .from('user_endpoint_rate_counters')
    .select('request_count, window_start')
    .eq('user_id', userId)
    .eq('endpoint', endpoint)
    .maybeSingle();

  const now = new Date();
  const windowStart = rateLimitData?.window_start
    ? new Date(rateLimitData.window_start as string)
    : now;
  const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);
  const count = (rateLimitData?.request_count as number) || 0;

  if (hoursSinceWindowStart < 1 && count >= hourlyLimit) {
    return { allowed: false, remaining: 0, limit: hourlyLimit };
  }

  if (hoursSinceWindowStart >= 1) {
    await supabaseUserScoped.from('user_endpoint_rate_counters').upsert({
      user_id: userId,
      endpoint,
      request_count: 1,
      window_start: now.toISOString(),
      updated_at: now.toISOString(),
    });
    return { allowed: true, remaining: hourlyLimit - 1 };
  }

  const next = count + 1;
  await supabaseUserScoped.from('user_endpoint_rate_counters').upsert({
    user_id: userId,
    endpoint,
    request_count: next,
    window_start: (rateLimitData?.window_start as string) || now.toISOString(),
    updated_at: now.toISOString(),
  });
  return { allowed: true, remaining: Math.max(0, hourlyLimit - next) };
}
