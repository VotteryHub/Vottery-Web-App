import React, { useState } from 'react';
import { BarChart3, DollarSign, TrendingUp, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import EfficiencyMetricsEngine from './components/EfficiencyMetricsEngine';
import PerformanceQualityAssessment from './components/PerformanceQualityAssessment';
import AutomatedCaseReportGeneration from './components/AutomatedCaseReportGeneration';
import AdminApprovalWorkflow from './components/AdminApprovalWorkflow';
import CostAnalysisTools from './components/CostAnalysisTools';
import Icon from '../../components/AppIcon';


const GeminiCostEfficiencyAnalyzerCaseReportGenerator = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [totalSavingsPotential] = useState(127450);
  const [pendingApprovals] = useState(3);

  const tabs = [
    { id: 'overview', label: 'Efficiency Metrics', icon: BarChart3 },
    { id: 'quality', label: 'Performance Quality', icon: TrendingUp },
    { id: 'reports', label: 'Case Reports', icon: FileText },
    { id: 'approval', label: 'Admin Approval', icon: CheckCircle },
    { id: 'analysis', label: 'Cost Analysis', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Gemini Cost-Efficiency Analyzer & Case Report Generator
              </h1>
              <p className="text-slate-600 mt-2">
                Comprehensive financial intelligence monitoring efficiency metrics with automated case report generation
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 mb-1">Total Savings Potential</div>
              <div className="text-3xl font-bold text-green-600">${totalSavingsPotential?.toLocaleString()}</div>
              {pendingApprovals > 0 && (
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-600 font-medium">{pendingApprovals} Pending Approvals</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {tabs?.map((tab) => {
              const Icon = tab?.icon;
              return (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-600' :'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab?.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && <EfficiencyMetricsEngine />}
            {activeTab === 'quality' && <PerformanceQualityAssessment />}
            {activeTab === 'reports' && <AutomatedCaseReportGeneration />}
            {activeTab === 'approval' && <AdminApprovalWorkflow />}
            {activeTab === 'analysis' && <CostAnalysisTools />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiCostEfficiencyAnalyzerCaseReportGenerator;