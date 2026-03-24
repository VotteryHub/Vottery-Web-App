import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import RSAEncryptionPanel from './components/RSAEncryptionPanel';
import HomomorphicEncryptionPanel from './components/HomomorphicEncryptionPanel';
import ZeroKnowledgeProofPanel from './components/ZeroKnowledgeProofPanel';
import ThresholdCryptographyPanel from './components/ThresholdCryptographyPanel';
import CryptographicAuditPanel from './components/CryptographicAuditPanel';
import Icon from '../../components/AppIcon';
import CryptographicBatch1ScopeBanner from '../../components/ui/CryptographicBatch1ScopeBanner';
import { cryptographicService } from '../../services/cryptographicService';

const CryptographicSecurityManagementCenter = () => {
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePanel, setActivePanel] = useState('overview');

  useEffect(() => {
    loadSystemHealth();
  }, []);

  const loadSystemHealth = async () => {
    try {
      const { data } = cryptographicService?.getSystemHealth();
      setSystemHealth(data);
    } catch (error) {
      console.error('Failed to load system health:', error);
    } finally {
      setLoading(false);
    }
  };

  const healthIndicators = [
    { label: 'RSA Encryption', status: systemHealth?.rsaStatus, icon: 'Lock', color: 'var(--color-primary)' },
    { label: 'Homomorphic Encryption', status: systemHealth?.elgamalStatus, icon: 'Shield', color: 'var(--color-secondary)' },
    { label: 'Zero-Knowledge Proofs', status: systemHealth?.zkpStatus, icon: 'Eye', color: 'var(--color-success)' },
    { label: 'Threshold Cryptography', status: systemHealth?.thresholdStatus, icon: 'Users', color: 'var(--color-accent)' },
    { label: 'Audit Trails', status: systemHealth?.auditStatus, icon: 'FileText', color: 'var(--color-warning)' }
  ];

  return (
    <>
      <Helmet>
        <title>Cryptographic Security Management Center | Vottery</title>
      </Helmet>
      <div className="flex flex-col min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex flex-1">
          <ElectionsSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              <CryptographicBatch1ScopeBanner />
              {/* Header */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
                      Cryptographic Security Management Center
                    </h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                      Comprehensive Tier 1 cryptographic infrastructure for secure election operations
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border max-w-xs text-right">
                    <Icon name="ShieldCheck" size={20} className="text-muted-foreground shrink-0" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {systemHealth?.vvsgCompliance || 'VVSG / compliance — verify per deployment audit'}
                    </span>
                  </div>
                </div>

                {/* System Health Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {healthIndicators?.map((indicator, index) => (
                    <div key={index} className="bg-muted/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center">
                          <Icon name={indicator?.icon} size={16} color={indicator?.color} />
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          indicator?.status === 'operational' ? 'bg-success' : 'bg-warning'
                        }`} />
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{indicator?.label}</p>
                      <p className="text-sm font-medium text-foreground capitalize">{indicator?.status}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-card rounded-xl p-2 border border-border">
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
                    { id: 'rsa', label: 'RSA Encryption', icon: 'Lock' },
                    { id: 'homomorphic', label: 'Homomorphic Encryption', icon: 'Shield' },
                    { id: 'zkp', label: 'Zero-Knowledge Proofs', icon: 'Eye' },
                    { id: 'threshold', label: 'Threshold Cryptography', icon: 'Users' },
                    { id: 'audit', label: 'Audit Trails', icon: 'FileText' }
                  ]?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActivePanel(tab?.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-250 ${
                        activePanel === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Panel Content */}
              {activePanel === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Activity" size={20} color="var(--color-primary)" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">System Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Encryption Keys</span>
                        <span className="text-sm font-medium text-foreground">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Encrypted Votes</span>
                        <span className="text-sm font-medium text-foreground">8,934</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">ZKP Verifications</span>
                        <span className="text-sm font-medium text-foreground">8,934</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Audit Entries</span>
                        <span className="text-sm font-medium text-foreground">45,678</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon name="CheckCircle" size={20} color="var(--color-success)" />
                      </div>
                      <h3 className="text-lg font-heading font-semibold text-foreground">Compliance Status</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm font-medium text-foreground">VVSG 2.0 Compliance</span>
                        <Icon name="Check" size={16} className="text-success" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm font-medium text-foreground">End-to-End Encryption</span>
                        <Icon name="Check" size={16} className="text-success" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Voter Verifiability</span>
                        <Icon name="Check" size={16} className="text-success" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                        <span className="text-sm font-medium text-foreground">Universal Auditability</span>
                        <Icon name="Check" size={16} className="text-success" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePanel === 'rsa' && <RSAEncryptionPanel />}
              {activePanel === 'homomorphic' && <HomomorphicEncryptionPanel />}
              {activePanel === 'zkp' && <ZeroKnowledgeProofPanel />}
              {activePanel === 'threshold' && <ThresholdCryptographyPanel />}
              {activePanel === 'audit' && <CryptographicAuditPanel />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default CryptographicSecurityManagementCenter;