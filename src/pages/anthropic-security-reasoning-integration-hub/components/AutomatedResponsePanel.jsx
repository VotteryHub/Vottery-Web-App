import React from 'react';
import Icon from '../../../components/AppIcon';

const AutomatedResponsePanel = ({ incident, incidents }) => {
  if (!incident && incidents?.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
        <Icon name="Zap" size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Active Incidents</h3>
        <p className="text-gray-600 dark:text-gray-400">Automated response workflows will appear here when incidents are detected</p>
      </div>
    );
  }

  const mockAutomatedResponses = [
    {
      id: 1,
      trigger: 'High Severity Incident Detected',
      action: 'Isolate Affected Systems',
      status: 'executed',
      confidence: 95,
      executedAt: new Date()?.toISOString(),
      result: 'Successfully isolated 3 affected systems'
    },
    {
      id: 2,
      trigger: 'Suspicious Authentication Pattern',
      action: 'Enable Enhanced Monitoring',
      status: 'in_progress',
      confidence: 88,
      executedAt: new Date()?.toISOString()
    },
    {
      id: 3,
      trigger: 'Vulnerability Chain Identified',
      action: 'Apply Security Patches',
      status: 'pending',
      confidence: 92,
      scheduledFor: new Date(Date.now() + 3600000)?.toISOString()
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <Icon name="Zap" size={24} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Automated Response Workflows</h3>
            <p className="text-gray-700 dark:text-gray-300">Claude-powered automated incident response with confidence scoring and audit trails</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">1</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Executed</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">1</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {mockAutomatedResponses?.map((response) => {
          const statusColors = {
            executed: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-700', text: 'text-green-600 dark:text-green-400' },
            in_progress: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-700', text: 'text-yellow-600 dark:text-yellow-400' },
            pending: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-700', text: 'text-blue-600 dark:text-blue-400' }
          };
          const colors = statusColors?.[response?.status];

          return (
            <div key={response?.id} className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${colors?.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon name="Zap" size={24} className={colors?.text} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{response?.action}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${colors?.bg} ${colors?.text} font-medium uppercase`}>
                      {response?.status?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="AlertCircle" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Trigger:</span>
                      <span className="text-sm text-gray-900 dark:text-gray-100">{response?.trigger}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Target" size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Confidence:</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{response?.confidence}%</span>
                    </div>
                    {response?.executedAt && (
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {response?.status === 'executed' ? 'Executed' : 'Started'}: {new Date(response?.executedAt)?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {response?.scheduledFor && (
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={16} className="text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Scheduled: {new Date(response?.scheduledFor)?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                  {response?.result && (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Result</div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{response?.result}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AutomatedResponsePanel;