import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, DollarSign, Zap, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const AuctionBiddingPanel = ({ selectedCampaign }) => {
  const [biddingData, setBiddingData] = useState(null);
  const [bidStrategy, setBidStrategy] = useState('lowest_cost');
  const [targetCPE, setTargetCPE] = useState('');
  const [dailyBudget, setDailyBudget] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedCampaign) {
      loadBiddingData();
    }
  }, [selectedCampaign]);

  const loadBiddingData = async () => {
    try {
      const { data, error } = await supabase?.from('ad_auction_bids')?.select('*')?.eq('sponsored_election_id', selectedCampaign?.id)?.single();

      if (error && error?.code !== 'PGRST116') throw error;
      setBiddingData(data);
      
      if (data) {
        setBidStrategy(data?.bid_strategy);
        setTargetCPE(data?.target_cpe);
        setDailyBudget(data?.daily_budget);
      }
    } catch (error) {
      console.error('Error loading bidding data:', error);
    }
  };

  const handleSaveBidding = async () => {
    setLoading(true);
    try {
      const bidData = {
        sponsored_election_id: selectedCampaign?.id,
        bid_strategy: bidStrategy,
        target_cpe: parseFloat(targetCPE),
        daily_budget: parseFloat(dailyBudget),
        bid_amount: parseFloat(targetCPE) * 1.2, // 20% above target
        bid_status: 'active'
      };

      if (biddingData) {
        const { error } = await supabase?.from('ad_auction_bids')?.update(bidData)?.eq('id', biddingData?.id);
        if (error) throw error;
      } else {
        const { error } = await supabase?.from('ad_auction_bids')?.insert([bidData]);
        if (error) throw error;
      }

      alert('Bidding settings saved successfully!');
      loadBiddingData();
    } catch (error) {
      console.error('Error saving bidding settings:', error);
      alert('Failed to save bidding settings');
    } finally {
      setLoading(false);
    }
  };

  const bidStrategies = [
    {
      value: 'lowest_cost',
      label: 'Lowest Cost',
      description: 'Get the most engagements at the lowest cost'
    },
    {
      value: 'target_cost',
      label: 'Target Cost',
      description: 'Maintain a specific cost per engagement'
    },
    {
      value: 'cost_cap',
      label: 'Cost Cap',
      description: 'Set a maximum cost per engagement'
    }
  ];

  if (!selectedCampaign) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to manage auction bidding</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-Time Bid Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Real-Time Bid Management
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current CPE</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${selectedCampaign?.avg_cpe?.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Remaining</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(selectedCampaign?.budget_total - selectedCampaign?.budget_spent || 0)?.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bid Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {biddingData?.bid_status || 'Not Set'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Bid Strategy Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Bid Strategy
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {bidStrategies?.map((strategy) => (
              <button
                key={strategy?.value}
                onClick={() => setBidStrategy(strategy?.value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  bidStrategy === strategy?.value
                    ? 'border-blue-600 bg-blue-50' :'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900 mb-1">
                  {strategy?.label}
                </div>
                <div className="text-sm text-gray-600">
                  {strategy?.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bid Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target CPE ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={targetCPE}
              onChange={(e) => setTargetCPE(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Budget ($)
            </label>
            <input
              type="number"
              step="0.01"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
        </div>

        <button
          onClick={handleSaveBidding}
          disabled={loading}
          className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Saving...' : 'Save Bidding Settings'}
        </button>
      </div>
      {/* Competitor Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-orange-600" />
          Competitor Analysis
        </h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Market Insights:</strong> Average CPE in your category is $0.45. Your current bid of ${targetCPE || '0.00'} is {parseFloat(targetCPE) > 0.45 ? 'above' : 'below'} market average.
          </p>
        </div>
      </div>
      {/* Automated Bid Optimization */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-600" />
          Automated Bid Optimization
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Auto-adjust bids based on performance</p>
              <p className="text-sm text-gray-600">Automatically increase bids for high-performing campaigns</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Budget pacing controls</p>
              <p className="text-sm text-gray-600">Evenly distribute budget throughout the day</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionBiddingPanel;