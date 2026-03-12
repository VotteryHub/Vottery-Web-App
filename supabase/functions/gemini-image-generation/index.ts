declare const Deno: { env: { get(key: string): string | undefined } };

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.87.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const IMAGEN_MODEL = 'imagen-3.0-generate-002';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, numberOfImages = 1 } = await req.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid prompt' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${IMAGEN_MODEL}:predict?key=${GEMINI_API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        instances: [{ prompt: prompt.slice(0, 4000) }],
        parameters: {
          sampleCount: Math.min(Number(numberOfImages) || 1, 4),
          aspectRatio: '1:1',
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Gemini Imagen API error:', res.status, errText);
      return new Response(
        JSON.stringify({ error: `Image generation failed: ${res.status}`, details: errText.slice(0, 200) }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await res.json();
    const predictions = data?.predictions ?? [];
    const images = predictions.map((p: { bytesBase64Encoded?: string }) => ({
      base64: p?.bytesBase64Encoded ?? null,
      mimeType: 'image/png',
    })).filter((i: { base64: string | null }) => i.base64);

    return new Response(
      JSON.stringify({ images, model: IMAGEN_MODEL }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('gemini-image-generation error:', e);
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
