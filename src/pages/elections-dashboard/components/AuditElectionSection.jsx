import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const AuditElectionSection = () => {
  const [selectedElection, setSelectedElection] = useState('');
  const [auditResult, setAuditResult] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);

  const electionOptions = [
    { value: '', label: 'Select an election to audit' },
    { value: 'election1', label: 'Community Budget Allocation 2026' },
    { value: 'election2', label: 'Best Local Restaurant Award' },
    { value: 'election3', label: 'School Board Election District 5' },
    { value: 'election4', label: 'City Council Member Ward 3' },
  ];

  const auditHistory = [
    {
      id: 1,
      electionTitle: "Community Budget Allocation 2026",
      auditDate: "Jan 22, 2026 02:30 PM",
      status: "passed",
      totalVotes: 8947,
      validVotes: 8947,
      invalidVotes: 0,
      blockchainIntegrity: 100,
      hashChainValid: true
    },
    {
      id: 2,
      electionTitle: "Best Local Restaurant Award",
      auditDate: "Jan 21, 2026 05:15 PM",
      status: "passed",
      totalVotes: 12453,
      validVotes: 12453,
      invalidVotes: 0,
      blockchainIntegrity: 100,
      hashChainValid: true
    },
    {
      id: 3,
      electionTitle: "School Board Election District 5",
      auditDate: "Jan 20, 2026 10:45 AM",
      status: "passed",
      totalVotes: 5621,
      validVotes: 5621,
      invalidVotes: 0,
      blockchainIntegrity: 100,
      hashChainValid: true
    }
  ];

  const handleRunAudit = () => {
    if (!selectedElection) return;

    setIsAuditing(true);
    setTimeout(() => {
      setAuditResult({
        electionTitle: 'Community Budget Allocation 2026',
        auditDate: 'Jan 22, 2026 03:52 PM',
        status: 'passed',
        totalVotes: 8947,
        validVotes: 8947,
        invalidVotes: 0,
        blockchainIntegrity: 100,
        hashChainValid: true,
        smartContractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        lastBlockHash: '0x9f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4',
        totalBlocks: 8947,
        verifiedBlocks: 8947,
        auditDuration: '2.3 seconds',
        checks: [
          { name: 'Hash Chain Integrity', status: 'passed', details: 'All blocks properly linked' },
          { name: 'Vote Encryption', status: 'passed', details: 'RSA-2048 verified' },
          { name: 'Digital Signatures', status: 'passed', details: 'All signatures valid' },
          { name: 'Timestamp Validation', status: 'passed', details: 'Sequential order confirmed' },
          { name: 'Smart Contract Execution', status: 'passed', details: 'No anomalies detected' },
          { name: 'Voter Anonymity', status: 'passed', details: 'Zero-knowledge proofs valid' }
        ]
      });
      setIsAuditing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
          Blockchain Audit
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Verify election integrity through blockchain validation
        </p>
      </div>
      <div className="card p-6 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Select
              label="Select Election"
              options={electionOptions}
              value={selectedElection}
              onChange={setSelectedElection}
              description="Choose an election to run a comprehensive audit"
            />
          </div>
          <Button
            variant="default"
            size="lg"
            fullWidth
            loading={isAuditing}
            iconName="FileSearch"
            iconPosition="left"
            onClick={handleRunAudit}
            disabled={!selectedElection}
          >
            {isAuditing ? 'Running Audit...' : 'Run Blockchain Audit'}
          </Button>
        </div>
      </div>
      {auditResult && (
        <div className="card p-6 md:p-8 border-2 border-success">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <Icon name="ShieldCheck" size={28} color="var(--color-success)" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
                Audit Completed Successfully
              </h3>
              <p className="text-sm md:text-base text-muted-foreground">
                All blockchain integrity checks passed
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Election</p>
                <p className="text-sm font-medium text-foreground">{auditResult?.electionTitle}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Audit Date</p>
                <p className="text-sm font-data font-medium text-foreground">{auditResult?.auditDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Votes</p>
                <p className="text-sm font-data font-medium text-foreground">{auditResult?.totalVotes?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Audit Duration</p>
                <p className="text-sm font-data font-medium text-foreground">{auditResult?.auditDuration}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-success/5 rounded-lg">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-success mb-1 font-data">
                  {auditResult?.blockchainIntegrity}%
                </p>
                <p className="text-xs text-muted-foreground">Blockchain Integrity</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-success mb-1 font-data">
                  {auditResult?.validVotes?.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Valid Votes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-heading font-bold text-success mb-1 font-data">
                  {auditResult?.invalidVotes}
                </p>
                <p className="text-xs text-muted-foreground">Invalid Votes</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Smart Contract Address</p>
              <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-data text-foreground break-all">
                  {auditResult?.smartContractAddress}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Last Block Hash</p>
              <div className="bg-muted rounded-lg p-3 overflow-x-auto">
                <code className="text-xs font-data text-foreground break-all">
                  {auditResult?.lastBlockHash}
                </code>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="text-base font-heading font-semibold text-foreground mb-4">
                Audit Checks
              </h4>
              <div className="space-y-3">
                {auditResult?.checks?.map((check, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground mb-1">{check?.name}</p>
                      <p className="text-xs text-muted-foreground">{check?.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <div>
        <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-4">
          Recent Audits
        </h3>
        <div className="space-y-3">
          {auditHistory?.map((audit) => (
            <div
              key={audit?.id}
              className="card p-4 hover:shadow-democratic-md transition-all duration-250"
            >
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="ShieldCheck" size={16} className="text-success" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      Passed
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1 truncate">
                    {audit?.electionTitle}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <p className="text-xs text-muted-foreground">{audit?.auditDate}</p>
                    <span className="text-xs text-muted-foreground">
                      {audit?.totalVotes?.toLocaleString()} votes verified
                    </span>
                    <span className="text-xs font-data font-medium text-success">
                      {audit?.blockchainIntegrity}% integrity
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" iconName="Eye">
                  View Report
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuditElectionSection;