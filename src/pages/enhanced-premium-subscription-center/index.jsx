import React, { useState, useEffect } from 'react';
import { Users, BarChart2, Gift, RefreshCw, Crown, TrendingDown, Zap } from 'lucide-react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import FamilyPlanOverview from './components/FamilyPlanOverview';
import FamilySharingSetup from './components/FamilySharingSetup';
import UsageAnalyticsPanel from './components/UsageAnalyticsPanel';
import ChurnPredictionPanel from './components/ChurnPredictionPanel';
import RetentionOffersPanel from './components/RetentionOffersPanel';
import { subscriptionService } from '../../services/subscriptionService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const TABS = [
  { id: 'overview', label: 'Family Overview', icon: Crown },
  { id: 'sharing', label: 'Family Sharing', icon: Users },
  { id: 'analytics', label: 'Usage Analytics', icon: BarChart2 },
  { id: 'churn', label: 'Churn Prediction', icon: TrendingDown },
  { id: 'retention', label: 'AI Retention Offers', icon: Gift },
];

const EnhancedPremiumSubscriptionCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  useEffect(() => {
    analytics?.trackEvent('premium_subscription_center_viewed', { tab: activeTab });
  }, [activeTab]);

  const loadSubscriptionData = async () => {
    try {
      setLoading(true);
      const { data } = (await subscriptionService?.getUserSubscription?.()) || {};
      setSubscriptionData(data || {
        plan: 'Premium Family',
        status: 'active',
        memberCount: 4,
        maxMembers: 6,
        renewalDate: new Date(Date.now() + 30 * 86400000)?.toISOString(),
        monthlySpend: 29.99,
        churnRisk: 0.18,
        usageScore: 78,
      });
    } catch (e) {
      setSubscriptionData({
        plan: 'Premium Family',
        status: 'active',
        memberCount: 4,
        maxMembers: 6,
        renewalDate: new Date(Date.now() + 30 * 86400000)?.toISOString(),
        monthlySpend: 29.99,
        churnRisk: 0.18,
        usageScore: 78,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadSubscriptionData();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl flex items-center justify-center">
              <Crown size={24} className="text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Enhanced Premium Subscription Center</h1>
              <p className="text-muted-foreground">Family sharing management with AI-powered retention and usage analytics</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-card border border-border text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
          >
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Quick Stats */}
        {subscriptionData && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users size={16} className="text-blue-500" />
                <span className="text-xs text-muted-foreground">Family Members</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{subscriptionData?.memberCount}<span className="text-sm text-muted-foreground">/{subscriptionData?.maxMembers}</span></p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-green-500" />
                <span className="text-xs text-muted-foreground">Usage Score</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{subscriptionData?.usageScore}<span className="text-sm text-muted-foreground">/100</span></p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={16} className={subscriptionData?.churnRisk > 0.5 ? 'text-red-500' : subscriptionData?.churnRisk > 0.3 ? 'text-yellow-500' : 'text-green-500'} />
                <span className="text-xs text-muted-foreground">Churn Risk</span>
              </div>
              <p className={`text-2xl font-bold ${
                subscriptionData?.churnRisk > 0.5 ? 'text-red-500' :
                subscriptionData?.churnRisk > 0.3 ? 'text-yellow-500' : 'text-green-500'
              }`}>{(subscriptionData?.churnRisk * 100)?.toFixed(0)}%</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Crown size={16} className="text-purple-500" />
                <span className="text-xs text-muted-foreground">Monthly Spend</span>
              </div>
              <p className="text-2xl font-bold text-foreground">${subscriptionData?.monthlySpend}</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-border">
          {TABS?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <tab.icon size={16} />
              {tab?.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Loading subscription data...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && <FamilyPlanOverview subscriptionData={subscriptionData} onRefresh={handleRefresh} />}
            {activeTab === 'sharing' && <FamilySharingSetup subscriptionData={subscriptionData} onRefresh={handleRefresh} />}
            {activeTab === 'analytics' && <UsageAnalyticsPanel subscriptionData={subscriptionData} />}
            {activeTab === 'churn' && <ChurnPredictionPanel subscriptionData={subscriptionData} />}
            {activeTab === 'retention' && <RetentionOffersPanel subscriptionData={subscriptionData} />}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedPremiumSubscriptionCenter;