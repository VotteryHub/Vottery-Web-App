import React from 'react';
import { Workflow, ArrowRight, CheckCircle, Clock, FileText } from 'lucide-react';

const MultiStepWorkflowPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Workflow className="w-5 h-5" />
          Multi-Step Workflow Engine
        </h3>
        <p className="text-neutral-600 mb-6">
          Claude-powered autonomous dispute resolution chains with comprehensive reasoning documentation
        </p>
      </div>

      <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Dispute Resolution Workflow</h4>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-neutral-800">Evidence Collection</p>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-neutral-600">Automated gathering of transaction records, user communications, and policy documents</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-neutral-800">Stakeholder Analysis</p>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-neutral-600">Identification of all parties, roles, and communication requirements</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-neutral-800">Policy Interpretation</p>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-neutral-600">Analysis of applicable policies, precedents, and regulatory requirements</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-neutral-800">Decision Recommendation</p>
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <p className="text-sm text-neutral-600">Generation of decision with confidence scoring and alternative options</p>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRight className="w-5 h-5 text-neutral-400" />
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-neutral-300 text-neutral-600 rounded-full flex items-center justify-center font-semibold text-sm">
              5
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-neutral-800">Documentation Generation</p>
                <FileText className="w-4 h-4 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-600">Comprehensive audit trail with reasoning chains and decision documentation</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4">Workflow Templates</h4>
          <ul className="space-y-2 text-sm text-neutral-700">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Payment Dispute Resolution
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Fraud Investigation
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Policy Violation Review
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              Account Suspension Appeal
            </li>
          </ul>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <h4 className="font-semibold text-neutral-800 mb-4">Execution Monitoring</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Active Workflows</span>
              <span className="font-semibold text-neutral-800">3</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Avg Execution Time</span>
              <span className="font-semibold text-neutral-800">3.2 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded">
              <span className="text-sm text-neutral-700">Success Rate</span>
              <span className="font-semibold text-green-600">92.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepWorkflowPanel;