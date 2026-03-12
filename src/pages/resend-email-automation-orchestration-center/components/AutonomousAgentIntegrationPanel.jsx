import React, { useState } from 'react';
import { Cpu, Workflow, CheckCircle, Activity } from 'lucide-react';

const AutonomousAgentIntegrationPanel = () => {
  const [agents] = useState([
    { id: 1, name: 'Claude Workflows', triggers: 847, emails: 2341, status: 'active', uptime: 99.8 },
    { id: 2, name: 'Perplexity Analysis', triggers: 634, emails: 1892, status: 'active', uptime: 99.5 },
    { id: 3, name: 'Cross-AI Coordination', triggers: 423, emails: 1567, status: 'active', uptime: 99.9 },
    { id: 4, name: 'OpenAI Processing', triggers: 756, emails: 2089, status: 'active', uptime: 99.7 }
  ]);

  const [stakeholderRouting] = useState({
    totalStakeholders: 247,
    activeRoutes: 89,
    routingAccuracy: 98.3,
    avgDeliveryTime: '1.8s'
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-50 rounded-lg">
            <Cpu className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Autonomous Agent Integration</h2>
            <p className="text-sm text-gray-600">Email triggers from AI workflows with intelligent routing</p>
          </div>
        </div>
      </div>

      {/* Agent Status */}
      <div className="space-y-3 mb-6">
        {agents?.map((agent) => (
          <div
            key={agent?.id}
            className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-teal-600" />
                <span className="font-medium text-gray-900">{agent?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600 font-medium">ACTIVE</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Triggers</div>
                <div className="text-lg font-bold text-blue-600">{agent?.triggers}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Emails Sent</div>
                <div className="text-lg font-bold text-purple-600">{agent?.emails?.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Uptime</div>
                <div className="text-lg font-bold text-green-600">{agent?.uptime}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stakeholder Routing */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          Intelligent Stakeholder Routing
        </h3>
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">{stakeholderRouting?.totalStakeholders}</div>
            <div className="text-xs text-gray-600">Total Stakeholders</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{stakeholderRouting?.activeRoutes}</div>
            <div className="text-xs text-gray-600">Active Routes</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">{stakeholderRouting?.routingAccuracy}%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
            <div className="text-2xl font-bold text-teal-600">{stakeholderRouting?.avgDeliveryTime}</div>
            <div className="text-xs text-gray-600">Avg Delivery</div>
          </div>
        </div>
      </div>

      {/* Integration Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-teal-50 to-green-50 rounded-lg border border-teal-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="font-medium text-gray-900">All Agent Integrations Operational</div>
              <div className="text-xs text-gray-600 mt-1">Automated email triggers with intelligent stakeholder routing</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousAgentIntegrationPanel;