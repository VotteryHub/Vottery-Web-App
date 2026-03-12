import React from 'react';
import Icon from '../../../components/AppIcon';

const MarketPulsePanel = ({ pulseData, onRefresh }) => {
  if (!pulseData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No market pulse data available</p>
      </div>
    );
  }

  const { currentSentiment, emergingTrends, sentimentShifts, marketMomentum, alertableEvents, realTimePredictions, confidenceScore, reasoning } = pulseData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Current Sentiment</h3>
            <Icon name="Activity" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {currentSentiment?.mood}
          </div>
          <p className="text-sm text-muted-foreground">{currentSentiment?.description}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Market Momentum</h3>
            <Icon name="TrendingUp" size={20} className="text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground mb-2">
            {marketMomentum?.direction}
          </div>
          <p className="text-sm text-muted-foreground">Velocity: {marketMomentum?.velocity}</p>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Confidence Score</h3>
            <Icon name="CheckCircle" size={20} className="text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500 mb-2">
            {(confidenceScore * 100)?.toFixed(0)}%
          </div>
          <p className="text-sm text-muted-foreground">Real-time accuracy</p>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} className="text-primary" />
          Emerging Trends (Last 24 Hours)
        </h3>
        <div className="space-y-3">
          {emergingTrends?.map((trend, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-foreground">{trend?.trend}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  trend?.velocity === 'rapid' ? 'bg-red-100 text-red-700' :
                  trend?.velocity === 'moderate'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {trend?.velocity} growth
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{trend?.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Mentions: {trend?.mentions}</span>
                <span>Engagement: {trend?.engagement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="AlertTriangle" size={20} className="text-yellow-500" />
            Significant Sentiment Shifts
          </h3>
          <div className="space-y-3">
            {sentimentShifts?.map((shift, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-foreground">{shift?.category}</p>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    shift?.direction === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Icon name={shift?.direction === 'positive' ? 'TrendingUp' : 'TrendingDown'} size={14} />
                    {shift?.magnitude}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{shift?.trigger}</p>
                <p className="text-xs text-muted-foreground">Detected: {shift?.detectedAt}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="Bell" size={20} className="text-red-500" />
            Alertable Events
          </h3>
          <div className="space-y-3">
            {alertableEvents?.map((event, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-red-700">{event?.event}</p>
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    {event?.severity}
                  </span>
                </div>
                <p className="text-sm text-red-600 mb-2">{event?.description}</p>
                <p className="text-xs text-red-500">Action Required: {event?.actionRequired}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Clock" size={20} className="text-primary" />
          Real-Time Predictions (Next 24-48 Hours)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {realTimePredictions?.map((prediction, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-semibold text-muted-foreground mb-2">{prediction?.timeframe}</p>
              <p className="font-medium text-foreground mb-2">{prediction?.prediction}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${prediction?.probability * 100}%` }}></div>
                </div>
                <span className="text-xs font-medium text-foreground">{(prediction?.probability * 100)?.toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Brain" size={20} className="text-primary" />
          Real-Time Market Analysis
        </h3>
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-foreground leading-relaxed">{reasoning}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="CheckCircle" size={16} className="text-green-500" />
            <span className="text-sm text-muted-foreground">
              Live Analysis Confidence: <span className="font-semibold text-foreground">{(confidenceScore * 100)?.toFixed(1)}%</span>
            </span>
          </div>
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
          >
            <Icon name="RefreshCw" size={14} />
            <span>Refresh Pulse</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketPulsePanel;