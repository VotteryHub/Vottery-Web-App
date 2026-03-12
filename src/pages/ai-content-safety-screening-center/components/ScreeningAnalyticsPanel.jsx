import React from 'react';
import Icon from '../../../components/AppIcon';

const ScreeningAnalyticsPanel = ({ statistics, queue, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const violationsByCategory = [
    { category: 'Misinformation', count: 45, percentage: 35, color: 'bg-blue-500' },
    { category: 'Spam', count: 67, percentage: 28, color: 'bg-yellow-500' },
    { category: 'Policy Violation', count: 89, percentage: 22, color: 'bg-red-500' },
    { category: 'Hate Speech', count: 12, percentage: 10, color: 'bg-purple-500' },
    { category: 'Election Interference', count: 21, percentage: 5, color: 'bg-orange-500' }
  ];

  const processingTrends = [
    { time: '00:00', processed: 120, flagged: 8 },
    { time: '04:00', processed: 95, flagged: 5 },
    { time: '08:00', processed: 340, flagged: 23 },
    { time: '12:00', processed: 520, flagged: 35 },
    { time: '16:00', processed: 680, flagged: 42 },
    { time: '20:00', processed: 450, flagged: 28 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="PieChart" size={20} />
            Violations by Category
          </h3>
          <div className="space-y-3">
            {violationsByCategory?.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground">{item?.category}</span>
                  <span className="text-sm font-medium text-foreground">{item?.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`${item?.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item?.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Activity" size={20} />
            Processing Trends (24h)
          </h3>
          <div className="space-y-4">
            {processingTrends?.map((trend, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-12">{trend?.time}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(trend?.processed / 700) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-foreground w-12 text-right">{trend?.processed}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${(trend?.flagged / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-red-500 w-12 text-right">{trend?.flagged}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-muted-foreground">Processed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-muted-foreground">Flagged</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">{statistics?.averageConfidence || 0}%</div>
            <div className="text-sm text-muted-foreground">Avg Confidence</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">1.2s</div>
            <div className="text-sm text-muted-foreground">Avg Processing Time</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">1,247</div>
            <div className="text-sm text-muted-foreground">Items/Hour</div>
          </div>
          <div className="p-4 border border-border rounded-lg">
            <div className="text-2xl font-bold text-foreground mb-1">96.8%</div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" size={20} />
          Recent High-Confidence Detections
        </h3>
        <div className="space-y-3">
          {queue?.slice(0, 5)?.filter(item => parseFloat(item?.aiConfidenceScore) >= 85)?.map((item) => (
            <div key={item?.id} className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <Icon name="AlertTriangle" className="text-red-500 mt-1" size={16} />
              <div className="flex-1">
                <p className="text-sm text-foreground line-clamp-1">{item?.contentText}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Confidence: {item?.aiConfidenceScore}%</span>
                  <span>{item?.contentType?.replace('_', ' ')}</span>
                  <span>{new Date(item?.createdAt)?.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreeningAnalyticsPanel;