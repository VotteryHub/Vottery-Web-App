import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import WinnersDisplay from './components/WinnersDisplay';
import ResultsPieChart from './components/ResultsPieChart';
import PrizeDistributionPanel from './components/PrizeDistributionPanel';
import ResultsAnalytics from './components/ResultsAnalytics';
import TransparencyAuditVault from './components/TransparencyAuditVault';
import Icon from '../../components/AppIcon';

import Button from '../../components/ui/Button';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';

const EnhancedElectionResultsCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election');

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('results');
  const [completedElections, setCompletedElections] = useState([]);

  useEffect(() => {
    if (!electionId) {
      loadCompletedElections();
    }
  }, [electionId]);

  const loadCompletedElections = async () => {
    setLoading(true);
    try {
      const { data } = await electionsService?.getAll({ status: 'completed' });
      setCompletedElections(data || []);
    } catch (err) {
      console.error('Failed to load completed elections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (electionId) {
      loadElection();
      const unsubscribe = electionsService?.subscribeToElections(() => {
        loadElection();
      });
      return () => unsubscribe?.();
    } else {
      setError('');
    }
  }, [electionId]);

  const loadElection = async () => {
    try {
      const { data, error: fetchError } = await electionsService?.getById(electionId);
      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error('Election not found');
      setElection(data);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'results', label: 'Election Results', icon: 'BarChart' },
    { id: 'winners', label: 'Winners', icon: 'Trophy' },
    { id: 'prizes', label: 'Prize Distribution', icon: 'DollarSign' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'audit', label: 'Audit Vault', icon: 'Shield' }
  ];

  if (loading) {
    return (
      <GeneralPageLayout title="Election Results" showSidebar={true}>
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Results...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title="Election Results" showSidebar={true}>
      <div className="w-full py-0">
            {!electionId ? (
              <div className="animate-in fade-in duration-500">
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                    Election Results Center
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground">
                    Select a completed election to view official results, winners, and audit transparency reports.
                  </p>
                </div>

                {completedElections?.length === 0 ? (
                  <div className="card p-12 text-center border-dashed border-2">
                    <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                    <h3 className="text-lg font-bold text-foreground mb-1">No Completed Elections</h3>
                    <p className="text-muted-foreground">Results will appear here once elections conclude.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedElections?.map(e => (
                      <div 
                        key={e?.id} 
                        onClick={() => navigate(`/enhanced-election-results-center?election=${e?.id}`)}
                        className="group card p-5 hover:border-primary transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-2 rounded-xl bg-primary/10 text-primary`}>
                            <Icon name="CheckCircle" size={24} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-green-500/10 text-green-500 rounded-md">Completed</span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">{e?.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{e?.description}</p>
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-tighter text-slate-500">
                          <div className="flex items-center gap-1">
                            <Icon name="Users" size={14} />
                            <span>{e?.totalVoters || 0} Voters</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary">
                            <span>View Results</span>
                            <Icon name="ArrowRight" size={14} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : error || !election ? (
              <div className="py-20 text-center animate-in zoom-in-95 duration-300">
                <Icon name="AlertCircle" size={64} className="mx-auto mb-6 text-destructive" />
                <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Error Loading Results</h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">{error || 'The requested election results could not be located or are not yet finalized.'}</p>
                <Button variant="default" onClick={() => navigate('/enhanced-election-results-center')} className="px-8 py-3 rounded-2xl shadow-xl">
                  Choose Another Election
                </Button>
              </div>
            ) : (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/enhanced-election-results-center')}
                    className="mb-6 group"
                  >
                    <Icon name="ArrowLeft" size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    All Results
                  </Button>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                    {election?.title}
                  </h1>
                  <p className="text-base md:text-lg text-muted-foreground">
                    Official Certified Results & Audit Trail
                  </p>
                </div>

                <div className="mb-8 overflow-x-auto pb-4 scrollbar-none">
                  <div className="flex items-center gap-3">
                    {tabs?.map((tab) => {
                      const isActive = activeTab === tab?.id;
                      return (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-300 whitespace-nowrap flex items-center gap-2 text-sm font-black uppercase tracking-widest ${
                            isActive
                              ? 'border-primary bg-primary text-white shadow-lg shadow-primary/30'
                              : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-muted'
                          }`}
                        >
                          <Icon name={tab?.icon} size={16} />
                          <span>{tab?.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeTab === 'results' && (
                  <div className="space-y-6">
                    <ResultsPieChart election={election} />
                  </div>
                )}

                {activeTab === 'winners' && (
                  <div className="space-y-6">
                    <WinnersDisplay election={election} />
                  </div>
                )}

                {activeTab === 'prizes' && election?.isLotterized && (
                  <div className="space-y-6">
                    <PrizeDistributionPanel election={election} />
                  </div>
                )}

                {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <ResultsAnalytics election={election} />
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="space-y-6">
                    <TransparencyAuditVault election={election} />
                  </div>
                )}
              </div>
            )}
          </div>
        </GeneralPageLayout>
  );
};

export default EnhancedElectionResultsCenter;