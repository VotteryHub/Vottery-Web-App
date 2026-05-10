import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { RefreshCw, DollarSign, Activity, ArrowRight, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import {
  CAMPAIGN_MANAGEMENT_ROUTE,
  SPONSORED_ELECTIONS_SCHEMA_CPE_HUB_ROUTE,
} from '../../constants/votteryAdsConstants';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';

const ZONE_BASE = [
  { id: 1, name: 'Zone 1 - US', flag: '≡ƒç║≡ƒç╕', baseCpe: 0.5 },
  { id: 2, name: 'Zone 2 - Eastern Europe', flag: '≡ƒç¬≡ƒç║', baseCpe: 0.15 },
  { id: 3, name: 'Zone 3 - Latin America', flag: '≡ƒçº≡ƒç╖', baseCpe: 0.2 },
  { id: 4, name: 'Zone 4 - Middle East', flag: '≡ƒçª≡ƒç¬', baseCpe: 0.25 },
  { id: 5, name: 'Zone 5 - East Asia', flag: '≡ƒç»≡ƒç╡', baseCpe: 0.35 },
  { id: 6, name: 'Zone 6 - Southeast Asia', flag: '≡ƒç╕≡ƒç¼', baseCpe: 0.18 },
  { id: 7, name: 'Zone 7 - South Asia', flag: '≡ƒç«≡ƒç│', baseCpe: 0.12 },
  { id: 8, name: 'Zone 8 - Africa', flag: '≡ƒç┐≡ƒçª', baseCpe: 0.1 },
];

function getDemandLevel(score) {
  if (score >= 0.9) return 'Very High';
  if (score >= 0.7) return 'High';
  if (score >= 0.4) return 'Medium';
  return 'Low';
}

function calculate24hChange(history, zoneId) {
  const zoneHistory = history?.filter((h) => h?.zone_id === zoneId) || [];
  if (zoneHistory.length < 2) return 0;
  const latest = Number(zoneHistory[0]?.new_price);
  const previous = Number(zoneHistory[1]?.new_price);
  if (!previous) return 0;
  return ((latest - previous) / previous) * 100;
}

const DynamicCpePricingEngineDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [zones, setZones] = useState([]);
  const [error, setError] = useState(null);

  const loadPricingData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      const [priceRes, metricsRes] = await Promise.all([
        supabase?.from('cpe_price_history')?.select('*')?.order('adjusted_at', { ascending: false })?.limit(100),
        supabase?.from('ad_engagement_metrics')?.select('*')?.gte('recorded_at', since)?.order('recorded_at', {
          ascending: false,
        }),
      ]);

      if (priceRes?.error) throw priceRes.error;
      if (metricsRes?.error) throw metricsRes.error;

      const priceHistory = priceRes?.data || [];
      const engagementMetrics = metricsRes?.data || [];

      const merged = ZONE_BASE.map((zone) => {
        const zoneMetrics = engagementMetrics.filter((m) => m?.zone_id === zone.id);
        const zonePrices = priceHistory.filter((p) => p?.zone_id === zone.id);
        const latestPrice = zonePrices[0]?.new_price ?? zone.baseCpe;
        const demandScore = zoneMetrics[0]?.demand_score ?? 0.5;
        const qualityScore = zoneMetrics[0]?.quality_score ?? 50;
        const engagementRate = zoneMetrics[0]?.engagement_rate ?? 0.05;

        return {
          ...zone,
          currentCpe: typeof latestPrice === 'number' ? latestPrice : Number.parseFloat(latestPrice) || zone.baseCpe,
          demandScore,
          qualityScore,
          engagementRate,
          demandLevel: getDemandLevel(Number(demandScore)),
          change24h: calculate24hChange(priceHistory, zone.id),
        };
      });

      setZones(merged);
    } catch (e) {
      console.error('Dynamic CPE load error:', e);
      setError(e?.message || 'Failed to load pricing data');
      setZones(
        ZONE_BASE.map((z) => ({
          ...z,
          currentCpe: z.baseCpe,
          demandScore: 0.5,
          qualityScore: 50,
          engagementRate: 0.05,
          demandLevel: 'Medium',
          change24h: 0,
        }))
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPricingData();
  }, [loadPricingData]);

  const avgCpe = useMemo(() => {
    if (!zones?.length) return 0;
    const sum = zones.reduce((acc, z) => acc + (Number(z?.currentCpe) || 0), 0);
    return sum / zones.length;
  }, [zones]);

  return (
    <>
      <Helmet>
        <title>Dynamic CPE Pricing Engine | Vottery</title>
        <meta
          name="description"
          content="Zone-level Cost-Per-Engagement pricing, demand signals, and 24h drift ΓÇö aligned with Mobile DynamicCpePricingEngineDashboard."
        />
      </Helmet>
      <div className="min-h-screen bg-muted/30">
        <HeaderNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl text-white p-8 shadow-lg mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Activity className="w-9 h-9" />
                  Dynamic CPE Pricing Engine
                </h1>
                <p className="mt-2 text-indigo-100 max-w-2xl">
                  Live zone pricing from <code className="bg-white/10 px-1 rounded">cpe_price_history</code> and{' '}
                  <code className="bg-white/10 px-1 rounded">ad_engagement_metrics</code>. Same data model as the
                  Flutter dashboard.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" className="bg-white/15 hover:bg-white/25 text-white border-0" asChild>
                  <Link to={CAMPAIGN_MANAGEMENT_ROUTE} className="inline-flex items-center gap-2">
                    Campaign hub <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="secondary" className="bg-white/15 hover:bg-white/25 text-white border-0" asChild>
                  <Link to={SPONSORED_ELECTIONS_SCHEMA_CPE_HUB_ROUTE} className="inline-flex items-center gap-2">
                    CPE schema hub <Layers className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="bg-white text-indigo-700 hover:bg-indigo-50 border-0"
                  onClick={() => loadPricingData()}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 inline ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-indigo-100">Zones tracked</div>
                <div className="text-2xl font-bold">{zones.length || ZONE_BASE.length}</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-indigo-100">Average CPE</div>
                <div className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="w-6 h-6" />${avgCpe.toFixed(3)}
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="text-sm text-indigo-100">Data source</div>
                <div className="text-lg font-semibold">Supabase (24h metrics)</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 px-4 py-3 text-sm">
              Showing fallback base CPE values: {error}
            </div>
          )}

          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Zone pricing matrix</h2>
              {loading && <span className="text-sm text-muted-foreground">LoadingΓÇª</span>}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3 font-medium">Zone</th>
                    <th className="text-right px-4 py-3 font-medium">Current CPE</th>
                    <th className="text-right px-4 py-3 font-medium">24h ╬ö</th>
                    <th className="text-right px-4 py-3 font-medium">Demand</th>
                    <th className="text-right px-4 py-3 font-medium">Quality</th>
                    <th className="text-right px-6 py-3 font-medium">Eng. rate</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.id} className="border-t border-border hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium text-foreground">
                        <span className="mr-2">{z.flag}</span>
                        {z.name}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">${Number(z.currentCpe).toFixed(3)}</td>
                      <td
                        className={`px-4 py-3 text-right font-mono ${
                          z.change24h > 0 ? 'text-emerald-600' : z.change24h < 0 ? 'text-red-600' : 'text-muted-foreground'
                        }`}
                      >
                        {z.change24h > 0 ? '+' : ''}
                        {z.change24h.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right">{z.demandLevel}</td>
                      <td className="px-4 py-3 text-right">{Number(z.qualityScore).toFixed(1)}</td>
                      <td className="px-6 py-3 text-right">{(Number(z.engagementRate) * 100).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DynamicCpePricingEngineDashboard;