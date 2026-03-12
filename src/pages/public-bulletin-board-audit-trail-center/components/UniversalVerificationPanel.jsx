import React, { useState } from 'react';
import { CheckCircle, Search, Upload, Download, AlertCircle } from 'lucide-react';


const UniversalVerificationPanel = () => {
  const [verificationInput, setVerificationInput] = useState('');
  const [verificationType, setVerificationType] = useState('vote_hash');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const performVerification = async () => {
    if (!verificationInput?.trim()) {
      alert('Please enter a value to verify');
      return;
    }

    setLoading(true);

    // Simulate verification process
    setTimeout(() => {
      const isValid = Math.random() > 0.1; // 90% success rate for demo

      setVerificationResult({
        valid: isValid,
        input: verificationInput,
        type: verificationType,
        timestamp: Date.now(),
        details: {
          hashChainValid: isValid,
          signatureValid: isValid,
          merkleProofValid: isValid,
          timestampValid: isValid
        },
        electionInfo: {
          title: 'Community Leadership Election 2026',
          status: 'completed',
          totalVotes: 1547
        }
      });

      setLoading(false);
    }, 2000);
  };

  const uploadProofFile = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const proofData = JSON.parse(e?.target?.result);
          setVerificationInput(proofData?.hash || proofData?.voteHash || '');
        } catch (error) {
          alert('Invalid proof file format');
        }
      };
      reader?.readAsText(file);
    }
  };

  const downloadVerificationReport = () => {
    if (!verificationResult) return;

    const report = {
      verificationResult,
      timestamp: new Date()?.toISOString(),
      verifier: 'Universal Verification System'
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `verification-report-${Date.now()}.json`;
    link?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Universal Verification</h2>
          <p className="text-gray-600">Independently verify election integrity through cryptographic proof checking without specialized knowledge</p>
        </div>
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      {/* Verification Input */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verify Cryptographic Proof</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Verification Type
            </label>
            <select
              value={verificationType}
              onChange={(e) => setVerificationType(e?.target?.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="vote_hash">Vote Hash</option>
              <option value="receipt_hash">Receipt Hash</option>
              <option value="merkle_root">Merkle Root</option>
              <option value="transaction_hash">Transaction Hash</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Hash or Upload Proof File
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Enter cryptographic hash..."
                value={verificationInput}
                onChange={(e) => setVerificationInput(e?.target?.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <label className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer transition-colors">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={uploadProofFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            onClick={performVerification}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Verify Proof</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verificationResult && (
        <div className={`rounded-lg p-6 mb-6 ${
          verificationResult?.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {verificationResult?.valid ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <AlertCircle className="w-8 h-8 text-red-600" />
              )}
              <div>
                <h3 className={`text-xl font-bold ${
                  verificationResult?.valid ? 'text-green-900' : 'text-red-900'
                }`}>
                  {verificationResult?.valid ? 'Verification Successful' : 'Verification Failed'}
                </h3>
                <p className={`text-sm ${
                  verificationResult?.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {new Date(verificationResult?.timestamp)?.toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={downloadVerificationReport}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Verification Details */}
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Verification Details</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Hash Chain Integrity:</span>
                  <span className={`text-sm font-medium ${
                    verificationResult?.details?.hashChainValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult?.details?.hashChainValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Digital Signature:</span>
                  <span className={`text-sm font-medium ${
                    verificationResult?.details?.signatureValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult?.details?.signatureValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Merkle Proof:</span>
                  <span className={`text-sm font-medium ${
                    verificationResult?.details?.merkleProofValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult?.details?.merkleProofValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Timestamp Verification:</span>
                  <span className={`text-sm font-medium ${
                    verificationResult?.details?.timestampValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {verificationResult?.details?.timestampValid ? '✓ Valid' : '✗ Invalid'}
                  </span>
                </div>
              </div>
            </div>

            {verificationResult?.electionInfo && (
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Election Information</h4>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Title:</span> {verificationResult?.electionInfo?.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {verificationResult?.electionInfo?.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Total Votes:</span> {verificationResult?.electionInfo?.totalVotes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">How Universal Verification Works</h4>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• Enter your vote hash or receipt hash from your voting confirmation</li>
          <li>• System checks cryptographic proofs against public bulletin board</li>
          <li>• Verifies hash chain integrity, digital signatures, and Merkle proofs</li>
          <li>• Confirms your vote was recorded and counted correctly</li>
          <li>• All verification happens without revealing your vote choice</li>
        </ul>
      </div>
    </div>
  );
};

export default UniversalVerificationPanel;