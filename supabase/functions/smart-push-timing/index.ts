import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';

// Deno global is available in Deno runtime environment
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await userClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const clientIp = getClientIp(req);
    const sqli = scanPayloadForSqlInjection(body);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/smart-push-timing',
        result: sqli,
        blocked: true,
      });
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/smart-push-timing',
        result: sqli,
        blocked: false,
      });
    }

    const { userId, notificationPayload } = body;

    if (!userId || userId !== user.id) {
      return new Response(JSON.stringify({ error: 'userId must match authenticated user' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch user activity logs for the past 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: activityLogs, error: logsError } = await supabase
      .from('user_activity_logs')
      .select('created_at, activity_type')
      .eq('user_id', userId)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false })
      .limit(500);

    if (logsError) {
      console.error('Error fetching activity logs:', logsError);
    }

    // Analyze hourly engagement patterns
    const hourCounts = new Array(24).fill(0);
    const dayOfWeekCounts = new Array(7).fill(0);

    (activityLogs || []).forEach((log: any) => {
      const date = new Date(log.created_at);
      hourCounts[date.getHours()]++;
      dayOfWeekCounts[date.getDay()]++;
    });

    const totalActivity = hourCounts.reduce((a, b) => a + b, 0);
    const maxHourCount = Math.max(...hourCounts);
    const optimalHour = hourCounts.indexOf(maxHourCount);
    const confidence = totalActivity > 50
      ? (maxHourCount / totalActivity > 0.15 ? 'high' : 'medium')
      : 'low';

    // Find top 3 engagement windows
    const topWindows = hourCounts
      .map((count, hour) => ({ hour, count, percentage: totalActivity > 0 ? Math.round((count / totalActivity) * 100) : 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Calculate next optimal send time
    const now = new Date();
    let nextSendTime = new Date(now);
    nextSendTime.setHours(optimalHour, 0, 0, 0);
    if (nextSendTime <= now) {
      nextSendTime.setDate(nextSendTime.getDate() + 1);
    }

    const result = {
      userId,
      optimalHour,
      confidence,
      nextSendTime: nextSendTime.toISOString(),
      topEngagementWindows: topWindows,
      hourlyDistribution: hourCounts,
      dayOfWeekDistribution: dayOfWeekCounts,
      totalActivityAnalyzed: totalActivity,
      analysisTimestamp: new Date().toISOString()
    };

    // If notification payload provided, schedule it
    if (notificationPayload) {
      const { error: scheduleError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notificationPayload.title,
          message: notificationPayload.body,
          type: 'push',
          data: notificationPayload.data || {},
          is_read: false,
          created_at: nextSendTime.toISOString()
        });

      if (scheduleError) {
        console.error('Error scheduling notification:', scheduleError);
      }
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Smart push timing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
