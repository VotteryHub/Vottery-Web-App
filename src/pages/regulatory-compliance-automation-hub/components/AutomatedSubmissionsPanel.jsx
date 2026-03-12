import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AutomatedSubmissionsPanel = ({ filings, onSubmit, loading }) => {
  const [selectedFiling, setSelectedFiling] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [recipients, setRecipients] = useState([]);

  const handleSubmit = async () => {
    if (!selectedFiling || recipients?.length === 0) return;

    setSubmitting(true);
    await onSubmit(selectedFiling?.id, recipients);
    setSubmitting(false);
    setSelectedFiling(null);
    setRecipients([]);
  };

  const addRecipient = () => {
    setRecipients([...recipients, { email: '', jurisdiction: selectedFiling?.jurisdiction || '' }]);
  };

  const updateRecipient = (index, field, value) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const removeRecipient = (index) => {
    setRecipients(recipients?.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)]?.map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
            <div className="h-3 bg-muted rounded w-full mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-500/10 text-blue-500';
      case 'approved':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Send" size={20} />
            Regulatory Filings
          </h3>
        </div>
        <div className="space-y-4">
          {filings?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="FileText" size={48} className="mx-auto mb-4" />
              <p>No filings found</p>
            </div>
          ) : (
            filings?.map((filing) => (
              <div key={filing?.id} className="border border-border rounded-lg p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-foreground">{filing?.filingType?.replace('_', ' ')?.toUpperCase()}</h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(filing?.status)}`}>
                        {filing?.status?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Globe" size={12} />
                        {filing?.jurisdiction}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Building" size={12} />
                        {filing?.regulatoryAuthority}
                      </span>
                      {filing?.dueDate && (
                        <span className="flex items-center gap-1">
                          <Icon name="Calendar" size={12} />
                          Due: {new Date(filing?.dueDate)?.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={() => setSelectedFiling(filing)}
                    variant="outline"
                    size="sm"
                    disabled={filing?.status === 'submitted' || filing?.status === 'approved'}
                  >
                    <Icon name="Send" size={14} />
                    Submit via Resend
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedFiling && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Submit Regulatory Filing</h3>
                <button onClick={() => { setSelectedFiling(null); setRecipients([]); }} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Filing Type</label>
                <p className="mt-1 text-sm text-muted-foreground">{selectedFiling?.filingType?.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Jurisdiction</label>
                <p className="mt-1 text-sm text-muted-foreground">{selectedFiling?.jurisdiction}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Regulatory Authority</label>
                <p className="mt-1 text-sm text-muted-foreground">{selectedFiling?.regulatoryAuthority}</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-foreground">Recipients</label>
                  <Button onClick={addRecipient} size="sm" variant="outline">
                    <Icon name="Plus" size={14} />
                    Add Recipient
                  </Button>
                </div>
                <div className="space-y-3">
                  {recipients?.map((recipient, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="email"
                        placeholder="Email address"
                        value={recipient?.email}
                        onChange={(e) => updateRecipient(index, 'email', e?.target?.value)}
                        className="flex-1 px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button onClick={() => removeRecipient(index)} className="text-red-500 hover:text-red-600">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={submitting || recipients?.length === 0 || recipients?.some(r => !r?.email)}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <Icon name="Loader2" className="animate-spin" size={16} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    Submit via Resend
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutomatedSubmissionsPanel;