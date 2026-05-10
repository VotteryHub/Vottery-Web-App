import React, { useState, useEffect } from 'react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import LiveMetricsPanel from './components/LiveMetricsPanel';
import ConversionAnalyticsPanel from './components/ConversionAnalyticsPanel';
import AutomatedOptimizationEngine from './components/AutomatedOptimizationEngine';
import CostEfficiencyMonitoring from './components/CostEfficiencyMonitoring';
import PredictiveModeling from './components/PredictiveModeling';
import MilestoneAlertsPanel from './components/MilestoneAlertsPanel';
import { analyticsService } from '../../services/analyticsService';
import { campaignOptimizationService } from '../../services/campaignOptimizationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const EnhancedRealTimeAdvertiserROIDashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [optimizationSummary, setOptimizationSummary] = useState(null);
  const [roiData, setRoiData] = useState({
    overview: null,
    liveMetrics: null,
    conversion: null,
    costEfficiency: null,
    predictions: null
  });

  useEffect(() => {
    loadROIData();
    loadOptimizationSummary();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    analytics?.trackEvent('roi_dashboard_viewed', {
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [timeRange]);

  const loadROIData = async () => {
    try {
      setLoading(true);
      
      const [overviewResult, metricsResult, conversionResult, costResult] = await Promise.all([
        analyticsService?.getCampaignOverview(timeRange),
        analyticsService?.getLiveCampaignMetrics(timeRange),
        analyticsService?.getConversionTracking(timeRange),
        analyticsService?.getCostAnalysis(timeRange)
      ]);

      setRoiData({
        overview: overviewResult?.data,
        liveMetrics: metricsResult?.data,
        conversion: conversionResult?.data,
        costEfficiency: costResult?.data,
        predictions: (() => {
          const spend = Number(overviewResult?.data?.totalSpent || 0);
          const revenue = Number(overviewResult?.data?.totalRevenue || 0);
          const roi = spend > 0 ? ((revenue - spend) / spend) * 100 : 0;
          const recentConversionRate = Number(conversionResult?.data?.conversionRate || 0);
          const trend = recentConversionRate >= 5 ? 'upward' : recentConversionRate >= 2 ? 'stable' : 'downward';
          return {
            projectedROI: Number(roi.toFixed(2)),
            seasonalTrend: trend,
            optimalSpending: Number((spend * 1.1).toFixed(2)),
          };
        })(),
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load ROI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOptimizationSummary = async () => {
    try {
      const result = await campaignOptimizationService?.getOptimizationDashboard(timeRange);
      if (result?.data?.summary) {
        setOptimizationSummary(result?.data?.summary);
      }
    } catch (error) {
      console.error('Failed to load optimization summary:', error);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadROIData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' }
  ];

  return (
    <GeneralPageLayout 
      title="Enhanced Real-Time Advertiser ROI Dashboard" 
      description="Advanced performance analytics with live campaign metrics, automated optimization recommendations, and predictive ROI modeling for strategic decision-making."
      showSidebar={false}
      maxWidth="max-w-[1600px]"
    >
      <div className="w-full">
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Enhanced Real-Time Advertiser ROI Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Advanced analytics with AI-powered optimization and predictive modeling
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
                Export Analytics
              </Button>
              {optimizationSummary && optimizationSummary?.highPriority > 0 && (
                <Button 
                  variant="default" 
                  size="sm" 
                  iconName="AlertCircle"
                  onClick={() => window.location.href = '/automated-campaign-optimization-dashboard'}
                >
                  {optimizationSummary?.highPriority} High Priority Actions
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading analytics data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <MilestoneAlertsPanel data={roiData} campaignData={roiData?.overview} />
              <LiveMetricsPanel data={roiData} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConversionAnalyticsPanel data={roiData} />
                <CostEfficiencyMonitoring data={roiData} />
              </div>
              <AutomatedOptimizationEngine data={roiData} />
              <PredictiveModeling data={roiData} />
            </div>
          )}
        </div>
    </GeneralPageLayout>
  );
};

export default EnhancedRealTimeAdvertiserROIDashboard;