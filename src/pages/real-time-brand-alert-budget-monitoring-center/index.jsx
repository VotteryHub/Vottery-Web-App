import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import BudgetOverviewPanel from './components/BudgetOverviewPanel';
import AlertConfigurationPanel from './components/AlertConfigurationPanel';
import SpendingAnalyticsPanel from './components/SpendingAnalyticsPanel';
import SlackDiscordIntegrationPanel from './components/SlackDiscordIntegrationPanel';
import ThresholdManagementPanel from './components/ThresholdManagementPanel';
import NotificationHistoryPanel from './components/NotificationHistoryPanel';

import { alertService } from '../../services/alertService';
import { webhookService } from '../../services/webhookService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const RealTimeBrandAlertBudgetMonitoringCenter = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [budgetData, setBudgetData] = useState({
    campaigns: [],
    alerts: [],
    webhooks: [],
    analytics: null
  });

  useEffect(() => {
    loadBudgetData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    analytics?.trackEvent('brand_alert_center_viewed', {
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [timeRange]);

  const loadBudgetData = async () => {
    try {
      setLoading(true);
      
      const [alertsResult, webhooksResult] = await Promise.all([
        alertService?.getSystemAlerts({ category: 'budget', status: 'active', limit: 50 }),
        webhookService?.listWebhooks()
      ]);

      // Mock campaign budget data
      const mockCampaigns = [
        {
          id: 1,
          name: 'Summer Product Launch 2026',
          budgetTotal: 50000,
          budgetSpent: 46500,
          spendPercentage: 93,
          burnRate: 2100,
          projectedExhaustion: '2026-01-25',
          status: 'critical',
          zones: ['PT1', 'PT2', 'MT1']
        },
        {
          id: 2,
          name: 'Brand Awareness Q1',
          budgetTotal: 75000,
          budgetSpent: 68250,
          spendPercentage: 91,
          burnRate: 3200,
          projectedExhaustion: '2026-01-26',
          status: 'warning',
          zones: ['PT1', 'MT1', 'MT2', 'LT1']
        },
        {
          id: 3,
          name: 'Market Research Initiative',
          budgetTotal: 30000,
          budgetSpent: 18900,
          spendPercentage: 63,
          burnRate: 1200,
          projectedExhaustion: '2026-02-05',
          status: 'healthy',
          zones: ['MT1', 'MT2']
        },
        {
          id: 4,
          name: 'Holiday Promotion Campaign',
          budgetTotal: 100000,
          budgetSpent: 89500,
          spendPercentage: 89.5,
          burnRate: 4500,
          projectedExhaustion: '2026-01-25',
          status: 'warning',
          zones: ['PT1', 'PT2', 'MT1', 'MT2', 'LT1']
        }
      ];

      setBudgetData({
        campaigns: mockCampaigns,
        alerts: alertsResult?.data || [],
        webhooks: webhooksResult?.data?.filter(w => w?.eventTypes?.includes('budget.threshold')) || [],
        analytics: {
          totalBudget: mockCampaigns?.reduce((sum, c) => sum + c?.budgetTotal, 0),
          totalSpent: mockCampaigns?.reduce((sum, c) => sum + c?.budgetSpent, 0),
          criticalCampaigns: mockCampaigns?.filter(c => c?.spendPercentage >= 90)?.length,
          averageBurnRate: mockCampaigns?.reduce((sum, c) => sum + c?.burnRate, 0) / mockCampaigns?.length
        }
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadBudgetData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    analytics?.trackEvent('budget_time_range_changed', {
      time_range: range
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Real-Time Brand Alert & Budget Monitoring Center | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Real-Time Brand Alert & Budget Monitoring Center
              </h1>
              <p className="text-muted-foreground">
                Comprehensive campaign budget oversight with automated Slack/Discord notifications at 90% threshold triggers
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon name="Clock" className="w-4 h-4" />
                <span>Updated {lastUpdated?.toLocaleTimeString()}</span>
                {refreshing && (
                  <Icon name="RefreshCw" className="w-4 h-4 animate-spin" />
                )}
              </div>
              <Button
                onClick={refreshData}
                variant="outline"
                size="sm"
                disabled={refreshing}
              >
                <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2 mt-4">
            {['1h', '24h', '7d', '30d']?.map((range) => (
              <Button
                key={range}
                onClick={() => handleTimeRangeChange(range)}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
              >
                {range === '1h' ? 'Last Hour' : range === '24h' ? 'Last 24h' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Budget Overview Panel */}
            <BudgetOverviewPanel 
              campaigns={budgetData?.campaigns}
              analytics={budgetData?.analytics}
              timeRange={timeRange}
            />

            {/* Alert Configuration & Threshold Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertConfigurationPanel 
                alerts={budgetData?.alerts}
                onRefresh={loadBudgetData}
              />
              <ThresholdManagementPanel 
                campaigns={budgetData?.campaigns}
                onRefresh={loadBudgetData}
              />
            </div>

            {/* Spending Analytics */}
            <SpendingAnalyticsPanel 
              campaigns={budgetData?.campaigns}
              timeRange={timeRange}
            />

            {/* Slack/Discord Integration & Notification History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SlackDiscordIntegrationPanel 
                webhooks={budgetData?.webhooks}
                onRefresh={loadBudgetData}
              />
              <NotificationHistoryPanel 
                alerts={budgetData?.alerts}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeBrandAlertBudgetMonitoringCenter;