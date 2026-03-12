/// <reference lib="deno.ns" />

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

declare const Deno: {
  env: { get(key: string): string | undefined };
};

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const AUTO_REMOVE_THRESHOLD = 0.85;

/** Map AI primary_category to content_flags.violation_type */
const CATEGORY_TO_VIOLATION: Record<string, string> = {
  hate_speech: 'hate_speech',
  harassment: 'harassment',
  violence: 'policy_violation',
  spam: 'spam',
  misinformation: 'misinformation',
  safe: 'other',
};
const CONTENT_FLAGS_VIOLATIONS = ['misinformation', 'spam', 'policy_violation', 'hate_speech', 'harassment', 'election_integrity', 'other'];

function toViolationType(primaryCategory: string): string {
  const v = CATEGORY_TO_VIOLATION[primaryCategory?.toLowerCase()] ?? 'policy_violation';
  return CONTENT_FLAGS_VIOLATIONS.includes(v) ? v : 'policy_violation';
}

function confidenceToSeverity(confidence: number): 'low' | 'medium' | 'high' | 'critical' {
  if (confidence >= 0.85) return 'critical';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

/** Normalize body: support both manual { type, table, record } and Supabase webhook { type: 'INSERT', table, record } */
function normalizeBody(body: unknown): { table: string; record: Record<string, unknown> } | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const table = b.table as string;
  const record = b.record as Record<string, unknown>;
  if (!table || !record || typeof record !== 'object') return null;
  if (!['posts', 'comments', 'elections'].includes(table)) return null;
  return { table, record };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const body = await req.json().catch(() => ({}));
    const parsed = normalizeBody(body);
    if (!parsed) {
      return new Response(JSON.stringify({ message: 'No content to moderate' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const { table, record } = parsed;

    let content = (record.content || record.body || record.text || '') as string;
    if (table === 'elections') {
      content = [record.title, record.description, record.question].filter(Boolean).join('\n');
    }
    if (!content || content.length < 10) {
      return new Response(JSON.stringify({ message: 'Content too short to moderate' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authorId = (record.user_id || record.author_id || record.created_by) as string | undefined;

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: `Analyze this content for policy violations. Return JSON only.

Content: "${(content as string).substring(0, 500)}"

Return: { "confidence": 0.0-1.0, "categories": ["hate_speech"|"spam"|"violence"|"misinformation"|"safe"], "primary_category": string, "reasoning": string, "auto_remove": boolean }

Confidence 0=safe, 1=severe violation. auto_remove=true if confidence>0.85.`
        }]
      })
    });

    let moderationResult = { confidence: 0, categories: ['safe'], primary_category: 'safe', reasoning: 'Analysis unavailable', auto_remove: false };

    if (anthropicResponse.ok) {
      const anthropicData = await anthropicResponse.json();
      const responseText = anthropicData?.content?.[0]?.text || '{}';
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) moderationResult = JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('Parse error:', e);
      }
    }

    const contentType = table === 'posts' ? 'post' : table === 'elections' ? 'election' : 'comment';

    await supabase
      .from('content_moderation_results')
      .upsert({
        content_id: record.id,
        content_type: contentType,
        content_text: content.substring(0, 1000),
        confidence_score: moderationResult.confidence,
        categories: moderationResult.categories,
        primary_category: moderationResult.primary_category,
        reasoning: moderationResult.reasoning,
        auto_removed: moderationResult.auto_remove,
        moderated_at: new Date().toISOString(),
      }, { onConflict: 'content_id,content_type' });

    const isAutoRemove = moderationResult.confidence >= AUTO_REMOVE_THRESHOLD || moderationResult.auto_remove;
    const violationType = toViolationType(moderationResult.primary_category);
    const severity = confidenceToSeverity(moderationResult.confidence);

    const insertFlag = async (status: 'pending_review' | 'auto_removed') => {
      const { data: flagRow, error: flagErr } = await supabase
        .from('content_flags')
        .insert({
          content_type: contentType,
          content_id: record.id,
          content_snippet: content.substring(0, 300),
          author_id: authorId || null,
          flagger_id: null,
          violation_type: violationType,
          severity,
          confidence_score: moderationResult.confidence,
          detection_method: 'ai',
          status,
        })
        .select('id')
        .single();
      if (flagErr) console.error('content_flags insert error:', flagErr);
      return flagRow?.id;
    };

    if (isAutoRemove) {
      const updatePayload = table === 'elections'
        ? { status: 'rejected', moderation_notes: `AI moderation: ${moderationResult.primary_category} (${(moderationResult.confidence * 100).toFixed(0)}% confidence)`, updated_at: new Date().toISOString() }
        : { status: 'removed', removed_reason: `AI moderation: ${moderationResult.primary_category} (${(moderationResult.confidence * 100).toFixed(0)}% confidence)`, removed_at: new Date().toISOString() };

      await supabase.from(table).update(updatePayload).eq('id', record.id);

      const flagId = await insertFlag('auto_removed');

      if (authorId) {
        await supabase.from('notifications').insert({
          user_id: authorId,
          type: 'content_removed',
          title: 'Content removed',
          message: `Your ${contentType} was removed for violating our community guidelines: ${moderationResult.primary_category}. You can appeal this decision within 30 days.`,
          metadata: { content_id: record.id, content_type: contentType, flag_id: flagId, category: moderationResult.primary_category },
          is_read: false,
        });
      }

      return new Response(JSON.stringify({
        action: 'auto_removed',
        confidence: moderationResult.confidence,
        category: moderationResult.primary_category,
        flag_id: flagId,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (moderationResult.confidence >= 0.4 && moderationResult.primary_category !== 'safe') {
      await insertFlag('pending_review');
    }

    return new Response(JSON.stringify({
      action: 'flagged_for_review',
      confidence: moderationResult.confidence,
      category: moderationResult.primary_category,
      auto_removed: false,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

  } catch (error) {
    console.error('Moderation error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
