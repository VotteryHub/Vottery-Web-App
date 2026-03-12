import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const VotingConfigurationForm = ({ formData, onChange, errors }) => {
  const votingTypeOptions = [
    {
      value: 'plurality',
      label: 'Plurality Voting',
      description: 'One vote per voter, most votes wins'
    },
    {
      value: 'ranked-choice',
      label: 'Ranked Choice Voting',
      description: 'Voters rank candidates by preference'
    },
    {
      value: 'approval',
      label: 'Approval Voting',
      description: 'Voters approve multiple candidates'
    },
    {
      value: 'plus-minus',
      label: 'Plus-Minus Voting',
      description: 'Rate each option +1/0/-1 for nuanced scoring'
    }
  ];

  const getVotingTypeDescription = (type) => {
    const descriptions = {
      'plurality': 'Each voter selects one option. The option with the most votes wins. Simple and straightforward.',
      'ranked-choice': 'Voters rank options in order of preference. If no option gets majority, lowest-ranked options are eliminated and votes redistributed until a winner emerges.',
      'approval': 'Voters can approve as many options as they like. The option with the most approvals wins. Reduces strategic voting.',
      'plus-minus': 'Voters rate each option with +1 (positive), 0 (neutral), or -1 (negative). The option with the highest weighted average score wins. Captures nuanced preferences and reduces strategic voting.'
    };
    return descriptions?.[type] || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Voting Configuration
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Choose the voting method that best suits your election
        </p>
      </div>
      <Select
        label="Voting Type"
        description="Select how voters will cast their votes"
        options={votingTypeOptions}
        value={formData?.votingType}
        onChange={(value) => onChange('votingType', value)}
        error={errors?.votingType}
        required
      />
      {formData?.votingType && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6">
          <div className="flex gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-2">
                {votingTypeOptions?.find(opt => opt?.value === formData?.votingType)?.label}
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {getVotingTypeDescription(formData?.votingType)}
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {votingTypeOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => onChange('votingType', option?.value)}
            className={`p-4 md:p-5 rounded-xl border-2 transition-all duration-250 text-left ${
              formData?.votingType === option?.value
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                formData?.votingType === option?.value
                  ? 'border-primary bg-primary' :'border-muted-foreground'
              }`}>
                {formData?.votingType === option?.value && (
                  <Icon name="Check" size={14} color="white" />
                )}
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-foreground">
                  {option?.label}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {option?.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotingConfigurationForm;