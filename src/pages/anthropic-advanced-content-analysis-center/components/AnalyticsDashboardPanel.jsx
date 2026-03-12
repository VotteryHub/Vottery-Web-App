import React from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnalyticsDashboardPanel = ({ screeningStats, modelPerformance, recentAnalyses }) => {
  const mockTrendData = [
    { date: 'Mon', approved: 145, flagged: 23, blocked: 8 },
    { date: 'Tue', approved: 158, flagged: 19, blocked: 12 },
    { date: 'Wed', approved: 162, flagged: 27, blocked: 9 },
    { date: 'Thu', approved: 149, flagged: 21, blocked: 15 },
    { date: 'Fri', approved: 171, flagged: 18, blocked: 7 },
    { date: 'Sat', approved: 134, flagged: 25, blocked: 11 },
    { date: 'Sun', approved: 128, flagged: 22, blocked: 10 }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Analytics Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Comprehensive analysis performance and model accuracy metrics
          </p>
        </div>
        <Icon name="BarChart" size={24} className="text-primary" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={18} className="text-primary" />
            <span className="text-sm text-muted-foreground">Accuracy</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {modelPerformance?.accuracyRate || 0}%
          </p>
        </div>

        <div className="p-4 rounded-lg bg-success/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="CheckCircle" size={18} className="text-success" />
            <span className="text-sm text-muted-foreground">Precision</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {modelPerformance?.precisionRate || 0}%
          </p>
        </div>

        <div className="p-4 rounded-lg bg-warning/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Activity" size={18} className="text-warning" />
            <span className="text-sm text-muted-foreground">Recall</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {modelPerformance?.recallRate || 0}%
          </p>
        </div>

        <div className="p-4 rounded-lg bg-secondary/10">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={18} className="text-secondary" />
            <span className="text-sm text-muted-foreground">F1 Score</span>
          </div>
          <p className="text-3xl font-heading font-bold text-foreground">
            {modelPerformance?.f1Score || 0}%
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Weekly Analysis Trends
        </h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="approved" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="flagged" fill="#F59E0B" radius={[8, 8, 0, 0]} />
              <Bar dataKey="blocked" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Recent Analyses
        </h3>
        <div className="space-y-3">
          {recentAnalyses?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent analyses available</p>
            </div>
          ) : (
            recentAnalyses?.slice(0, 5)?.map((analysis, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      analysis?.screeningStatus === 'approved' ? 'bg-success/20 text-success' :
                      analysis?.screeningStatus === 'flagged' ? 'bg-warning/20 text-warning' :
                      analysis?.screeningStatus === 'blocked'? 'bg-destructive/20 text-destructive' : 'bg-muted text-muted-foreground'
                    }`}>
                      {analysis?.screeningStatus}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {analysis?.contentType?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Target" size={12} />
                    <span>{analysis?.confidenceScore}% confidence</span>
                  </div>
                </div>
                <p className="text-sm text-foreground line-clamp-2">
                  {analysis?.contentText}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboardPanel;