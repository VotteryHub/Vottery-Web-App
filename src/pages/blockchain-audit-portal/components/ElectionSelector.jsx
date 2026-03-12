import React from 'react';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ElectionSelector = ({ selectedElection, onElectionChange, elections }) => {
  const electionOptions = elections?.map(election => ({
    value: election?.id,
    label: election?.title,
    description: `${election?.totalVotes} votes • ${election?.status}`
  }));

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Vote" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Select Election
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Choose an election to audit
          </p>
        </div>
      </div>

      <Select
        label="Election"
        placeholder="Select an election to audit"
        options={electionOptions}
        value={selectedElection}
        onChange={onElectionChange}
        searchable
        required
      />

      {selectedElection && (
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
            <Icon name="Info" size={16} />
            <span>
              Blockchain verification available for this election
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionSelector;