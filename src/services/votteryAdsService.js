/**
 * Vottery Ads Studio – service for Campaign > Ad Group > Ad (unified schema).
 * Uses tables: vottery_ad_campaigns, vottery_ad_groups, vottery_ad_targeting_geo, vottery_ads, spark_ad_references.
 */

import { supabase } from '../lib/supabase';
import {
  DEFAULT_MIN_DAILY_BUDGET_CENTS,
  DEFAULT_MIN_CAMPAIGN_BUDGET_CENTS,
} from '../constants/votteryAdsConstants';

// ─── Campaigns ─────────────────────────────────────────────────────────────
export async function getCampaigns(advertiserId) {
  const { data, error } = await supabase
    .from('vottery_ad_campaigns')
    .select('*')
    .eq('advertiser_id', advertiserId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createCampaign(advertiserId, payload) {
  const { data, error } = await supabase
    .from('vottery_ad_campaigns')
    .insert({
      advertiser_id: advertiserId,
      name: payload.name,
      objective: payload.objective || 'reach',
      status: payload.status || 'draft',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCampaign(campaignId, payload) {
  const { data, error } = await supabase
    .from('vottery_ad_campaigns')
    .update({
      name: payload.name,
      objective: payload.objective,
      status: payload.status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', campaignId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Ad Groups ──────────────────────────────────────────────────────────────
export async function getAdGroups(campaignId) {
  const { data, error } = await supabase
    .from('vottery_ad_groups')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAdGroup(payload) {
  const { data, error } = await supabase
    .from('vottery_ad_groups')
    .insert({
      campaign_id: payload.campaign_id,
      name: payload.name,
      target_zones: payload.target_zones ?? [1, 2, 3, 4, 5, 6, 7, 8],
      target_countries: payload.target_countries ?? [],
      placement_mode: payload.placement_mode || 'automatic',
      placement_slots: payload.placement_slots ?? [],
      daily_budget_cents: payload.daily_budget_cents,
      lifetime_budget_cents: payload.lifetime_budget_cents,
      schedule_start: payload.schedule_start || null,
      schedule_end: payload.schedule_end || null,
      status: payload.status || 'draft',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAdGroup(adGroupId, payload) {
  const update = {
    name: payload.name,
    target_zones: payload.target_zones,
    target_countries: payload.target_countries,
    placement_mode: payload.placement_mode,
    placement_slots: payload.placement_slots,
    daily_budget_cents: payload.daily_budget_cents,
    lifetime_budget_cents: payload.lifetime_budget_cents,
    schedule_start: payload.schedule_start,
    schedule_end: payload.schedule_end,
    status: payload.status,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase
    .from('vottery_ad_groups')
    .update(update)
    .eq('id', adGroupId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Targeting Geo (sub-national) ──────────────────────────────────────────
export async function setTargetingGeo(adGroupId, rows) {
  await supabase.from('vottery_ad_targeting_geo').delete().eq('ad_group_id', adGroupId);
  if (!rows?.length) return [];
  const { data, error } = await supabase
    .from('vottery_ad_targeting_geo')
    .insert(rows.map((r) => ({
      ad_group_id: adGroupId,
      country_iso: r.country_iso,
      region_code: r.region_code || null,
      region_name: r.region_name || null,
    })))
    .select();
  if (error) throw error;
  return data || [];
}

export async function getTargetingGeo(adGroupId) {
  const { data, error } = await supabase
    .from('vottery_ad_targeting_geo')
    .select('*')
    .eq('ad_group_id', adGroupId);
  if (error) throw error;
  return data || [];
}

// ─── Ads ───────────────────────────────────────────────────────────────────
export async function getAds(adGroupId) {
  const { data, error } = await supabase
    .from('vottery_ads')
    .select('*')
    .eq('ad_group_id', adGroupId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createAd(payload) {
  const row = {
    ad_group_id: payload.ad_group_id,
    name: payload.name,
    ad_type: payload.ad_type,
    status: payload.status || 'draft',
    creative: payload.creative ?? {},
    election_id: payload.election_id || null,
    enable_gamification: payload.enable_gamification ?? false,
    prize_pool_cents: payload.prize_pool_cents ?? null,
    source_post_id: payload.source_post_id || null,
    bid_amount_cents: payload.bid_amount_cents ?? 0,
    pricing_model: payload.pricing_model || 'cpm',
  };
  const { data, error } = await supabase.from('vottery_ads').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function updateAd(adId, payload) {
  const update = {
    name: payload.name,
    ad_type: payload.ad_type,
    status: payload.status,
    creative: payload.creative,
    election_id: payload.election_id,
    enable_gamification: payload.enable_gamification,
    prize_pool_cents: payload.prize_pool_cents,
    source_post_id: payload.source_post_id,
    bid_amount_cents: payload.bid_amount_cents,
    pricing_model: payload.pricing_model,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from('vottery_ads').update(update).eq('id', adId).select().single();
  if (error) throw error;
  return data;
}

// ─── Spark reference ───────────────────────────────────────────────────────
export async function upsertSparkReference(adId, sourcePostId, sourceType, cta) {
  const { data, error } = await supabase
    .from('spark_ad_references')
    .upsert(
      {
        ad_id: adId,
        source_post_id: sourcePostId,
        source_type: sourceType || 'moment',
        cta_label: cta?.label,
        cta_destination_url: cta?.destination_url,
      },
      { onConflict: 'ad_id' }
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─── Placement slots & admin config ────────────────────────────────────────
export async function getPlacementSlots() {
  const { data, error } = await supabase
    .from('vottery_placement_slots')
    .select('*')
    .order('slot_key');
  if (error) throw error;
  return data || [];
}

export async function getAdminConfig() {
  const { data, error } = await supabase.from('vottery_ads_admin_config').select('key, value_json');
  if (error) throw error;
  const map = {};
  (data || []).forEach((r) => { map[r.key] = r.value_json; });
  return map;
}

export function getMinDailyBudgetCents(adminConfig) {
  const v = adminConfig?.min_daily_budget_cents;
  if (v != null) return typeof v === 'string' ? parseInt(v, 10) : v;
  return DEFAULT_MIN_DAILY_BUDGET_CENTS;
}

export function getMinCampaignBudgetCents(adminConfig) {
  const v = adminConfig?.min_campaign_budget_cents;
  if (v != null) return typeof v === 'string' ? parseInt(v, 10) : v;
  return DEFAULT_MIN_CAMPAIGN_BUDGET_CENTS;
}

// ─── Ad events (tracking for quality score) ──────────────────────────────────
export async function trackAdEvent(adId, userId, eventType, slotId, metadata = {}) {
  const { data, error } = await supabase
    .from('ad_events')
    .insert({
      ad_id: adId,
      user_id: userId,
      event_type: eventType,
      slot_id: slotId || null,
      metadata: metadata,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export const votteryAdsService = {
  getCampaigns,
  createCampaign,
  updateCampaign,
  getAdGroups,
  createAdGroup,
  updateAdGroup,
  setTargetingGeo,
  getTargetingGeo,
  getAds,
  createAd,
  updateAd,
  upsertSparkReference,
  getPlacementSlots,
  getAdminConfig,
  getMinDailyBudgetCents,
  getMinCampaignBudgetCents,
  trackAdEvent,
};
