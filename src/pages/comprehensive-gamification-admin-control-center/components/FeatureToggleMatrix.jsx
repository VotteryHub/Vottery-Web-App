import React, { useState, useEffect } from 'react';
import { Power, Check, AlertCircle, Loader } from 'lucide-react';
import { featureFlagService } from '../../../services/featureFlagService';

const DEFAULT_FEATURES = [
    // Platform features (admin visibility)
    { id: 'platform-creator-payout', name: 'Creator Payout System', category: 'Platform', enabled: true, description: 'Automated payout scheduling, multi-zone currency, tax W-9/W-8BEN, Stripe/PayPal/crypto reconciliation' },
    { id: 'platform-revenue-split', name: 'Revenue Split Analytics', category: 'Platform', enabled: true, description: 'Country-based revenue sharing, creator satisfaction, split optimization AI, 8 zones' },
    { id: 'platform-stripe-subscriptions', name: 'Stripe Subscription Tiers', category: 'Platform', enabled: true, description: 'VP multipliers (Basic 2x, Pro 3x, Elite 5x), renewal, failed payment retry, webhooks' },
    { id: 'platform-feed-ranking-claude', name: 'Feed Ranking with Claude', category: 'Platform', enabled: true, description: 'Claude contextual reasoning for personalized election recommendations (Perplexity fallback)' },
    { id: 'platform-predictive-threat', name: 'Predictive Threat Dashboard', category: 'Platform', enabled: true, description: 'Perplexity 30-90 day forecasting, fraud patterns, zone vulnerability heatmaps' },
    { id: 'platform-prediction-analytics', name: 'Prediction Analytics Dashboard', category: 'Platform', enabled: true, description: 'Admin dashboard for prediction pool performance metrics' },
    { id: 'platform-vp-economy-health', name: 'VP Economy Health Monitor', category: 'Platform', enabled: true, description: 'Real-time VP inflation/deflation and deviation alerts' },
    { id: 'platform-prediction-notifications', name: 'Prediction Pool Notifications Hub', category: 'Platform', enabled: true, description: 'User preference customization for pool/resolution/leaderboard notifications' },
    { id: 'platform-performance-monitoring', name: 'Performance Monitoring Dashboard', category: 'Platform', enabled: true, description: 'Screen load times, memory, API latency, crash rates' },
    { id: 'platform-sentry-tracking', name: 'Sentry Error Tracking', category: 'Platform', enabled: true, description: 'Crash monitoring and Discord alerts for critical errors' },
    { id: 'vp-earning', name: 'VP Earning System', category: 'VP System', enabled: true, description: 'Allow users to earn Vottery Points through platform actions' },
    { id: 'vp-voting', name: 'VP from Voting', category: 'VP System', enabled: true, description: 'Award 10 VP per vote (20 VP for paid elections)' },
    { id: 'vp-ads', name: 'VP from Ad Interactions', category: 'VP System', enabled: true, description: 'Award 5 VP per ad vote interaction' },
    { id: 'vp-predictions', name: 'VP from Predictions', category: 'VP System', enabled: true, description: 'Award 20 VP for correct predictions' },
    { id: 'vp-daily-login', name: 'Daily Login VP', category: 'VP System', enabled: true, description: 'Award 5 VP for daily login' },
    { id: 'vp-blockchain', name: 'VP Blockchain Logging', category: 'VP System', enabled: true, description: 'Log all VP transactions on blockchain for auditability' },
    { id: 'level-system', name: 'Level Progression', category: 'Progression', enabled: true, description: 'VP-based level progression with thresholds' },
    { id: 'level-unlocks', name: 'Level Unlocks', category: 'Progression', enabled: true, description: 'Unlock features and perks at specific levels' },
    { id: 'level-multipliers', name: 'Level Multipliers', category: 'Progression', enabled: true, description: 'Higher levels get VP earning multipliers' },
    { id: 'progress-bars', name: 'Progress Bars', category: 'Progression', enabled: true, description: 'Display VP progress bars in dashboard and profiles' },
    { id: 'badge-system', name: 'Badge System', category: 'Badges', enabled: true, description: 'Award visual badges for achievements' },
    { id: 'badge-bonuses', name: 'Badge Bonuses', category: 'Badges', enabled: true, description: 'Badges grant +10% VP earning bonuses' },
    { id: 'badge-display', name: 'Profile Badge Display', category: 'Badges', enabled: true, description: 'Show badges on user profiles' },
    { id: 'achievement-notifications', name: 'Achievement Notifications', category: 'Badges', enabled: true, description: 'Notify users when badges are earned' },
    { id: 'daily-challenges', name: 'Daily Challenges', category: 'Challenges', enabled: true, description: 'Daily quests like "Vote in 3 elections for 50 VP"' },
    { id: 'weekly-challenges', name: 'Weekly Challenges', category: 'Challenges', enabled: true, description: 'Weekly quests with higher VP rewards' },
    { id: 'challenge-dashboard', name: 'Challenges Dashboard', category: 'Challenges', enabled: true, description: 'Dedicated dashboard for viewing active challenges' },
    { id: 'challenge-animations', name: 'Challenge Completion Animations', category: 'Challenges', enabled: true, description: 'Confetti and sound effects on quest completion' },
    { id: 'global-leaderboard', name: 'Global Leaderboard', category: 'Leaderboards', enabled: true, description: 'Platform-wide VP rankings' },
    { id: 'regional-leaderboard', name: 'Regional Leaderboards', category: 'Leaderboards', enabled: true, description: 'Country/region-specific rankings' },
    { id: 'friends-leaderboard', name: 'Friends Leaderboard', category: 'Leaderboards', enabled: true, description: 'Compare VP with friends' },
    { id: 'leaderboard-privacy', name: 'Leaderboard Privacy Controls', category: 'Leaderboards', enabled: true, description: 'Allow users to opt-in/anonymize' },
    { id: 'daily-streaks', name: 'Daily Streaks', category: 'Streaks', enabled: true, description: 'Track consecutive daily actions' },
    { id: 'streak-multipliers', name: 'Streak Multipliers', category: 'Streaks', enabled: true, description: '7-day streak = 2x VP multiplier' },
    { id: 'streak-savers', name: 'Streak Savers', category: 'Streaks', enabled: true, description: 'Allow users to save streaks via sponsored actions' },
    { id: 'streak-notifications', name: 'Streak Notifications', category: 'Streaks', enabled: true, description: 'Remind users to maintain streaks' },
    { id: 'social-competitions', name: 'Social Competitions', category: 'Social', enabled: true, description: 'Friends/teams compete for VP' },
    { id: 'achievement-sharing', name: 'Achievement Sharing', category: 'Social', enabled: true, description: 'Share achievements on feeds/groups' },
    { id: 'team-challenges', name: 'Team Challenges', category: 'Social', enabled: true, description: 'Collaborative team-based quests' },
    { id: 'social-stats', name: 'Profile Gamification Stats', category: 'Social', enabled: true, description: 'Show Level/VP on profiles' },
    { id: 'election-vp-rewards', name: 'Election VP Rewards', category: 'Elections', enabled: true, description: 'VP rewards for voting in elections' },
    { id: 'election-challenges', name: 'Election Challenges', category: 'Elections', enabled: true, description: 'Quests like "Vote in 3 Gamified elections"' },
    { id: 'election-leaderboards', name: 'Election Leaderboards', category: 'Elections', enabled: true, description: 'Rank by wins/accuracy in elections' },
    { id: 'animated-reveals', name: 'Animated Winner Reveals', category: 'Elections', enabled: true, description: 'Spinning wheel animations for draws' },
    { id: 'ad-vp-bribes', name: 'Ad VP Bribes', category: 'Ads', enabled: true, description: 'Double VP for sponsored ad votes' },
    { id: 'ad-mini-games', name: 'Ad Mini-Games', category: 'Ads', enabled: true, description: 'Spin wheel, memory match in ads' },
    { id: 'ad-quests', name: 'Ad Campaign Quests', category: 'Ads', enabled: true, description: 'Chain 3 related ads for badge' },
    { id: 'ad-leaderboards', name: 'Ad Prediction Leaderboards', category: 'Ads', enabled: true, description: 'Top predictors in hype ads win prizes' },
    { id: 'vp-redemption', name: 'VP Redemption System', category: 'Redemption', enabled: true, description: 'Allow users to redeem VP for perks' },
    { id: 'ad-free-redemption', name: 'Ad-Free Hours', category: 'Redemption', enabled: true, description: 'Redeem VP for ad-free experience' },
    { id: 'avatar-redemption', name: 'Custom Avatars', category: 'Redemption', enabled: true, description: 'Unlock custom avatars with VP' },
    { id: 'boost-redemption', name: 'Priority Boosts', category: 'Redemption', enabled: true, description: 'Boost profile visibility with VP' },
    { id: 'lottery-powerups', name: 'Lottery Power-Ups', category: 'Redemption', enabled: true, description: 'Luck Boost multipliers for lotteries' },
    { id: 'feed-vp-rewards', name: 'Feed Interaction VP', category: 'Feed', enabled: true, description: '5 VP per like, 10 VP per comment' },
    { id: 'feed-quests', name: 'Feed Quests', category: 'Feed', enabled: true, description: 'Daily feed quests like "Scroll 10 posts for 20 VP"' },
    { id: 'feed-mini-games', name: 'Feed Mini-Games', category: 'Feed', enabled: true, description: 'Quick polls/quizzes in-feed' },
    { id: 'feed-streaks', name: 'Feed Streaks', category: 'Feed', enabled: true, description: 'Daily scrolling streak multipliers' },
    { id: 'prediction-pools', name: 'Prediction Pools', category: 'Predictions', enabled: true, description: 'Allow users to predict election outcomes' },
    { id: 'brier-scoring', name: 'Brier Score Accuracy', category: 'Predictions', enabled: true, description: 'Score predictions using Brier formula' },
    { id: 'prediction-leaderboards', name: 'Prediction Leaderboards', category: 'Predictions', enabled: true, description: 'Rank top predictors globally/friends' },
    { id: 'prediction-rewards', name: 'Prediction VP Rewards', category: 'Predictions', enabled: true, description: 'VP based on accuracy (100x score)' },
    { id: 'prediction-lottery-bonus', name: 'Prediction Lottery Bonuses', category: 'Predictions', enabled: true, description: 'Top predictors get 5x lottery tickets' }
];

