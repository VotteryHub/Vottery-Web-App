import React from 'react';


const RealTimeThreatAssessmentPanel = () => {
  const emergingThreats = [
    {
      id: 1,
      title: 'Coordinated Vote Manipulation Campaign',
      severity: 'critical',
      confidence: 94.2,
      description: 'Detected organized voting pattern across 47 accounts targeting Election #2847',
      predictedImpact: 'High - Could affect election outcome',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      title: 'Account Farming Operation',
      severity: 'high',
      confidence: 87.5,
      description: 'Mass account creation from datacenter IPs in Eastern Europe',
      predictedImpact: 'Medium - Potential future manipulation',
      timestamp: '15 minutes ago'
    },
    {
      id: 3,
      title: 'Payment Fraud Pattern Evolution',
      severity: 'medium',
      confidence: 76.8,
      description: 'New chargeback pattern detected using stolen card data',
      predictedImpact: 'Low - Isolated incidents',
      timestamp: '1 hour ago'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Real-time Threat Assessment
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Emerging fraud vectors, attack pattern evolution, and predictive modeling for future threats with automated alert distribution
      </p>

      <div className="space-y-4">
        {emergingThreats?.map((threat) => (
          <div
            key={threat?.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`w-3 h-3 rounded-full ${getSeverityColor(threat?.severity)} mt-2 animate-pulse`} />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{threat?.title}</h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{threat?.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{threat?.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Severity</p>
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold text-white ${getSeverityColor(threat?.severity)}`}>
                      {threat?.severity?.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Confidence</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{threat?.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Predicted Impact</p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{threat?.predictedImpact}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeThreatAssessmentPanel;