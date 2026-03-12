import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const VerificationInput = ({ onVerify, isVerifying }) => {
  const [voteId, setVoteId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError('');

    if (!voteId?.trim()) {
      setError('Please enter a valid Vote ID');
      return;
    }

    if (voteId?.length < 32) {
      setError('Vote ID must be at least 32 characters');
      return;
    }

    onVerify(voteId);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard?.readText();
      setVoteId(text);
      setError('');
    } catch (err) {
      setError('Failed to paste from clipboard');
    }
  };

  return (
    <div className="card">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon name="ShieldCheck" size={24} color="var(--color-primary)" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-2">
            Verify Your Vote
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Enter your Vote ID to verify your ballot submission on the blockchain. Your vote contents remain private through zero-knowledge proofs.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="Vote ID / Receipt Number"
            type="text"
            placeholder="Enter your cryptographic receipt number (e.g., 0x7a8f9b2c...)"
            value={voteId}
            onChange={(e) => {
              setVoteId(e?.target?.value);
              setError('');
            }}
            error={error}
            required
            description="This is the unique identifier you received after casting your vote"
            className="font-data"
          />
          <button
            type="button"
            onClick={handlePaste}
            className="absolute right-3 top-9 p-2 rounded-lg hover:bg-muted transition-all duration-250"
            title="Paste from clipboard"
          >
            <Icon name="Clipboard" size={18} className="text-muted-foreground" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="submit"
            variant="default"
            loading={isVerifying}
            iconName="Search"
            iconPosition="left"
            fullWidth
            className="sm:flex-1"
          >
            {isVerifying ? 'Verifying...' : 'Verify Vote'}
          </Button>
          <Button
            type="button"
            variant="outline"
            iconName="HelpCircle"
            iconPosition="left"
            onClick={() => window.open('/help/verification', '_blank')}
            className="sm:w-auto"
          >
            How It Works
          </Button>
        </div>
      </form>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Privacy Protected:</span> Verification uses zero-knowledge proofs to confirm your vote was recorded without revealing your choices. Your ballot remains completely anonymous.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationInput;