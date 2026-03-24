import React from 'react';
import Icon from '../../../components/AppIcon';

/**
 * Reach by Country and by Region (States/Provinces/etc.) for Advertiser Analytics.
 * Data from advertiserAnalyticsService / votteryAdsAnalyticsService.getGeoReachMetrics (byCountry, byRegion).
 */
const GeoReachAnalytics = ({ data }) => {
  const byCountry = data?.byCountry ?? {};
  const byRegion = data?.byRegion ?? {};
  const countryEntries = Object.entries(byCountry).sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const regionEntries = Object.entries(byRegion).sort((a, b) => (b[1] || 0) - (a[1] || 0));
  const totalCountryReach = countryEntries.reduce((s, [, v]) => s + (v || 0), 0);
  const totalRegionReach = regionEntries.reduce((s, [, v]) => s + (v || 0), 0);

  if (countryEntries.length === 0 && regionEntries.length === 0) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Reach by Country & Region
            </h2>
            <p className="text-sm text-muted-foreground">
              Geographic reach by country and sub-national region (states, provinces, etc.)
            </p>
          </div>
          <Icon name="Globe" size={24} className="text-primary" />
        </div>
        <p className="text-sm text-muted-foreground py-6 text-center">
          No geographic reach data yet. Run campaigns and gather impressions to see breakdown by country and region.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Reach by Country & Region
          </h2>
          <p className="text-sm text-muted-foreground">
            Geographic reach by country and sub-national region (states, provinces, territories, etc.)
          </p>
        </div>
        <Icon name="Globe" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-base font-heading font-semibold text-foreground mb-3">
            By Country
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {countryEntries.map(([country, count]) => (
              <div
                key={country}
                className="flex items-center justify-between py-2 px-3 rounded-lg border border-border hover:bg-muted/50"
              >
                <span className="font-medium text-foreground">{country === 'UNKNOWN' ? 'Unknown' : country}</span>
                <span className="text-sm font-data text-muted-foreground">{Number(count).toLocaleString()} reach</span>
              </div>
            ))}
          </div>
          {totalCountryReach > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Total reach (country): {totalCountryReach.toLocaleString()}
            </p>
          )}
        </div>

        <div>
          <h3 className="text-base font-heading font-semibold text-foreground mb-3">
            By Region (State / Province / etc.)
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {regionEntries.slice(0, 20).map(([regionKey, count]) => {
              const [country, region] = regionKey.includes(':') ? regionKey.split(':') : [regionKey, ''];
              const label = region && region !== 'UNKNOWN' ? `${country} – ${region}` : regionKey;
              return (
                <div
                  key={regionKey}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-border hover:bg-muted/50"
                >
                  <span className="font-medium text-foreground text-sm truncate max-w-[70%]" title={label}>
                    {label === 'UNKNOWN:UNKNOWN' ? 'Unknown' : label}
                  </span>
                  <span className="text-sm font-data text-muted-foreground shrink-0">{Number(count).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
          {regionEntries.length > 20 && (
            <p className="text-xs text-muted-foreground mt-2">
              Showing top 20 of {regionEntries.length} regions
            </p>
          )}
          {totalRegionReach > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Total reach (regions): {totalRegionReach.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeoReachAnalytics;
