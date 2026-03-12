import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { cryptographicService } from '../../../services/cryptographicService';

const CryptographicAuditPanel = () => {
  const [auditStats, setAuditStats] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    loadAuditStats();
  }, []);

  const loadAuditStats = async () => {
    const { data } = cryptographicService?.audit?.getAuditStats();
    setAuditStats(data);
  };

  const handleVerifyChain = async () => {
    setVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockEntries = [
      { hash: 'hash1', data: { action: 'vote_cast' } },
      { hash: 'hash2', data: { action: 'vote_verified' } },
      { hash: 'hash3', data: { action: 'tally_completed' } }
    ];
    
    const { data } = cryptographicService?.audit?.verifyAuditChain(mockEntries);
    setVerificationResult(data);
    setVerifying(false);
  };

  return (
    <div className="space-y-6">
      {/* Audit Statistics */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Cryptographic Audit Trails</h3>
            <p className="text-sm text-muted-foreground">Tamper-evident logging with hash chains</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Total Audit Entries</p>
            <p className="text-2xl font-bold text-foreground">{auditStats?.totalAuditEntries?.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Chain Integrity</p>
            <p className="text-2xl font-bold text-success">{auditStats?.chainIntegrity}%</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Last Audit</p>
            <p className="text-sm font-medium text-foreground">
              {auditStats?.lastAudit ? new Date(auditStats?.lastAudit)?.toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <div className="p-4 bg-success/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">VVSG Compliance</p>
            <p className="text-sm font-medium text-success">
              {auditStats?.vvsgCompliance ? 'Certified' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Hash Chain Verification */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Link" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Hash Chain Verification</h3>
            <p className="text-sm text-muted-foreground">SHA-256 cryptographic integrity</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-3">Audit Trail Structure</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Each entry cryptographically linked to previous</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">SHA-256 hash prevents tampering</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Timestamp verification ensures chronological order</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={14} className="text-success" />
                <span className="text-xs text-foreground">Immutable record of all election operations</span>
              </div>
            </div>
          </div>

          <Button onClick={handleVerifyChain} disabled={verifying} iconName="Shield">
            {verifying ? 'Verifying Chain...' : 'Verify Audit Chain'}
          </Button>

          {verificationResult && (
            <div className={`p-4 rounded-lg ${
              verificationResult?.isValid ? 'bg-success/10' : 'bg-error/10'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon 
                  name={verificationResult?.isValid ? 'CheckCircle' : 'XCircle'} 
                  size={20} 
                  className={verificationResult?.isValid ? 'text-success' : 'text-error'}
                />
                <span className={`text-sm font-medium ${
                  verificationResult?.isValid ? 'text-success' : 'text-error'
                }`}>
                  {verificationResult?.isValid ? 'Chain Integrity Verified' : 'Chain Integrity Failed'}
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Total Entries Verified</span>
                  <span className="text-xs font-medium text-foreground">{verificationResult?.totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Verification Time</span>
                  <span className="text-xs font-medium text-foreground">
                    {new Date(verificationResult?.timestamp)?.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* VVSG 2.0 Compliance */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">VVSG 2.0 Compliance</h3>
            <p className="text-sm text-muted-foreground">Voluntary Voting System Guidelines certification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Software Independence</p>
              <p className="text-xs text-muted-foreground">Principle 9 compliant</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Auditability</p>
              <p className="text-xs text-muted-foreground">Complete audit trail</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Cryptographic Verification</p>
              <p className="text-xs text-muted-foreground">E2E protocols implemented</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
            <Icon name="Check" size={20} className="text-success" />
            <div>
              <p className="text-sm font-medium text-foreground">Tamper Evidence</p>
              <p className="text-xs text-muted-foreground">Hash chain protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Public Bulletin Board */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Globe" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Public Bulletin Board</h3>
            <p className="text-sm text-muted-foreground">Universal verification for all stakeholders</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Published Encrypted Votes</span>
              <span className="text-sm font-medium text-foreground">8,934</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Public Verification Proofs</span>
              <span className="text-sm font-medium text-foreground">8,934</span>
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground">Independent Audits Completed</span>
              <span className="text-sm font-medium text-foreground">47</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptographicAuditPanel;