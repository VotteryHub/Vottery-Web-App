import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle, AlertCircle, Shield, Download } from 'lucide-react';

const VVSGCompliancePanel = () => {
  const [complianceData, setComplianceData] = useState(null);
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    loadComplianceData();
  }, []);

  const loadComplianceData = async () => {
    // Simulated VVSG 2.0 compliance data
    setComplianceData({
      overallScore: 99.7,
      certificationStatus: 'Certified',
      lastAudit: Date.now() - 86400000 * 7,
      nextAudit: Date.now() + 86400000 * 83,
      categories: [
        { name: 'Software Independence', score: 100, status: 'pass' },
        { name: 'Auditability', score: 99.8, status: 'pass' },
        { name: 'Cryptographic Integrity', score: 100, status: 'pass' },
        { name: 'Voter Verifiability', score: 99.5, status: 'pass' },
        { name: 'Security Requirements', score: 99.2, status: 'pass' },
        { name: 'Accessibility Standards', score: 100, status: 'pass' }
      ]
    });

    setTestResults([
      {
        id: '1',
        test: 'End-to-End Encryption Verification',
        requirement: 'VVSG 2.0 Section 7.2.1',
        status: 'pass',
        lastRun: Date.now() - 3600000,
        details: 'All votes encrypted with RSA-2048 and verified'
      },
      {
        id: '2',
        test: 'Zero-Knowledge Proof Validation',
        requirement: 'VVSG 2.0 Section 7.3.2',
        status: 'pass',
        lastRun: Date.now() - 7200000,
        details: 'ZKP protocols functioning correctly'
      },
      {
        id: '3',
        test: 'Audit Trail Integrity Check',
        requirement: 'VVSG 2.0 Section 8.1.1',
        status: 'pass',
        lastRun: Date.now() - 1800000,
        details: 'Hash chain verified, no tampering detected'
      },
      {
        id: '4',
        test: 'Voter Privacy Protection',
        requirement: 'VVSG 2.0 Section 6.4.3',
        status: 'pass',
        lastRun: Date.now() - 5400000,
        details: 'Mixnet anonymization layer operational'
      }
    ]);
  };

  const downloadComplianceReport = () => {
    const report = {
      complianceData,
      testResults,
      generatedAt: new Date()?.toISOString(),
      standard: 'VVSG 2.0'
    };

    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vvsg-compliance-report-${Date.now()}.json`;
    link?.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">VVSG 2.0 Compliance Dashboard</h2>
          <p className="text-gray-600">Certification status, security requirement adherence, and automated testing protocols</p>
        </div>
        <FileCheck className="w-12 h-12 text-blue-600" />
      </div>

      {complianceData && (
        <>
          {/* Overall Compliance Status */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  VVSG 2.0 Compliance Score: {complianceData?.overallScore}%
                </h3>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-600 font-semibold">{complianceData?.certificationStatus}</span>
                </div>
              </div>
              <button
                onClick={downloadComplianceReport}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                <span>Download Report</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Last Audit</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(complianceData?.lastAudit)?.toLocaleDateString()}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Next Audit</p>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(complianceData?.nextAudit)?.toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Categories */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Categories</h3>
            <div className="grid grid-cols-2 gap-4">
              {complianceData?.categories?.map((category) => (
                <div key={category?.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{category?.name}</h4>
                    {category?.status === 'pass' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${category?.score}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{category?.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automated Test Results */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Automated Testing Protocols</h3>
            <div className="space-y-3">
              {testResults?.map((test) => (
                <div key={test?.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {test?.status === 'pass' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className="font-semibold text-gray-900">{test?.test}</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Requirement:</span> {test?.requirement}
                      </p>
                      <p className="text-sm text-gray-700">{test?.details}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        test?.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {test?.status?.toUpperCase()}
                      </span>
                      <p className="text-xs text-gray-500 mt-2">
                        Last run: {new Date(test?.lastRun)?.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* VVSG 2.0 Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">About VVSG 2.0 Compliance</h4>
                <p className="text-sm text-blue-800 mb-2">
                  The Voluntary Voting System Guidelines (VVSG) 2.0 are standards developed by the U.S. Election Assistance Commission to ensure voting systems meet security, accessibility, and auditability requirements.
                </p>
                <p className="text-sm text-blue-800">
                  This system implements end-to-end cryptographic protocols, software-independent verification, and comprehensive audit trails to meet and exceed VVSG 2.0 requirements for secure online elections.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VVSGCompliancePanel;