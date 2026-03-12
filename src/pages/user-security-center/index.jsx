import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { useAuth } from '../../contexts/AuthContext';
import { userSecurityService } from '../../services/userSecurityService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

import FraudRiskPanel from './components/FraudRiskPanel';
import ThreatMonitoringPanel from './components/ThreatMonitoringPanel';
import SecurityEventsPanel from './components/SecurityEventsPanel';
import SecurityTimelinePanel from './components/SecurityTimelinePanel';
import SecurityRecommendationsPanel from './components/SecurityRecommendationsPanel';
import TwoFactorAuthPanel from './components/TwoFactorAuthPanel';

const UserSecurityCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [securityData, setSecurityData] = useState({
    fraudRisk: null,
    threatMonitoring: null,
    securityEvents: [],
    securityTimeline: [],
    recommendations: null
  });

  useEffect(() => {
    if (user?.id) loadSecurityData();
  }, [user?.id, timeRange]);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    filter: { column: 'user_id', value: user?.id },
    onRefresh: refreshData,
    enabled: !!user?.id,
  });

  useEffect(() => {
    analytics?.trackEvent('user_security_viewed', {
      active_tab: activeTab,
      user_id: user?.id,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab]);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      
      const [fraudRiskResult, threatResult, eventsResult, timelineResult, recommendationsResult] = await Promise.all([
        userSecurityService?.getPersonalFraudRisk(user?.id),
        userSecurityService?.getThreatMonitoring(user?.id),
        userSecurityService?.getSecurityEvents(user?.id, timeRange),
        userSecurityService?.getSecurityTimeline(user?.id, '30d'),
        userSecurityService?.getSecurityRecommendations(user?.id)
      ]);

      setSecurityData({
        fraudRisk: fraudRiskResult?.data,
        threatMonitoring: threatResult?.data,
        securityEvents: eventsResult?.data || [],
        securityTimeline: timelineResult?.data || [],
        recommendations: recommendationsResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadSecurityData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: 'Shield' },
    { id: 'threats', label: 'Threat Monitoring', icon: 'AlertTriangle' },
    { id: 'events', label: 'Security Events', icon: 'Activity' },
    { id: 'timeline', label: 'Security Timeline', icon: 'Clock' },
    { id: 'recommendations', label: 'Recommendations', icon: 'Lightbulb' },
    { id: '2fa', label: 'Two-Factor Auth', icon: 'Lock' }
  ];

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  return (
    <>
      <Helmet>
        <title>User Security Center - Vottery</title>
        <meta name="description" content="Personal fraud risk assessment and threat monitoring with real-time security insights for individual users." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  User Security Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Personal fraud risk dashboard with real-time threat monitoring and security insights
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e?.target?.value)}
                  options={timeRangeOptions}
                  className="w-40"
                />
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
                  iconClassName={refreshing ? 'animate-spin' : ''}
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
              <p className="text-muted-foreground">Loading security data...</p>
            </div>
          ) : (
            <div>
              {activeTab === 'overview' && (
                <FraudRiskPanel 
                  fraudRisk={securityData?.fraudRisk}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'threats' && (
                <ThreatMonitoringPanel 
                  threatMonitoring={securityData?.threatMonitoring}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'events' && (
                <SecurityEventsPanel 
                  securityEvents={securityData?.securityEvents}
                  timeRange={timeRange}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'timeline' && (
                <SecurityTimelinePanel 
                  securityTimeline={securityData?.securityTimeline}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === 'recommendations' && (
                <SecurityRecommendationsPanel 
                  recommendations={securityData?.recommendations}
                  onRefresh={refreshData}
                />
              )}
              {activeTab === '2fa' && (
                <TwoFactorAuthPanel 
                  userId={user?.id}
                  onRefresh={refreshData}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserSecurityCenter;