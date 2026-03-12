// @ts-ignore: Deno is available in Deno runtime
const Deno = globalThis.Deno;

const TELNYX_API_KEY = Deno?.env?.get('TELNYX_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*'
};

// Failure threshold for automatic failover (3 failures within 2 minutes triggers failover)
const FAILURE_THRESHOLD = 3;
const FAILURE_WINDOW_MS = 120000; // 2 minutes
const HEALTH_CHECK_INTERVAL_MS = 30000; // 30 seconds for recovery check

Deno?.serve(async (req) => {
  if (req?.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = await req?.json();
    const { event_type, data, occurred_at } = payload;

    console.log('Telnyx webhook received:', { event_type, messageId: data?.payload?.id });

    // Handle different webhook events
    switch (event_type) {
      case 'message.sent':
        await handleMessageSent(data?.payload);
        break;
      case 'message.delivered':
        await handleMessageDelivered(data?.payload);
        break;
      case 'message.failed':
        await handleMessageFailed(data?.payload);
        break;
      case 'message.bounced':
        await handleMessageBounced(data?.payload);
        break;
      case 'message.finalized':
        await handleMessageFinalized(data?.payload);
        break;
      default:
        console.log('Unhandled event type:', event_type);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Telnyx webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function handleMessageSent(payload) {
  console.log('Message sent:', payload?.id);
  await updateDeliveryStatus(payload?.id, 'sent', payload);
  // Reset failure count on successful send
  await recordProviderSuccess('telnyx');
}

async function handleMessageDelivered(payload) {
  console.log('Message delivered:', payload?.id);
  await updateDeliveryStatus(payload?.id, 'delivered', payload);
  
  // Update provider health on successful delivery
  await updateProviderHealth('telnyx', 'healthy', null);
  
  // Check if we should switch back to Telnyx from Twilio
  await checkAndRestoreTelnyx();
}

async function handleMessageFailed(payload) {
  console.log('Message failed:', payload?.id, payload?.errors);
  await updateDeliveryStatus(payload?.id, 'failed', payload);
  
  // Record failure and check if failover threshold is reached
  const errorCode = payload?.errors?.[0]?.code;
  const errorDetail = payload?.errors?.[0]?.detail || 'Unknown error';
  
  // Critical error codes that indicate provider issues (not just bad numbers)
  const providerErrorCodes = ['40001', '40002', '40003', '50001', '50002', '50003', '90001', '90002'];
  
  if (errorCode && providerErrorCodes?.includes(String(errorCode))) {
    await updateProviderHealth('telnyx', 'degraded', errorDetail);
    
    // Check if we've hit the failure threshold for automatic failover
    const shouldFailover = await checkFailoverThreshold('telnyx');
    if (shouldFailover) {
      await triggerAutomaticFailover('telnyx', 'twilio', `Provider error threshold reached: ${errorDetail}`);
    }
  } else {
    // Non-provider error (bad number, etc.) - record but don't affect health
    await recordProviderFailure('telnyx', errorDetail, false);
  }
}

async function handleMessageBounced(payload) {
  console.log('Message bounced:', payload?.id);
  await updateDeliveryStatus(payload?.id, 'bounced', payload);
  
  // Bounces may indicate provider issues if frequent
  await recordProviderFailure('telnyx', 'Message bounced', false);
}

async function handleMessageFinalized(payload) {
  console.log('Message finalized:', payload?.id, 'status:', payload?.to?.[0]?.status);
  const finalStatus = payload?.to?.[0]?.status || 'unknown';
  await updateDeliveryStatus(payload?.id, finalStatus, payload);
}

async function checkFailoverThreshold(provider) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const windowStart = new Date(Date.now() - FAILURE_WINDOW_MS)?.toISOString();
    
    const { count, error } = await supabase
      ?.from('sms_provider_failures')
      ?.select('*', { count: 'exact', head: true })
      ?.eq('provider', provider)
      ?.eq('is_provider_error', true)
      ?.gte('created_at', windowStart);

    if (error) {
      console.error('Error checking failure threshold:', error);
      return false;
    }

    return (count || 0) >= FAILURE_THRESHOLD;
  } catch (error) {
    console.error('Error in checkFailoverThreshold:', error);
    return false;
  }
}

async function recordProviderFailure(provider, errorMessage, isProviderError = true) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    await supabase?.from('sms_provider_failures')?.insert({
      provider,
      error_message: errorMessage,
      is_provider_error: isProviderError,
      created_at: new Date()?.toISOString()
    });
  } catch (error) {
    console.error('Error recording provider failure:', error);
  }
}

