import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Coins, Heart, Sparkles, Crown, Package, Gift, Award, History } from 'lucide-react';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import CharityDonationsPanel from './components/CharityDonationsPanel';
import ExperienceRewardsPanel from './components/ExperienceRewardsPanel';
import VIPTierAccessPanel from './components/VIPTierAccessPanel';
import QuestPackBundlesPanel from './components/QuestPackBundlesPanel';
import RedemptionHistoryPanel from './components/RedemptionHistoryPanel';
import { platformGamificationService } from '../../services/platformGamificationService';
import Icon from '../../components/AppIcon';

const VPRedemptionMarketplaceCharityHub = () => {
  const [vpBalance, setVpBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('charity');
  const [redemptionStats, setRedemptionStats] = useState({
    totalRedeemed: 0,
    charityDonations: 0,
    experiencesUnlocked: 0,
    vipAccess: false
  });

  useEffect(() => {
    loadVPData();
  }, []);

  const loadVPData = async () => {
    try {
      setLoading(true);
      const balance = await platformGamificationService?.getVPBalance();
      const stats = await platformGamificationService?.getRedemptionStats();
      setVpBalance(balance || 0);
      setRedemptionStats(stats || redemptionStats);
    } catch (error) {
      console.error('Error loading VP data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'charity', label: 'Charity Donations', icon: Heart, color: 'text-pink-500' },
    { id: 'experiences', label: 'Experience Rewards', icon: Sparkles, color: 'text-purple-500' },
    { id: 'vip', label: 'VIP Tier Access', icon: Crown, color: 'text-yellow-500' },
    { id: 'quests', label: 'Quest Pack Bundles', icon: Package, color: 'text-blue-500' },
    { id: 'history', label: 'Redemption History', icon: History, color: 'text-green-500' }
  ];

  const renderActivePanel = () => {
    switch (activeCategory) {
      case 'charity':
        return <CharityDonationsPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
      case 'experiences':
        return <ExperienceRewardsPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
      case 'vip':
        return <VIPTierAccessPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
      case 'quests':
        return <QuestPackBundlesPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
      case 'history':
        return <RedemptionHistoryPanel />;
      default:
        return <CharityDonationsPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <GeneralPageLayout title="VP Marketplace" showSidebar={false}>
      <Helmet>
        <title>VP Redemption Marketplace & Charity Hub - Vottery</title>
        <meta name="description" content="Redeem your Vottery Points for charity donations, experience rewards, VIP access, and personalized quest packs" />
      </Helmet>
      
      <div className="w-full py-0 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              The Vault
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-xl">
              Transform your Vottery Points into real-world impact, exclusive experiences, and digital status.
            </p>
          </div>
          
          <div className="flex items-center gap-4 premium-glass border border-white/10 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-700">
            <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
              <Coins className="w-8 h-8 text-yellow-500" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Available Points</p>
              <p className="text-3xl font-black text-white tracking-tight">{vpBalance?.toLocaleString() || 0} VP</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-pink-500/5 group hover:bg-pink-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Charity Impact</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">${redemptionStats?.charityDonations || 0}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-purple-500/5 group hover:bg-purple-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experiences</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{redemptionStats?.experiencesUnlocked || 0}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-yellow-500/5 group hover:bg-yellow-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VIP Status</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{redemptionStats?.vipAccess ? 'ELITE' : 'CITIZEN'}</p>
          </div>
          <div className="premium-glass p-6 rounded-3xl border border-white/5 bg-blue-500/5 group hover:bg-blue-500/10 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Spent</span>
            </div>
            <p className="text-2xl font-black text-white tracking-tight">{redemptionStats?.totalRedeemed?.toLocaleString() || 0} VP</p>
          </div>
        </div>

        <div className="mb-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit">
            {categories?.map((category) => {
              const CategoryIcon = category?.icon;
              return (
                <button
                  key={category?.id}
                  onClick={() => setActiveCategory(category?.id)}
                  className={`flex items-center gap-3 px-6 py-4 font-black text-[10px] uppercase tracking-widest transition-all duration-300 rounded-xl whitespace-nowrap ${
                    activeCategory === category?.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CategoryIcon className={`w-4 h-4 ${activeCategory === category?.id ? 'text-white' : category?.color}`} />
                  {category?.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          {renderActivePanel()}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default VPRedemptionMarketplaceCharityHub;