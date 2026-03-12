// Webhook replay attack prevention with timestamp validation
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const WEBHOOK_TOLERANCE_SECONDS = 300; // 5 minutes

export const validateWebhookTimestamp = (timestamp: string | number): boolean => {
  const webhookTime = typeof timestamp === 'string' ? parseInt(timestamp) : timestamp;
  const currentTime = Math.floor(Date.now() / 1000);
  const age = currentTime - webhookTime;

  if (age > WEBHOOK_TOLERANCE_SECONDS) {
    console.warn(`Webhook too old: ${age} seconds`);
    return false;
  }

  if (age < -30) {
    console.warn(`Webhook timestamp in future: ${age} seconds`);
    return false;
  }

  return true;
};

export const checkWebhookIdempotency = async (
  webhookId: string,
  timestamp: string | number
): Promise<boolean> => {
  const idempotencyKey = `webhook:${webhookId}:${timestamp}`;

  // Check if webhook already processed
  const { data: existing } = await supabase
    .from('webhook_idempotency')
    .select('id')
    .eq('idempotency_key', idempotencyKey)
    .single();

  if (existing) {
    console.warn(`Duplicate webhook detected: ${idempotencyKey}`);
    return false;
  }

  // Store idempotency key
  await supabase
    .from('webhook_idempotency')
    .insert({
      idempotency_key: idempotencyKey,
      processed_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
    });

  return true;
};

export const validateStripeWebhook = async (
  signature: string,
  body: string,
  secret: string
): Promise<{ valid: boolean; timestamp?: number }> => {
  const elements = signature.split(',');
  const timestampElement = elements.find(e => e.startsWith('t='));
  
  if (!timestampElement) {
    return { valid: false };
  }

  const timestamp = parseInt(timestampElement.substring(2));

  // Validate timestamp
  if (!validateWebhookTimestamp(timestamp)) {
    return { valid: false, timestamp };
  }

  return { valid: true, timestamp };
};