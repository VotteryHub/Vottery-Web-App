import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ElectionDiscoveryPanel = ({ elections }) => {
  const navigate = useNavigate();

  const handleVote = (electionId) => {
    navigate(`/secure-voting-interface?election=${electionId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success';
      case 'upcoming':
        return 'bg-warning/10 text-warning';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'Activity';
      case 'upcoming':
        return 'Clock';
      case 'completed':
        return 'CheckCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      {elections?.map((election) => (
        <div key={election?.id} className="card p-4 md:p-6 hover:shadow-democratic-md transition-all duration-250">
          <div className="relative h-48 rounded-lg overflow-hidden mb-4">
            <Image
              src={election?.coverImage}
              alt={election?.coverImageAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(election?.status)}`}>
                <Icon name={getStatusIcon(election?.status)} size={12} className="inline mr-1" />
                {election?.status?.charAt(0)?.toUpperCase() + election?.status?.slice(1)}
              </span>
              {election?.isLotterized && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent/90 text-accent-foreground">
                  <Icon name="Trophy" size={12} className="inline mr-1" />
                  Lotterized
                </span>
              )}
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              {election?.category && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                  {election?.category}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {election?.votingType}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-2 line-clamp-2">
              {election?.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {election?.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Icon name="Users" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Participants</p>
                <p className="text-sm font-data font-medium text-foreground">{election?.totalVoters?.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ends</p>
                <p className="text-sm font-data font-medium text-foreground">{election?.endDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Entry Fee</p>
                <p className="text-sm font-data font-medium text-foreground">{election?.entryFee}</p>
              </div>
            </div>
            {election?.prizePool && (
              <div className="flex items-center gap-2">
                <Icon name="Trophy" size={16} className="text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Prize Pool</p>
                  <p className="text-sm font-data font-medium text-foreground">{election?.prizePool}</p>
                </div>
              </div>
            )}
          </div>

          {election?.status === 'active' && (
            <Button
              variant="default"
              fullWidth
              iconName="Vote"
              iconPosition="left"
              onClick={() => handleVote(election?.id)}
            >
              Participate Now
            </Button>
          )}
          {election?.status === 'upcoming' && (
            <Button variant="outline" fullWidth disabled>
              <Icon name="Clock" size={16} className="mr-2" />
              Coming Soon
            </Button>
          )}
          {election?.status === 'completed' && (
            <Button
              variant="outline"
              fullWidth
              iconName="BarChart"
              iconPosition="left"
              onClick={() => navigate(`/enhanced-election-results-center?election=${election?.id}`)}
            >
              View Results
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ElectionDiscoveryPanel;