import { env } from './config/env.config.js';
import Telnyx from 'telnyx';
import * as Sentry from '@sentry/node';

const app = express();
const PORT = env.PORT || 3001;

// Initialize Sentry
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
  app.use(Sentry.Handlers.requestHandler());
}

// Initialize Telnyx
const telnyx = new Telnyx(env.TELNYX_API_KEY);

// Initialize Stripe
const stripe = new Stripe(env.STRIPE_SECRET_KEY);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://js.stripe.com", "https://maps.googleapis.com", "https://www.google-analytics.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*.supabase.co", "https://*.stripe.com"],
      connectSrc: ["'self'", "https://*.supabase.co", "https://api.stripe.com", "https://*.sentry.io", "https://www.google-analytics.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      upgradeInsecureRequests: [],
    },
  },
}));

app.use(cors({
  origin: env.ALLOWED_ORIGINS,
  credentials: true
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app?.use('/api/', apiLimiter);

// Body parser (except for Stripe webhooks)
app?.use((req, res, next) => {
  if (req?.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    bodyParser?.json()(req, res, next);
  }
});

// Utility: Convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toCamelCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const camelKey = key?.replace(/_([a-z])/g, (_, letter) => letter?.toUpperCase());
    acc[camelKey] = toCamelCase(obj?.[key]);
    return acc;
  }, {});
};

// Utility: Convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj?.map(toSnakeCase);
  return Object.keys(obj)?.reduce((acc, key) => {
    const snakeKey = key?.replace(/[A-Z]/g, letter => `_${letter?.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj?.[key]);
    return acc;
  }, {});
};

// Utility: Trigger webhook
const triggerWebhook = async (eventType, payload) => {
  try {
    const { data: webhooks } = await supabase?.from('webhook_configurations')?.select('*')?.eq('event_type', eventType)?.eq('is_active', true);

    if (!webhooks || webhooks?.length === 0) return;

    const webhookPromises = webhooks?.map(async (webhook) => {
      const webhookPayload = {
        event_id: crypto?.randomUUID(),
        event_type: eventType,
        timestamp: new Date()?.toISOString(),
        data: payload
      };

      const signature = crypto?.createHmac('sha256', webhook?.secret_key)?.update(JSON.stringify(webhookPayload))?.digest('hex');

      try {
        const response = await fetch(webhook?.webhook_url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Signature': signature,
            'X-Event-Type': eventType
          },
          body: JSON.stringify(webhookPayload)
        });

        // Log webhook delivery
        await supabase?.from('webhook_delivery_logs')?.insert({
          webhook_id: webhook?.id,
          event_type: eventType,
          payload: webhookPayload,
          status_code: response?.status,
          status: response?.ok ? 'delivered' : 'failed',
          response_body: await response?.text()
        });

        return { success: response?.ok, webhookId: webhook?.id };
      } catch (error) {
        await supabase?.from('webhook_delivery_logs')?.insert({
          webhook_id: webhook?.id,
          event_type: eventType,
          payload: webhookPayload,
          status: 'failed',
          error_message: error?.message
        });
        return { success: false, webhookId: webhook?.id, error: error?.message };
      }
    });

    await Promise.all(webhookPromises);
  } catch (error) {
    console.error('Webhook trigger error:', error);
  }
};

// ============================================
// LOTTERY API ENDPOINTS (Gated by Elections Module)
// ============================================

app.use('/api/lottery/*', requireFeature('elections_dashboard'));

// POST /api/lottery/cast-vote - Cast vote and generate lottery ticket
app?.post('/api/lottery/cast-vote', async (req, res) => {
  try {
    const { electionId, userId, voteData, participationFee } = req?.body;

    if (!electionId || !userId || !voteData) {
      return res?.status(400)?.json({ error: 'Missing required fields' });
    }

    // Check if participation fee is required
    const { data: election } = await supabase?.from('elections')?.select('participation_fee_enabled, participation_fee_amount, is_lotterized')?.eq('id', electionId)?.single();

    if (election?.participation_fee_enabled && participationFee) {
      // Process payment
      const paymentIntent = await stripe?.paymentIntents?.create({
        amount: Math.round(election?.participation_fee_amount * 100), // Convert to cents
        currency: 'inr',
        metadata: {
          election_id: electionId,
          user_id: userId,
          type: 'participation_fee'
        }
      });

      // Store payment record
      await supabase?.from('participation_fee_transactions')?.insert({
        election_id: electionId,
        user_id: userId,
        amount: election?.participation_fee_amount,
        stripe_payment_intent_id: paymentIntent?.id,
        status: 'pending'
      });

      // Return payment intent for client confirmation
      return res?.json({
        requiresPayment: true,
        clientSecret: paymentIntent?.client_secret,
        paymentIntentId: paymentIntent?.id
      });
    }

    // Generate lottery ticket ID if lotterized
    const lotteryTicketId = election?.is_lotterized 
      ? `LT-${Date.now()}-${crypto?.randomUUID()?.substr(0, 8)?.toUpperCase()}`
      : null;

    // Cast vote
    const { data: vote, error } = await supabase?.from('votes')?.insert(toSnakeCase({
        electionId,
        userId,
        ...voteData,
        lotteryTicketId,
        blockchainHash: `0x${crypto?.randomBytes(32)?.toString('hex')}`,
        voteHash: crypto?.randomBytes(32)?.toString('hex')
      }))?.select()?.single();

    if (error) throw error;

    // Trigger webhook: vote.cast
    await triggerWebhook('vote.cast', {
      voteId: vote?.id,
      electionId,
      userId,
      lotteryTicketId,
      timestamp: new Date()?.toISOString()
    });

    res?.json({
      success: true,
      data: toCamelCase(vote),
      lotteryTicketId
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// GET /api/lottery/verify/:ticketId - Verify lottery ticket
app?.get('/api/lottery/verify/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req?.params;

    const { data: vote, error } = await supabase?.from('votes')?.select(`
        *,
        elections(id, title, status, end_date),
        zero_knowledge_proofs(*)
      `)?.eq('lottery_ticket_id', ticketId)?.single();

    if (error || !vote) {
      return res?.status(404)?.json({ error: 'Ticket not found' });
    }

    res?.json({
      success: true,
      data: toCamelCase(vote),
      verified: true
    });
  } catch (error) {
    console.error('Verify ticket error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// GET /api/lottery/results/:electionId - Get lottery results
app?.get('/api/lottery/results/:electionId', async (req, res) => {
  try {
    const { electionId } = req?.params;

    const { data: election, error: electionError } = await supabase?.from('elections')?.select(`
        *,
        election_options(*),
        prize_distributions(*)
      `)?.eq('id', electionId)?.single();

    if (electionError) throw electionError;

    const { data: votes } = await supabase?.from('votes')?.select('*')?.eq('election_id', electionId);

    res?.json({
      success: true,
      data: {
        election: toCamelCase(election),
        totalVotes: votes?.length || 0,
        winners: toCamelCase(election?.prize_distributions || [])
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// GET /api/audit/logs - Get audit logs (Admin/Mod/Manager only)
app?.get('/api/audit/logs', requirePermission('admin:view_logs'), async (req, res) => {
  try {
    const { electionId, startDate, endDate, limit = 100 } = req?.query;

    let query = supabase?.from('cryptographic_audit_logs')?.select('*')?.order('timestamp', { ascending: false })?.limit(parseInt(limit));

    if (electionId) {
      query = query?.eq('election_id', electionId);
    }

    if (startDate) {
      query = query?.gte('timestamp', startDate);
    }

    if (endDate) {
      query = query?.lte('timestamp', endDate);
    }

    const { data, error } = await query;

    if (error) throw error;

    res?.json({
      success: true,
      data: toCamelCase(data),
      count: data?.length || 0
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// POST /api/lottery/draw/complete - Trigger draw completion (Admin only)
app?.post('/api/lottery/draw/complete', requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { electionId, winners } = req?.body;

    if (!electionId || !winners) {
      return res?.status(400)?.json({ error: 'Missing required fields' });
    }

    // Update election status
    await supabase?.from('elections')?.update({ status: 'completed' })?.eq('id', electionId);

    // Store prize distributions
    const distributions = winners?.map(winner => ({
      election_id: electionId,
      user_id: winner?.userId,
      prize_tier: winner?.tier,
      prize_amount: winner?.amount,
      distribution_status: 'pending'
    }));

    await supabase?.from('prize_distributions')?.insert(distributions);

    // Trigger webhook: draw.completed
    await triggerWebhook('draw.completed', {
      electionId,
      winners: winners?.map(w => w?.userId),
      totalPrizePool: winners?.reduce((sum, w) => sum + w?.amount, 0),
      timestamp: new Date()?.toISOString()
    });

    // Trigger webhook: winner.announced for each winner
    for (const winner of winners) {
      await triggerWebhook('winner.announced', {
        electionId,
        userId: winner?.userId,
        prizeTier: winner?.tier,
        prizeAmount: winner?.amount,
        timestamp: new Date()?.toISOString()
      });
    }

    res?.json({
      success: true,
      message: 'Draw completed and webhooks triggered'
    });
  } catch (error) {
    console.error('Complete draw error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// ============================================
// WEBHOOK MANAGEMENT ENDPOINTS
// ============================================

// POST /api/webhooks/configure - Configure webhook (Admin only)
app?.post('/api/webhooks/configure', requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { webhookUrl, eventTypes, description } = req?.body;

    if (!webhookUrl || !eventTypes || eventTypes?.length === 0) {
      return res?.status(400)?.json({ error: 'Missing required fields' });
    }

    const secretKey = crypto?.randomBytes(32)?.toString('hex');

    const webhooks = eventTypes?.map(eventType => ({
      webhook_url: webhookUrl,
      event_type: eventType,
      secret_key: secretKey,
      is_active: true,
      description
    }));

    const { data, error } = await supabase?.from('webhook_configurations')?.insert(webhooks)?.select();

    if (error) throw error;

    res?.json({
      success: true,
      data: toCamelCase(data),
      secretKey
    });
  } catch (error) {
    console.error('Configure webhook error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// GET /api/webhooks/list - List configured webhooks
app?.get('/api/webhooks/list', async (req, res) => {
  try {
    const { data, error } = await supabase?.from('webhook_configurations')?.select('*')?.order('created_at', { ascending: false });

    if (error) throw error;

    res?.json({
      success: true,
      data: toCamelCase(data)
    });
  } catch (error) {
    console.error('List webhooks error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// DELETE /api/webhooks/:webhookId - Delete webhook (Admin only)
app?.delete('/api/webhooks/:webhookId', requireRole(['admin', 'super_admin']), async (req, res) => {
  try {
    const { webhookId } = req?.params;

    const { error } = await supabase?.from('webhook_configurations')?.delete()?.eq('id', webhookId);

    if (error) throw error;

    res?.json({
      success: true,
      message: 'Webhook deleted successfully'
    });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res?.status(500)?.json({ error: error?.message });
  }
});

// ============================================
// STRIPE WEBHOOK HANDLER
// ============================================

app?.post('/api/webhooks/stripe', bodyParser?.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req?.headers?.['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe?.webhooks?.constructEvent(req?.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err?.message);
    return res?.status(400)?.send(`Webhook Error: ${err?.message}`);
  }

  // Handle the event
  switch (event?.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event?.data?.object;
      
      // Update participation fee transaction
      await supabase?.from('participation_fee_transactions')?.update({ status: 'completed' })?.eq('stripe_payment_intent_id', paymentIntent?.id);

      // Trigger internal webhook
      await triggerWebhook('payment.succeeded', {
        paymentIntentId: paymentIntent?.id,
        amount: paymentIntent?.amount / 100,
        currency: paymentIntent?.currency,
        metadata: paymentIntent?.metadata
      });
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event?.data?.object;
      
      await supabase?.from('participation_fee_transactions')?.update({ status: 'failed' })?.eq('stripe_payment_intent_id', failedPayment?.id);
      break;

    case 'payout.paid':
      const payout = event?.data?.object;
      
      await supabase?.from('prize_distributions')?.update({ distribution_status: 'completed' })?.eq('stripe_payout_id', payout?.id);
      break;

    default:
      console.log(`Unhandled event type ${event?.type}`);
  }

  res?.json({ received: true });
});

// ============================================
// SECURE SMS PROXY
// ============================================

const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 SMS per hour
  message: 'Too many SMS requests from this IP, please try again later.'
});

app.post('/api/sms/send', smsLimiter, async (req, res) => {
  try {
    const { to, message, messagingProfileId } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authError || !user) return res.status(401).json({ error: 'Unauthorized' });

    const response = await telnyx.messages.create({
      from: env.TELNYX_PHONE_NUMBER,
      to,
      text: message,
      messaging_profile_id: messagingProfileId || env.TELNYX_MESSAGING_PROFILE_ID,
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('SMS Proxy Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Sentry error handler
if (env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// ============================================
// HEALTH CHECK
// ============================================

app?.get('/health', (req, res) => {
  res?.json({
    status: 'healthy',
    timestamp: new Date()?.toISOString(),
    uptime: process.uptime()
  });
});

// Start server
app?.listen(PORT, () => {
  console.log(`🚀 Lottery API Server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/api/webhooks/stripe`);
});

export default app;