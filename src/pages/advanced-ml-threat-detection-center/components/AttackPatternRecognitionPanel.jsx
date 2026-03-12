import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const AttackPatternRecognitionPanel = () => {
  const [patterns, setPatterns] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAttackPatterns();

    const handleRefresh = () => loadAttackPatterns();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadAttackPatterns = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.recognizeAttackPatterns();
      setPatterns(data);
    } catch (error) {
      console.error('Failed to load attack patterns:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Analyzing attack patterns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Detected Attack Patterns */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Target" size={20} />
          Sophisticated Attack Patterns
        </h3>
        <div className="space-y-3">
          {patterns?.detectedPatterns?.map((pattern, index) => (
            <div key={index} className="border-2 border-orange-500/30 rounded-lg p-4 bg-orange-50/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-3 py-1 rounded bg-orange-600 text-white">
                      {pattern?.category}
                    </span>
                    <span className="text-xs text-muted-foreground">{pattern?.detectedAt}</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-1">{pattern?.name}</h4>
                  <p className="text-sm text-muted-foreground">{pattern?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-600 mb-1">{pattern?.matchScore}%</div>
                  <div className="text-xs text-muted-foreground">Match Score</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-3">
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-sm font-bold text-foreground mb-1">{pattern?.occurrences}</div>
                  <div className="text-xs text-muted-foreground">Occurrences</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-sm font-bold text-foreground mb-1">{pattern?.targets}</div>
                  <div className="text-xs text-muted-foreground">Targets</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-sm font-bold text-foreground mb-1">{pattern?.successRate}%</div>
                  <div className="text-xs text-muted-foreground">Success Rate</div>
                </div>
                <div className="bg-white rounded p-2 text-center">
                  <div className="text-sm font-bold text-foreground mb-1">{pattern?.sophistication}</div>
                  <div className="text-xs text-muted-foreground">Sophistication</div>
                </div>
              </div>

              {pattern?.techniques && (
                <div className="bg-white rounded p-3">
                  <div className="text-xs font-semibold text-foreground mb-2">Attack Techniques:</div>
                  <div className="flex flex-wrap gap-2">
                    {pattern?.techniques?.map((technique, idx) => (
                      <span key={idx} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        {technique}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* MITRE ATT&CK Mapping */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          MITRE ATT&CK Framework Mapping
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {patterns?.mitreMapping?.map((tactic, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground text-sm">{tactic?.tactic}</h4>
                <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-600">
                  {tactic?.techniques?.length}
                </span>
              </div>
              <div className="space-y-1">
                {tactic?.techniques?.map((technique, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <Icon name="ChevronRight" size={12} />
                    {technique}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Evolution */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} />
          Attack Pattern Evolution
        </h3>
        <div className="space-y-3">
          {patterns?.evolution?.map((evolution, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{evolution?.pattern}</h4>
                <Icon name="TrendingUp" size={16} className="text-red-600" />
              </div>
              <p className="text-sm text-muted-foreground mb-3">{evolution?.description}</p>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">First Seen:</span>
                  <span className="ml-2 font-medium text-foreground">{evolution?.firstSeen}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Evolution Stage:</span>
                  <span className="ml-2 font-medium text-foreground">{evolution?.stage}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trend:</span>
                  <span className="ml-2 font-medium text-red-600">+{evolution?.trend}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttackPatternRecognitionPanel;