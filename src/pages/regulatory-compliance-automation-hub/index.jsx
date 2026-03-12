import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ComplianceOverviewPanel from './components/ComplianceOverviewPanel';
import AutomatedSubmissionsPanel from './components/AutomatedSubmissionsPanel';
import JurisdictionManagementPanel from './components/JurisdictionManagementPanel';
import ResendIntegrationPanel from './components/ResendIntegrationPanel';
import ComplianceCalendarPanel from './components/ComplianceCalendarPanel';
import AuditTrailPanel from './components/AuditTrailPanel';
import { complianceService } from '../../services/complianceService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const RegulatoryComplianceAutomationHub = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [complianceData, setComplianceData] = useState({
    statistics: null,
    filings: [],
    jurisdictions: [],
    submissionLogs: [],
    submissionStats: null
  });

  useEffect(() => {
    loadComplianceData();
    analytics?.trackEvent('regulatory_compliance_viewed', {
      active_tab: activeTab
    });
  }, []);

  useRealtimeMonitoring({
    tables: 'system_alerts',
    onRefresh: loadComplianceData,
    enabled: true,
  });

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const [statsResult, filingsResult, jurisdictionsResult, submissionStatsResult] = await Promise.all([
        complianceService?.getComplianceStatistics('30d'),
        complianceService?.getRegulatoryFilings({ timeRange: 'month' }),
        complianceService?.getJurisdictionCompliance({}),
        complianceService?.getSubmissionStatistics('30d')
      ]);

      setComplianceData({
        statistics: statsResult?.data,
        filings: filingsResult?.data || [],
        jurisdictions: jurisdictionsResult?.data || [],
        submissionLogs: [],
        submissionStats: submissionStatsResult?.data
      });
    } catch (error) {
      console.error('Failed to load compliance data:', error);
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadComplianceData();
    setRefreshing(false);
  };

  const handleSubmitFiling = async (filingId, recipients) => {
    try {
      const result = await complianceService?.submitRegulatoryFilingViaResend(filingId, recipients);
      if (result?.data) {
        await loadComplianceData();
        return { success: true, data: result?.data };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'submissions', label: 'Automated Submissions', icon: 'Send' },
    { id: 'jurisdictions', label: 'Multi-Jurisdiction', icon: 'Globe' },
    { id: 'resend', label: 'Resend Integration', icon: 'Mail' },
    { id: 'calendar', label: 'Compliance Calendar', icon: 'Calendar' },
    { id: 'audit', label: 'Audit Trail', icon: 'FileText' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ComplianceOverviewPanel statistics={complianceData?.statistics} submissionStats={complianceData?.submissionStats} loading={loading} />;
      case 'submissions':
        return <AutomatedSubmissionsPanel filings={complianceData?.filings} onSubmit={handleSubmitFiling} loading={loading} />;
      case 'jurisdictions':
        return <JurisdictionManagementPanel jurisdictions={complianceData?.jurisdictions} loading={loading} />;
      case 'resend':
        return <ResendIntegrationPanel submissionStats={complianceData?.submissionStats} loading={loading} />;
      case 'calendar':
        return <ComplianceCalendarPanel filings={complianceData?.filings} loading={loading} />;
      case 'audit':
        return <AuditTrailPanel filings={complianceData?.filings} loading={loading} />;
      default:
        return <ComplianceOverviewPanel statistics={complianceData?.statistics} submissionStats={complianceData?.submissionStats} loading={loading} />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Regulatory Compliance Automation Hub - Vottery</title>
        <meta name="description" content="Automated regulatory submissions with Resend integration for multi-jurisdiction compliance tracking and audit trail documentation." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Regulatory Compliance Automation Hub
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated regulatory submissions with multi-jurisdiction compliance tracking
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
                </div>
                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} className={refreshing ? 'animate-spin' : ''} size={16} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2 border-b border-border">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab?.id
                      ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  {tab?.label}
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

export default RegulatoryComplianceAutomationHub;