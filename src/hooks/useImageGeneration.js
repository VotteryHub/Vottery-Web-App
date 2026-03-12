import { useState, useCallback } from 'react';
import { generateImage } from '../services/aiIntegrations/imageGeneration';

/** Default to Gemini (Imagen) for image generation. */
const DEFAULT_PROVIDER = 'GEMINI';
const DEFAULT_MODEL = 'imagen-3.0-generate-002';

/**
 * Hook for image generation. Defaults to GEMINI (Imagen) when provider/model omitted.
 *
 * @param {string} [provider] - Provider ('OPEN_AI' | 'GEMINI'); default GEMINI
 * @param {string} [model] - Model name; default Gemini Imagen
 */
export function useImageGeneration(provider = DEFAULT_PROVIDER, model = DEFAULT_MODEL) {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(
    async (prompt, options = {}) => {
      setImage(null);
      setIsLoading(true);
      setError(null);

      try {
        const result = await generateImage(provider, model, prompt, options);
        setImage(result);
        return result;
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [provider, model]
  );

  return { image, isLoading, error, generate };
}
