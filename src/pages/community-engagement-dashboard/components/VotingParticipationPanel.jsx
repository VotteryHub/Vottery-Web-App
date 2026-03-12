import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { feedbackService } from '../../../services/feedbackService';

const VotingParticipationPanel = ({ timeRange, userId }) => {
  const [loading, setLoading] = useState(true);
  const [participationData, setParticipationData] = useState(null);
  const [votingHistory, setVotingHistory] = useState([]);

  useEffect(() => {
    loadVotingData();
  }, [timeRange, userId]);

  const loadVotingData = async () => {
    setLoading(true);
    try {
      const [participation, history] = await Promise.all([
        feedbackService?.getVotingParticipationMetrics(userId, { timeRange }),
        feedbackService?.getVotingHistory(userId, { timeRange })
      ]);

      if (participation?.data) {
        setParticipationData(participation?.data);
      }

      if (history?.data) {
        setVotingHistory(history?.data);
      }
    } catch (error) {
      console.error('Error loading voting data:', error);
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Icon name="Vote" className="w-6 h-6 text-green-500" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Voting Participation
        </h2>
      </div>

      {/* Participation Metrics */}
      {participationData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="Vote" className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {participationData?.participationRate || 0}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Participation Rate
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {participationData?.totalVotes || 0} votes cast out of {participationData?.totalOpportunities || 0} opportunities
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="Target" className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {participationData?.accuracyScore || 0}%
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Voting Accuracy
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Alignment with community consensus
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Icon name="Flame" className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {participationData?.currentStreak || 0}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Current Streak
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Consecutive days with voting activity
            </p>
          </div>
        </div>
      )}

      {/* Voting Frequency Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Voting Frequency
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {participationData?.weeklyActivity?.map((day, index) => (
            <div key={index} className="text-center">
              <div
                className={`h-20 rounded-lg mb-2 ${
                  day?.votes > 0
                    ? 'bg-green-500' :'bg-gray-200 dark:bg-gray-700'
                }`}
                style={{
                  opacity: day?.votes > 0 ? Math.min(day?.votes / 10, 1) : 0.3
                }}
              />
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {day?.dayName}
              </p>
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {day?.votes || 0}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Voting History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Voting Activity
        </h3>
        <div className="space-y-3">
          {votingHistory?.map(vote => (
            <div
              key={vote?.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {vote?.featureRequestTitle}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {vote?.voteType === 'upvote' ? 'Voted in favor' : 'Voted against'}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`${
                      vote?.voteType === 'upvote' ?'bg-green-500' :'bg-red-500'
                    } text-white text-xs px-3 py-1 rounded-full flex items-center gap-1`}
                  >
                    <Icon
                      name={vote?.voteType === 'upvote' ? 'ThumbsUp' : 'ThumbsDown'}
                      className="w-3 h-3"
                    />
                    {vote?.voteType === 'upvote' ? 'Upvote' : 'Downvote'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(vote?.votedAt)?.toLocaleDateString()}
                  </span>
                </div>
              </div>
              {vote?.alignedWithConsensus && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Icon name="CheckCircle" className="w-4 h-4" />
                  <span>Aligned with community consensus</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {votingHistory?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Vote" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No voting activity found for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default VotingParticipationPanel;