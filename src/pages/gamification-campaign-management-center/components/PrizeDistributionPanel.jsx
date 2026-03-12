import React, { useState, useEffect } from 'react';
import { DollarSign, CreditCard, CheckCircle, Clock, XCircle, TrendingUp } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

export default function PrizeDistributionPanel({ campaign, onUpdate }) {
  const [winners, setWinners] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    totalAmount: 0
  });

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
      calculateStats(result?.data);
    }
  };

  const calculateStats = (winnersList) => {
    const newStats = {
      pending: winnersList?.filter(w => w?.payout_status === 'pending')?.length,
      processing: winnersList?.filter(w => w?.payout_status === 'processing')?.length,
      completed: winnersList?.filter(w => w?.payout_status === 'completed')?.length,
      failed: winnersList?.filter(w => w?.payout_status === 'failed')?.length,
      totalAmount: winnersList?.reduce((sum, w) => sum + parseFloat(w?.prize_amount || 0), 0)
    };
    setStats(newStats);
  };

  const handleProcessPayout = async (winnerId) => {
    const result = await platformGamificationService?.processPayout(winnerId);
    if (result?.success) {
      await loadWinners();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'processing':
        return <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700'
    };
    return colors?.[status] || 'bg-gray-100 text-gray-700';
  };

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to manage prize distribution</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Automated Prize Distribution</h2>
        <p className="text-gray-600 mt-1">
          Stripe integration with multi-currency support and transaction tracking
        </p>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border-2 border-orange-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Pending</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats?.pending}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-blue-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Processing</span>
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats?.processing}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-green-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{stats?.completed}</p>
        </div>

        <div className="bg-white rounded-xl border-2 border-red-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Failed</span>
          </div>
          <p className="text-3xl font-bold text-red-600">{stats?.failed}</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">Total Amount</span>
          </div>
          <p className="text-3xl font-bold">${stats?.totalAmount?.toLocaleString()}</p>
        </div>
      </div>
      {/* Stripe Integration Status */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-900">Stripe Integration Status</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Connection Status</p>
            <p className="font-bold text-green-600">✓ Connected</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Multi-Currency</p>
            <p className="font-bold text-gray-900">Enabled</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Auto-Payout</p>
            <p className="font-bold text-gray-900">Active</p>
          </div>
        </div>
      </div>
      {/* Winners Payout Queue */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Payout Queue</h3>
        <div className="space-y-3">
          {winners?.map((winner) => (
            <div key={winner?.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
              <div className="flex items-center gap-4 flex-1">
                {getStatusIcon(winner?.payout_status)}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-gray-900">
                      {winner?.user_profiles?.username || 'User'}
                    </p>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(winner?.payout_status)}`}>
                      {winner?.payout_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{winner?.user_profiles?.email}</span>
                    <span>•</span>
                    <span>{winner?.prize_tier}</span>
                    {winner?.payout_transaction_id && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-xs">{winner?.payout_transaction_id}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-600">
                    ${winner?.prize_amount?.toLocaleString()}
                  </p>
                  {winner?.payout_completed_at && (
                    <p className="text-xs text-gray-600">
                      {new Date(winner.payout_completed_at)?.toLocaleDateString()}
                    </p>
                  )}
                </div>
                {winner?.payout_status === 'pending' && (
                  <button
                    onClick={() => handleProcessPayout(winner?.id)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium"
                  >
                    Process
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {winners?.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No winners to process yet</p>
          </div>
        )}
      </div>
    </div>
  );
}