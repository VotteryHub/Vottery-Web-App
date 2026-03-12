import React, { useState, useEffect } from 'react';
import { Eye, Search, Download, RefreshCw, ExternalLink } from 'lucide-react';


const PublicBulletinBoardPanel = () => {
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadBulletinBoard();
  }, [filter]);

  const loadBulletinBoard = async () => {
    setLoading(true);
    // Simulated data - in production, fetch from Supabase bulletin_board table
    const mockTransactions = [
      {
        id: '1',
        type: 'vote_cast',
        electionId: 'election-001',
        electionTitle: 'Community Leadership Election 2026',
        timestamp: Date.now() - 3600000,
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        status: 'verified',
        proofAvailable: true
      },
      {
        id: '2',
        type: 'election_created',
        electionId: 'election-002',
        electionTitle: 'Budget Allocation Vote',
        timestamp: Date.now() - 7200000,
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        status: 'verified',
        proofAvailable: true
      },
      {
        id: '3',
        type: 'vote_tallied',
        electionId: 'election-001',
        electionTitle: 'Community Leadership Election 2026',
        timestamp: Date.now() - 10800000,
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        status: 'verified',
        proofAvailable: true
      }
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  };

  const filteredTransactions = transactions?.filter(tx => {
    const matchesFilter = filter === 'all' || tx?.type === filter;
    const matchesSearch = tx?.electionTitle?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         tx?.hash?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportBulletinBoard = () => {
    const dataStr = JSON.stringify(transactions, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bulletin-board-${Date.now()}.json`;
    link?.click();
  };

  const getTypeLabel = (type) => {
    const labels = {
      vote_cast: 'Vote Cast',
      election_created: 'Election Created',
      vote_tallied: 'Vote Tallied',
      audit_performed: 'Audit Performed'
    };
    return labels?.[type] || type;
  };

  const getTypeColor = (type) => {
    const colors = {
      vote_cast: 'bg-blue-100 text-blue-800',
      election_created: 'bg-green-100 text-green-800',
      vote_tallied: 'bg-purple-100 text-purple-800',
      audit_performed: 'bg-yellow-100 text-yellow-800'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Public Bulletin Board</h2>
          <p className="text-gray-600">All election transactions, cryptographic proofs, and verification data with public accessibility</p>
        </div>
        <Eye className="w-12 h-12 text-blue-600" />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by election title or hash..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e?.target?.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="vote_cast">Vote Cast</option>
          <option value="election_created">Election Created</option>
          <option value="vote_tallied">Vote Tallied</option>
          <option value="audit_performed">Audit Performed</option>
        </select>

        <button
          onClick={loadBulletinBoard}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </button>

        <button
          onClick={exportBulletinBoard}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading bulletin board...</p>
          </div>
        ) : filteredTransactions?.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No transactions found</p>
          </div>
        ) : (
          filteredTransactions?.map((tx) => (
            <div key={tx?.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(tx?.type)}`}>
                      {getTypeLabel(tx?.type)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(tx?.timestamp)?.toLocaleString()}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tx?.electionTitle}</h3>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Election ID:</span>
                      <span className="text-sm font-mono text-gray-900">{tx?.electionId}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Transaction Hash:</span>
                      <span className="text-sm font-mono text-gray-900 truncate max-w-md">{tx?.hash}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  {tx?.proofAvailable && (
                    <span className="flex items-center space-x-1 text-green-600 text-sm">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span>Proof Available</span>
                    </span>
                  )}
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Immutability Notice */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Immutable Logging</h4>
            <p className="text-sm text-blue-800">
              All transactions are cryptographically signed and stored in a tamper-evident hash chain. Any modification to historical records will be immediately detected through hash verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicBulletinBoardPanel;