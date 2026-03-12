import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import ElectionCard from './ElectionCard';
import { electionsService } from '../../../services/electionsService';
import { votesService } from '../../../services/votesService';
import { useAuth } from '../../../contexts/AuthContext';

const VoteElectionSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadElections();
    if (user) {
      loadUserVotes();
    }

    // Subscribe to real-time election updates
    const unsubscribe = electionsService?.subscribeToElections((payload) => {
      if (payload?.eventType === 'INSERT') {
        setElections(prev => [payload?.new, ...prev]);
      } else if (payload?.eventType === 'UPDATE') {
        setElections(prev => prev?.map(e => e?.id === payload?.new?.id ? payload?.new : e));
      } else if (payload?.eventType === 'DELETE') {
        setElections(prev => prev?.filter(e => e?.id !== payload?.old?.id));
      }
    });

    return () => unsubscribe();
  }, [user]);

  const loadElections = async () => {
    try {
      const { data, error: fetchError } = await electionsService?.getAll({ status: 'active' });
      if (fetchError) throw new Error(fetchError.message);
      setElections(data || []);
    } catch (err) {
      setError(err?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadUserVotes = async () => {
    try {
      const { data } = await votesService?.getUserVotes(user?.id);
      const votesMap = {};
      data?.forEach(vote => {
        votesMap[vote.electionId] = vote;
      });
      setUserVotes(votesMap);
    } catch (err) {
      console.error('Failed to load user votes:', err);
    }
  };

  const handleVote = (electionId) => {
    navigate(`/secure-voting-interface?election=${electionId}`);
  };

  const handleVerify = (electionId) => {
    const vote = userVotes?.[electionId];
    if (vote) {
      navigate(`/vote-verification-portal?voteId=${vote?.id}`);
    }
  };

  const handleClone = (newElectionId) => {
    if (newElectionId) {
      loadElections();
      toast?.success('Election cloned! Draft saved. Find it in Create → Recent Drafts.');
    }
  };

  const filteredElections = elections?.filter(election => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'lotterized' && election?.isLotterized) ||
      (activeFilter === 'category' && election?.category);
    
    const matchesSearch = !searchQuery || 
      election?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      election?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filters = [
    { id: 'all', label: 'All Elections', icon: 'Vote' },
    { id: 'lotterized', label: 'Lotterized', icon: 'Trophy' },
    { id: 'category', label: 'By Category', icon: 'Filter' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Icon name="Loader" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading elections...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <Icon name="AlertCircle" size={48} className="text-destructive mx-auto mb-4" />
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={loadElections} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Active Elections
          </h2>
          <p className="text-muted-foreground">
            Browse and participate in ongoing elections
          </p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search elections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="input"
          />
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => setActiveFilter(filter?.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 flex items-center gap-2 ${
              activeFilter === filter?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            <Icon name={filter?.icon} size={16} />
            {filter?.label}
          </button>
        ))}
      </div>
      {filteredElections?.length === 0 ? (
        <div className="card p-12 text-center">
          <Icon name="Vote" size={64} className="text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            No Elections Found
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery ? 'Try adjusting your search criteria' : 'Check back later for new elections'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredElections?.map((election) => (
            <ElectionCard
              key={election?.id}
              election={{
                ...election,
                hasVoted: !!userVotes?.[election?.id],
                participants: election?.totalVoters,
                totalVotes: election?.totalVoters
              }}
              onVote={handleVote}
              onVerify={userVotes?.[election?.id] ? handleVerify : null}
              onClone={handleClone}
              isCreator={user && (election?.createdBy === user?.id || election?.created_by === user?.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoteElectionSection;