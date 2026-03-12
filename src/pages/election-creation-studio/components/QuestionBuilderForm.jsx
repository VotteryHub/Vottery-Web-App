import React from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const QuestionBuilderForm = ({ formData, onChange, errors }) => {
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      options: ['', '']
    };
    onChange('questions', [...formData?.questions, newQuestion]);
  };

  const removeQuestion = (questionId) => {
    onChange('questions', formData?.questions?.filter(q => q?.id !== questionId));
  };

  const updateQuestion = (questionId, field, value) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId ? { ...q, [field]: value } : q
    ));
  };

  const addOption = (questionId) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId ? { ...q, options: [...q?.options, ''] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId
        ? { ...q, options: q?.options?.filter((_, idx) => idx !== optionIndex) }
        : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId
        ? {
            ...q,
            options: q?.options?.map((opt, idx) => idx === optionIndex ? value : opt)
          }
        : q
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
            Questions & Options
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            Add questions and voting options for your election
          </p>
        </div>
        <Button
          variant="outline"
          iconName="Plus"
          iconPosition="left"
          onClick={addQuestion}
        >
          Add Question
        </Button>
      </div>
      {formData?.questions?.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 md:p-12 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="HelpCircle" size={32} className="text-muted-foreground" />
          </div>
          <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-2">
            No questions added yet
          </h4>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Start by adding your first question and voting options
          </p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={addQuestion}
          >
            Add First Question
          </Button>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {formData?.questions?.map((question, qIndex) => (
            <div
              key={question?.id}
              className="card p-4 md:p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm md:text-base font-heading font-semibold text-primary">
                      {qIndex + 1}
                    </span>
                  </div>
                  <Input
                    type="text"
                    placeholder="Enter your question"
                    value={question?.text}
                    onChange={(e) => updateQuestion(question?.id, 'text', e?.target?.value)}
                    error={errors?.[`question_${question?.id}`]}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeQuestion(question?.id)}
                  className="flex-shrink-0"
                >
                  <Icon name="Trash2" size={18} color="var(--color-destructive)" />
                </Button>
              </div>

              <div className="space-y-3 pl-0 md:pl-12">
                <label className="block text-sm font-medium text-foreground">
                  Options <span className="text-destructive">*</span>
                </label>

                {question?.options?.map((option, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-muted-foreground">
                        {String.fromCharCode(65 + oIndex)}
                      </span>
                    </div>
                    <Input
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(question?.id, oIndex, e?.target?.value)}
                    />
                    {question?.options?.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(question?.id, oIndex)}
                        className="flex-shrink-0"
                      >
                        <Icon name="X" size={16} />
                      </Button>
                    )}
                  </div>
                ))}

                {question?.options?.length < 10 && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Plus"
                    iconPosition="left"
                    onClick={() => addOption(question?.id)}
                    className="mt-2"
                  >
                    Add Option
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {errors?.questions && (
        <p className="text-sm text-destructive">{errors?.questions}</p>
      )}
    </div>
  );
};

export default QuestionBuilderForm;