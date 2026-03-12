import React, { useState } from 'react';
import { CheckCircle, XCircle, Zap, HelpCircle } from 'lucide-react';

const InFeedMiniGame = ({ type, question, options, correctAnswer, vpReward, onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    
    setIsSubmitted(true);
    setShowResult(true);

    const isCorrect = type === 'quiz' ? selectedAnswer === correctAnswer : true;
    
    setTimeout(() => {
      if (onComplete) {
        onComplete(isCorrect);
      }
    }, 1500);
  };

  const getResultIcon = () => {
    if (type === 'poll') return <CheckCircle className="w-6 h-6 text-green-600" />;
    return selectedAnswer === correctAnswer
      ? <CheckCircle className="w-6 h-6 text-green-600" />
      : <XCircle className="w-6 h-6 text-red-600" />;
  };

  const getResultMessage = () => {
    if (type === 'poll') return `Thanks for voting! +${vpReward} VP`;
    return selectedAnswer === correctAnswer
      ? `Correct! +${vpReward} VP`
      : `Not quite! +5 VP for trying`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-purple-200 dark:border-purple-800 p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-2">
            {type === 'poll' ? (
              <HelpCircle className="w-5 h-5 text-purple-600" />
            ) : (
              <Zap className="w-5 h-5 text-purple-600" />
            )}
          </div>
          <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">
            {type === 'poll' ? 'Quick Poll' : 'Quiz Challenge'}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3 text-yellow-600" />
          <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">{vpReward} VP</span>
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{question}</h3>
      {!isSubmitted ? (
        <div className="space-y-2">
          {options?.map((option, index) => (
            <button
              key={index}
              onClick={() => setSelectedAnswer(option)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{option}</span>
            </button>
          ))}
          <button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div className="text-center py-6">
          {showResult && (
            <div className="animate-bounce-in">
              {getResultIcon()}
              <p className="mt-3 font-semibold text-gray-900 dark:text-white">{getResultMessage()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InFeedMiniGame;