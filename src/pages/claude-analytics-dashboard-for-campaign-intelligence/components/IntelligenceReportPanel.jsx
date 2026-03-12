import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

export default function IntelligenceReportPanel({ data, campaign, loading }) {
  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="Loader" size={48} className="text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Generating comprehensive intelligence report...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No Report Generated
        </h3>
        <p className="text-muted-foreground mb-4">
          Click "Generate Report" to create a comprehensive intelligence report
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Campaign Intelligence Report</h2>
            <p className="text-purple-100">Generated: {new Date(data?.generatedAt)?.toLocaleString()}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" iconName="Download" className="bg-white text-purple-600 hover:bg-purple-50">
              Export PDF
            </Button>
            <Button variant="outline" size="sm" iconName="Share2" className="bg-white text-purple-600 hover:bg-purple-50">
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Overall Score */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Overall Campaign Score</h3>
            <p className="text-sm text-muted-foreground">Comprehensive health assessment</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600">{data?.overallScore || 85}</div>
            <div className="text-sm text-muted-foreground">out of 100</div>
          </div>
        </div>
      </div>

      {/* Actionable Insights */}
      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Actionable Insights</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data?.actionableInsights?.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  {insight?.priority}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{insight?.category}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight?.insight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analysis Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            Performance Analysis
          </h3>
          <div className="prose dark:prose-invert max-w-none text-sm">
            <p className="text-muted-foreground">
              {data?.performanceAnalysis?.summary || 'Campaign showing strong performance across all metrics with consistent growth trajectory.'}
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Lightbulb" size={20} className="text-yellow-600" />
            Strategic Recommendations
          </h3>
          <div className="prose dark:prose-invert max-w-none text-sm">
            <p className="text-muted-foreground">
              {data?.allocationRecommendations?.recommendations?.substring(0, 200) || 'Focus on high-performing segments and optimize allocation for maximum ROI.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}