const FeatureToggleMatrix = () => {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [message, setMessage] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = ['all', ...new Set(features.map(f => f.category))];

  // Load persisted toggle states from Supabase on mount
  useEffect(() => {
    const loadPersistedFlags = async () => {
      try {
        const allFlags = await featureFlagService?.getAllFeatureFlags();
        if (allFlags && allFlags?.length > 0) {
          setFeatures(prev => prev?.map(f => {
            const persisted = allFlags?.find(flag => flag?.flag_key === `gamification_${f?.id}`);
            if (persisted) {
              return { ...f, enabled: persisted?.is_active ?? f?.enabled };
            }
            return f;
          }));
        }
      } catch (err) {
        console.warn('Could not load persisted flags:', err?.message);
      } finally {
        setLoading(false);
      }
    };
    loadPersistedFlags();
  }, []);

  const handleToggle = async (featureId) => {
    const feature = features?.find(f => f?.id === featureId);
    if (!feature) return;
    const newEnabled = !feature?.enabled;

    // Optimistic update
    setFeatures(prev => prev?.map(f => f?.id === featureId ? { ...f, enabled: newEnabled } : f));
    setSaving(true);

    try {
      // Persist to Supabase feature_flags table
      const flagKey = `gamification_${featureId}`;
      const { data: existing } = await featureFlagService?.getFeatureFlag(flagKey);

      if (existing) {
        await featureFlagService?.updateFeatureFlag(flagKey, { is_active: newEnabled });
      } else {
        await featureFlagService?.createFeatureFlag({
          flag_key: flagKey,
          flag_name: feature?.name,
          description: feature?.description,
          is_active: newEnabled,
          rollout_percentage: 100,
          flag_type: 'boolean'
        });
      }
      setMessage({ type: 'success', text: `${feature?.name} ${newEnabled ? 'enabled' : 'disabled'} and saved` });
    } catch (err) {
      // Revert on error
      setFeatures(prev => prev?.map(f => f?.id === featureId ? { ...f, enabled: !newEnabled } : f));
      setMessage({ type: 'error', text: `Failed to save: ${err?.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleBulkToggle = async (category, enabled) => {
    const categoryFeatures = features?.filter(f => f?.category === category);
    setFeatures(prev => prev?.map(f => f?.category === category ? { ...f, enabled } : f));
    setSaving(true);
    try {
      await Promise.all(categoryFeatures?.map(async (feature) => {
        const flagKey = `gamification_${feature?.id}`;
        const { data: existing } = await featureFlagService?.getFeatureFlag(flagKey);
        if (existing) {
          await featureFlagService?.updateFeatureFlag(flagKey, { is_active: enabled });
        } else {
          await featureFlagService?.createFeatureFlag({
            flag_key: flagKey,
            flag_name: feature?.name,
            description: feature?.description,
            is_active: enabled,
            rollout_percentage: 100,
            flag_type: 'boolean'
          });
        }
      }));
      setMessage({ type: 'success', text: `All ${category} features ${enabled ? 'enabled' : 'disabled'} and saved` });
    } catch (err) {
      setMessage({ type: 'error', text: `Bulk save failed: ${err?.message}` });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const filteredFeatures = filterCategory === 'all' ? features : features?.filter(f => f?.category === filterCategory);

  const getCategoryStats = (category) => {
    const categoryFeatures = features?.filter(f => f?.category === category);
    const enabledCount = categoryFeatures?.filter(f => f?.enabled)?.length;
    return { total: categoryFeatures?.length, enabled: enabledCount };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading feature flags from Supabase...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${message?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message?.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message?.text}</span>
          {saving && <Loader className="w-4 h-4 animate-spin ml-auto" />}
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Feature Toggle Matrix</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>Supabase-persisted</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories?.map(category => {
            const stats = category !== 'all' ? getCategoryStats(category) : null;
            return (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Features' : category}
                {stats && <span className="ml-2 text-xs opacity-75">({stats?.enabled}/{stats?.total})</span>}
              </button>
            );
          })}
        </div>
      </div>
      {filterCategory !== 'all' && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Bulk Actions for {filterCategory}</span>
            <div className="flex gap-2">
              <button onClick={() => handleBulkToggle(filterCategory, true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">Enable All</button>
              <button onClick={() => handleBulkToggle(filterCategory, false)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Disable All</button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredFeatures?.map(feature => (
          <div key={feature?.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{feature?.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">{feature?.category}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{feature?.description}</p>
              </div>
              <button
                onClick={() => handleToggle(feature?.id)}
                disabled={saving}
                className={`ml-4 relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                  feature?.enabled ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${feature?.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Feature Toggle Impact</h4>
            <p className="text-sm text-blue-700 mt-1">
              All toggles are persisted to Supabase feature_flags table with real-time sync.
              {' '}{features?.filter(f => f?.enabled)?.length} of {features?.length} features currently enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureToggleMatrix;