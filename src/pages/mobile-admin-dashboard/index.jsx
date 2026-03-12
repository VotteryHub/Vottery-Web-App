import React, { useState, useEffect, useRef, useCallback } from 'react';
import Icon from '../../components/AppIcon';
import { RefreshCw } from 'lucide-react';
import { alertService } from '../../services/alertService';
import { adminLogService } from '../../services/adminLogService';
import CriticalAlertsPanel from './components/CriticalAlertsPanel';
import FraudDetectionActions from './components/FraudDetectionActions';
import CampaignEmergencyControls from './components/CampaignEmergencyControls';
import QuickStatsGrid from './components/QuickStatsGrid';
import LoadTestingMobilePanel from './components/LoadTestingMobilePanel';
import ElectionIntegrityMobilePanel from './components/ElectionIntegrityMobilePanel';
import { analytics } from '../../hooks/useGoogleAnalytics';

const MobileAdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({
    activeAlerts: 0,
    criticalIssues: 0,
    activeCampaigns: 0,
    systemHealth: 'healthy'
  });
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [cachedData, setCachedData] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const touchStartX = useRef(null);
  const CACHE_KEY = 'mobile_admin_dashboard_cache';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  const SECTIONS = ['Overview', 'Alerts', 'Fraud', 'Campaigns', 'Load Test', 'Elections'];

  useEffect(() => {
    // Online/offline detection
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Track mobile dashboard access
    analytics?.trackEvent('mobile_admin_dashboard_accessed', {
      device_type: 'mobile',
      critical_alerts_count: criticalAlerts?.length || 0,
      timestamp: new Date()?.toISOString()
    });
  }, [criticalAlerts]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Try cache first if offline
      if (isOffline) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL) {
            setCriticalAlerts(data?.alerts || []);
            setRecentActivity(data?.activity || []);
            setStats(data?.stats || stats);
            setCachedData({ timestamp });
            setLoading(false);
            return;
          }
        }
      }

      // Load critical alerts
      const { data: alerts } = await alertService?.getSystemAlerts({
        severity: 'critical',
        status: 'active',
        limit: 10
      });
      setCriticalAlerts(alerts || []);

      // Load recent admin activity
      const { data: activity } = await adminLogService?.getActivityLogs({
        limit: 5,
        timeRange: 'today'
      });
      setRecentActivity(activity || []);

      // Calculate stats
      const { data: allAlerts } = await alertService?.getSystemAlerts({
        status: 'active'
      });
      
      setStats({
        activeAlerts: allAlerts?.length || 0,
        criticalIssues: alerts?.length || 0,
        activeCampaigns: 12, // Would come from campaign service
        systemHealth: alerts?.length > 5 ? 'critical' : alerts?.length > 0 ? 'warning' : 'healthy'
      });

      // Cache data for offline use
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: { alerts: alerts || [], activity: activity || [], stats },
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Touch/swipe gesture handlers for section navigation
  const handleTouchStart = (e) => { touchStartX.current = e?.touches?.[0]?.clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX?.current === null) return;
    const diff = touchStartX?.current - e?.changedTouches?.[0]?.clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) setActiveSection(i => Math.min(i + 1, SECTIONS?.length - 1));
      else setActiveSection(i => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading Emergency Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Icon name="Shield" size={20} className="text-destructive" />
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-foreground">
                  Emergency Command
                </h1>
                <p className="text-xs text-muted-foreground">Mobile Admin Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            >
              <Icon 
                name="RefreshCw" 
                size={20} 
                className={`${refreshing ? 'animate-spin' : ''} text-foreground`} 
              />
            </button>
          </div>

          {/* System Health Indicator */}
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
            stats?.systemHealth === 'critical' ? 'bg-red-50 dark:bg-red-900/20' :
            stats?.systemHealth === 'warning'? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-green-50 dark:bg-green-900/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              stats?.systemHealth === 'critical' ? 'bg-red-500 animate-pulse' :
              stats?.systemHealth === 'warning'? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`} />
            <span className={`text-sm font-medium ${
              stats?.systemHealth === 'critical' ? 'text-red-700 dark:text-red-400' :
              stats?.systemHealth === 'warning'? 'text-yellow-700 dark:text-yellow-400' : 'text-green-700 dark:text-green-400'
            }`}>
              System Status: {stats?.systemHealth?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 space-y-4">
        {/* Quick Stats */}
        <QuickStatsGrid stats={stats} />

        {/* Critical Alerts Panel */}
        <CriticalAlertsPanel 
          alerts={criticalAlerts} 
          onRefresh={handleRefresh}
        />

        {/* Fraud Detection Actions */}
        <FraudDetectionActions onRefresh={handleRefresh} />

        {/* Campaign Emergency Controls */}
        <CampaignEmergencyControls onRefresh={handleRefresh} />

        {/* Load Testing Mobile Panel */}
        <LoadTestingMobilePanel onRefresh={handleRefresh} />

        {/* Election Integrity Mobile Panel */}
        <ElectionIntegrityMobilePanel onRefresh={handleRefresh} />

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-heading font-semibold text-foreground">
              Recent Admin Actions
            </h3>
            <Icon name="Activity" size={18} className="text-primary" />
          </div>
          <div className="space-y-3">
            {recentActivity?.length > 0 ? (
              recentActivity?.map((activity) => (
                <div key={activity?.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity?.actionDescription}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity?.createdAt)?.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No recent activity
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button className="flex flex-col items-center gap-1 p-2 rounded-lg bg-primary/10">
            <Icon name="Shield" size={20} className="text-primary" />
            <span className="text-xs font-medium text-primary">Dashboard</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="AlertTriangle" size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Alerts</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="Users" size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Users</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted transition-colors">
            <Icon name="Settings" size={20} className="text-foreground" />
            <span className="text-xs text-muted-foreground">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileAdminDashboard;