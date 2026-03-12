import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import { securityTestingService } from '../../../services/securityTestingService';

const OWASPScanningPanel = () => {
  const [scanResults, setScanResults] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [selectedTests, setSelectedTests] = useState([]);

  useEffect(() => {
    loadScanResults();
  }, []);

  const loadScanResults = async () => {
    try {
      const results = await securityTestingService?.runOWASPScan();
      setScanResults(results);
    } catch (error) {
      console.error('Failed to load OWASP scan results:', error);
    }
  };

  const runScan = async () => {
    setScanning(true);
    try {
      const results = await securityTestingService?.runOWASPScan(selectedTests);
      setScanResults(results);
    } catch (error) {
      console.error('OWASP scan failed:', error);
    } finally {
      setScanning(false);
    }
  };

  const owaspTop10 = [
    { id: 'A01', name: 'Broken Access Control', severity: 'CRITICAL' },
    { id: 'A02', name: 'Cryptographic Failures', severity: 'HIGH' },
    { id: 'A03', name: 'Injection', severity: 'CRITICAL' },
    { id: 'A04', name: 'Insecure Design', severity: 'HIGH' },
    { id: 'A05', name: 'Security Misconfiguration', severity: 'MEDIUM' },
    { id: 'A06', name: 'Vulnerable Components', severity: 'HIGH' },
    { id: 'A07', name: 'Authentication Failures', severity: 'CRITICAL' },
    { id: 'A08', name: 'Data Integrity Failures', severity: 'MEDIUM' },
    { id: 'A09', name: 'Logging Failures', severity: 'LOW' },
    { id: 'A10', name: 'SSRF', severity: 'HIGH' }
  ];

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'text-red-600 bg-red-100',
      HIGH: 'text-orange-600 bg-orange-100',
      MEDIUM: 'text-yellow-600 bg-yellow-100',
      LOW: 'text-blue-600 bg-blue-100'
    };
    return colors?.[severity] || colors?.LOW;
  };

  return (
    <div className="space-y-6">
      {/* OWASP Top 10 Tests */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Icon name="Shield" size={20} />
            OWASP Top 10 Security Tests
          </h3>
          <button
            onClick={runScan}
            disabled={scanning}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {scanning ? (
              <>
                <Icon name="Loader" size={14} className="animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Icon name="Play" size={14} />
                Run OWASP Scan
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {owaspTop10?.map((test) => (
            <div key={test?.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-muted-foreground">{test?.id}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(test?.severity)}`}>
                      {test?.severity}
                    </span>
                  </div>
                  <h4 className="font-semibold text-foreground">{test?.name}</h4>
                </div>
                <input
                  type="checkbox"
                  checked={selectedTests?.includes(test?.id)}
                  onChange={(e) => {
                    if (e?.target?.checked) {
                      setSelectedTests([...selectedTests, test?.id]);
                    } else {
                      setSelectedTests(selectedTests?.filter(id => id !== test?.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 rounded"
                />
              </div>
              {scanResults?.tests?.[test?.id] && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Status:</span>
                    <span className={`font-medium ${
                      scanResults?.tests?.[test?.id]?.passed ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {scanResults?.tests?.[test?.id]?.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  {!scanResults?.tests?.[test?.id]?.passed && (
                    <div className="mt-2 text-xs text-red-600">
                      {scanResults?.tests?.[test?.id]?.issues} issues found
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Scan Results */}
      {scanResults && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
            <Icon name="FileText" size={20} />
            Scan Results
          </h3>
          <div className="space-y-3">
            {scanResults?.vulnerabilities?.map((vuln, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${getSeverityColor(vuln?.severity)}`}>
                        {vuln?.severity}
                      </span>
                      <span className="text-xs text-muted-foreground">{vuln?.category}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{vuln?.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{vuln?.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2 font-medium text-foreground font-mono">{vuln?.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CWE:</span>
                    <span className="ml-2 font-medium text-foreground">{vuln?.cwe}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">CVSS:</span>
                    <span className="ml-2 font-medium text-foreground">{vuln?.cvss}</span>
                  </div>
                </div>
                {vuln?.remediation && (
                  <div className="bg-muted/30 rounded p-3">
                    <div className="text-xs font-semibold text-foreground mb-1">Remediation:</div>
                    <div className="text-xs text-muted-foreground">{vuln?.remediation}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ZAP Integration Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Zap" size={20} />
          OWASP ZAP Integration
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4 text-center">
            <Icon name="CheckCircle" size={24} className="text-green-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-foreground mb-1">Connected</div>
            <div className="text-xs text-muted-foreground">ZAP Proxy Active</div>
          </div>
          <div className="border border-border rounded-lg p-4 text-center">
            <Icon name="Activity" size={24} className="text-blue-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-foreground mb-1">1,247</div>
            <div className="text-xs text-muted-foreground">Requests Scanned</div>
          </div>
          <div className="border border-border rounded-lg p-4 text-center">
            <Icon name="AlertTriangle" size={24} className="text-orange-600 mx-auto mb-2" />
            <div className="text-sm font-semibold text-foreground mb-1">23</div>
            <div className="text-xs text-muted-foreground">Alerts Generated</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OWASPScanningPanel;