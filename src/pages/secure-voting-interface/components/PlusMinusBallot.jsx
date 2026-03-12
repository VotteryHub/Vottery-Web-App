import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PlusMinusBallot = ({ options, voteScores, onScoreChange }) => {
  const getScoreCount = (score) => {
    return Object.values(voteScores || {})?.filter(s => s === score)?.length || 0;
  };

  const positiveCount = getScoreCount(1);
  const neutralCount = getScoreCount(0);
  const negativeCount = getScoreCount(-1);

  const getScoreLabel = (score) => {
    if (score === 1) return 'POSITIVE';
    if (score === -1) return 'NEGATIVE';
    return 'NEUTRAL';
  };

  const getScoreColor = (score) => {
    if (score === 1) return 'success';
    if (score === -1) return 'destructive';
    return 'muted';
  };

  return (
    <div className="space-y-4">
      <div className="bg-secondary/10 border-2 border-secondary/30 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1">
              Official Ballot - Plus-Minus Voting
            </h3>
            <p className="text-sm text-muted-foreground">
              Rate each candidate: +1 (Positive), 0 (Neutral), or -1 (Negative)
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-foreground text-lg">
                Ballot Listing - All Candidates
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Total Candidates: {options?.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-data font-bold text-success">{positiveCount}</div>
                <div className="text-xs text-muted-foreground">Positive</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-data font-bold text-muted-foreground">{neutralCount}</div>
                <div className="text-xs text-muted-foreground">Neutral</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-data font-bold text-destructive">{negativeCount}</div>
                <div className="text-xs text-muted-foreground">Negative</div>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {options?.map((option, index) => {
            const currentScore = voteScores?.[option?.id] ?? null;
            
            return (
              <div
                key={option?.id}
                className={`px-6 py-5 transition-all duration-200 ${
                  currentScore === 1 ? 'bg-success/5' : 
                  currentScore === -1 ? 'bg-destructive/5' : 
                  currentScore === 0 ? 'bg-muted/30' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg font-data font-bold text-muted-foreground w-8 flex-shrink-0">
                    {index + 1}.
                  </span>

                  <div className="flex-1 min-w-0 flex items-center gap-4">
                    {option?.image && (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 border-border">
                        <Image
                          src={option?.image}
                          alt={option?.imageAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-bold text-foreground text-base md:text-lg mb-1">
                        {option?.title}
                      </h3>
                      {option?.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {option?.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onScoreChange(option?.id, 1)}
                      className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                        currentScore === 1
                          ? 'bg-success border-success text-white scale-105' :'bg-white border-success/30 text-success hover:bg-success/10'
                      }`}
                      title="Rate Positive (+1)"
                    >
                      <Icon name="Plus" size={18} className="inline" />
                      <span className="ml-1 hidden md:inline">+1</span>
                    </button>
                    
                    <button
                      onClick={() => onScoreChange(option?.id, 0)}
                      className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                        currentScore === 0
                          ? 'bg-muted-foreground border-muted-foreground text-white scale-105' 
                          : 'bg-white border-muted-foreground/30 text-muted-foreground hover:bg-muted/20'
                      }`}
                      title="Rate Neutral (0)"
                    >
                      <Icon name="Minus" size={18} className="inline" />
                      <span className="ml-1 hidden md:inline">0</span>
                    </button>
                    
                    <button
                      onClick={() => onScoreChange(option?.id, -1)}
                      className={`px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 border-2 ${
                        currentScore === -1
                          ? 'bg-destructive border-destructive text-white scale-105' :'bg-white border-destructive/30 text-destructive hover:bg-destructive/10'
                      }`}
                      title="Rate Negative (-1)"
                    >
                      <Icon name="Minus" size={18} className="inline" />
                      <span className="ml-1 hidden md:inline">-1</span>
                    </button>
                  </div>

                  {currentScore !== null && (
                    <div className="flex-shrink-0 ml-2">
                      <div className={`px-3 py-2 rounded-lg font-bold text-xs ${
                        currentScore === 1 ? 'bg-success text-white' :
                        currentScore === -1 ? 'bg-destructive text-white': 'bg-muted-foreground text-white'
                      }`}>
                        {getScoreLabel(currentScore)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Voting Instructions
            </p>
            <p className="text-xs text-muted-foreground">
              Rate each candidate using +1 (positive), 0 (neutral), or -1 (negative). The candidate with the highest weighted average score wins. This method captures nuanced preferences and reduces strategic voting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlusMinusBallot;