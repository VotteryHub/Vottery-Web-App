import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { sponsoredElectionsService } from '../../services/sponsoredElectionsService';
import { DollarSign, Target, TrendingUp, BarChart3, Settings, Zap } from 'lucide-react';
import CPEPricingMatrixPanel from './components/CPEPricingMatrixPanel';
import MarketResearchSchemaPanel from './components/MarketResearchSchemaPanel';
import HypePredictionFormatPanel from './components/HypePredictionFormatPanel';
import CSRElectionStructurePanel from './components/CSRElectionStructurePanel';
import CPEPricingEnginePanel from './components/CPEPricingEnginePanel';
import RevenueReportingPanel from './components/RevenueReportingPanel';
import Icon from '../../components/AppIcon';


const SponsoredElectionsSchemaCPEManagementHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [sponsoredElections, setSponsoredElections] = useState([]);
  const [cpePricingZones, setCpePricingZones] = useState([]);
  const [adFormatStats, setAdFormatStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [elections, zones, stats] = await Promise.all([
        sponsoredElectionsService?.getBrandSponsoredElections(user?.id),
        sponsoredElectionsService?.getCPEPricingZones(),
        sponsoredElectionsService?.getAdFormatStatistics()
      ]);

      setSponsoredElections(elections);
      setCpePricingZones(zones);
      setAdFormatStats(stats);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalMetrics = () => {
    return sponsoredElections?.reduce(
      (acc, election) => ({
        totalSpent: acc?.totalSpent + parseFloat(election?.budget_spent || 0),
        totalEngagements: acc?.totalEngagements + (election?.total_engagements || 0),
        totalRevenue: acc?.totalRevenue + parseFloat(election?.generated_revenue || 0),
        activeCampaigns: acc?.activeCampaigns + (election?.status === 'ACTIVE' ? 1 : 0)
      }),
      { totalSpent: 0, totalEngagements: 0, totalRevenue: 0, activeCampaigns: 0 }
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
    { id: 'revenue', label: 'Revenue Reports', icon: DollarSign }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CPE management data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <DollarSign className="w-8 h-8" />
                Sponsored Elections & CPE Management Hub
              </h1>
              <p className="mt-2 text-blue-100">
                Manage campaign structures with dynamic Cost-Per-Engagement pricing across all formats
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
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
                    ${metrics?.totalEngagements > 0 ? (metrics?.totalSpent / metrics?.totalEngagements)?.toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-blue-100">Avg CPE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Ad Format Performance */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ad Format Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-600">Market Research</div>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{adFormatStats?.MARKET_RESEARCH?.campaigns || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.MARKET_RESEARCH?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">${(adFormatStats?.MARKET_RESEARCH?.revenue || 0)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-600">Hype Prediction</div>
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-purple-600">{adFormatStats?.HYPE_PREDICTION?.campaigns || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.HYPE_PREDICTION?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">${(adFormatStats?.HYPE_PREDICTION?.revenue || 0)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-gray-600">CSR Elections</div>
                    <Zap className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">{adFormatStats?.CSR?.campaigns || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Campaigns</div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagements:</span>
                      <span className="font-medium">{adFormatStats?.CSR?.engagements || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Revenue:</span>
                      <span className="font-medium">${(adFormatStats?.CSR?.revenue || 0)?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Campaigns */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Active Sponsored Elections</h2>
              <div className="space-y-3">
                {sponsoredElections?.filter(e => e?.status === 'ACTIVE')?.map((election) => (
                  <div key={election?.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{election?.election?.title || 'Untitled Campaign'}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Format: {election?.ad_format_type?.replace(/_/g, ' ')} • CPE: ${election?.cost_per_vote}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{election?.total_engagements}</div>
                        <div className="text-xs text-gray-500">Engagements</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-600">Budget Used</span>
                        <span className="font-medium">
                          ${election?.budget_spent} / ${election?.budget_total}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((election?.budget_spent / election?.budget_total) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Zone Distribution */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">CPE Pricing Zones Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {cpePricingZones?.slice(0, 8)?.map((zone) => (
                  <div key={zone?.id} className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                    <div className="font-semibold text-gray-900">{zone?.zone_name}</div>
                    <div className="text-sm text-gray-600 mt-1">{zone?.zone_code}</div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">${zone?.base_cpe}</div>
                    <div className="text-xs text-gray-500">Base CPE</div>
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

export default SponsoredElectionsSchemaCPEManagementHub;