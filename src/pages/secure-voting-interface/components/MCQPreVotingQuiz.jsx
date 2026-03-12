import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import mcqService from '../../../services/mcqService';

const MCQPreVotingQuiz = ({ questions, onComplete, passingScore = 0, maxAttempts = 3, electionId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreDetails, setScoreDetails] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestionBanner, setNewQuestionBanner] = useState(false);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const answeredCount = Object.keys(answers)?.length;

  // Stream live questions
  useEffect(() => {
    if (!electionId) return;
    const unsubscribe = mcqService?.streamLiveQuestions(electionId, () => {
      setNewQuestionBanner(true);
      setTimeout(() => setNewQuestionBanner(false), 5000);
    });
    return unsubscribe;
  }, [electionId]);

  const handleAnswerSelect = (answer) => {
    setValidationError('');
    setAnswers(prev => ({ ...prev, [currentQuestion?.id]: answer }));
  };

  const handleFreeTextChange = (text) => {
    const limit = currentQuestion?.charLimit || 500;
    if (text?.length <= limit) {
      setValidationError('');
      setAnswers(prev => ({ ...prev, [currentQuestion?.id]: text }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Pre-submit validation: check all required questions are answered
    const unansweredRequired = questions?.filter(q =>
      (q?.isRequired !== false) && (answers?.[q?.id] === undefined || answers?.[q?.id] === '')
    );

    if (unansweredRequired?.length > 0) {
      const firstUnanswered = questions?.findIndex(q => q?.id === unansweredRequired?.[0]?.id);
      setCurrentQuestionIndex(firstUnanswered);
      setValidationError(`Please answer this required question before submitting.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit free-text answers separately
      for (const question of questions || []) {
        if (question?.questionType === 'free_text' && answers?.[question?.id] && electionId) {
          await mcqService?.submitFreeTextAnswer(electionId, question?.id, answers?.[question?.id]);
        }
      }

      // Submit MCQ responses
      const { data: { user } } = await import('../../../lib/supabase')?.then(m => m?.supabase?.auth?.getUser());
      const userId = user?.id;

      if (electionId && userId) {
        await mcqService?.submitMCQResponse(electionId, userId, answers, 0);

        // Call calculate_mcq_score RPC
        const { data: rpcResult } = await mcqService?.calculateMCQScore(userId, electionId, currentAttempt);

        if (rpcResult) {
          const details = Array.isArray(rpcResult) ? rpcResult?.[0] : rpcResult;
          setScoreDetails(details);
          const pct = details?.scorePercentage ?? details?.score_percentage ?? 0;
          setScore(pct);
          const passed = pct >= passingScore;

          // Record attempt
          await mcqService?.recordMCQAttempt(electionId, currentAttempt, pct, passed);
          setShowResults(true);
          return;
        }
      }

      // Fallback: client-side scoring
      let correctCount = 0;
      questions?.forEach(question => {
        if (question?.questionType !== 'free_text' && answers?.[question?.id] === question?.correctAnswer) {
          correctCount++;
        }
      });
      const mcQuestions = questions?.filter(q => q?.questionType !== 'free_text');
      const finalScore = mcQuestions?.length > 0 ? (correctCount / mcQuestions?.length) * 100 : 100;
      setScore(finalScore);
      setScoreDetails({ totalQuestions: mcQuestions?.length, correctAnswers: correctCount, scorePercentage: finalScore });

      if (electionId) {
        await mcqService?.recordMCQAttempt(electionId, currentAttempt, finalScore, finalScore >= passingScore);
      }
      setShowResults(true);
    } catch (err) {
      console.error('MCQ submit error:', err);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
    setScoreDetails(null);
    setValidationError('');
    setCurrentAttempt(prev => prev + 1);
  };

  const handleComplete = () => {
    onComplete?.(answers, score, score >= passingScore);
  };

  const isAnswered = answers?.[currentQuestion?.id] !== undefined && answers?.[currentQuestion?.id] !== '';
  const isRequired = currentQuestion?.isRequired !== false;
  const canProceed = !isRequired || isAnswered;
  const charLimit = currentQuestion?.charLimit || 500;
  const currentFreeTextLength = (answers?.[currentQuestion?.id] || '')?.length;

  if (showResults) {
    const passed = score >= passingScore;
    const attemptsRemaining = maxAttempts - currentAttempt;
    const totalQ = scoreDetails?.totalQuestions ?? scoreDetails?.total_questions ?? totalQuestions;
    const correctA = scoreDetails?.correctAnswers ?? scoreDetails?.correct_answers ?? 0;
    const scorePct = scoreDetails?.scorePercentage ?? scoreDetails?.score_percentage ?? score;

    return (
      <div className="card p-6 md:p-8">
        <div className="text-center space-y-6">
          {/* Attempt indicator */}
          <div className="text-sm text-muted-foreground">
            Attempt {currentAttempt} of {maxAttempts}
          </div>

          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
            passed ? 'bg-success/20' : 'bg-warning/20'
          }`}>
            <Icon
              name={passed ? 'CheckCircle' : 'AlertCircle'}
              size={48}
              color={passed ? 'var(--color-success)' : 'var(--color-warning)'}
            />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
              {passed ? '🎉 Quiz Passed!' : 'Quiz Complete'}
            </h2>
            <div className="space-y-1">
              <p className="text-muted-foreground">
                Score: <strong className="text-foreground">{Math.round(scorePct)}%</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                {correctA} of {totalQ} correct
              </p>
              {passingScore > 0 && (
                <p className="text-sm text-muted-foreground">
                  Passing score: {passingScore}%
                </p>
              )}
            </div>
          </div>

          {passed ? (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                Great job! You've demonstrated sufficient understanding. You can now proceed to cast your vote.
              </p>
            </div>
          ) : (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <p className="text-sm text-foreground">
                {attemptsRemaining > 0
                  ? `You didn't reach the ${passingScore}% passing score. You have ${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining.`
                  : `You've used all ${maxAttempts} attempts.${passingScore > 0 ? ' You can still proceed to vote.' : ''}`
                }
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!passed && attemptsRemaining > 0 && (
              <Button onClick={handleRetry} variant="outline">
                <Icon name="RefreshCw" size={18} />
                Retry Quiz
              </Button>
            )}
            <Button onClick={handleComplete} size="lg">
              Continue to Voting
              <Icon name="ArrowRight" size={20} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Live question banner */}
      {newQuestionBanner && (
        <div className="bg-blue-500 text-white rounded-lg p-3 flex items-center gap-2 animate-pulse">
          <Icon name="Bell" size={16} />
          <span className="text-sm font-medium">New question added!</span>
        </div>
      )}
      <div className="card p-6 md:p-8">
        {/* Header: attempt counter + progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">
                Attempt {currentAttempt} of {maxAttempts}
              </span>
              <span className="text-sm font-data font-semibold text-primary">
                {answeredCount}/{totalQuestions} answered
              </span>
            </div>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question image header */}
        {currentQuestion?.questionImageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-border">
            <img
              src={currentQuestion?.questionImageUrl}
              alt={`Question ${currentQuestionIndex + 1} visual`}
              className="w-full max-h-48 object-cover"
            />
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-start gap-2 mb-4">
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground flex-1">
              {currentQuestion?.questionText}
            </h2>
            {currentQuestion?.isRequired !== false && (
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">Required</span>
            )}
          </div>

          {currentQuestion?.difficulty && (
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-4 ${
              currentQuestion?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              currentQuestion?.difficulty === 'hard'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>
              {currentQuestion?.difficulty}
            </span>
          )}

          {/* Free text input */}
          {currentQuestion?.questionType === 'free_text' ? (
            <div>
              <textarea
                value={answers?.[currentQuestion?.id] || ''}
                onChange={e => handleFreeTextChange(e?.target?.value)}
                placeholder="Type your answer here..."
                maxLength={charLimit}
                rows={5}
                className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">Max {charLimit} characters</span>
                <span className={`text-xs font-medium ${
                  currentFreeTextLength >= charLimit ? 'text-red-500' :
                  currentFreeTextLength >= charLimit * 0.9 ? 'text-orange-500' : 'text-muted-foreground'
                }`}>
                  {currentFreeTextLength}/{charLimit}
                </span>
              </div>
            </div>
          ) : (
            /* Multiple choice options */
            (<div className="space-y-3">
              {currentQuestion?.options?.map((option, index) => {
                const isSelected = answers?.[currentQuestion?.id] === option;
                const optionImageUrl = currentQuestion?.optionImages?.[index];
                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-250 ${
                      isSelected
                        ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50 hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-250 ${
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                      </div>
                      {optionImageUrl && (
                        <img
                          src={optionImageUrl}
                          alt={`Option ${index + 1}`}
                          className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                      )}
                      <span className="text-base md:text-lg text-foreground font-medium flex-1">
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>)
          )}

          {validationError && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm">
              <Icon name="AlertCircle" size={14} />
              {validationError}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestionIndex === 0}
          >
            <Icon name="ArrowLeft" size={20} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isRequired && !isAnswered}
            loading={isSubmitting && currentQuestionIndex === totalQuestions - 1}
          >
            {currentQuestionIndex === totalQuestions - 1 ? 'Submit Quiz' : 'Next Question'}
            <Icon name="ArrowRight" size={20} />
          </Button>
        </div>
      </div>
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-foreground font-medium mb-1">Pre-Voting Knowledge Check</p>
            <p className="text-xs text-muted-foreground">
              Answer all required questions to proceed. Passing score: {passingScore}%. Attempts: {currentAttempt}/{maxAttempts}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQPreVotingQuiz;