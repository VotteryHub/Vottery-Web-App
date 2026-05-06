import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import PlusMinusBallotPanel from './components/PlusMinusBallotPanel';
import RealTimeResultsPanel from './components/RealTimeResultsPanel';
import SentimentAnalyticsPanel from './components/SentimentAnalyticsPanel';
import StatisticalSignificancePanel from './components/StatisticalSignificancePanel';
import { electionsService } from '../../services/electionsService';
import { plusMinusVotingService } from '../../services/plusMinusVotingService';
import { votingSessionPersistenceService } from '../../services/votingSessionPersistenceService';
import Button from '../../components/ui/Button';

const PlusMinusVotingInterface = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election');

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('ballot');
  const [voteScores, setVoteScores] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [availableElections, setAvailableElections] = useState([]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        if (electionId) {
          await Promise.all([
            loadElection(),
            loadAnalytics(),
            checkUserVote(),
            loadSavedSession()
          ]);
        } else {
          await loadAvailableElections();
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize voting interface.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [electionId, user?.id]);

  const loadAvailableElections = async () => {
    const { data } = await electionsService?.getAll({ status: 'active' });
    setAvailableElections(data || []);
  };

  const loadElection = async () => {
    const { data, error: fetchError } = await electionsService?.getById(electionId);
    if (fetchError) throw new Error(fetchError?.message);
    setElection(data);
  };

  const loadAnalytics = async () => {
    try {
      const { data, error } = await plusMinusVotingService?.getPlusMinusAnalytics(electionId);
      if (error) throw new Error(error?.message);
      setAnalytics(data);
    } catch (err) {
      console.error('Load analytics error:', err);
    }
  };

  const checkUserVote = async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await plusMinusVotingService?.getUserPlusMinusVote(user?.id, electionId);
      if (data?.voteScores) {
        setVoteScores(data?.voteScores);
        setHasVoted(true);
      }
    } catch (err) {
      console.error('Check vote error:', err);
    }
  };

  // Load saved session on mount
  const loadSavedSession = async () => {
    if (!user?.id || !electionId) return;

    try {
      const { data, verified, recovered } = await votingSessionPersistenceService?.loadSession(user?.id, electionId);
      
      if (data && verified && !hasVoted) {
        // Restore vote scores
        setVoteScores(data?.voteScores || {});

        // Show recovery notification
        if (recovered) {
          alert('Your voting session has been recovered. Your progress has been restored.');
        }
      }
    } catch (err) {
      console.error('Load session error:', err);
    }
  };

  // Auto-save session on vote score changes
  useEffect(() => {
    if (!user?.id || !electionId || hasVoted) return;

    const saveSession = async () => {
      try {
        await votingSessionPersistenceService?.saveSession({
          userId: user?.id,
          electionId,
          sessionState: { voteScores },
          currentStep: 1,
          mcqCompleted: true,
          mediaCompleted: true,
          voteScores
        });
      } catch (err) {
        console.error('Auto-save session error:', err);
      }
    };

    // Debounce auto-save
    const timeoutId = setTimeout(saveSession, 1000);
    return () => clearTimeout(timeoutId);
  }, [voteScores, user?.id, electionId, hasVoted]);

  const handleScoreChange = (optionId, score) => {
    setVoteScores(prev => ({
      ...prev,
      [optionId]: score
    }));
  };

  const handleSubmitVote = async () => {
    try {
      const { data, error } = await plusMinusVotingService?.castPlusMinusVote(electionId, voteScores);
      if (error) throw new Error(error?.message);

      setHasVoted(true);
      await loadAnalytics();
      
      // Delete session after successful vote
      await votingSessionPersistenceService?.deleteSession(user?.id, electionId);
      
      alert('Vote submitted successfully!');
    } catch (err) {
      console.error('Submit vote error:', err);
      alert('Failed to submit vote: ' + err?.message);
    }
  };

  const tabs = [
    { id: 'ballot', label: 'Voting Ballot', icon: 'Vote' },
    { id: 'results', label: 'Real-Time Results', icon: 'BarChart3' },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: 'TrendingUp' },
    { id: 'statistics', label: 'Statistical Significance', icon: 'Activity' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ballot':
        return (
          <PlusMinusBallotPanel
            options={election?.electionOptions}
            voteScores={voteScores}
            onScoreChange={handleScoreChange}
            onSubmit={handleSubmitVote}
            hasVoted={hasVoted}
          />
        );
      case 'results':
        return <RealTimeResultsPanel electionId={electionId} analytics={analytics} />;
      case 'sentiment':
        return <SentimentAnalyticsPanel electionId={electionId} analytics={analytics} />;
      case 'statistics':
        return <StatisticalSignificancePanel electionId={electionId} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <GeneralPageLayout title="Plus-Minus Voting" showSidebar={true}>
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Voting Interface...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Plus-Minus Voting" showSidebar={true}>
      <div className="w-full py-0">
            {!electionId ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                    Plus-Minus Voting Interface
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground">
                    Select an active election to participate in our sophisticated +1/0/-1 scoring system.
                  </p>
                </div>

                {availableElections?.length === 0 ? (
                  <div className="card p-12 text-center border-dashed border-2">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-bold text-foreground mb-1">No Active Elections</h3>
                    <p className="text-muted-foreground">Check back later for new voting opportunities.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableElections?.map(e => (
                      <div 
                        key={e?.id} 
                        onClick={() => navigate(`/plus-minus-voting-interface?election=${e?.id}`)}
                        className="group card p-5 hover:border-accent transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-xl bg-accent/10 text-accent`}>
                            <Icon name="Activity" size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-primary/10 text-primary rounded-md">Live Now</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-1">{e?.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{e?.description}</p>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
                          <div className="flex items-center gap-1">
                            <Icon name="Users" size={14} />
                            <span>{e?.totalVoters || 0} Participating</span>
                          </div>
                          <div className="flex items-center gap-1 text-accent">
                            <span>Participate</span>
                            <Icon name="ArrowRight" size={14} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : !election ? (
              <div className="py-20 text-center animate-in zoom-in-95 duration-300">
                <Icon name="AlertCircle" size={64} className="mx-auto mb-6 text-destructive" />
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Election Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">The election you are looking for does not exist or is no longer accepting votes.</p>
                <Button variant="default" onClick={() => navigate('/plus-minus-voting-interface')} className="px-8 py-3 rounded-2xl shadow-xl">
                  Browse Active Elections
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-700">
                {/* Header */}
                <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border-2 border-accent/20 rounded-2xl p-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-1000"></div>
                  <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                    <div className="w-20 h-20 rounded-2xl bg-accent shadow-2xl shadow-accent/40 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
                      <Icon name="BarChart3" size={40} color="white" />
                    </div>
                    <div className="text-center md:text-left">
                      <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                        Plus-Minus Voting Interface
                      </h1>
                      <p className="text-base text-muted-foreground max-w-2xl">
                        Sophisticated +1/0/-1 scoring system enabling nuanced opinion expression beyond traditional binary voting methods with real-time sentiment analysis.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Election Info */}
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-heading font-bold text-foreground mb-2">{election?.title}</h2>
                      <p className="text-base text-muted-foreground">{election?.description}</p>
                    </div>
                    {hasVoted && (
                      <div className="px-4 py-2 rounded-xl bg-success/10 border border-success/30 flex items-center gap-2 self-start">
                        <Icon name="CheckCircle" size={18} className="text-success" />
                        <span className="text-sm font-black uppercase tracking-widest text-success">Vote Recorded</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                  <div className="flex overflow-x-auto scrollbar-hide border-b border-border bg-slate-50/50 dark:bg-slate-900/50">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center gap-2 px-6 md:px-8 py-5 font-black text-xs md:text-sm uppercase tracking-widest transition-all duration-300 border-b-4 ${
                          activeTab === tab?.id
                            ? 'border-accent text-accent bg-accent/5' 
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <Icon name={tab?.icon} size={18} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-8">
                    {renderTabContent()}
                  </div>
                </div>

                {/* Voting Instructions */}
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name="Info" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-lg text-foreground font-bold mb-1">How Plus-Minus Voting Works</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Rate each option with +1 (positive), 0 (neutral), or -1 (negative). This nuanced scoring system captures your true preferences 
                        better than traditional "pick one" voting. Results are calculated using weighted averages with real-time sentiment distribution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
      </div>
    </GeneralPageLayout>
  );
};

export default PlusMinusVotingInterface;