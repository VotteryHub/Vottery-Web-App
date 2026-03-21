import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import { googleAnalyticsService } from '../../../services/googleAnalyticsService';
import { moderationService } from '../../../services/moderationService';
import { supabase } from '../../../lib/supabase';

const STATUS_TO_UI = {
  pending_review: 'pending',
  under_review: 'under_review',
  auto_removed: 'resolved',
  approved: 'resolved',
  content_removed: 'resolved',
  user_warned: 'resolved',
  escalated: 'under_review',
};

const mapFlagRow = (row) => {
  const author = row?.author;
  const name =
    (typeof author === 'object' && (author?.full_name || author?.name)) ||
    author?.username ||
    'Unknown';
  return {
    id: row.id,
    contentType: row.content_type,
    contentId: row.content_id,
    content: row.content_snippet || '(No preview)',
    author: row.author_id,
    authorName: name,
    violationType: row.violation_type,
    severity: row.severity || 'medium',
    flaggedAt: row.created_at,
    status: STATUS_TO_UI[row.status] || row.status,
    _dbStatus: row.status,
  };
};

const ModerationToolsPanel = ({ communityId }) => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const loadFlaggedContent = useCallback(async () => {
    setLoading(true);
    try {
      let q = supabase
        .from('content_flags')
        .select(
          `
          id,
          content_type,
          content_id,
          content_snippet,
          author_id,
          violation_type,
          severity,
          status,
          created_at,
          author:user_profiles!content_flags_author_id_fkey(name, username, full_name)
        `
        )
        .order('created_at', { ascending: false })
        .limit(100);

      const { data, error } = await q;
      let rows;
      if (error) {
        const retry = await supabase
          .from('content_flags')
          .select(
            'id, content_type, content_id, content_snippet, author_id, violation_type, severity, status, created_at'
          )
          .order('created_at', { ascending: false })
          .limit(100);
        if (retry.error) throw retry.error;
        rows = retry.data || [];
      } else {
        rows = data || [];
      }

      let mapped = rows.map(mapFlagRow);

      if (communityId) {
        mapped = mapped.filter(
          (item) =>
            item.contentType === 'election' &&
            String(item.contentId || '').includes(String(communityId))
        );
      }

      const filtered =
        activeFilter === 'all'
          ? mapped
          : mapped.filter((item) => {
              if (activeFilter === 'pending') return item.status === 'pending';
              if (activeFilter === 'under_review') return item.status === 'under_review';
              if (activeFilter === 'resolved') return item.status === 'resolved';
              return true;
            });

      setFlaggedContent(filtered);
    } catch (error) {
      console.error('Error loading flagged content:', error);
      setFlaggedContent([]);
    } finally {
      setLoading(false);
    }
  }, [activeFilter, communityId]);

  useEffect(() => {
    loadFlaggedContent();
  }, [loadFlaggedContent]);

  const handleModerationAction = async (flagId, action) => {
    try {
      googleAnalyticsService?.trackSocialInteraction('moderation_action', communityId, {
        content_id: flagId,
        action,
      });

      const { error } = await moderationService.performModerationAction(flagId, action);
      if (error) throw new Error(error.message);

      setFlaggedContent((prev) => prev?.filter((item) => item?.id !== flagId));
    } catch (error) {
      console.error('Error performing moderation action:', error);
    }
  };

  const severityColors = {
    critical: 'bg-destructive/10 text-destructive',
    high: 'bg-warning/10 text-warning',
    medium: 'bg-secondary/10 text-secondary',
    low: 'bg-muted text-muted-foreground',
  };

  const violationTypes = {
    misinformation: { icon: 'AlertTriangle', label: 'Misinformation' },
    spam: { icon: 'Ban', label: 'Spam' },
    policy_violation: { icon: 'ShieldAlert', label: 'Policy Violation' },
    harassment: { icon: 'UserX', label: 'Harassment' },
    hate_speech: { icon: 'MessageSquareX', label: 'Hate Speech' },
    election_integrity: { icon: 'Vote', label: 'Election Integrity' },
    other: { icon: 'HelpCircle', label: 'Other' },
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'resolved', label: 'Resolved' },
  ];

  return (
    <div className="bg-background rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">
            Moderation Tools
          </h3>
          <p className="text-sm text-muted-foreground">
            Review flagged content from <code className="text-xs">content_flags</code> (Supabase)
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
        {filters?.map((filter) => (
          <button
            key={filter?.id}
            type="button"
            onClick={() => setActiveFilter(filter?.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-250 ${
              activeFilter === filter?.id
                ? 'bg-primary text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
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
          {flaggedContent?.map((item) => (
            <div key={item?.id} className="p-4 bg-card rounded-lg border border-border">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon
                    name={violationTypes?.[item?.violationType]?.icon || 'AlertTriangle'}
                    size={20}
                    className="text-destructive"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {violationTypes?.[item?.violationType]?.label || item?.violationType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item?.contentType} by {item?.authorName}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-md font-medium ${severityColors?.[item?.severity] || severityColors.medium}`}
                >
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
