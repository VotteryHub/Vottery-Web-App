import React from 'react';
import Icon from '../../../components/AppIcon';

const FalsePositiveAnalysisPanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No false positive data available</p>
      </div>
    );
  }

  const correctionRate = ((data?.correctedCases / data?.totalFalsePositives) * 100)?.toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total False Positives</span>
            <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.totalFalsePositives?.toLocaleString()}</div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Corrected Cases</span>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.correctedCases?.toLocaleString()}</div>
          <div className="mt-2 text-xs text-green-500">
            {correctionRate}% correction rate
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Correction Protocols</span>
            <Icon name="Settings" className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.correctionProtocols}</div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Bias Detected</span>
            <Icon name="AlertCircle" className="w-5 h-5 text-red-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.biasDetected}</div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Search" className="w-5 h-5 text-primary" />
          Root Cause Analysis
        </h3>
        <div className="space-y-4">
          {data?.rootCauses?.map((cause, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-medium text-foreground">{cause?.cause}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{cause?.count} cases</span>
                  <span className="text-sm font-medium text-foreground">{cause?.percentage}%</span>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-red-500' :
                    index === 1 ? 'bg-orange-500' :
                    index === 2 ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${cause?.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" className="w-5 h-5 text-primary" />
          Automated Correction Protocols
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Icon name="Sliders" className="w-5 h-5 text-blue-500" />
              </div>
              <div className="font-medium text-foreground">Threshold Adjustment</div>
            </div>
            <p className="text-sm text-muted-foreground">Automatically adjusts detection thresholds based on false positive patterns</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="GitBranch" className="w-5 h-5 text-green-500" />
              </div>
              <div className="font-medium text-foreground">Pattern Refinement</div>
            </div>
            <p className="text-sm text-muted-foreground">Refines detection patterns to reduce false triggers</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon name="Filter" className="w-5 h-5 text-purple-500" />
              </div>
              <div className="font-medium text-foreground">Context Filtering</div>
            </div>
            <p className="text-sm text-muted-foreground">Adds contextual filters to improve detection accuracy</p>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Icon name="Shield" className="w-5 h-5 text-orange-500" />
              </div>
              <div className="font-medium text-foreground">Bias Elimination</div>
            </div>
            <p className="text-sm text-muted-foreground">Identifies and eliminates algorithmic bias in detection</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="AlertCircle" className="w-5 h-5 text-primary" />
          Bias Detection & Elimination Workflows
        </h3>
        <div className="space-y-3">
          {data?.biasDetected > 0 ? (
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="AlertTriangle" className="w-5 h-5 text-orange-500" />
                <span className="font-medium text-foreground">{data?.biasDetected} Bias Patterns Detected</span>
              </div>
              <p className="text-sm text-muted-foreground">Automated bias elimination protocols are active and monitoring for systematic errors</p>
            </div>
          ) : (
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
                <span className="font-medium text-foreground">No Bias Detected</span>
              </div>
              <p className="text-sm text-muted-foreground">Algorithm is operating within acceptable fairness parameters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FalsePositiveAnalysisPanel;