import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ConditionalRoutingPanel = ({ webhooks, onUpdate }) => {
  const [selectedWebhook, setSelectedWebhook] = useState(null);
  const [routingRules, setRoutingRules] = useState([
    {
      id: 1,
      name: 'High Priority Incidents',
      condition: 'payload.threatLevel === "critical"',
      destination: 'https://api.example.com/critical-alerts',
      active: true,
    },
    {
      id: 2,
      name: 'Payment Events',
      condition: 'payload.eventType === "payment.succeeded"',
      destination: 'https://api.example.com/payments',
      active: true,
    },
    {
      id: 3,
      name: 'Winner Notifications',
      condition: 'payload.eventType === "winner.announced"',
      destination: 'https://api.example.com/notifications',
      active: false,
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Conditional Routing Engine */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="GitBranch" size={24} className="text-primary" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conditional Routing Engine
            </h3>
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm font-medium">
            <Icon name="Plus" size={16} />
            Add Rule
          </button>
        </div>

        <div className="space-y-4">
          {routingRules?.map((rule) => (
            <div key={rule?.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{rule?.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      rule?.active
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' :'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                    }`}>
                      {rule?.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Condition:</span>
                      <div className="mt-1 bg-gray-100 dark:bg-gray-800 rounded px-3 py-2 font-mono text-xs text-gray-800 dark:text-gray-200">
                        {rule?.condition}
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Destination:</span>
                      <div className="mt-1 text-xs text-blue-600 dark:text-blue-400 break-all">{rule?.destination}</div>
                    </div>
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
            </div>
          ))}
        </div>
      </div>

      {/* Visual Workflow Builder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Workflow" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Visual Workflow Builder
          </h3>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-8">
          <div className="flex items-center justify-center gap-8">
            {/* Trigger */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-2">
                <Icon name="Zap" size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Webhook Trigger</span>
            </div>

            <Icon name="ArrowRight" size={24} className="text-gray-400" />

            {/* Condition */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-2">
                <Icon name="GitBranch" size={32} className="text-purple-600 dark:text-purple-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Routing Logic</span>
            </div>

            <Icon name="ArrowRight" size={24} className="text-gray-400" />

            {/* Action */}
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-2">
                <Icon name="Send" size={32} className="text-green-600 dark:text-green-400" />
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Destination</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
              Open Workflow Designer
            </button>
          </div>
        </div>
      </div>

      {/* Drag-and-Drop Routing Logic */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Icon name="Move" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Drag-and-Drop Routing Logic
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Available Conditions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Available Conditions</h4>
            <div className="space-y-2">
              {[
                { label: 'Payload Content', icon: 'FileText' },
                { label: 'System Status', icon: 'Activity' },
                { label: 'Business Rules', icon: 'Briefcase' },
                { label: 'Time-based', icon: 'Clock' },
              ]?.map((condition, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 cursor-move hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Icon name={condition?.icon} size={20} className="text-gray-600 dark:text-gray-400" />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{condition?.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Routing Canvas */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Routing Canvas</h4>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 min-h-[200px] flex items-center justify-center">
              <div className="text-center">
                <Icon name="MousePointer" size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Drag conditions here to build routing logic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionalRoutingPanel;