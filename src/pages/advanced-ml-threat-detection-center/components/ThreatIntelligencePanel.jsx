import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { mlThreatDetectionService } from '../../../services/mlThreatDetectionService';

const ThreatIntelligencePanel = () => {
  const [intelligence, setIntelligence] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreatIntelligence();

    const handleRefresh = () => loadThreatIntelligence();
    window.addEventListener('ml-threat-refresh', handleRefresh);
    return () => window.removeEventListener('ml-threat-refresh', handleRefresh);
  }, []);

  const loadThreatIntelligence = async () => {
    try {
      setLoading(true);
      const data = await mlThreatDetectionService?.getThreatIntelligence();
      setIntelligence(data);
    } catch (error) {
      console.error('Failed to load threat intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <Icon name="Loader" size={32} className="animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Aggregating threat intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Threat Intelligence Feeds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Rss" size={20} />
          Active Threat Intelligence Feeds
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {intelligence?.feeds?.map((feed, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{feed?.source}</h4>
                <span className={`w-2 h-2 rounded-full ${feed?.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>
              <div className="text-sm text-muted-foreground mb-2">{feed?.description}</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Last Update:</span>
                <span className="font-medium text-foreground">{feed?.lastUpdate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Global Threat Landscape */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Globe" size={20} />
          Global Threat Landscape
        </h3>
        <div className="space-y-3">
          {intelligence?.globalThreats?.map((threat, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground mb-1">{threat?.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{threat?.description}</p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-600">
                  {threat?.threatLevel}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Affected Regions:</span>
                  <span className="ml-2 font-medium text-foreground">{threat?.regions}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">First Seen:</span>
                  <span className="ml-2 font-medium text-foreground">{threat?.firstSeen}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Incidents:</span>
                  <span className="ml-2 font-medium text-foreground">{threat?.incidents}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trend:</span>
                  <span className="ml-2 font-medium text-foreground flex items-center gap-1">
                    <Icon name={threat?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={12} />
                    {threat?.trendPercentage}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Actor Profiles */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Users" size={20} />
          Known Threat Actor Profiles
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {intelligence?.threatActors?.map((actor, index) => (
            <div key={index} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{actor?.name}</h4>
                <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-600">
                  {actor?.sophistication}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{actor?.description}</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Primary Targets:</span>
                  <span className="font-medium text-foreground">{actor?.targets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Attack Methods:</span>
                  <span className="font-medium text-foreground">{actor?.methods}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Last Activity:</span>
                  <span className="font-medium text-foreground">{actor?.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreatIntelligencePanel;