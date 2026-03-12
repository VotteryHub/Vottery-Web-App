import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ComplianceOverviewPanel from './components/ComplianceOverviewPanel';
import AuditReportsPanel from './components/AuditReportsPanel';
import RegulatorySubmissionsPanel from './components/RegulatorySubmissionsPanel';
import AuditTrailPanel from './components/AuditTrailPanel';
import JurisdictionStatusPanel from './components/JurisdictionStatusPanel';
import ExportPanel from './components/ExportPanel';
import { complianceService } from '../../services/complianceService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const ComplianceAuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [complianceData, setComplianceData] = useState({
    statistics: null,
    filings: [],
    violations: [],
    jurisdictions: [],
    auditTrail: []
  });

  useEffect(() => {
    loadComplianceData();
    analytics?.trackEvent('compliance_audit_dashboard_viewed', {
      active_tab: activeTab
    });

    const interval = setInterval(() => {
      refreshData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadComplianceData = async () => {
    setLoading(true);
    try {
      const [statsResult, filingsResult, violationsResult, jurisdictionsResult, auditResult] = await Promise.all([
        complianceService?.getComplianceStatistics('30d'),
        complianceService?.getRegulatoryFilings({ timeRange: 'month' }),
        complianceService?.getPolicyViolations({ status: 'all' }),
        complianceService?.getJurisdictionCompliance({}),
        complianceService?.getComplianceAuditTrail({ limit: 100 })
      ]);

      setComplianceData({
        statistics: statsResult?.data,
        filings: filingsResult?.data || [],
        violations: violationsResult?.data || [],
        jurisdictions: jurisdictionsResult?.data || [],
        auditTrail: auditResult?.data || []
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

  const handleExport = async (format, dataType) => {
    try {
      analytics?.trackEvent('compliance_data_exported', {
        format,
        data_type: dataType
      });
      // Export logic here
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'reports', label: 'Audit Reports', icon: 'FileText' },
    { id: 'submissions', label: 'Regulatory Submissions', icon: 'Send' },
    { id: 'trail', label: 'Audit Trail', icon: 'Shield' },
    { id: 'jurisdictions', label: 'Jurisdiction Status', icon: 'Globe' },
    { id: 'export', label: 'Export Data', icon: 'Download' }
  ];

  return (
    <>
      <Helmet>
        <title>Compliance Audit Dashboard - Vottery</title>
        <meta name="description" content="Comprehensive compliance audit dashboard with automated reports, regulatory submissions, audit trails, and jurisdiction-specific filing status with export capabilities." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[1600px] mx-auto px-4 py-6 md:py-8 mt-14">
          <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Compliance Audit Dashboard
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Automated compliance reports, regulatory submissions, and audit trails with export capabilities
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card border border-border">
                  <div className={`w-2 h-2 rounded-full ${refreshing ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                  <span className="text-xs text-muted-foreground">
                    {refreshing ? 'Updating...' : `Updated ${lastUpdated?.toLocaleTimeString()}`}
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
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading compliance data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {activeTab === 'overview' && (
                <ComplianceOverviewPanel statistics={complianceData?.statistics} onRefresh={refreshData} />
              )}
              {activeTab === 'reports' && (
                <AuditReportsPanel filings={complianceData?.filings} violations={complianceData?.violations} />
              )}
              {activeTab === 'submissions' && (
                <RegulatorySubmissionsPanel filings={complianceData?.filings} onRefresh={loadComplianceData} />
              )}
              {activeTab === 'trail' && (
                <AuditTrailPanel auditTrail={complianceData?.auditTrail} />
              )}
              {activeTab === 'jurisdictions' && (
                <JurisdictionStatusPanel jurisdictions={complianceData?.jurisdictions} />
              )}
              {activeTab === 'export' && (
                <ExportPanel 
                  complianceData={complianceData} 
                  onExport={handleExport}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default ComplianceAuditDashboard;