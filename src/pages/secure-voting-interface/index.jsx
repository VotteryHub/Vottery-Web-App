import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import ElectionHeader from './components/ElectionHeader';
import MediaViewer from './components/MediaViewer';
import MCQPreVotingQuiz from './components/MCQPreVotingQuiz';
import PluralityBallot from './components/PluralityBallot';
import RankedChoiceBallot from './components/RankedChoiceBallot';
import ApprovalBallot from './components/ApprovalBallot';
import PlusMinusBallot from './components/PlusMinusBallot';
import LiveResultsChart from './components/LiveResultsChart';
import SlotMachine3D from '../3d-gamified-election-experience-center/components/SlotMachine3D';
import ProgressPanel from './components/ProgressPanel';
import VoteReceipt from './components/VoteReceipt';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { electionsService } from '../../services/electionsService';
import { votesService } from '../../services/votesService';
import { useAuth } from '../../contexts/AuthContext';
import WinnersDisplay from '../enhanced-election-results-center/components/WinnersDisplay';
import { votingSessionPersistenceService } from '../../services/votingSessionPersistenceService';
import { mcqService } from '../../services/mcqService';
import { blockchainService } from '../../services/blockchainService';
import { voterRollsService } from '../../services/voterRollsService';
import { abstentionService } from '../../services/abstentionService';
import ExternalVoterGate from './components/ExternalVoterGate';
import { eventBus, EVENTS } from '../../lib/eventBus';
import { supabase } from '../../lib/supabase';
import PlatformGamificationWidget from '../../components/PlatformGamificationWidget';
import { normalizeVotingType } from '../../lib/votingTypeUtils';



/** Map Supabase session to election allowed_auth_methods value */
function getCurrentAuthMethod(session) {
  if (!session?.user) return null;
  const provider = (session.user.app_metadata?.provider ?? session.provider ?? 'email').toLowerCase();
  const amr = session.user.amr || [];
  if (Array.isArray(amr) && amr.some(m => (m && m.toUpperCase?.() === 'PASSKEY') || m === 'passkey')) return 'passkey';
  if (provider === 'magiclink' || provider === 'magic_link') return 'magic_link';
  if (['google', 'github', 'apple', 'azure', 'facebook'].includes(provider)) return 'oauth';
  return 'email_password';
}

