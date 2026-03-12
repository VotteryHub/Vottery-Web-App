import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryOptimizationPanel = ({ schedules, reports }) => {
  const optimizationMetrics = [
    {
      label: 'Send-Time Intelligence',
      icon: 'Clock',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      description: 'AI-powered optimal send time based on recipient engagement patterns',
      status: 'Active',
      improvement: '+18% open rate'
    },
    {
      label: 'Recipient Engagement',
      icon: 'Users',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      description: 'Track recipient engagement and adjust delivery frequency',
      status: 'Active',
      improvement: '+24% click-through'
    },
    {
      label: 'Bounce Management',
      icon: 'ShieldAlert',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      description: 'Automatic bounce detection and list hygiene',
      status: 'Active',
      improvement: '99.2% deliverability'
    },
    {
      label: 'Deliverability Scoring',
      icon: 'Target',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      description: 'Real-time deliverability score with actionable recommendations',
      status: 'Active',
      improvement: '98.7 score'
    }
  ];

  const sendTimeRecommendations = [
    { day: 'Monday', time: '9:00 AM', openRate: 45.2, reason: 'High engagement at start of week' },
    { day: 'Tuesday', time: '10:00 AM', openRate: 48.7, reason: 'Peak engagement time' },
    { day: 'Wednesday', time: '2:00 PM', openRate: 42.1, reason: 'Post-lunch engagement' },
    { day: 'Thursday', time: '9:00 AM', openRate: 46.3, reason: 'Consistent morning engagement' },
    { day: 'Friday', time: '11:00 AM', openRate: 38.9, reason: 'Pre-weekend engagement' }
  ];

  const engagementSegments = [
    { segment: 'Highly Engaged', count: 1247, percentage: 42, openRate: 68.3, clickRate: 24.7 },
    { segment: 'Moderately Engaged', count: 987, percentage: 33, openRate: 42.1, clickRate: 12.3 },
    { segment: 'Low Engagement', count: 543, percentage: 18, openRate: 18.7, clickRate: 4.2 },
    { segment: 'Inactive', count: 198, percentage: 7, openRate: 5.3, clickRate: 0.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Optimization Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {optimizationMetrics?.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-start gap-3 mb-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${metric?.bgColor}`}>
                <Icon name={metric?.icon} size={24} className={metric?.color} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-heading font-semibold text-foreground">{metric?.label}</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded text-xs font-medium">
                    {metric?.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{metric?.description}</p>
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={14} className="text-green-600" />
                  <span className="text-sm font-bold text-green-600">{metric?.improvement}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Send-Time Intelligence */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Send-Time Intelligence</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on historical engagement data, these are the optimal send times for maximum open rates:
        </p>
        <div className="space-y-3">
          {sendTimeRecommendations?.map((rec, index) => (
            <div key={index} className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{rec?.day}</h4>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                      {rec?.time}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec?.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-heading font-bold text-foreground font-data">{rec?.openRate}%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Analytics */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recipient Engagement Segmentation</h3>
        <div className="space-y-4">
          {engagementSegments?.map((segment, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-foreground">{segment?.segment}</h4>
                  <span className="text-sm text-muted-foreground">({segment?.count} recipients)</span>
                </div>
                <span className="text-sm font-bold text-foreground font-data">{segment?.percentage}%</span>
              </div>
              <div className="w-full bg-muted/30 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    segment?.percentage >= 40 ? 'bg-green-500' :
                    segment?.percentage >= 25 ? 'bg-blue-500' :
                    segment?.percentage >= 15 ? 'bg-yellow-500': 'bg-red-500'
                  }`}
                  style={{ width: `${segment?.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Open Rate</p>
                  <p className="text-lg font-bold text-foreground font-data">{segment?.openRate}%</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Click Rate</p>
                  <p className="text-lg font-bold text-foreground font-data">{segment?.clickRate}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bounce Management */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Bounce Management & List Hygiene</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Hard Bounces</p>
            <p className="text-3xl font-heading font-bold text-red-600 font-data">23</p>
            <p className="text-xs text-muted-foreground mt-1">Automatically removed</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Soft Bounces</p>
            <p className="text-3xl font-heading font-bold text-yellow-600 font-data">47</p>
            <p className="text-xs text-muted-foreground mt-1">Retry scheduled</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">Spam Reports</p>
            <p className="text-3xl font-heading font-bold text-orange-600 font-data">5</p>
            <p className="text-xs text-muted-foreground mt-1">Unsubscribed</p>
          </div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-1">List Health: Excellent</h4>
              <p className="text-sm text-green-700 dark:text-green-400">
                Your email list is well-maintained with 99.2% deliverability. Continue monitoring bounce rates and engagement metrics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deliverability Score */}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Deliverability Score</h3>
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset="25.12"
                strokeLinecap="round"
                className="text-green-500"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-heading font-bold text-foreground font-data">98.7</p>
              <p className="text-sm text-muted-foreground">Excellent</p>
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-foreground">SPF Record</span>
            </div>
            <span className="text-sm font-bold text-green-600">Configured</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-foreground">DKIM Signature</span>
            </div>
            <span className="text-sm font-bold text-green-600">Verified</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-foreground">DMARC Policy</span>
            </div>
            <span className="text-sm font-bold text-green-600">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-green-600" />
              <span className="text-sm font-medium text-foreground">Sender Reputation</span>
            </div>
            <span className="text-sm font-bold text-green-600">High</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={20} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Optimization Recommendations</h4>
            <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Consider sending compliance reports on Tuesday mornings for 15% higher open rates</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Re-engage inactive recipients with a targeted campaign before removing them</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={14} className="flex-shrink-0 mt-0.5" />
                <span>Test shorter subject lines (under 40 characters) for mobile optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryOptimizationPanel;