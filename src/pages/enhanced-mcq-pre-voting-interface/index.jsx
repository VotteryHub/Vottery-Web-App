import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import AttemptTracker from './components/AttemptTracker';
import QuestionCard from './components/QuestionCard';
import ScoreDisplay from './components/ScoreDisplay';
import mcqService from '../../services/mcqService';
import { supabase } from '../../lib/supabase';

const EnhancedMCQPreVotingInterface = () => {
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('electionId') || 'demo-election-id';

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [scoreDetails, setScoreDetails] = useState(null);
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [maxAttempts] = useState(3);
  const [passingScore] = useState(70);
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newQuestionBanner, setNewQuestionBanner] = useState(false);

  useEffect(() => {
    loadQuestions();
    loadAttempts();
  }, [electionId]);

  useEffect(() => {
    const unsubscribe = mcqService?.streamLiveQuestions(electionId, (newQ) => {
      setNewQuestionBanner(true);
      setQuestions(prev => [...prev, newQ]);
      setTimeout(() => setNewQuestionBanner(false), 5000);
    });
    return unsubscribe;
  }, [electionId]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await mcqService?.getMCQQuestions(electionId);
      if (data?.length > 0) {
        setQuestions(data);
      } else {
        // Demo questions for preview
        setQuestions([
          {
            id: 'demo-1',
            questionText: 'What is the primary purpose of this election?',
            questionType: 'multiple_choice',
            options: ['Select a representative', 'Approve a budget', 'Choose a policy', 'All of the above'],
            correctAnswer: 'All of the above',
            correctAnswerIndex: 3,
            difficulty: 'easy',
            isRequired: true,
            questionImageUrl: null,
            optionImages: {}
          },
          {
            id: 'demo-2',
            questionText: 'How many candidates are running in this election?',
            questionType: 'multiple_choice',
            options: ['2', '3', '4', '5'],
            correctAnswer: '3',
            correctAnswerIndex: 1,
            difficulty: 'medium',
            isRequired: true,
            questionImageUrl: null,
            optionImages: {}
          },
          {
            id: 'demo-3',
            questionText: 'In your own words, what qualities do you value most in a candidate?',
            questionType: 'free_text',
            options: [],
            correctAnswer: '',
            difficulty: 'medium',
            isRequired: false,
            charLimit: 500,
            questionImageUrl: null,
            optionImages: {}
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadAttempts = async () => {
    const { data } = await mcqService?.getVoterAttempts(electionId);
    if (data?.length > 0) {
      setCurrentAttempt(data?.length + 1);
    }
  };

  const currentQuestion = questions?.[currentIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const answeredCount = Object.keys(answers)?.filter(k => answers?.[k] !== '')?.length;

  const handleAnswerChange = (value) => {
    setValidationError('');
    setAnswers(prev => ({ ...prev, [currentQuestion?.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = async () => {
    // Pre-submit validation
    const unansweredRequired = questions?.filter(q =>
      (q?.isRequired !== false) && (!answers?.[q?.id] || answers?.[q?.id] === '')
    );
    if (unansweredRequired?.length > 0) {
      const idx = questions?.findIndex(q => q?.id === unansweredRequired?.[0]?.id);
      setCurrentIndex(idx);
      setValidationError('This question is required. Please provide an answer.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit free-text answers
      for (const q of questions || []) {
        if (q?.questionType === 'free_text' && answers?.[q?.id]) {
          await mcqService?.submitFreeTextAnswer(electionId, q?.id, answers?.[q?.id]);
        }
      }

      // Get current user
      const { data: { user } } = await supabase?.auth?.getUser();
      const userId = user?.id;

      if (userId) {
        await mcqService?.submitMCQResponse(electionId, userId, answers, 0);

        // Call calculate_mcq_score RPC
        const { data: rpcResult } = await mcqService?.calculateMCQScore(userId, electionId, currentAttempt);
        if (rpcResult) {
          const details = Array.isArray(rpcResult) ? rpcResult?.[0] : rpcResult;
          const pct = details?.scorePercentage ?? details?.score_percentage ?? 0;
          setScoreDetails(details);
          await mcqService?.recordMCQAttempt(electionId, currentAttempt, pct, pct >= passingScore);
          setShowResults(true);
          return;
        }
      }

      // Fallback client-side scoring
      const mcQs = questions?.filter(q => q?.questionType !== 'free_text');
      const correct = mcQs?.filter(q => answers?.[q?.id] === q?.correctAnswer)?.length || 0;
      const pct = mcQs?.length > 0 ? (correct / mcQs?.length) * 100 : 100;
      setScoreDetails({ totalQuestions: mcQs?.length, correctAnswers: correct, scorePercentage: pct });
      if (userId) await mcqService?.recordMCQAttempt(electionId, currentAttempt, pct, pct >= passingScore);
      setShowResults(true);
    } catch (err) {
      console.error('Submit error:', err);
      setShowResults(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
    setScoreDetails(null);
    setValidationError('');
    setCurrentAttempt(prev => prev + 1);
  };

  const handleContinue = () => {
    const score = scoreDetails?.scorePercentage ?? scoreDetails?.score_percentage ?? 0;
    alert(`Quiz complete! Score: ${Math.round(score)}%. Proceeding to voting...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader" size={40} className="animate-spin text-primary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-heading font-bold text-foreground">Pre-Voting Knowledge Check</h1>
          <p className="text-sm text-muted-foreground">Answer all required questions to proceed to voting</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {/* Live question banner */}
        {newQuestionBanner && (
          <div className="bg-blue-500 text-white rounded-xl p-3 flex items-center gap-2 animate-pulse">
            <Icon name="Bell" size={18} />
            <span className="font-medium">New question added!</span>
          </div>
        )}

        {showResults ? (
          <ScoreDisplay
            scoreDetails={scoreDetails}
            passingScore={passingScore}
            currentAttempt={currentAttempt}
            maxAttempts={maxAttempts}
            onRetry={handleRetry}
            onContinue={handleContinue}
          />
        ) : (
          <>
            {/* Attempt tracker */}
            <AttemptTracker
              currentAttempt={currentAttempt}
              maxAttempts={maxAttempts}
              passingScore={passingScore}
            />

            {/* Progress */}
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="text-sm text-muted-foreground">
                  {answeredCount}/{totalQuestions} answered
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                answer={answers?.[currentQuestion?.id]}
                onAnswerChange={handleAnswerChange}
                validationError={validationError}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-5 py-3 border border-border rounded-xl text-foreground hover:bg-muted transition-colors disabled:opacity-40"
              >
                <Icon name="ArrowLeft" size={18} />
                Previous
              </button>

              <button
                onClick={handleNext}
                disabled={(currentQuestion?.isRequired !== false) && (!answers?.[currentQuestion?.id] || answers?.[currentQuestion?.id] === '') || isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Icon name="Loader" size={18} className="animate-spin" />Submitting...</>
                ) : currentIndex === totalQuestions - 1 ? (
                  <>Submit Quiz <Icon name="CheckCircle" size={18} /></>
                ) : (
                  <>Next <Icon name="ArrowRight" size={18} /></>
                )}
              </button>
            </div>

            {/* Info bar */}
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  Required questions must be answered. Passing score: <strong>{passingScore}%</strong>. You have <strong>{maxAttempts - currentAttempt + 1}</strong> attempt{maxAttempts - currentAttempt + 1 !== 1 ? 's' : ''} remaining.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedMCQPreVotingInterface;
