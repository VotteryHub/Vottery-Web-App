import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import RegulatoryFilingsPanel from './components/RegulatoryFilingsPanel';
import PolicyViolationsPanel from './components/PolicyViolationsPanel';
import JurisdictionTrackingPanel from './components/JurisdictionTrackingPanel';
import ComplianceAuditTrailPanel from './components/ComplianceAuditTrailPanel';
import ComplianceOverviewPanel from './components/ComplianceOverviewPanel';
import { complianceService } from '../../services/complianceService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const ComplianceDashboard = () => {
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
    analytics?.trackEvent('compliance_dashboard_viewed', {
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
        complianceService?.getComplianceAuditTrail({ limit: 50 })
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'filings', label: 'Regulatory Filings', icon: 'FileText' },
    { id: 'violations', label: 'Policy Violations', icon: 'AlertTriangle' },
    { id: 'jurisdictions', label: 'Multi-Jurisdiction', icon: 'Globe' },
    { id: 'audit', label: 'Audit Trail', icon: 'Shield' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <ComplianceOverviewPanel statistics={complianceData?.statistics} onRefresh={refreshData} />;
      case 'filings':
        return <RegulatoryFilingsPanel filings={complianceData?.filings} onRefresh={refreshData} />;
      case 'violations':
        return <PolicyViolationsPanel violations={complianceData?.violations} onRefresh={refreshData} />;
      case 'jurisdictions':
        return <JurisdictionTrackingPanel jurisdictions={complianceData?.jurisdictions} onRefresh={refreshData} />;
      case 'audit':
        return <ComplianceAuditTrailPanel auditTrail={complianceData?.auditTrail} onRefresh={refreshData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Compliance Dashboard - Regulatory Filing & Audit Management</title>
        <meta name="description" content="Automated regulatory filing generation with audit trails, multi-jurisdiction compliance tracking, and policy violation reports for advertisers" />
      </Helmet>

      <HeaderNavigation />

      <main className="container mx-auto px-4 py-6 mt-14">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                Compliance Dashboard
              </h1>
              <p className="text-muted-foreground">
                Automated regulatory filing generation with audit trails, multi-jurisdiction compliance tracking, and policy violation reports
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">
                Last updated: {lastUpdated?.toLocaleTimeString()}
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

        <div className="bg-card rounded-lg border border-border mb-6">
          <div className="flex items-center gap-2 p-2 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => {
                  setActiveTab(tab?.id);
                  analytics?.trackEvent('compliance_tab_changed', { tab: tab?.id });
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="text-sm font-medium">{tab?.label}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading compliance data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {renderTabContent()}
          </div>
        )}
      </main>
    </div>
  );
};

export default ComplianceDashboard;