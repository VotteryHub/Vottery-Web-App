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

  const isVisualVoting = formData?.votingType === 'mcq-image' || formData?.votingType === 'comparison';

  const updateOptionImage = (questionId, optionIndex, imageUrl) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId
        ? {
            ...q,
            optionImages: (q?.optionImages || []).map((img, idx) => idx === optionIndex ? imageUrl : img)
          }
        : q
    ));
  };

  const addOption = (questionId) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId 
        ? { 
            ...q, 
            options: [...q?.options, ''],
            optionImages: [...(q?.optionImages || []), '']
          } 
        : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    onChange('questions', formData?.questions?.map(q =>
      q?.id === questionId
        ? { 
            ...q, 
            options: q?.options?.filter((_, idx) => idx !== optionIndex),
            optionImages: (q?.optionImages || [])?.filter((_, idx) => idx !== optionIndex)
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
            {isVisualVoting ? 'Add images and labels for your visual voting options' : 'Add questions and voting options for your election'}
          </p>
        </div>
        {formData?.votingType !== 'comparison' && (
          <Button
            variant="outline"
            iconName="Plus"
            iconPosition="left"
            onClick={addQuestion}
          >
            Add Question
          </Button>
        )}
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
                    placeholder={formData?.votingType === 'comparison' ? "Showdown Title (e.g. Which one is better?)" : "Enter your question"}
                    value={question?.text}
                    onChange={(e) => updateQuestion(question?.id, 'text', e?.target?.value)}
                    error={errors?.[`question_${question?.id}`]}
                  />
                </div>
                {formData?.votingType !== 'comparison' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(question?.id)}
                    className="flex-shrink-0"
                  >
                    <Icon name="Trash2" size={18} color="var(--color-destructive)" />
                  </Button>
                )}
              </div>

              <div className={`grid gap-4 pl-0 md:pl-12 ${isVisualVoting ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                <label className="col-span-full block text-sm font-medium text-foreground">
                  Options <span className="text-destructive">*</span>
                </label>

                {question?.options?.map((option, oIndex) => (
                  <div key={oIndex} className={`space-y-2 p-4 rounded-xl border border-border bg-muted/30 ${isVisualVoting ? 'flex flex-col' : 'flex items-center gap-2 md:gap-3'}`}>
                    {isVisualVoting ? (
                      <>
                        <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-border overflow-hidden relative">
                          {question?.optionImages?.[oIndex] ? (
                            <img src={question?.optionImages?.[oIndex]} className="w-full h-full object-cover" />
                          ) : (
                            <>
                              <Icon name="Image" size={24} className="text-muted-foreground mb-1" />
                              <span className="text-[10px] text-muted-foreground font-bold uppercase">Upload Option Image</span>
                            </>
                          )}
                          <input 
                            type="file" 
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                // Mock upload
                                updateOptionImage(question.id, oIndex, URL.createObjectURL(file));
                              }
                            }}
                          />
                        </div>
                        <Input
                          type="text"
                          placeholder={`Option ${oIndex + 1} Label`}
                          value={option}
                          onChange={(e) => updateOption(question?.id, oIndex, e?.target?.value)}
                        />
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                    
                    {question?.options?.length > 2 && formData?.votingType !== 'comparison' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(question?.id, oIndex)}
                        className="self-end text-destructive"
                      >
                        <Icon name="Trash2" size={14} /> Remove
                      </Button>
                    )}
                  </div>
                ))}

                {!isVisualVoting && question?.options?.length < 10 && (
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

                {isVisualVoting && formData?.votingType !== 'comparison' && question?.options?.length < 10 && (
                   <button
                    onClick={() => addOption(question?.id)}
                    className="aspect-video border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-colors"
                   >
                     <Icon name="Plus" size={24} className="text-muted-foreground mb-1" />
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">Add Another Image Option</span>
                   </button>
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