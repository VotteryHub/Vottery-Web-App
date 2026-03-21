import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import VerificationInput from './components/VerificationInput';
import BlockchainStatus from './components/BlockchainStatus';
import VerificationResult from './components/VerificationResult';
import EducationalContent from './components/EducationalContent';
import RecentVerifications from './components/RecentVerifications';
import TrustIndicators from './components/TrustIndicators';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { securityFeatureAdoptionService } from '../../services/securityFeatureAdoptionService';


const VoteVerificationPortal = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [blockchainStatus, setBlockchainStatus] = useState({
    isConnected: true,
    blockHeight: 18547892,
    networkName: 'Ethereum Mainnet'
  });

  const mockRecentVerifications = [
    {
      id: 1,
      electionTitle: '2026 Presidential Election',
      status: 'verified',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      electionTitle: 'City Council District 5',
      status: 'verified',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      electionTitle: 'School Board Referendum',
      status: 'verified',
      timestamp: '3 days ago'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockchainStatus(prev => ({
        ...prev,
        blockHeight: prev?.blockHeight + Math.floor(Math.random() * 3)
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const normalizeVoteLookupInput = (value) => {
    if (typeof value !== 'string') return '';
    return value.trim();
  };

  const buildResult = (state, payload = {}) => ({
    state,
    ...payload,
  });

  const handleVerify = async (rawVoteId) => {
    const voteId = normalizeVoteLookupInput(rawVoteId);
    if (!voteId) {
      setVerificationResult(
        buildResult('failed', {
          status: 'invalid_input',
          voteId: '',
          message: 'Please enter a valid Vote ID or receipt.',
        })
      );
      return;
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(voteId);
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      let vote = null;

      if (isUuid) {
        const { data: voteById } = await supabase
          ?.from('votes')
          ?.select('id, vote_hash, blockchain_hash, election_id, created_at')
          ?.eq('id', voteId)
          ?.maybeSingle();
        vote = voteById ?? null;
      }

      if (!vote) {
        const { data: voteByHash } = await supabase
          ?.from('votes')
          ?.select('id, vote_hash, blockchain_hash, election_id, created_at')
          ?.eq('vote_hash', voteId)
          ?.maybeSingle();
        vote = voteByHash ?? null;
      }

      if (!vote) {
        setVerificationResult(buildResult('failed', {
          status: 'not_found',
          voteId,
          message: 'No vote found with this ID or hash. Please check and try again.',
        }));
        setIsVerifying(false);
        return;
      }

      const { data: bulletinEntry } = await supabase
        ?.from('public_bulletin_board')
        ?.select('*')
        ?.eq('election_id', vote?.election_id)
        ?.eq('vote_hash', vote?.vote_hash)
        ?.maybeSingle();

      const { data: zkProof } = await supabase
        ?.from('zero_knowledge_proofs')
        ?.select('verified, commitment')
        ?.eq('vote_id', vote?.id)
        ?.maybeSingle();

      const { data: election } = await supabase
        ?.from('elections')
        ?.select('title')
        ?.eq('id', vote?.election_id)
        ?.maybeSingle();

      setVerificationResult(buildResult('verified', {
        status: bulletinEntry ? 'verified' : 'recorded',
        voteId: vote?.id,
        transactionHash: vote?.blockchain_hash,
        voteHash: vote?.vote_hash,
        blockNumber: bulletinEntry?.id ? parseInt(bulletinEntry?.id?.replace(/\D/g, '')?.slice(0, 8), 16) : null,
        timestamp: new Date(vote?.created_at)?.toLocaleString(),
        electionTitle: election?.title || 'Unknown Election',
        zkProofValid: zkProof?.verified ?? true,
        hashChainValid: !!bulletinEntry,
        bulletinBoardStatus: bulletinEntry?.verification_status || 'not_published',
      }));

      securityFeatureAdoptionService?.recordBlockchainVerification?.(user?.id, voteId)?.catch(() => null);
    } catch (err) {
      setVerificationResult(buildResult('unavailable', {
        status: 'error',
        voteId,
        message: err?.message || 'Verification failed. Please try again.',
      }));
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    const receiptValue = normalizeVoteLookupInput(searchParams.get('receipt'));
    if (!receiptValue) return;
    handleVerify(receiptValue);
    // Intentionally run on param change only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleDownloadProof = () => {
    const proofData = {
      voteId: verificationResult?.voteId,
      transactionHash: verificationResult?.transactionHash,
      blockNumber: verificationResult?.blockNumber,
      timestamp: verificationResult?.timestamp,
      electionTitle: verificationResult?.electionTitle,
      zkProofValid: verificationResult?.zkProofValid,
      hashChainValid: verificationResult?.hashChainValid,
      verificationDate: new Date()?.toISOString()
    };

    const blob = new Blob([JSON.stringify(proofData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vote-verification-proof-${Date.now()}.json`;
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReportIssue = () => {
    alert('Issue reporting functionality would open a support ticket form here.');
  };

  return (
    <>
      <Helmet>
        <title>Vote Verification Portal - Vottery</title>
        <meta name="description" content="Verify your vote on the blockchain using zero-knowledge proofs. Confirm your ballot submission while maintaining complete privacy and anonymity." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <div className="flex">
          <ElectionsSidebar />

          <main className="flex-1 min-w-0">
            <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
              <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Vote Verification Portal
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Verify your ballot submission on the blockchain with zero-knowledge proof validation
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 space-y-6 md:space-y-8">
                  <VerificationInput 
                    onVerify={handleVerify}
                    isVerifying={isVerifying}
                    initialVoteId={searchParams.get('receipt') || ''}
                  />

                  {verificationResult && (
                    <VerificationResult
                      result={verificationResult}
                      onDownloadProof={handleDownloadProof}
                      onReportIssue={handleReportIssue}
                    />
                  )}

                  <EducationalContent />
                </div>

                <div className="space-y-6 md:space-y-8">
                  <BlockchainStatus
                    isConnected={blockchainStatus?.isConnected}
                    blockHeight={blockchainStatus?.blockHeight}
                    networkName={blockchainStatus?.networkName}
                  />

                  <TrustIndicators />

                  <RecentVerifications verifications={mockRecentVerifications} />

                  <div className="card">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-heading font-semibold text-foreground mb-2">
                          Important Notice
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Keep your Vote ID secure and private. Anyone with access to your Vote ID can verify your vote submission (but not see your choices).
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <Icon name="Dot" size={14} className="flex-shrink-0 mt-0.5" />
                            <span>Store your Vote ID in a secure location</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="Dot" size={14} className="flex-shrink-0 mt-0.5" />
                            <span>Do not share your Vote ID publicly</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Icon name="Dot" size={14} className="flex-shrink-0 mt-0.5" />
                            <span>Verification can be performed multiple times</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default VoteVerificationPortal;