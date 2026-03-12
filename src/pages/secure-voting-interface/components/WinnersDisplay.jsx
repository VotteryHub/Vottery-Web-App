import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { electionsService } from '../../../services/electionsService';

const WinnersDisplay = ({ electionId, isLotterized }) => {
  const navigate = useNavigate();
  const [electionWinners, setElectionWinners] = useState([]);
  const [lotteryWinners, setLotteryWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [runOffCreating, setRunOffCreating] = useState(false);
  const [runOffError, setRunOffError] = useState('');

  useEffect(() => {
    loadWinners();
  }, [electionId]);

  const loadWinners = async () => {
    try {
      const { data, error: fetchError } = await electionsService?.getElectionWinners(electionId);
      if (fetchError) throw new Error(fetchError.message);

      const electionResults = data?.filter(w => w?.winnerType === 'election_result') || [];
      const lotteryResults = data?.filter(w => w?.winnerType === 'lottery_winner') || [];

      setElectionWinners(electionResults);
      setLotteryWinners(lotteryResults);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      </div>
    );
  }

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-500 text-white';
    if (rank === 2) return 'bg-gray-400 text-white';
    if (rank === 3) return 'bg-amber-700 text-white';
    return 'bg-primary text-primary-foreground';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return 'Trophy';
    if (rank === 2) return 'Medal';
    if (rank === 3) return 'Award';
    return 'Star';
  };

  const topVoteCount = electionWinners?.[0]?.voteCount ?? electionWinners?.[0]?.vote_count;
  const isTied = electionWinners?.length >= 2 && (electionWinners?.[1]?.voteCount ?? electionWinners?.[1]?.vote_count) === topVoteCount;
  const tiedOptionIds = isTied && topVoteCount != null
    ? electionWinners?.filter(w => (w?.voteCount ?? w?.vote_count) === topVoteCount).map(w => w?.electionOptions?.id ?? w?.election_options?.id).filter(Boolean)
    : [];

  const handleCreateRunoff = async () => {
    if (!electionId || tiedOptionIds?.length === 0) return;
    setRunOffError('');
    setRunOffCreating(true);
    try {
      const { data, error: err } = await electionsService?.cloneRunoff(electionId, tiedOptionIds);
      if (err) throw new Error(err?.message);
      if (data?.id) navigate('/elections-dashboard', { state: { message: 'Run-off election created as draft. Open it to publish.' } });
    } catch (e) {
      setRunOffError(e?.message || 'Failed to create run-off');
    } finally {
      setRunOffCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {electionWinners?.length > 0 && (
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Election Results
              </h2>
              <p className="text-sm text-muted-foreground">
                Final vote tallies and rankings
              </p>
            </div>
          </div>

          {isTied && (
            <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/20 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Icon name="AlertCircle" size={24} className="text-warning" />
                <span className="font-semibold text-foreground">Tied for first place</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleCreateRunoff} disabled={runOffCreating}>
                {runOffCreating ? 'Creating…' : 'Create run-off election'}
              </Button>
              {runOffError && <p className="text-sm text-destructive w-full">{runOffError}</p>}
            </div>
          )}

          <div className="space-y-4">
            {electionWinners?.map((winner) => {
              const option = winner?.electionOptions;
              return (
                <div
                  key={winner?.id}
                  className="bg-gradient-to-r from-primary/5 to-transparent border-2 border-primary/20 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-full ${getRankBadgeColor(winner?.rankPosition)} flex items-center justify-center flex-shrink-0 shadow-democratic-md`}>
                      <Icon name={getRankIcon(winner?.rankPosition)} size={28} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        {option?.image && (
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={option?.image}
                              alt={option?.imageAlt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-muted-foreground">
                              {winner?.rankPosition === 1 ? 'Winner' : `${winner?.rankPosition}${winner?.rankPosition === 2 ? 'nd' : winner?.rankPosition === 3 ? 'rd' : 'th'} Place`}
                            </span>
                          </div>
                          <h3 className="font-heading font-bold text-foreground text-lg md:text-xl mb-2">
                            {option?.title}
                          </h3>
                          {option?.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {option?.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card rounded-lg p-3 border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="Users" size={16} className="text-primary" />
                            <span className="text-xs text-muted-foreground">Total Votes</span>
                          </div>
                          <p className="text-xl font-data font-bold text-foreground">
                            {winner?.voteCount?.toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-card rounded-lg p-3 border border-border">
                          <div className="flex items-center gap-2 mb-1">
                            <Icon name="Percent" size={16} className="text-success" />
                            <span className="text-xs text-muted-foreground">Vote Share</span>
                          </div>
                          <p className="text-xl font-data font-bold text-success">
                            {winner?.votePercentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {isLotterized && lotteryWinners?.length > 0 && (
        <div className="card p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Icon name="Gift" size={24} color="var(--color-accent)" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                Lottery Winners
              </h2>
              <p className="text-sm text-muted-foreground">
                Lucky voters selected for prizes
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {lotteryWinners?.map((winner) => {
              const profile = winner?.userProfiles;
              return (
                <div
                  key={winner?.id}
                  className="bg-gradient-to-r from-accent/5 to-transparent border-2 border-accent/20 rounded-xl p-4 md:p-6"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full ${getRankBadgeColor(winner?.rankPosition)} flex items-center justify-center flex-shrink-0 shadow-democratic-md`}>
                      <span className="text-2xl font-heading font-bold">
                        {winner?.rankPosition}
                      </span>
                    </div>

                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-accent">
                      <Image
                        src={profile?.avatar || '/assets/images/no_image.png'}
                        alt={`${profile?.name}'s avatar`}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-bold text-foreground text-lg">
                          {profile?.name}
                        </h3>
                        {profile?.verified && (
                          <Icon name="BadgeCheck" size={18} color="var(--color-primary)" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        @{profile?.username}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Icon name="Ticket" size={16} className="text-accent" />
                          <span className="text-xs text-muted-foreground">
                            {winner?.lotteryTicketId}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Icon name="DollarSign" size={16} className="text-success" />
                          <span className="text-sm font-data font-bold text-success">
                            ${winner?.prizeAmount?.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                        <Icon name="Trophy" size={24} color="var(--color-accent)" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground font-medium mb-1">
                  Prize Distribution in Progress
                </p>
                <p className="text-xs text-muted-foreground">
                  Winners will be contacted directly by the election creator for prize fulfillment. Check your messages for details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {electionWinners?.length === 0 && lotteryWinners?.length === 0 && (
        <div className="card p-6">
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Icon name="Clock" size={32} className="text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-2">
                Winners Not Yet Announced
              </h3>
              <p className="text-sm text-muted-foreground">
                Winners will be announced after the election closes
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WinnersDisplay;