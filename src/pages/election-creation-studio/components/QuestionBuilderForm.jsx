import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuestionBuilderForm = ({ formData, onChange, errors }) => {
  // ── helpers ──────────────────────────────────────────────────────────────

  const updateQuestions = (updater) => {
    onChange('questions', updater(formData?.questions ?? []));
  };

  const addQuestion = () => {
    updateQuestions((qs) => [
      ...qs,
      { id: Date.now(), text: '', options: ['', ''], optionImages: ['', ''] },
    ]);
  };

  const removeQuestion = (questionId) => {
    updateQuestions((qs) => qs.filter((q) => q?.id !== questionId));
  };

  const updateQuestionText = (questionId, value) => {
    updateQuestions((qs) =>
      qs.map((q) => (q?.id === questionId ? { ...q, text: value } : q))
    );
  };

  // ── THIS was missing — fixes the "can't type in options" bug ──────────────
  const updateOption = (questionId, optionIndex, value) => {
    updateQuestions((qs) =>
      qs.map((q) => {
        if (q?.id !== questionId) return q;
        const options = [...(q?.options ?? [])];
        options[optionIndex] = value;
        return { ...q, options };
      })
    );
  };

  const addOption = (questionId) => {
    updateQuestions((qs) =>
      qs.map((q) => {
        if (q?.id !== questionId) return q;
        if ((q?.options?.length ?? 0) >= 10) return q;
        return {
          ...q,
          options: [...(q?.options ?? []), ''],
          optionImages: [...(q?.optionImages ?? []), ''],
        };
      })
    );
  };

  const removeOption = (questionId, optionIndex) => {
    updateQuestions((qs) =>
      qs.map((q) => {
        if (q?.id !== questionId) return q;
        return {
          ...q,
          options: q?.options?.filter((_, i) => i !== optionIndex),
          optionImages: (q?.optionImages ?? []).filter((_, i) => i !== optionIndex),
        };
      })
    );
  };

  const updateOptionImage = (questionId, optionIndex, imageUrl) => {
    updateQuestions((qs) =>
      qs.map((q) => {
        if (q?.id !== questionId) return q;
        const imgs = [...(q?.optionImages ?? [])];
        imgs[optionIndex] = imageUrl;
        return { ...q, optionImages: imgs };
      })
    );
  };

  const isVisualVoting =
    formData?.votingType === 'mcq-image' || formData?.votingType === 'comparison';
  const isComparison = formData?.votingType === 'comparison';

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-1">
            Questions &amp; Options
          </h3>
          <p className="text-sm text-muted-foreground">
            {isVisualVoting
              ? 'Add images and labels for your visual voting options'
              : 'Add questions and voting options for your election'}
          </p>
        </div>
        {!isComparison && (
          <Button variant="outline" iconName="Plus" iconPosition="left" onClick={addQuestion}>
            Add Question
          </Button>
        )}
      </div>

      {/* Empty state */}
      {(formData?.questions?.length ?? 0) === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="HelpCircle" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-base font-heading font-semibold text-foreground mb-2">
            No questions added yet
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Start by adding your first question and voting options
          </p>
          <Button variant="default" iconName="Plus" iconPosition="left" onClick={addQuestion}>
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {formData?.questions?.map((question, qIndex) => {
            const qError = errors?.[`question_${question?.id}`];
            return (
              <div key={question?.id} className="card p-4 md:p-6 space-y-5">
                {/* Question header */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-sm font-bold text-primary">{qIndex + 1}</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={
                        isComparison
                          ? 'Showdown title (e.g. Which one is better?)'
                          : 'Enter your question'
                      }
                      value={question?.text ?? ''}
                      onChange={(e) => updateQuestionText(question?.id, e.target.value)}
                      error={qError}
                    />
                    {qError && (
                      <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                        <Icon name="AlertCircle" size={12} />
                        {qError}
                      </p>
                    )}
                  </div>
                  {!isComparison && (
                    <button
                      onClick={() => removeQuestion(question?.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
                      title="Remove question"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  )}
                </div>

                {/* Options */}
                <div className="pl-12 space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    Options <span className="text-destructive">*</span>
                    <span className="text-muted-foreground text-xs ml-2">
                      ({question?.options?.length ?? 0}/10)
                    </span>
                  </p>

                  {question?.options?.map((option, oIndex) => (
                    <div
                      key={oIndex}
                      className={`flex gap-3 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/30 transition-colors ${
                        isVisualVoting ? 'flex-col' : 'items-center'
                      }`}
                    >
                      {/* Option letter badge */}
                      {!isVisualVoting && (
                        <div className="w-7 h-7 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-primary">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                        </div>
                      )}

                      {/* Visual voting: image upload */}
                      {isVisualVoting && (
                        <div className="relative w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border overflow-hidden">
                          {question?.optionImages?.[oIndex] ? (
                            <img
                              src={question.optionImages[oIndex]}
                              className="w-full h-full object-cover"
                              alt={`Option ${oIndex + 1}`}
                            />
                          ) : (
                            <>
                              <Icon name="Image" size={24} className="text-muted-foreground mb-1" />
                              <span className="text-[10px] text-muted-foreground font-bold uppercase">
                                Upload Image
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) updateOptionImage(question.id, oIndex, URL.createObjectURL(file));
                            }}
                          />
                        </div>
                      )}

                      {/* Text input */}
                      <Input
                        type="text"
                        placeholder={isVisualVoting ? `Option ${oIndex + 1} label` : `Option ${oIndex + 1}`}
                        value={option ?? ''}
                        onChange={(e) => updateOption(question?.id, oIndex, e.target.value)}
                        className="flex-1"
                      />

                      {/* Remove option (only if >2) */}
                      {(question?.options?.length ?? 0) > 2 && !isComparison && (
                        <button
                          onClick={() => removeOption(question?.id, oIndex)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all flex-shrink-0"
                          title="Remove option"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add option button */}
                  {!isComparison && (question?.options?.length ?? 0) < 10 && (
                    <button
                      onClick={() => addOption(question?.id)}
                      className="w-full py-2.5 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <Icon name="Plus" size={16} />
                      Add Option
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {errors?.questions && (
        <p className="text-sm text-destructive flex items-center gap-1.5">
          <Icon name="AlertCircle" size={14} />
          {errors.questions}
        </p>
      )}
    </div>
  );
};

export default QuestionBuilderForm;