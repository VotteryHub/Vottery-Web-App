import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreDisplay = ({ scoreDetails, passingScore, currentAttempt, maxAttempts, onRetry, onContinue }) => {
  const scorePct = scoreDetails?.scorePercentage ?? scoreDetails?.score_percentage ?? 0;
  const totalQ = scoreDetails?.totalQuestions ?? scoreDetails?.total_questions ?? 0;
  const correctA = scoreDetails?.correctAnswers ?? scoreDetails?.correct_answers ?? 0;
  const passed = scorePct >= passingScore;
  const attemptsRemaining = maxAttempts - currentAttempt;

  return (
    <div className="bg-card border border-border rounded-xl p-8">
      <div className="text-center space-y-6">
        {/* Attempt indicator */}
        <p className="text-sm text-muted-foreground">Attempt {currentAttempt} of {maxAttempts}</p>

        {/* Result icon */}
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
          passed ? 'bg-green-100' : 'bg-orange-100'
        }`}>
          <Icon
            name={passed ? 'CheckCircle' : 'AlertCircle'}
            size={56}
            color={passed ? '#16a34a' : '#ea580c'}
          />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            {passed ? '🎉 Quiz Passed!' : 'Quiz Complete'}
          </h2>
          <p className={`text-lg font-semibold ${
            passed ? 'text-green-600' : 'text-orange-600'
          }`}>
            {Math.round(scorePct)}%
          </p>
        </div>

        {/* Score breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-2xl font-bold text-foreground">{totalQ}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Questions</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-600">{correctA}</p>
            <p className="text-xs text-muted-foreground mt-1">Correct</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-500">{totalQ - correctA}</p>
            <p className="text-xs text-muted-foreground mt-1">Incorrect</p>
          </div>
        </div>

        {/* Pass/fail message */}
        {passed ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-sm text-green-700 dark:text-green-400">
              Excellent! You've passed with {Math.round(scorePct)}% (required: {passingScore}%). You may now proceed to vote.
            </p>
          </div>
        ) : (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
            <p className="text-sm text-orange-700 dark:text-orange-400">
              {attemptsRemaining > 0
                ? `Score ${Math.round(scorePct)}% — need ${passingScore}% to pass. ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`
                : `All ${maxAttempts} attempts used. Score: ${Math.round(scorePct)}%.`
              }
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {!passed && attemptsRemaining > 0 && (
            <button
              onClick={onRetry}
              className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
            >
              <Icon name="RefreshCw" size={18} />
              Retry Quiz
            </button>
          )}
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Continue to Voting
            <Icon name="ArrowRight" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;
