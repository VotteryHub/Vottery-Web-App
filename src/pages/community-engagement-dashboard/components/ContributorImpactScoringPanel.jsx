import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const ContributorImpactScoringPanel = ({ timeRange, userId }) => {
  const [loading, setLoading] = useState(true);
  const [impactData, setImpactData] = useState(null);
  const [influenceMetrics, setInfluenceMetrics] = useState(null);

  useEffect(() => {
    loadImpactData();
  }, [timeRange, userId]);

  const loadImpactData = async () => {
    setLoading(true);
    try {
      const [impact, influence] = await Promise.all([
        feedbackService?.getContributorImpactScore(userId, { timeRange }),
        feedbackService?.getCommunityInfluenceMetrics(userId, { timeRange })
      ]);

      if (impact?.data) {
        setImpactData(impact?.data);
      }

      if (influence?.data) {
        setInfluenceMetrics(influence?.data);
      }
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactLevel = (score) => {
    if (score >= 90) return { label: 'Exceptional', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' };
    if (score >= 75) return { label: 'High', color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' };
    if (score >= 50) return { label: 'Moderate', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' };
    if (score >= 25) return { label: 'Growing', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/20' };
    return { label: 'Emerging', color: 'text-gray-500', bg: 'bg-gray-100 dark:bg-gray-900/20' };
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <Icon name="Loader" className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </div>
    );
  }

  const impactLevel = getImpactLevel(impactData?.overallScore || 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="TrendingUp" className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Contributor Impact Scoring
        </h2>
      </div>
      {/* Overall Impact Score */}
      {impactData && (
        <div className={`${impactLevel?.bg} rounded-lg p-6 mb-8`}>
          <div className="text-center">
            <div className="text-6xl font-bold ${impactLevel.color} mb-2">
              {impactData?.overallScore || 0}
            </div>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
              {impactLevel?.label} Impact
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your contributions have made a significant difference in the community
            </p>
          </div>
        </div>
      )}
      {/* Impact Breakdown */}
      {impactData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="MessageSquare" className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {impactData?.feedbackImpact || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Feedback Impact
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${impactData?.feedbackImpact || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="Vote" className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {impactData?.votingImpact || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Voting Impact
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${impactData?.votingImpact || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="Lightbulb" className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {impactData?.requestImpact || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Request Impact
            </h3>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{ width: `${impactData?.requestImpact || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Community Influence Metrics */}
      {influenceMetrics && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Community Influence Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Reach Score</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {influenceMetrics?.reachScore || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Number of community members influenced by your contributions
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Engagement Rate</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {influenceMetrics?.engagementRate || 0}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Average engagement on your contributions
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Consensus Alignment</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {influenceMetrics?.consensusAlignment || 0}%
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                How often your views align with community consensus
              </p>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Thought Leadership</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {influenceMetrics?.thoughtLeadershipScore || 0}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Recognition as a community thought leader
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Automated Recognition Workflows */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Automated Recognition Workflows
        </h3>
        <div className="space-y-3">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Quality Contributor Badge</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Automatically awarded for maintaining 80%+ quality score
                </p>
              </div>
              <span className="text-green-500 font-semibold">Active</span>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <Icon name="TrendingUp" className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Impact Milestone Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications when reaching impact milestones
                </p>
              </div>
              <span className="text-blue-500 font-semibold">Active</span>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <Icon name="Award" className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Public Recognition</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Top contributors featured in community highlights
                </p>
              </div>
              <span className="text-purple-500 font-semibold">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorImpactScoringPanel;