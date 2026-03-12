import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveDrillDownPanel = ({ timeframe }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [drillDownLevel, setDrillDownLevel] = useState(1);

  const topLevelMetrics = [
    { id: 'engagement', label: 'Total Engagement', value: '78.5%', change: '+12.3%', icon: 'Activity' },
    { id: 'revenue', label: 'Platform Revenue', value: '$892K', change: '+18.7%', icon: 'DollarSign' },
    { id: 'users', label: 'Active Users', value: '125K', change: '+25.4%', icon: 'Users' },
    { id: 'elections', label: 'Live Elections', value: '4,567', change: '+15.2%', icon: 'Vote' }
  ];

  const drillDownData = {
    engagement: {
      level2: [
        { category: 'Voting Activity', value: '82%', breakdown: ['Ranked Choice: 89%', 'Plurality: 78%', 'Approval: 85%', 'Plus/Minus: 76%'] },
        { category: 'Social Interactions', value: '75%', breakdown: ['Comments: 68%', 'Shares: 82%', 'Reactions: 79%', 'Follows: 71%'] },
        { category: 'Content Creation', value: '68%', breakdown: ['Elections Created: 72%', 'Posts Published: 65%', 'Media Uploads: 67%'] }
      ]
    },
    revenue: {
      level2: [
        { category: 'Participation Fees', value: '$456K', breakdown: ['Zone 1-4: $125K', 'Zone 5-6: $198K', 'Zone 7-8: $133K'] },
        { category: 'Creator Earnings', value: '$298K', breakdown: ['Prize Pools: $234K', 'Sponsorships: $64K'] },
        { category: 'Ad Revenue', value: '$138K', breakdown: ['Display Ads: $89K', 'Sponsored Elections: $49K'] }
      ]
    },
    users: {
      level2: [
        { category: 'New Users', value: '28K', breakdown: ['Organic: 18K', 'Referrals: 7K', 'Paid: 3K'] },
        { category: 'Returning Users', value: '97K', breakdown: ['Daily Active: 45K', 'Weekly Active: 32K', 'Monthly Active: 20K'] }
      ]
    },
    elections: {
      level2: [
        { category: 'By Category', value: '4,567', breakdown: ['Entertainment: 1,234', 'Sports: 987', 'Politics: 765', 'Technology: 654', 'Lifestyle: 927'] },
        { category: 'By Status', value: '4,567', breakdown: ['Active: 2,345', 'Pending: 1,234', 'Completed: 988'] },
        { category: 'By Type', value: '4,567', breakdown: ['Standard: 3,456', 'Sponsored: 789', 'Community: 322'] }
      ]
    }
  };

  const handleMetricClick = (metricId) => {
    setSelectedMetric(metricId);
    setDrillDownLevel(2);
  };

  const handleReset = () => {
    setSelectedMetric(null);
    setDrillDownLevel(1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Icon name="Search" size={24} className="text-primary" />
              Interactive Drill-Down Capabilities
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Click on any metric to explore granular analysis and detailed breakdowns
            </p>
          </div>
          {selectedMetric && (
            <Button onClick={handleReset} variant="outline">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Overview
            </Button>
          )}
        </div>

        {drillDownLevel === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topLevelMetrics?.map((metric) => (
              <button
                key={metric?.id}
                onClick={() => handleMetricClick(metric?.id)}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 text-left hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-primary"
              >
                <div className="flex items-center justify-between mb-4">
                  <Icon name={metric?.icon} size={32} className="text-primary" />
                  <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full">
                    <Icon name="TrendingUp" size={12} className="text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {metric?.change}
                    </span>
                  </div>
                </div>
                <div className="text-3xl font-bold text-foreground mb-1">{metric?.value}</div>
                <div className="text-sm text-muted-foreground">{metric?.label}</div>
                <div className="flex items-center gap-2 mt-4 text-primary">
                  <span className="text-xs font-medium">Click to drill down</span>
                  <Icon name="ChevronRight" size={14} />
                </div>
              </button>
            ))}
          </div>
        )}

        {drillDownLevel === 2 && selectedMetric && drillDownData?.[selectedMetric] && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Icon name="Layers" size={20} className="text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Level 2: Detailed Breakdown for {topLevelMetrics?.find(m => m?.id === selectedMetric)?.label}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {drillDownData?.[selectedMetric]?.level2?.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-foreground">{item?.category}</h3>
                    <span className="text-xl font-bold text-primary">{item?.value}</span>
                  </div>
                  <div className="space-y-2">
                    {item?.breakdown?.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{detail?.split(':')?.[0]}</span>
                        <span className="font-medium text-foreground">{detail?.split(':')?.[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="FileText" size={24} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">
            Exportable Strategic Reports
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4 text-left hover:shadow-lg transition-all duration-200">
            <Icon name="Download" size={24} className="text-green-600 dark:text-green-400 mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-2">Executive Summary</h3>
            <p className="text-sm text-muted-foreground mb-3">High-level overview with key metrics and trends</p>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <span className="text-xs font-medium">Export PDF</span>
              <Icon name="ChevronRight" size={14} />
            </div>
          </button>

          <button className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4 text-left hover:shadow-lg transition-all duration-200">
            <Icon name="Download" size={24} className="text-blue-600 dark:text-blue-400 mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-2">Detailed Analytics</h3>
            <p className="text-sm text-muted-foreground mb-3">Complete data with all drill-down levels</p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="text-xs font-medium">Export Excel</span>
              <Icon name="ChevronRight" size={14} />
            </div>
          </button>

          <button className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-4 text-left hover:shadow-lg transition-all duration-200">
            <Icon name="Download" size={24} className="text-purple-600 dark:text-purple-400 mb-3" />
            <h3 className="text-base font-semibold text-foreground mb-2">Forecast Report</h3>
            <p className="text-sm text-muted-foreground mb-3">Predictive insights and recommendations</p>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <span className="text-xs font-medium">Export PDF</span>
              <Icon name="ChevronRight" size={14} />
            </div>
          </button>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Icon name="Zap" size={24} />
          <h3 className="text-xl font-bold">Forecasting Accuracy Tracking</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">92.4%</div>
            <div className="text-sm text-blue-100">Overall Accuracy</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">8,945</div>
            <div className="text-sm text-blue-100">Predictions Made</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">7,234</div>
            <div className="text-sm text-blue-100">Outcomes Validated</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">+3.2%</div>
            <div className="text-sm text-blue-100">Improvement (30d)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveDrillDownPanel;