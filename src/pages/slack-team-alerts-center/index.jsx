import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { slackIntegrationService } from '../../services/slackIntegrationService';
import { analytics } from '../../hooks/useGoogleAnalytics';

const SlackTeamAlertsCenter = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [testing, setTesting] = useState(false);
  const [notificationLogs, setNotificationLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alertTypes, setAlertTypes] = useState({
    fraud: true,
    revenue: true,
    incident: true,
    milestone: true
  });

  useEffect(() => {
    loadData();
    checkWebhookConfiguration();
  }, []);

  const checkWebhookConfiguration = () => {
    const configuredUrl = import.meta.env?.VITE_SLACK_WEBHOOK_URL;
    if (configuredUrl && configuredUrl !== 'your-slack-webhook-url-here') {
      setIsConfigured(true);
      setWebhookUrl(configuredUrl);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [logsResult, statsResult] = await Promise.all([
        slackIntegrationService?.getNotificationLogs({ limit: 20 }),
        slackIntegrationService?.getNotificationStats()
      ]);

      if (logsResult?.data) {
        setNotificationLogs(logsResult?.data);
      }

      if (statsResult?.data) {
        setStats(statsResult?.data);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    try {
      setTesting(true);
      let result = await slackIntegrationService?.testWebhook(webhookUrl);

      if (result?.success) {
        alert('✅ Test notification sent successfully! Check your Slack channel.');
        analytics?.trackEvent('slack_webhook_tested', {
          success: true
        });
      } else {
        alert('❌ Failed to send test notification. Please check your webhook URL.');
      }
    } catch (error) {
      console.error('Test failed:', error);
      alert('❌ Test failed. Please verify your webhook URL.');
    } finally {
      setTesting(false);
    }
  };

  const handleSendTestAlert = async (type) => {
    try {
      let result;
      switch (type) {
        case 'fraud':
          result = await slackIntegrationService?.sendFraudAlert({
            severity: 'High',
            userId: 'test-user-123',
            detectionType: 'Automated',
            confidenceScore: 95,
            description: 'Test fraud alert - Multiple suspicious votes detected from same IP'
          });
          break;
        case 'revenue':
          result = await slackIntegrationService?.sendRevenueMilestone({
            milestone: '$100,000',
            currentRevenue: '$105,250',
            growthRate: 25,
            period: 'This month',
            message: 'Test revenue milestone - Platform revenue exceeded $100K'
          });
          break;
        case 'incident':
          result = await slackIntegrationService?.sendIncidentEscalation({
            incidentId: 'INC-TEST-001',
            severity: 'Critical',
            category: 'System',
            status: 'Open',
            description: 'Test incident - Database connection timeout detected'
          });
          break;
        default:
          return;
      }

      if (result?.success) {
        alert(`✅ ${type} alert sent successfully!`);
        loadData();
      } else {
        alert(`❌ Failed to send ${type} alert.`);
      }
    } catch (error) {
      console.error('Failed to send test alert:', error);
    }
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      fraud: 'AlertTriangle',
      revenue: 'DollarSign',
      incident: 'AlertCircle',
      milestone: 'Trophy',
      custom: 'Bell'
    };
    return icons?.[type] || 'Bell';
  };

  const getAlertTypeColor = (type) => {
    const colors = {
      fraud: 'text-destructive',
      revenue: 'text-success',
      incident: 'text-warning',
      milestone: 'text-primary',
      custom: 'text-muted-foreground'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Slack Team Alerts - Vottery Admin</title>
      </Helmet>

      <HeaderNavigation />
      <LeftSidebar />

      <div className="ml-0 lg:ml-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Icon name="MessageSquare" className="w-6 h-6 text-success" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Slack Team Alerts</h1>
                <p className="text-muted-foreground">Real-time admin notifications and incident coordination</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Webhook Configuration */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">Webhook Configuration</h2>
                    <p className="text-sm text-muted-foreground">Configure Slack webhook for team notifications</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isConfigured ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {isConfigured ? '✅ Configured' : '⚠️ Not Configured'}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Slack Webhook URL
                    </label>
                    <Input
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e?.target?.value)}
                      placeholder="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
                      disabled={isConfigured}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {isConfigured 
                        ? 'Webhook URL is configured in environment variables'
                        : 'Add your Slack webhook URL to .env file as VITE_SLACK_WEBHOOK_URL'
                      }
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleTestWebhook}
                      disabled={!webhookUrl || testing}
                      variant="outline"
                      className="flex-1"
                    >
                      <Icon name="Send" className="w-4 h-4 mr-2" />
                      {testing ? 'Testing...' : 'Test Connection'}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Alert Types Configuration */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Alert Types</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon name="AlertTriangle" className="w-5 h-5 text-destructive" />
                        <div>
                          <h3 className="font-semibold text-foreground">Fraud Alerts</h3>
                          <p className="text-xs text-muted-foreground">Suspicious activity detection</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendTestAlert('fraud')}
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={!isConfigured}
                    >
                      Send Test Alert
                    </Button>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon name="DollarSign" className="w-5 h-5 text-success" />
                        <div>
                          <h3 className="font-semibold text-foreground">Revenue Milestones</h3>
                          <p className="text-xs text-muted-foreground">Financial achievements</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendTestAlert('revenue')}
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={!isConfigured}
                    >
                      Send Test Alert
                    </Button>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon name="AlertCircle" className="w-5 h-5 text-warning" />
                        <div>
                          <h3 className="font-semibold text-foreground">Incident Escalation</h3>
                          <p className="text-xs text-muted-foreground">Critical system issues</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleSendTestAlert('incident')}
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={!isConfigured}
                    >
                      Send Test Alert
                    </Button>
                  </div>

                  <div className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon name="Trophy" className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-foreground">Platform Milestones</h3>
                          <p className="text-xs text-muted-foreground">User & engagement goals</p>
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled
                    >
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">Recent Notifications</h2>
                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    </div>
                  ) : notificationLogs?.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Icon name="Bell" className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No notifications sent yet</p>
                      <p className="text-sm">Test alerts will appear here</p>
                    </div>
                  ) : (
                    notificationLogs?.map((log) => (
                      <div
                        key={log?.id}
                        className="bg-background border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Icon
                              name={getAlertTypeIcon(log?.alertType)}
                              className={`w-5 h-5 ${getAlertTypeColor(log?.alertType)}`}
                            />
                            <div>
                              <h4 className="font-semibold text-foreground capitalize">
                                {log?.alertType?.replace('_', ' ')} Alert
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {new Date(log?.createdAt)?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs font-medium ${
                            log?.deliveryStatus === 'delivered' ?'bg-success/10 text-success' :'bg-destructive/10 text-destructive'
                          }`}>
                            {log?.deliveryStatus}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Statistics Sidebar */}
            <div className="space-y-6">
              {/* Delivery Stats */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Delivery Statistics</h2>
                {stats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Total Sent</span>
                        <span className="text-2xl font-bold text-foreground">{stats?.total}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Delivered</span>
                        <span className="text-lg font-semibold text-success">{stats?.delivered}</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Failed</span>
                        <span className="text-lg font-semibold text-destructive">{stats?.failed}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Delivery Rate</span>
                        <span className="text-lg font-semibold text-primary">{stats?.deliveryRate}%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <p className="text-sm">No statistics available</p>
                  </div>
                )}
              </div>

              {/* Setup Guide */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Setup Guide</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Create Slack Webhook</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Go to Slack API and create an incoming webhook
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Add to Environment</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add VITE_SLACK_WEBHOOK_URL to your .env file
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Test Connection</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Use the test button to verify setup
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlackTeamAlertsCenter;