import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { moderationService } from '../../../services/moderationService';

const ContentAppealsPanel = ({ appeals = [], onRefresh }) => {
  const [resolvingId, setResolvingId] = useState(null);

  const handleResolve = async (appealId, outcome) => {
    try {
      setResolvingId(appealId);
      await moderationService?.resolveAppeal?.(appealId, outcome);
      await onRefresh?.();
    } catch (err) {
      console.error('Resolve appeal error:', err);
    } finally {
      setResolvingId(null);
    }
  };

  const statusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (status === 'upheld' || status === 'dismissed') return 'bg-red-500/10 text-red-600 border-red-500/20';
    if (status === 'restored' || status === 'overturned') return 'bg-green-500/10 text-green-600 border-green-500/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Content Appeals ({appeals?.length || 0})
        </h3>
      </div>
      <p className="text-sm text-muted-foreground">
        When content is removed, authors can submit an appeal. Uphold removal or restore content and notify the user.
      </p>
      <div className="space-y-3">
        {(!appeals || appeals?.length === 0) && (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            No appeals to review.
          </div>
        )}
        {appeals?.map((appeal) => (
          <div
            key={appeal?.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    {appeal?.contentType} • {appeal?.contentRef}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${statusColor(appeal?.status)}`}>
                    {appeal?.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1">{appeal?.appellantName || 'Unknown'}</p>
                <p className="text-sm text-muted-foreground mt-1">{appeal?.reason}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Submitted {appeal?.createdAt ? new Date(appeal.createdAt)?.toLocaleString() : '—'}
                </p>
              </div>
              {appeal?.status === 'pending' && (
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-500/30 hover:bg-red-500/10"
                    onClick={() => handleResolve(appeal?.id, 'dismissed')}
                    disabled={resolvingId === appeal?.id}
                  >
                    Uphold removal
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleResolve(appeal?.id, 'overturned')}
                    disabled={resolvingId === appeal?.id}
                  >
                    Restore content
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentAppealsPanel;
