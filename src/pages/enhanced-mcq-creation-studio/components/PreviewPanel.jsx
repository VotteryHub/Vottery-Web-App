import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const PreviewPanel = ({ questions, config }) => {
  const [previewIndex, setPreviewIndex] = useState(0);
  const [previewAnswers, setPreviewAnswers] = useState({});

  const question = questions?.[previewIndex];
  const total = questions?.length || 0;

  if (total === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Eye" size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-muted-foreground">Add questions to see voter preview</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Voter Preview</h3>
        <p className="text-sm text-muted-foreground">Preview how voters will experience this quiz</p>
      </div>

      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4">
        {/* Mock quiz UI */}
        <div className="bg-card rounded-xl p-5 shadow-sm">
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Question {previewIndex + 1} of {total}</span>
              <span>Attempt 1 of {config?.maxAttempts ?? 3}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${((previewIndex + 1) / total) * 100}%` }} />
            </div>
          </div>

          {/* Question image */}
          {question?.questionImageUrl && (
            <img src={question?.questionImageUrl} alt="Question" className="w-full h-32 object-cover rounded-lg mb-3 border border-border" />
          )}

          {/* Question text */}
          <div className="flex items-start gap-2 mb-3">
            <p className="font-semibold text-foreground flex-1">{question?.questionText || 'Question text...'}</p>
            {question?.isRequired !== false && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">Required</span>}
          </div>

          {question?.difficulty && (
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-3 ${
              question?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question?.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
            }`}>{question?.difficulty}</span>
          )}

          {/* Free text */}
          {question?.questionType === 'free_text' ? (
            <div>
              <textarea
                placeholder="Voter types answer here..."
                rows={3}
                maxLength={question?.charLimit || 500}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm resize-none"
                readOnly
              />
              <p className="text-xs text-muted-foreground mt-1">Max {question?.charLimit || 500} characters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {question?.options?.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setPreviewAnswers(prev => ({ ...prev, [question?.id]: opt }))}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${
                    previewAnswers?.[question?.id] === opt ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      previewAnswers?.[question?.id] === opt ? 'border-primary bg-primary' : 'border-muted-foreground'
                    }`}>
                      {previewAnswers?.[question?.id] === opt && <div className="w-2 h-2 rounded-full bg-white mx-auto mt-0.5" />}
                    </div>
                    {question?.optionImages?.[i] && (
                      <img src={question?.optionImages?.[i]} alt={`Option ${i+1}`} className="w-8 h-8 rounded object-cover flex-shrink-0" />
                    )}
                    <span className="text-foreground">{opt || `Option ${i + 1}`}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setPreviewIndex(p => Math.max(0, p - 1))}
              disabled={previewIndex === 0}
              className="px-4 py-2 border border-border rounded-lg text-sm text-foreground disabled:opacity-40 hover:bg-muted transition-colors"
            >← Previous</button>
            <button
              onClick={() => setPreviewIndex(p => Math.min(total - 1, p + 1))}
              disabled={previewIndex === total - 1}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors disabled:opacity-40"
            >{previewIndex === total - 1 ? 'Submit' : 'Next →'}</button>
          </div>
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">Passing score: {config?.passingScore ?? 70}% · Max attempts: {config?.maxAttempts ?? 3}</p>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
