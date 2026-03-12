import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
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
    <>
      <Helmet>
        <title>Unified Admin Activity Log - Vottery</title>
        <meta name="description" content="Comprehensive audit trail documenting all administrative actions, content moderation decisions, and system changes with filterable timeline and compliance export." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Unified Admin Activity Log
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive audit trail for all administrative actions and system changes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  <Icon name="Clock" size={14} className="inline mr-1" />
                  Updated {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? 'Loader' : 'RefreshCw'}
                  onClick={refreshData}
                  disabled={refreshing}
                >
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading activity logs...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {activeTab === 'timeline' && (
                <>
                  <div className="lg:col-span-1">
                    <ActivityFilters
                      filters={filters}
                      admins={activityData?.admins}
                      onFilterChange={handleFilterChange}
                      onClearFilters={handleClearFilters}
                    />
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
        </main>
      </div>
    </>
  );
};

export default UnifiedAdminActivityLog;