/**
 * Claude model A/B comparison — same Anthropic Messages API as other Vottery services.
 * Models must match Mobile/Web naming for parity.
 */
import { aiProxyService } from './aiProxyService';

const DEFAULT_MODELS = [
  { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
];

async function callClaude(model, userPrompt) {
  const started = performance.now();
  try {
    const { data, error } = await aiProxyService.callAnthropic(
      [{ role: 'user', content: userPrompt }],
      { model, maxTokens: 1024, temperature: 0.2 }
    );
    const latencyMs = Math.round(performance.now() - started);

    if (error) {
      return {
        error: error?.message || 'Anthropic proxy request failed',
        latencyMs,
        inputTokens: null,
        outputTokens: null,
        text: null,
      };
    }

    const text =
      data?.content?.map((c) => c?.text).filter(Boolean).join('\n') ||
      data?.choices?.[0]?.message?.content ||
      '';
    const inputTokens = data?.usage?.input_tokens ?? data?.usage?.prompt_tokens ?? null;
    const outputTokens = data?.usage?.output_tokens ?? data?.usage?.completion_tokens ?? null;

    return {
      error: null,
      latencyMs,
      inputTokens,
      outputTokens,
      text,
    };
  } catch (e) {
    return {
      error: e?.message || 'Network error',
      latencyMs: Math.round(performance.now() - started),
      inputTokens: null,
      outputTokens: null,
      text: null,
    };
  }
}

export const claudeModelComparisonService = {
  DEFAULT_MODELS,

  async compareModels(userPrompt, models = DEFAULT_MODELS) {
    const prompt = (userPrompt || '').trim();
    if (!prompt) {
      return { results: [], error: 'Enter a task description' };
    }

    const results = await Promise.all(
      models.map(async (m) => {
        const out = await callClaude(m.id, prompt);
        return {
          modelId: m.id,
          label: m.label,
          ...out,
        };
      })
    );

    const ranked = [...results]
      .filter((r) => !r.error && r.latencyMs != null)
      .sort((a, b) => a.latencyMs - b.latencyMs);
    const recommended =
      ranked.find((r) => r.text) || ranked[0] || results[0] || null;

    return {
      results,
      error: null,
      recommendation: recommended
        ? {
            modelId: recommended.modelId,
            label: recommended.label,
            reason: 'Lowest latency among successful responses (tie-break: first).',
          }
        : null,
    };
  },
};
