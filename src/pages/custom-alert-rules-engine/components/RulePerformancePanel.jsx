import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { alertRulesEngineService } from '../../../services/alertRulesEngineService';

const RulePerformancePanel = ({ rules }) => {
  const [performanceData, setPerformanceData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
  }, [rules]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);
      const data = {};
      
      for (const rule of rules) {
        const { data: perf } = await alertRulesEngineService?.getRulePerformance(rule?.id);
        if (perf) {
          data[rule?.id] = perf;
        }
      }
      
      setPerformanceData(data);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-12 text-center">
        <Icon name="Loader" size={48} className="mx-auto text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading performance data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="BarChart2" size={20} />
          Rule Performance Analytics
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {rules?.map((rule) => {
            const perf = performanceData?.[rule?.id];
            if (!perf) return null;

            return (
              <div key={rule?.id} className="p-4 border border-border rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">{rule?.ruleName}</h4>
                    <p className="text-xs text-muted-foreground">{rule?.category?.replace(/_/g, ' ')}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    rule?.isEnabled
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :'bg-gray-100 text-gray-600 dark:bg-gray-900/20'
                  }`}>
                    {rule?.isEnabled ? 'ACTIVE' : 'DISABLED'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total Triggers</p>
                    <p className="text-xl font-bold text-foreground">{perf?.totalTriggers}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Active</p>
                    <p className="text-xl font-bold text-orange-600">{perf?.activeTriggers}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Resolved</p>
                    <p className="text-xl font-bold text-green-600">{perf?.resolvedTriggers}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
                    <p className="text-xl font-bold text-foreground">
                      {(perf?.averageConfidence * 100)?.toFixed(0)}%
                    </p>
                  </div>
                </div>

                {perf?.lastTriggered && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon name="Clock" size={12} />
                    <span>Last triggered: {new Date(perf?.lastTriggered)?.toLocaleString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {rules?.length === 0 && (
        <div className="card text-center py-12">
          <Icon name="BarChart2" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">No performance data</h3>
          <p className="text-sm text-muted-foreground">Create alert rules to see performance analytics</p>
        </div>
      )}
    </div>
  );
};

export default RulePerformancePanel;