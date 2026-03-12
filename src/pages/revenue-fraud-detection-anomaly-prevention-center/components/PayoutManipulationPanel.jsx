import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle } from 'lucide-react';

const PayoutManipulationPanel = () => {
  const [manipulationData, setManipulationData] = useState([
    {
      id: 1,
      creatorId: 'CR-10234',
      creatorName: 'John Creator',
      expectedPayout: 1250.00,
      actualPayout: 2100.00,
      deviation: 68.0,
      confidence: 92.5,
      severity: 'critical',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      creatorId: 'CR-10567',
      creatorName: 'Sarah Artist',
      expectedPayout: 890.00,
      actualPayout: 1340.00,
      deviation: 50.6,
      confidence: 87.3,
      severity: 'high',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      creatorId: 'CR-10892',
      creatorName: 'Mike Designer',
      expectedPayout: 2300.00,
      actualPayout: 2850.00,
      deviation: 23.9,
      confidence: 78.1,
      severity: 'medium',
      timestamp: new Date()?.toISOString()
    }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
          Payout Manipulation Detection
        </h2>
        <p className="text-gray-600 mb-6">Monitoring suspicious distribution patterns and unusual creator earnings spikes with mathematical proof validation</p>

        <div className="space-y-4">
          {manipulationData?.map((item) => (
            <div key={item?.id} className={`border-2 rounded-lg p-4 ${getSeverityColor(item?.severity)}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{item?.creatorName}</h3>
                  <p className="text-sm opacity-75">Creator ID: {item?.creatorId}</p>
                </div>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold uppercase">
                  {item?.severity}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-xs opacity-75 mb-1">Expected Payout</p>
                  <p className="font-semibold">${item?.expectedPayout?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Actual Payout</p>
                  <p className="font-semibold">${item?.actualPayout?.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Deviation</p>
                  <p className="font-semibold text-red-600">+{item?.deviation}%</p>
                </div>
                <div>
                  <p className="text-xs opacity-75 mb-1">Confidence Score</p>
                  <p className="font-semibold">{item?.confidence}%</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-current opacity-50">
                <p className="text-xs">Detected: {new Date(item.timestamp)?.toLocaleString()}</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 bg-white rounded text-xs font-semibold hover:opacity-80">
                    Investigate
                  </button>
                  <button className="px-3 py-1 bg-white rounded text-xs font-semibold hover:opacity-80">
                    Block Payout
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Split Calculation Verification</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-900">Mathematical proof validation enabled</span>
            </div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-900">Real-time distribution pattern analysis</span>
            </div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-gray-900">Unusual earnings spike detection</span>
            </div>
            <span className="text-green-600 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayoutManipulationPanel;