import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Target, Shield } from 'lucide-react';

const CampaignSplitAbusePanel = () => {
  const [abuseData, setAbuseData] = useState([
    {
      id: 1,
      campaignId: 'CMP-5678',
      campaignName: 'Summer Promo 2026',
      manipulationAttempts: 8,
      correlationScore: 87.5,
      artificialCreation: true,
      crossCampaignLinks: 5,
      status: 'blocked',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 2,
      campaignId: 'CMP-5901',
      campaignName: 'Spring Launch',
      manipulationAttempts: 4,
      correlationScore: 72.3,
      artificialCreation: false,
      crossCampaignLinks: 2,
      status: 'monitoring',
      timestamp: new Date()?.toISOString()
    },
    {
      id: 3,
      campaignId: 'CMP-6123',
      campaignName: 'Holiday Special',
      manipulationAttempts: 12,
      correlationScore: 94.8,
      artificialCreation: true,
      crossCampaignLinks: 8,
      status: 'flagged',
      timestamp: new Date()?.toISOString()
    }
  ]);

  const getStatusBadge = (status) => {
    const colors = {
      blocked: 'bg-red-100 text-red-800 border-red-300',
      flagged: 'bg-orange-100 text-orange-800 border-orange-300',
      monitoring: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Campaign Split Abuse Tracking
        </h2>
        <p className="text-gray-600 mb-6">Monitoring coordinated manipulation attempts, artificial campaign creation, and cross-campaign correlation analysis</p>

        <div className="space-y-4">
          {abuseData?.map((item) => (
            <div key={item?.id} className="border-2 border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item?.campaignName}</h3>
                  <p className="text-sm text-gray-600">Campaign ID: {item?.campaignId}</p>
                </div>
                <span className={`px-3 py-1 border-2 rounded-full text-sm font-semibold uppercase ${getStatusBadge(item?.status)}`}>
                  {item?.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Manipulation Attempts</p>
                  <p className="text-2xl font-bold text-red-600">{item?.manipulationAttempts}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Correlation Score</p>
                  <p className="text-2xl font-bold text-orange-600">{item?.correlationScore}%</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Artificial Creation</p>
                  <p className="text-2xl font-bold text-gray-900">{item?.artificialCreation ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Cross-Campaign Links</p>
                  <p className="text-2xl font-bold text-blue-600">{item?.crossCampaignLinks}</p>
                </div>
              </div>

              {item?.artificialCreation && (
                <div className="bg-red-50 border-l-4 border-red-600 p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800 font-semibold">Artificial campaign creation detected for split exploitation</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600">Detected: {new Date(item.timestamp)?.toLocaleString()}</p>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700">
                    Investigate
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700">
                    Block Campaign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Cross-Campaign Correlation Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Active correlation tracking</span>
              <span className="text-blue-600 font-semibold">15 campaigns</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Suspicious patterns identified</span>
              <span className="text-blue-600 font-semibold">8 patterns</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-900">Coordinated attempts blocked</span>
              <span className="text-blue-600 font-semibold">23 attempts</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-600" />
            Automated Blocking Protocols
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Auto-block threshold</span>
              <span className="text-green-600 font-semibold">85% confidence</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">Campaigns blocked today</span>
              <span className="text-green-600 font-semibold">12 campaigns</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-gray-900">False positive rate</span>
              <span className="text-green-600 font-semibold">2.3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignSplitAbusePanel;