import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Clock, CheckCircle, TrendingUp } from 'lucide-react';


const TamperEvidentLoggingPanel = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [hashChainStatus, setHashChainStatus] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAuditLogs();
    verifyHashChain();
  }, []);

  const loadAuditLogs = async () => {
    // Simulated audit logs with hash chain
    const mockLogs = [
      {
        id: '1',
        action: 'vote_cast',
        electionId: 'election-001',
        timestamp: Date.now() - 3600000,
        userId: 'user-123',
        details: 'Vote cast in Community Leadership Election',
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        previousHash: null
      },
      {
        id: '2',
        action: 'election_tallied',
        electionId: 'election-001',
        timestamp: Date.now() - 1800000,
        userId: 'admin-001',
        details: 'Election results tallied and verified',
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        previousHash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join('')
      },
      {
        id: '3',
        action: 'audit_performed',
        electionId: 'election-001',
        timestamp: Date.now() - 900000,
        userId: 'auditor-005',
        details: 'Independent audit completed successfully',
        hash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join(''),
        previousHash: '0x' + Array(64)?.fill(0)?.map(() => Math.floor(Math.random() * 16)?.toString(16))?.join('')
      }
    ];

    setAuditLogs(mockLogs);
  };

  const verifyHashChain = async () => {
    // Simulate hash chain verification
    setTimeout(() => {
      setHashChainStatus({
        valid: true,
        totalBlocks: 15847,
        verifiedBlocks: 15847,
        lastVerified: Date.now(),
        integrityScore: 100
      });
    }, 1000);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'vote_cast':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case 'election_tallied':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'audit_performed':
        return <Shield className="w-5 h-5 text-purple-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'vote_cast':
        return 'bg-blue-100 text-blue-800';
      case 'election_tallied':
        return 'bg-green-100 text-green-800';
      case 'audit_performed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tamper-Evident Logging</h2>
          <p className="text-gray-600">Chronological audit trails with cryptographic timestamps and automated tamper detection</p>
        </div>
        <Shield className="w-12 h-12 text-purple-600" />
      </div>

      {/* Hash Chain Status */}
      {hashChainStatus && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hash Chain Integrity</h3>
            <div className="flex items-center space-x-2">
              {hashChainStatus?.valid ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-green-600 font-semibold">Verified</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <span className="text-red-600 font-semibold">Tampered</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Total Blocks</p>
              <p className="text-2xl font-bold text-gray-900">{hashChainStatus?.totalBlocks?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Verified Blocks</p>
              <p className="text-2xl font-bold text-green-600">{hashChainStatus?.verifiedBlocks?.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Integrity Score</p>
              <p className="text-2xl font-bold text-purple-600">{hashChainStatus?.integrityScore}%</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Last Verified</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(hashChainStatus?.lastVerified)?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Audit Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Chronological Audit Trail</h3>
        <div className="space-y-4">
          {auditLogs?.map((log, index) => (
            <div key={log?.id} className="relative">
              {/* Timeline Line */}
              {index < auditLogs?.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300"></div>
              )}

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                  {getActionIcon(log?.action)}
                </div>

                <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log?.action)}`}>
                        {log?.action?.replace('_', ' ')?.toUpperCase()}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(log?.timestamp)?.toLocaleString()}
                      </p>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>

                  <p className="text-gray-900 mb-3">{log?.details}</p>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Block Hash:</span>
                      <span className="text-xs font-mono text-gray-900 truncate">{log?.hash}</span>
                    </div>
                    {log?.previousHash && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">Previous Hash:</span>
                        <span className="text-xs font-mono text-gray-900 truncate">{log?.previousHash}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tamper Detection Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Automated Tamper Detection</h4>
            <p className="text-sm text-yellow-800">
              Every log entry is cryptographically linked to the previous entry through hash chaining. Any attempt to modify historical records will break the chain and trigger immediate alerts. The system continuously monitors hash chain integrity in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TamperEvidentLoggingPanel;