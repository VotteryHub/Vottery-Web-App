import React, { useState } from 'react';
import { Package, Target, Zap, Trophy, Star, CheckCircle, Gift } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';
import Icon from '../../../components/AppIcon';


const QuestPackBundlesPanel = ({ vpBalance, onRedemption }) => {
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const questPacks = [
    {
      id: 'beginner-bundle',
      title: 'Beginner Quest Bundle',
      description: 'Perfect for new users getting started with Vottery',
      vpCost: 300,
      icon: Target,
      color: 'green',
      quests: 5,
      totalVPReward: 500,
      difficulty: 'Easy',
      challenges: [
        'Vote in 5 different elections',
        'Create your first election',
        'Complete your profile',
        'Join 3 community groups',
        'Share an election on social media'
      ]
    },
    {
      id: 'engagement-master',
      title: 'Engagement Master Pack',
      description: 'Boost your community engagement and earn rewards',
      vpCost: 300,
      icon: Zap,
      color: 'blue',
      quests: 7,
      totalVPReward: 800,
      difficulty: 'Medium',
      challenges: [
        'Comment on 10 elections',
        'React to 20 posts',
        'Vote in 10 sponsored elections',
        'Complete 5 daily challenges',
        'Achieve a 7-day voting streak',
        'Invite 3 friends to Vottery',
        'Participate in a live event'
      ]
    },
    {
      id: 'creator-pro',
      title: 'Creator Pro Bundle',
      description: 'Advanced challenges for election creators',
      vpCost: 300,
      icon: Trophy,
      color: 'purple',
      quests: 6,
      totalVPReward: 1000,
      difficulty: 'Hard',
      challenges: [
        'Create 5 successful elections',
        'Get 100+ votes on an election',
        'Use all voting types',
        'Add media to 3 elections',
        'Create a sponsored election',
        'Earn 1000 VP from elections'
      ]
    },
    {
      id: 'prediction-expert',
      title: 'Prediction Expert Pack',
      description: 'Master the art of election predictions',
      vpCost: 300,
      icon: Star,
      color: 'yellow',
      quests: 8,
      totalVPReward: 1200,
      difficulty: 'Medium',
      challenges: [
        'Make 20 predictions',
        'Achieve 80% accuracy rate',
        'Win a prediction pool',
        'Rank in top 10 on leaderboard',
        'Predict correctly 5 times in a row',
        'Join 5 private prediction pools',
        'Share prediction insights',
        'Earn prediction master badge'
      ]
    }
  ];

  const handlePurchase = async (pack) => {
    if (vpBalance < pack?.vpCost) {
      alert('Insufficient VP balance');
      return;
    }

    try {
      setProcessing(true);
      await platformGamificationService?.redeemVP({
        type: 'quest_pack_bundle',
        packId: pack?.id,
        vpAmount: pack?.vpCost
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onRedemption?.();
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">Quest Pack Unlocked!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Your personalized quests are now available in the Quest Dashboard.</p>
          </div>
        </div>
      )}
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-4">
          <Gift className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Personalized Quest Pack Bundles</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Curated challenge collections designed to match your interests and skill level. Complete all quests in a pack to earn bonus VP rewards!
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Earn more VP than you spend</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Unlock exclusive badges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Track progress in real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quest Pack Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questPacks?.map((pack) => {
          const Icon = pack?.icon;
          const canAfford = vpBalance >= pack?.vpCost;
          const netGain = pack?.totalVPReward - pack?.vpCost;
          
          return (
            <div
              key={pack?.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r from-${pack?.color}-500 to-${pack?.color}-600 p-6`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{pack?.title}</h3>
                      <p className="text-white/90 text-sm">{pack?.quests} Quests</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(pack?.difficulty)}`}>
                    {pack?.difficulty}
                  </span>
                </div>
                <p className="text-white/90 text-sm">{pack?.description}</p>
              </div>
              <div className="p-6">
                {/* VP Economics */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Cost</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{pack?.vpCost}</p>
                    <p className="text-xs text-gray-500">VP</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Earn</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{pack?.totalVPReward}</p>
                    <p className="text-xs text-gray-500">VP</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-700 dark:text-green-400 mb-1">Net Gain</p>
                    <p className="text-lg font-bold text-green-700 dark:text-green-300">+{netGain}</p>
                    <p className="text-xs text-green-600 dark:text-green-500">VP</p>
                  </div>
                </div>

                {/* Quest List */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Included Challenges:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {pack?.challenges?.map((challenge, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">{challenge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handlePurchase(pack)}
                  disabled={processing || !canAfford}
                  className={`w-full font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    canAfford
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' :'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : canAfford ? (
                    <>
                      <Package className="w-5 h-5" />
                      Unlock Quest Pack
                    </>
                  ) : (
                    `Need ${(pack?.vpCost - vpBalance)?.toLocaleString()} more VP`
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestPackBundlesPanel;