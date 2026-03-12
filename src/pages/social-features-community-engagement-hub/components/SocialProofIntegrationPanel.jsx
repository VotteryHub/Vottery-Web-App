import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialProofIntegrationPanel = ({ socialData }) => {
  const votingInfluenceIndicators = [
    { election: 'Best Streaming Platform 2024', friendsVoted: 12, totalVotes: 2450, influence: 'high' },
    { election: 'Favorite Sports Team', friendsVoted: 8, totalVotes: 1890, influence: 'medium' },
    { election: 'Top Tech Innovation', friendsVoted: 15, totalVotes: 3200, influence: 'very high' },
    { election: 'Best Restaurant Chain', friendsVoted: 5, totalVotes: 1234, influence: 'low' }
  ];

  const friendRecommendationBadges = [
    { user: 'Sarah Johnson', badge: 'Trusted Voter', votes: 234, accuracy: 89 },
    { user: 'Mike Chen', badge: 'Expert Analyst', votes: 456, accuracy: 92 },
    { user: 'Emma Davis', badge: 'Community Leader', votes: 678, accuracy: 87 },
    { user: 'Alex Rodriguez', badge: 'Trend Setter', votes: 345, accuracy: 91 }
  ];

  const communityValidationSignals = [
    { signal: 'Friend Participation Rate', value: '78%', trend: 'up', description: '12 of your 15 closest friends voted' },
    { signal: 'Social Proof Score', value: '8.5/10', trend: 'up', description: 'High community validation for your choices' },
    { signal: 'Influence Multiplier', value: '2.3x', trend: 'stable', description: 'Your votes carry 2.3x weight in friend network' },
    { signal: 'Trust Index', value: '92%', trend: 'up', description: 'Friends trust your voting recommendations' }
  ];

  const getInfluenceColor = (influence) => {
    switch (influence) {
      case 'very high': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'high': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'medium': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Award" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Voting Influence Indicators
          </h2>
        </div>

        <div className="space-y-4">
          {votingInfluenceIndicators?.map((item, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-foreground mb-2">{item?.election}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{item?.friendsVoted}</strong> friends voted
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Vote" size={16} className="text-purple-600 dark:text-purple-400" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{item?.totalVotes?.toLocaleString()}</strong> total votes
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getInfluenceColor(item?.influence)}`}>
                  {item?.influence?.toUpperCase()} INFLUENCE
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(item?.friendsVoted / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="Star" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Friend Recommendation Badges
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {friendRecommendationBadges?.map((friend, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {friend?.user?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{friend?.user}</div>
                  <div className="flex items-center gap-2">
                    <Icon name="Award" size={14} className="text-yellow-600 dark:text-yellow-400" />
                    <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                      {friend?.badge}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white dark:bg-gray-800 rounded px-2 py-1">
                  <span className="text-muted-foreground">Votes:</span>
                  <span className="font-medium text-foreground ml-1">{friend?.votes}</span>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded px-2 py-1">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-medium text-foreground ml-1">{friend?.accuracy}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="CheckCircle" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Community Validation Signals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityValidationSignals?.map((signal, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{signal?.signal}</span>
                <div className="flex items-center gap-1">
                  <Icon 
                    name={signal?.trend === 'up' ? 'TrendingUp' : signal?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                    size={16} 
                    className={signal?.trend === 'up' ? 'text-green-600 dark:text-green-400' : signal?.trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}
                  />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground mb-2">{signal?.value}</div>
              <p className="text-xs text-muted-foreground">{signal?.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Icon name="Shield" size={24} />
              Transparent Engagement Amplification
            </h3>
            <p className="text-green-100 mb-4">
              All social proof indicators are calculated transparently with privacy controls
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm text-green-100">Algorithm Transparency</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">Privacy</div>
                <div className="text-sm text-green-100">First Design</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-2xl font-bold">User</div>
                <div className="text-sm text-green-100">Controlled Data</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProofIntegrationPanel;