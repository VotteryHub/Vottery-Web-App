import { supabase } from '../lib/supabase';

function getStartDate(timeRange) {
  const now = new Date();
  const start = new Date(now);
  if (timeRange === '24h') start.setHours(now.getHours() - 24);
  else if (timeRange === '7d') start.setDate(now.getDate() - 7);
  else start.setDate(now.getDate() - 30);
  return start.toISOString();
}

async function getCurrentUserId() {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

async function getAdvertiserAdIds(advertiserId) {
  // Campaigns -> groups -> ads
  const { data: campaigns, error: cErr } = await supabase
    .from('vottery_ad_campaigns')
    .select('id')
    .eq('advertiser_id', advertiserId);
  if (cErr) throw cErr;
  const campaignIds = (campaigns || []).map((c) => c.id);
  if (!campaignIds.length) return [];

  const { data: groups, error: gErr } = await supabase
    .from('vottery_ad_groups')
    .select('id,campaign_id,target_zones,target_countries')
    .in('campaign_id', campaignIds);
  if (gErr) throw gErr;
  const groupIds = (groups || []).map((g) => g.id);
  if (!groupIds.length) return [];

  const { data: ads, error: aErr } = await supabase
    .from('vottery_ads')
    .select('id,ad_group_id,ad_type,bid_amount_cents,pricing_model,election_id,source_post_id')
    .in('ad_group_id', groupIds);
  if (aErr) throw aErr;

  return { ads: ads || [], groups: groups || [], campaignIds };
}

async function getAdEvents(adIds, startDateIso) {
  if (!adIds.length) return [];
  const { data, error } = await supabase
    .from('ad_events')
    .select('ad_id,user_id,event_type,timestamp,metadata')
    .in('ad_id', adIds)
    .gte('timestamp', startDateIso);
  if (error) throw error;
  return data || [];
}

async function getUsers(userIds) {
  if (!userIds.length) return [];
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id,purchasing_power_zone,country_iso,region_code,region_name')
    .in('id', userIds);
  if (error) throw error;
  return data || [];
}

function sumSpendFromEvents(events, adsById) {
  // Spend is derived from second-price clearing_price_cents if present, else bid_amount_cents.
  let spendCents = 0;
  for (const e of events) {
    if (e.event_type !== 'IMPRESSION') continue;
    const clearing = e?.metadata?.auction?.clearing_price_cents;
    if (Number.isFinite(Number(clearing))) {
      spendCents += Number(clearing);
    } else {
      const bid = adsById[e.ad_id]?.bid_amount_cents || 0;
      spendCents += Number(bid) || 0;
    }
  }
  return spendCents;
}

export const votteryAdsAnalyticsService = {
  async getAdvertiserPerformance(timeRange = '30d') {
    try {
      const advertiserId = await getCurrentUserId();
      if (!advertiserId) return { data: null, error: { message: 'Not authenticated' } };

      const startDate = getStartDate(timeRange);
      const { ads } = await getAdvertiserAdIds(advertiserId);
      const adIds = ads.map((a) => a.id);
      const events = await getAdEvents(adIds, startDate);
      const adsById = Object.fromEntries(ads.map((a) => [a.id, a]));

      const impressions = events.filter((e) => e.event_type === 'IMPRESSION').length;
      const clicks = events.filter((e) => e.event_type === 'CLICK').length;
      const completes = events.filter((e) => e.event_type === 'COMPLETE').length;
      const hides = events.filter((e) => e.event_type === 'HIDE').length;
      const reports = events.filter((e) => e.event_type === 'REPORT').length;

      const spendCents = sumSpendFromEvents(events, adsById);
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const conversionRate = clicks > 0 ? (completes / clicks) * 100 : 0;

      return {
        data: {
          totalCampaigns: new Set(ads.map((a) => a.ad_group_id)).size,
          totalAds: ads.length,
          impressions,
          clicks,
          completes,
          ctr: Number(ctr.toFixed(2)),
          conversionRate: Number(conversionRate.toFixed(2)),
          negativeFeedbackRate: impressions > 0 ? Number((((hides + reports) / impressions) * 100).toFixed(2)) : 0,
          spend: (spendCents / 100).toFixed(2),
          spendCents,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getCostAnalysis(timeRange = '30d') {
    try {
      const advertiserId = await getCurrentUserId();
      if (!advertiserId) return { data: null, error: { message: 'Not authenticated' } };

      const startDate = getStartDate(timeRange);
      const { ads } = await getAdvertiserAdIds(advertiserId);
      const adIds = ads.map((a) => a.id);
      const events = await getAdEvents(adIds, startDate);
      const adsById = Object.fromEntries(ads.map((a) => [a.id, a]));
      const spendCents = sumSpendFromEvents(events, adsById);
      const participants = events.filter((e) => e.event_type === 'COMPLETE').length;
      const cpp = participants > 0 ? spendCents / participants : 0;

      return {
        data: {
          totalSpend: (spendCents / 100).toFixed(2),
          totalSpendCents: spendCents,
          participants,
          costPerParticipant: (cpp / 100).toFixed(2),
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getConversionTracking(timeRange = '30d') {
    try {
      const advertiserId = await getCurrentUserId();
      if (!advertiserId) return { data: null, error: { message: 'Not authenticated' } };

      const startDate = getStartDate(timeRange);
      const { ads } = await getAdvertiserAdIds(advertiserId);
      const events = await getAdEvents(ads.map((a) => a.id), startDate);
      const impressions = events.filter((e) => e.event_type === 'IMPRESSION').length;
      const clicks = events.filter((e) => e.event_type === 'CLICK').length;
      const conversions = events.filter((e) => e.event_type === 'COMPLETE').length;

      return {
        data: {
          totalImpressions: impressions,
          totalClicks: clicks,
          totalConversions: conversions,
          ctr: impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
          conversionRate: clicks > 0 ? Number(((conversions / clicks) * 100).toFixed(2)) : 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getZoneReachMetrics(timeRange = '30d') {
    try {
      const advertiserId = await getCurrentUserId();
      if (!advertiserId) return { data: null, error: { message: 'Not authenticated' } };

      const startDate = getStartDate(timeRange);
      const { ads } = await getAdvertiserAdIds(advertiserId);
      const events = await getAdEvents(ads.map((a) => a.id), startDate);
      const impressionEvents = events.filter((e) => e.event_type === 'IMPRESSION');
      const userIds = [...new Set(impressionEvents.map((e) => e.user_id))].filter(Boolean);
      const users = await getUsers(userIds);
      const zoneByUser = Object.fromEntries(users.map((u) => [u.id, u.purchasing_power_zone || 1]));

      const reachByZone = {};
      for (const e of impressionEvents) {
        const z = zoneByUser[e.user_id] || 1;
        reachByZone[z] = (reachByZone[z] || 0) + 1;
      }

      return { data: { reachByZone }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },

  async getGeoReachMetrics(timeRange = '30d') {
    try {
      const advertiserId = await getCurrentUserId();
      if (!advertiserId) return { data: null, error: { message: 'Not authenticated' } };
      const startDate = getStartDate(timeRange);
      const { ads } = await getAdvertiserAdIds(advertiserId);
      const events = await getAdEvents(ads.map((a) => a.id), startDate);
      const impressionEvents = events.filter((e) => e.event_type === 'IMPRESSION');
      const userIds = [...new Set(impressionEvents.map((e) => e.user_id))].filter(Boolean);
      const users = await getUsers(userIds);
      const uById = Object.fromEntries(users.map((u) => [u.id, u]));

      const byCountry = {};
      const byRegion = {};
      for (const e of impressionEvents) {
        const u = uById[e.user_id];
        const country = u?.country_iso || 'UNKNOWN';
        const regionKey = `${country}:${u?.region_code || u?.region_name || 'UNKNOWN'}`;
        byCountry[country] = (byCountry[country] || 0) + 1;
        byRegion[regionKey] = (byRegion[regionKey] || 0) + 1;
      }

      return { data: { byCountry, byRegion }, error: null };
    } catch (error) {
      return { data: null, error: { message: error?.message } };
    }
  },
};

