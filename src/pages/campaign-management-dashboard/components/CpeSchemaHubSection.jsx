import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, Target, TrendingUp, BarChart3, Settings, Zap } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { sponsoredElectionsService } from '../../../services/sponsoredElectionsService';
import CPEPricingMatrixPanel from '../../sponsored-elections-schema-cpe-management-hub/components/CPEPricingMatrixPanel';
import MarketResearchSchemaPanel from '../../sponsored-elections-schema-cpe-management-hub/components/MarketResearchSchemaPanel';
import HypePredictionFormatPanel from '../../sponsored-elections-schema-cpe-management-hub/components/HypePredictionFormatPanel';
import CSRElectionStructurePanel from '../../sponsored-elections-schema-cpe-management-hub/components/CSRElectionStructurePanel';
import CPEPricingEnginePanel from '../../sponsored-elections-schema-cpe-management-hub/components/CPEPricingEnginePanel';
import RevenueReportingPanel from '../../sponsored-elections-schema-cpe-management-hub/components/RevenueReportingPanel';

/**
 * Sponsored-election CPE / schema workspace — merged into Campaign Management Dashboard.
 * Panel implementations live under `pages/sponsored-elections-schema-cpe-management-hub/components/`.
 */
const CpeSchemaHubSection = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sponsoredElections, setSponsoredElections] = useState([]);
  const [cpePricingZones, setCpePricingZones] = useState([]);
  const [adFormatStats, setAdFormatStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const brandId = user?.id;
      const [elections, zones, stats] = await Promise.all([
        brandId
          ? sponsoredElectionsService?.getBrandSponsoredElections(brandId)
          : Promise.resolve([]),
        sponsoredElectionsService?.getCPEPricingZones(),
        sponsoredElectionsService?.getAdFormatStatistics(),
      ]);

      setSponsoredElections(elections || []);
      setCpePricingZones(zones || []);
      setAdFormatStats(stats);
    } catch (error) {
      console.error('Error loading CPE hub data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const calculateTotalMetrics = () => {
    return sponsoredElections?.reduce(
      (acc, election) => ({
        totalSpent: acc?.totalSpent + parseFloat(election?.budget_spent || 0),
        totalEngagements: acc?.totalEngagements + (election?.total_engagements || 0),
        totalRevenue: acc?.totalRevenue + parseFloat(election?.generated_revenue || 0),
        activeCampaigns:
          acc?.activeCampaigns +
          (String(election?.status || '').toLowerCase() === 'active' ? 1 : 0),
      }),
      { totalSpent: 0, totalEngagements: 0, totalRevenue: 0, activeCampaigns: 0 },
    );
  };

  const metrics = calculateTotalMetrics();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'pricing', label: 'CPE Pricing Matrix', icon: DollarSign },
    { id: 'market-research', label: 'Market Research', icon: Target },
    { id: 'hype-prediction', label: 'Hype Prediction', icon: TrendingUp },
    { id: 'csr', label: 'CSR Elections', icon: Zap },
    { id: 'pricing-engine', label: 'Pricing Engine', icon: Settings },
    { id: 'revenue', label: 'Revenue Reports', icon: DollarSign },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="mt-4 text-sm">Loading CPE management data...</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <DollarSign className="w-8 h-8 shrink-0" />
                Sponsored Elections &amp; CPE Management Hub
              </h2>
              <p className="mt-2 text-blue-100 text-sm md:text-base">
                Manage campaign structures with dynamic Cost-Per-Engagement pricing across all formats
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-400/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">${metrics?.totalSpent?.toFixed(2)}</div>
                  <div className="text-sm text-blue-100">Total Spent</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-400/20 rounded-lg">
                  <Target className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics?.totalEngagements}</div>
                  <div className="text-sm text-blue-100">Total Engagements</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-400/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{metrics?.activeCampaigns}</div>
                  <div className="text-sm text-blue-100">Active Campaigns</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-400/20 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-yellow-300" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    $
                    {metrics?.totalEngagements > 0
                      ? (metrics?.totalSpent / metrics?.totalEngagements)?.toFixed(2)
                      : '0.00'}
                  </div>
                  <div className="text-sm text-blue-100">Avg CPE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto">
            {tabs?.map((tab) => {
              const TabIcon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  type="button"
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-muted/20">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Ad Format Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Market Research</div>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {adFormatStats?.MARKET_RESEARCH?.campaigns || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.MARKET_RESEARCH?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">
                        ${(adFormatStats?.MARKET_RESEARCH?.revenue || 0)?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-muted-foreground">Hype Prediction</div>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {adFormatStats?.HYPE_PREDICTION?.campaigns || 0}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.HYPE_PREDICTION?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">
                        ${(adFormatStats?.HYPE_PREDICTION?.revenue || 0)?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border-2 border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-muted-foreground">CSR Elections</div>
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{adFormatStats?.CSR?.campaigns || 0}</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-800">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.CSR?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">${(adFormatStats?.CSR?.revenue || 0)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">Active Sponsored Elections</h3>
              <div className="space-y-3">
                {sponsoredElections
                  ?.filter((e) => String(e?.status || '').toLowerCase() === 'active')
                  ?.map((election) => (
                    <div
                      key={election?.id}
                      className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">
                            {election?.election?.title || 'Untitled Campaign'}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Format: {election?.ad_format_type?.replace(/_/g, ' ')} • CPE: $
                            {election?.cost_per_vote}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{election?.total_engagements}</div>
                          <div className="text-xs text-muted-foreground">Engagements</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Budget Used</span>
                          <span className="font-medium">
                            ${election?.budget_spent} / ${election?.budget_total}
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{
                              width: `${Math.min((election?.budget_spent / election?.budget_total) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
              <h3 className="text-xl font-bold text-foreground mb-4">CPE Pricing Zones Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cpePricingZones?.slice(0, 8)?.map((zone) => (
                  <div
                    key={zone?.id}
                    className="p-4 bg-gradient-to-br from-muted/80 to-muted rounded-lg border border-border"
                  >
                    <div className="font-semibold text-foreground">{zone?.zone_name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{zone?.zone_code}</div>
                    <div className="text-2xl font-bold text-primary mt-2">${zone?.base_cpe}</div>
                    <div className="text-xs text-muted-foreground">Base CPE</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pricing' && <CPEPricingMatrixPanel zones={cpePricingZones} />}
        {activeTab === 'market-research' && <MarketResearchSchemaPanel />}
        {activeTab === 'hype-prediction' && <HypePredictionFormatPanel />}
        {activeTab === 'csr' && <CSRElectionStructurePanel />}
        {activeTab === 'pricing-engine' && <CPEPricingEnginePanel zones={cpePricingZones} />}
        {activeTab === 'revenue' && <RevenueReportingPanel brandId={user?.id} />}
      </div>
    </div>
  );
};

export default CpeSchemaHubSection;
