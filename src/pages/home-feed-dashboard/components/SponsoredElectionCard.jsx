import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SponsoredElectionCard = ({ election }) => {
  const formatPrize = (amount) => {
    if (amount >= 1000000) return `$${(amount / 1000000)?.toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000)?.toFixed(1)}K`;
    return `$${amount}`;
  };

  const getTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.floor((end - now) / 1000);
    
    if (diff < 3600) return `${Math.floor(diff / 60)}m left`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h left`;
    return `${Math.floor(diff / 86400)}d left`;
  };

  return (
    <div className="card mb-4 md:mb-6 border-2 border-accent/20 relative overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02] hover:border-accent/40 group">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-primary to-secondary transition-all duration-300 group-hover:h-1.5" />
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="px-3 py-1.5 bg-accent/10 rounded-full flex items-center gap-2 transition-all duration-300 group-hover:bg-accent/20">
            <Icon name="Sparkles" size={14} className="text-accent" />
            <span className="text-xs font-medium text-accent">Sponsored Election</span>
          </div>
          {election?.isLotterized && (
            <div className="crypto-indicator transition-all duration-300 hover:scale-105">
              <Icon name="Trophy" size={14} />
              <span className="text-xs font-medium">Lotterized</span>
            </div>
          )}
        </div>
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-accent/30 transition-all duration-300">
            <Image
              src={election?.organizerLogo}
              alt={election?.organizerLogoAlt}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors duration-300">
              {election?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              by {election?.organizer}
            </p>
          </div>
        </div>
        <p className="text-base text-foreground mb-4 line-clamp-2 leading-relaxed">
          {election?.description}
        </p>
        {election?.coverImage && (
          <div className="mb-4 overflow-hidden rounded-xl group/image">
            <Image
              src={election?.coverImage}
              alt={election?.coverImageAlt}
              className="w-full h-56 md:h-64 object-cover transition-transform duration-500 ease-in-out group-hover/image:scale-110"
            />
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Users" size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Participants</p>
              <p className="font-data font-semibold text-base text-foreground">
                {election?.participants?.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted hover:scale-105">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Icon name="Clock" size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Time Left</p>
              <p className="font-data font-semibold text-base text-foreground">
                {getTimeRemaining(election?.endDate)}
              </p>
            </div>
          </div>
          {election?.isLotterized && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 transition-all duration-300 hover:bg-muted hover:scale-105 col-span-2 md:col-span-1">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Icon name="Trophy" size={18} className="text-warning" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Prize Pool</p>
                <p className="font-data font-semibold text-base text-warning">
                  {formatPrize(election?.prizePool)}
                </p>
              </div>
            </div>
          )}
        </div>
        <Link to="/secure-voting-interface">
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="Vote"
            iconPosition="left"
            className="reward-celebration transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Vote Now {election?.isLotterized && '& Enter Draw'}
          </Button>
        </Link>
        {election?.isLotterized && (
          <p className="text-xs text-center text-muted-foreground mt-3">
            Your vote becomes a lottery ticket for prize draw
          </p>
        )}
      </div>
    </div>
  );
};

export default SponsoredElectionCard;