import React from 'react';
import Icon from '../../../components/AppIcon';


const AlgorithmIntegrationPanel = ({ algorithmPerformance, settings, onModeChange }) => {
  const currentMode = settings?.algorithmMode || 'balanced';

  const algorithmModes = [
    {
      id: 'balanced',
      name: 'Balanced Distribution',
      description: 'Equal weight to both content types with smooth transitions',
      icon: 'Scale',
      color: 'primary'
    },
    {
      id: 'engagement_optimized',
      name: 'Engagement Optimized',
      description: 'Prioritizes content types with higher user engagement',
      icon: 'TrendingUp',
      color: 'success'
    },
    {
      id: 'demographic_weighted',
      name: 'Demographic Weighted',
      description: 'Adjusts distribution based on user demographics',
      icon: 'Users',
      color: 'secondary'
    },
    {
      id: 'time_based',
      name: 'Time-Based Optimization',
      description: 'Varies distribution based on time of day and user activity',
      icon: 'Clock',
      color: 'accent'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Algorithm Mode Selection */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
              Algorithm Mode
            </h2>
            <p className="text-sm text-muted-foreground">
              Select the distribution algorithm strategy
            </p>
          </div>
          <Icon name="Brain" size={24} className="text-primary" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {algorithmModes?.map((mode) => (
            <button
              key={mode?.id}
              onClick={() => onModeChange?.(mode?.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                currentMode === mode?.id
                  ? `border-${mode?.color} bg-${mode?.color}/5`
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${mode?.color}/10`}>
                  <Icon name={mode?.icon} size={20} className={`text-${mode?.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-heading font-semibold text-foreground">
                      {mode?.name}
                    </h3>
                    {currentMode === mode?.id && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-success text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{mode?.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ML Model Performance */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              Machine Learning Performance
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time model accuracy and effectiveness metrics
            </p>
          </div>
          <Icon name="Cpu" size={24} className="text-primary" />
        </div>

        <div className="space-y-4">
          {algorithmPerformance?.map((algo, index) => (
            <div key={index} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-heading font-semibold text-foreground">
                      {algo?.algorithmName?.replace(/_/g, ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
                    </h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      algo?.abTestGroup === 'control' ? 'bg-primary/10 text-primary' :
                      algo?.abTestGroup === 'variant_a'? 'bg-success/10 text-success' : 'bg-secondary/10 text-secondary'
                    }`}>
                      {algo?.abTestGroup?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Sample Size: {algo?.sampleSize?.toLocaleString()} users
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Performance Score</p>
                  <p className="text-lg font-bold text-foreground font-data">{algo?.performanceScore}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Accuracy Rate</p>
                  <p className="text-lg font-bold text-success font-data">{algo?.accuracyRate}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">User Satisfaction</p>
                  <p className="text-lg font-bold text-primary font-data">{algo?.userSatisfactionScore}/5.0</p>
                </div>
              </div>

              {algo?.recommendations && algo?.recommendations?.length > 0 && (
                <div className="mt-3 p-3 rounded-lg bg-muted/50">
                  <p className="text-xs font-medium text-foreground mb-2">AI Recommendations:</p>
                  <ul className="space-y-1">
                    {algo?.recommendations?.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Icon name="ArrowRight" size={12} className="text-primary mt-0.5" />
                        <span className="text-xs text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* A/B Testing Results */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
              A/B Testing Results
            </h3>
            <p className="text-sm text-muted-foreground">
              Comparative analysis of different distribution strategies
            </p>
          </div>
          <Icon name="GitCompare" size={24} className="text-primary" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Test Group</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Performance</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Accuracy</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Satisfaction</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">Sample Size</th>
              </tr>
            </thead>
            <tbody>
              {algorithmPerformance?.map((algo, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        algo?.abTestGroup === 'control' ? 'bg-primary' :
                        algo?.abTestGroup === 'variant_a'? 'bg-success' : 'bg-secondary'
                      }`} />
                      <span className="text-sm font-medium text-foreground">
                        {algo?.abTestGroup?.replace('_', ' ')?.toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-foreground font-data">
                      {algo?.performanceScore}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-success font-data">
                      {algo?.accuracyRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-primary font-data">
                      {algo?.userSatisfactionScore}/5.0
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-muted-foreground font-data">
                      {algo?.sampleSize?.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Automated Optimization */}
      <div className="card bg-gradient-to-r from-primary/5 to-success/5 border-primary/20">
        <div className="flex items-start gap-3">
          <Icon name="Sparkles" size={24} className="text-primary" />
          <div className="flex-1">
            <h4 className="text-sm font-heading font-semibold text-foreground mb-2">
              Automated Optimization Active
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              The system is continuously learning from user behavior and automatically adjusting
              distribution strategies to maximize engagement and satisfaction.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Learning in Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmIntegrationPanel;