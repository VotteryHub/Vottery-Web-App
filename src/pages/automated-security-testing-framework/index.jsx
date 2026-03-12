import React, { useState, useEffect } from 'react';
import { Icon } from 'lucide-react';
import OWASPScanningPanel from './components/OWASPScanningPanel';
import DependencyVulnerabilityPanel from './components/DependencyVulnerabilityPanel';
import PenetrationTestingPanel from './components/PenetrationTestingPanel';
import CICDIntegrationPanel from './components/CICDIntegrationPanel';
import SecurityReportsPanel from './components/SecurityReportsPanel';
import AutomatedTestingPanel from './components/AutomatedTestingPanel';

const AutomatedSecurityTestingFramework = () => {
  const [activeTab, setActiveTab] = useState('owasp');
  const [testingStatus, setTestingStatus] = useState('idle');
  const [lastScan, setLastScan] = useState(null);

  useEffect(() => {
    loadLastScanInfo();
  }, []);

  const loadLastScanInfo = async () => {
    // Load last scan information
    setLastScan({
      timestamp: new Date()?.toISOString(),
      duration: '12m 34s',
      vulnerabilities: 23,
      status: 'completed'
    });
  };

  const tabs = [
    { id: 'owasp', label: 'OWASP Scanning', icon: 'Shield' },
    { id: 'dependencies', label: 'Dependency Checks', icon: 'Package' },
    { id: 'penetration', label: 'Penetration Testing', icon: 'Target' },
    { id: 'cicd', label: 'CI/CD Integration', icon: 'GitBranch' },
    { id: 'automated', label: 'Automated Tests', icon: 'Zap' },
    { id: 'reports', label: 'Security Reports', icon: 'FileText' }
  ];

  const runFullSecurityScan = () => {
    setTestingStatus('running');
    // Trigger full security scan
    setTimeout(() => {
      setTestingStatus('completed');
      loadLastScanInfo();
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2 flex items-center gap-3">
              <Icon name="Shield" size={32} className="text-blue-600" />
              Automated Security Testing Framework
            </h1>
            <p className="text-muted-foreground">
              Continuous security testing suite with OWASP scanning, dependency vulnerability checks, and automated penetration testing workflows integrated with CI/CD pipelines
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={runFullSecurityScan}
              disabled={testingStatus === 'running'}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testingStatus === 'running' ? (
                <>
                  <Icon name="Loader" size={18} className="animate-spin" />
                  Running Scan...
                </>
              ) : (
                <>
                  <Icon name="Play" size={18} />
                  Run Full Security Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Shield" size={20} className="text-blue-600" />
              <span className={`text-xs font-medium px-2 py-1 rounded ${
                testingStatus === 'running' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
              }`}>
                {testingStatus === 'running' ? 'SCANNING' : 'READY'}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">Active</div>
            <div className="text-xs text-muted-foreground">Security Testing</div>
          </div>

          <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="AlertTriangle" size={20} className="text-red-600" />
              <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">HIGH</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">23</div>
            <div className="text-xs text-muted-foreground">Vulnerabilities Found</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Package" size={20} className="text-orange-600" />
              <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-1 rounded">OUTDATED</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">7</div>
            <div className="text-xs text-muted-foreground">Dependency Issues</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="Target" size={20} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">PASSED</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">94%</div>
            <div className="text-xs text-muted-foreground">Penetration Tests</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Icon name="GitBranch" size={20} className="text-green-600" />
              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">INTEGRATED</span>
            </div>
            <div className="text-2xl font-bold text-foreground mb-1">CI/CD</div>
            <div className="text-xs text-muted-foreground">Pipeline Active</div>
          </div>
        </div>

        {/* Last Scan Info */}
        {lastScan && (
          <div className="mt-4 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Last Scan:</span>
                  <span className="font-medium text-foreground">{new Date(lastScan.timestamp)?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Timer" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium text-foreground">{lastScan?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="AlertTriangle" size={16} className="text-muted-foreground" />
                  <span className="text-muted-foreground">Issues Found:</span>
                  <span className="font-medium text-red-600">{lastScan?.vulnerabilities}</span>
                </div>
              </div>
              <span className="text-xs font-medium px-3 py-1 rounded bg-green-100 text-green-600">
                {lastScan?.status?.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
      {/* Tab Navigation */}
      <div className="bg-card border border-border rounded-lg p-2 mb-6">
        <div className="flex gap-2 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Content Panels */}
      <div className="space-y-6">
        {activeTab === 'owasp' && <OWASPScanningPanel />}
        {activeTab === 'dependencies' && <DependencyVulnerabilityPanel />}
        {activeTab === 'penetration' && <PenetrationTestingPanel />}
        {activeTab === 'cicd' && <CICDIntegrationPanel />}
        {activeTab === 'automated' && <AutomatedTestingPanel />}
        {activeTab === 'reports' && <SecurityReportsPanel />}
      </div>
    </div>
  );
};

export default AutomatedSecurityTestingFramework;