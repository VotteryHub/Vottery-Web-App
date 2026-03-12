import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PeakEngagementPanel = ({ timingData, userId }) => {
  const [selectedType, setSelectedType] = useState('general');

  const notificationTypes = [
    { id: 'general', label: 'General', color: 'bg-blue-500' },
    { id: 'votes', label: 'Votes', color: 'bg-purple-500' },
    { id: 'messages', label: 'Messages', color: 'bg-green-500' },
    { id: 'achievements', label: 'Achievements', color: 'bg-yellow-500' },
    { id: 'election_updates', label: 'Elections', color: 'bg-red-500' }
  ];

  const peakWindows = timingData?.peakWindows || [
    { hour: 9, label: '9:00 - 10:00', engagementScore: 8.7, activityCount: 42, avgSessionMinutes: 12 },
    { hour: 19, label: '19:00 - 20:00', engagementScore: 7.2, activityCount: 35, avgSessionMinutes: 18 },
    { hour: 12, label: '12:00 - 13:00', engagementScore: 6.1, activityCount: 28, avgSessionMinutes: 8 }
  ];

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const maxScore = Math.max(...(timingData?.peakWindows?.map(w => w?.engagementScore) || [10]));

  return (
    <div className="space-y-6">
      {/* Notification Type Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-purple-500" />
          User Activity Pattern Analysis
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {notificationTypes?.map(type => (
            <button
              key={type?.id}
              onClick={() => setSelectedType(type?.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedType === type?.id
                  ? `${type?.color} text-white`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {type?.label}
            </button>
          ))}
        </div>

        {/* 24-hour Activity Heatmap */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-3">24-Hour Engagement Heatmap</p>
          <div className="flex gap-1 items-end h-20">
            {hours?.map(hour => {
              const window = timingData?.peakWindows?.find(w => w?.hour === hour);
              const height = window ? Math.max(20, (window?.engagementScore / maxScore) * 100) : 15;
              const isPeak = peakWindows?.some(w => w?.hour === hour);
              return (
                <div key={hour} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-t transition-all ${
                      isPeak ? 'bg-purple-500' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    style={{ height: `${height}%` }}
                    title={`${hour}:00 - Score: ${window?.engagementScore || 0}`}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
          </div>
        </div>
      </div>
      {/* Peak Windows */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-yellow-500" />
          Optimal Notification Windows
        </h3>
        <div className="space-y-4">
          {peakWindows?.map((window, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
              }`}>
                #{i + 1}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{window?.label}</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-xs text-muted-foreground">Activities: {window?.activityCount}</span>
                  <span className="text-xs text-muted-foreground">Avg session: {window?.avgSessionMinutes}min</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">{window?.engagementScore}</p>
                <p className="text-xs text-muted-foreground">Score</p>
              </div>
              <div className="w-24">
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                  <div
                    className="h-2 bg-purple-500 rounded-full"
                    style={{ width: `${(window?.engagementScore / maxScore) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Recommendation */}
      {timingData?.recommendation && (
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Icon name="Lightbulb" size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-800 dark:text-purple-300">ML Recommendation</p>
              <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">{timingData?.recommendation}</p>
              <p className="text-xs text-purple-600 dark:text-purple-500 mt-2">
                Based on {timingData?.totalDataPoints || 0} activity data points · {timingData?.confidenceScore || 0}% confidence
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeakEngagementPanel;
