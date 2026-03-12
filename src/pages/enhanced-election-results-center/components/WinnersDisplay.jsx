import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WinnersDisplay = ({ election }) => {
  const electionWinners = election?.electionOptions?.sort((a, b) => (b?.voteCount || 0) - (a?.voteCount || 0))?.slice(0, 3);
  const lotteryWinners = election?.winnerNotifications || [];

  const totalVotes = election?.electionOptions?.reduce((sum, opt) => sum + (opt?.voteCount || 0), 0) || 1;

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
          <Icon name="Trophy" size={28} className="text-accent" />
          Election Winners
        </h2>

        {electionWinners?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No votes cast yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {electionWinners?.map((winner, index) => {
              const percentage = ((winner?.voteCount / totalVotes) * 100)?.toFixed(1);
              const medals = ['🥇', '🥈', '🥉'];
              return (
                <div key={winner?.id} className="bg-gradient-to-r from-accent/10 to-transparent border border-accent/20 rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{medals?.[index] || '🏆'}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-heading font-bold text-foreground">
                          {index + 1}. {winner?.title}
                        </h3>
                      </div>
                      {winner?.description && (
                        <p className="text-sm text-muted-foreground mb-3">{winner?.description}</p>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Icon name="Users" size={16} className="text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            <span className="font-data font-bold text-accent">{winner?.voteCount?.toLocaleString()}</span> votes
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Icon name="Percent" size={16} className="text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            <span className="font-data font-bold text-accent">{percentage}%</span> of total
                          </span>
                        </div>
                      </div>
                    </div>
                    {winner?.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={winner?.image}
                          alt={winner?.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {election?.isLotterized && lotteryWinners?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
            <Icon name="Gift" size={28} className="text-primary" />
            Lottery Winners
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lotteryWinners?.map((winner, index) => (
              <div key={winner?.userId} className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
                    {winner?.userAvatar ? (
                      <Image
                        src={winner?.userAvatar}
                        alt={`${winner?.userName} avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/20">
                        <Icon name="User" size={24} className="text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-bold rounded">
                        #{winner?.rank}
                      </span>
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {winner?.userName}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      Ticket: {winner?.lotteryTicketId}
                    </p>
                  </div>
                </div>
                <div className="bg-card rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Prize Amount</p>
                  <p className="text-lg font-data font-bold text-accent">
                    {election?.prizePool ? `$${(parseFloat(election?.prizePool?.replace(/[^0-9.]/g, '')) / election?.numberOfWinners)?.toFixed(2)}` : 'TBD'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {election?.isLotterized && !election?.winnersAnnounced && (
        <div className="card p-6 text-center">
          <Icon name="Clock" size={48} className="mx-auto mb-4 text-warning" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
            Winners Not Yet Announced
          </h3>
          <p className="text-sm text-muted-foreground">
            Lottery winners will be automatically selected and announced when the election ends
          </p>
        </div>
      )}
    </div>
  );
};

export default WinnersDisplay;