async function recordProviderSuccess(provider) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Update provider health to healthy on success
    await supabase?.from('sms_provider_health')?.insert({
      provider,
      status: 'healthy',
      error_message: null,
      checked_at: new Date()?.toISOString()
    });
  } catch (error) {
    console.error('Error recording provider success:', error);
  }
}

async function triggerAutomaticFailover(fromProvider, toProvider, reason) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    console.log(`🔄 AUTOMATIC FAILOVER: ${fromProvider} → ${toProvider}. Reason: ${reason}`);

    // Update provider health to offline
    await supabase?.from('sms_provider_health')?.insert({
      provider: fromProvider,
      status: 'offline',
      error_message: reason,
      checked_at: new Date()?.toISOString()
    });

    // Record failover event
    await supabase?.from('sms_failover_events')?.insert({
      from_provider: fromProvider,
      to_provider: toProvider,
      reason,
      triggered_at: new Date()?.toISOString()
    });

    // Update provider state to switch active provider
    const { data: stateData } = await supabase
      ?.from('sms_provider_state')
      ?.select('id')
      ?.limit(1)
      ?.single();

    if (stateData?.id) {
      await supabase?.from('sms_provider_state')?.update({
        active_provider: toProvider,
        telnyx_status: 'offline',
        twilio_status: 'healthy',
        failover_reason: reason,
        last_failover_at: new Date()?.toISOString(),
        last_checked_at: new Date()?.toISOString()
      })?.eq('id', stateData?.id);
    }

    // Log system alert
    await supabase?.from('system_alerts')?.insert({
      category: 'sms_failover',
      severity: 'critical',
      title: `SMS Automatic Failover: ${fromProvider} → ${toProvider}`,
      message: `Automatic failover triggered. ${reason}. SMS will now route through ${toProvider}.`,
      metadata: { fromProvider, toProvider, reason, triggeredAt: new Date()?.toISOString() }
    });

    console.log(`✅ Failover completed: Active provider is now ${toProvider}`);
  } catch (error) {
    console.error('Error triggering automatic failover:', error);
  }
}

async function checkAndRestoreTelnyx() {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    // Check current provider state
    const { data: stateData } = await supabase
      ?.from('sms_provider_state')
      ?.select('active_provider, telnyx_status')
      ?.limit(1)
      ?.single();

    // Only restore if currently on Twilio failover
    if (stateData?.active_provider !== 'twilio') return;

    // Check recent Telnyx health - if we're getting deliveries, it's healthy
    const windowStart = new Date(Date.now() - HEALTH_CHECK_INTERVAL_MS)?.toISOString();
    const { data: recentDeliveries } = await supabase
      ?.from('sms_delivery_logs')
      ?.select('id')
      ?.eq('provider', 'telnyx')
      ?.eq('status', 'delivered')
      ?.gte('updated_at', windowStart)
      ?.limit(1);

    if (recentDeliveries && recentDeliveries?.length > 0) {
      // Telnyx is delivering successfully - restore it as primary
      console.log('🔄 TELNYX RESTORED: Switching back from Twilio to Telnyx');

      await supabase?.from('sms_provider_state')?.update({
        active_provider: 'telnyx',
        telnyx_status: 'healthy',
        failover_reason: null,
        last_failover_at: null,
        last_checked_at: new Date()?.toISOString()
      })?.eq('id', stateData?.id || 1);

      // Record restoration event
      await supabase?.from('sms_failover_events')?.insert({
        from_provider: 'twilio',
        to_provider: 'telnyx',
        reason: 'telnyx_service_restored',
        triggered_at: new Date()?.toISOString()
      });

      console.log('✅ Telnyx restored as primary SMS provider');
    }
  } catch (error) {
    console.error('Error in checkAndRestoreTelnyx:', error);
  }
}

async function updateDeliveryStatus(externalId, status, webhookData) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { error } = await supabase?.from('sms_delivery_logs')?.update({
        status,
        webhook_data: webhookData,
        updated_at: new Date()?.toISOString()
      })?.eq('external_id', externalId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating delivery status:', error);
  }
}

async function updateProviderHealth(provider, status, errorMessage) {
  try {
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabase = createClient(
      Deno?.env?.get('SUPABASE_URL'),
      Deno?.env?.get('SUPABASE_SERVICE_ROLE_KEY')
    );

    const { error } = await supabase?.from('sms_provider_health')?.insert({
        provider,
        status,
        error_message: errorMessage,
        checked_at: new Date()?.toISOString()
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating provider health:', error);
  }
}