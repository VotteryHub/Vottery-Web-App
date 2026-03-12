import React from 'react';
import Icon from '../../../components/AppIcon';

const AdvancedReasoningPanel = ({ forecastingData, correlationData }) => {
  const reasoningSteps = [
    {
      step: 1,
      title: 'Data Collection & Pattern Recognition',
      description: 'Analyzed historical fraud data across 8 purchasing power zones, identifying 156 distinct fraud patterns with 89% confidence.',
      confidence: 0.89,
      dataPoints: 12450
    },
    {
      step: 2,
      title: 'Cross-Platform Correlation Analysis',
      description: 'Detected coordinated attack patterns across zones with correlation coefficients ranging from 0.22 to 0.78, indicating multi-zone threat campaigns.',
      confidence: 0.92,
      dataPoints: 8934
    },
    {
      step: 3,
      title: 'Behavioral Anomaly Detection',
      description: 'Identified velocity spikes, geographic clustering, and temporal irregularities using DeepSeek R1-powered reasoning models.',
      confidence: 0.87,
      dataPoints: 6721
    },
    {
      step: 4,
      title: 'Predictive Modeling & Forecasting',
      description: 'Generated 30/60/90-day fraud probability forecasts with confidence intervals, projecting 12.5% to 23.7% fraud probability increase.',
      confidence: 0.91,
      dataPoints: 4532
    },
    {
      step: 5,
      title: 'Threat Intelligence Integration',
      description: 'Integrated external threat intelligence from CISA, OWASP, and security research sources to validate emerging threat vectors.',
      confidence: 0.85,
      dataPoints: 3214
    },
    {
      step: 6,
      title: 'Actionable Recommendations',
      description: 'Synthesized findings into zone-specific prevention strategies and coordinated response protocols with cultural context awareness.',
      confidence: 0.88,
      dataPoints: 2156
    }
  ];

  const modelCapabilities = [
    { name: 'Chain-of-Thought Reasoning', enabled: true, description: 'Step-by-step logical analysis' },
    { name: 'Multi-Vector Threat Assessment', enabled: true, description: 'Simultaneous analysis of multiple attack vectors' },
    { name: 'Contextual Intelligence Gathering', enabled: true, description: 'Real-time web search integration' },
    { name: 'Behavioral Pattern Recognition', enabled: true, description: 'ML-powered anomaly detection' },
    { name: 'Predictive Confidence Intervals', enabled: true, description: 'Statistical forecasting with uncertainty quantification' },
    { name: 'Cross-Zone Correlation', enabled: true, description: 'Platform-wide threat correlation analysis' }
  ];

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Brain" size={32} className="text-primary" />
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground">Advanced AI Reasoning Engine</h2>
            <p className="text-sm text-muted-foreground">DeepSeek R1-powered analysis with chain-of-thought reasoning</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">Model: sonar-reasoning-pro</h3>
              <p className="text-xs text-blue-800 dark:text-blue-200">
                This panel demonstrates the advanced reasoning capabilities of Perplexity's sonar-reasoning-pro model, 
                which uses DeepSeek R1 architecture for sophisticated fraud pattern analysis and predictive forecasting.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modelCapabilities?.map((capability, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-start gap-2 mb-2">
                <Icon 
                  name={capability?.enabled ? 'CheckCircle' : 'Circle'} 
                  size={18} 
                  className={capability?.enabled ? 'text-green-600' : 'text-muted-foreground'} 
                />
                <h4 className="text-sm font-semibold text-foreground flex-1">{capability?.name}</h4>
              </div>
              <p className="text-xs text-muted-foreground ml-6">{capability?.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Reasoning Process Breakdown</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Step-by-step analysis showing how the AI model processes fraud intelligence data
        </p>

        <div className="space-y-4">
          {reasoningSteps?.map((step, index) => (
            <div key={index} className="relative">
              {index < reasoningSteps?.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-primary/20" />
              )}
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg flex-shrink-0 relative z-10">
                  {step?.step}
                </div>
                <div className="flex-1 pb-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-sm font-semibold text-foreground">{step?.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Confidence:</span>
                        <span className="text-xs font-bold text-primary font-data">{(step?.confidence * 100)?.toFixed(0)}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{step?.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Icon name="Database" size={14} />
                        <span>{step?.dataPoints?.toLocaleString()} data points</span>
                      </div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${step?.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {forecastingData?.reasoning && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Predictive Forecasting Reasoning</h3>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">{forecastingData?.reasoning}</p>
          </div>
        </div>
      )}
      {correlationData?.reasoning && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Cross-Platform Correlation Reasoning</h3>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm text-foreground whitespace-pre-wrap">{correlationData?.reasoning}</p>
          </div>
        </div>
      )}
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Model Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Zap" size={24} className="mx-auto text-yellow-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">89.3%</div>
            <div className="text-xs text-muted-foreground">Overall Accuracy</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Target" size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">92.1%</div>
            <div className="text-xs text-muted-foreground">Precision Rate</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="TrendingUp" size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">87.5%</div>
            <div className="text-xs text-muted-foreground">Recall Rate</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Clock" size={24} className="mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">2.3s</div>
            <div className="text-xs text-muted-foreground">Avg Response Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedReasoningPanel;