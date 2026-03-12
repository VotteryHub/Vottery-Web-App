import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const LiveVotingPanel = ({ options = [], onVote }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (optionId) => {
    if (!hasVoted) {
      setSelectedOption(optionId);
      onVote?.(optionId);
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">Live Voting Options</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Zap" className="w-4 h-4 text-yellow-500" />
          <span>Real-time updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {options?.map((option) => (
          <div
            key={option?.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer ${
              selectedOption === option?.id
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-accent/50'
            } ${hasVoted && selectedOption !== option?.id ? 'opacity-60' : ''}`}
            onClick={() => handleVote(option?.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{option?.title}</h3>
                <p className="text-sm text-muted-foreground">{option?.description}</p>
              </div>
              {selectedOption === option?.id && (
                <Icon name="CheckCircle" className="w-6 h-6 text-primary flex-shrink-0 ml-3" />
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Votes</span>
                  <span className="font-semibold text-foreground">{option?.votes || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-500"
                    style={{ width: `${option?.percentage || 0}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">{option?.percentage || 0}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasVoted && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <Icon name="CheckCircle" className="w-5 h-5" />
            <span className="font-medium">Your vote has been recorded!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVotingPanel;