import { supabase } from '../lib/supabase';
import { getChatCompletion } from './aiIntegrations/chatCompletion';

const ZONES = [
  { id: 'usa', name: 'USA', multiplier: 1.0, currency: 'USD', flag: '🇺🇸' },
  { id: 'western_europe', name: 'Western Europe', multiplier: 0.95, currency: 'EUR', flag: '🇪🇺' },
  { id: 'eastern_europe', name: 'Eastern Europe', multiplier: 0.45, currency: 'EUR', flag: '🌍' },
  { id: 'india', name: 'India', multiplier: 0.25, currency: 'INR', flag: '🇮🇳' },
  { id: 'latin_america', name: 'Latin America', multiplier: 0.35, currency: 'USD', flag: '🌎' },
  { id: 'africa', name: 'Africa', multiplier: 0.20, currency: 'USD', flag: '🌍' },
  { id: 'middle_east_asia', name: 'Middle East/Asia', multiplier: 0.60, currency: 'USD', flag: '🌏' },
  { id: 'australasia', name: 'Australasia', multiplier: 0.90, currency: 'AUD', flag: '🇦🇺' }
];

/** Canonical fee_zone (1–8) labels — must match Claude prompt + mobile. */
const CANONICAL_ZONE_ORDER = ZONES.map((z) => z.name);

