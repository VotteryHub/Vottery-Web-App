import React, { useState, useEffect, useCallback } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import FeatureAdoptionPanel from './components/FeatureAdoptionPanel';
import CohortAnalysisPanel from './components/CohortAnalysisPanel';
import ABTestingPanel from './components/ABTestingPanel';
import RevenueImpactPanel from './components/RevenueImpactPanel';

const TABS = [
  { id: 'overview', label: 'Feature Overview', icon: 'BarChart2' },
  { id: 'cohort', label: 'Cohort Analysis', icon: 'Users' },
  { id: 'abtesting', label: 'A/B Testing', icon: 'GitBranch' },
  { id: 'revenue', label: 'Revenue Impact', icon: 'DollarSign' },
];

const ComprehensiveFeatureAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [summaryMetrics, setSummaryMetrics] = useState({
    totalScreens: 143,
    avgAdoptionRate: 0,
    totalActiveUsers: 0,
    totalRevenue: 0,
  });

  const fetchSummaryMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const { count: userCount } = await supabase
        ?.from('user_profiles')
        ?.select('*', { count: 'exact', head: true });

      setSummaryMetrics({
        totalScreens: 143,
        avgAdoptionRate: 67.4,
        totalActiveUsers: userCount || 0,
        totalRevenue: 284750,
      });
    } catch (err) {
      console.error('Error fetching summary metrics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummaryMetrics();
  }, [fetchSummaryMetrics, timeRange]);

  const summaryCards = [
    {
      label: 'Total Screens Tracked',
      value: summaryMetrics?.totalScreens,
      icon: 'Monitor',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      change: '+12',
    },
    {
      label: 'Avg Adoption Rate',
      value: `${summaryMetrics?.avgAdoptionRate}%`,
      icon: 'TrendingUp',
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      change: '+3.2%',
    },
    {
      label: 'Active Users',
      value: loading ? '...' : summaryMetrics?.totalActiveUsers?.toLocaleString(),
      icon: 'Users',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      change: '+8.1%',
    },
    {
      label: 'Revenue Impact',
      value: `$${(summaryMetrics?.totalRevenue / 1000)?.toFixed(1)}K`,
      icon: 'DollarSign',
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10',
      change: '+15.3%',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
                  <Icon name="BarChart2" size={28} className="text-primary" />
                  Comprehensive Feature Analytics
                </h1>
                <p className="text-muted-foreground mt-1">
                  Adoption tracking, engagement analysis, and revenue impact across all 143 platform screens
                </p>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  className="bg-card border border-border text-foreground text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <button
                  onClick={fetchSummaryMetrics}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  <Icon name="RefreshCw" size={14} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {summaryCards?.map((card) => (
              <div key={card?.label} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${card?.bg}`}>
                    <Icon name={card?.icon} size={20} className={card?.color} />
                  </div>
                  <span className="text-xs text-green-500 font-medium">{card?.change}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{card?.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{card?.label}</p>
              </div>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="border-b border-border overflow-x-auto">
              <div className="flex min-w-max">
                {TABS?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-200 border-b-2 flex-shrink-0 text-sm ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    {tab?.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && <FeatureAdoptionPanel timeRange={timeRange} />}
              {activeTab === 'cohort' && <CohortAnalysisPanel timeRange={timeRange} />}
              {activeTab === 'abtesting' && <ABTestingPanel />}
              {activeTab === 'revenue' && <RevenueImpactPanel timeRange={timeRange} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComprehensiveFeatureAnalyticsDashboard;
