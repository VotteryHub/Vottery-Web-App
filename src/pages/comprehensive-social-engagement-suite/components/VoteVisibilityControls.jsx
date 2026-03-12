import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { electionsService } from '../../../services/electionsService';
import { useAuth } from '../../../contexts/AuthContext';

const VoteVisibilityControls = ({ election, onUpdate }) => {
  const { user } = useAuth();
  const [visibility, setVisibility] = useState(election?.voteVisibility || 'visible');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isCreator = user?.id === election?.createdBy;
  const isElectionActive = election?.status === 'active';
  const hasVotes = election?.totalVoters > 0;

  const visibilityOptions = [
    {
      id: 'hidden',
      label: 'Hidden',
      description: 'Vote totals hidden until voting closes',
      icon: 'EyeOff',
      color: 'bg-destructive/10 text-destructive border-destructive/20'
    },
    {
      id: 'visible',
      label: 'Always Visible',
      description: 'Real-time vote counts visible to everyone',
      icon: 'Eye',
      color: 'bg-success/10 text-success border-success/20'
    },
    {
      id: 'visible_after_vote',
      label: 'Visible After Voting',
      description: 'Users see results only after they vote',
      icon: 'CheckCircle',
      color: 'bg-primary/10 text-primary border-primary/20'
    }
  ];

  const handleSave = async () => {
    if (!isCreator) {
      setError('Only the election creator can change visibility settings');
      return;
    }

    // Prevent changing from visible to hidden mid-election
    if (election?.voteVisibility === 'visible' && visibility !== 'visible' && hasVotes) {
      setError('Cannot hide vote totals after they have been made visible');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { error: updateError } = await electionsService?.update(election?.id, {
        voteVisibility: visibility,
        voteVisibilityChangedAt: new Date()?.toISOString()
      });

      if (updateError) throw updateError;
      onUpdate?.();
    } catch (err) {
      setError(err?.message || 'Failed to update visibility settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Icon name="Eye" size={28} className="text-primary" />
          Vote Visibility Controls
        </h2>
        <p className="text-muted-foreground mb-6">
          Control when and how voters can see vote totals during the election
        </p>

        {!isCreator && (
          <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="Lock" size={20} className="text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold text-foreground mb-1">Creator Only</h4>
                <p className="text-sm text-muted-foreground">
                  Only the election creator can modify visibility settings
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {visibilityOptions?.map((option) => {
            const isSelected = visibility === option?.id;
            const isDisabled = !isCreator || 
              (election?.voteVisibility === 'visible' && option?.id !== 'visible' && hasVotes);

            return (
              <button
                key={option?.id}
                onClick={() => !isDisabled && setVisibility(option?.id)}
                disabled={isDisabled}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? option?.color
                    : 'border-border bg-card hover:bg-muted'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <Icon name={option?.icon} size={24} className={isSelected ? '' : 'text-muted-foreground'} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{option?.label}</h4>
                      {isSelected && (
                        <Icon name="CheckCircle" size={16} className="text-success" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{option?.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </div>
        )}

        {isCreator && (
          <Button
            onClick={handleSave}
            disabled={saving || visibility === election?.voteVisibility}
            className="w-full"
          >
            {saving ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Visibility Settings'
            )}
          </Button>
        )}
      </div>

      <div className="card p-6 bg-warning/10 border-warning/20">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              Important Restriction
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Once vote totals are made visible during an active election, they cannot be hidden again. 
              This prevents manipulation and maintains voter trust.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon name="Shield" size={14} />
              <span>Transparency protection enabled</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Current Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Current Visibility</span>
            <span className="text-sm font-medium text-foreground capitalize">
              {election?.voteVisibility?.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Voters</span>
            <span className="text-sm font-medium text-foreground">{election?.totalVoters || 0}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Election Status</span>
            <span className={`text-sm font-medium ${
              election?.status === 'active' ? 'text-success' : 'text-muted-foreground'
            }`}>
              {election?.status?.charAt(0)?.toUpperCase() + election?.status?.slice(1)}
            </span>
          </div>
          {election?.voteVisibilityChangedAt && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Changed</span>
              <span className="text-sm font-medium text-foreground">
                {new Date(election?.voteVisibilityChangedAt)?.toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoteVisibilityControls;