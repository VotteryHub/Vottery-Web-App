import React from 'react';
import Icon from '../../../components/AppIcon';

const ModelPerformancePanel = ({ modelPerformance, onRefresh }) => {
  if (!modelPerformance || modelPerformance?.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="TrendingUp" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No model performance data available</p>
      </div>
    );
  }

  const latestModel = modelPerformance?.[0];
  const previousModel = modelPerformance?.[1];

  const calculateDelta = (current, previous, metric) => {
    if (!previous) return null;
    const delta = current?.[metric] - previous?.[metric];
    return delta;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Accuracy</h3>
            <Icon name="Target" size={18} className="text-green-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-foreground mb-2 font-data">
            {(latestModel?.accuracy * 100)?.toFixed(1)}%
          </div>
          {previousModel && (
            <div className={`text-xs flex items-center gap-1 ${
              calculateDelta(latestModel, previousModel, 'accuracy') >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon name={calculateDelta(latestModel, previousModel, 'accuracy') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
              {Math.abs(calculateDelta(latestModel, previousModel, 'accuracy') * 100)?.toFixed(2)}% from previous
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Precision</h3>
            <Icon name="Crosshair" size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-foreground mb-2 font-data">
            {(latestModel?.precision * 100)?.toFixed(1)}%
          </div>
          {previousModel && (
            <div className={`text-xs flex items-center gap-1 ${
              calculateDelta(latestModel, previousModel, 'precision') >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon name={calculateDelta(latestModel, previousModel, 'precision') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
              {Math.abs(calculateDelta(latestModel, previousModel, 'precision') * 100)?.toFixed(2)}% from previous
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">Recall</h3>
            <Icon name="Search" size={18} className="text-purple-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-foreground mb-2 font-data">
            {(latestModel?.recall * 100)?.toFixed(1)}%
          </div>
          {previousModel && (
            <div className={`text-xs flex items-center gap-1 ${
              calculateDelta(latestModel, previousModel, 'recall') >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon name={calculateDelta(latestModel, previousModel, 'recall') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
              {Math.abs(calculateDelta(latestModel, previousModel, 'recall') * 100)?.toFixed(2)}% from previous
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-muted-foreground">F1 Score</h3>
            <Icon name="Award" size={18} className="text-orange-600" />
          </div>
          <div className="text-3xl font-heading font-bold text-foreground mb-2 font-data">
            {(latestModel?.f1_score * 100)?.toFixed(1)}%
          </div>
          {previousModel && (
            <div className={`text-xs flex items-center gap-1 ${
              calculateDelta(latestModel, previousModel, 'f1_score') >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              <Icon name={calculateDelta(latestModel, previousModel, 'f1_score') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
              {Math.abs(calculateDelta(latestModel, previousModel, 'f1_score') * 100)?.toFixed(2)}% from previous
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">False Positive/Negative Rates</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">False Positive Rate</span>
                <span className="text-sm font-bold text-foreground font-data">
                  {(latestModel?.false_positive_rate * 100)?.toFixed(2)}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500"
                  style={{ width: `${latestModel?.false_positive_rate * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">False Negative Rate</span>
                <span className="text-sm font-bold text-foreground font-data">
                  {(latestModel?.false_negative_rate * 100)?.toFixed(2)}%
                </span>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500"
                  style={{ width: `${latestModel?.false_negative_rate * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Training Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Model Version</div>
              <div className="text-lg font-bold text-foreground font-data">{latestModel?.model_version}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Training Duration</div>
              <div className="text-lg font-bold text-foreground font-data">{latestModel?.training_duration}s</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Dataset Size</div>
              <div className="text-lg font-bold text-foreground font-data">{latestModel?.dataset_size?.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Trained At</div>
              <div className="text-xs font-medium text-foreground">
                {new Date(latestModel?.created_at)?.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Model Performance History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">Version</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">Accuracy</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">Precision</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">Recall</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">F1 Score</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">FP Rate</th>
                <th className="text-left text-xs font-semibold text-muted-foreground py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {modelPerformance?.map((model, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{model?.model_version}</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{(model?.accuracy * 100)?.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{(model?.precision * 100)?.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{(model?.recall * 100)?.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{(model?.f1_score * 100)?.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-sm text-foreground font-data">{(model?.false_positive_rate * 100)?.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">
                    {new Date(model?.created_at)?.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {latestModel?.metadata?.optimizationSuggestions && (
        <div className="card">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Optimization Suggestions</h3>
          <div className="space-y-3">
            {latestModel?.metadata?.optimizationSuggestions?.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Icon name="Lightbulb" size={18} className="text-blue-600 mt-0.5" />
                <p className="text-sm text-foreground flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelPerformancePanel;