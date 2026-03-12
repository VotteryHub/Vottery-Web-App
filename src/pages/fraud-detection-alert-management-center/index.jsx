import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AlertOverview from './components/AlertOverview';
import AlertRulesPanel from './components/AlertRulesPanel';
import LiveAlertsPanel from './components/LiveAlertsPanel';
import NotificationRulesPanel from './components/NotificationRulesPanel';
import AlertEffectivenessPanel from './components/AlertEffectivenessPanel';
import { alertService } from '../../services/alertService';
import { supabase } from '../../lib/supabase';
import { analytics } from '../../hooks/useGoogleAnalytics';

const FraudDetectionAlertManagementCenter = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [alertData, setAlertData] = useState({
    statistics: null,
    rules: [],
    alerts: [],
    effectiveness: []
  });

  useEffect(() => {
    loadAlertData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    // Real-time subscription for new alerts
    const alertsChannel = supabase
      ?.channel('fraud_alerts_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_alerts' },
        (payload) => {
          if (payload?.eventType === 'INSERT') {
            setAlertData(prev => ({
              ...prev,
              alerts: [payload?.new, ...prev?.alerts]
            }));
          } else if (payload?.eventType === 'UPDATE') {
            setAlertData(prev => ({
              ...prev,
              alerts: prev?.alerts?.map(alert =>
                alert?.id === payload?.new?.id ? payload?.new : alert
              )
            }));
          }
        }
      )
      ?.subscribe();

    const rulesChannel = supabase
      ?.channel('alert_rules_real_time')
      ?.on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alert_rules' },
        (payload) => {
          console.log('Alert rule update:', payload);
          refreshData();
        }
      )
      ?.subscribe();

    return () => {
      clearInterval(interval);
      if (alertsChannel) {
        supabase?.removeChannel(alertsChannel);
      }
      if (rulesChannel) {
        supabase?.removeChannel(rulesChannel);
      }
    };
  }, []);

  useEffect(() => {
    // Track page view with custom parameters
    analytics?.trackEvent('fraud_center_viewed', {
      total_alerts: alertData?.statistics?.totalAlerts || 0,
      active_alerts: alertData?.statistics?.activeAlerts || 0,
      critical_alerts: alertData?.statistics?.criticalAlerts || 0
    });
  }, [alertData?.statistics]);

  const loadAlertData = async () => {
    try {
      setLoading(true);
      const [statsResult, rulesResult, alertsResult, effectivenessResult] = await Promise.all([
        alertService?.getAlertStatistics(),
        alertService?.getAlertRules(),
        alertService?.getSystemAlerts({ limit: 50 }),
        alertService?.getAlertEffectiveness()
      ]);

      setAlertData({
        statistics: statsResult?.data,
        rules: rulesResult?.data || [],
        alerts: alertsResult?.data || [],
        effectiveness: effectivenessResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load alert data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadAlertData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'rules', label: 'Alert Rules', icon: 'Settings', badge: alertData?.rules?.filter(r => r?.isEnabled)?.length || 0 },
    { id: 'live', label: 'Live Alerts', icon: 'AlertTriangle', badge: alertData?.statistics?.active || 0 },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'effectiveness', label: 'Analytics', icon: 'BarChart3' }
  ];

  return (
    <>
      <Helmet>
        <title>Fraud Detection & Alert Management Center - Vottery</title>
        <meta name="description" content="Automated threshold-based alerting system for fraud detection, policy violations, and performance anomalies with real-time monitoring." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Fraud Detection & Alert Management
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated threshold-based monitoring with real-time alerts across the platform
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
                  {tab?.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab?.id
                        ? 'bg-white/20 text-white' :'bg-primary/10 text-primary'
                    }`}>
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="card p-12 text-center">
              <Icon name="Loader" size={48} className="mx-auto text-primary mb-4 animate-spin" />
              <p className="text-muted-foreground">Loading alert management data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <AlertOverview 
                  statistics={alertData?.statistics} 
                  recentAlerts={alertData?.alerts?.slice(0, 10)}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'rules' && (
                <AlertRulesPanel 
                  rules={alertData?.rules} 
                  onRefresh={loadAlertData}
                />
              )}
              {activeTab === 'live' && (
                <LiveAlertsPanel 
                  alerts={alertData?.alerts} 
                  onRefresh={loadAlertData}
                />
              )}
              {activeTab === 'notifications' && (
                <NotificationRulesPanel 
                  rules={alertData?.rules}
                  onRefresh={loadAlertData}
                />
              )}
              {activeTab === 'effectiveness' && (
                <AlertEffectivenessPanel 
                  effectiveness={alertData?.effectiveness}
                  statistics={alertData?.statistics}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default FraudDetectionAlertManagementCenter;