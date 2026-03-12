import React from 'react';
import { CheckCircle, FileText, TrendingUp, Clock } from 'lucide-react';

const DecisionTrackingPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Autonomous Decision Tracking
        </h3>
        <p className="text-neutral-600 mb-6">
          Real-time workflow execution, decision rationale explanations, and comprehensive audit trails
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Total Decisions</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">124</p>
          <p className="text-xs text-neutral-500 mt-1">Last 30 days</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Avg Confidence</span>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">87%</p>
          <p className="text-xs text-neutral-500 mt-1">Decision confidence score</p>
        </div>

        <div className="p-6 bg-white rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-600 text-sm font-medium">Human Oversight</span>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-neutral-800">8</p>
          <p className="text-xs text-neutral-500 mt-1">Escalated for review</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Recent Decisions</h4>
        <div className="space-y-3">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-neutral-800">Payment Dispute #1247</span>
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Resolved</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Confidence</p>
                <p className="font-semibold text-neutral-800">92%</p>
              </div>
              <div>
                <p className="text-neutral-600">Decision</p>
                <p className="font-semibold text-neutral-800">Refund Approved</p>
              </div>
              <div>
                <p className="text-neutral-600">Time</p>
                <p className="font-semibold text-neutral-800">2.8 min</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-600 animate-spin" />
                <span className="font-medium text-neutral-800">Fraud Investigation #892</span>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">In Progress</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Confidence</p>
                <p className="font-semibold text-neutral-800">85%</p>
              </div>
              <div>
                <p className="text-neutral-600">Decision</p>
                <p className="font-semibold text-neutral-800">Analyzing...</p>
              </div>
              <div>
                <p className="text-neutral-600">Time</p>
                <p className="font-semibold text-neutral-800">1.5 min</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-neutral-800">Policy Violation #634</span>
              </div>
              <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Resolved</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Confidence</p>
                <p className="font-semibold text-neutral-800">94%</p>
              </div>
              <div>
                <p className="text-neutral-600">Decision</p>
                <p className="font-semibold text-neutral-800">Warning Issued</p>
              </div>
              <div>
                <p className="text-neutral-600">Time</p>
                <p className="font-semibold text-neutral-800">3.1 min</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-purple-600" />
          <h4 className="font-semibold text-neutral-800">Comprehensive Audit Trails</h4>
        </div>
        <ul className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Complete decision rationale with chain-of-thought reasoning
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Confidence scoring with alternative decision options
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Human oversight triggers for low-confidence decisions
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Timestamped workflow execution logs with full transparency
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            Regulatory compliance documentation for all decisions
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DecisionTrackingPanel;