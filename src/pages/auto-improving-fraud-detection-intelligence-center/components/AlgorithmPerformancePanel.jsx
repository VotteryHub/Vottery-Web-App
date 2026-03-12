import React from 'react';
import Icon from '../../../components/AppIcon';

const AlgorithmPerformancePanel = ({ data }) => {
  if (!data || data?.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No algorithm performance data available</p>
      </div>
    );
  }

  const latestModel = data?.[0];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="GitBranch" className="w-5 h-5 text-primary" />
          Algorithm Version Control
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Current Version</div>
            <div className="text-xl font-bold text-foreground">{latestModel?.modelVersion || 'v2.4.1'}</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Accuracy</div>
            <div className="text-xl font-bold text-green-500">{latestModel?.accuracy || '94.7'}%</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Precision</div>
            <div className="text-xl font-bold text-blue-500">{latestModel?.precision || '96.2'}%</div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <div className="text-xs text-muted-foreground mb-1">Recall</div>
            <div className="text-xl font-bold text-purple-500">{latestModel?.recall || '93.8'}%</div>
          </div>
        </div>

        <div className="space-y-3">
          {data?.slice(0, 5)?.map((model, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index === 0 ? 'bg-green-500/20' : 'bg-muted-foreground/20'
                }`}>
                  <Icon name="GitCommit" className={`w-5 h-5 ${
                    index === 0 ? 'text-green-500' : 'text-muted-foreground'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-foreground flex items-center gap-2">
                    {model?.modelVersion || `v2.${4-index}.${index}`}
                    {index === 0 && <span className="px-2 py-0.5 bg-green-500/20 text-green-500 text-xs rounded-full">Current</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(model?.createdAt || Date.now() - index * 86400000)?.toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Accuracy</div>
                  <div className="text-sm font-medium text-foreground">{model?.accuracy || (94 - index * 0.5)?.toFixed(1)}%</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">F1 Score</div>
                  <div className="text-sm font-medium text-foreground">{model?.f1Score || (0.95 - index * 0.01)?.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TestTube" className="w-5 h-5 text-primary" />
          A/B Testing for Detection Improvements
        </h3>
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-foreground">Test: Enhanced Velocity Detection</div>
                <div className="text-sm text-muted-foreground">Comparing baseline vs. optimized velocity thresholds</div>
              </div>
              <span className="px-3 py-1 bg-green-500/20 text-green-500 text-sm font-medium rounded-full">Winner: Variant B</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Variant A (Control)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">87%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Variant B (Test)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">94%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-foreground">Test: Behavioral Pattern Recognition</div>
                <div className="text-sm text-muted-foreground">Testing new ML model for user behavior analysis</div>
              </div>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm font-medium rounded-full">In Progress</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Variant A (Control)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">91%</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Variant B (Test)</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">92%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-medium text-foreground">Test: Geographic Clustering Algorithm</div>
                <div className="text-sm text-muted-foreground">Evaluating improved location-based fraud detection</div>
              </div>
              <span className="px-3 py-1 bg-blue-500/20 text-blue-500 text-sm font-medium rounded-full">Scheduled</span>
            </div>
            <div className="text-sm text-muted-foreground">Start date: Next week</div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart3" className="w-5 h-5 text-primary" />
          Custom Learning Parameters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Learning Rate</span>
                <span className="text-sm font-medium text-foreground">0.001</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Batch Size</span>
                <span className="text-sm font-medium text-foreground">128</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Epochs</span>
                <span className="text-sm font-medium text-foreground">50</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Dropout Rate</span>
                <span className="text-sm font-medium text-foreground">0.3</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Regularization</span>
                <span className="text-sm font-medium text-foreground">L2 (0.01)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Optimizer</span>
                <span className="text-sm font-medium text-foreground">Adam</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmPerformancePanel;