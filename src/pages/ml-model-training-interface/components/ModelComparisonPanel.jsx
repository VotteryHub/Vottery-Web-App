import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ModelComparisonPanel = ({ modelPerformance, onRefresh }) => {
  const [version1, setVersion1] = useState(modelPerformance?.[0]?.model_version || '');
  const [version2, setVersion2] = useState(modelPerformance?.[1]?.model_version || '');

  const model1 = modelPerformance?.find(m => m?.model_version === version1);
  const model2 = modelPerformance?.find(m => m?.model_version === version2);

  const calculateDelta = (metric) => {
    if (!model1 || !model2) return 0;
    return ((model1?.[metric] - model2?.[metric]) * 100);
  };

  const getDeltaColor = (delta) => {
    if (delta > 0) return 'text-green-600';
    if (delta < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  const versionOptions = modelPerformance?.map(m => ({
    value: m?.model_version,
    label: `${m?.model_version} (${new Date(m?.created_at)?.toLocaleDateString()})`
  })) || [];

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-4">Model Comparison</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Compare performance differences between model versions for deployment decisions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Model Version 1</label>
            <Select
              value={version1}
              onChange={(e) => setVersion1(e?.target?.value)}
              options={versionOptions}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Model Version 2</label>
            <Select
              value={version2}
              onChange={(e) => setVersion2(e?.target?.value)}
              options={versionOptions}
            />
          </div>
        </div>

        {model1 && model2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Accuracy</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model1?.accuracy * 100)?.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model2?.accuracy * 100)?.toFixed(1)}%
                  </span>
                </div>
                <div className={`text-xs flex items-center gap-1 ${getDeltaColor(calculateDelta('accuracy'))}`}>
                  <Icon name={calculateDelta('accuracy') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  {Math.abs(calculateDelta('accuracy'))?.toFixed(2)}% difference
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Precision</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model1?.precision * 100)?.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model2?.precision * 100)?.toFixed(1)}%
                  </span>
                </div>
                <div className={`text-xs flex items-center gap-1 ${getDeltaColor(calculateDelta('precision'))}`}>
                  <Icon name={calculateDelta('precision') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  {Math.abs(calculateDelta('precision'))?.toFixed(2)}% difference
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">Recall</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model1?.recall * 100)?.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model2?.recall * 100)?.toFixed(1)}%
                  </span>
                </div>
                <div className={`text-xs flex items-center gap-1 ${getDeltaColor(calculateDelta('recall'))}`}>
                  <Icon name={calculateDelta('recall') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  {Math.abs(calculateDelta('recall'))?.toFixed(2)}% difference
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="text-xs text-muted-foreground mb-2">F1 Score</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model1?.f1_score * 100)?.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground">vs</span>
                  <span className="text-xl font-bold text-foreground font-data">
                    {(model2?.f1_score * 100)?.toFixed(1)}%
                  </span>
                </div>
                <div className={`text-xs flex items-center gap-1 ${getDeltaColor(calculateDelta('f1_score'))}`}>
                  <Icon name={calculateDelta('f1_score') >= 0 ? 'TrendingUp' : 'TrendingDown'} size={12} />
                  {Math.abs(calculateDelta('f1_score'))?.toFixed(2)}% difference
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-3">False Positive Reduction</h4>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Version 1</div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${model1?.false_positive_rate * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(model1?.false_positive_rate * 100)?.toFixed(2)}%
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Version 2</div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500"
                        style={{ width: `${model2?.false_positive_rate * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {(model2?.false_positive_rate * 100)?.toFixed(2)}%
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-medium mt-3 ${getDeltaColor(-(calculateDelta('false_positive_rate')))}`}>
                  {calculateDelta('false_positive_rate') < 0 ? 'Improved' : 'Degraded'} by {Math.abs(calculateDelta('false_positive_rate'))?.toFixed(2)}%
                </div>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="text-sm font-semibold text-foreground mb-3">Training Efficiency</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Training Duration</span>
                      <span className="font-medium text-foreground">
                        {model1?.training_duration}s vs {model2?.training_duration}s
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Dataset Size</span>
                      <span className="font-medium text-foreground">
                        {model1?.dataset_size?.toLocaleString()} vs {model2?.dataset_size?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-6">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                    Deployment Recommendation
                  </h3>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    {calculateDelta('accuracy') > 0 
                      ? `Version ${version1} shows improved performance. Recommended for deployment.`
                      : `Version ${version2} shows better performance. Consider deploying this version.`
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button iconName="GitBranch">
                Deploy Better Model
              </Button>
              <Button variant="outline" iconName="TestTube">
                Run A/B Test
              </Button>
              <Button variant="outline" iconName="Download">
                Export Comparison
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">A/B Testing Insights</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Statistical significance testing and live traffic comparison
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Users" size={24} className="mx-auto text-primary mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">10,000</div>
            <div className="text-xs text-muted-foreground">Test Sample Size</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="TrendingUp" size={24} className="mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">95%</div>
            <div className="text-xs text-muted-foreground">Statistical Confidence</div>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Icon name="Clock" size={24} className="mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-heading font-bold text-foreground mb-1 font-data">7 days</div>
            <div className="text-xs text-muted-foreground">Test Duration</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelComparisonPanel;