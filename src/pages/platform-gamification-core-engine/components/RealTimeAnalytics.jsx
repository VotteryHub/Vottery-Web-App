import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

export default function RealTimeAnalytics() {
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [analytics, setAnalytics] = useState({
    totalEligibleUsers: 45892,
    segmentBreakdown: {
      mau: 38450,
      dau: 12340,
      premiumBuyers: 5678,
      subscribers: 8920,
      advertisers: 234,
      creators: 1890
    },
    distributionEffectiveness: 87.5,
    engagementRate: 72.3,
    lastUpdated: new Date()
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setAnalytics(prev => ({
        ...prev,
        totalEligibleUsers: prev?.totalEligibleUsers + Math.floor(Math.random() * 10 - 5),
        distributionEffectiveness: Math.min(100, Math.max(0, prev?.distributionEffectiveness + (Math.random() * 2 - 1))),
        engagementRate: Math.min(100, Math.max(0, prev?.engagementRate + (Math.random() * 2 - 1))),
        lastUpdated: new Date()
      }));
    }, refreshInterval * 1000);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="space-y-6">
      {/* Refresh Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Real-Time Monitoring
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Last updated: {analytics?.lastUpdated?.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(parseInt(e?.target?.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
            <Icon name="RefreshCw" className="w-5 h-5 text-purple-600 animate-spin" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Eligible Users
            </h4>
            <Icon name="Users" className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {analytics?.totalEligibleUsers?.toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <Icon name="TrendingUp" className="w-4 h-4" />
            +2.3% from last hour
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Distribution Effectiveness
            </h4>
            <Icon name="Target" className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {analytics?.distributionEffectiveness?.toFixed(1)}%
          </p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${analytics?.distributionEffectiveness}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Engagement Rate
            </h4>
            <Icon name="Activity" className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {analytics?.engagementRate?.toFixed(1)}%
          </p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <Icon name="TrendingUp" className="w-4 h-4" />
            Above target
          </p>
        </div>
      </div>

      {/* Segment Performance */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Segment Performance Metrics
        </h3>
        <div className="space-y-4">
          {[
            { key: 'mau', label: 'Monthly Active Users', color: 'blue' },
            { key: 'dau', label: 'Daily Active Users', color: 'green' },
            { key: 'premiumBuyers', label: 'Premium Buyers', color: 'purple' },
            { key: 'subscribers', label: 'Subscribers', color: 'yellow' },
            { key: 'advertisers', label: 'Advertisers', color: 'red' },
            { key: 'creators', label: 'Content Creators', color: 'indigo' }
          ]?.map(({ key, label, color }) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {analytics?.segmentBreakdown?.[key]?.toLocaleString()} users
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${(analytics?.segmentBreakdown?.[key] / analytics?.totalEligibleUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Correlation Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Engagement Correlation Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Prize Amount vs Participation
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Strong positive correlation detected
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }} />
              </div>
              <span className="text-sm font-medium text-green-600">0.92</span>
            </div>
          </div>

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">
              Frequency vs User Retention
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Moderate positive correlation
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
              <span className="text-sm font-medium text-blue-600">0.68</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg shadow p-6 border border-green-200 dark:border-green-800">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Optimization Recommendations
            </h3>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Increase allocation to DAU segment by 5% for better engagement</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Premium buyers show 3x higher participation - consider targeted campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="CheckCircle" className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>Weekend campaigns show 40% better performance - schedule accordingly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}