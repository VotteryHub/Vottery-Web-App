import React, { useState, useEffect } from 'react';
import { Clock, Users, Eye, AlertTriangle, TrendingDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import revenueReportingService from '../../../services/revenueReportingService';

const FrequencyCappingPanel = ({ selectedCampaign }) => {
  const [frequencyData, setFrequencyData] = useState(null);
  const [frequencyAnalysis, setFrequencyAnalysis] = useState(null);
  const [maxImpressions, setMaxImpressions] = useState(3);
  const [timeWindow, setTimeWindow] = useState(24);
  const [maxEngagements, setMaxEngagements] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCampaign) {
      loadFrequencyData();
      loadFrequencyAnalysis();
    }
  }, [selectedCampaign]);

  const loadFrequencyData = async () => {
    try {
      const { data, error } = await supabase?.from('ad_frequency_caps')?.select('*')?.eq('sponsored_election_id', selectedCampaign?.id)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      
      if (data) {
        setFrequencyData(data);
        setMaxImpressions(data?.max_impressions_per_user);
        setTimeWindow(data?.time_window_hours);
        setMaxEngagements(data?.max_engagements_per_user);
      }
    } catch (error) {
      console.error('Error loading frequency data:', error);
    }
  };

  const loadFrequencyAnalysis = async () => {
    const result = await revenueReportingService?.getFrequencyAnalysis(selectedCampaign?.id);
    if (result?.success) {
      setFrequencyAnalysis(result?.data);
    }
  };

  const handleSaveFrequency = async () => {
    setLoading(true);
    try {
      const capData = {
        sponsored_election_id: selectedCampaign?.id,
        max_impressions_per_user: parseInt(maxImpressions),
        time_window_hours: parseInt(timeWindow),
        max_engagements_per_user: parseInt(maxEngagements)
      };

      if (frequencyData) {
        const { error } = await supabase?.from('ad_frequency_caps')?.update(capData)?.eq('id', frequencyData?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase?.from('ad_frequency_caps')?.insert([capData]);
        if (error) throw error;
      }

      alert('Frequency capping settings saved successfully!');
      loadFrequencyData();
    } catch (error) {
      console.error('Error saving frequency settings:', error);
      alert('Failed to save frequency settings');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCampaign) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to manage frequency capping</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Frequency Cap Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Clock className="w-5 h-5 mr-2 text-blue-600" />
          Impression Limits & Engagement Throttling
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Impressions Per User
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={maxImpressions}
              onChange={(e) => setMaxImpressions(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Recommended: 3-5 impressions</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Window (Hours)
            </label>
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="6">6 hours</option>
              <option value="12">12 hours</option>
              <option value="24">24 hours</option>
              <option value="48">48 hours</option>
              <option value="168">7 days</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Reset frequency after this period</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Engagements Per User
            </label>
            <input
              type="number"
              min="1"
              max="5"
              value={maxEngagements}
              onChange={(e) => setMaxEngagements(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Typically 1 vote per user</p>
          </div>
        </div>

        <button
          onClick={handleSaveFrequency}
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Frequency Settings'}
        </button>
      </div>
      {/* Audience Fatigue Prevention */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingDown className="w-5 h-5 mr-2 text-orange-600" />
          Audience Fatigue Analysis
        </h3>

        {frequencyAnalysis ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Users Reached</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {frequencyAnalysis?.total_users_reached?.toLocaleString() || 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engaged Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {frequencyAnalysis?.engaged_users?.toLocaleString() || 0}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Engagement Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {frequencyAnalysis?.engagement_rate || 0}%
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Impressions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {frequencyAnalysis?.avg_impressions_per_user?.toFixed(1) || 0}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Loading frequency analysis...</p>
        )}
      </div>
      {/* Optimal Exposure Algorithms */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-green-600" />
          Optimal Exposure & Reach Maximization
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Smart Frequency Optimization</p>
              <p className="text-sm text-gray-600">Automatically adjust impression limits based on engagement patterns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Reach Maximization Mode</p>
              <p className="text-sm text-gray-600">Prioritize showing ads to new users over repeat impressions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Fatigue Detection Alerts</p>
              <p className="text-sm text-gray-600">Notify when engagement rate drops below threshold</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
      {/* Impression Distribution Chart */}
      {frequencyAnalysis?.impression_distribution && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Impression Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(frequencyAnalysis?.impression_distribution)?.map(([count, users]) => (
              <div key={count} className="flex items-center">
                <span className="text-sm text-gray-600 w-32">{count} impression{count > 1 ? 's' : ''}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${(users / frequencyAnalysis?.total_users_reached) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{users} users</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencyCappingPanel;