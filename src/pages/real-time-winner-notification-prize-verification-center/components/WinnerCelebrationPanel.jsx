import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WinnerCelebrationPanel = ({ winners, onSendCelebration }) => {
  const [sending, setSending] = useState(null);
  const [celebrationsSent, setCelebrationsSent] = useState(new Set());

  const handleSendCelebration = async (winnerId) => {
    try {
      setSending(winnerId);
      const result = await onSendCelebration?.(winnerId);
      if (result?.success) {
        setCelebrationsSent(prev => new Set([...prev, winnerId]));
      }
    } catch (error) {
      console.error('Failed to send celebration:', error);
    } finally {
      setSending(null);
    }
  };

  const celebrationTemplates = [
    {
      id: 'confetti',
      name: 'Confetti Blast',
      icon: 'Sparkles',
      description: 'Animated confetti celebration'
    },
    {
      id: 'trophy',
      name: 'Trophy Presentation',
      icon: 'Trophy',
      description: '3D trophy animation'
    },
    {
      id: 'fireworks',
      name: 'Fireworks Display',
      icon: 'Zap',
      description: 'Spectacular fireworks show'
    },
    {
      id: 'spotlight',
      name: 'Winner Spotlight',
      icon: 'Star',
      description: 'Spotlight winner moment'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon name="PartyPopper" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-foreground">Winner Celebrations</h2>
            <p className="text-sm text-muted-foreground">Send celebratory notifications to winners</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {celebrationTemplates?.map((template) => (
            <div
              key={template?.id}
              className="bg-background border border-border rounded-lg p-4 hover:border-primary/40 transition-all duration-250 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon name={template?.icon} size={20} className="text-primary" />
                </div>
                <h3 className="text-sm font-medium text-foreground">{template?.name}</h3>
              </div>
              <p className="text-xs text-muted-foreground">{template?.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          {winners?.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="PartyPopper" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No winners to celebrate</p>
            </div>
          ) : (
            winners?.map((winner) => {
              const isSent = celebrationsSent?.has(winner?.id);
              return (
                <div
                  key={winner?.id}
                  className="bg-gradient-to-r from-yellow-500/5 to-transparent border border-yellow-500/20 rounded-lg p-4 hover:border-yellow-500/40 transition-all duration-250"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <Icon name="Trophy" size={24} className="text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-heading font-bold text-foreground">
                            🎉 {winner?.userName || 'Winner'}
                          </h3>
                          {isSent && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full border border-green-500/20">
                              Celebration Sent
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Prize Amount</p>
                            <p className="text-sm font-medium text-foreground">{winner?.prizeAmount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Election</p>
                            <p className="text-sm font-medium text-foreground">{winner?.electionTitle}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant={isSent ? "outline" : "default"}
                        size="sm"
                        iconName={sending === winner?.id ? "Loader" : isSent ? "CheckCircle" : "Send"}
                        onClick={() => handleSendCelebration(winner?.id)}
                        disabled={sending === winner?.id || isSent}
                      >
                        {sending === winner?.id ? 'Sending...' : isSent ? 'Sent' : 'Send Celebration'}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Send" size={20} className="text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">Celebrations Sent</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{celebrationsSent?.size}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Clock" size={20} className="text-yellow-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Pending</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">{winners?.length - celebrationsSent?.size}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="TrendingUp" size={20} className="text-green-600" />
            <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {winners?.length > 0 ? ((celebrationsSent?.size / winners?.length) * 100)?.toFixed(0) : 0}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default WinnerCelebrationPanel;