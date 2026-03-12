import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { enhancedAnalyticsService } from '../../../services/enhancedAnalyticsService';

const ScenarioModelingPanel = () => {
  const [scenarioInput, setScenarioInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunScenario = async () => {
    if (!scenarioInput?.trim()) return;

    try {
      setLoading(true);
      const response = await enhancedAnalyticsService?.getScenarioModeling({
        description: scenarioInput,
        timestamp: new Date()?.toISOString()
      });
      setResult(response?.data);
    } catch (error) {
      console.error('Failed to run scenario:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    if (riskLevel?.toLowerCase()?.includes('high')) return 'text-red-500';
    if (riskLevel?.toLowerCase()?.includes('medium')) return 'text-yellow-500';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Scenario Modeling</h2>
          <p className="text-sm text-muted-foreground">
            Test hypothetical scenarios and predict outcomes
          </p>
        </div>
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="GitBranch" size={20} className="text-primary" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-2">
          Describe Scenario
        </label>
        <textarea
          value={scenarioInput}
          onChange={(e) => setScenarioInput(e?.target?.value)}
          placeholder="Example: What if we increase ad budget by 30% and reduce participation fees by 15%?"
          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          rows={4}
        />
      </div>

      <Button
        onClick={handleRunScenario}
        disabled={loading || !scenarioInput?.trim()}
        className="w-full mb-6"
      >
        {loading ? (
          <>
            <Icon name="Loader" size={16} className="animate-spin" />
            <span>Analyzing Scenario...</span>
          </>
        ) : (
          <>
            <Icon name="Play" size={16} />
            <span>Run Scenario Analysis</span>
          </>
        )}
      </Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{result?.scenarioName}</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">User Engagement</p>
                <p className="text-sm font-medium text-foreground">{result?.impactAnalysis?.userEngagement}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Revenue Impact</p>
                <p className="text-sm font-medium text-foreground">{result?.impactAnalysis?.revenue}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Retention</p>
                <p className="text-sm font-medium text-foreground">{result?.impactAnalysis?.retention}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Growth</p>
                <p className="text-sm font-medium text-foreground">{result?.impactAnalysis?.growth}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground">Success Probability</span>
              <span className="text-lg font-bold text-primary">
                {(result?.successProbability * 100)?.toFixed(0)}%
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">Risk Level:</span>
              <span className={`text-sm font-semibold ${getRiskColor(result?.riskAssessment?.riskLevel)}`}>
                {result?.riskAssessment?.riskLevel}
              </span>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="AlertTriangle" size={14} className="text-accent" />
              Risks & Mitigation
            </h3>
            <div className="space-y-2">
              {result?.riskAssessment?.risks?.map((risk, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Icon name="AlertCircle" size={12} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{risk}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="CheckCircle" size={14} className="text-success" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {result?.recommendations?.map((rec, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioModelingPanel;