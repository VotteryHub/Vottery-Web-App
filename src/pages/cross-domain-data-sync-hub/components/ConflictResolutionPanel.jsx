import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConflictResolutionPanel = ({ conflicts, onResolve }) => {
  const [expandedId, setExpandedId] = useState(null);

  if (!conflicts?.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Conflict Resolution</h3>
        <div className="text-center py-8">
          <Icon name="CheckCircle" size={40} className="text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No conflicts detected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Conflict Resolution</h3>
        <span className="bg-red-500/10 text-red-500 text-xs font-medium px-2 py-1 rounded-full">
          {conflicts?.length} conflict{conflicts?.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="space-y-3">
        {conflicts?.map(conflict => (
          <div key={conflict?.id} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedId(expandedId === conflict?.id ? null : conflict?.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" size={16} className="text-yellow-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{conflict?.table} — Row {conflict?.rowId}</p>
                  <p className="text-xs text-muted-foreground">{conflict?.description}</p>
                </div>
              </div>
              <Icon name={expandedId === conflict?.id ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0" />
            </button>

            {expandedId === conflict?.id && (
              <div className="border-t border-border p-4 bg-muted/20">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-blue-500 mb-2">Local Version</p>
                    <pre className="text-xs text-foreground whitespace-pre-wrap">{JSON.stringify(conflict?.localData, null, 2)}</pre>
                  </div>
                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-purple-500 mb-2">Remote Version</p>
                    <pre className="text-xs text-foreground whitespace-pre-wrap">{JSON.stringify(conflict?.remoteData, null, 2)}</pre>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onResolve?.(conflict?.id, 'local')}
                    className="flex-1 py-2 text-xs font-medium bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
                  >
                    Keep Local
                  </button>
                  <button
                    onClick={() => onResolve?.(conflict?.id, 'remote')}
                    className="flex-1 py-2 text-xs font-medium bg-purple-500/10 text-purple-500 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors"
                  >
                    Keep Remote
                  </button>
                  <button
                    onClick={() => onResolve?.(conflict?.id, 'merge')}
                    className="flex-1 py-2 text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors"
                  >
                    Merge
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConflictResolutionPanel;
