import React from 'react';
import Icon from '../../../components/AppIcon';

const SuspiciousWinnerPatternsPanel = ({ patternsData, onRefresh }) => {
  if (!patternsData) {
    return (
      <div className="card p-8 text-center">
        <Icon name="AlertCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No suspicious pattern data available</p>
      </div>
    );
  }

  const { patterns } = patternsData;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Eye" size={20} className="text-primary" />
          Detected Suspicious Winner Patterns
        </h3>
        <div className="space-y-3">
          {patterns?.map((pattern) => (
            <div key={pattern?.id} className="p-4 bg-muted/50 rounded-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{pattern?.pattern}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pattern?.severity === 'high' ? 'bg-red-100 text-red-700' :
                  pattern?.severity === 'medium'? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {pattern?.severity} severity
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Occurrences</p>
                  <p className="font-medium text-foreground">{pattern?.occurrences}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Detected</p>
                  <p className="font-medium text-foreground">{pattern?.lastDetected}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuspiciousWinnerPatternsPanel;