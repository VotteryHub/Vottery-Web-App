import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { googleAnalyticsService } from '../../../services/googleAnalyticsService';

const ModerationToolsPanel = ({ communityId }) => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    loadFlaggedContent();
  }, [communityId, activeFilter]);

  const loadFlaggedContent = async () => {
    setLoading(true);
    try {
      // Mock flagged content for community
      const mockData = [
        {
          id: 1,
          contentType: 'post',
          contentId: 'post_123',
          content: 'This election is rigged! Don\'t trust the results...',
          author: 'user_456',
          authorName: 'John Doe',
          violationType: 'misinformation',
          severity: 'high',
          flaggedAt: new Date(Date.now() - 3600000)?.toISOString(),
          status: 'pending'
        },
        {
          id: 2,
          contentType: 'comment',
          contentId: 'comment_789',
          content: 'Click here for free votes! Limited time offer...',
          author: 'user_789',
          authorName: 'Spam Bot',
          violationType: 'spam',
          severity: 'medium',
          flaggedAt: new Date(Date.now() - 7200000)?.toISOString(),
          status: 'pending'
        },
        {
          id: 3,
          contentType: 'election',
          contentId: 'election_456',
          content: 'Vote for candidate X and receive cash rewards...',
          author: 'user_234',
          authorName: 'Jane Smith',
          violationType: 'policy_violation',
          severity: 'critical',
          flaggedAt: new Date(Date.now() - 10800000)?.toISOString(),
          status: 'under_review'
        }
      ];

      const filtered = activeFilter === 'all' 
        ? mockData 
        : mockData?.filter(item => item?.status === activeFilter);

      setFlaggedContent(filtered);
    } catch (error) {
      console.error('Error loading flagged content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (contentId, action) => {
    try {
      // Track moderation action
      googleAnalyticsService?.trackSocialInteraction('moderation_action', communityId, {
        content_id: contentId,
        action: action
      });

      // Update content status
      setFlaggedContent(prev => prev?.filter(item => item?.id !== contentId));
    } catch (error) {
      console.error('Error performing moderation action:', error);
    }
  };

  const severityColors = {
    critical: 'bg-destructive/10 text-destructive',
    high: 'bg-warning/10 text-warning',
    medium: 'bg-secondary/10 text-secondary',
    low: 'bg-muted text-muted-foreground'
  };

  const violationTypes = {
    misinformation: { icon: 'AlertTriangle', label: 'Misinformation' },
    spam: { icon: 'Ban', label: 'Spam' },
    policy_violation: { icon: 'ShieldAlert', label: 'Policy Violation' },
    harassment: { icon: 'UserX', label: 'Harassment' },
    hate_speech: { icon: 'MessageSquareX', label: 'Hate Speech' }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'resolved', label: 'Resolved' }
  ];

  return (
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Moderation Tools
          </h3>
          <p className="text-sm text-muted-foreground">
            Review flagged content and enforce community guidelines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-primary" />
          <span className="text-sm font-medium text-foreground">
            {flaggedContent?.length} flagged items
          </span>
        </div>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters?.map(filter => (
          <button
            key={filter?.id}
            onClick={() => setActiveFilter(filter?.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
              activeFilter === filter?.id
                ? 'bg-primary text-white' :'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {filter?.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Icon name="Loader" size={24} className="animate-spin text-primary" />
        </div>
      ) : flaggedContent?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
          <p className="text-muted-foreground">No flagged content to review</p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedContent?.map(item => (
            <div key={item?.id} className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon 
                    name={violationTypes?.[item?.violationType]?.icon} 
                    size={20} 
                    className="text-destructive" 
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {violationTypes?.[item?.violationType]?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item?.contentType} by {item?.authorName}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs rounded-md font-medium ${severityColors?.[item?.severity]}`}>
                  {item?.severity}
                </span>
              </div>

              <div className="p-3 bg-background rounded-lg border border-border mb-3">
                <p className="text-sm text-foreground">{item?.content}</p>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Flagged {new Date(item?.flaggedAt)?.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleModerationAction(item?.id, 'approve')}
                    variant="secondary"
                    size="sm"
                  >
                    <Icon name="Check" size={14} />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleModerationAction(item?.id, 'warn')}
                    variant="secondary"
                    size="sm"
                  >
                    <Icon name="AlertTriangle" size={14} />
                    Warn
                  </Button>
                  <Button
                    onClick={() => handleModerationAction(item?.id, 'remove')}
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="Trash2" size={14} />
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModerationToolsPanel;