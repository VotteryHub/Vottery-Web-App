import React from 'react';
import Icon from '../../../components/AppIcon';

const PerformanceMetricsPanel = ({ feedRankings }) => {
  const calculateMetrics = () => {
    if (!feedRankings || feedRankings?.length === 0) {
      return {
        avgScore: 0,
        maxScore: 0,
        minScore: 0,
        diversity: 0,
        freshness: 0
      };
    }

    const scores = feedRankings?.map((r) => r?.rankingScore || 0);
    const avgScore = scores?.reduce((sum, s) => sum + s, 0) / scores?.length;
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);

    // Calculate diversity (unique content types)
    const uniqueTypes = new Set(feedRankings?.map((r) => r?.contentItemType))?.size;
    const diversity = uniqueTypes / 3; // 3 possible types

    // Calculate freshness (based on generated_at timestamps)
    const now = Date.now();
    const avgAge = feedRankings?.reduce((sum, r) => {
      const generatedAt = new Date(r?.generatedAt || r?.generated_at)?.getTime();
      return sum + (now - generatedAt);
    }, 0) / feedRankings?.length;
    const freshness = Math.max(0, 1 - avgAge / (15 * 60 * 1000)); // 15 minutes max age

    return {
      avgScore,
      maxScore,
      minScore,
      diversity,
      freshness
    };
  };

  const metrics = calculateMetrics();

  const metricCards = [
    {
      label: 'Average Score',
      value: metrics?.avgScore?.toFixed(3),
      icon: 'TrendingUp',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Max Score',
      value: metrics?.maxScore?.toFixed(3),
      icon: 'ArrowUp',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Min Score',
      value: metrics?.minScore?.toFixed(3),
      icon: 'ArrowDown',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Diversity',
      value: `${(metrics?.diversity * 100)?.toFixed(0)}%`,
      icon: 'Shuffle',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Freshness',
      value: `${(metrics?.freshness * 100)?.toFixed(0)}%`,
      icon: 'Clock',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10'
    },
    {
      label: 'Total Items',
      value: feedRankings?.length || 0,
      icon: 'List',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-500/10'
    }
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
          <Icon name="Activity" size={20} className="text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-lg font-heading font-bold text-foreground">Performance Metrics</h2>
          <p className="text-sm text-muted-foreground">Ranking algorithm effectiveness</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metricCards?.map((metric) => (
          <div key={metric?.label} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 ${metric?.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon name={metric?.icon} size={16} className={metric?.color} />
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">{metric?.value}</div>
            <div className="text-xs text-muted-foreground">{metric?.label}</div>
          </div>
        ))}
      </div>

      {/* Score Distribution */}
      {feedRankings?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-foreground mb-3">Score Distribution</h3>
          <div className="space-y-2">
            {['High (0.7-1.0)', 'Medium (0.4-0.7)', 'Low (0.0-0.4)']?.map((range, index) => {
              const [label, bounds] = range?.split(' ');
              const [min, max] = bounds?.replace(/[()]/g, '')?.split('-')?.map(parseFloat);
              const count = feedRankings?.filter(
                (r) => r?.rankingScore >= min && r?.rankingScore < max
              )?.length;
              const percentage = (count / feedRankings?.length) * 100;

              return (
                <div key={range}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{range}</span>
                    <span className="text-sm text-muted-foreground">
                      {count} ({percentage?.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${
                        index === 0
                          ? 'bg-green-500'
                          : index === 1
                          ? 'bg-yellow-500' :'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {feedRankings?.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Icon name="BarChart" size={48} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No metrics available. Generate rankings to see performance data.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetricsPanel;