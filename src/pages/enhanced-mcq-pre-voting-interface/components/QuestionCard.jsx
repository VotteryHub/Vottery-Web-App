import React from 'react';
import Icon from '../../../components/AppIcon';

const QuestionCard = ({ question, answer, onAnswerChange, validationError }) => {
  const charLimit = question?.charLimit || 500;
  const currentLength = (answer || '')?.length;

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Question image */}
      {question?.questionImageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden border border-border">
          <img
            src={question?.questionImageUrl}
            alt="Question visual"
            className="w-full max-h-52 object-cover"
          />
        </div>
      )}
      {/* Question header */}
      <div className="flex items-start gap-2 mb-2">
        <h2 className="text-xl font-heading font-bold text-foreground flex-1">
          {question?.questionText}
        </h2>
        {question?.isRequired !== false && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full flex-shrink-0 mt-1">Required</span>
        )}
      </div>
      {question?.difficulty && (
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full mb-4 ${
          question?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
          question?.difficulty === 'hard'? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {question?.difficulty}
        </span>
      )}
      {/* Free text */}
      {question?.questionType === 'free_text' ? (
        <div>
          <textarea
            value={answer || ''}
            onChange={e => {
              if (e?.target?.value?.length <= charLimit) onAnswerChange(e?.target?.value);
            }}
            placeholder="Type your answer here..."
            maxLength={charLimit}
            rows={5}
            className="w-full px-4 py-3 border-2 border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-muted-foreground">Max {charLimit} characters</span>
            <span className={`text-xs font-medium ${
              currentLength >= charLimit ? 'text-red-500' :
              currentLength >= charLimit * 0.9 ? 'text-orange-500' : 'text-muted-foreground'
            }`}>
              {currentLength}/{charLimit}
            </span>
          </div>
        </div>
      ) : (
        /* Multiple choice */
        (<div className="space-y-3">
          {question?.options?.map((option, index) => {
            const isSelected = answer === option;
            const optionImageUrl = question?.optionImages?.[index];
            return (
              <button
                key={index}
                onClick={() => onAnswerChange(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected ? 'border-primary bg-primary/10' : 'border-border bg-card hover:border-primary/50 hover:bg-muted'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                  }`}>
                    {isSelected && <div className="w-3 h-3 rounded-full bg-white" />}
                  </div>
                  {optionImageUrl && (
                    <img
                      src={optionImageUrl}
                      alt={`Option ${index + 1}`}
                      className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  )}
                  <span className="text-base text-foreground font-medium flex-1">{option}</span>
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
  );
};

export default QuestionCard;
