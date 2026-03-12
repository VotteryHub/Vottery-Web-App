import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

export default function ViewerAnalyticsPanel() {
  const [viewerData, setViewerData] = useState({
    current: 15234,
    peak: 28456,
    average: 21340,
    retention: 87.3,
    newViewers: 4523,
    returningViewers: 10711
  });

  const [geographicData, setGeographicData] = useState([
    { country: 'United States', viewers: 5234, percentage: 34.3 },
    { country: 'India', viewers: 3456, percentage: 22.7 },
    { country: 'United Kingdom', viewers: 2123, percentage: 13.9 },
    { country: 'Canada', viewers: 1567, percentage: 10.3 },
    { country: 'Australia', viewers: 1234, percentage: 8.1 },
    { country: 'Others', viewers: 1620, percentage: 10.7 }
  ]);

  return (
    <div className="space-y-6">
      {/* Real-Time Viewer Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Users" className="w-5 h-5 text-blue-600" />
          Real-Time Viewer Metrics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Viewers</p>
            <p className="text-3xl font-bold text-blue-600">{viewerData?.current?.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <Icon name="TrendingUp" className="w-4 h-4" />
              <span>+12.5% from last hour</span>
            </div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Peak Concurrent</p>
            <p className="text-3xl font-bold text-purple-600">{viewerData?.peak?.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="Clock" className="w-4 h-4" />
              <span>2 hours ago</span>
            </div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Average Viewers</p>
            <p className="text-3xl font-bold text-green-600">{viewerData?.average?.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <Icon name="BarChart3" className="w-4 h-4" />
              <span>Last 24 hours</span>
            </div>
          </div>
        </div>
      </div>

      {/* Viewer Retention */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-green-600" />
          Viewer Retention Analysis
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Retention Rate</span>
              <span className="text-sm font-bold text-green-600">{viewerData?.retention}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${viewerData?.retention}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="UserPlus" className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">New Viewers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerData?.newViewers?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">29.7% of total</p>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="UserCheck" className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Returning Viewers</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{viewerData?.returningViewers?.toLocaleString()}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">70.3% of total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Globe" className="w-5 h-5 text-indigo-600" />
          Geographic Distribution
        </h2>
        <div className="space-y-3">
          {geographicData?.map((location, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Icon name="MapPin" className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{location?.country}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${location?.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white w-20 text-right">
                  {location?.viewers?.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                  {location?.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Correlation */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-orange-600" />
          Engagement Correlation with Election Participation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Viewers Who Voted</p>
            <p className="text-2xl font-bold text-orange-600">8,234</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">54.1% conversion</p>
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chat Participants</p>
            <p className="text-2xl font-bold text-pink-600">12,456</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">81.7% engagement</p>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Poll Responses</p>
            <p className="text-2xl font-bold text-teal-600">5,678</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">37.3% participation</p>
          </div>
        </div>
      </div>
    </div>
  );
}