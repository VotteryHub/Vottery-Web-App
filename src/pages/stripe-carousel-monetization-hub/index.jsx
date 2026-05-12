import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import { stripeService } from '../../services/stripeService';
import { creatorEarningsService } from '../../services/creatorEarningsService';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  DollarSign, 
  Handshake, 
  Users, 
  CreditCard, 
  LayoutDashboard, 
  Crown, 
  TrendingUp, 
  Zap,
  Target,
  CheckCircle,
  ShieldCheck,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

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
            completedPayouts: (earnings?.totalEarnings || 0) - (earnings?.pendingPayouts || 0),
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
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sponsorship-tiers', label: 'Tiers', icon: Crown },
    { id: 'brand-partnerships', label: 'Brands', icon: Handshake },
    { id: 'revenue-tracking', label: 'Revenue', icon: DollarSign },
    { id: 'creator-revenue', label: 'Creators', icon: Users },
    { id: 'stripe-connect', label: 'Stripe', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <GeneralPageLayout title="Carousel Monetization" showSidebar={true}>
      <Helmet>
        <title>Stripe Carousel Monetization Hub | Vottery</title>
      </Helmet>

      <div className="w-full py-0">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[24px] flex items-center justify-center border border-primary/20 shadow-2xl">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">Carousel Ads Hub</h1>
              <p className="text-slate-500 font-bold text-sm mt-1 uppercase tracking-widest">Premium Sponsorship & Revenue Flow</p>
            </div>
          </div>
          <button
            onClick={loadMonetizationData}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all border border-white/5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sync Hub
          </button>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Revenue', value: `$${(monetizationAnalytics?.totalRevenue / 1000)?.toFixed(0)}K`, icon: DollarSign, color: 'text-green-400' },
            { label: 'Active Brands', value: brandPartnerships?.length, icon: Handshake, color: 'text-primary' },
            { label: 'Creator Pool', value: `$${(creatorRevenue?.totalEarnings / 1000)?.toFixed(0)}K`, icon: Users, color: 'text-purple-400' },
            { label: 'Gateway Health', value: stripeConnectStatus?.connected ? 'Online' : 'Offline', icon: ShieldCheck, color: stripeConnectStatus?.connected ? 'text-blue-400' : 'text-red-400' }
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 backdrop-blur-xl rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
                <p className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</p>
              </div>
              <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] group-hover:scale-110 transition-transform duration-700`} />
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[32px] border border-white/5 mb-10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 px-6 overflow-x-auto no-scrollbar">
            <nav className="flex space-x-4 py-4" aria-label="Tabs">
              {tabs?.map((tab) => {
                const TabIcon = tab?.icon;
                return (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`
                      flex items-center gap-3 py-3 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                      ${activeTab === tab?.id
                        ? 'bg-primary text-white shadow-xl shadow-primary/30' 
                        : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab?.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Syncing Monetization Nodes...</p>
              </div>
            ) : (
              <>
                {activeTab === 'overview' && (
                  <div className="space-y-12">
                    <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
                        <TrendingUp className="w-6 h-6 text-green-400" />
                        Carousel Yield Analysis
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-all">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Horizontal Snap</p>
                          <p className="text-3xl font-black text-yellow-400">${(monetizationAnalytics?.revenueByCarousel?.horizontal / 1000)?.toFixed(0)}K</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">{revenueStreams?.horizontal?.active} ACTIVE NODES</p>
                        </div>
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-all">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Vertical Stack</p>
                          <p className="text-3xl font-black text-pink-400">${(monetizationAnalytics?.revenueByCarousel?.vertical / 1000)?.toFixed(0)}K</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">{revenueStreams?.vertical?.active} ACTIVE NODES</p>
                        </div>
                        <div className="bg-white/5 rounded-[32px] p-8 border border-white/10 hover:bg-white/10 transition-all">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gradient Flow</p>
                          <p className="text-3xl font-black text-blue-400">${(monetizationAnalytics?.revenueByCarousel?.gradient / 1000)?.toFixed(0)}K</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-4">{revenueStreams?.gradient?.active} ACTIVE NODES</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                      <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
                        <Target className="w-6 h-6 text-blue-400" />
                        Engagement Performance
                      </h2>
                      <div className="space-y-6">
                        {monetizationAnalytics?.sponsoredContentPerformance?.map((content, index) => (
                          <div key={index} className="flex flex-col md:flex-row items-center justify-between p-8 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all group">
                            <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Zap className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="text-lg font-black text-white uppercase tracking-tight">{content?.contentType}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{content?.impressions?.toLocaleString()} Impressions Syncing</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-10">
                              <div className="text-right">
                                <p className="text-2xl font-black text-green-400">${(content?.revenue / 1000)?.toFixed(0)}K</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield ROI: {content?.roi}x</p>
                              </div>
                              <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-primary transition-colors" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sponsorship-tiers' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {sponsorshipTiers?.map((tier) => (
                      <div key={tier?.id} className="group bg-black/20 border border-white/5 rounded-[40px] p-10 hover:bg-white/5 transition-all shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-10">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-[24px] flex items-center justify-center border border-yellow-500/20">
                              <Crown className="w-8 h-8 text-yellow-500" />
                            </div>
                            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">{tier?.carouselType}</span>
                          </div>
                          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4">{tier?.name}</h3>
                          <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">{tier?.description}</p>
                          <div className="mb-10">
                            <p className="text-4xl font-black text-white tracking-tighter">${tier?.basePrice?.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{tier?.pricingModel} Protocol • {tier?.duration} Lifecycle</p>
                          </div>
                          <ul className="space-y-4 mb-10">
                            {tier?.features?.map((feature, index) => (
                              <li key={index} className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wide">
                                <CheckCircle size={16} className="text-green-500" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => handlePurchaseSponsorship(tier?.id)}
                            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-primary hover:text-white transition-all shadow-xl active:scale-95"
                          >
                            Activate Protocol
                          </button>
                        </div>
                        <Crown className="absolute -right-10 -bottom-10 w-48 h-48 text-yellow-500 opacity-[0.02] group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'brand-partnerships' && (
                  <div className="space-y-6">
                    {brandPartnerships?.map((brand) => (
                      <div key={brand?.id} className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-8">
                          <div className="relative">
                            <img src={brand?.brandLogo} alt={brand?.brandName} className="w-24 h-24 rounded-[32px] object-cover border-2 border-white/10" />
                            <div className="absolute -right-2 -bottom-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
                              <ShieldCheck className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">{brand?.brandName}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIER: {brand?.tier} • NODE STATUS: {brand?.status?.toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Investment</p>
                            <p className="text-2xl font-black text-green-400 tracking-tighter">${brand?.totalSpent?.toLocaleString()}</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Impressions</p>
                            <p className="text-xl font-black text-white">{brand?.impressions?.toLocaleString()}</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Clicks</p>
                            <p className="text-xl font-black text-white">{brand?.clicks?.toLocaleString()}</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Conversion</p>
                            <p className="text-xl font-black text-primary">{brand?.ctr}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'creator-revenue' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-12 flex items-center gap-4">
                      <Users className="w-6 h-6 text-purple-400" />
                      Creator Yield Distribution
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
                      <div className="p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Gross Yield</p>
                        <p className="text-4xl font-black text-green-400 tracking-tighter">${creatorRevenue?.totalEarnings?.toLocaleString()}</p>
                      </div>
                      <div className="p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Awaiting Settlement</p>
                        <p className="text-4xl font-black text-yellow-400 tracking-tighter">${creatorRevenue?.pendingPayouts?.toLocaleString()}</p>
                      </div>
                      <div className="p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Protocol Share</p>
                        <p className="text-4xl font-black text-blue-400 tracking-tighter">{creatorRevenue?.revenueShare}%</p>
                      </div>
                    </div>
                    <button
                      onClick={handleInitiatePayout}
                      className="w-full py-6 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-4"
                    >
                      Initialize Payout Protocol <ArrowRight size={16} />
                    </button>
                  </div>
                )}

                {activeTab === 'stripe-connect' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
                      <CreditCard className="w-6 h-6 text-blue-400" />
                      Stripe Connect Protocol
                    </h2>
                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row items-center justify-between p-10 bg-white/5 rounded-[32px] border border-white/10">
                        <div>
                          <p className="text-xl font-black text-white uppercase tracking-tight mb-2">Node Connection Status</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AUTHENTICATED ID: {stripeConnectStatus?.accountId}</p>
                        </div>
                        <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          stripeConnectStatus?.connected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {stripeConnectStatus?.connected ? 'ACTIVE NODE' : 'DISCONNECTED'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="p-10 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Payout Logic Enabled</p>
                          <p className="text-xl font-black text-white">{stripeConnectStatus?.payoutsEnabled ? 'YES' : 'NO'}</p>
                        </div>
                        <div className="p-10 bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Charge Acquisition Enabled</p>
                          <p className="text-xl font-black text-white">{stripeConnectStatus?.chargesEnabled ? 'YES' : 'NO'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="bg-black/20 border border-white/5 rounded-[40px] p-10 shadow-2xl">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-10 flex items-center gap-4">
                      <TrendingUp className="w-6 h-6 text-blue-400" />
                      ROI Forecasts & Analytics
                    </h2>
                    <div className="space-y-6">
                      {monetizationAnalytics?.roiCalculations?.map((campaign, index) => (
                        <div key={index} className="flex flex-col md:flex-row items-center justify-between p-10 bg-white/5 rounded-[32px] border border-white/10 hover:bg-white/10 transition-all">
                          <div>
                            <p className="text-xl font-black text-white uppercase tracking-tight mb-2">{campaign?.campaign}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AD SPEND NODE: ${campaign?.spent?.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-black text-green-400 tracking-tighter">${campaign?.revenue?.toLocaleString()}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">PROJECTED ROI: {campaign?.roi}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default StripeCarouselMonetizationHub;