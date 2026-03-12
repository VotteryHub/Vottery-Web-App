import React from 'react';
import Icon from '../../../components/AppIcon';

const AutonomousAgentPanel = ({ selectedIncident }) => {
  const workflows = [
    {
      id: 1,
      name: 'Dispute Resolution Chain',
      status: 'active',
      progress: 65,
      steps: ['Evidence Collection', 'Policy Analysis', 'Decision Generation', 'Stakeholder Notification'],
      currentStep: 2,
    },
    {
      id: 2,
      name: 'Evidence Analysis Sequence',
      status: 'completed',
      progress: 100,
      steps: ['Data Extraction', 'Pattern Recognition', 'Credibility Assessment', 'Report Generation'],
      currentStep: 4,
    },
    {
      id: 3,
      name: 'Automated Policy Enforcement',
      status: 'pending',
      progress: 0,
      steps: ['Policy Matching', 'Violation Detection', 'Action Execution', 'Audit Logging'],
      currentStep: 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Autonomous Agent Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Bot" size={20} />
          Claude Autonomous Agent Management
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Multi-step workflow execution with autonomous decision-making for routine cases
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Play" size={18} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">Active Workflows</span>
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">3</div>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="CheckCircle" size={18} className="text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-900 dark:text-green-300">Completed Today</span>
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">12</div>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Zap" size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-semibold text-purple-900 dark:text-purple-300">Avg. Resolution Time</span>
            </div>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.2m</div>
          </div>
        </div>
      </div>

      {/* Active Workflows */}
      <div className="space-y-4">
        {workflows?.map((workflow) => (
          <div
            key={workflow?.id}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  workflow?.status === 'active' ?'bg-blue-100 dark:bg-blue-900/20'
                    : workflow?.status === 'completed' ?'bg-green-100 dark:bg-green-900/20' :'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Icon
                    name={workflow?.status === 'active' ? 'Play' : workflow?.status === 'completed' ? 'CheckCircle' : 'Clock'}
                    size={20}
                    className={workflow?.status === 'active' ? 'text-blue-600 dark:text-blue-400' : workflow?.status === 'completed' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}
                  />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{workflow?.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Step {workflow?.currentStep} of {workflow?.steps?.length}
                  </p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                workflow?.status === 'active' ?'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : workflow?.status === 'completed' ?'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
              }`}>
                {workflow?.status?.toUpperCase()}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm font-bold text-primary">{workflow?.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${workflow?.progress}%` }}
                />
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {workflow?.steps?.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${
                    idx < workflow?.currentStep
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : idx === workflow?.currentStep
                      ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' :'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon
                      name={idx < workflow?.currentStep ? 'CheckCircle' : idx === workflow?.currentStep ? 'Loader' : 'Circle'}
                      size={14}
                      className={idx < workflow?.currentStep ? 'text-green-600' : idx === workflow?.currentStep ? 'text-blue-600 animate-spin' : 'text-gray-400'}
                    />
                    <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                      Step {idx + 1}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{step}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Human Oversight Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} />
          Human Oversight Controls
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="AlertCircle" size={18} className="text-yellow-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Manual Review for High-Risk Cases</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">Enabled</span>
              <div className="w-10 h-6 bg-green-500 rounded-full flex items-center px-1">
                <div className="w-4 h-4 bg-white rounded-full ml-auto" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="Pause" size={18} className="text-blue-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Emergency Stop Available</span>
            </div>
            <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition-colors">
              Stop All
            </button>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={18} className="text-purple-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Full Audit Trail Logging</span>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousAgentPanel;