import React, { useState } from 'react';
import { FileText, Download, Eye, TrendingUp, DollarSign, Clock } from 'lucide-react';

const AutomatedCaseReportGeneration = () => {
  const [reports] = useState([
    {
      id: 1,
      title: 'Gemini Migration Opportunity - Q1 2026',
      generatedDate: new Date(Date.now() - 86400000),
      savingsPotential: 42500,
      implementationTimeline: '6 weeks',
      status: 'pending_approval',
      riskLevel: 'low',
      confidenceScore: 94
    },
    {
      id: 2,
      title: 'Cost Optimization Analysis - OpenAI Workload',
      generatedDate: new Date(Date.now() - 172800000),
      savingsPotential: 38200,
      implementationTimeline: '4 weeks',
      status: 'pending_approval',
      riskLevel: 'medium',
      confidenceScore: 89
    },
    {
      id: 3,
      title: 'Perplexity Task Redistribution Strategy',
      generatedDate: new Date(Date.now() - 259200000),
      savingsPotential: 46750,
      implementationTimeline: '8 weeks',
      status: 'approved',
      riskLevel: 'low',
      confidenceScore: 92
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_approval': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Automated Case Report Generation</h2>
        <p className="text-slate-600">Comprehensive documentation of cost savings potential and Gemini takeover viability</p>
      </div>

      {/* Generate New Report */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Generate New Case Report</h3>
            <p className="text-sm text-slate-600">AI-powered analysis of current efficiency metrics and cost optimization opportunities</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Generated Case Reports</h3>
        </div>
        <div className="divide-y divide-slate-200">
          {reports?.map((report) => (
            <div key={report?.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">{report?.title}</h4>
                    <div className="text-sm text-slate-600">Generated: {report?.generatedDate?.toLocaleDateString()}</div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(report?.status)}`}>
                  {report?.status?.replace('_', ' ')?.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <div>
                    <div className="text-xs text-slate-600">Savings Potential</div>
                    <div className="font-semibold text-slate-900">${report?.savingsPotential?.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <div className="text-xs text-slate-600">Timeline</div>
                    <div className="font-semibold text-slate-900">{report?.implementationTimeline}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <div>
                    <div className="text-xs text-slate-600">Confidence Score</div>
                    <div className="font-semibold text-slate-900">{report?.confidenceScore}%</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600">Risk Level</div>
                  <div className={`font-semibold ${getRiskColor(report?.riskLevel)}`}>
                    {report?.riskLevel?.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                  <Eye className="w-4 h-4" />
                  View Report
                </button>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Report Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Report Includes</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Cost Savings Analysis</div>
                <div className="text-sm text-slate-600">Detailed breakdown of potential savings</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Efficiency Gap Assessment</div>
                <div className="text-sm text-slate-600">Current vs. optimal performance metrics</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Gemini Takeover Viability</div>
                <div className="text-sm text-slate-600">Technical feasibility and risk assessment</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Financial Impact Projections</div>
                <div className="text-sm text-slate-600">6-month and 12-month ROI forecasts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Implementation Details</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Migration Timeline</div>
                <div className="text-sm text-slate-600">Phased rollout schedule with milestones</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Risk Mitigation Strategies</div>
                <div className="text-sm text-slate-600">Contingency plans and rollback procedures</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Performance Benchmarks</div>
                <div className="text-sm text-slate-600">Success criteria and monitoring metrics</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2" />
              <div>
                <div className="font-medium text-slate-900">Resource Requirements</div>
                <div className="text-sm text-slate-600">Team allocation and technical dependencies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomatedCaseReportGeneration;