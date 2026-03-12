import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import WinnersDisplay from './components/WinnersDisplay';
import ResultsPieChart from './components/ResultsPieChart';
import PrizeDistributionPanel from './components/PrizeDistributionPanel';
import ResultsAnalytics from './components/ResultsAnalytics';
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

  useEffect(() => {
    if (electionId) {
      loadElection();
      const unsubscribe = electionsService?.subscribeToElections(() => {
        loadElection();
      });
      return () => unsubscribe?.();
    } else {
      setError('No election ID provided');
      setLoading(false);
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
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Icon name="Loader" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (error || !election) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertCircle" size={48} className="mx-auto mb-4 text-destructive" />
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Error Loading Election</h2>
          <p className="text-muted-foreground mb-4">{error || 'Election not found'}</p>
          <Button variant="default" onClick={() => navigate('/elections-dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6">
              <Button
                variant="ghost"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/elections-dashboard')}
                className="mb-4"
              >
                Back to Elections
              </Button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                Election Results Center
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                {election?.title}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {tabs?.map((tab) => {
                  const isActive = activeTab === tab?.id;
                  return (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-250 whitespace-nowrap flex items-center gap-2 ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span className="text-sm font-medium">{tab?.label}</span>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnhancedElectionResultsCenter;