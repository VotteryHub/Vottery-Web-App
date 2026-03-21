/**
 * Claude model A/B comparison — same Anthropic Messages API as other Vottery services.
 * Models must match Mobile/Web naming for parity.
 */
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

const DEFAULT_MODELS = [
  { id: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
  { id: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  { id: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
];

async function callClaude(model, userPrompt) {
  const apiKey = import.meta.env?.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      error: 'VITE_ANTHROPIC_API_KEY is not configured',
      latencyMs: null,
      inputTokens: null,
      outputTokens: null,
      text: null,
    };
  }

  const started = performance.now();
  try {
    const res = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    const latencyMs = Math.round(performance.now() - started);
    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        error: json?.error?.message || res.statusText || 'Anthropic request failed',
        latencyMs,
        inputTokens: null,
        outputTokens: null,
        text: null,
      };
    }

    const text =
      json?.content?.map((c) => c?.text).filter(Boolean).join('\n') || '';
    const inputTokens = json?.usage?.input_tokens ?? null;
    const outputTokens = json?.usage?.output_tokens ?? null;

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
