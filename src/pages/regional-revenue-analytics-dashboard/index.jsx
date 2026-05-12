import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
  const [dateRange, setDateRange] = useState('30d');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    loadData();
    analytics?.trackEvent('regional_revenue_analytics_viewed', {
      active_tab: activeTab
    });

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
    { id: 'geographic', label: 'Geographic', icon: 'Globe' }
  ];

  const totalRevenue = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.totalRevenue || 0), 0);
  const totalCreatorEarnings = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.creatorEarnings || 0), 0);
  const totalPlatformEarnings = countryAnalytics?.reduce((sum, c) => sum + parseFloat(c?.platformEarnings || 0), 0);
  const totalActiveCreators = countryAnalytics?.reduce((sum, c) => sum + parseInt(c?.activeCreatorsCount || 0), 0);

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

  return (
    <GeneralPageLayout title="Regional Revenue Analytics" showSidebar={true}>
      <Helmet>
        <title>Regional Revenue Analytics Dashboard | Vottery Admin</title>
        <meta name="description" content="Comprehensive regional revenue analytics with creator earnings by country and geographic distribution" />
      </Helmet>

      <div className="w-full py-0">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Regional Revenue Analytics
              </h1>
              <p className="text-sm md:text-base text-muted-foreground flex items-center gap-2">
                Geographic revenue distribution and creator earnings analysis
                <span className="inline-flex w-1 h-1 rounded-full bg-muted-foreground" />
                <span className="text-xs">Updated: {lastUpdated?.toLocaleTimeString()}</span>
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e?.target?.value)}
                className="bg-card/40 backdrop-blur-md border border-border/50 rounded-xl px-4 py-2 text-sm text-foreground outline-none ring-primary/20 focus:ring-2 transition-all"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                iconName={loading ? 'Loader2' : 'RefreshCw'}
              >
                {loading ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-xl w-fit border border-border/50">
            {tabs?.map((tab) => {
              const isActive = activeTab === tab?.id;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${
                    isActive
                      ? 'bg-card text-foreground shadow-sm border border-border/50'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="text-sm font-medium">{tab?.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 backdrop-blur-xl border border-border/50 rounded-2xl">
            <Icon name="Loader2" size={40} className="animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Mapping regional data...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue', value: `$${totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'DollarSign', detail: `${countryAnalytics?.length} countries`, color: 'primary' },
                    { label: 'Creator Earnings', value: `$${totalCreatorEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: 'TrendingUp', detail: `${totalRevenue > 0 ? ((totalCreatorEarnings / totalRevenue) * 100)?.toFixed(1) : 0}% of total`, color: 'success' },
                    { label: 'Active Creators', value: totalActiveCreators?.toLocaleString(), icon: 'Users', detail: `${verifiedCreators?.length} verified`, color: 'secondary' },
                    { label: 'Avg per Creator', value: `$${totalActiveCreators > 0 ? (totalCreatorEarnings / totalActiveCreators)?.toFixed(2) : '0.00'}`, icon: 'Target', detail: 'per creator', color: 'accent' }
                  ].map((metric, i) => (
                    <div key={i} className="premium-glass bg-card/40 p-5 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-${metric.color}/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <Icon name={metric.icon} size={24} className={`text-${metric.color}`} />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{metric.label}</p>
                          <p className="text-2xl font-bold text-foreground font-data">{metric.value}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                        <span className="text-xs text-muted-foreground">{metric.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Top Countries */}
                <div className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-foreground">Top 10 Countries by Revenue</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">Creator Earnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-xs text-muted-foreground">Platform Earnings</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={earningsByCountryData} margin={{ bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="country" 
                          stroke="rgba(255,255,255,0.4)" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          angle={-25}
                          textAnchor="end"
                        />
                        <YAxis 
                          stroke="rgba(255,255,255,0.4)" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(value) => `$${value/1000}k`}
                        />
                        <Tooltip
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            color: '#fff'
                          }}
                        />
                        <Bar dataKey="creatorEarnings" stackId="a" fill="#2563EB" radius={[0, 0, 0, 0]} name="Creator Earnings" barSize={30} />
                        <Bar dataKey="platformEarnings" stackId="a" fill="#7C3AED" radius={[8, 8, 0, 0]} name="Platform Earnings" barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Creator Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="premium-glass bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
                  <div className="p-6 border-b border-border/30 bg-muted/20">
                    <h3 className="text-lg font-bold text-foreground">Global Creator Earnings Distribution</h3>
                    <p className="text-sm text-muted-foreground">Detailed breakdown of regional income and platform splits</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/30">
                          <th className="text-left py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Region</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Creator Earnings</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Creators</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg/Creator</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Regional Split</th>
                          <th className="text-right py-4 px-6 text-xs font-bold text-muted-foreground uppercase tracking-wider">Volume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {countryAnalytics
                          ?.sort((a, b) => parseFloat(b?.creatorEarnings) - parseFloat(a?.creatorEarnings))
                          ?.map((country, index) => {
                            const split = countrySplits?.find(s => s?.countryCode === country?.countryCode);
                            return (
                              <tr key={country?.id} className="border-b border-border/20 hover:bg-primary/5 transition-colors group">
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold border border-border/50">
                                      {country?.countryCode}
                                    </div>
                                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{country?.countryName}</span>
                                  </div>
                                </td>
                                <td className="text-right py-4 px-6 font-data font-bold text-foreground">
                                  ${parseFloat(country?.creatorEarnings || 0)?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="text-right py-4 px-6 text-foreground font-medium">
                                  {country?.activeCreatorsCount || 0}
                                </td>
                                <td className="text-right py-4 px-6 font-data text-muted-foreground">
                                  ${country?.activeCreatorsCount > 0
                                    ? (parseFloat(country?.creatorEarnings) / country?.activeCreatorsCount)?.toFixed(2)
                                    : '0.00'
                                  }
                                </td>
                                <td className="text-right py-4 px-6">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                                    {split?.creatorPercentage || parseFloat(country?.averageSplitPercentage || 70)?.toFixed(0)}%
                                  </span>
                                </td>
                                <td className="text-right py-4 px-6 text-muted-foreground text-sm">
                                  {country?.totalTransactions || 0} tx
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
                    <h3 className="text-xl font-bold text-foreground mb-8">System-wide Revenue Share</h3>
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Creator Earnings', value: totalCreatorEarnings, color: '#2563EB' },
                              { name: 'Platform Earnings', value: totalPlatformEarnings, color: '#7C3AED' }
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            <Cell fill="#2563EB" strokeWidth={0} />
                            <Cell fill="#7C3AED" strokeWidth={0} />
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '16px',
                              backdropFilter: 'blur(12px)',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              color: '#fff'
                            }}
                            formatter={(value) => `$${value?.toLocaleString()}`}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col gap-4 mt-4">
                      {[
                        { name: 'Creator Share', value: totalCreatorEarnings, color: 'bg-primary', percent: ((totalCreatorEarnings / totalRevenue) * 100).toFixed(1) },
                        { name: 'Platform Reserve', value: totalPlatformEarnings, color: 'bg-secondary', percent: ((totalPlatformEarnings / totalRevenue) * 100).toFixed(1) }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-background/40 rounded-xl border border-border/30">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">${item.value?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.percent}% total</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
                    <h3 className="text-xl font-bold text-foreground mb-8">Split Optimization Performance</h3>
                    <div className="space-y-4">
                      {splitEffectivenessData?.slice(0, 5)?.map((item, index) => (
                        <div key={index} className="p-5 bg-background/40 rounded-2xl border border-border/30 hover:border-primary/30 transition-all group">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-foreground">{item?.country}</span>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                              {item?.creatorPercentage}% Split
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-8">
                            <div className="relative">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Active Talent</p>
                              <p className="text-2xl font-bold text-foreground font-data tracking-tight">{item?.activeCreators}</p>
                              <div className="absolute top-0 right-0 w-8 h-8 opacity-10">
                                <Icon name="Users" size={32} />
                              </div>
                            </div>
                            <div className="relative">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">ARPU (Est.)</p>
                              <p className="text-2xl font-bold text-foreground font-data tracking-tight">${item?.avgRevenue?.toFixed(2)}</p>
                              <div className="absolute top-0 right-0 w-8 h-8 opacity-10">
                                <Icon name="Target" size={32} />
                              </div>
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
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
                  <h3 className="text-xl font-bold text-foreground mb-8">Efficiency Corridor Comparison</h3>
                  <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={splitEffectivenessData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis 
                          dataKey="country" 
                          stroke="rgba(255,255,255,0.4)" 
                          fontSize={12} 
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis yAxisId="left" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(12px)',
                            color: '#fff'
                          }}
                        />
                        <Legend iconType="circle" />
                        <Bar yAxisId="left" dataKey="activeCreators" fill="#2563EB" radius={[8, 8, 0, 0]} name="Active Creators" barSize={40} />
                        <Line yAxisId="right" type="monotone" dataKey="avgRevenue" stroke="#F59E0B" name="Avg Revenue/Creator" strokeWidth={4} dot={{ r: 6, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Highest Productivity', value: splitEffectivenessData?.[0]?.country || 'N/A', sub: `$${splitEffectivenessData?.[0]?.avgRevenue?.toFixed(2) || '0.00'} per creator`, icon: 'Zap' },
                    { label: 'Market Leader', value: splitEffectivenessData?.sort((a, b) => b?.activeCreators - a?.activeCreators)?.[0]?.country || 'N/A', sub: `${splitEffectivenessData?.sort((a, b) => b?.activeCreators - a?.activeCreators)?.[0]?.activeCreators || 0} active creators`, icon: 'Activity' },
                    { label: 'Optimal Incentives', value: splitEffectivenessData?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)?.[0]?.country || 'N/A', sub: `${splitEffectivenessData?.sort((a, b) => b?.creatorPercentage - a?.creatorPercentage)?.[0]?.creatorPercentage || 0}% retention rate`, icon: 'Award' }
                  ].map((insight, i) => (
                    <div key={i} className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50 group">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon name={insight.icon} size={20} className="text-primary" />
                      </div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{insight.label}</h4>
                      <p className="text-2xl font-bold text-foreground mb-2">{insight.value}</p>
                      <p className="text-sm text-muted-foreground">{insight.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Geographic Distribution Tab */}
            {activeTab === 'geographic' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
                  <h3 className="text-xl font-bold text-foreground mb-8">Geographic Revenue Distribution</h3>
                  <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={geographicDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {geographicDistributionData?.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} strokeWidth={0} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            backdropFilter: 'blur(12px)',
                            color: '#fff'
                          }}
                          formatter={(value, name, props) => [
                            `$${value?.toLocaleString()}`,
                            `${props?.payload?.creators} Active Creators`
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {geographicDistributionData?.map((country, index) => (
                    <div key={index} className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50 hover:shadow-lg transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-bold text-foreground">{country?.name}</span>
                        <div
                          className="w-2.5 h-2.5 rounded-full ring-4 ring-background/50 shadow-sm"
                          style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                        />
                      </div>
                      <p className="text-3xl font-bold text-foreground font-data mb-1">
                        ${country?.value?.toLocaleString()}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">
                          {country?.creators} creators
                        </p>
                        <p className="text-xs font-bold text-primary">
                          {((country?.value / totalRevenue) * 100)?.toFixed(1)}% Share
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default RegionalRevenueAnalyticsDashboard;