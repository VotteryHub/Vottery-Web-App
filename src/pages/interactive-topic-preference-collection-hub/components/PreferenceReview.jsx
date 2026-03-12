import React from 'react';
import Icon from '../../../components/AppIcon';
import { useNavigate } from 'react-router-dom';

const PreferenceReview = ({ preferences, completionStatus, onRestart }) => {
  const navigate = useNavigate();

  const getPreferenceLabel = (score) => {
    if (score > 0.5) return { label: 'Love it', color: 'text-green-600 dark:text-green-400', icon: 'Heart' };
    if (score > 0) return { label: 'Like it', color: 'text-blue-600 dark:text-blue-400', icon: 'ThumbsUp' };
    if (score > -0.5) return { label: 'Not interested', color: 'text-orange-600 dark:text-orange-400', icon: 'ThumbsDown' };
    return { label: 'Dislike', color: 'text-red-600 dark:text-red-400', icon: 'X' };
  };

  const sortedPreferences = [...preferences]?.sort((a, b) => b?.preferenceScore - a?.preferenceScore);

  return (
    <div className="space-y-6">
      {/* Completion Card */}
      <div className="card p-6 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Preferences Collected!
        </h2>
        <p className="text-muted-foreground mb-6">
          We have learned about your interests. Your feed will now be personalized based on these preferences.
        </p>

        {completionStatus && (
          <div className="flex items-center justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {completionStatus?.completedTopics}
              </div>
              <div className="text-sm text-muted-foreground">Topics Reviewed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {completionStatus?.completionPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate('/home-feed-dashboard')}
            className="btn btn-primary"
          >
            <Icon name="Home" size={18} />
            Go to Feed
          </button>
          <button
            onClick={onRestart}
            className="btn btn-secondary"
          >
            <Icon name="RotateCcw" size={18} />
            Review Again
          </button>
        </div>
      </div>

      {/* Preferences List */}
      <div className="card p-6">
        <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="List" size={24} className="text-primary" />
          Your Topic Preferences
        </h3>

        <div className="space-y-3">
          {sortedPreferences?.map((pref) => {
            const { label, color, icon } = getPreferenceLabel(pref?.preferenceScore);
            const scorePercentage = ((pref?.preferenceScore + 1) / 2) * 100;

            return (
              <div
                key={pref?.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Icon name={pref?.topicCategories?.iconName || 'Star'} size={24} className="text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {pref?.topicCategories?.displayName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Icon name={icon} size={14} className={color} />
                        <span className={`text-sm font-medium ${color}`}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {pref?.swipeCount} swipes
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {pref?.positiveSwipes} 👍 / {pref?.negativeSwipes} 👎
                    </div>
                  </div>
                </div>

                {/* Preference Score Bar */}
                <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                      pref?.preferenceScore > 0
                        ? 'bg-gradient-to-r from-green-500 to-green-400' :'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${scorePercentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {sortedPreferences?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-50" />
            <p>No preferences recorded yet. Start swiping to build your profile!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferenceReview;