import React from 'react';
import { Users, Mail, Bell, CheckCircle, Clock } from 'lucide-react';

const StakeholderCoordinationPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Stakeholder Coordination
        </h3>
        <p className="text-neutral-600 mb-6">
          Automated communication workflows, notification cascades, and collaborative decision-making
        </p>
      </div>

      <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Communication Workflow</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-800">Initial Notification</p>
              <p className="text-sm text-neutral-600">Automated email to all parties with case details</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-800">Status Updates</p>
              <p className="text-sm text-neutral-600">Real-time notifications on workflow progress</p>
            </div>
            <Clock className="w-5 h-5 text-blue-600 animate-spin" />
          </div>

          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-neutral-800">Resolution Notification</p>
              <p className="text-sm text-neutral-600">Final decision communication with reasoning</p>
            </div>
            <div className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4">Escalation Protocols</h4>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <p className="font-medium text-neutral-800 text-sm">Low Confidence Decision</p>
              </div>
              <p className="text-xs text-neutral-600">Escalate to human reviewer when confidence &lt; 70%</p>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <p className="font-medium text-neutral-800 text-sm">High-Value Dispute</p>
              </div>
              <p className="text-xs text-neutral-600">Escalate when amount exceeds $10,000</p>
            </div>

            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <p className="font-medium text-neutral-800 text-sm">Policy Conflict</p>
              </div>
              <p className="text-xs text-neutral-600">Escalate when multiple policies conflict</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4">Intelligent Routing</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Case Complexity</span>
              <span className="text-xs font-medium text-neutral-800 bg-blue-100 px-2 py-1 rounded">High</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Severity Level</span>
              <span className="text-xs font-medium text-neutral-800 bg-orange-100 px-2 py-1 rounded">Medium</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Assigned Team</span>
              <span className="text-xs font-medium text-neutral-800 bg-purple-100 px-2 py-1 rounded">Fraud Team</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Collaborative Decision-Making</h4>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Multi-stakeholder input collection and synthesis
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Automated consensus building with conflict resolution
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Real-time collaboration tracking and documentation
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Intelligent routing based on case complexity and severity
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StakeholderCoordinationPanel;