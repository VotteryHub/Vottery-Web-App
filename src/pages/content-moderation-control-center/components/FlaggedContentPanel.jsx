import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { moderationService } from '../../../services/moderationService';
import { MODERATION_AUDIT } from '../../../constants/SHARED_CONSTANTS';

const FlaggedContentPanel = ({ flaggedContent, onRefresh }) => {
  const [selectedContent, setSelectedContent] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [auditModal, setAuditModal] = useState(null);
  const [auditReason, setAuditReason] = useState('');
  const [overrideAi, setOverrideAi] = useState(true);
  const [auditError, setAuditError] = useState('');

  /** Non-manual detection ⇒ default to logging an AI override audit line */
  const isLikelyAutomatedDetection = (item) => {
    const m = String(item?.detectionMethod ?? '').toLowerCase();
    if (!m) return true;
    return m !== 'manual' && m !== 'human';
  };

  const openAuditModal = (item, action) => {
    setAuditError('');
    setAuditReason('');
    setOverrideAi(isLikelyAutomatedDetection(item));
    setAuditModal({ item, action });
  };

  const closeAuditModal = () => {
    setAuditModal(null);
    setAuditReason('');
    setAuditError('');
  };

  const submitAuditModal = async () => {
    if (!auditModal?.item?.id) return;
    const trimmed = auditReason.trim();
    if (overrideAi && trimmed.length < MODERATION_AUDIT.MIN_OVERRIDE_REASON_LENGTH) {
      setAuditError(
        `Override audit requires at least ${MODERATION_AUDIT.MIN_OVERRIDE_REASON_LENGTH} characters explaining the decision.`,
      );
      return;
    }
    try {
      setActionLoading(auditModal.item.id);
      const reason = trimmed || 'Moderator review';
      await moderationService?.performModerationAction(
        auditModal.item.id,
        auditModal.action,
        reason,
        {
          overrideAi,
          detectionMethod: auditModal.item.detectionMethod,
          confidenceScore: auditModal.item.confidenceScore,
        },
      );
      closeAuditModal();
      await onRefresh();
    } catch (error) {
      console.error('Failed to perform moderation action:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const actionVerb = (action) => {
    const a = String(action || '').toLowerCase();
    if (a === 'approve') return 'Approve content';
    if (a === 'remove') return 'Remove content';
    if (a === 'warn') return 'Warn user';
    return 'Moderate';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_review':
        return 'bg-warning/10 text-warning';
      case 'under_review':
        return 'bg-primary/10 text-primary';
      case 'auto_removed':
        return 'bg-destructive/10 text-destructive';
      case 'approved':
        return 'bg-success/10 text-success';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Flagged Content ({flaggedContent?.length || 0})
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconName="Filter">
            Filter
          </Button>
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {flaggedContent?.map((item) => (
          <div key={item?.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  item?.severity === 'critical' ? 'bg-destructive/10' :
                  item?.severity === 'high' ? 'bg-warning/10' :
                  item?.severity === 'medium' ? 'bg-accent/10' : 'bg-muted'
                }`}>
                  <Icon
                    name={item?.violationType === 'misinformation' ? 'AlertCircle' :
                          item?.violationType === 'spam' ? 'Ban' :
                          item?.violationType === 'policy_violation' ? 'AlertTriangle' : 'Flag'}
                    size={24}
                    className={item?.severity === 'critical' ? 'text-destructive' :
                              item?.severity === 'high' ? 'text-warning' :
                              item?.severity === 'medium' ? 'text-accent' : 'text-muted-foreground'}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getSeverityColor(item?.severity)}`}>
                      {item?.severity?.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                      {item?.violationType?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(item?.status)}`}>
                      {item?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(item?.flaggedAt)?.toLocaleString()}
                  </span>
                </div>

                <div className="mb-3">
                  <p className="text-sm text-foreground mb-1">
                    <span className="font-medium">Content Type:</span> {item?.contentType}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {item?.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Author: {item?.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Brain" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      AI Confidence: {(item?.confidenceScore * 100)?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Zap" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Detection: {item?.detectionMethod?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {item?.status === 'pending_review' && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="success"
                      size="sm"
                      iconName="Check"
                      onClick={() => openAuditModal(item, 'approve')}
                      disabled={actionLoading === item?.id}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => openAuditModal(item, 'remove')}
                      disabled={actionLoading === item?.id}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="AlertTriangle"
                      onClick={() => openAuditModal(item, 'warn')}
                      disabled={actionLoading === item?.id}
                    >
                      Warn User
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Eye"
                      onClick={() => setSelectedContent(item)}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {(!flaggedContent || flaggedContent?.length === 0) && (
        <div className="card text-center py-12">
          <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">No Flagged Content</p>
          <p className="text-sm text-muted-foreground">All content is currently compliant with platform policies</p>
        </div>
      )}

      {auditModal && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/50"
          onClick={closeAuditModal}
          role="presentation"
        >
          <div
            className="bg-card border border-border rounded-xl shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="moderation-audit-title"
          >
            <h3 id="moderation-audit-title" className="text-lg font-heading font-semibold text-foreground mb-2">
              {actionVerb(auditModal.action)}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Decisions are written to the moderation audit log. When overriding automated detection, a detailed reason is
              required ({MODERATION_AUDIT.MIN_OVERRIDE_REASON_LENGTH}+ characters).
            </p>
            <label className="flex items-start gap-2 mb-3 cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-input"
                checked={overrideAi}
                onChange={(e) => {
                  setOverrideAi(e.target.checked);
                  setAuditError('');
                }}
              />
              <span className="text-sm text-foreground">
                Log as <strong>moderator override</strong> of automated / AI detection (recommended when the flag was not
                human-submitted)
              </span>
            </label>
            <textarea
              className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
              placeholder="Audit reason (visible to compliance / admins)"
              value={auditReason}
              onChange={(e) => {
                setAuditReason(e.target.value);
                setAuditError('');
              }}
            />
            {auditError && <p className="text-sm text-destructive mb-3">{auditError}</p>}
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={closeAuditModal}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Shield"
                onClick={submitAuditModal}
                disabled={actionLoading === auditModal.item?.id}
              >
                Confirm &amp; log
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlaggedContentPanel;