/**
 * Heuristic SQL-injection detection for Edge payloads (logging + optional blocking).
 * Logs to public.security_events (service role). Does not replace parameterized queries.
 */

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

export type SqlInjectionScanResult = {
  hit: boolean;
  blocking: boolean;
  patterns: string[];
  sample?: string;
};

const BLOCKING_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'union_select', re: /\bunion\s+all\s+select\b/i },
  { name: 'union_select2', re: /\bunion\s+select\b/i },
  { name: 'stacked_drop', re: /;\s*(drop|truncate)\s+/i },
  { name: 'stacked_delete', re: /;\s*delete\s+from\b/i },
  { name: 'stacked_alter', re: /;\s*alter\s+table\b/i },
  { name: 'xp_cmdshell', re: /\bxp_cmdshell\b/i },
  { name: 'into_outfile', re: /\binto\s+(outfile|dumpfile)\b/i },
  { name: 'exec_sp', re: /\bexec(\s+|\()\s*(sp_|xp_)/i },
  { name: 'boolean_sqli', re: /\bor\b\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i },
  { name: 'comment_trick', re: /\/\*![\s\S]*?\*\// },
];

const MONITOR_PATTERNS: { name: string; re: RegExp }[] = [
  { name: 'sql_comment', re: /--[\s\r\n]|\/\*|\*\// },
  { name: 'semicolon_chain', re: /;\s*(select|insert|update|delete)\b/i },
  { name: 'sleep_benchmark', re: /\b(sleep|benchmark|waitfor)\s*\(/i },
  { name: 'information_schema', re: /\binformation_schema\b/i },
];

const MAX_STRING_SCAN_LEN = 8000;

function scanString(s: string): SqlInjectionScanResult {
  const slice = s.length > MAX_STRING_SCAN_LEN ? s.slice(0, MAX_STRING_SCAN_LEN) : s;
  const patterns: string[] = [];

  for (const { name, re } of BLOCKING_PATTERNS) {
    if (re.test(slice)) {
      patterns.push(`block:${name}`);
    }
  }
  if (patterns.length > 0) {
    return { hit: true, blocking: true, patterns, sample: slice.slice(0, 240) };
  }

  for (const { name, re } of MONITOR_PATTERNS) {
    if (re.test(slice)) {
      patterns.push(`monitor:${name}`);
    }
  }
  if (patterns.length > 0) {
    return { hit: true, blocking: false, patterns, sample: slice.slice(0, 240) };
  }

  return { hit: false, blocking: false, patterns: [] };
}

export function scanPayloadForSqlInjection(value: unknown): SqlInjectionScanResult {
  const merged: SqlInjectionScanResult = {
    hit: false,
    blocking: false,
    patterns: [],
  };

  const visit = (v: unknown): void => {
    if (v === null || v === undefined) return;
    if (typeof v === 'string') {
      const r = scanString(v);
      if (r.hit) {
        merged.hit = true;
        merged.patterns.push(...r.patterns);
        if (r.blocking) merged.blocking = true;
        if (!merged.sample && r.sample) merged.sample = r.sample;
      }
      return;
    }
    if (typeof v === 'number' || typeof v === 'boolean') return;
    if (Array.isArray(v)) {
      for (const item of v) visit(item);
      return;
    }
    if (typeof v === 'object') {
      for (const k of Object.keys(v as Record<string, unknown>)) {
        visit((v as Record<string, unknown>)[k]);
      }
    }
  };

  visit(value);
  merged.patterns = [...new Set(merged.patterns)];
  return merged;
}

export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    return xff.split(',')[0]?.trim() || 'unknown';
  }
  return req.headers.get('x-real-ip') || 'unknown';
}

export async function logSqlInjectionEvent(opts: {
  ip?: string;
  userId?: string | null;
  endpoint: string;
  result: SqlInjectionScanResult;
  blocked: boolean;
}): Promise<void> {
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key || !opts.result.hit) return;

  try {
    await fetch(`${url}/rest/v1/security_events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        event_type: 'sql_injection_attempt',
        severity: opts.blocked ? 'high' : 'medium',
        ip_address: opts.ip ?? null,
        user_id: opts.userId ?? null,
        endpoint: opts.endpoint,
        request_data: {
          patterns: opts.result.patterns,
          sample: opts.result.sample ?? null,
        },
        reason: 'Payload matched SQL injection heuristics',
        blocked: opts.blocked,
      }),
    });
  } catch (e) {
    console.error('logSqlInjectionEvent failed', e);
  }
}
