import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.2';
import { corsHeaders } from '../shared/corsConfig.ts';

type VerifyPurpose =
  | 'age_gate'
  | 'payout_kyc'
  | 'high_stakes_vote'
  | 'brand_onboarding'
  | 'fraud_review';

interface VerifyRequestBody {
  purpose: VerifyPurpose;
  userId: string;
  electionId?: string | null;
  minAgeRequired?: number | null;
  geo?: string | null;
  sessionContext?: Record<string, unknown>;
  sessionData?: Record<string, unknown>;
}

interface ProviderResult {
  provider: 'sumsub' | 'veriff';
  success: boolean;
  confidence?: number;
  reason?: string;
  raw?: unknown;
}

const env = Deno.env;

const SUMSUB_TOKEN = env.get('SUMSUB_TOKEN') || '';
const SUMSUB_SECRET = env.get('SUMSUB_SECRET') || '';
const VERIFF_API_KEY = env.get('VERIFF_API_KEY') || '';
const VERIFF_SHARED_SECRET = env.get('VERIFF_SHARED_SECRET') || '';

const SUPABASE_URL = env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_ROLE_KEY = env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function callSumsub(
  _body: VerifyRequestBody,
): Promise<ProviderResult> {
  if (!SUMSUB_TOKEN || !SUMSUB_SECRET) {
    return {
      provider: 'sumsub',
      success: false,
      reason: 'sumsub_not_configured',
    };
  }

  // NOTE: This is a placeholder. In staging, wire this to Sumsub SDK/REST:
  // - Create applicant / access token
  // - Start workflow
  // - Poll or rely on webhooks
  // For now, we simulate success to exercise the orchestration path.
  return {
    provider: 'sumsub',
    success: true,
    confidence: 90,
    reason: 'simulated_success',
  };
}

async function callVeriff(
  _body: VerifyRequestBody,
): Promise<ProviderResult> {
  if (!VERIFF_API_KEY || !VERIFF_SHARED_SECRET) {
    return {
      provider: 'veriff',
      success: false,
      reason: 'veriff_not_configured',
    };
  }

  // Placeholder – similar to Sumsub: start Veriff session, then evaluate decision.
  return {
    provider: 'veriff',
    success: true,
    confidence: 88,
    reason: 'simulated_success',
  };
}

function shouldFallback(
  primary: ProviderResult,
  body: VerifyRequestBody,
): boolean {
  if (!primary.success) return true;

  const confidence = primary.confidence ?? 0;
  if (confidence < 80) return true;

  const ctx = body.sessionContext || {};
  const isHighStakes = Boolean(ctx['is_high_stakes_vote']) ||
    body.purpose === 'high_stakes_vote' ||
    body.purpose === 'payout_kyc';

  if (isHighStakes && confidence < 85) return true;

  return false;
}

async function logIdentityEvent(
  userId: string,
  outcome: {
    primaryProvider: string;
    fallbackProvider?: string;
    finalProvider: string;
    success: boolean;
    confidence?: number;
    purpose: VerifyPurpose;
    electionId?: string | null;
  },
) {
  try {
    await supabaseAdmin.from('identity_verification_events').insert({
      user_id: userId,
      purpose: outcome.purpose,
      election_id: outcome.electionId ?? null,
      primary_provider: outcome.primaryProvider,
      fallback_provider: outcome.fallbackProvider ?? null,
      final_provider: outcome.finalProvider,
      success: outcome.success,
      confidence_score: outcome.confidence ?? null,
    });
  } catch (_err) {
    // best-effort logging; do not break the flow
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as VerifyRequestBody;
    if (!body.userId || !body.purpose) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '').trim(),
    );

    if (userError || !user || user.id !== body.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const sumsubResult = await callSumsub(body);

    let finalResult: ProviderResult = sumsubResult;
    let fallbackUsed = false;

    if (shouldFallback(sumsubResult, body)) {
      const veriffResult = await callVeriff(body);
      fallbackUsed = true;
      if (veriffResult.success) {
        finalResult = veriffResult;
      }
    }

    await logIdentityEvent(body.userId, {
      primaryProvider: 'sumsub',
      fallbackProvider: fallbackUsed ? 'veriff' : undefined,
      finalProvider: finalResult.provider,
      success: finalResult.success,
      confidence: finalResult.confidence,
      purpose: body.purpose,
      electionId: body.electionId ?? null,
    });

    const responsePayload = {
      provider: finalResult.provider,
      success: finalResult.success,
      confidence: finalResult.confidence ?? null,
      reason: finalResult.reason ?? null,
      fallbackUsed,
    };

    return new Response(JSON.stringify(responsePayload), {
      status: finalResult.success ? 200 : 422,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('identity-orchestrator error', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});

