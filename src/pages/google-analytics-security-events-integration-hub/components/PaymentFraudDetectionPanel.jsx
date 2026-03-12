import React, { useState, useEffect } from 'react';
import { CreditCard, AlertCircle, TrendingUp } from 'lucide-react';

const PaymentFraudDetectionPanel = ({ trackEvent }) => {
  const [fraudEvents, setFraudEvents] = useState([
    {
      id: 1,
      type: 'card_testing',
      riskScore: 85,
      amount: 1.00,
      attempts: 15,
      timestamp: new Date()?.toISOString(),
      status: 'blocked'
    },
    {
      id: 2,
      type: 'chargeback_pattern',
      riskScore: 72,
      amount: 49.99,
      attempts: 1,
      timestamp: new Date(Date.now() - 7200000)?.toISOString(),
      status: 'flagged'
    }
  ]);

  useEffect(() => {
    trackEvent?.('security_panel_view', {
      panel_name: 'payment_fraud_detection',
      event_count: fraudEvents?.length
    });
  }, []);

  const handleReview = (event) => {
    trackEvent?.('fraud_event_review', {
      event_type: event?.type,
      risk_score: event?.riskScore,
      amount: event?.amount
    });
    alert(`Reviewing ${event?.type} event...`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-orange-600" />
          <h2 className="text-xl font-bold text-gray-900">Payment Fraud Detection</h2>
        </div>
        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
          {fraudEvents?.length || 0} Alerts
        </span>
      </div>
      <div className="space-y-4">
        {fraudEvents?.map((event) => (
          <div
            key={event?.id}
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">
                    {event?.type?.replace(/_/g, ' ')?.toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    ${event?.amount?.toFixed(2)} - {event?.attempts} attempt(s)
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <span className="text-lg font-bold text-orange-600">{event?.riskScore}%</span>
                </div>
                <span className="text-xs text-gray-600">Risk Score</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {new Date(event?.timestamp)?.toLocaleString()}
              </span>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  event?.status === 'blocked' ?'bg-red-200 text-red-800' :'bg-yellow-200 text-yellow-800'
                }`}>
                  {event?.status?.toUpperCase()}
                </span>
                <button
                  onClick={() => handleReview(event)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Tracking:</strong> Transaction anomalies, card testing attempts, chargeback patterns, 
          payment processor security events with real-time risk scoring and automated alert triggers
        </p>
      </div>
    </div>
  );
};

export default PaymentFraudDetectionPanel;