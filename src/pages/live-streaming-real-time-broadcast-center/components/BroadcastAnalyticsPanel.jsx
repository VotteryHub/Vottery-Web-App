import React from 'react';
import Icon from '../../../components/AppIcon';

export default function BroadcastAnalyticsPanel() {
  const retentionData = [
    { time: '0:00', retention: 100 },
    { time: '0:15', retention: 95 },
    { time: '0:30', retention: 89 },
    { time: '0:45', retention: 85 },
    { time: '1:00', retention: 82 },
    { time: '1:15', retention: 78 },
    { time: '1:30', retention: 75 }
  ];

  return (
    <div className="space-y-6">
      {/* Viewer Retention Curve */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingDown" className="w-5 h-5 text-orange-600" />
          Viewer Retention Curve
        </h2>
        <div className="space-y-2">
          {retentionData?.map((point, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">{point?.time}</span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${point?.retention}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white w-12 text-right">{point?.retention}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Peak Concurrent Viewers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Users" className="w-5 h-5 text-purple-600" />
          Peak Concurrent Viewers Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">All-Time Peak</p>
            <p className="text-3xl font-bold text-purple-600">28,456</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Today at 2:34 PM</p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Peak</p>
            <p className="text-3xl font-bold text-blue-600">21,340</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Last 7 streams</p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Growth Rate</p>
            <p className="text-3xl font-bold text-green-600">+15.3%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Week over week</p>
          </div>
        </div>
      </div>

      {/* Engagement Correlation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-teal-600" />
          Engagement Correlation with Election Participation
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Stream Viewers → Voters</span>
              <span className="text-sm font-bold text-teal-600">54.1%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full" style={{ width: '54.1%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">8,234 viewers participated in elections</p>
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Chat Engagement</span>
              <span className="text-sm font-bold text-pink-600">81.7%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-2 rounded-full" style={{ width: '81.7%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">12,456 viewers sent chat messages</p>
          </div>

          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Poll Participation</span>
              <span className="text-sm font-bold text-indigo-600">37.3%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full" style={{ width: '37.3%' }} />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">5,678 viewers responded to polls</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Zap" className="w-5 h-5 text-yellow-600" />
          Broadcast Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Clock" className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Average Watch Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">42 minutes</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">+8% from previous stream</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="MessageSquare" className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Messages Per Minute</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">High engagement level</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Share2" className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">22.7%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">3,456 total shares</p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="ThumbsUp" className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Satisfaction Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8/5.0</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Based on 2,345 ratings</p>
          </div>
        </div>
      </div>
    </div>
  );
}