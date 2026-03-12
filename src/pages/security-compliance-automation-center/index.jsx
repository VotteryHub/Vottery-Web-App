import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import GDPRAuditTrailPanel from './components/GDPRAuditTrailPanel';
import PCIDSSCompliancePanel from './components/PCIDSSCompliancePanel';
import ComplianceSchedulingPanel from './components/ComplianceSchedulingPanel';
import AutomatedSubmissionWorkflowPanel from './components/AutomatedSubmissionWorkflowPanel';
import ComplianceReportingPanel from './components/ComplianceReportingPanel';
import LegalTeamDashboardPanel from './components/LegalTeamDashboardPanel';
import { complianceService } from '../../services/complianceService';
import { analytics } from '../../hooks/useGoogleAnalytics';
import { useRealtimeMonitoring } from '../../hooks/useRealtimeMonitoring';

const SecurityComplianceAutomationCenter = () => {
  const [activeTab, setActiveTab] = useState('gdpr');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [complianceData, setComplianceData] = useState({
    gdprAuditTrail: [],
    pciDssStatus: null,
    scheduledReports: [],
    submissionWorkflows: [],
    legalTeamMetrics: null
  });

  useEffect(() => {
    loadComplianceData();
    analytics?.trackEvent('security_compliance_automation_viewed', {
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
      const [gdprResult, pciResult, scheduledResult, workflowsResult, metricsResult] = await Promise.all([
        complianceService?.getGDPRAuditTrail({ timeRange: '30d' }),
        complianceService?.getPCIDSSComplianceStatus(),
        complianceService?.getScheduledComplianceReports(),
        complianceService?.getSubmissionWorkflows({ status: 'active' }),
        complianceService?.getLegalTeamMetrics('30d')
      ]);

      setComplianceData({
        gdprAuditTrail: gdprResult?.data || [],
        pciDssStatus: pciResult?.data,
        scheduledReports: scheduledResult?.data || [],
        submissionWorkflows: workflowsResult?.data || [],
        legalTeamMetrics: metricsResult?.data
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

  const handleGenerateGDPRAudit = async (params) => {
    try {
      const result = await complianceService?.generateGDPRAuditReport(params);
      if (result?.data) {
        await loadComplianceData();
        return { success: true, data: result?.data };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const handleScheduleReport = async (reportConfig) => {
    try {
      const result = await complianceService?.scheduleComplianceReport(reportConfig);
      if (result?.data) {
        await loadComplianceData();
        return { success: true, data: result?.data };
      }
      return { success: false, error: result?.error };
    } catch (error) {
      return { success: false, error: { message: error?.message } };
    }
  };

  const handleSubmitWorkflow = async (workflowId) => {
    try {
      const result = await complianceService?.executeSubmissionWorkflow(workflowId);
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
    { id: 'gdpr', label: 'GDPR Audit Trail', icon: 'Shield' },
    { id: 'pcidss', label: 'PCI-DSS Compliance', icon: 'CreditCard' },
    { id: 'scheduling', label: 'Compliance Scheduling', icon: 'Calendar' },
    { id: 'workflows', label: 'Submission Workflows', icon: 'Workflow' },
    { id: 'reporting', label: 'Compliance Reporting', icon: 'FileText' },
    { id: 'legal', label: 'Legal Team Dashboard', icon: 'Users' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'gdpr':
        return <GDPRAuditTrailPanel auditTrail={complianceData?.gdprAuditTrail} onGenerate={handleGenerateGDPRAudit} loading={loading} />;
      case 'pcidss':
        return <PCIDSSCompliancePanel status={complianceData?.pciDssStatus} loading={loading} />;
      case 'scheduling':
        return <ComplianceSchedulingPanel scheduledReports={complianceData?.scheduledReports} onSchedule={handleScheduleReport} loading={loading} />;
      case 'workflows':
        return <AutomatedSubmissionWorkflowPanel workflows={complianceData?.submissionWorkflows} onSubmit={handleSubmitWorkflow} loading={loading} />;
      case 'reporting':
        return <ComplianceReportingPanel metrics={complianceData?.legalTeamMetrics} loading={loading} />;
      case 'legal':
        return <LegalTeamDashboardPanel metrics={complianceData?.legalTeamMetrics} loading={loading} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Security Compliance Automation Center - Vottery</title>
        <meta name="description" content="Automated regulatory compliance reporting with GDPR/PCI-DSS audit trail generation, compliance scheduling, and automated submission workflows for legal/regulatory teams" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
                  <Icon name="ShieldCheck" size={36} className="text-blue-600" />
                  Security Compliance Automation Center
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated regulatory compliance reporting with GDPR/PCI-DSS audit trail generation, compliance scheduling, and automated submission workflows
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={refreshData}
                  disabled={refreshing}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Icon name={refreshing ? 'Loader2' : 'RefreshCw'} size={16} className={refreshing ? 'animate-spin' : ''} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
                <div className="text-xs text-muted-foreground">
                  Last updated: {lastUpdated?.toLocaleTimeString()}
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
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab?.id
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span className="hidden sm:inline">{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityComplianceAutomationCenter;