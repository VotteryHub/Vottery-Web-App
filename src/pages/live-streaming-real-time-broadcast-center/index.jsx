import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../../components/AppIcon';
import StreamManagementPanel from './components/StreamManagementPanel';
import ViewerAnalyticsPanel from './components/ViewerAnalyticsPanel';
import InteractiveFeaturesPanel from './components/InteractiveFeaturesPanel';
import BroadcastAnalyticsPanel from './components/BroadcastAnalyticsPanel';
import StreamSchedulingPanel from './components/StreamSchedulingPanel';
import RecordingManagementPanel from './components/RecordingManagementPanel';

export default function LiveStreamingRealTimeBroadcastCenter() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeStreams, setActiveStreams] = useState([]);
  const [totalViewers, setTotalViewers] = useState(0);
  const [broadcastQuality, setBroadcastQuality] = useState('excellent');
  const [refreshInterval, setRefreshInterval] = useState(15000);

  const tabs = [
    { id: 'overview', label: 'Live Dashboard', icon: 'Radio' },
    { id: 'stream-management', label: 'Stream Management', icon: 'Video' },
    { id: 'viewer-analytics', label: 'Viewer Analytics', icon: 'Users' },
    { id: 'interactive', label: 'Interactive Features', icon: 'MessageSquare' },
    { id: 'broadcast-analytics', label: 'Broadcast Analytics', icon: 'BarChart3' },
    { id: 'scheduling', label: 'Stream Scheduling', icon: 'Calendar' },
    { id: 'recordings', label: 'Recording Management', icon: 'Film' }
  ];

  useEffect(() => {
    loadActiveStreams();
    const interval = setInterval(() => {
      loadActiveStreams();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const loadActiveStreams = async () => {
    // Simulated data - replace with actual service call
    setActiveStreams([
      {
        id: 1,
        title: 'Election Results Announcement 2026',
        viewers: 15234,
        duration: '1h 23m',
        quality: 'HD',
        status: 'live'
      },
      {
        id: 2,
        title: 'Community Town Hall Meeting',
        viewers: 8456,
        duration: '45m',
        quality: 'HD',
        status: 'live'
      }
    ]);
    setTotalViewers(23690);
  };

  const getQualityColor = (quality) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Icon name="Radio" className="w-8 h-8 text-red-600" />
                Live Streaming & Real-Time Broadcast Center
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive live video integration with interactive audience engagement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  {activeStreams?.length} Live Streams
                </span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg">
                <Icon name="Users" className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {totalViewers?.toLocaleString()} Viewers
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs?.map(tab => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-red-600 text-red-600 dark:text-red-400' :'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon name={tab?.icon} className="w-4 h-4" />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Streams</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeStreams?.length}
                    </p>
                  </div>
                  <Icon name="Radio" className="w-8 h-8 text-red-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Viewers</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {totalViewers?.toLocaleString()}
                    </p>
                  </div>
                  <Icon name="Users" className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg Engagement</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      87.3%
                    </p>
                  </div>
                  <Icon name="TrendingUp" className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Broadcast Quality</p>
                    <p className={`text-2xl font-bold mt-1 capitalize ${getQualityColor(broadcastQuality)}`}>
                      {broadcastQuality}
                    </p>
                  </div>
                  <Icon name="Activity" className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Active Streams List */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Icon name="Radio" className="w-5 h-5 text-red-600" />
                  Active Live Streams
                </h2>
              </div>
              <div className="p-6">
                {activeStreams?.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="Radio" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No active streams at the moment</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeStreams?.map(stream => (
                      <div
                        key={stream?.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-24 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                              <Icon name="Video" className="w-8 h-8 text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              LIVE
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{stream?.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center gap-1">
                                <Icon name="Users" className="w-4 h-4" />
                                {stream?.viewers?.toLocaleString()} viewers
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Clock" className="w-4 h-4" />
                                {stream?.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Monitor" className="w-4 h-4" />
                                {stream?.quality}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Icon name="Eye" className="w-4 h-4" />
                            Watch
                          </button>
                          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            <Icon name="Settings" className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Real-Time Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" className="w-5 h-5 text-green-600" />
                  Viewer Growth (Last Hour)
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Peak Concurrent</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">28,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Average Viewers</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">21,340</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</span>
                    <span className="text-sm font-semibold text-green-600">+15.3%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" className="w-5 h-5 text-purple-600" />
                  Engagement Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Chat Messages</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">12,456</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Reactions</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">8,234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Poll Responses</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">5,678</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stream-management' && <StreamManagementPanel />}
        {activeTab === 'viewer-analytics' && <ViewerAnalyticsPanel />}
        {activeTab === 'interactive' && <InteractiveFeaturesPanel />}
        {activeTab === 'broadcast-analytics' && <BroadcastAnalyticsPanel />}
        {activeTab === 'scheduling' && <StreamSchedulingPanel />}
        {activeTab === 'recordings' && <RecordingManagementPanel />}
      </div>
    </div>
  );
}