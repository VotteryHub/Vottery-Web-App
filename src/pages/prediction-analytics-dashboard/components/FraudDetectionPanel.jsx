import React, { useState } from 'react';
import { Shield, AlertTriangle, Eye, CheckCircle } from 'lucide-react';
import { discordWebhookService } from '../../../services/discordWebhookService';

const FraudDetectionPanel = ({ fraudAlerts = [], compact }) => {
  const [investigated, setInvestigated] = useState({});
  const [alertSent, setAlertSent] = useState({});

  const handleInvestigate = async (userId) => {
    setInvestigated(prev => ({ ...prev, [userId]: 'investigating' }));
    // Send Discord alert
    await discordWebhookService?.sendSystemAlert({
      title: '🔍 Fraud Investigation Initiated',
      message: `Admin initiated investigation for user ${userId} due to suspicious prediction accuracy.`,
      severity: 'high',
    });
    setAlertSent(prev => ({ ...prev, [userId]: true }));
  };

  const handleClear = (userId) => {
    setInvestigated(prev => ({ ...prev, [userId]: 'cleared' }));
  };

  const THRESHOLDS = {
    accuracy: 95,
    minPools: 10,
  };

  // Demo data if no real alerts
  const displayAlerts = fraudAlerts?.length > 0 ? fraudAlerts : [
    { userId: 'usr_demo_001', poolCount: 14, accuracy: 97 },
    { userId: 'usr_demo_002', poolCount: 11, accuracy: 96 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="text-base font-semibold text-gray-900">Fraud Detection</h3>
            <p className="text-xs text-gray-500">Users with &gt;{THRESHOLDS?.accuracy}% accuracy across {THRESHOLDS?.minPools}+ pools</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          displayAlerts?.length > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {displayAlerts?.length} Alert{displayAlerts?.length !== 1 ? 's' : ''}
        </span>
      </div>
      {/* Threshold Config */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{THRESHOLDS?.accuracy}%</div>
            <div className="text-xs text-gray-500">Accuracy Threshold</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{THRESHOLDS?.minPools}</div>
            <div className="text-xs text-gray-500">Min Pools Required</div>
          </div>
        </div>
      )}
      {/* Alert List */}
      <div className="space-y-3">
        {displayAlerts?.length === 0 ? (
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">No suspicious users detected</span>
          </div>
        ) : (
          displayAlerts?.slice(0, compact ? 3 : undefined)?.map((alert) => (
            <div key={alert?.userId} className={`p-3 rounded-lg border ${
              investigated?.[alert?.userId] === 'cleared' ?'bg-green-50 border-green-200'
                : investigated?.[alert?.userId] === 'investigating' ?'bg-yellow-50 border-yellow-200' :'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-4 h-4 ${
                    investigated?.[alert?.userId] === 'cleared' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      User: {alert?.userId?.slice(0, 12)}...
                    </div>
                    <div className="text-xs text-gray-600">
                      {alert?.accuracy}% accuracy · {alert?.poolCount} pools
                    </div>
                  </div>
                </div>
                {!compact && (
                  <div className="flex gap-2">
                    {investigated?.[alert?.userId] !== 'cleared' && (
                      <button
                        onClick={() => handleInvestigate(alert?.userId)}
                        className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs rounded hover:bg-orange-700"
                      >
                        <Eye className="w-3 h-3" />
                        Investigate
                      </button>
                    )}
                    <button
                      onClick={() => handleClear(alert?.userId)}
                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                )}
              </div>
              {alertSent?.[alert?.userId] && (
                <div className="mt-2 text-xs text-orange-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Discord alert sent — investigation initiated
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FraudDetectionPanel;
