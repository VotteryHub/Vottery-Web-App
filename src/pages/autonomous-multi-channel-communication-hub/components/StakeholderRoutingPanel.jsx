import React from 'react';
import Icon from '../../../components/AppIcon';

const StakeholderRoutingPanel = ({ stakeholderGroups }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Route" size={20} />
          Intelligent Stakeholder Routing
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Automated routing based on incident type, severity, and stakeholder preferences
        </p>

        <div className="space-y-4">
          {stakeholderGroups?.map((group) => (
            <div key={group?.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Users" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100">{group?.groupName}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{group?.groupType}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  group?.isActive
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                }`}>
                  {group?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Members</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.members?.length || 0}</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Priority</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.priority || 'Standard'}</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Channel</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.preferredChannel || 'Email'}</div>
                </div>
                <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Escalation</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{group?.escalationLevel || 'L1'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routing Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="GitBranch" size={20} />
          Automated Routing Rules
        </h3>
        <div className="space-y-3">
          {[
            { type: 'Fraud Detection', route: 'Security Team', channel: 'Email + SMS', priority: 'High' },
            { type: 'Compliance Violation', route: 'Compliance Team', channel: 'Email', priority: 'Medium' },
            { type: 'Payment Dispute', route: 'Finance Team', channel: 'Email', priority: 'Medium' },
            { type: 'Critical Incident', route: 'All Teams', channel: 'Multi-Channel', priority: 'Critical' },
          ]?.map((rule, idx) => (
            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="ArrowRight" size={16} className="text-gray-400" />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rule?.type}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mx-2">→</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rule?.route}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{rule?.channel}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    rule?.priority === 'Critical' ?'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                      : rule?.priority === 'High' ?'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400' :'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  }`}>
                    {rule?.priority}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StakeholderRoutingPanel;