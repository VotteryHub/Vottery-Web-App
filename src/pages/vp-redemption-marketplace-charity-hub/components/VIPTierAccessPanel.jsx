import React, { useState } from 'react';
import { Crown, Zap, Shield, Users, Star, CheckCircle, Lock, TrendingUp } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';
import Icon from '../../../components/AppIcon';


const VIPTierAccessPanel = ({ vpBalance, onRedemption }) => {
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const vipTiers = [
    {
      id: 'beta-access-1month',
      title: 'Beta Features Access',
      duration: '1 Month',
      vpCost: 1500,
      icon: Zap,
      color: 'blue',
      benefits: [
        'Early access to new features',
        'Test upcoming election types',
        'Exclusive beta community',
        'Direct feedback channel',
        'Beta tester badge'
      ],
      popular: true
    },
    {
      id: 'priority-support-3months',
      title: 'Priority Support',
      duration: '3 Months',
      vpCost: 2500,
      icon: Shield,
      color: 'green',
      benefits: [
        '24/7 priority support',
        'Dedicated support agent',
        'Faster response times',
        'Video call support',
        'Priority bug fixes'
      ],
      popular: false
    },
    {
      id: 'exclusive-community',
      title: 'Exclusive Community',
      duration: 'Lifetime',
      vpCost: 5000,
      icon: Users,
      color: 'purple',
      benefits: [
        'VIP-only community access',
        'Monthly exclusive events',
        'Network with top creators',
        'Insider product updates',
        'Influence roadmap decisions'
      ],
      popular: false
    },
    {
      id: 'ultimate-vip',
      title: 'Ultimate VIP Package',
      duration: '1 Year',
      vpCost: 10000,
      icon: Crown,
      color: 'yellow',
      benefits: [
        'All beta features',
        'Priority support 24/7',
        'Exclusive community access',
        'Custom profile themes',
        'VIP badge & flair',
        'Monthly VP bonus (500 VP)',
        'Free premium features',
        'Personal account manager'
      ],
      popular: false,
      bestValue: true
    }
  ];

  const handleUnlock = async (tier) => {
    if (vpBalance < tier?.vpCost) {
      alert('Insufficient VP balance');
      return;
    }

    try {
      setProcessing(true);
      await platformGamificationService?.redeemVP({
        type: 'vip_tier_access',
        tierId: tier?.id,
        vpAmount: tier?.vpCost
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onRedemption?.();
    } catch (error) {
      console.error('Redemption error:', error);
      alert('Redemption failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">VIP Access Activated!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Welcome to the VIP club. Your exclusive benefits are now active.</p>
          </div>
        </div>
      )}
      {/* VIP Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vipTiers?.map((tier) => {
          const Icon = tier?.icon;
          const canAfford = vpBalance >= tier?.vpCost;
          
          return (
            <div
              key={tier?.id}
              className={`bg-white dark:bg-gray-800 rounded-lg border-2 overflow-hidden hover:shadow-xl transition-all ${
                tier?.bestValue
                  ? 'border-yellow-400 dark:border-yellow-600 shadow-lg'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {tier?.bestValue && (
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-center py-2">
                  <span className="text-sm font-bold text-yellow-900">🏆 BEST VALUE</span>
                </div>
              )}
              {tier?.popular && (
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-center py-2">
                  <span className="text-sm font-bold text-white">⭐ MOST POPULAR</span>
                </div>
              )}
              <div className={`bg-gradient-to-r from-${tier?.color}-500 to-${tier?.color}-600 p-6`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{tier?.title}</h3>
                    <p className="text-white/90 text-sm">{tier?.duration}</p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-bold text-white">{tier?.vpCost?.toLocaleString()}</span>
                  <span className="text-white/90">VP</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Exclusive Benefits:</p>
                  {tier?.benefits?.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleUnlock(tier)}
                  disabled={processing || !canAfford}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    canAfford
                      ? tier?.bestValue
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white' :'bg-blue-600 hover:bg-blue-700 text-white' :'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : canAfford ? (
                    <>
                      <Crown className="w-5 h-5" />
                      Unlock VIP Access
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Need {(tier?.vpCost - vpBalance)?.toLocaleString()} more VP
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {/* VIP Benefits Overview */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Why Go VIP?</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Early Access</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Be the first to try new features</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Priority Support</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Get help when you need it</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Exclusive Community</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Connect with top users</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VIPTierAccessPanel;