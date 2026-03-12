import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { aiPerformanceOrchestrationService } from '../../../services/aiPerformanceOrchestrationService';

const OneClickResolutionPanel = ({ analyses }) => {
  const [executing, setExecuting] = useState(false);
  const [executedActions, setExecutedActions] = useState([]);

  const handleOneClickResolution = async (incident) => {
    setExecuting(true);
    try {
      const { data, error } = await aiPerformanceOrchestrationService?.executeOneClickResolution(incident);
      if (error) throw error;
      
      setExecutedActions([...executedActions, data]);
      alert('Resolution workflow initiated successfully!');
    } catch (error) {
      console.error('Error executing resolution:', error);
      alert('Failed to execute resolution workflow');
    } finally {
      setExecuting(false);
    }
  };

  const suggestedIncidents = [
    {
      type: 'performance_degradation',
      severity: 'high',
      description: 'API response time increased by 45% in last hour',
      actions: ['Scale API servers', 'Clear cache', 'Restart slow instances'],
      estimatedResolutionTime: '5 minutes',
    },
    {
      type: 'database_overload',
      severity: 'medium',
      description: 'Database connection pool at 92% capacity',
      actions: ['Increase connection pool', 'Optimize slow queries', 'Add read replicas'],
      estimatedResolutionTime: '10 minutes',
    },
    {
      type: 'fraud_spike',
      severity: 'high',
      description: 'Unusual fraud pattern detected in Zone 3',
      actions: ['Enable enhanced verification', 'Notify security team', 'Increase monitoring'],
      estimatedResolutionTime: '2 minutes',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={24} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              1-Click Incident Resolution
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              AI-powered automated incident response with pre-approved resolution workflows
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Resolutions */}
      <div className="space-y-4">
        {suggestedIncidents?.map((incident, index) => {
          const severityColor = incident?.severity === 'high' ? 'red' : incident?.severity === 'medium' ? 'yellow' : 'blue';
          
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-lg bg-${severityColor}-100 dark:bg-${severityColor}-900/40 flex items-center justify-center flex-shrink-0`}>
                    <Icon name="AlertTriangle" size={24} className={`text-${severityColor}-600 dark:text-${severityColor}-400`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 capitalize">
                        {incident?.type?.replace(/_/g, ' ')}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full bg-${severityColor}-100 dark:bg-${severityColor}-900/40 text-${severityColor}-700 dark:text-${severityColor}-400 font-medium uppercase`}>
                        {incident?.severity}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                      {incident?.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        Automated Actions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {incident?.actions?.map((action, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full flex items-center gap-1"
                          >
                            <Icon name="Check" size={12} />
                            {action}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Icon name="Clock" size={14} />
                      <span>Est. Resolution Time: {incident?.estimatedResolutionTime}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => handleOneClickResolution(incident)}
                  disabled={executing}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {executing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Icon name="Zap" size={18} />
                      Resolve Now
                    </>
                  )}
                </button>
              </div>

              {/* AI Confidence */}
              {analyses && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">AI Confidence Score:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: '92%' }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">92%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Executed Actions History */}
      {executedActions?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Icon name="History" size={20} />
            Recently Executed Actions
          </h3>
          <div className="space-y-3">
            {executedActions?.map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Icon name="CheckCircle" size={20} className="text-green-600 dark:text-green-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {action?.incidentType} - Resolution Initiated
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(action?.detectedAt)?.toLocaleString()}
                  </div>
                </div>
                <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full">
                  Executing
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OneClickResolutionPanel;
