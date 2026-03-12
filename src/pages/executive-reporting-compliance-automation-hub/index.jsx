import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ReportDashboardPanel from './components/ReportDashboardPanel';
import ReportGenerationPanel from './components/ReportGenerationPanel';
import ResendDeliveryPanel from './components/ResendDeliveryPanel';
import StakeholderManagementPanel from './components/StakeholderManagementPanel';
import ScheduledReportsPanel from './components/ScheduledReportsPanel';
import DeliveryAnalyticsPanel from './components/DeliveryAnalyticsPanel';
import { executiveReportingService } from '../../services/executiveReportingService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const ExecutiveReportingComplianceAutomationHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [reportingData, setReportingData] = useState({
    reports: [],
    stakeholderGroups: [],
    deliveryStats: null
  });

  useEffect(() => {
    loadReportingData();
    analytics?.trackEvent('executive_reporting_viewed', {
      active_tab: activeTab
    });

    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadReportingData = async () => {
    try {
      setLoading(true);
      const [reportsResult, stakeholdersResult, statsResult] = await Promise.all([
        executiveReportingService?.getExecutiveReports({}),
        executiveReportingService?.getStakeholderGroups(),
        executiveReportingService?.getDeliveryStatistics('30d')
      ]);

      setReportingData({
        reports: reportsResult?.data || [],
        stakeholderGroups: stakeholdersResult?.data || [],
        deliveryStats: statsResult?.data
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load reporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setRefreshing(true);
      await loadReportingData();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendReport = async (reportId, stakeholderGroupId) => {
    try {
      const result = await executiveReportingService?.sendReportViaResend(reportId, stakeholderGroupId);
      if (result?.data) {
        await loadReportingData();
        return { success: true };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'generation', label: 'Report Generation', icon: 'FileText' },
    { id: 'resend', label: 'Resend Integration', icon: 'Mail' },
    { id: 'stakeholders', label: 'Stakeholder Management', icon: 'Users' },
    { id: 'scheduled', label: 'Scheduled Reports', icon: 'Calendar' },
    { id: 'analytics', label: 'Delivery Analytics', icon: 'BarChart' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <ReportDashboardPanel reports={reportingData?.reports} deliveryStats={reportingData?.deliveryStats} loading={loading} />;
      case 'generation':
        return <ReportGenerationPanel onReportCreated={loadReportingData} loading={loading} />;
      case 'resend':
        return <ResendDeliveryPanel reports={reportingData?.reports} stakeholderGroups={reportingData?.stakeholderGroups} onSendReport={handleSendReport} loading={loading} />;
      case 'stakeholders':
        return <StakeholderManagementPanel stakeholderGroups={reportingData?.stakeholderGroups} onUpdate={loadReportingData} loading={loading} />;
      case 'scheduled':
        return <ScheduledReportsPanel reports={reportingData?.reports} loading={loading} />;
      case 'analytics':
        return <DeliveryAnalyticsPanel deliveryStats={reportingData?.deliveryStats} loading={loading} />;
      default:
        return <ReportDashboardPanel reports={reportingData?.reports} deliveryStats={reportingData?.deliveryStats} loading={loading} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Executive Reporting & Compliance Automation Hub - Vottery</title>
        <meta name="description" content="Automated executive report generation and stakeholder communications with comprehensive compliance documentation and scheduled delivery management via Resend integration." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Executive Reporting & Compliance Automation Hub
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated report generation with Resend email delivery and comprehensive stakeholder communications
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Updated {lastUpdated?.toLocaleTimeString()}
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card text-foreground hover:bg-muted border border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
                </button>
              ))}
            </div>
          </div>

          {loading && activeTab === 'dashboard' ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading reporting data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {renderTabContent()}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ExecutiveReportingComplianceAutomationHub;