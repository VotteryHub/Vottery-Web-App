import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RetryPolicyPanel = ({ webhooks, onUpdate }) => {
  const [retryPolicies, setRetryPolicies] = useState([
    {
      id: 1,
      name: 'Standard Retry',
      strategy: 'exponential',
      maxAttempts: 5,
      initialDelay: 1000,
      maxDelay: 60000,
      active: true,
    },
    {
      id: 2,
      name: 'Critical Events',
      strategy: 'linear',
      maxAttempts: 10,
      initialDelay: 500,
      maxDelay: 30000,
      active: true,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Exponential Backoff Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="RefreshCw" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Exponential Backoff Configuration
            </h3>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium">
            <Icon name="Plus" size={16} />
            New Policy
          </button>
        </div>

        <div className="space-y-4">
          {retryPolicies?.map((policy) => (
            <div key={policy?.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{policy?.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      policy?.active
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {policy?.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded capitalize">
                      {policy?.strategy} Backoff
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                    <Icon name="Edit" size={16} />
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Attempts</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{policy?.maxAttempts}</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Initial Delay</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{policy?.initialDelay}ms</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Max Delay</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{policy?.maxDelay}ms</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Failure Handling Workflows */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="AlertTriangle" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Failure Handling Workflows
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Log to Database', description: 'Store failed events in failure_logs table', enabled: true },
            { label: 'Send Alert', description: 'Notify administrators via email/SMS', enabled: true },
            { label: 'Dead Letter Queue', description: 'Move to DLQ after max retries', enabled: true },
            { label: 'Circuit Breaker', description: 'Temporarily disable endpoint after threshold', enabled: false },
          ]?.map((workflow, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{workflow?.label}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{workflow?.description}</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={workflow?.enabled} className="sr-only peer" readOnly />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Dead Letter Queue Processing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Archive" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dead Letter Queue Processing
          </h3>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Queued Events</div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">23</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Oldest Event</div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">2 hours ago</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Retry Available</div>
              <div className="text-sm font-medium text-green-600 dark:text-green-400">18 events</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Retry All
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
              Clear Queue
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { event: 'payment.succeeded', attempts: 5, lastError: 'Connection timeout', age: '2h' },
            { event: 'winner.announced', attempts: 3, lastError: '503 Service Unavailable', age: '1h' },
          ]?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{item?.event}</div>
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">{item?.lastError}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {item?.attempts} attempts • {item?.age}
                </div>
                <button className="px-3 py-1 bg-primary text-white rounded text-xs font-medium hover:bg-primary/90 transition-colors">
                  Retry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Escalation Protocols */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Bell" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Automated Escalation Protocols
          </h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">1</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">After 3 failures</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">Email notification</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-orange-700 dark:text-orange-400">2</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">After 5 failures</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">SMS + Slack alert</span>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-red-700 dark:text-red-400">3</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">After 10 failures</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">PagerDuty incident</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetryPolicyPanel;