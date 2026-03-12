import React from 'react';
import Icon from '../../../components/AppIcon';

const PreferenceProgress = ({ currentIndex, totalTopics, completionStatus }) => {
  const progressPercentage = totalTopics > 0 ? ((currentIndex / totalTopics) * 100) : 0;

  return (
    <div className="mb-6">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon name="Target" size={20} className="text-primary" />
            <span className="font-semibold text-foreground">
              Progress: {currentIndex} of {totalTopics}
            </span>
          </div>
          {completionStatus && (
            <div className="flex items-center gap-2">
              <Icon name="Award" size={20} className="text-yellow-500" />
              <span className="text-sm text-muted-foreground">
                {completionStatus?.completionPercentage}% Complete
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Completion Status */}
        {completionStatus?.isComplete && (
          <div className="mt-3 flex items-center gap-2 text-green-600 dark:text-green-400">
            <Icon name="CheckCircle" size={18} />
            <span className="text-sm font-medium">
              All topics reviewed! Your personalized feed is ready.
            </span>
          </div>
        )}

        {/* Recommendation Readiness */}
        {completionStatus && !completionStatus?.isComplete && (
          <div className="mt-3 text-sm text-muted-foreground">
            <span>
              {completionStatus?.completedTopics >= 3
                ? '✓ Enough data for basic recommendations'
                : `${3 - completionStatus?.completedTopics} more topics needed for recommendations`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreferenceProgress;