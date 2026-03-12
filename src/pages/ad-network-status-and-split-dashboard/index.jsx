import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { adSlotManagerService } from '../../services/adSlotManagerService';

const AdNetworkStatusAndSplitDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fillRates, setFillRates] = useState(null);
  const [bySystem, setBySystem] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 7);
        const startIso = start.toISOString();
        const endIso = end.toISOString();

        const fill = await adSlotManagerService.getFillRateAnalytics(startIso, endIso);
        setFillRates(fill);

        const { data, error: aggError } = await supabase
          .from('ad_slot_analytics')
          .select('ad_system')
          .gte('filled_at', startIso)
          .lte('filled_at', endIso);

        if (aggError) throw aggError;

        const counts = {};
        (data || []).forEach(row => {
          const key = row?.ad_system || 'unknown';
          counts[key] = (counts[key] || 0) + 1;
        });

        const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
        const rows = Object.entries(counts).map(([system, count]) => ({
          system,
          count,
          percentage: total > 0 ? ((count / total) * 100).toFixed(2) : '0.00'
        })).sort((a, b) => b.count - a.count);

        setBySystem(rows);
      } catch (err) {
        setError(err?.message || 'Failed to load ad network status');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Ad Network Status &amp; Split</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Last 7 days – shows how ad fill has been divided between internal Vottery ads and external networks
        (Ezoic, PropellerAds, HilltopAds, AdSense).
      </p>

      {loading && (
        <div className="py-12 text-center text-muted-foreground">Loading analytics…</div>
      )}

      {error && !loading && (
        <div className="mb-4 rounded-md bg-red-50 text-red-800 px-4 py-3 text-sm border border-red-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <section className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs uppercase text-muted-foreground mb-1">Total fills</div>
              <div className="text-2xl font-semibold">{fillRates?.total || 0}</div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs uppercase text-muted-foreground mb-1">Internal fills</div>
              <div className="text-lg font-semibold">
                {fillRates?.internalFills || 0}{' '}
                <span className="text-xs text-muted-foreground">
                  ({fillRates?.internalFillRate ?? 0}%)
                </span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <div className="text-xs uppercase text-muted-foreground mb-1">External fills (all networks)</div>
              <div className="text-lg font-semibold">
                {(fillRates?.total || 0) - (fillRates?.internalFills || 0)}{' '}
                <span className="text-xs text-muted-foreground">
                  ({(100 - (parseFloat(fillRates?.internalFillRate || 0))).toFixed(2)}%)
                </span>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">Fill split by system</h2>
            <div className="overflow-hidden rounded-lg border bg-card">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-4 py-2">System</th>
                    <th className="text-right px-4 py-2">Fills</th>
                    <th className="text-right px-4 py-2">% of total</th>
                  </tr>
                </thead>
                <tbody>
                  {bySystem.map(row => (
                    <tr key={row.system} className="border-t">
                      <td className="px-4 py-2">
                        {row.system === 'internal_participatory' && 'Vottery Internal (Primary)'}
                        {row.system === 'google_adsense' && 'Google AdSense'}
                        {row.system === 'ezoic' && 'Ezoic'}
                        {row.system === 'propellerads' && 'PropellerAds'}
                        {row.system === 'hilltopads' && 'HilltopAds'}
                        {['internal_participatory', 'google_adsense', 'ezoic', 'propellerads', 'hilltopads'].includes(row.system)
                          ? null
                          : row.system}
                      </td>
                      <td className="px-4 py-2 text-right">{row.count}</td>
                      <td className="px-4 py-2 text-right">{row.percentage}%</td>
                    </tr>
                  ))}
                  {bySystem.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-4 text-center text-muted-foreground">
                        No ad fills recorded in the last 7 days.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default AdNetworkStatusAndSplitDashboard;

