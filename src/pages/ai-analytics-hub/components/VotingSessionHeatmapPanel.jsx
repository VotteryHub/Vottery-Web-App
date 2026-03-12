import React from 'react';
import Icon from '../../../components/AppIcon';

const VotingSessionHeatmapPanel = ({ heatmapData = [], timeframe }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getHeatmapColor = (value) => {
    if (value >= 80) return 'bg-red-500';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getHeatmapOpacity = (value) => {
    return Math.min(value / 100, 1);
  };

  const getDataPoint = (day, hour) => {
    return heatmapData?.find(d => d?.day === day && d?.hour === hour) || { value: 0, sessions: 0 };
  };

  const peakHour = heatmapData?.reduce((max, curr) => 
    (curr?.value > max?.value ? curr : max), { value: 0, hour: 0, day: '' }
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground mb-1">Voting Session Heatmap</h2>
          <p className="text-sm text-muted-foreground">User activity patterns by day and hour</p>
        </div>
        <Icon name="Activity" className="w-6 h-6 text-primary" />
      </div>

      {/* Peak Activity Insight */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Peak Activity</span>
        </div>
        <p className="text-foreground">
          <span className="font-bold">{peakHour?.day}</span> at{' '}
          <span className="font-bold">{peakHour?.hour}:00</span> with{' '}
          <span className="font-bold">{peakHour?.sessions}</span> sessions
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Hour Labels */}
          <div className="flex mb-2">
            <div className="w-12" />
            {hours?.map(hour => (
              <div key={hour} className="flex-1 text-center">
                <span className="text-xs text-muted-foreground">
                  {hour % 6 === 0 ? `${hour}h` : ''}
                </span>
              </div>
            ))}
          </div>

          {/* Heatmap Rows */}
          {days?.map(day => (
            <div key={day} className="flex items-center mb-1">
              <div className="w-12 text-xs font-medium text-muted-foreground">{day}</div>
              {hours?.map(hour => {
                const dataPoint = getDataPoint(day, hour);
                return (
                  <div
                    key={`${day}-${hour}`}
                    className="flex-1 aspect-square mx-0.5 rounded-sm cursor-pointer transition-transform hover:scale-110 relative group"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${getHeatmapOpacity(dataPoint?.value)})`
                    }}
                    title={`${day} ${hour}:00 - ${dataPoint?.sessions} sessions`}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {dataPoint?.sessions} sessions
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Activity Level:</span>
          <div className="flex items-center gap-1">
            {[20, 40, 60, 80, 100]?.map(value => (
              <div
                key={value}
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: `rgba(59, 130, 246, ${value / 100})` }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground ml-2">Low → High</span>
        </div>
      </div>
    </div>
  );
};

export default VotingSessionHeatmapPanel;