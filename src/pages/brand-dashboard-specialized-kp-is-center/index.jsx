import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Target, Users, Zap, Award, BarChart3, Clock } from 'lucide-react';
import revenueReportingService from '../../services/revenueReportingService';
import PerformanceOverviewPanel from './components/PerformanceOverviewPanel';
import AuctionBiddingPanel from './components/AuctionBiddingPanel';
import FrequencyCappingPanel from './components/FrequencyCappingPanel';
import SpecializedKPIsPanel from './components/SpecializedKPIsPanel';
import RevenueAttributionPanel from './components/RevenueAttributionPanel';
import AudienceDNAPanel from './components/AudienceDNAPanel';
import Icon from '../../components/AppIcon';


const BrandDashboardSpecializedKPIsCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    loadBrandData();
  }, []);

  const loadBrandData = async () => {
    setLoading(true);
    try {
      // Get current user's brand data
      const result = await revenueReportingService?.getBrandPerformanceSummary(
        'current-user-id' // Replace with actual auth.uid()
      );
      
      if (result?.success) {
        setBrandData(result?.data);
        if (result?.data?.campaigns?.length > 0) {
          setSelectedCampaign(result?.data?.campaigns?.[0]);
        }
      }
    } catch (error) {
      console.error('Error loading brand data:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Performance Overview', icon: BarChart3 },
    { id: 'bidding', label: 'Auction Bidding', icon: Target },
    { id: 'frequency', label: 'Frequency Capping', icon: Clock },
    { id: 'kpis', label: 'Specialized KPIs', icon: Award },
    { id: 'revenue', label: 'Revenue Attribution', icon: DollarSign },
    { id: 'audience', label: 'Audience DNA', icon: Users }
  ];

  const globalMetrics = [
    {
      label: 'Total Campaigns',
      value: brandData?.total_campaigns || 0,
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Total Spent',
      value: `$${(brandData?.total_spent || 0)?.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Engagements',
      value: (brandData?.total_engagements || 0)?.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Avg CPE',
      value: `$${(brandData?.avg_cpe || 0)?.toFixed(2)}`,
      icon: Target,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Brand Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Brand Dashboard & Specialized KPIs Center
              </h1>
              <p className="mt-2 text-gray-600">
                Comprehensive advertiser analytics with Facebook-style auction bidding and participatory advertising metrics
              </p>
            </div>
            <button
              onClick={loadBrandData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {/* Global Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            {globalMetrics?.map((metric, index) => {
              const Icon = metric?.icon;
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric?.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {metric?.value}
                      </p>
                    </div>
                    <div className={`${metric?.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${metric?.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-600 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab?.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <PerformanceOverviewPanel 
            brandData={brandData} 
            selectedCampaign={selectedCampaign}
            onSelectCampaign={setSelectedCampaign}
          />
        )}
        {activeTab === 'bidding' && (
          <AuctionBiddingPanel selectedCampaign={selectedCampaign} />
        )}
        {activeTab === 'frequency' && (
          <FrequencyCappingPanel selectedCampaign={selectedCampaign} />
        )}
        {activeTab === 'kpis' && (
          <SpecializedKPIsPanel selectedCampaign={selectedCampaign} />
        )}
        {activeTab === 'revenue' && (
          <RevenueAttributionPanel selectedCampaign={selectedCampaign} />
        )}
        {activeTab === 'audience' && (
          <AudienceDNAPanel selectedCampaign={selectedCampaign} />
        )}
      </div>
    </div>
  );
};

export default BrandDashboardSpecializedKPIsCenter;