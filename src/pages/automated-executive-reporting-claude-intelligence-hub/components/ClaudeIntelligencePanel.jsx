import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { claudeAnalyticsService } from '../../../services/claudeAnalyticsService';

const ClaudeIntelligencePanel = ({ reports, onRefresh }) => {
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleGenerateAnalysis = async () => {
    try {
      setGenerating(true);
      const result = await claudeAnalyticsService?.analyzeCampaignPerformance();
      setAnalysis(result?.data);
    } catch (error) {
      console.error('Failed to generate analysis:', error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="Sparkles" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">Claude Intelligence Panel</h2>
              <p className="text-sm text-muted-foreground">AI-powered executive summaries and strategic insights</p>
            </div>
          </div>
          <Button
            variant="default"
            iconName={generating ? "Loader" : "Sparkles"}
            onClick={handleGenerateAnalysis}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Analysis'}
          </Button>
        </div>

        {!analysis ? (
          <div className="text-center py-12">
            <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No Claude analysis generated yet</p>
            <p className="text-sm text-muted-foreground">Click "Generate Analysis" to create AI-powered insights</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Icon name="FileText" size={24} className="text-primary" />
                <h3 className="text-lg font-heading font-bold text-foreground">Executive Summary</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis?.summary}</p>
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis?.kpis?.map((kpi, index) => (
                  <div key={index} className="bg-background border border-border rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">{kpi?.name}</p>
                    <p className="text-2xl font-bold text-foreground mb-1">{kpi?.value}</p>
                    <p className="text-xs text-muted-foreground">{kpi?.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">Strategic Insights</h3>
              <div className="space-y-3">
                {analysis?.trends?.map((trend, index) => (
                  <div key={index} className="bg-background border border-border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="TrendingUp" size={20} className="text-blue-600 mt-1" />
                      <p className="text-sm text-foreground">{trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-heading font-bold text-foreground mb-4">Actionable Recommendations</h3>
              <div className="space-y-3">
                {analysis?.improvements?.map((improvement, index) => (
                  <div key={index} className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Icon name="Lightbulb" size={20} className="text-yellow-600 mt-1" />
                      <p className="text-sm text-foreground">{improvement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-transparent border border-primary/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <Icon name="Info" size={24} className="text-primary mt-1" />
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground mb-2">Claude AI Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Natural language executive summaries</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Contextual analysis with strategic recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>Automated insight generation from platform KPIs</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" size={16} className="text-green-600 mt-0.5" />
                <span>One-click drill-down to detailed dashboards</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaudeIntelligencePanel;