import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ElectionSetupForm = ({ formData, onChange, errors }) => {
  const [questions, setQuestions] = useState(formData?.questions || []);

  const electionTypes = [
    { value: 'market_research', label: 'Market Research Questions', description: 'Multiple choice questions for consumer insights' },
    { value: 'hype_prediction', label: 'Hype Prediction Topics', description: 'Gauge interest in upcoming products/trends' },
    { value: 'csr_voting', label: 'CSR Voting Initiative', description: 'Let users vote on social responsibility actions' }
  ];

  const votingMethods = [
    { value: 'plurality', label: 'Plurality Voting', description: 'One vote per participant' },
    { value: 'ranked_choice', label: 'Ranked Choice', description: 'Rank options by preference' },
    { value: 'approval', label: 'Approval Voting', description: 'Select all acceptable options' }
  ];

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      text: '',
      options: ['', ''],
      required: true
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  const removeQuestion = (id) => {
    const updatedQuestions = questions?.filter(q => q?.id !== id);
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  const updateQuestion = (id, field, value) => {
    const updatedQuestions = questions?.map(q => 
      q?.id === id ? { ...q, [field]: value } : q
    );
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  const addOption = (questionId) => {
    const updatedQuestions = questions?.map(q => 
      q?.id === questionId ? { ...q, options: [...q?.options, ''] } : q
    );
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  const removeOption = (questionId, optionIndex) => {
    const updatedQuestions = questions?.map(q => 
      q?.id === questionId ? { ...q, options: q?.options?.filter((_, i) => i !== optionIndex) } : q
    );
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  const updateOption = (questionId, optionIndex, value) => {
    const updatedQuestions = questions?.map(q => 
      q?.id === questionId ? {
        ...q,
        options: q?.options?.map((opt, i) => i === optionIndex ? value : opt)
      } : q
    );
    setQuestions(updatedQuestions);
    onChange('questions', updatedQuestions);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
          <Icon name="Vote" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Sponsored Election Setup</h3>
          <p className="text-sm text-muted-foreground">Configure your voting questions and options</p>
        </div>
      </div>
      <Select
        label="Election Type"
        description="Choose the format that best suits your campaign goals"
        required
        options={electionTypes}
        value={formData?.electionType}
        onChange={(value) => onChange('electionType', value)}
        error={errors?.electionType}
      />
      <Select
        label="Voting Method"
        description="Select how participants will cast their votes"
        required
        options={votingMethods}
        value={formData?.votingMethod}
        onChange={(value) => onChange('votingMethod', value)}
        error={errors?.votingMethod}
      />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground">Questions & Options</h4>
            <p className="text-sm text-muted-foreground">Add questions for participants to vote on</p>
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

        {questions?.length === 0 ? (
          <div className="bg-muted/50 rounded-lg p-8 text-center">
            <Icon name="FileQuestion" size={48} className="mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-4">No questions added yet</p>
            <Button variant="default" iconName="Plus" onClick={addQuestion}>
              Add Your First Question
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {questions?.map((question, qIndex) => (
              <div key={question?.id} className="bg-card border border-border rounded-lg p-4 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Input
                      label={`Question ${qIndex + 1}`}
                      type="text"
                      placeholder="Enter your question"
                      required
                      value={question?.text}
                      onChange={(e) => updateQuestion(question?.id, 'text', e?.target?.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    iconName="Trash2"
                    onClick={() => removeQuestion(question?.id)}
                    className="mt-6"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Answer Options</label>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => addOption(question?.id)}
                    >
                      Add Option
                    </Button>
                  </div>

                  {question?.options?.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-3">
                      <div className="flex-1">
                        <Input
                          type="text"
                          placeholder={`Option ${oIndex + 1}`}
                          value={option}
                          onChange={(e) => updateOption(question?.id, oIndex, e?.target?.value)}
                        />
                      </div>
                      {question?.options?.length > 2 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          iconName="X"
                          onClick={() => removeOption(question?.id, oIndex)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <Checkbox
                  label="Required question"
                  description="Participants must answer this question"
                  checked={question?.required}
                  onChange={(e) => updateQuestion(question?.id, 'required', e?.target?.checked)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Lightbulb" size={18} className="text-accent mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Question Design Tips</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Keep questions clear and unbiased to get accurate insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Provide 3-5 options for optimal engagement and decision-making</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-1">•</span>
                <span>Use ranked choice voting for preference-based questions</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElectionSetupForm;