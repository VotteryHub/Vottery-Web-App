import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import AIFacialEstimationPanel from './components/AIFacialEstimationPanel';
import GovernmentIDVerificationPanel from './components/GovernmentIDVerificationPanel';
import BiometricMatchingPanel from './components/BiometricMatchingPanel';
import DigitalIdentityWalletPanel from './components/DigitalIdentityWalletPanel';
import WaterfallVerificationPanel from './components/WaterfallVerificationPanel';
import ComplianceControlsPanel from './components/ComplianceControlsPanel';


const AgeVerificationDigitalIdentityCenter = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('ai-facial');
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [digitalWallet, setDigitalWallet] = useState(null);

  useEffect(() => {
    loadDigitalWallet();
  }, [user]);

  const loadDigitalWallet = async () => {
    if (!user?.id) return;
    // Load existing digital wallet if available
    // Implementation would query digital_identity_wallets table
  };

  const tabs = [
    { id: 'ai-facial', label: 'AI Facial Estimation', icon: 'User' },
    { id: 'government-id', label: 'Government ID', icon: 'CreditCard' },
    { id: 'biometric', label: 'Biometric Matching', icon: 'Fingerprint' },
    { id: 'digital-wallet', label: 'Digital Wallet', icon: 'Wallet' },
    { id: 'waterfall', label: 'Waterfall Approach', icon: 'GitBranch' },
    { id: 'compliance', label: 'ISO 27001 Compliance', icon: 'Shield' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ai-facial':
        return <AIFacialEstimationPanel onVerificationComplete={setVerificationStatus} />;
      case 'government-id':
        return <GovernmentIDVerificationPanel onVerificationComplete={setVerificationStatus} />;
      case 'biometric':
        return <BiometricMatchingPanel onVerificationComplete={setVerificationStatus} />;
      case 'digital-wallet':
        return <DigitalIdentityWalletPanel wallet={digitalWallet} onWalletUpdate={setDigitalWallet} />;
      case 'waterfall':
        return <WaterfallVerificationPanel onVerificationComplete={setVerificationStatus} />;
      case 'compliance':
        return <ComplianceControlsPanel />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-64">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-2 border-primary/20 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="ShieldCheck" size={32} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    Age Verification & Digital Identity Center
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Comprehensive age verification using AI-powered facial age estimation, government ID matching, and biometric authentication with reusable digital identity wallets following ISO 27001 compliance standards
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Status Banner */}
            {verificationStatus && (
              <div className={`border-2 rounded-xl p-4 ${
                verificationStatus?.verificationStatus === 'verified' 
                  ? 'bg-success/10 border-success/30' 
                  : verificationStatus?.verificationStatus === 'borderline' ?'bg-warning/10 border-warning/30' :'bg-destructive/10 border-destructive/30'
              }`}>
                <div className="flex items-center gap-3">
                  <Icon 
                    name={verificationStatus?.verificationStatus === 'verified' ? 'CheckCircle' : 'AlertCircle'} 
                    size={24} 
                    className={verificationStatus?.verificationStatus === 'verified' ? 'text-success' : 'text-warning'}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      Verification Status: {verificationStatus?.verificationStatus?.toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Confidence Score: {(verificationStatus?.confidenceScore * 100)?.toFixed(1)}%
                      {verificationStatus?.fallbackTriggered && ' • Fallback verification recommended'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex overflow-x-auto scrollbar-hide border-b border-border">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 md:px-6 py-4 font-medium text-sm md:text-base whitespace-nowrap transition-all duration-200 border-b-2 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="hidden md:inline">{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>

            {/* ISO 27001 Compliance Badge */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Award" size={24} className="text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">ISO/IEC 27001:2025 Compliant</p>
                    <p className="text-xs text-muted-foreground">Age assurance systems certified to international standards</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Lock" size={18} className="text-success" />
                  <span className="text-sm font-medium text-success">GDPR Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AgeVerificationDigitalIdentityCenter;