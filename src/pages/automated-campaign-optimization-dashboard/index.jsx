import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OptimizationOverview from './components/OptimizationOverview';
import BudgetReallocationPanel from './components/BudgetReallocationPanel';
import AudienceExpansionPanel from './components/AudienceExpansionPanel';
import CreativeRotationPanel from './components/CreativeRotationPanel';
import PerformanceThresholdsPanel from './components/PerformanceThresholdsPanel';
import AIContentGeneratorPanel from './components/AIContentGeneratorPanel';
import { campaignOptimizationService } from '../../services/campaignOptimizationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AutomatedCampaignOptimizationDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [optimizationData, setOptimizationData] = useState({
    summary: null,
    budgetRecommendations: null,
    audienceRecommendations: null,
    creativeRecommendations: null,
    performanceThresholds: null
  });

  useEffect(() => {
    loadOptimizationData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    analytics?.trackEvent('optimization_dashboard_viewed', {
      time_range: timeRange,
      total_recommendations: optimizationData?.summary?.totalRecommendations || 0,
      timestamp: new Date()?.toISOString()
    });
  }, [timeRange, optimizationData?.summary]);

  const loadOptimizationData = async () => {
    try {
      setLoading(true);
      const result = await campaignOptimizationService?.getOptimizationDashboard(timeRange);
      
      if (result?.data) {
        setOptimizationData(result?.data);
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load optimization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadOptimizationData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleApplyOptimization = async (recommendationId) => {
    try {
      const result = await campaignOptimizationService?.applyOptimization(recommendationId, 'campaign-1');
      
      if (result?.data?.success) {
        analytics?.trackEvent('optimization_applied', {
          recommendation_id: recommendationId,
          timestamp: new Date()?.toISOString()
        });
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to apply optimization:', error);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  return (
    <GeneralPageLayout 
      title="Automated Campaign Optimization Dashboard" 
      description="Real-time ML-powered campaign optimization with automated budget reallocation, audience expansion, creative rotation, and AI-generated content recommendations."
      showSidebar={false}
      maxWidth="max-w-[1600px]"
    >
      <div className="w-full">
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                    Automated Campaign Optimization
                  </h1>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                    <Icon name="Sparkles" size={16} className="text-primary" />
                    <span className="text-xs font-semibold text-primary">AI + ML Powered</span>
                  </div>
                </div>
                <p className="text-sm md:text-base text-muted-foreground">
                  Real-time optimization with automated budget reallocation, audience expansion, and creative rotation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {refreshing ? 'Updating...' : `Live • ${lastUpdated?.toLocaleTimeString()}`}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-foreground">Time Range:</span>
              <div className="flex gap-2">
                {timeRangeOptions?.map((option) => (
                  <button
                    key={option?.value}
                    onClick={() => setTimeRange(option?.value)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                      timeRange === option?.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-foreground hover:bg-muted border border-border'
                    }`}
                  >
                    {option?.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" iconName="Download" className="ml-auto">
                Export Report
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading optimization data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <OptimizationOverview data={optimizationData?.summary} />
              <PerformanceThresholdsPanel data={optimizationData?.performanceThresholds} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BudgetReallocationPanel 
                  data={optimizationData?.budgetRecommendations} 
                  onApply={handleApplyOptimization}
                />
                <AudienceExpansionPanel 
                  data={optimizationData?.audienceRecommendations}
                  onApply={handleApplyOptimization}
                />
              </div>
              <CreativeRotationPanel 
                data={optimizationData?.creativeRecommendations}
                onApply={handleApplyOptimization}
              />
              <AIContentGeneratorPanel />
            </div>
          )}
        </div>
    </GeneralPageLayout>
  );
};

export default AutomatedCampaignOptimizationDashboard;