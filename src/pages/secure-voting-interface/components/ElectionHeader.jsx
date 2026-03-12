import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ElectionHeader = ({ election }) => {
  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="relative h-48 md:h-56 lg:h-64 overflow-hidden">
        <Image
          src={election?.coverImage}
          alt={election?.coverImageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-medium rounded-full">
              {election?.category}
            </span>
            {election?.isLotterized && (
              <span className="px-3 py-1 bg-accent/90 text-accent-foreground text-xs font-medium rounded-full flex items-center gap-1">
                <Icon name="Trophy" size={12} />
                Lotterized
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white">
            {election?.title}
          </h1>
        </div>
      </div>
      <div className="p-4 md:p-6 lg:p-8 space-y-4">
        <p className="text-sm md:text-base text-foreground leading-relaxed">
          {election?.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Voters</p>
              <p className="font-data font-semibold text-foreground">{election?.totalVoters?.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Vote" size={20} color="var(--color-secondary)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Voting Type</p>
              <p className="font-semibold text-foreground">{election?.votingType}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} color="var(--color-success)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Ends On</p>
              <p className="font-semibold text-foreground">{election?.endDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
              <Icon name="DollarSign" size={20} color="var(--color-accent)" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Entry Fee</p>
              <p className="font-semibold text-foreground">{election?.entryFee}</p>
            </div>
          </div>
        </div>

        {election?.isLotterized && (
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Icon name="Trophy" size={24} color="var(--color-accent)" />
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  Lottery Prize Pool
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Your vote automatically enters you into the lottery draw. Winners selected via cryptographic RNG.
                </p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Prize</p>
                    <p className="text-lg font-data font-bold text-accent">{election?.prizePool}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Winners</p>
                    <p className="text-lg font-data font-bold text-foreground">{election?.numberOfWinners}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionHeader;