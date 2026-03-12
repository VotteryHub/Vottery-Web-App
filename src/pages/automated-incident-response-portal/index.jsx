import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import IncidentOverviewPanel from './components/IncidentOverviewPanel';
import ThreatIntelligencePanel from './components/ThreatIntelligencePanel';
import ActiveIncidentsPanel from './components/ActiveIncidentsPanel';
import ResponseAutomationPanel from './components/ResponseAutomationPanel';
import RemediationTrackingPanel from './components/RemediationTrackingPanel';
import IncidentTimelinePanel from './components/IncidentTimelinePanel';
import { incidentResponseService } from '../../services/incidentResponseService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const AutomatedIncidentResponsePortal = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [incidentData, setIncidentData] = useState({
    statistics: null,
    activeIncidents: [],
    threatIntelligence: null
  });

  useEffect(() => {
    loadIncidentData();
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    const channel = incidentResponseService?.subscribeToIncidents((payload) => {
      if (payload?.eventType === 'INSERT') {
        setIncidentData(prev => ({
          ...prev,
          activeIncidents: [payload?.data, ...prev?.activeIncidents]
        }));
      } else if (payload?.eventType === 'UPDATE') {
        setIncidentData(prev => ({
          ...prev,
          activeIncidents: prev?.activeIncidents?.map(incident => 
            incident?.id === payload?.data?.id ? payload?.data : incident
          )
        }));
      }
    });

    return () => {
      clearInterval(interval);
      incidentResponseService?.unsubscribeFromIncidents(channel);
    };
  }, []);

  useEffect(() => {
    analytics?.trackEvent('incident_response_portal_viewed', {
      active_tab: activeTab,
      total_incidents: incidentData?.statistics?.totalIncidents || 0
    });
  }, [activeTab]);

  const loadIncidentData = async () => {
    try {
      setLoading(true);
      const [statsResult, incidentsResult] = await Promise.all([
        incidentResponseService?.getIncidentStatistics('30d'),
        incidentResponseService?.getIncidents({ limit: 50 })
      ]);

      setIncidentData({
        statistics: statsResult?.data,
        activeIncidents: incidentsResult?.data || [],
        threatIntelligence: null
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load incident data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadIncidentData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'active', label: 'Active Incidents', icon: 'AlertTriangle', badge: incidentData?.statistics?.activeIncidents || 0 },
    { id: 'threat', label: 'Threat Intelligence', icon: 'Shield' },
    { id: 'automation', label: 'Response Automation', icon: 'Zap' },
    { id: 'remediation', label: 'Remediation', icon: 'CheckCircle2' },
    { id: 'timeline', label: 'Timeline', icon: 'Clock' }
  ];

  return (
    <>
      <Helmet>
        <title>Automated Incident Response Portal - Vottery</title>
        <meta name="description" content="Perplexity AI-powered incident response coordination with automated workflows, threat intelligence, and real-time remediation tracking." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8 mt-14">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Automated Incident Response Portal
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  AI-powered threat coordination with automated response workflows and real-time intelligence
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {refreshing ? 'Updating...' : `Live • ${lastUpdated?.toLocaleTimeString()}`}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  iconName={refreshing ? "Loader" : "RefreshCw"}
                  onClick={refreshData}
                  disabled={refreshing}
                  className={refreshing ? 'animate-spin' : ''}
                >
                  Refresh
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
                      : 'bg-card text-muted-foreground hover:bg-muted/50 border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.label}</span>
                  {tab?.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab?.id
                        ? 'bg-white/20 text-white' :'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading incident response data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <IncidentOverviewPanel statistics={incidentData?.statistics} onRefresh={refreshData} />
              )}
              {activeTab === 'active' && (
                <ActiveIncidentsPanel incidents={incidentData?.activeIncidents} onRefresh={loadIncidentData} />
              )}
              {activeTab === 'threat' && (
                <ThreatIntelligencePanel incidents={incidentData?.activeIncidents} />
              )}
              {activeTab === 'automation' && (
                <ResponseAutomationPanel incidents={incidentData?.activeIncidents} />
              )}
              {activeTab === 'remediation' && (
                <RemediationTrackingPanel incidents={incidentData?.activeIncidents} onRefresh={loadIncidentData} />
              )}
              {activeTab === 'timeline' && (
                <IncidentTimelinePanel incidents={incidentData?.activeIncidents} />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default AutomatedIncidentResponsePortal;