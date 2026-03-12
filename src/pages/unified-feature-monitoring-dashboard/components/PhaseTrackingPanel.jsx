import React from 'react';
import { Layers, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PhaseTrackingPanel = ({ timeRange }) => {
  const phases = [
    {
      phase: 'Phase 2',
      features: [
        { name: 'AI Fraud Detection', status: 'completed', completion: 100, milestone: 'Live' },
        { name: 'Advanced Analytics', status: 'completed', completion: 100, milestone: 'Live' },
        { name: 'Live Streaming', status: 'in-progress', completion: 85, milestone: 'Beta' },
        { name: 'Multi-Language Support', status: 'in-progress', completion: 72, milestone: 'Testing' }
      ]
    },
    {
      phase: 'Phase 3',
      features: [
        { name: 'Enhanced Gamification', status: 'in-progress', completion: 65, milestone: 'Alpha' },
        { name: 'Predictive Threat Analysis', status: 'in-progress', completion: 58, milestone: 'Development' },
        { name: 'OpenAI Quest Generation', status: 'planned', completion: 30, milestone: 'Planning' },
        { name: 'Claude Admin Insights', status: 'planned', completion: 25, milestone: 'Design' }
      ]
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Layers className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Phase Tracking</h2>
          <p className="text-sm text-gray-600">Detailed Phase 2 & 3 deployment status</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phases?.map((phase, phaseIdx) => (
          <div key={phaseIdx} className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">{phase?.phase}</h3>
              <span className="text-sm text-gray-600">
                {phase?.features?.filter((f) => f?.status === 'completed')?.length}/
                {phase?.features?.length} Complete
              </span>
            </div>

            <div className="space-y-3">
              {phase?.features?.map((feature, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(feature?.status)}
                      <span className="font-medium text-gray-900">{feature?.name}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        getStatusColor(feature?.status)
                      }`}
                    >
                      {feature?.milestone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          feature?.status === 'completed'
                            ? 'bg-green-600'
                            : feature?.status === 'in-progress' ?'bg-blue-600' :'bg-gray-400'
                        }`}
                        style={{ width: `${feature?.completion}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[3rem] text-right">
                      {feature?.completion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhaseTrackingPanel;