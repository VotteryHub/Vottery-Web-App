import React from 'react';
import { FileSearch, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const EvidenceAnalysisPanel = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <FileSearch className="w-5 h-5" />
          Evidence Analysis Automation
        </h3>
        <p className="text-neutral-600 mb-6">
          Intelligent document processing, pattern recognition, and contextual analysis with automated correlation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">High Credibility</span>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">87</p>
          <p className="text-sm text-neutral-600 mt-1">Evidence items verified</p>
        </div>

        <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">Medium Credibility</span>
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-700">23</p>
          <p className="text-sm text-neutral-600 mt-1">Requiring additional verification</p>
        </div>

        <div className="p-6 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-700 font-medium">Low Credibility</span>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">5</p>
          <p className="text-sm text-neutral-600 mt-1">Flagged for review</p>
        </div>
      </div>

      <div className="p-6 bg-white rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Automated Analysis Capabilities</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <FileSearch className="w-5 h-5 text-blue-600" />
              <h5 className="font-medium text-neutral-800">Document Processing</h5>
            </div>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Transaction records extraction
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Communication log analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Policy document interpretation
              </li>
            </ul>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h5 className="font-medium text-neutral-800">Pattern Recognition</h5>
            </div>
            <ul className="space-y-1 text-sm text-neutral-700">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Behavioral anomaly detection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Precedent matching
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                Cross-case correlation
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-6 bg-neutral-50 rounded-lg border border-neutral-200">
        <h4 className="font-semibold text-neutral-800 mb-4">Evidence Correlation Engine</h4>
        <p className="text-sm text-neutral-600 mb-4">
          Automated correlation across multiple data sources and investigation threads with intelligent pattern matching
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-medium text-neutral-800 text-sm">Cross-Reference Analysis</p>
              <p className="text-sm text-neutral-600">Automatic linking of related evidence across cases</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-medium text-neutral-800 text-sm">Timeline Reconstruction</p>
              <p className="text-sm text-neutral-600">Chronological ordering of events with gap identification</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
            <div>
              <p className="font-medium text-neutral-800 text-sm">Credibility Scoring</p>
              <p className="text-sm text-neutral-600">AI-powered assessment of evidence reliability</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EvidenceAnalysisPanel;