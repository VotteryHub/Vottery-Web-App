declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { provider, method, payload } = await req.json();
    
    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Rate limiting check
    const { data: rateLimitData } = await supabaseClient
      .from('api_rate_limits')
      .select('request_count, window_start')
      .eq('user_id', user.id)
      .eq('endpoint', `/ai-proxy/${provider}`)
      .single();

    const now = new Date();
    const windowStart = rateLimitData?.window_start ? new Date(rateLimitData.window_start) : now;
    const hoursSinceWindowStart = (now.getTime() - windowStart.getTime()) / (1000 * 60 * 60);

    if (hoursSinceWindowStart < 1 && (rateLimitData?.request_count || 0) >= 20) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Maximum 20 requests per hour.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update rate limit
    if (hoursSinceWindowStart >= 1) {
      await supabaseClient.from('api_rate_limits').upsert({
        user_id: user.id,
        endpoint: `/ai-proxy/${provider}`,
        request_count: 1,
        window_start: now.toISOString()
      });
    } else {
      await supabaseClient.from('api_rate_limits').upsert({
        user_id: user.id,
        endpoint: `/ai-proxy/${provider}`,
        request_count: (rateLimitData?.request_count || 0) + 1,
        window_start: rateLimitData?.window_start || now.toISOString()
      });
    }

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