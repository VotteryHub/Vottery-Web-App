import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CommunityLeaderboardPanel = ({ leaderboardData, timeRange, currentUserId }) => {
  const [sortBy, setSortBy] = useState('overall');

  const sortOptions = [
    { value: 'overall', label: 'Overall Score', icon: 'Trophy' },
    { value: 'feedback', label: 'Feedback Quality', icon: 'MessageSquare' },
    { value: 'voting', label: 'Voting Participation', icon: 'Vote' },
    { value: 'requests', label: 'Feature Requests', icon: 'Lightbulb' },
    { value: 'adoption', label: 'Adoption Metrics', icon: 'TrendingUp' }
  ];

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-orange-600 text-white';
    return 'bg-blue-500 text-white';
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Icon name="Trophy" className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Community Leaderboard
          </h2>
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e?.target?.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {sortOptions?.map(option => (
            <option key={option?.value} value={option?.value}>
              {option?.label}
            </option>
          ))}
        </select>
      </div>
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {leaderboardData?.slice(0, 3)?.map((member, index) => (
          <div
            key={member?.userId}
            className={`relative bg-gradient-to-br ${
              index === 0
                ? 'from-yellow-400 to-yellow-600'
                : index === 1
                ? 'from-gray-300 to-gray-500' :'from-orange-400 to-orange-600'
            } rounded-lg p-6 text-white shadow-xl transform ${
              index === 0 ? 'scale-105' : ''
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white flex items-center justify-center">
                <span className="text-3xl font-bold text-gray-800">#{index + 1}</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{member?.username || 'Anonymous'}</h3>
              <p className="text-sm opacity-90 mb-2">{member?.email}</p>
              <div className="text-2xl font-bold">{member?.overallScore || 0} pts</div>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Icon name="Award" className="w-4 h-4" />
                <span className="text-sm">{member?.badgesEarned || 0} badges</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Full Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Member
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Overall Score
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Feedback Quality
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Voting Participation
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Feature Requests
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Badges
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {leaderboardData?.map((member, index) => (
              <tr
                key={member?.userId}
                className={`${
                  member?.userId === currentUserId
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' :'hover:bg-gray-50 dark:hover:bg-gray-700'
                } transition-colors`}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${getRankBadgeColor(
                      index + 1
                    )} font-bold text-sm`}
                  >
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {member?.username?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {member?.username || 'Anonymous'}
                        {member?.userId === currentUserId && (
                          <span className="ml-2 text-xs text-blue-500">(You)</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {member?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`text-lg font-bold ${getScoreColor(member?.overallScore)}`}>
                    {member?.overallScore || 0}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${member?.feedbackQualityScore || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                      {member?.feedbackQualityScore || 0}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${member?.votingParticipationRate || 0}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[3rem]">
                      {member?.votingParticipationRate || 0}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-gray-900 dark:text-white font-medium">
                    {member?.featureRequestsSubmitted || 0}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(member?.badgesEarned || 0, 5) })?.map((_, i) => (
                      <Icon key={i} name="Award" className="w-4 h-4 text-yellow-500" />
                    ))}
                    {(member?.badgesEarned || 0) > 5 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        +{member?.badgesEarned - 5}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leaderboardData?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No leaderboard data available for the selected time range.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommunityLeaderboardPanel;