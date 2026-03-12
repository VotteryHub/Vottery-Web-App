import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const CrossSystemCorrelationPanel = ({ realtimeEvents }) => {
  const [correlations, setCorrelations] = useState([
    {
      id: 1,
      eventChain: ['vote.cast', 'payment.succeeded', 'winner.announced'],
      systems: ['Voting System', 'Payment Gateway', 'Notification Service'],
      status: 'completed',
      duration: '2.3s',
    },
    {
      id: 2,
      eventChain: ['election.created', 'moderation.approved', 'election.published'],
      systems: ['Election Service', 'Moderation System', 'Publishing Service'],
      status: 'in_progress',
      duration: '1.8s',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Real-Time Event Matching */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Network" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Real-Time Event Matching Across Services
          </h3>
        </div>

        <div className="space-y-4">
          {correlations?.map((correlation) => (
            <div key={correlation?.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    correlation?.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  }`}>
                    {correlation?.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{correlation?.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {correlation?.eventChain?.map((event, index) => (
                  <React.Fragment key={index}>
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                        <Icon name="Zap" size={20} className="text-primary" />
                      </div>
                      <div className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center">{event}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 text-center mt-1">
                        {correlation?.systems?.[index]}
                      </div>
                    </div>
                    {index < correlation?.eventChain?.length - 1 && (
                      <Icon name="ArrowRight" size={20} className="text-gray-400 flex-shrink-0" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dependency Tracking */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="GitBranch" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Dependency Tracking
          </h3>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Database" size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Supabase Database</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Triggers webhook on INSERT/UPDATE/DELETE</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Depends on: None (root trigger)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Webhook" size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">External API</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Receives transformed payload</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Depends on: Supabase Database, Transformation Service</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name="Bell" size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Notification Service</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Sends alerts based on event outcome</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <Icon name="ArrowRight" size={14} />
                    <span>Depends on: External API response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Automated Workflow Orchestration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Workflow" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Automated Workflow Orchestration
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Payment Processing', steps: 5, status: 'active', executions: 1247 },
            { name: 'Winner Notification', steps: 3, status: 'active', executions: 892 },
            { name: 'Compliance Reporting', steps: 7, status: 'paused', executions: 456 },
            { name: 'Fraud Detection', steps: 4, status: 'active', executions: 2134 },
          ]?.map((workflow, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{workflow?.name}</div>
                <span className={`text-xs px-2 py-1 rounded ${
                  workflow?.status === 'active' ?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                }`}>
                  {workflow?.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{workflow?.steps} steps</span>
                <span>{workflow?.executions?.toLocaleString()} executions</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Comprehensive Audit Trails */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="FileText" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Comprehensive Audit Trails
          </h3>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
          {realtimeEvents?.slice(0, 10)?.map((event, index) => (
            <div key={index} className="text-gray-700 dark:text-gray-300">
              [{new Date()?.toISOString()}] Event: {event?.eventType || 'webhook.triggered'} | Status: {event?.new?.status || 'delivered'}
            </div>
          ))}
          {realtimeEvents?.length === 0 && (
            <div className="text-gray-500 dark:text-gray-400 text-center py-4">
              No recent events. Waiting for webhook activity...
            </div>
          )}
        </div>
      </div>
      {/* Cross-System Event Correlation Matrix */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Grid3x3" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Cross-System Event Correlation Matrix
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">System</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Events</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Success Rate</th>
                <th className="text-center py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Avg Latency</th>
              </tr>
            </thead>
            <tbody>
              {[
                { system: 'Supabase', events: 1247, successRate: 99.8, latency: 45 },
                { system: 'Payment Gateway', events: 892, successRate: 98.2, latency: 320 },
                { system: 'Email Service', events: 2134, successRate: 99.5, latency: 180 },
                { system: 'SMS Provider', events: 456, successRate: 97.1, latency: 250 },
              ]?.map((row, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 text-gray-900 dark:text-gray-100">{row?.system}</td>
                  <td className="py-3 px-4 text-center text-gray-900 dark:text-gray-100">{row?.events?.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      row?.successRate >= 99
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {row?.successRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-900 dark:text-gray-100">{row?.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CrossSystemCorrelationPanel;