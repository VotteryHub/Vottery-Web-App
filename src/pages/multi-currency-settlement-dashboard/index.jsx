import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import DashboardOverview from './components/DashboardOverview';
import RegionalBreakdown from './components/RegionalBreakdown';
import CurrencyConversionPanel from './components/CurrencyConversionPanel';
import SettlementTimeline from './components/SettlementTimeline';
import ComplianceReporting from './components/ComplianceReporting';
import { analytics } from '../../hooks/useGoogleAnalytics';

const MultiCurrencySettlementDashboard = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [settlementData, setSettlementData] = useState({
    overview: null,
    regionalData: [],
    currencyRates: {},
    timelines: [],
    complianceReports: []
  });

  useEffect(() => {
    loadSettlementData();
    
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, [timeRange]);

  useEffect(() => {
    analytics?.trackEvent('settlement_dashboard_viewed', {
      time_range: timeRange,
      timestamp: new Date()?.toISOString()
    });
  }, [timeRange]);

  const loadSettlementData = async () => {
    try {
      setLoading(true);
      
      // Simulate API call for settlement data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSettlementData({
        overview: {
          totalPayouts: 1245680.50,
          activeSettlements: 47,
          pendingAmount: 89450.25,
          completedToday: 23,
          avgProcessingTime: 2.4,
          successRate: 98.7
        },
        regionalData: [
          { region: 'North America', currency: 'USD', amount: 425000, settlements: 15, avgRate: 1.0, processingTime: 1.8 },
          { region: 'Europe', currency: 'EUR', amount: 380000, settlements: 12, avgRate: 0.92, processingTime: 2.1 },
          { region: 'Asia Pacific', currency: 'JPY', amount: 45000000, settlements: 10, avgRate: 149.5, processingTime: 2.8 },
          { region: 'United Kingdom', currency: 'GBP', amount: 280000, settlements: 8, avgRate: 0.79, processingTime: 1.9 },
          { region: 'India', currency: 'INR', amount: 28500000, settlements: 18, avgRate: 83.2, processingTime: 3.2 },
          { region: 'Latin America', currency: 'BRL', amount: 1850000, settlements: 9, avgRate: 4.98, processingTime: 3.5 },
          { region: 'Middle East', currency: 'AED', amount: 1350000, settlements: 6, avgRate: 3.67, processingTime: 2.6 },
          { region: 'Africa', currency: 'ZAR', amount: 6200000, settlements: 5, avgRate: 18.5, processingTime: 4.1 }
        ],
        currencyRates: {
          USD: { rate: 1.0, change: 0, trend: 'stable' },
          EUR: { rate: 0.92, change: -0.5, trend: 'down' },
          GBP: { rate: 0.79, change: 0.3, trend: 'up' },
          JPY: { rate: 149.5, change: 1.2, trend: 'up' },
          INR: { rate: 83.2, change: -0.8, trend: 'down' },
          BRL: { rate: 4.98, change: 2.1, trend: 'up' },
          AED: { rate: 3.67, change: 0, trend: 'stable' },
          ZAR: { rate: 18.5, change: -1.5, trend: 'down' }
        },
        timelines: [
          { id: 1, region: 'Europe', amount: 45000, currency: 'EUR', status: 'processing', stage: 'bank_transfer', estimatedCompletion: '2026-01-23' },
          { id: 2, region: 'Asia Pacific', amount: 3200000, currency: 'JPY', status: 'pending', stage: 'initiated', estimatedCompletion: '2026-01-24' },
          { id: 3, region: 'North America', amount: 28000, currency: 'USD', status: 'completed', stage: 'confirmed', estimatedCompletion: '2026-01-22' }
        ],
        complianceReports: [
          { id: 1, type: 'AML Screening', status: 'passed', date: '2026-01-22', region: 'All' },
          { id: 2, type: 'Tax Compliance', status: 'passed', date: '2026-01-22', region: 'Europe' },
          { id: 3, type: 'Transfer Limits', status: 'warning', date: '2026-01-22', region: 'India' }
        ]
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load settlement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadSettlementData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const timeRangeOptions = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  return (
    <GeneralPageLayout title="Multi-Currency Settlement" showSidebar={true}>
      <Helmet>
        <title>Multi-Currency Settlement Dashboard - Vottery</title>
        <meta name="description" content="Track international payouts across regions with real-time currency conversion rates, settlement timelines, and compliance reporting for each purchasing power zone." />
      </Helmet>

      <div className="w-full py-0">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Multi-Currency Settlement Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Track international payouts with real-time currency rates and compliance monitoring
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  className="input py-2 px-3 text-sm"
                >
                  {timeRangeOptions?.map(option => (
                    <option key={option?.value} value={option?.value}>
                      {option?.label}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshData}
                  disabled={refreshing}
                  iconName={refreshing ? 'Loader2' : 'RefreshCw'}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>Last updated: {lastUpdated?.toLocaleTimeString()}</span>
              <span className="mx-2">•</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span>Live updates every 60s</span>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader2" size={40} className="animate-spin text-primary mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Loading settlement data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <DashboardOverview data={settlementData?.overview} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CurrencyConversionPanel rates={settlementData?.currencyRates} />
                <SettlementTimeline timelines={settlementData?.timelines} />
              </div>

              <RegionalBreakdown data={settlementData?.regionalData} />
              
              <ComplianceReporting reports={settlementData?.complianceReports} />
            </div>
          )}
      </div>
    </GeneralPageLayout>
  );
};

export default MultiCurrencySettlementDashboard;