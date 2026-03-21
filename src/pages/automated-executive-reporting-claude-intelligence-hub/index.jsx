import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { executiveReportingService } from '../../services/executiveReportingService';

const AutomatedExecutiveReportingClaudeIntelligenceHub = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [reportType, setReportType] = useState('monthly');
  const [data, setData] = useState({
    reports: [],
    stakeholderGroups: [],
    deliveryStats: null,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [reportsResult, groupsResult, statsResult] = await Promise.all([
        executiveReportingService.getExecutiveReports({}),
        executiveReportingService.getStakeholderGroups(),
        executiveReportingService.getDeliveryStatistics('30d'),
      ]);
      setData({
        reports: reportsResult?.data || [],
        stakeholderGroups: groupsResult?.data || [],
        deliveryStats: statsResult?.data || null,
      });
    } catch (error) {
      console.error('Failed loading automated executive reporting data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const sendAutomatedReport = async () => {
    if (!data.stakeholderGroups?.length) return;
    try {
      setSending(true);
      const latestReport = data.reports?.[0];
      let reportId = latestReport?.id;
      if (!reportId) {
        const createResult = await executiveReportingService.createExecutiveReport({
          reportType,
          title: `${reportType} automated intelligence brief`,
          status: 'pending',
          reportData: { source: 'claude_intelligence', generatedAt: new Date().toISOString() },
        });
        reportId = createResult?.data?.id;
      }
      if (!reportId) return;
      await executiveReportingService.sendReportViaResend(
        reportId,
        data.stakeholderGroups[0].id,
      );
      await loadData();
    } catch (error) {
      console.error('Failed sending automated executive report:', error);
    } finally {
      setSending(false);
    }
  };

  const stats = data.deliveryStats || {
    totalDeliveries: 0,
    successfulDeliveries: 0,
    failedDeliveries: 0,
    deliveryRate: 0,
  };

  return (
    <>
      <Helmet>
        <title>Automated Executive Reporting & Claude Intelligence Hub - Vottery</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-6xl mx-auto px-4 py-6 md:py-8 mt-14">
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                Automated Executive Reporting & Claude Intelligence Hub
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-authored executive brief generation with automated delivery and live performance analytics.
              </p>
            </div>
            <Button
              variant="outline"
              iconName={loading ? 'Loader' : 'RefreshCw'}
              onClick={loadData}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
              <p className="text-2xl font-bold text-foreground">{stats.totalDeliveries}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Successful</p>
              <p className="text-2xl font-bold text-green-600">{stats.successfulDeliveries}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failedDeliveries}</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground">Delivery Rate</p>
              <p className="text-2xl font-bold text-blue-600">{stats.deliveryRate}%</p>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" size={18} />
              <h2 className="text-lg font-semibold text-foreground">Claude Intelligence Brief</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Claude-generated narrative combines delivery reliability, anomaly highlights, and
              strategic recommendations for executive review.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
              <div className="text-xs text-muted-foreground flex items-center">
                Stakeholder groups: {data.stakeholderGroups?.length || 0}
              </div>
              <Button
                variant="primary"
                iconName={sending ? 'Loader' : 'Send'}
                onClick={sendAutomatedReport}
                disabled={sending || !data.stakeholderGroups?.length}
              >
                {sending ? 'Sending...' : 'Generate & Deliver'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AutomatedExecutiveReportingClaudeIntelligenceHub;