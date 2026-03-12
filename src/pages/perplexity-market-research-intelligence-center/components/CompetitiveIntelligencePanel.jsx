import React from 'react';
import Icon from '../../../components/AppIcon';

const CompetitiveIntelligencePanel = ({ competitiveData, onRefresh }) => {
  if (!competitiveData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No competitive intelligence data available</p>
      </div>
    );
  }

  const { competitorMonitoring, marketShareAnalysis, strategicPositioning, predictiveModeling, competitiveAdvantages, marketOpportunities, confidenceScore, reasoning } = competitiveData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} className="text-primary" />
          Competitor Monitoring
        </h3>
        <div className="space-y-3">
          {competitorMonitoring?.map((competitor, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{competitor?.competitor}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  competitor?.threatLevel === 'high' ? 'bg-red-100 text-red-700' :
                  competitor?.threatLevel === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {competitor?.threatLevel} threat
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Market Share</p>
                  <p className="font-medium text-foreground">{competitor?.marketShare}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Recent Activity</p>
                  <p className="font-medium text-foreground">{competitor?.recentActivity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="TrendingUp" size={20} className="text-primary" />
            Market Share Analysis
          </h3>
          <div className="space-y-4">
            {marketShareAnalysis?.currentPositions?.map((position, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{position?.company}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${position?.share}%` }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground w-12 text-right">{position?.share}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Crosshair" size={20} className="text-primary" />
            Strategic Positioning (SWOT)
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">STRENGTHS</p>
              <ul className="text-sm text-foreground space-y-1">
                {strategicPositioning?.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="CheckCircle" size={14} className="text-green-500 mt-0.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-600 mb-1">WEAKNESSES</p>
              <ul className="text-sm text-foreground space-y-1">
                {strategicPositioning?.weaknesses?.map((weakness, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Icon name="XCircle" size={14} className="text-red-500 mt-0.5" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" size={20} className="text-primary" />
          Predictive Modeling (30/60/90 Day Forecast)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {predictiveModeling?.forecasts?.map((forecast, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground mb-2">{forecast?.period} Days</p>
              <p className="text-2xl font-bold text-foreground mb-1">{forecast?.prediction}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="TrendingUp" size={12} />
                <span>Confidence: {(forecast?.confidence * 100)?.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Award" size={20} className="text-primary" />
            Competitive Advantages
          </h3>
          <ul className="space-y-2">
            {competitiveAdvantages?.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <Icon name="Star" size={16} className="text-yellow-500 mt-0.5" />
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Lightbulb" size={20} className="text-primary" />
            Market Opportunities
          </h3>
          <ul className="space-y-2">
            {marketOpportunities?.map((opportunity, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                <Icon name="TrendingUp" size={16} className="text-green-500 mt-0.5" />
                <span>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Strategic Analysis & Reasoning
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Icon name="CheckCircle" size={16} className="text-green-500" />
          <span className="text-sm text-muted-foreground">
            Analysis Confidence: <span className="font-semibold text-foreground">{(confidenceScore * 100)?.toFixed(1)}%</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveIntelligencePanel;