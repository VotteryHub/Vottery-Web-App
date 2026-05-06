import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Vote Verification Portal" showSidebar={true}>
      <Helmet>
        <title>Vote Verification Portal - Vottery</title>
        <meta name="description" content="Verify your vote on the blockchain using zero-knowledge proofs. Confirm your ballot submission while maintaining complete privacy and anonymity." />
      </Helmet>
      
      <div className="w-full py-0">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Trust Engine
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium max-w-2xl">
              Verify your ballot submission on the blockchain with high-fidelity zero-knowledge proof validation and cryptographic integrity checks.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <VerificationInput 
                onVerify={handleVerify}
                isVerifying={isVerifying}
                initialVoteId={searchParams.get('receipt') || ''}
              />
            </div>

            {verificationResult && (
              <div className="animate-in zoom-in-95 duration-500">
                <VerificationResult
                  result={verificationResult}
                  onDownloadProof={handleDownloadProof}
                  onReportIssue={handleReportIssue}
                />
              </div>
            )}

            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              <EducationalContent />
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-300">
              <BlockchainStatus
                isConnected={blockchainStatus?.isConnected}
                blockHeight={blockchainStatus?.blockHeight}
                networkName={blockchainStatus?.networkName}
              />
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-400">
              <TrustIndicators />
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-500">
              <RecentVerifications verifications={mockRecentVerifications} />
            </div>

            <div className="premium-glass p-8 rounded-3xl border border-warning/20 shadow-2xl relative overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-700 delay-600">
              <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 blur-3xl -mr-20 -mt-20 group-hover:bg-warning/10 transition-all duration-700" />
              
              <div className="flex items-start gap-5 relative z-10">
                <div className="w-14 h-14 bg-warning/10 rounded-2xl flex items-center justify-center flex-shrink-0 border border-warning/20 group-hover:rotate-12 transition-transform duration-500">
                  <Icon name="AlertTriangle" size={24} className="text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white mb-3 uppercase tracking-tight">
                    Security Protocol
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 font-medium leading-relaxed">
                    Keep your Vote ID secure and private. Anyone with access to your Vote ID can verify your submission (but never see your choices).
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Store Encrypted</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Single-User Access</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default VoteVerificationPortal;