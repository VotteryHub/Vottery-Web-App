import React, { useState, useEffect } from 'react';
import { Activity, Zap, AlertTriangle, CheckCircle, TrendingUp, Database } from 'lucide-react';
import { crossScreenRealtimeService } from '../../services/crossScreenRealtimeService';
import SynchronizationOverviewPanel from './components/SynchronizationOverviewPanel';
import ScreenMonitoringPanel from './components/ScreenMonitoringPanel';
import AIRecommendationPanel from './components/AIRecommendationPanel';
import DataConsistencyPanel from './components/DataConsistencyPanel';
import ConflictResolutionPanel from './components/ConflictResolutionPanel';
import PerformanceMetricsPanel from './components/PerformanceMetricsPanel';

const CrossScreenRealTimeSynchronizationMonitor = () => {
  const [syncOverview, setSyncOverview] = useState(null);
  const [screenData, setScreenData] = useState([]);
  const [aiRecommendations, setAIRecommendations] = useState(null);
  const [conflictAnalytics, setConflictAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    initializeSync();
    return () => {
      crossScreenRealtimeService?.cleanup();
    };
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshData();
    }, 3000); // Refresh every 3 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const initializeSync = async () => {
    try {
      setLoading(true);
      const result = await crossScreenRealtimeService?.initializeSync();
      if (result?.success) {
        setInitialized(true);
        await refreshData();
      }
    } catch (error) {
      console.error('Failed to initialize sync:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const overview = crossScreenRealtimeService?.getSyncOverview();
      const screens = crossScreenRealtimeService?.getScreenData();
      const aiRecs = crossScreenRealtimeService?.getAIRecommendations();
      const conflicts = crossScreenRealtimeService?.getConflictAnalytics();

      setSyncOverview(overview);
      setScreenData(screens);
      setAIRecommendations(aiRecs);
      setConflictAnalytics(conflicts);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const handleManualSync = async (tableName) => {
    try {
      const result = await crossScreenRealtimeService?.triggerManualSync(tableName);
      if (result?.success) {
        await refreshData();
      }
    } catch (error) {
      console.error('Manual sync failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Initializing Cross-Screen Synchronization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Database className="w-10 h-10 text-blue-600" />
              Cross-Screen Real-Time Synchronization Monitor
            </h1>
            <p className="text-gray-600 text-lg">
              Comprehensive oversight of live data consistency and AI recommendation propagation across all 117 Vottery platform screens
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                autoRefresh
                  ? 'bg-green-600 text-white hover:bg-green-700' :'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              {autoRefresh ? 'Auto-Refresh: ON' : 'Auto-Refresh: OFF'}
            </button>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Refresh Now
            </button>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Sync Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {initialized ? 'Active' : 'Inactive'}
                </p>
              </div>
              <CheckCircle className={`w-8 h-8 ${initialized ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {syncOverview?.activeSubscriptions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Consistency Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {syncOverview?.averageConsistencyScore || 100}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Conflicts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {conflictAnalytics?.totalConflicts || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Synchronization Overview */}
        <SynchronizationOverviewPanel syncOverview={syncOverview} />

        {/* Screen-by-Screen Monitoring */}
        <ScreenMonitoringPanel 
          screenData={screenData} 
          onManualSync={handleManualSync}
        />

        {/* AI Recommendation Propagation */}
        <AIRecommendationPanel aiRecommendations={aiRecommendations} />

        {/* Data Consistency Analytics */}
        <DataConsistencyPanel 
          syncOverview={syncOverview}
          screenData={screenData}
        />

        {/* Conflict Resolution */}
        <ConflictResolutionPanel conflictAnalytics={conflictAnalytics} />

        {/* Performance Metrics */}
        <PerformanceMetricsPanel screenData={screenData} />
      </div>
    </div>
  );
};

export default CrossScreenRealTimeSynchronizationMonitor;