import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { revenueService } from '../../services/revenueService';

const EnhancedAdminRevenueAnalyticsHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [revenueConfig, setRevenueConfig] = useState([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingConfig, setEditingConfig] = useState(null);

  const COLORS = ['#2563EB', '#7C3AED', '#F59E0B', '#059669', '#DC2626', '#EC4899', '#14B8A6', '#F97316'];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plansRes, configRes, analyticsRes] = await Promise.all([
        revenueService?.getSubscriptionPlans(),
        revenueService?.getRevenueConfig(),
        revenueService?.getRevenueAnalytics(
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)?.toISOString(),
          new Date()?.toISOString()
        )
      ]);

      if (plansRes?.data) setSubscriptionPlans(plansRes?.data);
      if (configRes?.data) setRevenueConfig(configRes?.data);
      if (analyticsRes?.data) setRevenueAnalytics(analyticsRes?.data);
    } catch (error) {
      console.error('Error loading revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (revenueType, percentage) => {
    const { error } = await revenueService?.updateRevenueConfig(revenueType, {
      processingFeePercentage: parseFloat(percentage)
    });

    if (!error) {
      loadData();
      setEditingConfig(null);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Revenue Overview', icon: 'DollarSign' },
    { id: 'subscriptions', label: 'Subscription Management', icon: 'CreditCard' },
    { id: 'processing', label: 'Processing Fees', icon: 'Settings' },
    { id: 'analytics', label: 'Advanced Analytics', icon: 'TrendingUp' }
  ];

  const revenueBreakdownData = [
    { name: 'Participation Fees', value: revenueAnalytics?.participationRevenue || 0, color: '#2563EB' },
    { name: 'Subscriptions', value: revenueAnalytics?.subscriptionRevenue || 0, color: '#7C3AED' },
    { name: 'Advertising', value: 15000, color: '#F59E0B' },
    { name: 'Premium Features', value: 8000, color: '#059669' }
  ];

  const monthlyTrendData = [
    { month: 'Jan', participation: 12000, subscriptions: 5000, advertising: 8000, premium: 3000 },
    { month: 'Feb', participation: 15000, subscriptions: 6500, advertising: 9500, premium: 3500 },
    { month: 'Mar', participation: 18000, subscriptions: 7200, advertising: 11000, premium: 4200 },
    { month: 'Apr', participation: 22000, subscriptions: 8100, advertising: 13000, premium: 5000 },
    { month: 'May', participation: 25000, subscriptions: 9000, advertising: 15000, premium: 6000 },
    { month: 'Jun', participation: 28000, subscriptions: 10500, advertising: 17000, premium: 7500 }
  ];

  return (
    <GeneralPageLayout title="Revenue Analytics Hub" showSidebar={true}>
      <Helmet>
        <title>Enhanced Revenue Analytics Hub - Vottery Admin</title>
        <meta name="description" content="Comprehensive financial oversight and revenue stream management for the Vottery platform." />
      </Helmet>

      <div className="w-full py-0">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                Enhanced Revenue Analytics Hub
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Comprehensive financial oversight and revenue stream management
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                disabled={loading}
                iconName={loading ? 'Loader2' : 'RefreshCw'}
              >
                {loading ? 'Syncing...' : 'Sync Data'}
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
            <p className="text-sm text-muted-foreground">Analysing financial streams...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Revenue Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Revenue (30d)', value: `$${revenueAnalytics?.totalRevenue?.toLocaleString() || '0'}`, icon: 'DollarSign', trend: '+18%', color: 'primary' },
                    { label: 'Participation Fees', value: `$${revenueAnalytics?.participationRevenue?.toLocaleString() || '0'}`, icon: 'TrendingUp', trend: '+23%', color: 'secondary' },
                    { label: 'Subscriptions', value: `$${revenueAnalytics?.subscriptionRevenue?.toLocaleString() || '0'}`, icon: 'CreditCard', trend: '+15%', color: 'accent' },
                    { label: 'Profit Margin', value: '32.5%', icon: 'Target', trend: '+2.3%', color: 'success' }
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
                        <span className="text-xs font-bold text-success flex items-center gap-1">
                          <Icon name="ArrowUpRight" size={12} />
                          {metric.trend}
                        </span>
                        <span className="text-xs text-muted-foreground">vs last period</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Revenue Breakdown Pie Chart */}
                  <div className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground">Revenue Stream Breakdown</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs text-muted-foreground">Real-time Data</span>
                      </div>
                    </div>
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={revenueBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {revenueBreakdownData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry?.color} strokeWidth={0} />
                            ))}
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
                            itemStyle={{ color: '#fff' }}
                            formatter={(value) => [`$${value?.toLocaleString()}`, 'Revenue']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      {revenueBreakdownData.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-muted-foreground truncate">{item.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Trend Line Chart */}
                  <div className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground">Monthly Revenue Trends</h3>
                      <select className="bg-muted/50 text-xs border border-border/50 rounded-lg px-2 py-1 outline-none">
                        <option>Last 6 Months</option>
                        <option>Last Year</option>
                      </select>
                    </div>
                    <div className="w-full h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis 
                            dataKey="month" 
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.4)" 
                            fontSize={12} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(value) => `$${value/1000}k`}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'rgba(15, 23, 42, 0.9)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '16px',
                              backdropFilter: 'blur(12px)',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              color: '#fff'
                            }}
                          />
                          <Legend iconType="circle" />
                          <Line type="monotone" dataKey="participation" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Participation" />
                          <Line type="monotone" dataKey="subscriptions" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} name="Subscriptions" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Management Tab */}
            {activeTab === 'subscriptions' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Active Subscription Tiers</h2>
                    <p className="text-sm text-muted-foreground">Manage platform plans and pricing structures</p>
                  </div>
                  <Button variant="primary" iconName="Plus" iconPosition="left">
                    Create New Plan
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {subscriptionPlans?.map((plan) => (
                    <div key={plan?.id} className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-300 flex flex-col h-full group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon name="Crown" size={20} className="text-primary" />
                        </div>
                        <div className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          plan?.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {plan?.isActive ? 'Live' : 'Hidden'}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-foreground mb-1">{plan?.planName}</h3>
                      <p className="text-sm text-muted-foreground mb-6 line-clamp-2">Standard {plan?.planType} tier for creators and voters.</p>
                      
                      <div className="mt-auto">
                        <div className="mb-6">
                          <p className="text-4xl font-bold text-foreground font-data">
                            ${plan?.price}
                            <span className="text-sm font-normal text-muted-foreground ml-1">/{plan?.duration?.replace('_', ' ')}</span>
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-xl">
                            <Icon name="Settings" size={14} className="mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 rounded-xl hover:text-destructive">
                            <Icon name="Trash2" size={14} className="mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processing Fees Tab */}
            {activeTab === 'processing' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold text-foreground">Fee Configuration Engine</h2>
                  <p className="text-sm text-muted-foreground">Adjust global processing percentages across all platform revenue channels.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {revenueConfig?.map((config) => (
                    <div key={config?.id} className="premium-glass bg-card/40 p-6 rounded-2xl border border-border/50 group">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Icon name="Settings" size={20} className="text-accent" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-foreground capitalize">
                              {config?.revenueType?.replace('_', ' ')}
                            </h3>
                            <p className="text-xs text-muted-foreground">Global Transaction Tax</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-background/50 px-3 py-1.5 rounded-full border border-border/30">
                          <div className={`w-2 h-2 rounded-full ${config?.isEnabled ? 'bg-success animate-pulse' : 'bg-muted-foreground'}`} />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            {config?.isEnabled ? 'Operational' : 'Disabled'}
                          </span>
                        </div>
                      </div>

                      <div className="bg-muted/30 backdrop-blur-md rounded-2xl p-6 mb-6 border border-border/30">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Current Rate:</span>
                          {editingConfig === config?.id ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="number"
                                step="0.01"
                                defaultValue={config?.processingFeePercentage}
                                className="w-24 px-4 py-2 rounded-xl border border-primary/50 bg-background text-foreground text-lg font-bold outline-none ring-2 ring-primary/20"
                                id={`fee-${config?.id}`}
                                autoFocus
                              />
                              <span className="text-xl font-bold text-foreground">%</span>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="text-5xl font-bold text-foreground font-data tracking-tight">
                                {config?.processingFeePercentage}
                              </span>
                              <span className="text-xl font-bold text-muted-foreground">%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3">
                        {editingConfig === config?.id ? (
                          <>
                            <Button
                              variant="primary"
                              className="flex-1 rounded-xl shadow-lg shadow-primary/20"
                              onClick={() => {
                                const input = document.getElementById(`fee-${config?.id}`);
                                handleUpdateConfig(config?.revenueType, input?.value);
                              }}
                            >
                              Update Rate
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1 rounded-xl"
                              onClick={() => setEditingConfig(null)}
                            >
                              Discard
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="outline"
                            className="w-full rounded-xl hover:bg-primary/10 hover:border-primary/30 transition-all"
                            onClick={() => setEditingConfig(config?.id)}
                          >
                            <Icon name="Edit" size={16} className="mr-2" />
                            Adjust Percentage
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="premium-glass bg-card/40 p-8 rounded-2xl border border-border/50">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Revenue by Purchasing Power Zone</h3>
                      <p className="text-sm text-muted-foreground">Geographic distribution of income across global economic zones</p>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Icon name="Download" size={14} className="mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { zone: 'Zone 1 (US)', revenue: 45000, transactions: 1200 },
                          { zone: 'Zone 2 (EU)', revenue: 38000, transactions: 980 },
                          { zone: 'Zone 3 (CA)', revenue: 28000, transactions: 750 },
                          { zone: 'Zone 4 (AU/NZ)', revenue: 22000, transactions: 580 },
                          { zone: 'Zone 5 (Asia)', revenue: 18000, transactions: 1500 },
                          { zone: 'Zone 6 (LATAM)', revenue: 12000, transactions: 800 },
                          { zone: 'Zone 7 (Emerging)', revenue: 8000, transactions: 650 },
                          { zone: 'Zone 8 (Africa)', revenue: 5000, transactions: 420 }
                        ]}
                        layout="vertical"
                        margin={{ left: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                        <XAxis type="number" stroke="rgba(255,255,255,0.4)" fontSize={12} axisLine={false} tickLine={false} />
                        <YAxis dataKey="zone" type="category" stroke="rgba(255,255,255,0.4)" width={120} fontSize={12} axisLine={false} tickLine={false} />
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
                        <Bar dataKey="revenue" fill="#2563EB" radius={[0, 8, 8, 0]} barSize={20} name="Revenue ($)" />
                        <Bar dataKey="transactions" fill="#7C3AED" radius={[0, 8, 8, 0]} barSize={20} name="Transactions" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default EnhancedAdminRevenueAnalyticsHub;