import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const VotingSessionHeatmapsPanel = ({ data, timeframe }) => {
  const [heatmapView, setHeatmapView] = useState('click');

  const getIntensityColor = (intensity) => {
    if (intensity >= 80) return 'bg-red-500';
    if (intensity >= 60) return 'bg-orange-500';
    if (intensity >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const heatmapViews = [
    { id: 'click', label: 'Click Density', icon: 'MousePointer2' },
    { id: 'attention', label: 'Attention Zones', icon: 'Eye' },
    { id: 'time', label: 'Time-on-Task', icon: 'Clock' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Icon name="Flame" size={24} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Voting Session Heatmaps</h2>
            <p className="text-sm text-muted-foreground">
              Interaction patterns with click density mapping • {timeframe} analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
          <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">Live</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {heatmapViews?.map((view) => (
          <button
            key={view?.id}
            onClick={() => setHeatmapView(view?.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              heatmapView === view?.id
                ? 'bg-primary text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Icon name={view?.icon} size={16} />
            {view?.label}
          </button>
        ))}
      </div>

      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg p-8 mb-6" style={{ height: '500px' }}>
        <div className="absolute inset-8 bg-white dark:bg-gray-950 rounded-lg shadow-inner border-2 border-gray-200 dark:border-gray-700">
          {data?.votingZones?.map((zone, idx) => (
            <div
              key={idx}
              className="absolute rounded-full opacity-60 blur-xl transition-all duration-500"
              style={{
                left: `${zone?.x}%`,
                top: `${zone?.y}%`,
                width: `${zone?.intensity}px`,
                height: `${zone?.intensity}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className={`w-full h-full rounded-full ${getIntensityColor(zone?.intensity)}`} />
            </div>
          ))}

          {data?.votingZones?.map((zone, idx) => (
            <div
              key={`marker-${idx}`}
              className="absolute group"
              style={{
                left: `${zone?.x}%`,
                top: `${zone?.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-3 h-3 bg-white border-2 border-purple-600 rounded-full shadow-lg" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                <p className="font-semibold">{zone?.label}</p>
                <p className="text-gray-300">{zone?.intensity}% intensity</p>
                <p className="text-gray-300">{zone?.clicks?.toLocaleString()} clicks</p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-foreground mb-2">Intensity Scale</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-xs text-muted-foreground">80-100% (Hot)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded" />
              <span className="text-xs text-muted-foreground">60-79% (Warm)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded" />
              <span className="text-xs text-muted-foreground">40-59% (Moderate)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-xs text-muted-foreground">&lt;40% (Cool)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-muted rounded-lg">
          <Icon name="Clock" size={20} className="mx-auto text-primary mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.sessionMetrics?.averageTimeOnTask}</p>
          <p className="text-xs text-muted-foreground">Avg. Time on Task</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <Icon name="Activity" size={20} className="mx-auto text-secondary mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.sessionMetrics?.interactionSequences}</p>
          <p className="text-xs text-muted-foreground">Interaction Sequences</p>
        </div>
        <div className="text-center p-4 bg-muted rounded-lg">
          <Icon name="Target" size={20} className="mx-auto text-success mb-2" />
          <p className="text-2xl font-bold text-foreground">{data?.sessionMetrics?.attentionScore}%</p>
          <p className="text-xs text-muted-foreground">Attention Score</p>
        </div>
      </div>
    </div>
  );
};

export default VotingSessionHeatmapsPanel;