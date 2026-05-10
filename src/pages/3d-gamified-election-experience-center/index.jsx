import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SlotMachine3D from './components/SlotMachine3D';
import PrizeRevealAnimation from './components/PrizeRevealAnimation';
import JackpotDisplay from './components/JackpotDisplay';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';

const ThreeDGamifiedElectionExperienceCenter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election');

  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [showPrizeReveal, setShowPrizeReveal] = useState(false);
  const [winners, setWinners] = useState([]);
  const [currentWinnerIndex, setCurrentWinnerIndex] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motionReduced, setMotionReduced] = useState(false);

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

  useEffect(() => {
    // Check for prefers-reduced-motion
    const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');
    setMotionReduced(mediaQuery?.matches);
  }, []);

  const loadElection = async () => {
    try {
      const { data, error: fetchError } = await electionsService?.getById(electionId);
      if (fetchError) throw new Error(fetchError.message);
      if (!data) throw new Error('Election not found');
      
      setElection(data);
      
      // Check if election has ended and winners announced
      if (data?.winnersAnnounced && data?.winnerNotifications) {
        setWinners(data?.winnerNotifications);
        setShowPrizeReveal(true);
      } else if (data?.endDate && data?.endTime) {
        const endDateTime = new Date(`${data?.endDate}T${data?.endTime}`);
        const now = new Date();
        if (now >= endDateTime && data?.isLotterized) {
          setIsSpinning(true);
        }
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWinnerReveal = (winnerData) => {
    setShowPrizeReveal(true);
    setIsSpinning(false);
  };

  const handleNextWinner = () => {
    if (currentWinnerIndex < winners?.length - 1) {
      setCurrentWinnerIndex(currentWinnerIndex + 1);
    } else {
      navigate(`/enhanced-election-results-center?election=${electionId}`);
    }
  };

  if (loading) {
    return (
      <GeneralPageLayout title="Loading Experience...">
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mb-4" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading 3D Experience...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  if (error || !election) {
    return (
      <GeneralPageLayout title="Error Loading Election" showSidebar={false}>
        <div className="flex flex-col lg:flex-row gap-8">
          <ElectionsSidebar />
          <main className="flex-1 min-w-0">
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/10 mt-8 shadow-2xl">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <Icon name="AlertCircle" size={40} className="text-red-500" />
              </div>
              <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">Error Loading Election</h2>
              <p className="text-slate-500 font-medium mb-8 text-lg">{error || 'Election not found'}</p>
              <Button variant="primary" onClick={() => navigate('/elections-dashboard')}>
                Back to Dashboard
              </Button>
            </div>
          </main>
        </div>
      </GeneralPageLayout>
    );
  }

  if (!election?.isLotterized) {
    return (
      <GeneralPageLayout title="Not Gamified" showSidebar={false}>
        <div className="flex flex-col lg:flex-row gap-8">
          <ElectionsSidebar />
          <main className="flex-1 min-w-0">
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-white/10 mt-8 shadow-2xl">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                <Icon name="Info" size={40} className="text-primary" />
              </div>
              <h2 className="text-3xl font-heading font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight">Not a Gamified Election</h2>
              <p className="text-slate-500 font-medium mb-8 text-lg">This election does not have 3D gamification enabled.</p>
              <Button variant="primary" onClick={() => navigate(`/enhanced-election-results-center?election=${electionId}`)}>
                View Results
              </Button>
            </div>
          </main>
        </div>
      </GeneralPageLayout>
    );
  }

  return (
    <GeneralPageLayout title={election?.title || 'Gamified Election'} showSidebar={false}>
      <div className="flex flex-col lg:flex-row gap-8">
        <ElectionsSidebar />
        
        <main className="flex-1 min-w-0">
          <div className="w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <Button
                variant="ghost"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/elections-dashboard')}
                className="mb-4 text-white hover:bg-white/10"
              >
                Back to Elections
              </Button>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-3">
                🎰 3D Gamified Election Experience
              </h1>
              <p className="text-base md:text-lg text-white/80">
                {election?.title}
              </p>
            </div>

            {/* Controls */}
            <div className="card mb-6 bg-white/10 backdrop-blur-lg border-white/20">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Icon name="Gauge" size={20} className="text-white" />
                  <span className="text-sm text-white">Animation Speed:</span>
                  <input
                    type="range"
                    min="50"
                    max="200"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseInt(e?.target?.value))}
                    className="w-32"
                    disabled={motionReduced}
                  />
                  <span className="text-sm text-white font-data">{animationSpeed}ms</span>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon name={soundEnabled ? 'Volume2' : 'VolumeX'} size={20} className="text-white" />
                  <span className="text-sm text-white">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                </button>
                {motionReduced && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                    <Icon name="AlertTriangle" size={20} className="text-yellow-300" />
                    <span className="text-sm text-yellow-300">Reduced Motion Enabled</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main 3D Slot Machine */}
              <div className="lg:col-span-2">
                <div className="card bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-500/30 shadow-2xl">
                  <div className="relative">
                    <SlotMachine3D
                      election={election}
                      isSpinning={isSpinning}
                      winners={winners}
                      animationSpeed={animationSpeed}
                      soundEnabled={soundEnabled}
                      motionReduced={motionReduced}
                      onWinnerReveal={handleWinnerReveal}
                    />
                  </div>
                </div>
              </div>

              {/* Jackpot Display & Info */}
              <div className="space-y-6">
                <JackpotDisplay
                  prizePool={election?.prizePool}
                  numberOfWinners={election?.numberOfWinners}
                  totalVoters={election?.totalVoters}
                  endDate={election?.endDate}
                  endTime={election?.endTime}
                />

                {/* Election Info */}
                <div className="card bg-white/10 backdrop-blur-lg border-white/20">
                  <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon name="Info" size={20} />
                    Election Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Total Participants:</span>
                      <span className="text-lg font-heading font-bold text-white font-data">{election?.totalVoters || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Prize Pool:</span>
                      <span className="text-lg font-heading font-bold text-green-400 font-data">{election?.prizePool || '$0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">Lucky Winners:</span>
                      <span className="text-lg font-heading font-bold text-yellow-400 font-data">{election?.numberOfWinners || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-white/70">End Date:</span>
                      <span className="text-sm text-white font-data">
                        {election?.endDate ? new Date(`${election?.endDate}T${election?.endTime}`)?.toLocaleString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Theme Customization */}
                <div className="card bg-white/10 backdrop-blur-lg border-white/20">
                  <h3 className="text-lg font-heading font-semibold text-white mb-4 flex items-center gap-2">
                    <Icon name="Palette" size={20} />
                    Customization
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:from-yellow-600 hover:to-orange-600 transition-all">
                      Golden Classic
                    </button>
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-all">
                      Neon Nights
                    </button>
                    <button className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium hover:from-green-600 hover:to-teal-600 transition-all">
                      Emerald Luxury
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Prize Reveal Modal */}
            {showPrizeReveal && winners?.length > 0 && (
              <PrizeRevealAnimation
                winner={winners?.[currentWinnerIndex]}
                prizePool={election?.prizePool}
                totalWinners={winners?.length}
                currentIndex={currentWinnerIndex}
                onNext={handleNextWinner}
                soundEnabled={soundEnabled}
              />
            )}
          </div>
        </main>
      </div>
    </GeneralPageLayout>
  );
};

export default ThreeDGamifiedElectionExperienceCenter;