import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Coins, Heart, Sparkles, Crown, Package, TrendingUp, Gift, Award } from 'lucide-react';
import CharityDonationsPanel from './components/CharityDonationsPanel';
import ExperienceRewardsPanel from './components/ExperienceRewardsPanel';
import VIPTierAccessPanel from './components/VIPTierAccessPanel';
import QuestPackBundlesPanel from './components/QuestPackBundlesPanel';
import RedemptionHistoryPanel from './components/RedemptionHistoryPanel';
import CryptoConversionsPanel from './components/CryptoConversionsPanel';
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
    { id: 'crypto', label: 'Crypto Conversions', icon: TrendingUp, color: 'text-orange-500' },
    { id: 'quests', label: 'Quest Pack Bundles', icon: Package, color: 'text-blue-500' },
    { id: 'history', label: 'Redemption History', icon: TrendingUp, color: 'text-green-500' }
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
      case 'crypto':
        return <CryptoConversionsPanel vpBalance={vpBalance} onRedemption={loadVPData} />;
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>VP Redemption Marketplace & Charity Hub - Vottery</title>
        <meta name="description" content="Redeem your Vottery Points for charity donations, experience rewards, VIP access, crypto conversions, and personalized quest packs" />
      </Helmet>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Gift className="w-8 h-8 text-blue-600" />
                VP Redemption Marketplace
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Transform your Vottery Points into real-world impact and exclusive rewards
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <Coins className="w-6 h-6 text-yellow-500" />
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {vpBalance?.toLocaleString() || 0}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Available VP Balance</p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-medium text-pink-900 dark:text-pink-300">Charity Impact</span>
              </div>
              <p className="text-2xl font-bold text-pink-900 dark:text-pink-200 mt-2">
                ${redemptionStats?.charityDonations || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Experiences</span>
              </div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-200 mt-2">
                {redemptionStats?.experiencesUnlocked || 0}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900 dark:text-yellow-300">VIP Status</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-200 mt-2">
                {redemptionStats?.vipAccess ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-300">Total Redeemed</span>
              </div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-200 mt-2">
                {redemptionStats?.totalRedeemed?.toLocaleString() || 0} VP
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Category Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto py-4">
            {categories?.map((category) => {
              const Icon = category?.icon;
              return (
                <button
                  key={category?.id}
                  onClick={() => setActiveCategory(category?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeCategory === category?.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeCategory === category?.id ? 'text-white' : category?.color}`} />
                  {category?.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Active Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActivePanel()}
      </div>
    </div>
  );
};

export default VPRedemptionMarketplaceCharityHub;