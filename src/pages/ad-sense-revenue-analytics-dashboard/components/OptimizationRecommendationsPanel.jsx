import React from 'react';
import { Lightbulb, TrendingUp, Target, Zap, CheckCircle2 } from 'lucide-react';

const OptimizationRecommendationsPanel = ({ data }) => {
  const recommendations = [
    {
      id: 1,
      priority: 'high',
      title: 'Increase Ad Density on High-Traffic Pages',
      description: 'Admin Dashboard Header shows 92% engagement. Add secondary ad unit below primary metrics for 15-20% revenue increase.',
      impact: '+$2,400/month',
      effort: 'Low',
      status: 'pending',
    },
    {
      id: 2,
      priority: 'high',
      title: 'A/B Test Creator Analytics Sidebar Placement',
      description: 'Test sticky sidebar ad vs. inline placement. Current CTR 0.69% could improve to 0.85% with optimal positioning.',
      impact: '+$1,800/month',
      effort: 'Medium',
      status: 'pending',
    },
    {
      id: 3,
      priority: 'medium',
      title: 'Implement Automated Bid Optimization',
      description: 'Enable Google AdSense auto ads with machine learning optimization for 10-15% revenue uplift without manual intervention.',
      impact: '+$1,500/month',
      effort: 'Low',
      status: 'in_progress',
    },
    {
      id: 4,
      priority: 'medium',
      title: 'Expand to Mobile Admin Interface',
      description: 'Mobile admin usage growing 25% monthly. Add responsive ad units for mobile dashboard views.',
      impact: '+$1,200/month',
      effort: 'High',
      status: 'pending',
    },
    {
      id: 5,
      priority: 'low',
      title: 'Optimize Ad Refresh Rate',
      description: 'Implement 30-second ad refresh on long-session pages (analytics dashboards) for increased impressions.',
      impact: '+$800/month',
      effort: 'Medium',
      status: 'completed',
    },
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Zap className="w-5 h-5 text-yellow-600" />;
      default:
        return <Target className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-4">
          <div className="bg-blue-100 dark:bg-blue-800 rounded-full p-3">
            <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI-Powered Optimization Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Based on 30 days of performance data, implementing these recommendations could increase monthly AdSense revenue by $7,700 (60% uplift).
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">5 active recommendations</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">1 in progress</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">1 completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {recommendations?.map((rec) => (
          <div
            key={rec?.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">{getStatusIcon(rec?.status)}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {rec?.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
                        rec?.priority
                      )}`}
                    >
                      {rec?.priority?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{rec?.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Impact: <span className="font-semibold text-green-600">{rec?.impact}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Effort: <span className="font-semibold">{rec?.effort}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {rec?.status === 'pending' && (
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  Implement Now
                </button>
                <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                  Schedule Later
                </button>
              </div>
            )}
            {rec?.status === 'in_progress' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">In Progress - Expected completion in 3 days</span>
                </div>
              </div>
            )}
            {rec?.status === 'completed' && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">Completed - Revenue increased by {rec?.impact}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptimizationRecommendationsPanel;