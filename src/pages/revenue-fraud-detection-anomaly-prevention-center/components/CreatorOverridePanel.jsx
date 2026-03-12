import React, { useState } from 'react';
import { Users, AlertTriangle, Activity, Shield } from 'lucide-react';

const CreatorOverridePanel = () => {
  const [overrideData, setOverrideData] = useState([
    {
      id: 1,
      creatorId: 'CR-10456',
      creatorName: 'Alex Thompson',
      overrideCount: 12,
      avgPercentageChange: 15.3,
      lastOverride: new Date()?.toISOString(),
      abuseScore: 89.2,
      status: 'flagged'
    },
    {
      id: 2,
      creatorId: 'CR-10789',
      creatorName: 'Emma Wilson',
      overrideCount: 8,
      avgPercentageChange: 11.7,
      lastOverride: new Date()?.toISOString(),
      abuseScore: 72.5,
      status: 'monitoring'
    },
    {
      id: 3,
      creatorId: 'CR-10234',
      creatorName: 'David Chen',
      overrideCount: 15,
      avgPercentageChange: 18.9,
      lastOverride: new Date()?.toISOString(),
      abuseScore: 94.8,
      status: 'blocked'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'blocked': return 'bg-red-600';
      case 'flagged': return 'bg-orange-600';
      case 'monitoring': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Creator Override Exploitation Monitoring
        </h2>
        <p className="text-gray-600 mb-6">Tracking excessive override usage, unauthorized percentage modifications, and systematic abuse patterns with behavioral analysis</p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Creator</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Override Count</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Avg % Change</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Abuse Score</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {overrideData?.map((item) => (
                <tr key={item?.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{item?.creatorName}</p>
                      <p className="text-sm text-gray-600">{item?.creatorId}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-red-600">{item?.overrideCount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-orange-600">+{item?.avgPercentageChange}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item?.abuseScore > 85 ? 'bg-red-600' : item?.abuseScore > 70 ? 'bg-orange-600' : 'bg-yellow-600'
                          }`}
                          style={{ width: `${item?.abuseScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{item?.abuseScore}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 ${getStatusColor(item?.status)} text-white rounded-full text-xs font-semibold uppercase`}>
                      {item?.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700">
                        Review
                      </button>
                      <button className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700">
                        Block
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pattern Recognition</h3>
            <Activity className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">23</p>
          <p className="text-sm text-gray-600">Systematic abuse patterns detected</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Behavioral Analysis</h3>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">91.3%</p>
          <p className="text-sm text-gray-600">Algorithm accuracy rate</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Unauthorized Mods</h3>
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-2">47</p>
          <p className="text-sm text-gray-600">Unauthorized percentage changes</p>
        </div>
      </div>
    </div>
  );
};

export default CreatorOverridePanel;