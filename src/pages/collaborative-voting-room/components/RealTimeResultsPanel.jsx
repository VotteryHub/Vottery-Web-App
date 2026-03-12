import React from 'react';
import Icon from '../../../components/AppIcon';

const RealTimeResultsPanel = ({ options = [], totalVotes = 0 }) => {
  const sortedOptions = [...options]?.sort((a, b) => (b?.votes || 0) - (a?.votes || 0));
  const leadingOption = sortedOptions?.[0];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Real-Time Results</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg">
          <Icon name="TrendingUp" className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Live Updates</span>
        </div>
      </div>

      {/* Leading Option Highlight */}
      {leadingOption && (
        <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Trophy" className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Currently Leading</span>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">{leadingOption?.title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              {leadingOption?.votes} votes ({leadingOption?.percentage}%)
            </span>
          </div>
        </div>
      )}

      {/* Results Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Vote Distribution</h3>
        {sortedOptions?.map((option, index) => (
          <div key={option?.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                <span className="text-sm font-medium text-foreground">{option?.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{option?.votes} votes</span>
                <span className="text-sm font-bold text-foreground min-w-[3rem] text-right">
                  {option?.percentage}%
                </span>
              </div>
            </div>
            <div className="relative w-full bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                  index === 0
                    ? 'bg-gradient-to-r from-primary to-purple-500'
                    : index === 1
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                    : index === 2
                    ? 'bg-gradient-to-r from-green-400 to-green-600' :'bg-gradient-to-r from-gray-400 to-gray-600'
                }`}
                style={{ width: `${option?.percentage || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">{totalVotes}</p>
            <p className="text-xs text-muted-foreground">Total Votes Cast</p>
          </div>
          <div className="text-center p-3 bg-accent rounded-lg">
            <p className="text-2xl font-bold text-foreground">{options?.length}</p>
            <p className="text-xs text-muted-foreground">Options Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeResultsPanel;