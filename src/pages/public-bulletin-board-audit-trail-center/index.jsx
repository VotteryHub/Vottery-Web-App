import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileCheck, CheckCircle, Eye, Download, Search } from 'lucide-react';
import PublicBulletinBoardPanel from './components/PublicBulletinBoardPanel';
import UniversalVerificationPanel from './components/UniversalVerificationPanel';
import TamperEvidentLoggingPanel from './components/TamperEvidentLoggingPanel';
import VVSGCompliancePanel from './components/VVSGCompliancePanel';
import CryptographicProofsPanel from './components/CryptographicProofsPanel';
import AuditAPIPanel from './components/AuditAPIPanel';
import Icon from '../../components/AppIcon';


const PublicBulletinBoardAuditTrailCenter = () => {
  const [activePanel, setActivePanel] = useState('bulletin');
  const [verificationStats, setVerificationStats] = useState({
    totalTransactions: 0,
    verifiedProofs: 0,
    activeAudits: 0,
    complianceScore: 0
  });

  useEffect(() => {
    loadVerificationStats();
  }, []);

  const loadVerificationStats = async () => {
    // Simulated stats - in production, fetch from Supabase
    setVerificationStats({
      totalTransactions: 15847,
      verifiedProofs: 15842,
      activeAudits: 12,
      complianceScore: 99.97
    });
  };

  const panels = [
    { id: 'bulletin', label: 'Public Bulletin Board', icon: Eye },
    { id: 'verification', label: 'Universal Verification', icon: CheckCircle },
    { id: 'tamper', label: 'Tamper-Evident Logging', icon: Shield },
    { id: 'compliance', label: 'VVSG 2.0 Compliance', icon: FileCheck },
    { id: 'proofs', label: 'Cryptographic Proofs', icon: Lock },
    { id: 'api', label: 'Public API Access', icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Public Bulletin Board & Audit Trail Center
              </h1>
              <p className="text-gray-600">
                Universal verification capabilities through transparent cryptographic logging and tamper-evident audit trails with VVSG 2.0 compliance
              </p>
            </div>
            <Shield className="w-16 h-16 text-blue-600" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {verificationStats?.totalTransactions?.toLocaleString()}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified Proofs</p>
                  <p className="text-2xl font-bold text-green-600">
                    {verificationStats?.verifiedProofs?.toLocaleString()}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Audits</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {verificationStats?.activeAudits}
                  </p>
                </div>
                <Search className="w-8 h-8 text-purple-600" />
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Compliance Score</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {verificationStats?.complianceScore}%
                  </p>
                </div>
                <FileCheck className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex space-x-2 overflow-x-auto">
            {panels?.map((panel) => {
              const Icon = panel?.icon;
              return (
                <button
                  key={panel?.id}
                  onClick={() => setActivePanel(panel?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all whitespace-nowrap ${
                    activePanel === panel?.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{panel?.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Panel Content */}
      <div className="max-w-7xl mx-auto">
        {activePanel === 'bulletin' && <PublicBulletinBoardPanel />}
        {activePanel === 'verification' && <UniversalVerificationPanel />}
        {activePanel === 'tamper' && <TamperEvidentLoggingPanel />}
        {activePanel === 'compliance' && <VVSGCompliancePanel />}
        {activePanel === 'proofs' && <CryptographicProofsPanel />}
        {activePanel === 'api' && <AuditAPIPanel />}
      </div>
    </div>
  );
};

export default PublicBulletinBoardAuditTrailCenter;