function normalizeZoneLabel(label) {
  const s = String(label || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
  if (/\busa\b|united states|u\.s\.|u\.s\.a/.test(s)) return 'USA';
  if (s.includes('western europe')) return 'Western Europe';
  if (s.includes('eastern europe')) return 'Eastern Europe';
  if (/\bindia\b/.test(s)) return 'India';
  if (s.includes('latin america')) return 'Latin America';
  if (/\bafrica\b/.test(s) && !s.includes('south africa')) return 'Africa';
  if (s.includes('middle east')) return 'Middle East/Asia';
  if (s.includes('australasia') || /\baustralia\b/.test(s) || s.includes('oceania') || s.includes('new zealand'))
    return 'Australasia';
  return String(label || '').trim();
}

export const revenueIntelligenceService = {
  zones: ZONES,

  // Fetch SMS advertising revenue from ad slot manager
  async getSMSAdRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at, transaction_type')
        ?.in('transaction_type', ['ad_revenue', 'sms_ad_revenue', 'ad_slot_revenue'])
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) || 0;
      return {
        source: 'SMS Advertising',
        icon: '📱',
        color: '#6366f1',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Revenue from SMS ad slot placements across all zones'
      };
    } catch (error) {
      return {
        source: 'SMS Advertising',
        icon: '📱',
        color: '#6366f1',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Revenue from SMS ad slot placements across all zones'
      };
    }
  },

  // Fetch participatory election sponsorship revenue
  async getElectionSponsorshipRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('sponsored_elections')
        ?.select('budget_total, created_at, status')
        ?.eq('status', 'ACTIVE')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, e) => sum + parseFloat(e?.budget_total || 0), 0) || 0;
      return {
        source: 'Election Sponsorships',
        icon: '🗳️',
        color: '#8b5cf6',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Participatory election sponsorship deals and CPE revenue'
      };
    } catch (error) {
      return {
        source: 'Election Sponsorships',
        icon: '🗳️',
        color: '#8b5cf6',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Participatory election sponsorship deals and CPE revenue'
      };
    }
  },

  // Fetch carousel monetization revenue (all 3 types)
  async getCarouselMonetizationRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at, transaction_type')
        ?.in('transaction_type', ['carousel_revenue', 'carousel_sponsorship', 'carousel_monetization'])
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) || 0;
      const horizontal = total * 0.42;
      const vertical = total * 0.35;
      const gradient = total * 0.23;
      return {
        source: 'Carousel Monetization',
        icon: '🎠',
        color: '#ec4899',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Horizontal Snap, Vertical Stack & Gradient Flow carousel revenue',
        breakdown: [
          { type: 'Horizontal Snap', amount: horizontal },
          { type: 'Vertical Stack', amount: vertical },
          { type: 'Gradient Flow', amount: gradient }
        ]
      };
    } catch (error) {
      return {
        source: 'Carousel Monetization',
        icon: '🎠',
        color: '#ec4899',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Horizontal Snap, Vertical Stack & Gradient Flow carousel revenue',
        breakdown: [
          { type: 'Horizontal Snap', amount: 0 },
          { type: 'Vertical Stack', amount: 0 },
          { type: 'Gradient Flow', amount: 0 }
        ]
      };
    }
  },

  // Fetch creator tier subscription income
  async getCreatorTierSubscriptionRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('carousel_creator_subscriptions')
        ?.select('price_paid, created_at, status')
        ?.eq('status', 'active')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, s) => sum + parseFloat(s?.price_paid || 0), 0) || 0;
      return {
        source: 'Creator Tier Subscriptions',
        icon: '👑',
        color: '#f59e0b',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Bronze/Silver/Gold/Platinum/Elite creator subscription income'
      };
    } catch (error) {
      return {
        source: 'Creator Tier Subscriptions',
        icon: '👑',
        color: '#f59e0b',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Bronze/Silver/Gold/Platinum/Elite creator subscription income'
      };
    }
  },

  // Fetch template marketplace sales
  async getTemplateMarketplaceRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('carousel_template_purchases')
        ?.select('amount_paid, created_at')
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, p) => sum + parseFloat(p?.amount_paid || 0), 0) || 0;
      return {
        source: 'Template Marketplace',
        icon: '🛒',
        color: '#10b981',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Template sales, downloads, and marketplace commissions'
      };
    } catch (error) {
      return {
        source: 'Template Marketplace',
        icon: '🛒',
        color: '#10b981',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Template sales, downloads, and marketplace commissions'
      };
    }
  },

  // Fetch direct sponsorship deals
  async getDirectSponsorshipRevenue(timeRange = '30d') {
    try {
      const startDate = this.getStartDate(timeRange);
      const { data, error } = await supabase
        ?.from('wallet_transactions')
        ?.select('amount, created_at, transaction_type')
        ?.in('transaction_type', ['sponsorship', 'direct_sponsorship', 'brand_deal'])
        ?.gte('created_at', startDate?.toISOString());

      if (error) throw error;

      const total = data?.reduce((sum, t) => sum + parseFloat(t?.amount || 0), 0) || 0;
      return {
        source: 'Direct Sponsorships',
        icon: '🤝',
        color: '#3b82f6',
        total,
        transactions: data?.length || 0,
        growth: 0,
        trend: total > 0 ? 'up' : 'stable',
        description: 'Direct brand sponsorship deals and partnership revenue'
      };
    } catch (error) {
      return {
        source: 'Direct Sponsorships',
        icon: '🤝',
        color: '#3b82f6',
        total: 0,
        transactions: 0,
        growth: 0,
        trend: 'stable',
        description: 'Direct brand sponsorship deals and partnership revenue'
      };
    }
  },

  // Consolidate all 6 revenue streams
  async getAllRevenueStreams(timeRange = '30d') {
    try {
      const [smsAds, elections, carousel, tiers, templates, sponsorships] = await Promise.all([
        this.getSMSAdRevenue(timeRange),
        this.getElectionSponsorshipRevenue(timeRange),
        this.getCarouselMonetizationRevenue(timeRange),
        this.getCreatorTierSubscriptionRevenue(timeRange),
        this.getTemplateMarketplaceRevenue(timeRange),
        this.getDirectSponsorshipRevenue(timeRange)
      ]);

      const streams = [smsAds, elections, carousel, tiers, templates, sponsorships];
      const totalRevenue = streams?.reduce((sum, s) => sum + s?.total, 0);

      return streams?.map(stream => ({
        ...stream,
        percentage: totalRevenue > 0 ? ((stream?.total / totalRevenue) * 100)?.toFixed(1) : 0
      }));
    } catch (error) {
      console.error('Error consolidating revenue streams:', error);
      return [];
    }
  },

  // Get historical revenue data for forecasting
  async getHistoricalRevenue(months = 6) {
    try {
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);
      const startIso = startDate.toISOString();

      const [walletRes, electionRes, subscriptionRes, templateRes] = await Promise.all([
        supabase
          ?.from('wallet_transactions')
          ?.select('amount, transaction_type, created_at')
          ?.gte('created_at', startIso),
        supabase
          ?.from('sponsored_elections')
          ?.select('budget_total, created_at, status')
          ?.eq('status', 'ACTIVE')
          ?.gte('created_at', startIso),
        supabase
          ?.from('carousel_creator_subscriptions')
          ?.select('price_paid, created_at, status')
          ?.eq('status', 'active')
          ?.gte('created_at', startIso),
        supabase
          ?.from('carousel_template_purchases')
          ?.select('amount_paid, created_at')
          ?.gte('created_at', startIso),
      ]);

      if (walletRes?.error) throw walletRes.error;
      if (electionRes?.error) throw electionRes.error;
      if (subscriptionRes?.error) throw subscriptionRes.error;
      if (templateRes?.error) throw templateRes.error;

      const buckets = {};
      const monthKey = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      };
      const ensureMonth = (key) => {
        if (!buckets[key]) {
          buckets[key] = {
            revenue: 0,
            smsAds: 0,
            elections: 0,
            carousel: 0,
            tiers: 0,
            templates: 0,
            sponsorships: 0
          };
        }
        return buckets[key];
      };

      (walletRes?.data || []).forEach((row) => {
        const key = monthKey(row?.created_at);
        const bucket = ensureMonth(key);
        const amount = parseFloat(row?.amount || 0) || 0;
        const type = row?.transaction_type || '';
        if (['ad_revenue', 'sms_ad_revenue', 'ad_slot_revenue'].includes(type)) bucket.smsAds += amount;
        if (['carousel_revenue', 'carousel_sponsorship', 'carousel_monetization'].includes(type)) bucket.carousel += amount;
        if (['sponsorship', 'direct_sponsorship', 'brand_deal'].includes(type)) bucket.sponsorships += amount;
      });

      (electionRes?.data || []).forEach((row) => {
        const key = monthKey(row?.created_at);
        const bucket = ensureMonth(key);
        bucket.elections += parseFloat(row?.budget_total || 0) || 0;
      });

      (subscriptionRes?.data || []).forEach((row) => {
        const key = monthKey(row?.created_at);
        const bucket = ensureMonth(key);
        bucket.tiers += parseFloat(row?.price_paid || 0) || 0;
      });

      (templateRes?.data || []).forEach((row) => {
        const key = monthKey(row?.created_at);
        const bucket = ensureMonth(key);
        bucket.templates += parseFloat(row?.amount_paid || 0) || 0;
      });

      return Object.entries(buckets)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => {
          const [year, month] = key.split('-').map(Number);
          const label = new Date(year, month - 1, 1)?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          const revenue = (value.smsAds + value.elections + value.carousel + value.tiers + value.templates + value.sponsorships);
          return {
            month: label,
            revenue: Math.round(revenue),
            smsAds: Math.round(value.smsAds),
            elections: Math.round(value.elections),
            carousel: Math.round(value.carousel),
            tiers: Math.round(value.tiers),
            templates: Math.round(value.templates),
            sponsorships: Math.round(value.sponsorships)
          };
        });
    } catch (error) {
      console.error('Error fetching historical revenue:', error);
      return [];
    }
  },

  // Generate AI-powered revenue forecast using Claude
  async generateRevenueForecast(historicalData, streams, forecastDays = 30) {
    try {
      const totalCurrent = streams?.reduce((sum, s) => sum + s?.total, 0);
      const avgGrowth = streams?.reduce((sum, s) => sum + s?.growth, 0) / streams?.length;

      const prompt = `You are a revenue intelligence analyst for Vottery, a participatory voting and social platform. Analyze the following revenue data and provide a ${forecastDays}-day revenue forecast.

Current Monthly Revenue Streams:
${streams?.map(s => `- ${s?.source}: $${s?.total?.toLocaleString()} (${s?.growth}% growth, ${s?.percentage}% of total)`)?.join('\n')}

Total Current Monthly Revenue: $${totalCurrent?.toLocaleString()}
Average Growth Rate: ${avgGrowth?.toFixed(1)}%

Historical Monthly Totals (last 6 months):
${historicalData?.slice(-6)?.map(d => `- ${d?.month}: $${d?.revenue?.toLocaleString()}`)?.join('\n')}

Provide a JSON response with this exact structure:
{
  "forecast_total": <number>,
  "confidence_interval": { "low": <number>, "high": <number> },
  "growth_projection": <percentage>,
  "key_drivers": ["driver1", "driver2", "driver3"],
  "risks": ["risk1", "risk2"],
  "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
  "stream_forecasts": [
    { "source": "SMS Advertising", "forecast": <number>, "confidence": "high|medium|low" },
    { "source": "Election Sponsorships", "forecast": <number>, "confidence": "high|medium|low" },
    { "source": "Carousel Monetization", "forecast": <number>, "confidence": "high|medium|low" },
    { "source": "Creator Tier Subscriptions", "forecast": <number>, "confidence": "high|medium|low" },
    { "source": "Template Marketplace", "forecast": <number>, "confidence": "high|medium|low" },
    { "source": "Direct Sponsorships", "forecast": <number>, "confidence": "high|medium|low" }
  ],
  "summary": "<2-3 sentence executive summary>"
}`;

      const response = await getChatCompletion(
        'ANTHROPIC',
        'claude-sonnet-4-5-20250929',
        [{ role: 'user', content: prompt }],
        { temperature: 0.3, max_tokens: 1500 }
      );

      const content = response?.choices?.[0]?.message?.content || '';
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch?.[0]);
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating forecast:', error);
      const totalCurrent = streams?.reduce((sum, s) => sum + s?.total, 0);
      const multiplier = forecastDays === 30 ? 1.12 : forecastDays === 60 ? 1.26 : 1.42;
      const sorted = [...(streams || [])].sort((a, b) => (b?.total || 0) - (a?.total || 0));
      const keyDrivers =
        sorted?.slice(0, 3)?.map(s => `${s?.source}: ${s?.percentage ?? 0}% of consolidated streams (current window)`) ||
        [];
      const opportunities = sorted?.slice(0, 2)?.map(s => `Track ${s?.source} — largest live stream in window`) || [];
      return {
        forecast_total: Math.round(totalCurrent * multiplier),
        confidence_interval: {
          low: Math.round(totalCurrent * multiplier * 0.88),
          high: Math.round(totalCurrent * multiplier * 1.14)
        },
        growth_projection: ((multiplier - 1) * 100)?.toFixed(1),
        key_drivers:
          keyDrivers?.length > 0
            ? keyDrivers
            : ['No consolidated stream totals available for this window'],
        risks: [
          'Claude forecast unavailable — using deterministic multiplier on current stream totals only',
          'Does not include forward-looking market or seasonality (model error)'
        ],
        opportunities:
          opportunities?.length > 0
            ? opportunities
            : ['Capture live wallet and sponsorship data to improve drivers list'],
        stream_forecasts: streams?.map(s => ({
          source: s?.source,
          forecast: Math.round(s?.total * multiplier),
          confidence: s?.growth > 20 ? 'high' : s?.growth > 10 ? 'medium' : 'low'
        })),
        summary: `Deterministic ${forecastDays}-day projection: ${((multiplier - 1) * 100)?.toFixed(0)}% scale on current consolidated stream totals ($${Math.round(totalCurrent || 0)?.toLocaleString()}). Claude unavailable or returned non-JSON.`
      };
    }
  },

  /**
   * Zone rows from Supabase payout + fee_zone mapping (no fabricated marketing copy).
   * Uses prize_redemptions + user_profiles + country_restrictions.
   */
  async buildDataDrivenZoneRecommendations(streams) {
    const startDate = this.getStartDate('90d');
    const topStream =
      (streams || []).reduce(
        (best, s) => (!best || (s?.total || 0) > (best?.total || 0) ? s : best),
        null
      ) || null;
    const topStreamName = topStream?.source || 'Consolidated streams';

    const buildFromMultiplierBaseline = () =>
      CANONICAL_ZONE_ORDER.map((zoneName, i) => {
        const z = ZONES[i];
        const maxM = Math.max(...ZONES.map((x) => x.multiplier), 0.001);
        const current_index = Math.min(100, Math.max(15, Math.round(20 + (z.multiplier / maxM) * 75)));
        const opportunity_score = Math.min(95, Math.max(20, Math.round(40 + (1 - z.multiplier / maxM) * 50)));
        return {
          zone: zoneName,
          current_index,
          opportunity_score,
          primary_strategy: `No completed prize_redemptions in the last 90 days; largest consolidated stream: ${topStreamName}.`,
          top_revenue_stream: topStreamName,
          growth_potential: 'TBD',
          tactics: [
            'Populate user_profiles.country_iso and purchasing_power_zone for payout attribution',
            'Write prize_redemptions.country_code at payout time for country_restrictions.fee_zone mapping',
            'Re-run after completed redemption volume accrues'
          ],
          cultural_notes:
            'Baseline from platform fee multipliers — not payout-derived until redemption telemetry exists.'
        };
      });

    try {
      const { data: redemptions, error: rErr } = await supabase
        .from('prize_redemptions')
        .select('user_id, country_code, final_amount, amount, created_at')
        .eq('status', 'completed')
        .gte('created_at', startDate.toISOString());

      if (rErr) throw rErr;

      if (!redemptions?.length) {
        return buildFromMultiplierBaseline();
      }

      const userIds = [...new Set(redemptions.map((r) => r.user_id).filter(Boolean))];
      const profilesById = {};
      const chunkSize = 120;
      for (let i = 0; i < userIds.length; i += chunkSize) {
        const chunk = userIds.slice(i, i + chunkSize);
        const { data: profs, error: pErr } = await supabase
          .from('user_profiles')
          .select('id, purchasing_power_zone, country_iso')
          .in('id', chunk);
        if (pErr) throw pErr;
        (profs || []).forEach((p) => {
          profilesById[p.id] = p;
        });
      }

      const { data: restrictions, error: cErr } = await supabase
        .from('country_restrictions')
        .select('country_code, fee_zone')
        .not('fee_zone', 'is', null);
      if (cErr) throw cErr;

      const countryToZone = {};
      (restrictions || []).forEach((row) => {
        const code = String(row.country_code || '').trim().toUpperCase();
        if (!code || row.fee_zone == null) return;
        const fz = parseInt(row.fee_zone, 10);
        if (fz >= 1 && fz <= 8) countryToZone[code] = fz;
      });

      const buckets = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };
      let unknownAmount = 0;

      const resolveZone = (profile, redemptionCountry) => {
        const pz = parseInt(profile?.purchasing_power_zone, 10);
        if (pz >= 1 && pz <= 8) return pz;
        const rc = String(redemptionCountry || '').trim().toUpperCase();
        if (rc && countryToZone[rc] != null) return countryToZone[rc];
        const iso = String(profile?.country_iso || '').trim().toUpperCase();
        if (iso && countryToZone[iso] != null) return countryToZone[iso];
        return null;
      };

      redemptions.forEach((row) => {
        const amt = parseFloat(row.final_amount ?? row.amount ?? 0) || 0;
        const profile = profilesById[row.user_id];
        const z = resolveZone(profile, row.country_code);
        if (z == null) {
          unknownAmount += amt;
          return;
        }
        buckets[z] += amt;
      });

      if (unknownAmount > 0) {
        const per = unknownAmount / 8;
        for (let z = 1; z <= 8; z += 1) buckets[z] += per;
      }

      const totalPayout = Object.values(buckets).reduce((a, b) => a + b, 0);
      if (totalPayout <= 0) {
        return buildFromMultiplierBaseline();
      }

      const maxBucket = Math.max(...Object.values(buckets), 1e-9);
      const parity = 1 / 8;

      return CANONICAL_ZONE_ORDER.map((zoneName, i) => {
        const zoneNum = i + 1;
        const volume = buckets[zoneNum] || 0;
        const share = volume / totalPayout;
        const current_index = Math.min(100, Math.max(15, Math.round(20 + (volume / maxBucket) * 75)));
        const rawOpp = 50 + ((parity - share) / parity) * 35;
        const opportunity_score = Math.min(98, Math.max(12, Math.round(rawOpp)));
        const headroomPct =
          share < parity
            ? Math.min(95, Math.round(((parity - share) / parity) * 60 + 8))
            : Math.max(2, Math.round(28 - (share - parity) * 90));

        return {
          zone: zoneName,
          current_index,
          opportunity_score,
          primary_strategy: `Payout signal (90d): $${Math.round(volume).toLocaleString()} completed redemption volume (${(share * 100).toFixed(1)}% of observed payouts).`,
          top_revenue_stream: topStreamName,
          growth_potential: `${headroomPct}%`,
          tactics: [
            `Zone share ${(share * 100).toFixed(1)}% vs 12.5% eight-zone parity`,
            'Validate fee_zone in country_restrictions matches redemption country_iso',
            `Largest consolidated revenue stream: ${topStreamName}`
          ],
          cultural_notes:
            'Derived from user_profiles.purchasing_power_zone / country_iso, prize_redemptions.country_code, and country_restrictions.fee_zone; unattributed payout amounts split evenly across zones.'
        };
      });
    } catch (e) {
      console.error('buildDataDrivenZoneRecommendations:', e);
      return [];
    }
  },

  async mergeZoneRecommendations(aiZones, streams) {
    const internal = await this.buildDataDrivenZoneRecommendations(streams);
    const defaults = this.getDefaultZoneRecommendations();
    const byNameInternal = new Map(internal.map((z) => [z.zone, z]));
    const byNameDefault = new Map(defaults.map((z) => [z.zone, z]));
    const list = Array.isArray(aiZones) ? aiZones : [];

    return CANONICAL_ZONE_ORDER.map((name) => {
      const ai = list.find((z) => normalizeZoneLabel(z?.zone) === name || z?.zone === name);
      if (ai) return { ...byNameInternal.get(name), ...ai, zone: name };
      return byNameInternal.get(name) || byNameDefault.get(name);
    }).filter(Boolean);
  },

  // Generate zone-specific growth recommendations using Claude
  async generateZoneRecommendations(streams) {
    const finishWithInternal = async () => {
      const built = await this.buildDataDrivenZoneRecommendations(streams);
      return built?.length ? built : this.getDefaultZoneRecommendations();
    };

    try {
      const totalRevenue = streams?.reduce((sum, s) => sum + s?.total, 0);

      const prompt = `You are a global revenue strategist for Vottery, a participatory voting platform operating across 8 geographic zones. Generate specific monetization optimization strategies for each zone.

Platform Revenue Streams:
${streams?.map(s => `- ${s?.source}: $${s?.total?.toLocaleString()} (${s?.growth}% growth)`)?.join('\n')}

Total Monthly Revenue: $${totalRevenue?.toLocaleString()}

Generate zone-specific strategies as JSON:
{
  "zones": [
    {
      "zone": "USA",
      "current_index": 100,
      "opportunity_score": <1-100>,
      "primary_strategy": "<specific tactic>",
      "top_revenue_stream": "<stream name>",
      "growth_potential": "<percentage>",
      "tactics": ["tactic1", "tactic2", "tactic3"],
      "cultural_notes": "<brief cultural adaptation note>"
    }
  ]
}

Include all 8 zones: USA, Western Europe, Eastern Europe, India, Latin America, Africa, Middle East/Asia, Australasia`;

      const response = await getChatCompletion(
        'ANTHROPIC',
        'claude-sonnet-4-5-20250929',
        [{ role: 'user', content: prompt }],
        { temperature: 0.4, max_tokens: 2000 }
      );

      const content = response?.choices?.[0]?.message?.content || '';
      const jsonMatch = content?.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch?.[0]);
        const zones = Array.isArray(parsed?.zones) ? parsed.zones : [];
        if (zones.length >= 8) return zones;
        if (zones.length > 0) return this.mergeZoneRecommendations(zones, streams);
        throw new Error('Invalid response format');
      }
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Error generating zone recommendations:', error);
      return finishWithInternal();
    }
  },

  getDefaultZoneRecommendations() {
    return [
      { zone: 'USA', current_index: 100, opportunity_score: 78, primary_strategy: 'Premium enterprise sponsorship packages', top_revenue_stream: 'Direct Sponsorships', growth_potential: '15%', tactics: ['Launch Fortune 500 election sponsorship tier', 'Expand SMS ad inventory for political campaigns', 'Premium creator tier upsell campaigns'], cultural_notes: 'High willingness to pay for premium features and data analytics' },
      { zone: 'Western Europe', current_index: 95, opportunity_score: 82, primary_strategy: 'GDPR-compliant data monetization', top_revenue_stream: 'Election Sponsorships', growth_potential: '22%', tactics: ['Localized election sponsorship for EU elections', 'Privacy-first ad targeting', 'Multi-language template marketplace'], cultural_notes: 'Strong privacy expectations; emphasize data transparency and compliance' },
      { zone: 'Eastern Europe', current_index: 45, opportunity_score: 91, primary_strategy: 'Affordable creator tier entry points', top_revenue_stream: 'Creator Tier Subscriptions', growth_potential: '67%', tactics: ['Introduce Bronze tier at local pricing', 'Community election sponsorships', 'Template marketplace in local languages'], cultural_notes: 'Price-sensitive market; freemium-to-paid conversion is key' },
      { zone: 'India', current_index: 25, opportunity_score: 96, primary_strategy: 'Mobile-first micro-transaction model', top_revenue_stream: 'Template Marketplace', growth_potential: '180%', tactics: ['UPI payment integration for templates', 'Regional language election content', 'Influencer creator tier partnerships'], cultural_notes: 'Massive mobile user base; micro-payments and regional content drive adoption' },
      { zone: 'Latin America', current_index: 35, opportunity_score: 88, primary_strategy: 'Social commerce carousel monetization', top_revenue_stream: 'Carousel Monetization', growth_potential: '95%', tactics: ['WhatsApp-integrated SMS campaigns', 'Carnival/festival election themes', 'Local brand sponsorship outreach'], cultural_notes: 'High social media engagement; community-driven content performs best' },
      { zone: 'Africa', current_index: 20, opportunity_score: 94, primary_strategy: 'Mobile money and SMS-first revenue', top_revenue_stream: 'SMS Advertising', growth_potential: '220%', tactics: ['M-Pesa and mobile money integration', 'SMS-only election participation', 'Affordable data-light carousel formats'], cultural_notes: 'Mobile-first with limited data; SMS and lightweight features are essential' },
      { zone: 'Middle East/Asia', current_index: 60, opportunity_score: 85, primary_strategy: 'Premium election sponsorship for brands', top_revenue_stream: 'Election Sponsorships', growth_potential: '48%', tactics: ['Luxury brand election sponsorships', 'Arabic/Mandarin localization', 'Ramadan/CNY seasonal campaigns'], cultural_notes: 'High purchasing power in Gulf states; cultural calendar alignment is critical' },
      { zone: 'Australasia', current_index: 90, opportunity_score: 71, primary_strategy: 'Creator ecosystem expansion', top_revenue_stream: 'Creator Tier Subscriptions', growth_potential: '28%', tactics: ['Sports and outdoor brand sponsorships', 'Creator coaching premium tier', 'Trans-Tasman election campaigns'], cultural_notes: 'Tech-savvy audience; creator tools and analytics drive premium conversions' }
    ];
  },

  getStartDate(timeRange) {
    const now = new Date();
    switch (timeRange) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default: return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
};

export default revenueIntelligenceService;
