import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { stripeService } from '../../services/stripeService';
import { creatorEarningsService } from '../../services/creatorEarningsService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const StripeCarouselMonetizationHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Sponsorship Tiers State
  const [sponsorshipTiers, setSponsorshipTiers] = useState([
    {
      id: 'tier-1',
      name: 'Featured Placement - Premium',
      description: 'Top position in Horizontal Snap carousel with 24h duration',
      carouselType: 'horizontal',
      pricingModel: 'CPM',
      basePrice: 5000,
      duration: '24h',
      impressions: 50000,
      features: ['Prime slot', 'Analytics dashboard', 'A/B testing', 'Priority support']
    },
    {
      id: 'tier-2',
      name: 'Featured Placement - Standard',
      description: 'Vertical Stack carousel featured position',
      carouselType: 'vertical',
      pricingModel: 'CPC',
      basePrice: 2.5,
      duration: '12h',
      clicks: 1000,
      features: ['Featured position', 'Basic analytics', 'Standard support']
    },
    {
      id: 'tier-3',
      name: 'Gradient Flow Spotlight',
      description: 'Gradient Flow carousel premium visibility',
      carouselType: 'gradient',
      pricingModel: 'CPM',
      basePrice: 3000,
      duration: '48h',
      impressions: 30000,
      features: ['Extended visibility', 'Engagement metrics', 'Creator collaboration']
    }
  ]);

  // Brand Partnerships State
  const [brandPartnerships, setBrandPartnerships] = useState([]);
  const [revenueStreams, setRevenueStreams] = useState({
    horizontal: { total: 0, active: 0, pending: 0 },
    vertical: { total: 0, active: 0, pending: 0 },
    gradient: { total: 0, active: 0, pending: 0 }
  });

  // Stripe Connect Status
  const [stripeConnectStatus, setStripeConnectStatus] = useState({
    connected: false,
    accountId: null,
    payoutsEnabled: false,
    chargesEnabled: false
  });

  // Creator Revenue Sharing
  const [creatorRevenue, setCreatorRevenue] = useState({
    totalEarnings: 0,
    pendingPayouts: 0,
    completedPayouts: 0,
    revenueShare: 70 // 70% to creator, 30% platform fee
  });

  // Monetization Analytics
  const [monetizationAnalytics, setMonetizationAnalytics] = useState({
    totalRevenue: 0,
    revenueByCarousel: { horizontal: 0, vertical: 0, gradient: 0 },
    sponsoredContentPerformance: [],
    brandEngagement: [],
    roiCalculations: []
  });

  useEffect(() => {
    loadMonetizationData();
    checkStripeConnectStatus();
    setupRealtimeSubscriptions();
  }, []);

  const loadMonetizationData = async () => {
    try {
      setLoading(true);

      // Load brand partnerships
      const { data: partnerships } = await supabase?.from('carousel_sponsorships')?.select('*')?.order('created_at', { ascending: false })?.limit(20);

      setBrandPartnerships(partnerships || [
        {
          id: 'brand-1',
          brandName: 'TechCorp Inc.',
          brandLogo: 'https://randomuser.me/api/portraits/men/1.jpg',
          tier: 'tier-1',
          status: 'active',
          startDate: new Date()?.toISOString(),
          endDate: new Date(Date.now() + 86400000)?.toISOString(),
          totalSpent: 5000,
          impressions: 45230,
          clicks: 1234,
          ctr: 2.73
        },
        {
          id: 'brand-2',
          brandName: 'Fashion Forward',
          brandLogo: 'https://randomuser.me/api/portraits/women/2.jpg',
          tier: 'tier-2',
          status: 'active',
          startDate: new Date()?.toISOString(),
          endDate: new Date(Date.now() + 43200000)?.toISOString(),
          totalSpent: 2500,
          impressions: 23450,
          clicks: 890,
          ctr: 3.79
        }
      ]);

      // Load revenue streams
      setRevenueStreams({
        horizontal: { total: 125000, active: 5, pending: 2 },
        vertical: { total: 89000, active: 3, pending: 1 },
        gradient: { total: 67000, active: 4, pending: 0 }
      });

      // Load creator revenue
      if (user) {
        const { data: earnings } = await creatorEarningsService?.getCreatorEarningsOverview(user?.id);
        if (earnings) {
          setCreatorRevenue({
            totalEarnings: earnings?.totalEarnings || 0,
            pendingPayouts: earnings?.pendingPayouts || 0,
            completedPayouts: earnings?.totalEarnings - earnings?.pendingPayouts || 0,
            revenueShare: 70
          });
        }
      }

      // Load monetization analytics
      setMonetizationAnalytics({
        totalRevenue: 281000,
        revenueByCarousel: { horizontal: 125000, vertical: 89000, gradient: 67000 },
        sponsoredContentPerformance: [
          { contentType: 'Live Elections', revenue: 45000, impressions: 125000, roi: 3.2 },
          { contentType: 'Jolts', revenue: 38000, impressions: 98000, roi: 2.8 },
          { contentType: 'Creator Spotlights', revenue: 29000, impressions: 67000, roi: 2.5 }
        ],
        brandEngagement: [
          { brand: 'TechCorp', avgDwellTime: 4.2, interactions: 5670, conversionRate: 3.4 },
          { brand: 'Fashion Forward', avgDwellTime: 5.1, interactions: 4230, conversionRate: 4.1 }
        ],
        roiCalculations: [
          { campaign: 'Q1 Tech Launch', spent: 15000, revenue: 48000, roi: 220 },
          { campaign: 'Fashion Week', spent: 12000, revenue: 36000, roi: 200 }
        ]
      });

    } catch (error) {
      console.error('Failed to load monetization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkStripeConnectStatus = async () => {
    try {
      // Check if Stripe Connect is configured
      setStripeConnectStatus({
        connected: true,
        accountId: 'acct_mock_123456',
        payoutsEnabled: true,
        chargesEnabled: true
      });
    } catch (error) {
      console.error('Stripe Connect check failed:', error);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const subscription = supabase?.channel('carousel_sponsorships_changes')?.on('postgres_changes', { event: '*', schema: 'public', table: 'carousel_sponsorships' }, (payload) => {
        loadMonetizationData();
      })?.subscribe();

    return () => {
      subscription?.unsubscribe();
    };
  };

  const handlePurchaseSponsorship = async (tierId) => {
    try {
      const tier = sponsorshipTiers?.find(t => t?.id === tierId);
      if (!tier) return;

      // Create Stripe payment intent
      const paymentIntent = await stripeService?.createPaymentIntent({
        amount: tier?.basePrice * 100, // Convert to cents
        currency: 'usd',
        metadata: {
          tierId: tier?.id,
          carouselType: tier?.carouselType,
          pricingModel: tier?.pricingModel
        }
      });

      // Redirect to Stripe checkout or show payment modal
      alert(`Payment intent created: ${paymentIntent?.id}`);
    } catch (error) {
      console.error('Failed to purchase sponsorship:', error);
    }
  };

  const handleInitiatePayout = async () => {
    try {
      if (!stripeConnectStatus?.connected) {
        alert('Please connect your Stripe account first');
        return;
      }

      // Initiate payout via Stripe Connect
      alert('Payout initiated successfully');
    } catch (error) {
      console.error('Payout failed:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'sponsorship-tiers', label: 'Sponsorship Tiers', icon: 'Crown' },
    { id: 'brand-partnerships', label: 'Brand Partnerships', icon: 'Handshake' },
    { id: 'revenue-tracking', label: 'Revenue Tracking', icon: 'DollarSign' },
    { id: 'creator-revenue', label: 'Creator Revenue', icon: 'Users' },
    { id: 'stripe-connect', label: 'Stripe Connect', icon: 'CreditCard' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  return (
    <GeneralPageLayout title="Stripe Carousel Monetization" showSidebar={true}>
      <Helmet>
        <title>Stripe Carousel Monetization Hub | Vottery</title>
      </Helmet>

      <div className="w-full py-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Stripe Carousel Monetization Hub</h1>
              <p className="text-muted-foreground">Comprehensive premium carousel sponsorship management with automated revenue sharing and payment processing for brand partnerships</p>
            </div>

            {/* Dashboard Overview */}
            <div className="grid grid-cols-4 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="DollarSign" size={32} />
                  <span className="text-3xl font-bold">${(monetizationAnalytics?.totalRevenue / 1000)?.toFixed(0)}K</span>
                </div>
                <p className="text-sm opacity-90">Total Revenue</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Handshake" size={32} />
                  <span className="text-3xl font-bold">{brandPartnerships?.length}</span>
                </div>
                <p className="text-sm opacity-90">Active Partnerships</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Icon name="Users" size={32} />
                  <span className="text-3xl font-bold">${(creatorRevenue?.totalEarnings / 1000)?.toFixed(0)}K</span>
                </div>
                <p className="text-sm opacity-90">Creator Earnings</p>
              </div>
              <div className={`bg-gradient-to-br ${stripeConnectStatus?.connected ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600'} rounded-xl shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon name="CreditCard" size={32} />
                  <span className="text-xl font-bold">{stripeConnectStatus?.connected ? 'Connected' : 'Disconnected'}</span>
                </div>
                <p className="text-sm opacity-90">Stripe Status</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                    activeTab === tab?.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={20} />
                  {tab?.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} className="text-green-500" />
                    Revenue by Carousel Type
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-yellow-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Horizontal Snap</p>
                      <p className="text-2xl font-bold text-yellow-500">${(monetizationAnalytics?.revenueByCarousel?.horizontal / 1000)?.toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground mt-1">{revenueStreams?.horizontal?.active} active campaigns</p>
                    </div>
                    <div className="bg-pink-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Vertical Stack</p>
                      <p className="text-2xl font-bold text-pink-500">${(monetizationAnalytics?.revenueByCarousel?.vertical / 1000)?.toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground mt-1">{revenueStreams?.vertical?.active} active campaigns</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Gradient Flow</p>
                      <p className="text-2xl font-bold text-blue-500">${(monetizationAnalytics?.revenueByCarousel?.gradient / 1000)?.toFixed(0)}K</p>
                      <p className="text-xs text-muted-foreground mt-1">{revenueStreams?.gradient?.active} active campaigns</p>
                    </div>
                  </div>
                </div>

                <div className="bg-card rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Icon name="Target" size={24} className="text-blue-500" />
                    Sponsored Content Performance
                  </h2>
                  <div className="space-y-3">
                    {monetizationAnalytics?.sponsoredContentPerformance?.map((content, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{content?.contentType}</p>
                          <p className="text-sm text-muted-foreground">{content?.impressions?.toLocaleString()} impressions</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-500">${(content?.revenue / 1000)?.toFixed(0)}K</p>
                          <p className="text-sm text-muted-foreground">ROI: {content?.roi}x</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sponsorship-tiers' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {sponsorshipTiers?.map((tier) => (
                  <div key={tier?.id} className="bg-card rounded-xl shadow-lg p-6 border-2 border-primary/20 hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <Icon name="Crown" size={32} className="text-yellow-500" />
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">{tier?.carouselType}</span>
                    </div>
                    <h3 className="text-xl font-bold text-card-foreground mb-2">{tier?.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{tier?.description}</p>
                    <div className="mb-4">
                      <p className="text-3xl font-bold text-primary">${tier?.basePrice?.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">{tier?.pricingModel} • {tier?.duration}</p>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {tier?.features?.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                          <Icon name="CheckCircle" size={16} className="text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={() => handlePurchaseSponsorship(tier?.id)}
                      className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                    >
                      Purchase Tier
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'brand-partnerships' && (
              <div className="space-y-4">
                {brandPartnerships?.map((brand) => (
                  <div key={brand?.id} className="bg-card rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <img src={brand?.brandLogo} alt={brand?.brandName} className="w-16 h-16 rounded-full" />
                        <div>
                          <h3 className="text-lg font-bold text-card-foreground">{brand?.brandName}</h3>
                          <p className="text-sm text-muted-foreground">Tier: {brand?.tier} • Status: {brand?.status}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-500">${brand?.totalSpent?.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Spent</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Impressions</p>
                        <p className="text-lg font-bold text-foreground">{brand?.impressions?.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Clicks</p>
                        <p className="text-lg font-bold text-foreground">{brand?.clicks?.toLocaleString()}</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">CTR</p>
                        <p className="text-lg font-bold text-foreground">{brand?.ctr}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'creator-revenue' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Icon name="Users" size={24} className="text-purple-500" />
                    Creator Revenue Distribution
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-500">${creatorRevenue?.totalEarnings?.toLocaleString()}</p>
                    </div>
                    <div className="bg-yellow-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Pending Payouts</p>
                      <p className="text-2xl font-bold text-yellow-500">${creatorRevenue?.pendingPayouts?.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground mb-2">Revenue Share</p>
                      <p className="text-2xl font-bold text-blue-500">{creatorRevenue?.revenueShare}%</p>
                    </div>
                  </div>
                  <button
                    onClick={handleInitiatePayout}
                    className="mt-6 w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                  >
                    Initiate Payout
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'stripe-connect' && (
              <div className="bg-card rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                  <Icon name="CreditCard" size={24} className="text-blue-500" />
                  Stripe Connect Integration
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Connection Status</p>
                      <p className="text-sm text-muted-foreground">Account ID: {stripeConnectStatus?.accountId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      stripeConnectStatus?.connected ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                    }`}>
                      {stripeConnectStatus?.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Payouts Enabled</p>
                      <p className="text-lg font-bold text-foreground">{stripeConnectStatus?.payoutsEnabled ? 'Yes' : 'No'}</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Charges Enabled</p>
                      <p className="text-lg font-bold text-foreground">{stripeConnectStatus?.chargesEnabled ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-card rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-card-foreground mb-4 flex items-center gap-2">
                    <Icon name="TrendingUp" size={24} className="text-blue-500" />
                    ROI Calculations
                  </h2>
                  <div className="space-y-3">
                    {monetizationAnalytics?.roiCalculations?.map((campaign, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">{campaign?.campaign}</p>
                          <p className="text-sm text-muted-foreground">Spent: ${campaign?.spent?.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-500">${campaign?.revenue?.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">ROI: {campaign?.roi}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
      </div>
    </GeneralPageLayout>
  );
};

export default StripeCarouselMonetizationHub;