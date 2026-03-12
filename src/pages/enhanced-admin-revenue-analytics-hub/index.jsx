import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import AdminToolbar from '../../components/ui/AdminToolbar';
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
  const [editingPlan, setEditingPlan] = useState(null);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <AdminToolbar />
      
      <main className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
            💰 Enhanced Revenue Analytics Hub
          </h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Comprehensive financial oversight and revenue stream management
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

        {/* Revenue Overview Tab */}
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
                    <p className="text-sm text-muted-foreground">Total Revenue (30d)</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${revenueAnalytics?.totalRevenue?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-success">+18%</span>
                  <span className="text-xs text-muted-foreground">vs last period</span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Participation Fees</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${revenueAnalytics?.participationRevenue?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-success">+23%</span>
                  <span className="text-xs text-muted-foreground">{revenueAnalytics?.participationCount || 0} transactions</span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon name="CreditCard" size={20} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Subscriptions</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">
                      ${revenueAnalytics?.subscriptionRevenue?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-success">+15%</span>
                  <span className="text-xs text-muted-foreground">{revenueAnalytics?.subscriptionCount || 0} active</span>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Icon name="Target" size={20} className="text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground">Profit Margin</p>
                    <p className="text-2xl font-heading font-bold text-foreground font-data">32.5%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-xs font-medium text-success">+2.3%</span>
                  <span className="text-xs text-muted-foreground">vs target</span>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Breakdown Pie Chart */}
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Revenue Stream Breakdown</h3>
                <div className="w-full h-80" aria-label="Revenue Breakdown Pie Chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueBreakdownData?.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry?.color} />
                        ))}
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

              {/* Monthly Trend Line Chart */}
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Monthly Revenue Trends</h3>
                <div className="w-full h-80" aria-label="Monthly Revenue Trend Chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                      <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
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
                      <Line type="monotone" dataKey="participation" stroke="#2563EB" strokeWidth={2} name="Participation Fees" />
                      <Line type="monotone" dataKey="subscriptions" stroke="#7C3AED" strokeWidth={2} name="Subscriptions" />
                      <Line type="monotone" dataKey="advertising" stroke="#F59E0B" strokeWidth={2} name="Advertising" />
                      <Line type="monotone" dataKey="premium" stroke="#059669" strokeWidth={2} name="Premium" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Management Tab */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold text-foreground">Subscription Plans</h2>
              <Button iconName="Plus" iconPosition="left">
                Add New Plan
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {subscriptionPlans?.map((plan) => (
                <div key={plan?.id} className="card border-2 hover:border-primary/50 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-semibold text-foreground">{plan?.planName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan?.isActive ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                    }`}>
                      {plan?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="mb-4">
                    <p className="text-3xl font-heading font-bold text-foreground font-data">
                      ${plan?.price}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">{plan?.duration?.replace('_', ' ')}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Plan Type:</p>
                    <span className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium capitalize">
                      {plan?.planType}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Edit" size={16} />
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Processing Fees Tab */}
        {activeTab === 'processing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Processing Fee Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {revenueConfig?.map((config) => (
                <div key={config?.id} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-foreground capitalize">
                        {config?.revenueType?.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {config?.configuration?.description || 'Revenue stream configuration'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${
                        config?.isEnabled ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                      <span className="text-sm text-muted-foreground">
                        {config?.isEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Processing Fee:</span>
                      {editingConfig === config?.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            defaultValue={config?.processingFeePercentage}
                            className="w-20 px-2 py-1 rounded border border-border bg-background text-foreground text-sm"
                            id={`fee-${config?.id}`}
                          />
                          <span className="text-sm">%</span>
                        </div>
                      ) : (
                        <span className="text-2xl font-heading font-bold text-foreground font-data">
                          {config?.processingFeePercentage}%
                        </span>
                      )}
                    </div>
                  </div>

                  {config?.configuration?.includes && (
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Includes:</p>
                      <ul className="space-y-1">
                        {config?.configuration?.includes?.map((item, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                            <Icon name="Check" size={14} className="text-success" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {editingConfig === config?.id ? (
                      <>
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            const input = document.getElementById(`fee-${config?.id}`);
                            handleUpdateConfig(config?.revenueType, input?.value);
                          }}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingConfig(null)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setEditingConfig(config?.id)}
                      >
                        <Icon name="Edit" size={16} />
                        Edit Fee
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
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Advanced Revenue Analytics</h2>
            
            <div className="card">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Revenue by Purchasing Power Zone</h3>
              <div className="w-full h-96" aria-label="Zone Revenue Chart">
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
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" />
                    <YAxis dataKey="zone" type="category" stroke="var(--color-muted-foreground)" width={120} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '12px',
                      }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `$${value?.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Transactions'
                      ]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#2563EB" radius={[0, 8, 8, 0]} name="Revenue ($)" />
                    <Bar dataKey="transactions" fill="#7C3AED" radius={[0, 8, 8, 0]} name="Transactions" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EnhancedAdminRevenueAnalyticsHub;