const SecureVotingInterface = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election') || searchParams?.get('id');
  const isExternalRef = searchParams?.get('ref') === 'external';

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [mcqCompleted, setMcqCompleted] = useState(false);
  const [mediaCompleted, setMediaCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [rankedChoices, setRankedChoices] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [voteScores, setVoteScores] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [voteReceipt, setVoteReceipt] = useState(null);
  const [showExternalGate, setShowExternalGate] = useState(false);
  const [voterRollBlocked, setVoterRollBlocked] = useState(false);
  const [authMethodBlocked, setAuthMethodBlocked] = useState(false);
  const [authMethodMessage, setAuthMethodMessage] = useState('');
  const [abstained, setAbstained] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const normalizedVotingType = normalizeVotingType(election?.votingType);

  useEffect(() => {
    if ((isExternalRef || !user) && !user) {
      setShowExternalGate(true);
    }
  }, [isExternalRef, user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (electionId) {
      loadElection();
      loadMCQQuestions();
      loadSavedSession();
    }
  }, [electionId, user?.id]);

  useEffect(() => {
    if (!election?.id || !user?.id || currentStep !== 2 || abstained || voteReceipt) return;
    const recordAbstentionOnLeave = async () => {
      const { data: hasVoted } = await votesService?.hasVoted(election?.id, user?.id);
      if (hasVoted) return;
      const { data: already } = await abstentionService?.hasAbstained(election?.id, user?.id);
      if (already) return;
      abstentionService?.recordAbstention(election?.id, user?.id, 'viewed_no_vote');
    };
    const handleBeforeUnload = () => {
      recordAbstentionOnLeave();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      recordAbstentionOnLeave();
    };
  }, [election?.id, user?.id, currentStep, abstained, voteReceipt]);

  const loadElection = async () => {
    try {
      const { data, error: fetchError } = await electionsService?.getById(electionId);
      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error('Election not found');
      const enriched = {
        ...data,
        isLotterized: data?.isLotterized ?? data?.is_lotterized ?? true, // Default to true for premium experience
        media: (data?.mediaUrl || data?.media_url)
          ? {
              url: data?.mediaUrl || data?.media_url,
              type: data?.mediaType || data?.media_type || 'video',
              alt: data?.mediaAlt || data?.media_alt,
              minimumWatchTime: data?.minimumWatchTime ?? data?.minimum_watch_time ?? 30,
              minimumWatchPercent: data?.minimumWatchPercent ?? data?.minimum_watch_percent ?? null
            }
          : null
      };
      setElection(enriched);

      if ((enriched?.permissionType === 'private' || enriched?.permission_type === 'private') && user?.email) {
        const { isEligible } = await voterRollsService?.verifyVoter(enriched?.id, user?.email);
        if (!isEligible) {
          setVoterRollBlocked(true);
        }
      }

      const allowed = enriched?.allowedAuthMethods ?? enriched?.allowed_auth_methods;
      if (user && Array.isArray(allowed) && allowed.length > 0) {
        const { data: { session } } = await supabase?.auth?.getSession();
        const currentMethod = getCurrentAuthMethod(session);
        if (currentMethod && !allowed.includes(currentMethod)) {
          setAuthMethodBlocked(true);
          setAuthMethodMessage(`This election only allows voting with: ${allowed.map(m => ({ email_password: 'Email & Password', passkey: 'Passkey', magic_link: 'Magic Link', oauth: 'OAuth' })[m] || m).join(', ')}. Please sign in with an allowed method.`);
        }
      }

      if (user?.id) {
        const { data: voted } = await votesService?.hasVoted(electionId, user?.id);
        setHasVoted(!!voted);
      }
    } catch (err) {
      setError(err?.message || 'Failed to load election');
      eventBus.emit(EVENTS.VOTE_FLOW_ERROR, {
        electionId,
        errorCategory: 'load_failure',
        errorMessage: err?.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMCQQuestions = async () => {
    try {
      const { data, error } = await mcqService?.getMCQQuestions(electionId);
      if (error) {
        console.error('Failed to load MCQ questions:', error?.message);
        setMcqQuestions([]);
        return;
      }
      setMcqQuestions(data || []);
    } catch (err) {
      console.error('Error loading MCQ questions:', err?.message);
      setMcqQuestions([]);
    }
  };

  // Auto-advance from Step 1 (MCQ/Media) to Step 2 (Voting) if no requirements exist
  useEffect(() => {
    if (currentStep === 1 && !loading && election) {
      const hasMCQ = mcqQuestions?.length > 0 && !mcqCompleted;
      const hasMedia = election?.media?.url && !mediaCompleted;
      
      if (!hasMCQ && !hasMedia) {
        console.log('[SecureVotingInterface] No requirements detected, auto-advancing to ballot.');
        eventBus.emit(EVENTS.VOTE_FLOW_AUTO_ADVANCED, {
          electionId: election.id,
          reason: 'no_requirements',
          timestamp: new Date().toISOString()
        });
        setCurrentStep(2);
      }
    }
  }, [currentStep, loading, election, mcqQuestions, mcqCompleted, mediaCompleted]);

  // Telemetry: Track step views
  useEffect(() => {
    if (election) {
      eventBus.emit(EVENTS.VOTE_FLOW_STEP_VIEWED, {
        electionId: election.id,
        stepName: currentStep === 1 ? 'requirements' : 'ballot',
        votingType: normalizedVotingType,
        timestamp: new Date().toISOString()
      });
    }
  }, [currentStep, election, normalizedVotingType]);

  const handleMCQComplete = async (answers, score) => {
    setMcqCompleted(true);
    // Persist MCQ responses to Supabase
    try {
      const userId = user?.id;
      const { error } = await mcqService?.submitMCQResponse(electionId, userId, answers, score);
      if (error) {
        console.error('Failed to save MCQ responses:', error?.message);
      }
    } catch (err) {
      console.error('Error submitting MCQ responses:', err?.message);
    }
    if (election?.media?.url) {
      setCurrentStep(1);
    } else {
      setCurrentStep(2);
    }
  };

  const handleMediaComplete = () => {
    setMediaCompleted(true);
    setCurrentStep(2);
  };

  const checkElectionStarted = () => {
    if (!election?.startDate || !election?.startTime) return true;
    
    const startDateTime = new Date(`${election?.startDate}T${election?.startTime}`);
    const now = new Date();
    return now >= startDateTime;
  };

  const checkElectionEnded = () => {
    if (!election?.endDate || !election?.endTime) return false;
    
    const endDateTime = new Date(`${election?.endDate}T${election?.endTime}`);
    const now = new Date();
    return now >= endDateTime;
  };

  const getTimeUntilStart = () => {
    if (!election?.startDate || !election?.startTime) return null;
    
    const startDateTime = new Date(`${election?.startDate}T${election?.startTime}`);
    const now = new Date();
    const diff = startDateTime - now;
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handlePluralitySelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleRankedChoicesUpdate = (newRankedChoices) => {
    setRankedChoices(newRankedChoices);
  };

  const handleRankChange = (optionId, rank) => {
    setRankedChoices(prev => {
      const filtered = prev?.filter(choice => choice?.optionId !== optionId);
      if (rank !== null && rank !== undefined) {
        return [...filtered, { optionId, rank }]?.sort((a, b) => a?.rank - b?.rank);
      }
      return filtered;
    });
  };

  const handleApprovalToggle = (optionId) => {
    setSelectedOptions(prev =>
      prev?.includes(optionId)
        ? prev?.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handlePlusMinusScoreChange = (optionId, score) => {
    setVoteScores(prev => ({
      ...prev,
      [optionId]: score
    }));
  };

  const isVoteValid = () => {
    if (normalizedVotingType === 'plurality') {
      return selectedOption !== null;
    } else if (normalizedVotingType === 'ranked-choice') {
      return rankedChoices?.length > 0;
    } else if (normalizedVotingType === 'approval') {
      return selectedOptions?.length > 0;
    } else if (normalizedVotingType === 'plus-minus') {
      return Object.keys(voteScores || {})?.length > 0;
    }
    return false;
  };

  const simulateEncryption = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setEncryptionProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  };

  const handleSubmitVote = async () => {
    if (!isVoteValid() || isSubmitting || hasVoted) {
      if (hasVoted) setError('You have already cast your vote for this election.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    await simulateEncryption();

    try {
      const voteData = {
        electionId: election?.id,
        selectedOptionId: normalizedVotingType === 'plurality' ? selectedOption : null,
        rankedChoices: normalizedVotingType === 'ranked-choice' ? rankedChoices : [],
        selectedOptions: normalizedVotingType === 'approval' ? selectedOptions : [],
        voteScores: normalizedVotingType === 'plus-minus' ? voteScores : {},
        isGamified: election?.isGamified
      };

      const { data, receipt, error: voteError } = await votesService?.castVote(voteData);
      
      if (voteError) {
        // Handle duplicate vote error (Postgres unique_violation)
        if (voteError.code === '23505' || voteError.message?.toLowerCase()?.includes('already voted')) {
          setHasVoted(true);
          throw new Error('You have already cast a vote for this election. Duplicate votes are not permitted.');
        }
        throw new Error(voteError.message);
      }

      blockchainService?.recordAuditLog('vote_cast', {
        userId: user?.id,
        electionId: election?.id,
        voteHash: receipt?.voteHash || receipt?.id,
      })?.catch(() => {});

      if (receipt?.voteHash) {
        blockchainService?.publishToBulletinBoard(election?.id, receipt?.voteHash)?.catch(() => {});
      }

      setVoteReceipt(receipt);
      setHasVoted(true);
      setCurrentStep(3);
      
      // Clear persistence upon successful vote
      votingSessionPersistenceService?.clearSession(user?.id, election?.id);
      
    } catch (err) {
      setError(err?.message || 'Submission failed. Please try again.');
      eventBus.emit(EVENTS.VOTE_FLOW_ERROR, {
        electionId: election?.id,
        errorCategory: 'submission_failure',
        errorMessage: err?.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsSubmitting(false);
      setEncryptionProgress(0);
    }
  };

  const handleAbstain = async () => {
    if (!election?.id || !user?.id) return;
    setIsSubmitting(true);
    setError('');
    const { error: err } = await abstentionService?.recordAbstention(election?.id, user?.id, 'explicit', 'User chose to abstain');
    if (err) setError(err?.message);
    else setAbstained(true);
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    const hasStarted = checkElectionStarted();
    const hasEnded = checkElectionEnded();
    const timeUntilStart = getTimeUntilStart();

    if (authMethodBlocked) {
      return (
        <div className="card p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
              <Icon name="Shield" size={48} color="var(--color-warning)" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground">Authentication method not allowed</h2>
            <p className="text-muted-foreground">{authMethodMessage}</p>
            <Button onClick={() => navigate('/login')} variant="outline">Sign in with allowed method</Button>
          </div>
        </div>
      );
    }

    if (abstained) {
      return (
        <div className="card p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Icon name="CheckCircle" size={48} className="text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground">You have chosen to abstain</h2>
            <p className="text-muted-foreground">Your abstention has been recorded. You may close this page or browse other elections.</p>
            <Button onClick={() => navigate('/vote-in-elections-hub')} variant="outline">Browse other elections</Button>
          </div>
        </div>
      );
    }

    if (!hasStarted && timeUntilStart) {
      return (
        <div className="card p-8">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
              <Icon name="Clock" size={48} color="var(--color-warning)" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                Election Not Yet Started
              </h2>
              <p className="text-muted-foreground mb-4">
                This election will begin in:
              </p>
              <div className="inline-block bg-warning/10 border border-warning/20 rounded-lg px-6 py-3">
                <p className="text-3xl font-data font-bold text-warning">
                  {timeUntilStart}
                </p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Start Date: {new Date(`${election?.startDate}T${election?.startTime}`)?.toLocaleString()}
              </p>
            </div>
            <Button onClick={() => navigate('/vote-in-elections-hub')} variant="outline">
              <Icon name="ArrowLeft" size={20} />
              Browse Other Elections
            </Button>
          </div>
        </div>
      );
    }

    if (hasEnded) {
      return (
        <div className="space-y-6">
          <div className="card p-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
                <Icon name="CheckCircle" size={48} className="text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                  Election Has Ended
                </h2>
                <p className="text-muted-foreground">
                  Voting for this election closed on {new Date(`${election?.endDate}T${election?.endTime}`)?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <WinnersDisplay electionId={election?.id} isGamified={election?.isGamified} />
        </div>
      );
    }

    if (currentStep === 1 && mcqQuestions?.length > 0 && !mcqCompleted) {
      return (
        <MCQPreVotingQuiz
          electionId={election?.id}
          questions={mcqQuestions}
          onComplete={handleMCQComplete}
        />
      );
    }

    if (currentStep === 1 && election?.media?.url && !mediaCompleted) {
      return (
        <MediaViewer
          media={election?.media}
          onComplete={handleMediaComplete}
        />
      );
    }

    if (currentStep === 2) {
      const selectionCount = normalizedVotingType === 'plurality' ? (selectedOption ? 1 : 0) :
                           normalizedVotingType === 'ranked-choice' ? rankedChoices?.length :
                           normalizedVotingType === 'approval' ? selectedOptions?.length :
                           Object.keys(voteScores || {})?.length;
      
      const isSlotActive = selectionCount >= 2;

      return (
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Ballot Area */}
          <div className="flex-1 w-full space-y-6">
            {/* Sticky Slot Machine Widget (In-Page) */}
            {election?.isLotterized && (
              <div className="card p-0 bg-gray-900 border-2 border-yellow-500/30 overflow-hidden shadow-2xl relative">
                <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isSlotActive ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">
                    {isSlotActive ? 'Gamification Active' : 'Select 2 to Activate'}
                  </span>
                </div>
                <div className="h-[240px] w-full scale-75 md:scale-100 origin-top">
                  <SlotMachine3D
                    election={election}
                    isSpinning={isSlotActive}
                    animationSpeed={150}
                    soundEnabled={false}
                  />
                </div>
              </div>
            )}

            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Cast Your Vote
              </h2>
              {renderBallot()}

              <div className="mt-8 pt-6 border-t border-border space-y-3">
                <Button
                  onClick={handleSubmitVote}
                  disabled={!isVoteValid() || isSubmitting}
                  size="lg"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Encrypting Vote... {encryptionProgress}%
                    </>
                  ) : (
                    <>
                      Submit Vote
                      <Icon name="Lock" size={20} />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-muted-foreground"
                  disabled={isSubmitting}
                  onClick={handleAbstain}
                >
                  I abstain from voting
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[360px] sticky top-24 space-y-6">
            <ProgressPanel 
              currentStep={currentStep} 
              totalSteps={3} 
              mediaCompleted={mediaCompleted}
              encryptionProgress={encryptionProgress}
            />
            {election?.showLiveResults && (
              <LiveResultsChart
                electionId={election?.id}
                options={election?.electionOptions}
                votingType={election?.votingType}
                voteVisibility={election?.voteVisibility}
                hasUserVoted={hasVoted || !!voteReceipt}
              />
            )}
          </div>
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <VoteReceipt
          receipt={voteReceipt}
          election={election}
        />
      );
    }
  };

  const renderBallot = () => {
    if (normalizedVotingType === 'plurality') {
      return (
        <PluralityBallot
          options={election?.electionOptions}
          selectedOption={selectedOption}
          onSelect={handlePluralitySelect}
        />
      );
    }

    if (normalizedVotingType === 'ranked-choice') {
      return (
        <RankedChoiceBallot
          options={election?.electionOptions}
          rankedChoices={rankedChoices}
          onRankedChoicesUpdate={handleRankedChoicesUpdate}
          onRank={handleRankChange}
        />
      );
    }

    if (normalizedVotingType === 'approval') {
      return (
        <ApprovalBallot
          options={election?.electionOptions}
          selectedOptions={selectedOptions}
          onToggle={handleApprovalToggle}
        />
      );
    }

    if (normalizedVotingType === 'plus-minus') {
      return (
        <PlusMinusBallot
          options={election?.electionOptions}
          voteScores={voteScores}
          onScoreChange={handlePlusMinusScoreChange}
        />
      );
    }

    return null;
  };

  const canSubmitVote = () => {
    if (election?.votingType === 'plurality') {
      return selectedOption !== null;
    }
    if (election?.votingType === 'ranked-choice') {
      return rankedChoices?.length > 0;
    }
    if (election?.votingType === 'approval') {
      return selectedOptions?.length > 0;
    }
    if (election?.votingType === 'plus-minus') {
      return Object.keys(voteScores)?.length > 0;
    }
    return false;
  };

  // Load saved session on mount
  const loadSavedSession = async () => {
    if (!user?.id || !electionId) return;

    try {
      const { data, error, source, verified, recovered } = await votingSessionPersistenceService?.loadSession(user?.id, electionId);
      
      if (data && verified) {
        // Restore session state
        setCurrentStep(data?.currentStep || 1);
        setMcqCompleted(data?.mcqCompleted || false);
        setMediaCompleted(data?.mediaCompleted || false);
        setSelectedOption(data?.selectedOptionId || null);
        setRankedChoices(data?.rankedChoices || []);
        setSelectedOptions(data?.selectedOptions || []);
        setVoteScores(data?.voteScores || {});

        // Show recovery notification
        if (recovered) {
          alert(`Session recovered from ${source === 'cloud' ? 'cloud backup' : 'local storage'}. Your voting progress has been restored.`);
        }
      }
    } catch (err) {
      console.error('Load session error:', err);
    }
  };

  // Auto-save session on state changes
  useEffect(() => {
    if (!user?.id || !electionId || !election) return;

    const saveSession = async () => {
      try {
        await votingSessionPersistenceService?.saveSession({
          userId: user?.id,
          electionId,
          sessionState: {
            currentStep,
            mcqCompleted,
            mediaCompleted,
            selectedOption,
            rankedChoices,
            selectedOptions,
            voteScores
          },
          currentStep,
          mcqCompleted,
          mediaCompleted,
          selectedOptionId: selectedOption,
          rankedChoices,
          selectedOptions,
          voteScores
        });
      } catch (err) {
        console.error('Auto-save session error:', err);
      }
    };

    // Debounce auto-save
    const timeoutId = setTimeout(saveSession, 1000);
    return () => clearTimeout(timeoutId);
  }, [currentStep, mcqCompleted, mediaCompleted, selectedOption, rankedChoices, selectedOptions, voteScores, user?.id, electionId, election]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error && !election) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="card p-8 text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button variant="default" onClick={() => navigate('/elections-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Show registration gate for external visitors without auth
  if (showExternalGate) {
    return (
      <ExternalVoterGate
        electionId={electionId}
        onRegistered={() => setShowExternalGate(false)}
        onClose={() => setShowExternalGate(false)}
      />
    );
  }

  if (voterRollBlocked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" role="alert">
        <div className="card p-8 text-center max-w-md">
          <Icon name="ShieldX" size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Not on Voter Roll</h2>
          <p className="text-muted-foreground mb-4">
            This is a private election. Your email ({user?.email}) is not on the approved voter roll.
            Contact the election creator if you believe this is an error.
          </p>
          <Button variant="default" onClick={() => navigate('/elections-dashboard')}>
            Browse Other Elections
          </Button>
        </div>
      </div>
    );
  }

  if (voteReceipt) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <HeaderNavigation />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <VoteReceipt receipt={voteReceipt} election={election} />
          {/* Predict Outcome Button */}
          {election?.id && (
            <div className="mt-6 p-5 bg-gradient-to-r from-purple-50 to-yellow-50 dark:from-purple-900/20 dark:to-yellow-900/20 border border-purple-200 dark:border-purple-700 rounded-xl">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎯</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">Predict the Outcome!</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Use probability sliders to predict who wins. Earn up to 100 VP based on your accuracy!
                  </p>
                  <button
                    onClick={() => navigate(`/election-prediction-pools-interface?election=${election?.id}`)}
                    className="mt-3 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                  >
                    🎯 Predict Outcome → +20 VP
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => navigate('/elections-dashboard')} className="flex-1">
              Back to Elections
            </Button>
            <Button onClick={() => navigate('/home-feed-dashboard')} className="flex-1">
              Go to Feed
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <GeneralPageLayout title="Secure Ballot" showSidebar={true}>
      <div className="w-full py-0">
        <ElectionHeader election={election} />
        
        {/* Floating Platform Gamification Widget for Gamified Elections */}
        {election?.isGamified && <PlatformGamificationWidget floating={true} />}
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          {renderStepContent()}
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default SecureVotingInterface;