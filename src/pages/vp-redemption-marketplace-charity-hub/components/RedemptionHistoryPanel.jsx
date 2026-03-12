import React, { useState, useEffect } from 'react';
import { History, Download, ExternalLink, CheckCircle, Clock, Filter } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';

const RedemptionHistoryPanel = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const mockHistory = [
    {
      id: '1',
      type: 'charity_donation',
      title: 'Ocean Cleanup Initiative',
      vpAmount: 1000,
      value: '$2.00',
      date: '2026-02-01',
      status: 'completed',
      transactionHash: '0x1234...5678'
    },
    {
      id: '2',
      type: 'experience_reward',
      title: 'Premium Webinar Access',
      vpAmount: 600,
      value: 'Webinar Ticket',
      date: '2026-01-28',
      status: 'completed',
      transactionHash: '0xabcd...efgh'
    },
    {
      id: '3',
      type: 'vip_tier_access',
      title: 'Beta Features Access',
      vpAmount: 1500,
      value: '1 Month',
      date: '2026-01-25',
      status: 'active',
      transactionHash: '0x9876...5432'
    }
  ];

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await platformGamificationService?.getRedemptionHistory();
      setHistory(data || mockHistory);
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory(mockHistory);
    } finally {
      setLoading(false);
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Redemptions' },
    { value: 'charity_donation', label: 'Charity Donations' },
    { value: 'experience_reward', label: 'Experience Rewards' },
    { value: 'vip_tier_access', label: 'VIP Access' },
    { value: 'crypto_conversion', label: 'Crypto Conversions' },
    { value: 'quest_pack_bundle', label: 'Quest Packs' }
  ];

  const filteredHistory = filter === 'all' 
    ? history 
    : history?.filter(item => item?.type === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Active
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      charity_donation: 'Charity Donation',
      experience_reward: 'Experience Reward',
      vip_tier_access: 'VIP Access',
      crypto_conversion: 'Crypto Conversion',
      quest_pack_bundle: 'Quest Pack'
    };
    return labels?.[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-blue-600" />
            Redemption History
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            View all your VP redemptions with blockchain verification
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e?.target?.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {filterOptions?.map(option => (
              <option key={option?.value} value={option?.value}>{option?.label}</option>
            ))}
          </select>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      {/* History Table */}
      {filteredHistory?.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No redemption history found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    VP Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Verification
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory?.map((item) => (
                  <tr key={item?.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(item.date)?.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {getTypeLabel(item?.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {item?.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {item?.vpAmount?.toLocaleString()} VP
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                      {item?.value}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item?.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item?.transactionHash && (
                        <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 text-sm">
                          <ExternalLink className="w-4 h-4" />
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300 mb-1">Total Redeemed</p>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
            {history?.reduce((sum, item) => sum + item?.vpAmount, 0)?.toLocaleString()} VP
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
          <p className="text-sm text-green-900 dark:text-green-300 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-green-900 dark:text-green-200">{history?.length}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
          <p className="text-sm text-purple-900 dark:text-purple-300 mb-1">Active Redemptions</p>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
            {history?.filter(item => item?.status === 'active')?.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RedemptionHistoryPanel;