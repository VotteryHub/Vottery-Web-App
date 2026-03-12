import React from 'react';
import Icon from '../../../components/AppIcon';

const FeedbackLoopEnginePanel = ({ data }) => {
  if (!data) {
    return (
      <div className="bg-card rounded-lg p-6 text-center text-muted-foreground">
        <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No feedback loop data available</p>
      </div>
    );
  }

  const processingRate = ((data?.feedbackProcessed / data?.resolvedIncidents) * 100)?.toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Total Incidents</span>
            <Icon name="AlertCircle" className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.totalIncidents?.toLocaleString()}</div>
          <div className="mt-2 text-xs text-muted-foreground">
            Resolved: {data?.resolvedIncidents?.toLocaleString()}
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Feedback Processed</span>
            <Icon name="CheckCircle" className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.feedbackProcessed?.toLocaleString()}</div>
          <div className="mt-2 text-xs text-green-500">
            {processingRate}% processing rate
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Algorithm Updates</span>
            <Icon name="RefreshCw" className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-foreground">{data?.algorithmUpdates}</div>
          <div className="mt-2 text-xs text-blue-500">
            Continuous improvement
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Activity" className="w-5 h-5 text-primary" />
          Automated Learning from Resolution Outcomes
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Icon name="ThumbsUp" className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Human Moderator Decisions</div>
                <div className="text-sm text-muted-foreground">Learning from expert judgments</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{Math.floor(data?.feedbackProcessed * 0.45)}</div>
              <div className="text-xs text-muted-foreground">Decisions processed</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Icon name="FileText" className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Appeal Results</div>
                <div className="text-sm text-muted-foreground">Refining detection from appeals</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{Math.floor(data?.feedbackProcessed * 0.28)}</div>
              <div className="text-xs text-muted-foreground">Appeals analyzed</div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Icon name="Target" className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-foreground">Incident Resolution Outcomes</div>
                <div className="text-sm text-muted-foreground">Pattern recognition refinement</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{Math.floor(data?.feedbackProcessed * 0.27)}</div>
              <div className="text-xs text-muted-foreground">Outcomes integrated</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Sliders" className="w-5 h-5 text-primary" />
          Algorithm Weight Adjustments
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Learning Rate</span>
              <span className="text-sm font-medium text-foreground">{(data?.learningRate * 100)?.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: `${data?.learningRate * 100}%` }}></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Last Update</div>
              <div className="text-sm font-medium text-foreground">{new Date(data?.lastUpdate)?.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Update Frequency</div>
              <div className="text-sm font-medium text-foreground">Real-time</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoopEnginePanel;