import React from 'react';
import Icon from '../../../components/AppIcon';

function DecisionAuditTrailPanel({ disputes }) {
  const auditEvents = [
    {
      id: 'AUD-001',
      timestamp: '2024-01-21T10:30:00Z',
      disputeId: 'DSP-2024-001',
      action: 'AI Analysis Completed',
      actor: 'Claude AI',
      confidence: 87,
      details: 'Automated analysis with high confidence score',
    },
    {
      id: 'AUD-002',
      timestamp: '2024-01-21T09:15:00Z',
      disputeId: 'DSP-2024-002',
      action: 'Manual Review Initiated',
      actor: 'Admin User #42',
      confidence: null,
      details: 'Escalated for human review due to complexity',
    },
    {
      id: 'AUD-003',
      timestamp: '2024-01-20T16:45:00Z',
      disputeId: 'DSP-2024-003',
      action: 'Resolution Applied',
      actor: 'System',
      confidence: 92,
      details: 'Auto-resolved using template TPL-001',
    },
    {
      id: 'AUD-004',
      timestamp: '2024-01-20T14:20:00Z',
      disputeId: 'DSP-2024-001',
      action: 'Evidence Submitted',
      actor: 'User #4521',
      confidence: null,
      details: 'Additional documentation provided',
    },
    {
      id: 'AUD-005',
      timestamp: '2024-01-20T10:30:00Z',
      disputeId: 'DSP-2024-001',
      action: 'Dispute Created',
      actor: 'User #4521',
      confidence: null,
      details: 'Initial dispute submission',
    },
  ];

  const getActionColor = (action) => {
    if (action?.includes('Completed') || action?.includes('Applied')) return 'text-green-600 bg-green-100';
    if (action?.includes('Initiated') || action?.includes('Created')) return 'text-blue-600 bg-blue-100';
    if (action?.includes('Escalated')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="History" size={24} className="text-purple-600" />
          Decision Audit Trail
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Complete history of all dispute resolution actions, decisions, and modifications with full traceability
        </p>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <div className="space-y-6">
            {auditEvents?.map((event, index) => (
              <div key={event?.id} className="relative flex gap-4">
                <div className="flex-shrink-0 w-16 flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center z-10">
                    <Icon name="CheckCircle" size={16} className="text-white" />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {new Date(event.timestamp)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(event?.action)}`}>
                          {event?.action}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {event?.id}
                        </span>
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        Dispute: {event?.disputeId}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {event?.details}
                      </div>
                    </div>
                    {event?.confidence !== null && (
                      <div className="text-right ml-4">
                        <div className="text-lg font-bold text-purple-600">{event?.confidence}%</div>
                        <div className="text-xs text-gray-500">Confidence</div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Icon name="User" size={12} />
                    <span>{event?.actor}</span>
                    <span>•</span>
                    <Icon name="Calendar" size={12} />
                    <span>{new Date(event.timestamp)?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Audit Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="BarChart" size={20} className="text-purple-600" />
          Audit Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">127</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">AI Decisions</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">24</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Manual Reviews</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">14</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Escalations</div>
          </div>
        </div>
      </div>
      {/* Export Options */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Icon name="Download" size={20} className="text-purple-600" />
          Export Audit Trail
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Download complete audit logs for compliance reporting and external review
        </p>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2">
            <Icon name="FileText" size={16} />
            Export as PDF
          </button>
          <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium flex items-center gap-2">
            <Icon name="Table" size={16} />
            Export as CSV
          </button>
        </div>
      </div>
    </div>
  );
}

export default DecisionAuditTrailPanel;