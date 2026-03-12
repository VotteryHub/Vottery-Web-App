import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../components/AppIcon';
import mcqService from '../../services/mcqService';
import InjectionQueuePanel from './components/InjectionQueuePanel';
import BroadcastEnginePanel from './components/BroadcastEnginePanel';
import VoterEngagementPanel from './components/VoterEngagementPanel';
import BroadcastAnalyticsPanel from './components/BroadcastAnalyticsPanel';

const LiveQuestionInjectionManagementCenter = () => {
  const [electionId, setElectionId] = useState('');
  const [queue, setQueue] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liveCount, setLiveCount] = useState(0);
  const [realtimeActive, setRealtimeActive] = useState(false);
  const [lastBroadcast, setLastBroadcast] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = useCallback(async () => {
    if (!electionId?.trim()) return;
    setLoading(true);
    try {
      const [queueResult, analyticsResult] = await Promise.all([
        mcqService?.getLiveQuestionInjectionQueue(electionId),
        mcqService?.getLiveQuestionBroadcastAnalytics(electionId)
      ]);
      if (!queueResult?.error) setQueue(queueResult?.data || []);
      if (!analyticsResult?.error) setAnalytics(analyticsResult?.data || []);
    } finally {
      setLoading(false);
    }
  }, [electionId]);

  useEffect(() => {
    if (!electionId?.trim()) return;
    loadData();

    // Real-time subscription
    const unsubscribe = mcqService?.streamLiveQuestions(electionId, (newQuestion) => {
      setLiveCount(prev => prev + 1);
      setLastBroadcast(newQuestion);
      loadData();
    });
    setRealtimeActive(true);
    return () => {
      unsubscribe?.();
      setRealtimeActive(false);
    };
  }, [electionId, loadData]);

  const handleInject = async (question, scheduledFor) => {
    if (!electionId?.trim()) {
      showNotification('Please enter an Election ID first', 'error');
      return;
    }
    const { data, error } = await mcqService?.createLiveQuestionInjection(electionId, question, scheduledFor);
    if (error) {
      showNotification(`Failed: ${error?.message}`, 'error');
      return;
    }
    showNotification('Question injected into queue!');
    await loadData();
  };

  const handleBroadcast = async (item) => {
    const { data, error } = await mcqService?.broadcastLiveQuestion(item?.id);
    if (error) {
      showNotification(`Broadcast failed: ${error?.message}`, 'error');
      return;
    }
    showNotification('Question broadcasted to all voters!');
    await loadData();
  };

  const broadcastedCount = queue?.filter(q => q?.status === 'broadcasted')?.length || 0;
  const pendingCount = queue?.filter(q => q?.status === 'pending')?.length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Icon name="Radio" size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Live Question Injection Management Center</h1>
                <p className="text-sm text-muted-foreground">Real-time MCQ broadcasting with scheduling and analytics</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {realtimeActive && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-700 font-medium">Live</span>
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Broadcasts Today</p>
                <p className="text-lg font-bold text-foreground">{liveCount + broadcastedCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Notification */}
        {notification && (
          <div className={`mb-4 flex items-center gap-2 rounded-xl p-4 text-sm font-medium ${
            notification?.type === 'error' ?'bg-red-50 border border-red-200 text-red-700' :'bg-green-50 border border-green-200 text-green-700'
          }`}>
            <Icon name={notification?.type === 'error' ? 'AlertCircle' : 'CheckCircle'} size={16} />
            {notification?.msg}
          </div>
        )}

        {/* Election ID Input */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1">Election ID</label>
              <input
                type="text"
                value={electionId}
                onChange={e => setElectionId(e?.target?.value)}
                placeholder="Enter election UUID to manage live injections..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={loadData}
              disabled={!electionId?.trim() || loading}
              className="mt-5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Search" size={16} />}
              Load
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Queue Total', value: queue?.length, icon: 'List', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Pending', value: pendingCount, icon: 'Clock', color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Broadcasted', value: broadcastedCount, icon: 'Radio', color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Response Events', value: analytics?.length, icon: 'TrendingUp', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' }
          ]?.map(stat => (
            <div key={stat?.label} className={`${stat?.bg} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon name={stat?.icon} size={16} className={stat?.color} />
                <span className="text-xs text-muted-foreground">{stat?.label}</span>
              </div>
              <p className={`text-2xl font-bold ${stat?.color}`}>{stat?.value}</p>
            </div>
          ))}
        </div>

        {/* Last Broadcast Alert */}
        {lastBroadcast && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <Icon name="Bell" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">🎉 New question added!</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 truncate max-w-md">
                {lastBroadcast?.questionText || 'Live question broadcasted to voters'}
              </p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <BroadcastEnginePanel
              electionId={electionId}
              onInject={handleInject}
              loading={loading}
            />
            <InjectionQueuePanel
              queue={queue}
              onBroadcast={handleBroadcast}
              onRefresh={loadData}
              loading={loading}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <VoterEngagementPanel
              analytics={analytics}
              loading={loading}
            />
            <BroadcastAnalyticsPanel
              analytics={analytics}
              queue={queue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveQuestionInjectionManagementCenter;
