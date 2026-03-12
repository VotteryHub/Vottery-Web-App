import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContentReviewQueuePanel = ({ queue, onUpdateStatus, loading }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [filter, setFilter] = useState('all');

  const handleUpdateStatus = async (screeningId, newStatus, notes) => {
    setUpdating(true);
    await onUpdateStatus(screeningId, {
      screeningStatus: newStatus,
      resolutionNotes: notes
    });
    setUpdating(false);
    setSelectedItem(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const filteredQueue = filter === 'all' ? queue : queue?.filter(item => item?.screeningStatus === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'flagged':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'blocked':
        return 'bg-red-500/10 text-red-500';
      case 'under_review':
        return 'bg-blue-500/10 text-blue-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e?.target?.value)}
          className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Items</option>
          <option value="pending">Pending</option>
          <option value="flagged">Flagged</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="blocked">Blocked</option>
        </select>
        <div className="text-sm text-muted-foreground">
          {filteredQueue?.length} items
        </div>
      </div>

      <div className="space-y-4">
        {filteredQueue?.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icon name="CheckCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No items in queue</p>
          </div>
        ) : (
          filteredQueue?.map((item) => (
            <div key={item?.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item?.screeningStatus)}`}>
                      {item?.screeningStatus?.replace('_', ' ')?.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item?.contentType?.replace('_', ' ')}
                    </span>
                    {item?.humanReviewRequired && (
                      <span className="px-2 py-1 text-xs bg-purple-500/10 text-purple-500 rounded">
                        Human Review Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground mb-3 line-clamp-2">{item?.contentText}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {item?.submittedByProfile?.username || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Clock" size={12} />
                      {new Date(item?.createdAt)?.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Target" size={12} />
                      Confidence: {item?.aiConfidenceScore}%
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedItem(item)}
                  variant="outline"
                  size="sm"
                >
                  Review
                </Button>
              </div>

              {item?.detectedViolations?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex flex-wrap gap-2">
                    {item?.detectedViolations?.map((violation, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded">
                        {violation}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item?.aiReasoning && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>AI Analysis:</strong> {item?.aiReasoning}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Content Review</h3>
                <button onClick={() => setSelectedItem(null)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Content</label>
                <p className="mt-2 text-sm text-foreground bg-muted/50 p-4 rounded-lg">{selectedItem?.contentText}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Status</label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedItem?.screeningStatus}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Confidence</label>
                  <p className="mt-1 text-sm text-muted-foreground">{selectedItem?.aiConfidenceScore}%</p>
                </div>
              </div>
              {selectedItem?.detectedViolations?.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-foreground">Violations</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedItem?.detectedViolations?.map((violation, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded">
                        {violation}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-foreground">AI Reasoning</label>
                <p className="mt-2 text-sm text-muted-foreground">{selectedItem?.aiReasoning}</p>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <Button
                onClick={() => handleUpdateStatus(selectedItem?.id, 'approved', 'Manually approved after review')}
                disabled={updating}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Icon name="CheckCircle" size={16} />
                Approve
              </Button>
              <Button
                onClick={() => handleUpdateStatus(selectedItem?.id, 'blocked', 'Manually blocked after review')}
                disabled={updating}
                className="flex-1 bg-red-500 hover:bg-red-600"
              >
                <Icon name="XCircle" size={16} />
                Block
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentReviewQueuePanel;