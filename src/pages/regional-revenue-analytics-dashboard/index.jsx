import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { PieChart, Pie, Cell, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { countryRevenueShareService } from '../../services/countryRevenueShareService';
import { creatorVerificationService } from '../../services/creatorVerificationService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';
import toast from 'react-hot-toast';

const RegionalRevenueAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [countrySplits, setCountrySplits] = useState([]);
  const [countryAnalytics, setCountryAnalytics] = useState([]);
  const [verifiedCreators, setVerifiedCreators] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    loadData();
    analytics?.trackEvent('regional_revenue_analytics_viewed', {
      active_tab: activeTab
    });

    // Real-time subscription
    const channel = supabase
      ?.channel('regional_revenue_realtime')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'country_revenue_analytics' },
        () => loadData()
      )
      ?.subscribe();

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }, [activeTab, dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);

      const periodStart = new Date();
      if (dateRange === '7d') periodStart?.setDate(periodStart?.getDate() - 7);
      else if (dateRange === '30d') periodStart?.setDate(periodStart?.getDate() - 30);
      else if (dateRange === '90d') periodStart?.setDate(periodStart?.getDate() - 90);

      const [splitsResult, analyticsResult, creatorsResult] = await Promise.all([
        countryRevenueShareService?.getActiveCountrySplits(),
        countryRevenueShareService?.getCountryAnalytics(null, periodStart?.toISOString(), new Date()?.toISOString()),
        creatorVerificationService?.getVerifiedCreatorsByCountry()
      ]);

      if (splitsResult?.data) setCountrySplits(splitsResult?.data);
      if (analyticsResult?.data) setCountryAnalytics(analyticsResult?.data);
      if (creatorsResult?.data) setVerifiedCreators(creatorsResult?.data);

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error loading regional revenue data:', error);
      toast?.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'earnings', label: 'Creator Earnings', icon: 'DollarSign' },
    { id: 'splits', label: 'Revenue Splits', icon: 'PieChart' },
    { id: 'performance', label: 'Performance', icon: 'TrendingUp' },
    { id: 'geographic', label: 'Geographic Distribution', icon: 'Globe' }
  ];

  // Calculate aggregated metrics
  const totalRevenue = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.totalRevenue || 0), 0);
  const totalCreatorEarnings = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.creatorEarnings || 0), 0);
  const totalPlatformEarnings = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.platformEarnings || 0), 0);
  const totalActiveCreators = countryAnalytics?.reduce((sum, c) => sum + parseInt(c?.activeCreatorsCount || 0), 0);

  // Prepare chart data
  const earningsByCountryData = countryAnalytics
    ?.sort((a, b) => parseFloat(b?.totalRevenue) - parseFloat(a?.totalRevenue))
    ?.slice(0, 10)
    ?.map(c => ({
      country: c?.countryName || c?.countryCode,
      creatorEarnings: parseFloat(c?.creatorEarnings || 0),
      platformEarnings: parseFloat(c?.platformEarnings || 0),
      totalRevenue: parseFloat(c?.totalRevenue || 0)
    }));

  const splitEffectivenessData = countrySplits?.map(split => {
    const analytics = countryAnalytics?.find(a => a?.countryCode === split?.countryCode);
    return {
      country: split?.countryName,
      creatorPercentage: parseFloat(split?.creatorPercentage || 70),
      activeCreators: analytics?.activeCreatorsCount || 0,
      avgRevenue: analytics ? parseFloat(analytics?.totalRevenue) / (analytics?.activeCreatorsCount || 1) : 0
    };
  })?.sort((a, b) => b?.avgRevenue - a?.avgRevenue)?.slice(0, 10);

  const geographicDistributionData = countryAnalytics?.map(c => ({
    name: c?.countryName || c?.countryCode,
    value: parseFloat(c?.totalRevenue || 0),
    creators: c?.activeCreatorsCount || 0
  }))?.sort((a, b) => b?.value - a?.value)?.slice(0, 8);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Regional Revenue Analytics Dashboard | Vottery Admin</title>
        <meta name="description" content="Comprehensive regional revenue analytics with creator earnings by country and geographic distribution" />
      </Helmet>
      <HeaderNavigation />
      <AdminToolbar />
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              🌍 Regional Revenue Analytics
            </h1>
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e?.target?.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card text-foreground text-sm"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button onClick={loadData} variant="outline" size="sm">
                <Icon name="RefreshCw" size={16} />
                Refresh
              </Button>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground">
            Geographic revenue distribution and creator earnings analysis
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Last updated: {lastUpdated?.toLocaleString()}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="DollarSign" size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">{countryAnalytics?.length} countries</span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Creator Earnings</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${totalCreatorEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-semibold text-primary">
                    {totalRevenue > 0 ? ((totalCreatorEarnings / totalRevenue) * 100)?.toFixed(1) : 0}%
                  </span>
                  <span className="text-xs text-muted-foreground">of total revenue</span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Active Creators</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      {totalActiveCreators?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">
                    {verifiedCreators?.length} verified
                  </span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon name="Target" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Avg per Creator</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${totalActiveCreators > 0 ? (totalCreatorEarnings / totalActiveCreators)?.toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs text-muted-foreground">per creator</span>
                </div>
              </div>
            </div>

            {/* Top Countries */}
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Top 10 Countries by Revenue
              </h3>
              <div className="w-full h-96" aria-label="Top Countries Revenue Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsByCountryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="country" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                      }}
                      formatter={(value) => `$${value?.toLocaleString()}`}
                    />
                    <Legend />
                    <Bar dataKey="creatorEarnings" fill="#2563EB" name="Creator Earnings" />
                    <Bar dataKey="platformEarnings" fill="#7C3AED" name="Platform Earnings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Creator Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Creator Earnings by Country
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Country</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total Earnings</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Active Creators</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Avg per Creator</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Split %</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Transactions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {countryAnalytics
                      ?.sort((a, b) => parseFloat(b?.creatorEarnings) - parseFloat(a?.creatorEarnings))
                      ?.map((country, index) => {
                        const split = countrySplits?.find(s => s?.countryCode === country?.countryCode);
                        return (
                          <tr key={country?.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{country?.countryCode}</span>
                                <span className="font-medium text-foreground">{country?.countryName}</span>
                              </div>
                            </td>
                            <td className="text-right py-3 px-4 font-data font-semibold text-foreground">
                              ${parseFloat(country?.creatorEarnings || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                            <td className="text-right py-3 px-4 text-foreground">
                              {country?.activeCreatorsCount || 0}
                            </td>
                            <td className="text-right py-3 px-4 font-data text-foreground">
                              ${country?.activeCreatorsCount > 0
                                ? (parseFloat(country?.creatorEarnings) / country?.activeCreatorsCount)?.toFixed(2)
                                : '0.00'
                              }
                            </td>
                            <td className="text-right py-3 px-4">
                              <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                                {split?.creatorPercentage || parseFloat(country?.averageSplitPercentage || 70)?.toFixed(0)}%
                              </span>
                            </td>
                            <td className="text-right py-3 px-4 text-muted-foreground">
                              {country?.totalTransactions || 0}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Splits Tab */}
        {activeTab === 'splits' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                  Revenue Share Totals
                </h3>
                <div className="w-full h-80" aria-label="Revenue Share Distribution">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Creator Earnings', value: totalCreatorEarnings, color: '#2563EB' },
                          { name: 'Platform Earnings', value: totalPlatformEarnings, color: '#7C3AED' }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(1)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#2563EB" />
                        <Cell fill="#7C3AED" />
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--color-card)',
                          border: '1px solid var(--color-border)',
                          borderRadius: '12px',
                        }}
                        formatter={(value) => `$${value?.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                  Split Effectiveness Metrics
                </h3>
                <div className="space-y-3">
                  {splitEffectivenessData?.slice(0, 5)?.map((item, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{item?.country}</span>
                        <span className="text-sm font-semibold text-primary">{item?.creatorPercentage}%</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Active Creators</p>
                          <p className="font-data font-semibold text-foreground">{item?.activeCreators}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Avg Revenue</p>
                          <p className="font-data font-semibold text-foreground">${item?.avgRevenue?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Performance Comparisons Across Regions
              </h3>
              <div className="w-full h-96" aria-label="Performance Comparison Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={splitEffectivenessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="country" stroke="var(--color-muted-foreground)" />
                    <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="activeCreators" fill="#2563EB" name="Active Creators" />
                    <Line yAxisId="right" type="monotone" dataKey="avgRevenue" stroke="#F59E0B" name="Avg Revenue" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Highest Creator Productivity</h4>
                <p className="text-2xl font-heading font-bold text-foreground mb-1">
                  {splitEffectivenessData?.[0]?.country || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  ${splitEffectivenessData?.[0]?.avgRevenue?.toFixed(2) || '0.00'} avg per creator
                </p>
              </div>

              <div className="card">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Most Active Market</h4>
                <p className="text-2xl font-heading font-bold text-foreground mb-1">
                  {splitEffectivenessData?.sort((a, b) => b?.activeCreators - a?.activeCreators)?.[0]?.country || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {splitEffectivenessData?.sort((a, b) => b?.activeCreators - a?.activeCreators)?.[0]?.activeCreators || 0} creators
                </p>
              </div>

              <div className="card">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Best Split Ratio</h4>
                <p className="text-2xl font-heading font-bold text-foreground mb-1">
                  {splitEffectivenessData?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)?.[0]?.country || 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {splitEffectivenessData?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)?.[0]?.creatorPercentage || 0}% creator share
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Geographic Distribution Tab */}
        {activeTab === 'geographic' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Geographic Revenue Distribution Heatmap
              </h3>
              <div className="w-full h-96" aria-label="Geographic Distribution Heatmap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geographicDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {geographicDistributionData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                      }}
                      formatter={(value, name, props) => [
                        `$${value?.toLocaleString()}`,
                        `${props?.payload?.creators} creators`
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-foreground mb-4">
                Market Penetration Analysis
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {geographicDistributionData?.map((country, index) => (
                  <div key={index} className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{country?.name}</span>
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                      />
                    </div>
                    <p className="text-2xl font-heading font-bold text-foreground mb-1">
                      ${country?.value?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {country?.creators} creators
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {((country?.value / totalRevenue) * 100)?.toFixed(1)}% of total
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default RegionalRevenueAnalyticsDashboard;