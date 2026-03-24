const HIGH_STAKES_USE_CASES = new Set([
  'dispute_resolution',
  'forensic_security',
  'high_stakes_dispute',
  'security_forensics',
]);
const BLOCKED_PROVIDERS = ['OPENAI', 'PERPLEXITY'];

export function resolveAIProvider(provider, options = {}) {
  const requested = String(provider || '').toUpperCase();
  const useCase = String(options?.useCase || '').toLowerCase();
  const highStakes = options?.highStakes === true || HIGH_STAKES_USE_CASES.has(useCase);

  if (BLOCKED_PROVIDERS.some((p) => requested.includes(p))) {
    // Hard policy: OpenAI/Perplexity requests are remapped for Batch 1 cost controls.
    return highStakes ? 'ANTHROPIC_HAIKU' : 'GEMINI';
  }

  if (highStakes) {
    if (requested.includes('OPUS')) return 'ANTHROPIC_OPUS';
    if (requested.includes('ANTHROPIC') || requested.includes('CLAUDE')) return 'ANTHROPIC_HAIKU';
    return 'ANTHROPIC_HAIKU';
  }

  // Default everything else to Gemini for cost control.
  return 'GEMINI';
}

export function resolveModel(provider, model, options = {}) {
  const p = String(provider || '').toUpperCase();
  if (p === 'GEMINI') return model || 'gemini-1.5-pro';
  if (p === 'ANTHROPIC_OPUS') return model || 'claude-3-opus';
  if (p === 'ANTHROPIC_HAIKU') return model || 'claude-3-haiku';
  return model || 'gemini-1.5-pro';
}
