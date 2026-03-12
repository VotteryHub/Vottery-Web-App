import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PlusMinusBallotPanel = ({ options, voteScores, onScoreChange, onSubmit, hasVoted }) => {
  const getScoreColor = (score) => {
    if (score === 1) return 'success';
    if (score === -1) return 'destructive';
    return 'muted';
  };

  const getScoreLabel = (score) => {
    if (score === 1) return 'Positive';
    if (score === -1) return 'Negative';
    return 'Neutral';
  };

  const getTotalScores = () => {
    const scores = Object.values(voteScores);
    return {
      positive: scores?.filter(s => s === 1)?.length,
      neutral: scores?.filter(s => s === 0)?.length,
      negative: scores?.filter(s => s === -1)?.length
    };
  };

  const totals = getTotalScores();
  const isComplete = options?.every(opt => voteScores?.[opt?.id] !== undefined);

  return (
    <div className="space-y-6">
      <div className="bg-accent/10 border-2 border-accent/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
            <Icon name="BarChart3" size={20} color="white" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-1">
              Official Ballot - Plus-Minus Voting
            </h3>
            <p className="text-sm text-muted-foreground">
              Rate each option: +1 (Positive), 0 (Neutral), or -1 (Negative)
            </p>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="bg-card border-2 border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h4 className="font-heading font-bold text-foreground">Your Scores</h4>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-data font-bold text-success">{totals?.positive}</div>
              <div className="text-xs text-muted-foreground">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-data font-bold text-muted-foreground">{totals?.neutral}</div>
              <div className="text-xs text-muted-foreground">Neutral</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-data font-bold text-destructive">{totals?.negative}</div>
              <div className="text-xs text-muted-foreground">Negative</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ballot Options */}
      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
          <h4 className="font-heading font-bold text-foreground text-lg">
            Ballot Listing - All Options
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            Total Options: {options?.length}
          </p>
        </div>

        <div className="divide-y divide-border">
          {options?.map((option, index) => {
            const currentScore = voteScores?.[option?.id];
            const scoreColor = getScoreColor(currentScore);

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
                          alt={option?.imageAlt || `Option ${index + 1}`}
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

                  {/* Scoring Buttons */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => !hasVoted && onScoreChange(option?.id, 1)}
                      disabled={hasVoted}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg font-bold text-lg transition-all duration-200 border-2 ${
                        currentScore === 1
                          ? 'bg-success border-success text-white shadow-lg scale-110'
                          : 'bg-white border-success/30 text-success hover:bg-success/10 hover:scale-105'
                      } ${hasVoted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      +1
                    </button>
                    <button
                      onClick={() => !hasVoted && onScoreChange(option?.id, 0)}
                      disabled={hasVoted}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg font-bold text-lg transition-all duration-200 border-2 ${
                        currentScore === 0
                          ? 'bg-muted border-muted-foreground text-foreground shadow-lg scale-110'
                          : 'bg-white border-muted-foreground/30 text-muted-foreground hover:bg-muted/30 hover:scale-105'
                      } ${hasVoted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      0
                    </button>
                    <button
                      onClick={() => !hasVoted && onScoreChange(option?.id, -1)}
                      disabled={hasVoted}
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-lg font-bold text-lg transition-all duration-200 border-2 ${
                        currentScore === -1
                          ? 'bg-destructive border-destructive text-white shadow-lg scale-110'
                          : 'bg-white border-destructive/30 text-destructive hover:bg-destructive/10 hover:scale-105'
                      } ${hasVoted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      -1
                    </button>
                  </div>

                  {/* Current Score Badge */}
                  {currentScore !== undefined && (
                    <div className={`px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0 ${
                      currentScore === 1 ? 'bg-success/10 text-success' :
                      currentScore === -1 ? 'bg-destructive/10 text-destructive': 'bg-muted text-muted-foreground'
                    }`}>
                      {getScoreLabel(currentScore)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Button */}
      {!hasVoted && (
        <Button 
          onClick={onSubmit} 
          disabled={!isComplete}
          className="w-full"
          size="lg"
        >
          {isComplete ? (
            <>
              <Icon name="Send" size={20} />
              Submit Your Plus-Minus Vote
            </>
          ) : (
            <>
              <Icon name="AlertCircle" size={20} />
              Rate All Options to Continue
            </>
          )}
        </Button>
      )}

      {/* Voting Instructions */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">
              Voting Instructions
            </p>
            <p className="text-xs text-muted-foreground">
              Rate each option using the +1/0/-1 buttons. +1 means you strongly support this option, 0 means neutral/no opinion, 
              and -1 means you oppose this option. The option with the highest weighted average score wins. 
              This method reduces strategic voting and captures true preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlusMinusBallotPanel;