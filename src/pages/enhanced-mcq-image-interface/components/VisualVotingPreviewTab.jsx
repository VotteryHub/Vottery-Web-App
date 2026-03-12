import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const VisualVotingPreviewTab = ({ questions = [] }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const question = questions?.[currentIdx];
  const total = questions?.length;

  if (total === 0) {
    return (
      <div className="text-center py-16">
        <Icon name="Eye" size={48} className="mx-auto mb-4 text-gray-300" />
        <p className="text-muted-foreground">No questions to preview</p>
        <p className="text-sm text-muted-foreground mt-1">Add questions in the Image Option Builder tab</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Question {currentIdx + 1} of {total}</span>
          <span>{Object.keys(selectedAnswers)?.length}/{total} answered</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        {/* Question Image */}
        {question?.questionImageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden border border-border">
            <img
              src={question?.questionImageUrl}
              alt={`Question ${currentIdx + 1}`}
              className="w-full max-h-48 object-cover"
            />
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-xl font-bold text-foreground mb-2">{question?.questionText || 'Question text here'}</h2>

        {question?.difficulty && (
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-4 ${
            question?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
            question?.difficulty === 'hard'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          }`}>
            {question?.difficulty}
          </span>
        )}

        {/* Options with Images */}
        <div className="space-y-3">
          {question?.options?.map((opt, idx) => {
            const imgUrl = question?.optionImages?.[idx];
            const isSelected = selectedAnswers?.[question?.id] === opt;
            return (
              <button
                key={idx}
                onClick={() => setSelectedAnswers(prev => ({ ...prev, [question?.id]: opt }))}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-primary bg-primary' : 'border-gray-400'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                  </div>
                  {imgUrl && (
                    <img
                      src={imgUrl}
                      alt={`Option ${idx + 1}`}
                      className="w-16 h-16 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  )}
                  <span className="text-base font-medium text-foreground">{opt || `Option ${idx + 1}`}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => setCurrentIdx(prev => Math.min(total - 1, prev + 1))}
            disabled={currentIdx === total - 1}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm disabled:opacity-40 hover:bg-primary/90 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualVotingPreviewTab;
