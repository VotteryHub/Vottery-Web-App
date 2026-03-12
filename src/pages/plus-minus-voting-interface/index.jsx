import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import PlusMinusBallotPanel from './components/PlusMinusBallotPanel';
import RealTimeResultsPanel from './components/RealTimeResultsPanel';
import SentimentAnalyticsPanel from './components/SentimentAnalyticsPanel';
import StatisticalSignificancePanel from './components/StatisticalSignificancePanel';
import { electionsService } from '../../services/electionsService';
import { plusMinusVotingService } from '../../services/plusMinusVotingService';
import { votingSessionPersistenceService } from '../../services/votingSessionPersistenceService';

const PlusMinusVotingInterface = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election');

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ballot');
  const [voteScores, setVoteScores] = useState({});
  const [analytics, setAnalytics] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (electionId) {
      loadElection();
      loadAnalytics();
      checkUserVote();
      loadSavedSession();
    }
  }, [electionId]);

  const loadElection = async () => {
    try {
      const { data, error } = await electionsService?.getById(electionId);
      if (error) throw new Error(error?.message);
      setElection(data);
    } catch (err) {
      console.error('Load election error:', err);
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 ml-0 md:ml-64">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10 border-2 border-accent/20 rounded-xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                  <Icon name="BarChart3" size={32} color="white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    Plus-Minus Voting Interface
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Sophisticated +1/0/-1 scoring system enabling nuanced opinion expression beyond traditional binary voting methods with real-time sentiment analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Election Info */}
            {election && (
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-heading font-bold text-foreground mb-2">{election?.title}</h2>
                    <p className="text-sm text-muted-foreground">{election?.description}</p>
                  </div>
                  {hasVoted && (
                    <div className="px-4 py-2 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2">
                      <Icon name="CheckCircle" size={18} className="text-success" />
                      <span className="text-sm font-medium text-success">You've Voted</span>
                    </div>
                  )}
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
                        ? 'border-accent text-accent bg-accent/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>

            {/* Voting Instructions */}
            <div className="bg-muted/50 border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground font-medium mb-1">How Plus-Minus Voting Works</p>
                  <p className="text-xs text-muted-foreground">
                    Rate each option with +1 (positive), 0 (neutral), or -1 (negative). This nuanced scoring system captures your true preferences 
                    better than traditional "pick one" voting. Results are calculated using weighted averages with real-time sentiment distribution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PlusMinusVotingInterface;