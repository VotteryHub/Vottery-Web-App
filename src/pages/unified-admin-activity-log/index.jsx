import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ActivityTimeline from './components/ActivityTimeline';
import ActivityFilters from './components/ActivityFilters';
import ActivityStatistics from './components/ActivityStatistics';
import ComplianceExport from './components/ComplianceExport';
import { adminLogService } from '../../services/adminLogService';

const UnifiedAdminActivityLog = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activityData, setActivityData] = useState({
    logs: [],
    statistics: null,
    admins: []
  });
  const [filters, setFilters] = useState({
    actionType: 'all',
    severity: 'all',
    timeRange: 'all',
    complianceRelevant: undefined,
    adminId: null,
    search: ''
  });

  useEffect(() => {
    loadActivityData();
    
    // Real-time subscription for new activity logs
    const channel = adminLogService?.subscribeToActivityLogs((payload) => {
      if (payload?.eventType === 'INSERT') {
        setActivityData(prev => ({
          ...prev,
          logs: [payload?.data, ...prev?.logs]
        }));
      }
    });

    return () => {
      adminLogService?.unsubscribeFromActivityLogs(channel);
    };
  }, []);

  useEffect(() => {
    loadActivityData();
  }, [filters]);

  const loadActivityData = async () => {
    try {
      setLoading(true);
      const [logsResult, statsResult, adminsResult] = await Promise.all([
        adminLogService?.getActivityLogs(filters),
        adminLogService?.getActivityStatistics(),
        adminLogService?.getAdminList()
      ]);

      setActivityData({
        logs: logsResult?.data || [],
        statistics: statsResult?.data,
        admins: adminsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load activity data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadActivityData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      actionType: 'all',
      severity: 'all',
      timeRange: 'all',
      complianceRelevant: undefined,
      adminId: null,
      search: ''
    });
  };

  const tabs = [
    { id: 'timeline', label: 'Activity Timeline', icon: 'Clock' },
    { id: 'statistics', label: 'Statistics', icon: 'BarChart3' },
    { id: 'export', label: 'Compliance Export', icon: 'Download' }
  ];

  return (
    <GeneralPageLayout title="Admin Activity Log" showSidebar={true}>
      <div className="w-full py-0">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 animate-in fade-in slide-in-from-top-8 duration-700">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Icon name="ShieldCheck" size={28} className="text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Audit Trail</h1>
              <p className="text-slate-500 font-medium text-sm mt-1">Immutable administrative action history</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-2 rounded-2xl border border-white/5 shadow-2xl">
            <div className="hidden md:block px-4 border-r border-white/10">
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Last Sync</p>
              <p className="text-[10px] text-white font-mono">{lastUpdated?.toLocaleTimeString()}</p>
            </div>
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all disabled:opacity-50 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest"
            >
              <Icon name={refreshing ? 'Loader' : 'RefreshCw'} size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Syncing...' : 'Sync Registry'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 bg-black/20 backdrop-blur-xl rounded-2xl p-1.5 border border-white/5 mb-10 overflow-x-auto no-scrollbar">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/20'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-indigo-500/20" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Retreiving Audit Logs...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {activeTab === 'timeline' && (
              <>
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <ActivityFilters
                      filters={filters}
                      admins={activityData?.admins}
                      onFilterChange={handleFilterChange}
                      onClearFilters={handleClearFilters}
                    />
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <ActivityTimeline
                    logs={activityData?.logs}
                    onRefresh={refreshData}
                  />
                </div>
              </>
            )}
            {activeTab === 'statistics' && (
              <div className="lg:col-span-4">
                <ActivityStatistics
                  statistics={activityData?.statistics}
                  logs={activityData?.logs}
                />
              </div>
            )}
            {activeTab === 'export' && (
              <div className="lg:col-span-4">
                <ComplianceExport
                  filters={filters}
                  totalLogs={activityData?.logs?.length}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </GeneralPageLayout>
  );
};

export default UnifiedAdminActivityLog;