import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { enhancedAnalyticsService } from '../../../services/enhancedAnalyticsService';

const MultiVariateAnalysisPanel = () => {
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const availableVariables = [
    'User Engagement Rate',
    'Campaign Budget',
    'Content Quality Score',
    'Ad Impressions',
    'Participation Fees',
    'User Retention',
    'Election Frequency',
    'Zone Performance'
  ];

  const toggleVariable = (variable) => {
    if (selectedVariables?.includes(variable)) {
      setSelectedVariables(selectedVariables?.filter(v => v !== variable));
    } else {
      setSelectedVariables([...selectedVariables, variable]);
    }
  };

  const handleAnalyze = async () => {
    if (selectedVariables?.length < 2) return;

    try {
      setLoading(true);
      const response = await enhancedAnalyticsService?.getMultiVariateAnalysis({
        variables: selectedVariables,
        timestamp: new Date()?.toISOString()
      });
      setResult(response?.data);
    } catch (error) {
      console.error('Failed to run analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCorrelationColor = (strength) => {
    const absStrength = Math.abs(strength);
    if (absStrength > 0.7) return 'text-success';
    if (absStrength > 0.4) return 'text-accent';
    return 'text-muted-foreground';
  };

  const getStrengthColor = (strength) => {
    if (strength === 'strong') return 'bg-success/10 text-success';
    if (strength === 'moderate') return 'bg-accent/10 text-accent';
    return 'bg-gray-100 dark:bg-gray-800 text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Multi-Variate Analysis</h2>
          <p className="text-sm text-muted-foreground">
            Correlation detection and causal relationships
          </p>
        </div>
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Network" size={20} className="text-secondary" />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-3">
          Select Variables (minimum 2)
        </label>
        <div className="flex flex-wrap gap-2">
          {availableVariables?.map((variable) => (
            <button
              key={variable}
              onClick={() => toggleVariable(variable)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                selectedVariables?.includes(variable)
                  ? 'bg-primary text-white' :'bg-background border border-border text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {variable}
            </button>
          ))}
        </div>
      </div>

      <Button
        onClick={handleAnalyze}
        disabled={loading || selectedVariables?.length < 2}
        className="w-full mb-6"
      >
        {loading ? (
          <>
            <Icon name="Loader" size={16} className="animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Icon name="BarChart3" size={16} />
            <span>Run Analysis</span>
          </>
        )}
      </Button>

      {result && (
        <div className="space-y-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Link" size={14} className="text-primary" />
              Correlations
            </h3>
            <div className="space-y-3">
              {result?.correlations?.map((correlation, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-xs text-foreground mb-1">
                      {correlation?.variable1} ↔ {correlation?.variable2}
                    </p>
                    <p className="text-xs text-muted-foreground">{correlation?.relationship}</p>
                  </div>
                  <span className={`text-sm font-bold ${getCorrelationColor(correlation?.correlationStrength)}`}>
                    {correlation?.correlationStrength?.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="GitBranch" size={14} className="text-secondary" />
              Causal Relationships
            </h3>
            <div className="space-y-3">
              {result?.causalRelationships?.map((relationship, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-foreground font-medium">{relationship?.cause}</span>
                      <Icon name="ArrowRight" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-foreground font-medium">{relationship?.effect}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStrengthColor(relationship?.strength)}`}>
                      {relationship?.strength}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence:</span>
                    <span className="text-xs font-medium text-foreground">
                      {(relationship?.confidence * 100)?.toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Lightbulb" size={14} className="text-accent" />
              Key Findings
            </h3>
            <div className="space-y-2">
              {result?.keyFindings?.map((finding, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">{finding}</p>
                </div>
              ))}
            </div>
          </div>

          {result?.interactionEffects && result?.interactionEffects?.length > 0 && (
            <div className="bg-background border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Icon name="Zap" size={14} className="text-primary" />
                Interaction Effects
              </h3>
              <div className="space-y-2">
                {result?.interactionEffects?.map((effect, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon name="TrendingUp" size={12} className="text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">{effect}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiVariateAnalysisPanel;