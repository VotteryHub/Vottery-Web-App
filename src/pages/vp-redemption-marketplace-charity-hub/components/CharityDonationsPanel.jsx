import React, { useState, useEffect } from 'react';
import { Heart, Droplet, BookOpen, TreePine, Globe, CheckCircle, TrendingUp, Award } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';
import Icon from '../../../components/AppIcon';


const CharityDonationsPanel = ({ vpBalance, onRedemption }) => {
  const [selectedCharity, setSelectedCharity] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const charities = [
    {
      id: 'ocean-cleanup',
      name: 'Ocean Cleanup Initiative',
      icon: Droplet,
      description: 'Remove plastic waste from oceans and protect marine life',
      vpRate: 500,
      dollarValue: 1,
      impact: 'Every 500 VP = $1 removes 2kg of ocean plastic',
      verified: true,
      totalDonated: 12450,
      color: 'blue'
    },
    {
      id: 'education',
      name: 'Global Education Fund',
      icon: BookOpen,
      description: 'Provide educational resources to underprivileged children',
      vpRate: 500,
      dollarValue: 1,
      impact: 'Every 500 VP = $1 provides school supplies for 1 child',
      verified: true,
      totalDonated: 8920,
      color: 'purple'
    },
    {
      id: 'reforestation',
      name: 'Reforestation Project',
      icon: TreePine,
      description: 'Plant trees and restore natural habitats worldwide',
      vpRate: 500,
      dollarValue: 1,
      impact: 'Every 500 VP = $1 plants 5 trees',
      verified: true,
      totalDonated: 15680,
      color: 'green'
    },
    {
      id: 'climate-action',
      name: 'Climate Action Alliance',
      icon: Globe,
      description: 'Support renewable energy and carbon offset initiatives',
      vpRate: 500,
      dollarValue: 1,
      impact: 'Every 500 VP = $1 offsets 10kg of CO2',
      verified: true,
      totalDonated: 9340,
      color: 'orange'
    }
  ];

  const handleDonate = async (charity) => {
    if (vpBalance < donationAmount) {
      alert('Insufficient VP balance');
      return;
    }

    try {
      setProcessing(true);
      await platformGamificationService?.redeemVP({
        type: 'charity_donation',
        charityId: charity?.id,
        vpAmount: donationAmount,
        dollarValue: (donationAmount / charity?.vpRate) * charity?.dollarValue
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      onRedemption?.();
    } catch (error) {
      console.error('Donation error:', error);
      alert('Donation failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const calculateDollarValue = (vp, charity) => {
    return ((vp / charity?.vpRate) * charity?.dollarValue)?.toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">Donation Successful!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Thank you for making a difference. Your donation certificate has been generated.</p>
          </div>
        </div>
      )}
      {/* Donation Amount Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Donation Amount</h3>
        <div className="flex gap-3 flex-wrap">
          {[500, 1000, 2500, 5000, 10000]?.map((amount) => (
            <button
              key={amount}
              onClick={() => setDonationAmount(amount)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                donationAmount === amount
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {amount} VP
              <span className="block text-xs mt-1 opacity-75">${(amount / 500)?.toFixed(0)}</span>
            </button>
          ))}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Amount</label>
          <input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(parseInt(e?.target?.value) || 0)}
            min="500"
            step="100"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>
      {/* Charity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {charities?.map((charity) => {
          const Icon = charity?.icon;
          const dollarValue = calculateDollarValue(donationAmount, charity);
          
          return (
            <div
              key={charity?.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className={`bg-gradient-to-r from-${charity?.color}-500 to-${charity?.color}-600 p-6`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{charity?.name}</h3>
                      {charity?.verified && (
                        <div className="flex items-center gap-1 mt-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                          <span className="text-xs text-white/90">Verified Charity</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">{charity?.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700 dark:text-gray-300">{charity?.impact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700 dark:text-gray-300">
                      Total donated: ${charity?.totalDonated?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Your donation:</span>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">${dollarValue}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{donationAmount} VP</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDonate(charity)}
                  disabled={processing || vpBalance < donationAmount}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      Donate Now
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CharityDonationsPanel;