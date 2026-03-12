import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, FileText, User } from 'lucide-react';

const AdminApprovalWorkflow = () => {
  const [pendingApprovals] = useState([
    {
      id: 1,
      reportTitle: 'Gemini Migration Opportunity - Q1 2026',
      submittedBy: 'AI Efficiency Analyzer',
      submittedDate: new Date(Date.now() - 86400000),
      savingsPotential: 42500,
      riskLevel: 'low',
      urgency: 'medium',
      justification: 'Analysis shows 60% of current OpenAI workload can be migrated to Gemini with 98.5% quality retention and 38% cost reduction.',
      costBenefitRatio: 8.5,
      implementationCost: 5000
    },
    {
      id: 2,
      reportTitle: 'Cost Optimization Analysis - OpenAI Workload',
      submittedBy: 'AI Efficiency Analyzer',
      submittedDate: new Date(Date.now() - 172800000),
      savingsPotential: 38200,
      riskLevel: 'medium',
      urgency: 'high',
      justification: 'High-volume tasks showing 45% cost inefficiency. Gemini can handle these tasks with minimal performance impact.',
      costBenefitRatio: 7.2,
      implementationCost: 5300
    },
    {
      id: 3,
      reportTitle: 'Perplexity Task Redistribution Strategy',
      submittedBy: 'AI Efficiency Analyzer',
      submittedDate: new Date(Date.now() - 259200000),
      savingsPotential: 46750,
      riskLevel: 'low',
      urgency: 'low',
      justification: 'Perplexity showing highest cost-per-task ratio. Strategic redistribution to Gemini recommended for non-critical tasks.',
      costBenefitRatio: 9.1,
      implementationCost: 5150
    }
  ]);

  const [approvalHistory] = useState([
    {
      id: 1,
      reportTitle: 'Anthropic Workload Optimization',
      decision: 'approved',
      approvedBy: 'Admin User',
      decisionDate: new Date(Date.now() - 604800000),
      actualSavings: 35400
    },
    {
      id: 2,
      reportTitle: 'Emergency Cost Reduction Plan',
      decision: 'rejected',
      approvedBy: 'Admin User',
      decisionDate: new Date(Date.now() - 1209600000),
      rejectionReason: 'Quality concerns - requires further analysis'
    }
  ]);

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'low': return 'bg-blue-100 text-blue-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Approval Workflow</h2>
        <p className="text-slate-600">Review and authorize Gemini takeover recommendations with detailed justification and risk assessment</p>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Pending Takeover Recommendations ({pendingApprovals?.length})
          </h3>
        </div>
        <div className="divide-y divide-slate-200">
          {pendingApprovals?.map((approval) => (
            <div key={approval?.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <FileText className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{approval?.reportTitle}</h4>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {approval?.submittedBy}
                      </span>
                      <span>•</span>
                      <span>{approval?.submittedDate?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(approval?.riskLevel)}`}>
                    {approval?.riskLevel?.toUpperCase()} RISK
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(approval?.urgency)}`}>
                    {approval?.urgency?.toUpperCase()} URGENCY
                  </span>
                </div>
              </div>

              {/* Justification */}
              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <div className="font-medium text-slate-900 mb-2">Justification</div>
                <div className="text-sm text-slate-700">{approval?.justification}</div>
              </div>

              {/* Financial Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-xs text-green-600 font-medium mb-1">Savings Potential</div>
                  <div className="text-xl font-bold text-green-700">${approval?.savingsPotential?.toLocaleString()}</div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <div className="text-xs text-blue-600 font-medium mb-1">Implementation Cost</div>
                  <div className="text-xl font-bold text-blue-700">${approval?.implementationCost?.toLocaleString()}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-purple-600 font-medium mb-1">Cost-Benefit Ratio</div>
                  <div className="text-xl font-bold text-purple-700">{approval?.costBenefitRatio}:1</div>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <div className="text-xs text-emerald-600 font-medium mb-1">Net Savings</div>
                  <div className="text-xl font-bold text-emerald-700">${(approval?.savingsPotential - approval?.implementationCost)?.toLocaleString()}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Approve Takeover
                </button>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Reject
                </button>
                <button className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  View Full Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Approval History</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {approvalHistory?.map((history) => (
            <div key={history?.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    history?.decision === 'approved' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {history?.decision === 'approved' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{history?.reportTitle}</div>
                    <div className="text-sm text-slate-600">
                      {history?.decision === 'approved' ? 'Approved' : 'Rejected'} by {history?.approvedBy} on {history?.decisionDate?.toLocaleDateString()}
                    </div>
                    {history?.decision === 'approved' && history?.actualSavings && (
                      <div className="text-sm text-green-600 font-medium mt-1">
                        Actual Savings: ${history?.actualSavings?.toLocaleString()}
                      </div>
                    )}
                    {history?.decision === 'rejected' && history?.rejectionReason && (
                      <div className="text-sm text-red-600 mt-1">
                        Reason: {history?.rejectionReason}
                      </div>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  history?.decision === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {history?.decision?.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Approval Guidelines */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Approval Guidelines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div className="text-sm text-slate-700">
                <span className="font-medium">Cost-Benefit Ratio:</span> Minimum 5:1 recommended
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div className="text-sm text-slate-700">
                <span className="font-medium">Risk Assessment:</span> Low-Medium risk preferred
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div className="text-sm text-slate-700">
                <span className="font-medium">Quality Retention:</span> Minimum 95% required
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div className="text-sm text-slate-700">
                <span className="font-medium">Implementation:</span> Phased rollout with monitoring
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminApprovalWorkflow;