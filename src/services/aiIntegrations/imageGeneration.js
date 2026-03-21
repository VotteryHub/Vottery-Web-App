import { callLambdaFunction } from '../aiClient';

/**
 * Lambda endpoint for image generation
 */
const IMAGE_GENERATION_ENDPOINT = import.meta.env?.VITE_AWS_LAMBDA_IMAGE_GENERATION_URL;

/** Default to OpenAI DALL-E for image generation, with Gemini fallback. */
const DEFAULT_IMAGE_PROVIDER = 'OPEN_AI';
const DEFAULT_IMAGE_MODEL = 'dall-e-3';

/**
 * Generate image from any AI provider. Defaults to GEMINI (Imagen) when provider/model omitted.
 *
 * @param {string} [provider] - Provider identifier ('OPEN_AI' | 'GEMINI'); defaults to GEMINI
 * @param {string} [model] - Model name; defaults to Gemini Imagen model
 * @param {string} prompt - Image description prompt
 * @param {object} options - Additional parameters
 * @returns {Promise<object>} Raw Lambda or Edge response
 */
export async function generateImage(provider, model, prompt, options = {}) {
  const resolvedProvider = provider || DEFAULT_IMAGE_PROVIDER;
  const resolvedModel = model || (
    resolvedProvider === 'GEMINI'
      ? 'imagen-3.0-generate-002'
      : DEFAULT_IMAGE_MODEL
  );

  if (!IMAGE_GENERATION_ENDPOINT) {
    return generateImageViaGeminiEdge(prompt, options);
  }

  const payload = {
    provider: resolvedProvider,
    model: resolvedModel,
    prompt,
    parameters: options,
  };

  const response = await callLambdaFunction(
    IMAGE_GENERATION_ENDPOINT,
    payload
  );

  return response;
}

/** Call Supabase Edge gemini-image-generation when Lambda is not configured (Gemini-only path). */
async function generateImageViaGeminiEdge(prompt, options = {}) {
  const { supabase } = await import('../../lib/supabase');
  const { data: session } = (await supabase?.auth?.getSession())?.data ?? {};
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase?.functions?.invoke('gemini-image-generation', {
    body: { prompt: String(prompt).slice(0, 4000), ...options },
  });
  if (error) throw new Error(error.message || 'Gemini image generation failed');
  return data ?? {};
}