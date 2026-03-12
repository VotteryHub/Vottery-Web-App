import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VotingHistoryCard = ({ vote }) => {
  const getStatusColor = (status) => {
    if (status === 'verified' || vote?.blockchainHash) {
      return 'bg-success/10 text-success';
    }
    return 'bg-warning/10 text-warning';
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card p-4 md:p-6 hover:shadow-democratic-md transition-all duration-250">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-32 h-24 lg:h-auto overflow-hidden rounded-lg flex-shrink-0">
          <Image
            src={vote?.elections?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800'}
            alt={vote?.elections?.coverImageAlt || 'Election image'}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2 line-clamp-1">
                {vote?.elections?.title || 'Election'}
              </h3>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  <Icon name="ShieldCheck" size={12} className="inline mr-1" />
                  Verified
                </span>
                {vote?.elections?.category && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                    {vote?.elections?.category}
                  </span>
                )}
                {vote?.lotteryTicketId && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    <Icon name="Trophy" size={12} className="inline mr-1" />
                    Lottery Entry
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="text-sm font-data font-medium text-foreground">
                  {formatDate(vote?.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="text-sm font-data font-medium text-foreground">
                  {formatTime(vote?.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Hash" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Vote ID</p>
                <p className="text-sm font-data font-medium text-foreground font-mono">
                  {vote?.id?.slice(0, 8)}...
                </p>
              </div>
            </div>
            {vote?.lotteryTicketId && (
              <div className="flex items-center gap-2">
                <Icon name="Ticket" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Ticket</p>
                  <p className="text-sm font-data font-medium text-foreground font-mono">
                    {vote?.lotteryTicketId}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link to={`/vote-verification-portal?voteId=${vote?.id}`}>
              <Button variant="outline" size="sm" iconName="ShieldCheck" iconPosition="left">
                Verify Vote
              </Button>
            </Link>
            {vote?.blockchainHash && (
              <div className="crypto-indicator">
                <Icon name="Lock" size={12} />
                <span className="text-xs font-mono">
                  {vote?.blockchainHash?.slice(0, 10)}...
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingHistoryCard;