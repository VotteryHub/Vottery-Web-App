import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { analytics } from '../../../hooks/useGoogleAnalytics';

const MilestoneAlertsPanel = ({ campaignData }) => {
  const [processing, setProcessing] = useState(null);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  // Generate milestone alerts based on campaign performance
  const generateMilestoneAlerts = () => {
    const alerts = [];

    // Engagement target alerts
    if (campaignData?.liveMetrics?.voteParticipation >= 5000) {
      alerts?.push({
        id: 'engagement-5k',
        type: 'engagement',
        severity: 'success',
        title: '🎉 5,000 Participants Milestone Reached!',
        description: 'Your campaign has achieved 5,000 participants. Consider increasing budget to maintain momentum.',
        metric: campaignData?.liveMetrics?.voteParticipation,
        threshold: 5000,
        optimizationActions: [
          { id: 'increase-budget', label: 'Increase Budget by 20%', icon: 'TrendingUp' },
          { id: 'expand-zones', label: 'Expand to 2 More Zones', icon: 'Globe' }
        ]
      });
    }

    if (campaignData?.liveMetrics?.voteParticipation >= 10000) {
      alerts?.push({
        id: 'engagement-10k',
        type: 'engagement',
        severity: 'success',
        title: '🚀 10,000 Participants Milestone!',
        description: 'Exceptional performance! Your campaign has reached 10,000 participants.',
        metric: campaignData?.liveMetrics?.voteParticipation,
        threshold: 10000,
        optimizationActions: [
          { id: 'premium-placement', label: 'Upgrade to Premium Placement', icon: 'Star' },
          { id: 'extend-duration', label: 'Extend Campaign by 7 Days', icon: 'Calendar' }
        ]
      });
    }

    // Revenue threshold alerts
    const estimatedRevenue = (campaignData?.liveMetrics?.voteParticipation || 0) * (campaignData?.liveMetrics?.costPerEngagement || 0);
    
    if (estimatedRevenue >= 50000) {
      alerts?.push({
        id: 'revenue-50k',
        type: 'revenue',
        severity: 'success',
        title: '💰 $50,000 Revenue Threshold Achieved!',
        description: `Your campaign has generated $${estimatedRevenue?.toLocaleString()} in engagement value.`,
        metric: estimatedRevenue,
        threshold: 50000,
        optimizationActions: [
          { id: 'duplicate-campaign', label: 'Duplicate High-Performing Campaign', icon: 'Copy' },
          { id: 'ab-test', label: 'Launch A/B Test Variant', icon: 'GitBranch' }
        ]
      });
    }

    // Conversion rate alerts
    if ((campaignData?.conversion?.conversionRate || 0) >= 15) {
      alerts?.push({
        id: 'conversion-15',
        type: 'conversion',
        severity: 'success',
        title: '🎯 15% Conversion Rate Milestone!',
        description: `Outstanding conversion rate of ${campaignData?.conversion?.conversionRate}%. Your targeting is highly effective.`,
        metric: campaignData?.conversion?.conversionRate,
        threshold: 15,
        optimizationActions: [
          { id: 'scale-budget', label: 'Scale Budget by 50%', icon: 'ArrowUp' },
          { id: 'similar-audience', label: 'Target Similar Audiences', icon: 'Users' }
        ]
      });
    }

    // CTR performance alerts
    const avgCTR = 4.5; // Mock average CTR
    if (avgCTR >= 5.0) {
      alerts?.push({
        id: 'ctr-5',
        type: 'engagement',
        severity: 'success',
        title: '📈 5% CTR Milestone Achieved!',
        description: `Your campaign CTR of ${avgCTR}% exceeds industry benchmarks by 25%.`,
        metric: avgCTR,
        threshold: 5.0,
        optimizationActions: [
          { id: 'save-creative', label: 'Save Creative as Template', icon: 'Bookmark' },
          { id: 'increase-frequency', label: 'Increase Ad Frequency', icon: 'Repeat' }
        ]
      });
    }

    // Filter out dismissed alerts
    return alerts?.filter(alert => !dismissedAlerts?.includes(alert?.id));
  };

  const milestoneAlerts = generateMilestoneAlerts();

  const handleOptimizationAction = async (alertId, actionId, actionLabel) => {
    try {
      setProcessing(`${alertId}-${actionId}`);
      
      // Track optimization action
      analytics?.trackEvent('milestone_optimization_action', {
        alert_id: alertId,
        action_id: actionId,
        action_label: actionLabel,
        timestamp: new Date()?.toISOString()
      });

      // Simulate action processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success feedback
      alert(`✓ ${actionLabel} action initiated successfully!`);
      
    } catch (error) {
      console.error('Failed to execute optimization action:', error);
      alert('Failed to execute action. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  const handleDismissAlert = (alertId) => {
    setDismissedAlerts(prev => [...prev, alertId]);
    
    analytics?.trackEvent('milestone_alert_dismissed', {
      alert_id: alertId,
      timestamp: new Date()?.toISOString()
    });
  };

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'success':
        return 'border-success/30 bg-success/5';
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      case 'info':
        return 'border-primary/30 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getSeverityIconColor = (severity) => {
    switch (severity) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-primary';
      default:
        return 'text-foreground';
    }
  };

  if (milestoneAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="Award" size={24} className="text-primary" />
          <h2 className="text-xl font-heading font-bold text-foreground">
            Performance Milestone Alerts
          </h2>
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {milestoneAlerts?.length} Active
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {milestoneAlerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`card p-5 border-2 ${getSeverityStyles(alert?.severity)} transition-all duration-250`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full ${alert?.severity === 'success' ? 'bg-success/10' : 'bg-primary/10'} flex items-center justify-center flex-shrink-0`}>
                <Icon 
                  name={alert?.type === 'revenue' ? 'DollarSign' : alert?.type === 'conversion' ? 'Target' : 'TrendingUp'} 
                  size={24} 
                  className={getSeverityIconColor(alert?.severity)} 
                />
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {alert?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {alert?.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    iconName="X"
                    onClick={() => handleDismissAlert(alert?.id)}
                    className="text-muted-foreground hover:text-foreground"
                  />
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm">
                  <span className="px-2 py-1 rounded bg-background/50 text-foreground font-medium">
                    Current: {typeof alert?.metric === 'number' && alert?.metric > 100 
                      ? alert?.metric?.toLocaleString() 
                      : alert?.metric}
                  </span>
                  <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
                  <span className="px-2 py-1 rounded bg-background/50 text-muted-foreground">
                    Threshold: {typeof alert?.threshold === 'number' && alert?.threshold > 100 
                      ? alert?.threshold?.toLocaleString() 
                      : alert?.threshold}
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    1-Click Optimization Actions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {alert?.optimizationActions?.map((action) => (
                      <Button
                        key={action?.id}
                        variant="outline"
                        size="sm"
                        iconName={action?.icon}
                        onClick={() => handleOptimizationAction(alert?.id, action?.id, action?.label)}
                        disabled={processing === `${alert?.id}-${action?.id}`}
                        className="border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all duration-250"
                      >
                        {processing === `${alert?.id}-${action?.id}` ? (
                          <>
                            <Icon name="Loader" size={14} className="animate-spin" />
                            Processing...
                          </>
                        ) : (
                          action?.label
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneAlertsPanel;