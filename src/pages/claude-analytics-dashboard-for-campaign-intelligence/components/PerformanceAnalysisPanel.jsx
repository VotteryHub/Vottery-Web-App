import React from 'react';
import Icon from '../../../components/AppIcon';

export default function PerformanceAnalysisPanel({ data, campaign, loading }) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Claude AI is analyzing campaign performance...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="TrendingUp" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Analysis Available
        </h3>
        <p className="text-muted-foreground">
          Select a campaign to view AI-powered performance analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Campaign Health Score</h2>
            <p className="text-purple-100">AI-powered comprehensive assessment</p>
          </div>
          <div className="text-center">
            <div className="text-6xl font-bold">{data?.healthScore || 75}</div>
            <div className="text-sm text-purple-100">out of 100</div>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Brain" size={20} className="text-purple-600" />
            Claude AI Analysis
          </h3>
        </div>
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-foreground whitespace-pre-wrap">{data?.summary || data?.rawAnalysis}</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Users" size={20} className="text-blue-600" />
            <span className="text-sm text-muted-foreground">Engagement Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">78.5%</div>
          <div className="text-xs text-green-600 mt-1">
            <Icon name="TrendingUp" size={12} className="inline" /> +12.3% vs last period
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Target" size={20} className="text-green-600" />
            <span className="text-sm text-muted-foreground">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-foreground">45.2%</div>
          <div className="text-xs text-green-600 mt-1">
            <Icon name="TrendingUp" size={12} className="inline" /> +8.7% vs last period
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="DollarSign" size={20} className="text-purple-600" />
            <span className="text-sm text-muted-foreground">ROI</span>
          </div>
          <div className="text-2xl font-bold text-foreground">325%</div>
          <div className="text-xs text-green-600 mt-1">
            <Icon name="TrendingUp" size={12} className="inline" /> +45% vs last period
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Performance Trends</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">User Acquisition</span>
                <span className="text-sm font-semibold text-foreground">85%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Engagement Quality</span>
                <span className="text-sm font-semibold text-foreground">72%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Prize Distribution Efficiency</span>
                <span className="text-sm font-semibold text-foreground">91%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '91%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}