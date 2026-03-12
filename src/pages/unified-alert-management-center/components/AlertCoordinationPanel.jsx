import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { alertService } from '../../../services/alertService';
import { smsAlertService } from '../../../services/smsAlertService';
import { analytics } from '../../../hooks/useGoogleAnalytics';

const AlertCoordinationPanel = ({ alerts, statistics, onRefresh }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [processing, setProcessing] = useState(null);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'fraud_detection', label: 'SMS Fraud Alerts' },
    { value: 'payment', label: 'Payment Confirmations' },
    { value: 'milestone', label: 'Milestone Triggers' },
    { value: 'compliance', label: 'Compliance Notifications' }
  ];

  const alertTypes = [
    {
      id: 'fraud_detection',
      label: 'SMS Fraud Alerts',
      icon: 'ShieldAlert',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      description: 'Real-time fraud detection with SMS escalation',
      count: alerts?.filter(a => a?.category === 'fraud_detection')?.length || 0
    },
    {
      id: 'payment',
      label: 'Payment Confirmations',
      icon: 'CreditCard',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Automated payment confirmation notifications',
      count: alerts?.filter(a => a?.metadata?.type === 'payment')?.length || 0
    },
    {
      id: 'milestone',
      label: 'Milestone Triggers',
      icon: 'Target',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'Campaign milestone achievement alerts',
      count: alerts?.filter(a => a?.metadata?.type === 'milestone')?.length || 0
    },
    {
      id: 'compliance',
      label: 'Compliance Notifications',
      icon: 'FileCheck',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Regulatory compliance alert distribution',
      count: alerts?.filter(a => a?.category === 'policy_violation' || a?.category === 'security_event')?.length || 0
    }
  ];

  const filteredAlerts = selectedCategory === 'all' 
    ? alerts 
    : alerts?.filter(a => {
        if (selectedCategory === 'fraud_detection') return a?.category === 'fraud_detection';
        if (selectedCategory === 'payment') return a?.metadata?.type === 'payment';
        if (selectedCategory === 'milestone') return a?.metadata?.type === 'milestone';
        if (selectedCategory === 'compliance') return a?.category === 'policy_violation' || a?.category === 'security_event';
        return true;
      });

  const handleSendSMSAlert = async (alert) => {
    try {
      setProcessing(alert?.id);
      
      // Format phone numbers (in production, get from admin settings)
      const adminPhones = ['+1234567890']; // Placeholder
      
      const result = await smsAlertService?.sendCriticalFraudAlert({
        id: alert?.id,
        title: alert?.title,
        severity: alert?.severity,
        message: alert?.description,
        metadata: alert?.metadata
      }, adminPhones);

      if (result?.error) throw new Error(result?.error?.message);

      analytics?.trackEvent('sms_alert_sent', {
        alert_id: alert?.id,
        severity: alert?.severity,
        category: alert?.category
      });

      await onRefresh();
    } catch (error) {
      console.error('Failed to send SMS alert:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleAcknowledge = async (alertId) => {
    try {
      setProcessing(alertId);
      const { error } = await alertService?.acknowledgeAlert(alertId);
      if (error) throw new Error(error?.message);
      await onRefresh();
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {alertTypes?.map((type) => (
          <div key={type?.id} className="card hover:shadow-lg transition-shadow">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${type?.bgColor}`}>
              <Icon name={type?.icon} size={24} className={type?.color} />
            </div>
            <h3 className="font-heading font-semibold text-foreground mb-1">{type?.label}</h3>
            <p className="text-xs text-muted-foreground mb-3">{type?.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-heading font-bold text-foreground font-data">{type?.count}</span>
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Routing Rules */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Automated Routing Rules</h3>
        <div className="space-y-3">
          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="ShieldAlert" size={18} className="text-red-600" />
                  <h4 className="font-semibold text-foreground">Critical Fraud Detection</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Severity: Critical | Confidence: &gt;90%
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                    <Icon name="MessageSquare" size={12} className="inline mr-1" />
                    SMS
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                    <Icon name="Mail" size={12} className="inline mr-1" />
                    Email
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                    <Icon name="Bell" size={12} className="inline mr-1" />
                    In-App
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="CreditCard" size={18} className="text-green-600" />
                  <h4 className="font-semibold text-foreground">Payment Confirmations</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  All payment transactions &gt; $100
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                    <Icon name="Mail" size={12} className="inline mr-1" />
                    Email
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                    <Icon name="MessageSquare" size={12} className="inline mr-1" />
                    SMS
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="Target" size={18} className="text-blue-600" />
                  <h4 className="font-semibold text-foreground">Campaign Milestones</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Engagement targets &amp; revenue thresholds
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded text-xs font-medium">
                    <Icon name="Bell" size={12} className="inline mr-1" />
                    In-App
                  </span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium">
                    <Icon name="Mail" size={12} className="inline mr-1" />
                    Email
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Alert Feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">Live Alert Feed</h3>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e?.target?.value)}
            options={categoryOptions}
          />
        </div>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredAlerts?.slice(0, 20)?.map((alert) => (
            <div key={alert?.id} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      alert?.severity === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      alert?.severity === 'high'? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {alert?.severity?.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert?.createdAt)?.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{alert?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{alert?.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize">
                      {alert?.category?.replace(/_/g, ' ')}
                    </span>
                    {alert?.metadata?.type && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {alert?.metadata?.type}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {alert?.status === 'active' && (
                    <>
                      {alert?.severity === 'critical' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          iconName="MessageSquare"
                          onClick={() => handleSendSMSAlert(alert)}
                          disabled={processing === alert?.id}
                        >
                          Send SMS
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        iconName="Check"
                        onClick={() => handleAcknowledge(alert?.id)}
                        disabled={processing === alert?.id}
                      >
                        Acknowledge
                      </Button>
                    </>
                  )}
                  <span className={`px-2 py-1 rounded text-xs font-medium text-center ${
                    alert?.status === 'active' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    alert?.status === 'acknowledged'? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>
                    {alert?.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlertCoordinationPanel;