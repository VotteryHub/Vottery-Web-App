import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AutomatedDistributionPanel from './components/AutomatedDistributionPanel';
import TemplateManagementPanel from './components/TemplateManagementPanel';
import DeliveryOptimizationPanel from './components/DeliveryOptimizationPanel';
import EmailAnalyticsPanel from './components/EmailAnalyticsPanel';
import RecipientManagementPanel from './components/RecipientManagementPanel';
import { scheduledReportsService } from '../../services/scheduledReportsService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const EnhancedResendEmailAutomationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [emailData, setEmailData] = useState({
    overview: {
      activeCampaigns: 0,
      scheduledReports: 0,
      deliveryRate: 98.7,
      openRate: 42.3
    },
    schedules: [],
    templates: [],
    reports: []
  });

  useEffect(() => {
    loadEmailData();
  }, []);

  useEffect(() => {
    analytics?.trackEvent('resend_hub_viewed', {
      active_campaigns: emailData?.overview?.activeCampaigns,
      delivery_rate: emailData?.overview?.deliveryRate
    });
  }, [emailData?.overview]);

  const loadEmailData = async () => {
    try {
      setLoading(true);
      const [schedulesResult, templatesResult, reportsResult] = await Promise.all([
        scheduledReportsService?.getReportSchedules(),
        scheduledReportsService?.getEmailTemplates(),
        scheduledReportsService?.getScheduledReports({ limit: 50 })
      ]);

      const activeSchedules = schedulesResult?.data?.filter(s => s?.isEnabled) || [];
      
      setEmailData({
        overview: {
          activeCampaigns: activeSchedules?.length,
          scheduledReports: reportsResult?.data?.length || 0,
          deliveryRate: 98.7,
          openRate: 42.3
        },
        schedules: schedulesResult?.data || [],
        templates: templatesResult?.data || [],
        reports: reportsResult?.data || []
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load email data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadEmailData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'distribution', label: 'Automated Distribution', icon: 'Send' },
    { id: 'templates', label: 'Template Management', icon: 'FileText' },
    { id: 'optimization', label: 'Delivery Optimization', icon: 'TrendingUp' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' },
    { id: 'recipients', label: 'Recipients', icon: 'Users' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Enhanced Resend Email Automation Hub | Vottery</title>
        </Helmet>
        <HeaderNavigation />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading email automation hub...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Enhanced Resend Email Automation Hub | Vottery</title>
      </Helmet>
      <HeaderNavigation />
      
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Enhanced Resend Email Automation Hub
              </h1>
              <p className="text-muted-foreground">
                Automated email distribution for compliance reports, settlement confirmations, and campaign analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-lg">
                <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {refreshing ? 'Refreshing...' : `Updated ${lastUpdated?.toLocaleTimeString()}`}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                onClick={refreshData}
                disabled={refreshing}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Icon name="Send" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Campaigns</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {emailData?.overview?.activeCampaigns}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                  <Icon name="Calendar" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Reports</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {emailData?.overview?.scheduledReports}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                  <Icon name="CheckCircle" size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Rate</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {emailData?.overview?.deliveryRate}%
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Icon name="Eye" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    {emailData?.overview?.openRate}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                {tab?.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Reports</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {emailData?.reports?.slice(0, 5)?.map((report) => (
                    <div key={report?.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm capitalize">
                            {report?.reportType?.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(report?.createdAt)?.toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          report?.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          report?.status === 'failed'? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {report?.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Active Schedules</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {emailData?.schedules?.filter(s => s?.isEnabled)?.slice(0, 5)?.map((schedule) => (
                    <div key={schedule?.id} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium text-foreground text-sm">{schedule?.scheduleName}</p>
                          <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {schedule?.frequency} • {schedule?.reportType?.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <AutomatedDistributionPanel 
              schedules={emailData?.schedules}
              reports={emailData?.reports}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'templates' && (
            <TemplateManagementPanel 
              templates={emailData?.templates}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'optimization' && (
            <DeliveryOptimizationPanel 
              schedules={emailData?.schedules}
              reports={emailData?.reports}
            />
          )}

          {activeTab === 'analytics' && (
            <EmailAnalyticsPanel 
              reports={emailData?.reports}
              schedules={emailData?.schedules}
            />
          )}

          {activeTab === 'recipients' && (
            <RecipientManagementPanel 
              schedules={emailData?.schedules}
              onRefresh={refreshData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedResendEmailAutomationHub;