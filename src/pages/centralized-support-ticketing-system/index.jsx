import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import TicketQueuePanel from './components/TicketQueuePanel';
import DisputeResolutionPanel from './components/DisputeResolutionPanel';
import AgentWorkspacePanel from './components/AgentWorkspacePanel';
import TicketStatisticsPanel from './components/TicketStatisticsPanel';
import { supportTicketService } from '../../services/supportTicketService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const CentralizedSupportTicketingSystem = () => {
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [ticketData, setTicketData] = useState({
    tickets: [],
    statistics: null,
    agents: []
  });
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    priority: 'all'
  });

  useEffect(() => {
    loadTicketData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [filters]);

  useEffect(() => {
    // Track page view with custom parameters
    analytics?.trackEvent('support_center_viewed', {
      active_tab: activeTab,
      total_tickets: ticketData?.tickets?.length || 0,
      open_tickets: ticketData?.statistics?.open || 0,
      timestamp: new Date()?.toISOString()
    });
  }, [activeTab, ticketData]);

  const loadTicketData = async () => {
    try {
      setLoading(true);
      const [ticketsResult, statsResult, agentsResult] = await Promise.all([
        supportTicketService?.getTickets(filters),
        supportTicketService?.getTicketStatistics(),
        supportTicketService?.getAgentPerformance()
      ]);

      setTicketData({
        tickets: ticketsResult?.data || [],
        statistics: statsResult?.data,
        agents: agentsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load ticket data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadTicketData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'queue', label: 'Ticket Queue', icon: 'Inbox', badge: ticketData?.statistics?.open || 0 },
    { id: 'disputes', label: 'Dispute Resolution', icon: 'AlertCircle', badge: ticketData?.tickets?.filter(t => t?.type === 'billing_dispute')?.length || 0 },
    { id: 'workspace', label: 'Agent Workspace', icon: 'Users', badge: ticketData?.agents?.filter(a => a?.status === 'online')?.length || 0 },
    { id: 'statistics', label: 'Analytics', icon: 'BarChart3' }
  ];

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading support tickets...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'queue':
        return <TicketQueuePanel tickets={ticketData?.tickets} filters={filters} setFilters={setFilters} onRefresh={loadTicketData} />;
      case 'disputes':
        return <DisputeResolutionPanel tickets={ticketData?.tickets?.filter(t => t?.type === 'billing_dispute')} onRefresh={loadTicketData} />;
      case 'workspace':
        return <AgentWorkspacePanel agents={ticketData?.agents} tickets={ticketData?.tickets} onRefresh={loadTicketData} />;
      case 'statistics':
        return <TicketStatisticsPanel statistics={ticketData?.statistics} tickets={ticketData?.tickets} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Centralized Support Ticketing System - Vottery</title>
        <meta name="description" content="Comprehensive customer service management for advertiser inquiries, dispute resolution, and technical issue tracking with automated routing and escalation workflows." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Centralized Support Ticketing System
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Comprehensive customer service management with automated routing and escalation
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Live • Updated {lastUpdated?.toLocaleTimeString()}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <Icon name="Inbox" size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Tickets</p>
                    <p className="text-2xl font-bold text-foreground">{ticketData?.statistics?.total || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Icon name="CheckCircle" size={20} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Resolved Today</p>
                    <p className="text-2xl font-bold text-foreground">{ticketData?.statistics?.resolved || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                    <Icon name="Clock" size={20} className="text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Avg Response Time</p>
                    <p className="text-2xl font-bold text-foreground">{ticketData?.statistics?.avgResponseTime?.toFixed(0) || 0}m</p>
                  </div>
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <Icon name="Star" size={20} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Satisfaction Score</p>
                    <p className="text-2xl font-bold text-foreground">{ticketData?.statistics?.satisfactionScore?.toFixed(1) || 0}/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-card text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.badge !== undefined && tab?.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab?.id
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {tab?.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default CentralizedSupportTicketingSystem;