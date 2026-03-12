import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { googleAnalyticsService } from '../../../services/googleAnalyticsService';

const ElectionCollaborationPanel = ({ communityId }) => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);
  const [communityElections, setCommunityElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [newProposal, setNewProposal] = useState({
    title: '',
    description: '',
    votingType: 'plurality'
  });

  useEffect(() => {
    loadProposalsAndElections();
  }, [communityId]);

  const loadProposalsAndElections = async () => {
    setLoading(true);
    try {
      // Load community elections
      const { data: elections, error: electionsError } = await supabase
        ?.from('community_elections')
        ?.select(`
          *,
          elections(*)
        `)
        ?.eq('community_id', communityId);

      if (!electionsError) setCommunityElections(elections || []);

      // Mock proposals data
      const mockProposals = [
        {
          id: 1,
          title: 'Best Technology Innovation of 2026',
          description: 'Vote for the most impactful technology innovation this year',
          proposedBy: 'John Doe',
          votingType: 'ranked_choice',
          votes: 45,
          status: 'voting',
          createdAt: new Date(Date.now() - 86400000)?.toISOString()
        },
        {
          id: 2,
          title: 'Community Leadership Election',
          description: 'Select new community moderators for the next term',
          proposedBy: 'Jane Smith',
          votingType: 'approval',
          votes: 32,
          status: 'pending',
          createdAt: new Date(Date.now() - 172800000)?.toISOString()
        }
      ];

      setProposals(mockProposals);
    } catch (error) {
      console.error('Error loading proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProposal = async () => {
    try {
      // Track proposal creation
      googleAnalyticsService?.trackSocialInteraction('election_proposal_created', communityId, {
        title: newProposal?.title,
        voting_type: newProposal?.votingType
      });

      // Add to proposals list (mock)
      const proposal = {
        id: Date.now(),
        ...newProposal,
        proposedBy: user?.email,
        votes: 0,
        status: 'pending',
        createdAt: new Date()?.toISOString()
      };

      setProposals(prev => [proposal, ...prev]);
      setShowProposalModal(false);
      setNewProposal({
        title: '',
        description: '',
        votingType: 'plurality'
      });
    } catch (error) {
      console.error('Error creating proposal:', error);
    }
  };

  const handleVoteOnProposal = async (proposalId, vote) => {
    try {
      // Track proposal vote
      googleAnalyticsService?.trackSocialInteraction('proposal_voted', communityId, {
        proposal_id: proposalId,
        vote: vote
      });

      // Update proposal votes (mock)
      setProposals(prev => prev?.map(p => 
        p?.id === proposalId 
          ? { ...p, votes: p?.votes + (vote === 'approve' ? 1 : -1) }
          : p
      ));
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  const statusColors = {
    pending: 'bg-warning/10 text-warning',
    voting: 'bg-primary/10 text-primary',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-destructive/10 text-destructive'
  };

  return (
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Election Collaboration
          </h3>
          <p className="text-sm text-muted-foreground">
            Propose and vote on community elections
          </p>
        </div>
        <Button onClick={() => setShowProposalModal(true)}>
          <Icon name="Plus" size={16} />
          Propose Election
        </Button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Active Proposals */}
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="Vote" size={18} className="text-primary" />
              Active Proposals ({proposals?.length})
            </h4>
            <div className="space-y-3">
              {proposals?.map(proposal => (
                <div key={proposal?.id} className="p-4 bg-card rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-foreground mb-1">
                        {proposal?.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-2">
                        {proposal?.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Proposed by {proposal?.proposedBy}</span>
                        <span>•</span>
                        <span>{new Date(proposal?.createdAt)?.toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="capitalize">{proposal?.votingType?.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-md font-medium ${statusColors?.[proposal?.status]}`}>
                      {proposal?.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="ThumbsUp" size={16} className="text-success" />
                      <span className="text-sm font-medium text-foreground">
                        {proposal?.votes} votes
                      </span>
                    </div>
                    {proposal?.status === 'voting' && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVoteOnProposal(proposal?.id, 'approve')}
                          variant="secondary"
                          size="sm"
                        >
                          <Icon name="ThumbsUp" size={14} />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleVoteOnProposal(proposal?.id, 'reject')}
                          variant="secondary"
                          size="sm"
                        >
                          <Icon name="ThumbsDown" size={14} />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Elections */}
          <div>
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <Icon name="CheckCircle" size={18} className="text-success" />
              Active Community Elections ({communityElections?.length})
            </h4>
            <div className="space-y-3">
              {communityElections?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No active elections yet
                </div>
              ) : (
                communityElections?.map(item => (
                  <div key={item?.id} className="p-4 bg-card rounded-lg border border-border">
                    <h5 className="font-medium text-foreground mb-2">
                      {item?.elections?.title}
                    </h5>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Users" size={14} />
                        {item?.elections?.total_voters || 0} voters
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        Ends {new Date(item?.elections?.end_date)?.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      {/* Create Proposal Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl border border-border max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Propose New Election
              </h3>
              <button onClick={() => setShowProposalModal(false)}>
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Election Title
                </label>
                <input
                  type="text"
                  value={newProposal?.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e?.target?.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter election title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={newProposal?.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e?.target?.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Describe the election"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Voting Type
                </label>
                <select
                  value={newProposal?.votingType}
                  onChange={(e) => setNewProposal({ ...newProposal, votingType: e?.target?.value })}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="plurality">Plurality Voting</option>
                  <option value="ranked_choice">Ranked Choice</option>
                  <option value="approval">Approval Voting</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setShowProposalModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProposal}
                  className="flex-1"
                  disabled={!newProposal?.title || !newProposal?.description}
                >
                  Submit Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionCollaborationPanel;