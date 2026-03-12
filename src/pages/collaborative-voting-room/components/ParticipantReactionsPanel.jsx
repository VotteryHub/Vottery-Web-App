import React from 'react';
import Icon from '../../../components/AppIcon';


const ParticipantReactionsPanel = ({ reactions, participants, onReact }) => {
  const handleReaction = async (emoji) => {
    try {
      // Simulate reaction submission
      await new Promise(resolve => setTimeout(resolve, 200));
      onReact?.();
    } catch (error) {
      console.error('Failed to submit reaction:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <Icon name="Smile" size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Live Reactions</h2>
            <p className="text-sm text-muted-foreground">
              Express your opinion in real-time
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {reactions?.map((reaction, idx) => (
            <button
              key={idx}
              onClick={() => handleReaction(reaction?.emoji)}
              className="p-4 bg-muted rounded-lg hover:bg-primary/10 transition-all duration-200 hover:scale-105"
            >
              <div className="text-4xl mb-2 text-center">{reaction?.emoji}</div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">{reaction?.label}</p>
                <p className="text-xs text-muted-foreground">{reaction?.count} reactions</p>
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Reactions are visible to all participants and help gauge group sentiment during deliberation.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Reaction Analytics</h3>
        
        <div className="space-y-4">
          {reactions?.map((reaction, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{reaction?.emoji}</span>
                  <span className="text-sm font-medium text-foreground">{reaction?.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">{reaction?.count}</span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(reaction?.count / reactions?.reduce((sum, r) => sum + r?.count, 0)) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Total Reactions
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {reactions?.reduce((sum, r) => sum + r?.count, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantReactionsPanel;