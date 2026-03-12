import React, { useState, useEffect } from 'react';
import { Play, Users, Award, Shield, Clock, CheckCircle } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

export default function WinnerSelectionPanel({ campaign, onUpdate }) {
  const [eligibleUsers, setEligibleUsers] = useState(0);
  const [winners, setWinners] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionProgress, setSelectionProgress] = useState(0);

  useEffect(() => {
    if (campaign) {
      loadWinners();
    }
  }, [campaign]);

  const loadWinners = async () => {
    if (!campaign) return;
    
    const result = await platformGamificationService?.getWinners(campaign?.id);
    if (result?.success) {
      setWinners(result?.data);
    }
  };

  const handleCalculateEligibility = async () => {
    if (!campaign) return;
    
    setIsSelecting(true);
    setSelectionProgress(30);
    
    const result = await platformGamificationService?.calculateUserEligibility(campaign?.id);
    
    setSelectionProgress(100);
    
    if (result?.success) {
      setEligibleUsers(result?.data?.processed);
    }
    
    setTimeout(() => {
      setIsSelecting(false);
      setSelectionProgress(0);
    }, 1000);
  };

  const handleSelectWinners = async () => {
    if (!campaign) return;
    
    if (!window.confirm('Are you sure you want to select winners? This action cannot be undone.')) {
      return;
    }

    setIsSelecting(true);
    setSelectionProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSelectionProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    const result = await platformGamificationService?.selectWinners(campaign?.id);
    
    clearInterval(progressInterval);
    setSelectionProgress(100);

    if (result?.success) {
      await loadWinners();
      onUpdate();
    }

    setTimeout(() => {
      setIsSelecting(false);
      setSelectionProgress(0);
    }, 1000);
  };

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to manage winner selection</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Cryptographically Secure Winner Selection</h2>
        <p className="text-gray-600 mt-1">
          Real-time RNG with blockchain verification and tamper-evident logging
        </p>
      </div>
      {/* Selection Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Eligible Users</h3>
              <p className="text-sm text-gray-600">Calculate user eligibility</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-blue-600 mb-4">
            {eligibleUsers?.toLocaleString()}
          </p>
          <button
            onClick={handleCalculateEligibility}
            disabled={isSelecting}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Users className="w-5 h-5" />
            Calculate Eligibility
          </button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Winner Selection</h3>
              <p className="text-sm text-gray-600">Cryptographic RNG process</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-purple-600 mb-4">
            {winners?.length || 0}
          </p>
          <button
            onClick={handleSelectWinners}
            disabled={isSelecting || campaign?.status === 'completed'}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            {campaign?.status === 'completed' ? 'Winners Selected' : 'Select Winners'}
          </button>
        </div>
      </div>
      {/* Progress Bar */}
      {isSelecting && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Clock className="w-5 h-5 text-purple-600 animate-spin" />
            <h3 className="text-lg font-bold text-gray-900">Processing...</h3>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${selectionProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">{selectionProgress}% complete</p>
        </div>
      )}
      {/* Security Features */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900">Cryptographic RNG</h4>
              <p className="text-sm text-gray-600">Secure random number generation</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900">Blockchain Proof</h4>
              <p className="text-sm text-gray-600">Tamper-evident verification</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-1" />
            <div>
              <h4 className="font-semibold text-gray-900">Audit Trail</h4>
              <p className="text-sm text-gray-600">Complete transparency</p>
            </div>
          </div>
        </div>
      </div>
      {/* Winners List */}
      {winners?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Selected Winners</h3>
          <div className="space-y-3">
            {winners?.slice(0, 10)?.map((winner) => (
              <div key={winner?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {winner?.user_profiles?.username || 'User'}
                    </p>
                    <p className="text-sm text-gray-600">{winner?.allocation_category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">
                    ${winner?.prize_amount?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">{winner?.prize_tier}</p>
                </div>
              </div>
            ))}
          </div>
          {winners?.length > 10 && (
            <p className="text-sm text-gray-600 text-center mt-4">
              Showing 10 of {winners?.length} winners
            </p>
          )}
        </div>
      )}
    </div>
  );
}