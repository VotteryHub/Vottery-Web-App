import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users, DollarSign, Settings, Play, RefreshCw } from 'lucide-react';
import CampaignOverviewPanel from './components/CampaignOverviewPanel';
import CampaignConfigurationPanel from './components/CampaignConfigurationPanel';
import AllocationRulesPanel from './components/AllocationRulesPanel';
import ExternalAPIPanel from './components/ExternalAPIPanel';
import WinnerSelectionPanel from './components/WinnerSelectionPanel';
import PrizeDistributionPanel from './components/PrizeDistributionPanel';
import { platformGamificationService } from '../../services/platformGamificationService';
import Icon from '../../components/AppIcon';


export default function GamificationCampaignManagementCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalPrizePool: 0,
    eligibleUsers: 0,
    pendingPayouts: 0
  });

  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    const result = await platformGamificationService?.getCampaigns();
    if (result?.success) {
      setCampaigns(result?.data);
      if (result?.data?.length > 0 && !selectedCampaign) {
        setSelectedCampaign(result?.data?.[0]);
      }
    }
    setLoading(false);
  };

  const loadStats = async () => {
    // Load aggregate statistics
    const result = await platformGamificationService?.getCampaigns({ status: 'active' });
    if (result?.success) {
      const totalPrize = result?.data?.reduce((sum, c) => sum + parseFloat(c?.prize_pool_amount || 0), 0);
      setStats({
        activeCampaigns: result?.data?.length,
        totalPrizePool: totalPrize,
        eligibleUsers: 0, // Will be calculated
        pendingPayouts: 0
      });
    }
  };

  const handleCampaignSelect = async (campaign) => {
    const result = await platformGamificationService?.getCampaignById(campaign?.id);
    if (result?.success) {
      setSelectedCampaign(result?.data);
    }
  };

  const handleCampaignUpdate = async () => {
    await loadCampaigns();
    if (selectedCampaign) {
      const result = await platformGamificationService?.getCampaignById(selectedCampaign?.id);
      if (result?.success) {
        setSelectedCampaign(result?.data);
      }
    }
  };

  const tabs = [
    { id: 'overview', label: 'Campaign Overview', icon: TrendingUp },
    { id: 'configuration', label: 'Configuration', icon: Settings },
    { id: 'allocation', label: 'Allocation Rules', icon: Users },
    { id: 'api', label: 'External API', icon: Sparkles },
    { id: 'winners', label: 'Winner Selection', icon: Play },
    { id: 'distribution', label: 'Prize Distribution', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Gamification Campaign Management Center
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive admin dashboard for platform-wide prize distribution and campaign oversight
            </p>
          </div>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Active Campaigns</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats?.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Prize Pool</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${stats?.totalPrizePool?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Eligible Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats?.eligibleUsers?.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Pending Payouts</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats?.pendingPayouts}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <RefreshCw className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="flex overflow-x-auto">
          {tabs?.map((tab) => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-b-4 border-purple-700' :'text-gray-600 hover:bg-gray-50 border-b-4 border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab?.label}
              </button>
            );
          })}
        </div>
      </div>
      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <CampaignOverviewPanel
                campaigns={campaigns}
                selectedCampaign={selectedCampaign}
                onCampaignSelect={handleCampaignSelect}
                onRefresh={loadCampaigns}
              />
            )}
            {activeTab === 'configuration' && (
              <CampaignConfigurationPanel
                campaign={selectedCampaign}
                onUpdate={handleCampaignUpdate}
              />
            )}
            {activeTab === 'allocation' && (
              <AllocationRulesPanel
                campaign={selectedCampaign}
                onUpdate={handleCampaignUpdate}
              />
            )}
            {activeTab === 'api' && (
              <ExternalAPIPanel />
            )}
            {activeTab === 'winners' && (
              <WinnerSelectionPanel
                campaign={selectedCampaign}
                onUpdate={handleCampaignUpdate}
              />
            )}
            {activeTab === 'distribution' && (
              <PrizeDistributionPanel
                campaign={selectedCampaign}
                onUpdate={handleCampaignUpdate}
                election={selectedCampaign}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}