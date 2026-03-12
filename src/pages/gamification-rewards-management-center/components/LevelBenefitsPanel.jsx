import React from 'react';
import { Crown, Zap, Target, TrendingUp, Award } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const LevelBenefitsPanel = ({ level }) => {
  const benefits = [
    {
      minLevel: 1,
      title: 'Beginner Benefits',
      icon: Target,
      color: 'gray',
      perks: [
        { name: 'Base CPE Rate', value: '$0.50 per vote', unlocked: true },
        { name: 'Standard Election Access', value: 'All public elections', unlocked: true },
        { name: 'Basic Rewards', value: '1x XP multiplier', unlocked: true }
      ]
    },
    {
      minLevel: 5,
      title: 'Bronze Tier',
      icon: Award,
      color: 'orange',
      perks: [
        { name: 'Increased CPE Rate', value: '$0.75 per vote', unlocked: level >= 5 },
        { name: 'Priority Notifications', value: 'Early campaign alerts', unlocked: level >= 5 },
        { name: 'Bonus Multiplier', value: '1.2x XP on sponsored votes', unlocked: level >= 5 }
      ]
    },
    {
      minLevel: 10,
      title: 'Silver Tier',
      icon: Zap,
      color: 'blue',
      perks: [
        { name: 'Premium CPE Rate', value: '$1.00 per vote', unlocked: level >= 10 },
        { name: 'Priority Campaign Access', value: 'Early access to high-value elections', unlocked: level >= 10 },
        { name: 'Enhanced Multiplier', value: '1.5x XP on sponsored votes', unlocked: level >= 10 },
        { name: 'Exclusive Campaigns', value: 'Access to premium brand partnerships', unlocked: level >= 10 }
      ]
    },
    {
      minLevel: 20,
      title: 'Gold Tier',
      icon: Crown,
      color: 'yellow',
      perks: [
        { name: 'Elite CPE Rate', value: '$1.50 per vote', unlocked: level >= 20 },
        { name: 'VIP Campaign Access', value: 'Exclusive advertiser partnerships', unlocked: level >= 20 },
        { name: 'Premium Multiplier', value: '2x XP on sponsored votes', unlocked: level >= 20 },
        { name: 'Direct Brand Relationships', value: 'Personal advertiser connections', unlocked: level >= 20 },
        { name: 'Priority Support', value: '24/7 dedicated assistance', unlocked: level >= 20 }
      ]
    },
    {
      minLevel: 50,
      title: 'Platinum Tier',
      icon: TrendingUp,
      color: 'purple',
      perks: [
        { name: 'Maximum CPE Rate', value: '$2.50 per vote', unlocked: level >= 50 },
        { name: 'Legendary Campaign Access', value: 'First access to all campaigns', unlocked: level >= 50 },
        { name: 'Maximum Multiplier', value: '3x XP on sponsored votes', unlocked: level >= 50 },
        { name: 'Brand Ambassador Program', value: 'Represent top brands', unlocked: level >= 50 },
        { name: 'Revenue Sharing', value: 'Earn from referrals', unlocked: level >= 50 },
        { name: 'Custom Campaign Creation', value: 'Create your own sponsored elections', unlocked: level >= 50 }
      ]
    }
  ];

  const getColorClasses = (color, unlocked) => {
    const baseClasses = {
      gray: 'from-gray-400 to-gray-600',
      orange: 'from-orange-400 to-orange-600',
      blue: 'from-blue-400 to-blue-600',
      yellow: 'from-yellow-400 to-yellow-600',
      purple: 'from-purple-400 to-purple-600'
    };

    return unlocked ? baseClasses?.[color] : 'from-gray-300 to-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Current Level Highlight */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Current Level</h2>
            <p className="text-blue-100">
              You're at Level {level} with exclusive benefits unlocked
            </p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold">{level}</div>
            <div className="text-blue-100">Level</div>
          </div>
        </div>
      </div>
      {/* Benefits Tiers */}
      <div className="space-y-6">
        {benefits?.map((tier) => {
          const Icon = tier?.icon;
          const isUnlocked = level >= tier?.minLevel;

          return (
            <div
              key={tier?.minLevel}
              className={`bg-white rounded-lg shadow-sm p-6 border-2 transition-all ${
                isUnlocked
                  ? 'border-green-300 shadow-green-100'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${getColorClasses(tier?.color, isUnlocked)}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tier?.title}</h3>
                    <p className="text-sm text-gray-600">Level {tier?.minLevel}+</p>
                  </div>
                </div>
                {isUnlocked ? (
                  <div className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                    ✓ Unlocked
                  </div>
                ) : (
                  <div className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm">
                    🔒 Locked
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {tier?.perks?.map((perk, index) => (
                  <div
                    key={index}
                    className={`flex items-start justify-between p-3 rounded-lg ${
                      perk?.unlocked ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {perk?.unlocked ? (
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{perk?.name}</div>
                        <div className="text-sm text-gray-600">{perk?.value}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* Next Level Preview */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-2">Keep Leveling Up!</h3>
        <p className="text-purple-100 mb-4">
          Reach Level {Math.ceil(level / 5) * 5 + 5} to unlock even more exclusive benefits and higher CPE rates
        </p>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${((level % 5) / 5) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm font-medium">
            {level % 5}/5 levels
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelBenefitsPanel;