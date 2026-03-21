declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';
import { getCorsHeaders } from '../shared/corsConfig.ts';
import {
  getClientIp,
  logSqlInjectionEvent,
  scanPayloadForSqlInjection,
} from '../shared/sqlInjectionDetection.ts';
import { enforceUserEndpointHourlyLimit } from '../shared/userEndpointRateLimit.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { provider, method, payload } = body;

    const sqli = scanPayloadForSqlInjection(body);
    const clientIp = getClientIp(req);
    if (sqli.blocking) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: null,
        endpoint: '/ai-proxy',
        result: sqli,
        blocked: true,
      });
      return new Response(
        JSON.stringify({ error: 'Invalid request payload.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    if (sqli.hit) {
      await logSqlInjectionEvent({
        ip: clientIp,
        userId: user.id,
        endpoint: '/ai-proxy',
        result: sqli,
        blocked: false,
      });
    }

    const serviceClient = serviceKey
      ? createClient(supabaseUrl, serviceKey)
      : supabaseClient;

    const hourlyLimit = await resolveAiProxyHourlyLimit(serviceClient, user.id);
    const logicalEndpoint = `/ai-proxy/${provider}`;

    const rl = await enforceUserEndpointHourlyLimit(
      supabaseClient,
      user.id,
      logicalEndpoint,
      hourlyLimit
    );
    if (!rl.allowed) {
      return new Response(
        JSON.stringify({
          error: `Rate limit exceeded. Maximum ${hourlyLimit} AI requests per hour for your plan.`,
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const now = new Date();

    let response;

    switch (provider) {
      case 'openai':
        response = await handleOpenAI(method, payload);
        break;
      case 'anthropic':
        response = await handleAnthropic(method, payload);
        break;
      case 'perplexity':
        response = await handlePerplexity(method, payload);
        break;
      case 'gemini':
        response = await handleGemini(method, payload);
        break;
      default:
        throw new Error('Invalid AI provider');
    }

    // Log AI usage for audit
    await supabaseClient.from('ai_usage_logs').insert({
      user_id: user.id,
      provider,
      method,
      tokens_used: response.usage?.total_tokens || 0,
      cost_estimate: calculateCost(provider, response.usage?.total_tokens || 0),
      timestamp: now.toISOString()
    });

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleOpenAI(method: string, payload: any) {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) throw new Error('OpenAI API key not configured');

  let response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: payload.model || 'gpt-4-turbo',
      messages: payload.messages,
      max_tokens: Math.min(payload.max_tokens || 1000, 4000),
      temperature: payload.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  return await response.json();
}

async function handleAnthropic(method: string, payload: any) {
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('Anthropic API key not configured');

  let response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: payload.model || 'claude-3-5-sonnet-20241022',
      messages: payload.messages,
      max_tokens: Math.min(payload.max_tokens || 1000, 4000),
      temperature: payload.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  return await response.json();
}

async function handlePerplexity(method: string, payload: any) {
  const apiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!apiKey) throw new Error('Perplexity API key not configured');

  let response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: payload.model || 'sonar-pro',
      messages: payload.messages,
      max_tokens: Math.min(payload.max_tokens || 1000, 25000),
      temperature: payload.temperature || 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.statusText}`);
  }

  return await response.json();
}

async function handleGemini(method: string, payload: any) {
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) throw new Error('Gemini API key not configured');

  const model = payload.model || 'gemini-1.5-flash';
  const messages = payload.messages || [];
  const maxTokens = Math.min(payload.max_tokens || 1000, 8192);
  const temperature = payload.temperature ?? 0.7;

  const parts: { text?: string }[] = [];
  for (const msg of messages) {
    const role = (msg.role === 'assistant' ? 'model' : 'user') as string;
    const text = msg.content || '';
    if (text) parts.push({ text: `[${role}]\n${text}` });
  }
  const prompt = parts.map((p) => p.text).join('\n\n') || 'Hello';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature,
          responseMimeType: payload.response_mime_type || undefined,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const totalTokens =
    data?.usageMetadata?.totalTokenCount ?? 0;

  return {
    choices: [{ message: { role: 'assistant', content: text } }],
    usage: { total_tokens: totalTokens },
  };
}

function calculateCost(provider: string, tokens: number): number {
  const rates = {
    openai: 0.00003,
    anthropic: 0.000015,
    perplexity: 0.000005,
    gemini: 0.00000075, // Gemini 1.5 Flash ~$0.075/1M input, ~$0.30/1M output; use blended
  };
  return (tokens / 1000) * (rates[provider as keyof typeof rates] || 0);
}

async function resolveAiProxyHourlyLimit(
  serviceClient: ReturnType<typeof createClient>,
  userId: string
): Promise<number> {
  const base = 20;
  try {
    const { data: rows } = await serviceClient
      .from('user_subscriptions')
      .select('status, is_active, subscription_plans(plan_name)')
      .eq('user_id', userId)
      .limit(25);

    const active = (rows || []).filter((r: Record<string, unknown>) =>
      r?.status === 'active' || r?.is_active === true
    );
    if (active.length === 0) return base;

    let max = base;
    for (const r of active) {
      const plans = r?.subscription_plans as { plan_name?: string } | null;
      const name = (plans?.plan_name || '').toLowerCase();
      if (/(enterprise|elite|business|vip)/.test(name)) max = Math.max(max, 120);
      else if (/(pro|premium|plus)/.test(name)) max = Math.max(max, 60);
      else if (/(basic|standard|starter)/.test(name)) max = Math.max(max, 35);
      else max = Math.max(max, 45);
    }
    return max;
  } catch (e) {
    console.warn('resolveAiProxyHourlyLimit fallback', e);
    return base;
  }
}