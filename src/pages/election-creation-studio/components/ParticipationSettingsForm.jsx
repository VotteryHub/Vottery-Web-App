import React, { useState, useCallback } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

import Icon from '../../../components/AppIcon';
import { voterRollsService } from '../../../services/voterRollsService';

const ParticipationSettingsForm = ({ formData, onChange, errors }) => {
  const [voterRollParsed, setVoterRollParsed] = useState([]);
  const [voterRollUploading, setVoterRollUploading] = useState(false);
  const [voterRollMsg, setVoterRollMsg] = useState('');

  const handleVoterRollCSV = useCallback((e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setVoterRollUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = voterRollsService?.parseCSV(ev?.target?.result);
        setVoterRollParsed(parsed);
        onChange('voterRollData', parsed);
        setVoterRollMsg(`${parsed?.length} voter(s) parsed from CSV`);
      } catch (err) {
        setVoterRollMsg('Failed to parse CSV file');
      }
      setVoterRollUploading(false);
    };
    reader?.readAsText(file);
  }, [onChange]);
  const feeStructureOptions = [
    { value: 'free', label: 'Free', description: 'No participation fee' },
    { value: 'paid-general', label: 'Paid General', description: 'Single global fee' },
    { value: 'paid-regional', label: 'Paid Regional', description: 'Zone-based pricing' }
  ];

  const visibilityOptions = [
    { value: 'public', label: 'Public', description: 'Anyone can participate' },
    { value: 'private', label: 'Private (Invite-only)', description: 'Only verified voters on the voter roll can participate' },
    { value: 'group_only', label: 'Group Only', description: 'Restricted to group members' },
    { value: 'country_specific', label: 'Country Specific', description: 'Restricted to selected countries' }
  ];

  const biometricOptions = [
    { value: 'none', label: 'No Biometric Required', description: 'Standard voting without biometric verification' },
    { value: 'fingerprint', label: 'Fingerprint Required', description: 'Requires fingerprint scan (Android/USB scanner)' },
    { value: 'face_id', label: 'Face ID Required', description: 'Requires Face ID (iOS devices)' },
    { value: 'any', label: 'Any Biometric', description: 'Accepts fingerprint or Face ID' }
  ];

  const regionalZones = [
    { id: 'region1', label: 'Region 1: US & Canada', currency: 'USD', multiplier: 1.0 },
    { id: 'region2', label: 'Region 2: Western Europe', currency: 'EUR', multiplier: 0.95 },
    { id: 'region3', label: 'Region 3: Eastern Europe & Russia', currency: 'USD', multiplier: 0.7 },
    { id: 'region4', label: 'Region 4: Africa', currency: 'USD', multiplier: 0.3 },
    { id: 'region5', label: 'Region 5: Latin America & Caribbean', currency: 'USD', multiplier: 0.4 },
    { id: 'region6', label: 'Region 6: Middle East, Asia, Eurasia, Melanesia, Micronesia, Polynesia', currency: 'USD', multiplier: 0.6 },
    { id: 'region7', label: 'Region 7: Australasia (Australia, NZ, Taiwan, S. Korea, Japan, Singapore)', currency: 'AUD', multiplier: 0.85 },
    { id: 'region8', label: 'Region 8: China, Macau & Hong Kong', currency: 'CNY', multiplier: 0.65 }
  ];

  const calculateRegionalPrice = (basePrice, multiplier) => {
    return (parseFloat(basePrice || 0) * multiplier)?.toFixed(2);
  };

  const handleRegionalFeeChange = (regionId, value) => {
    const updatedFees = { ...(formData?.regionalFees || {}), [regionId]: value };
    onChange('regionalFees', updatedFees);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Participation Settings
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure access, fees, biometric requirements, and visibility for your election
        </p>
      </div>
      <Select
        label="Fee Structure"
        description="Choose how participants will be charged"
        options={feeStructureOptions}
        value={formData?.feeStructure}
        onChange={(value) => onChange('feeStructure', value)}
        error={errors?.feeStructure}
        required
      />
      {formData?.feeStructure === 'paid-general' && (
        <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-primary/20">
          <Input
            label="Participation Fee (USD)"
            type="number"
            placeholder="Enter fee amount"
            value={formData?.generalFee}
            onChange={(e) => onChange('generalFee', e?.target?.value)}
            error={errors?.generalFee}
            required
            min={0.01}
            step={0.01}
            description="Single fee applied globally"
          />
        </div>
      )}
      {formData?.feeStructure === 'paid-regional' && (
        <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-primary/20 space-y-4">
          <Input
            label="Base Fee (USD)"
            type="number"
            placeholder="Enter base fee"
            value={formData?.baseFee}
            onChange={(e) => onChange('baseFee', e?.target?.value)}
            error={errors?.baseFee}
            required
            min={0.01}
            step={0.01}
            description="Base price used to calculate regional fees"
          />

          <div className="bg-muted/50 rounded-xl p-4 md:p-6">
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-3 md:mb-4">
              8-Zone Regional Pricing Structure
            </h4>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {regionalZones?.map((zone) => (
                <div
                  key={zone?.id}
                  className="bg-card rounded-lg p-3 md:p-4 border border-border"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <span className="text-xs md:text-sm font-medium text-foreground block mb-1">
                        {zone?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(zone?.multiplier * 100)?.toFixed(0)}% of base price
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg md:text-xl font-heading font-bold text-primary">
                          {calculateRegionalPrice(formData?.baseFee, zone?.multiplier)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {zone?.currency}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Input
                    label="Custom Fee (Optional)"
                    type="number"
                    placeholder={`Auto: ${calculateRegionalPrice(formData?.baseFee, zone?.multiplier)} ${zone?.currency}`}
                    value={formData?.regionalFees?.[zone?.id] || ''}
                    onChange={(e) => handleRegionalFeeChange(zone?.id, e?.target?.value)}
                    min={0.01}
                    step={0.01}
                    description="Override automatic calculation"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Age Verification - Optional, default: No */}
      <div className="border border-border rounded-xl p-4 md:p-6 bg-card/50">
        <h4 className="text-base font-heading font-semibold text-foreground mb-2">
          Age Verification
        </h4>
        <p className="text-xs text-muted-foreground mb-4">
          Optional. Default is &quot;No Age Verification&quot;. When enabled, voters must verify age before voting.
        </p>
        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={formData?.requireAgeVerification || false}
            onChange={(e) => onChange('requireAgeVerification', e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <span className="text-sm font-medium text-foreground">Require Age Verification</span>
        </label>
        {formData?.requireAgeVerification && (
          <div className="space-y-3 pl-7">
            <p className="text-xs text-muted-foreground">Select one or more methods (voters can use any):</p>
            {[
              { value: 'facial', label: 'AI-Powered Facial Age Estimation', desc: 'Privacy-first, no ID required' },
              { value: 'government_id', label: 'Government ID & Biometric Matching', desc: 'High-assurance (passport, driver\'s license)' },
              { value: 'digital_wallet', label: 'Reusable Digital Identity Wallets', desc: 'Yoti Keys, AgeKey – verify once, reuse' }
            ]?.map(m => (
              <label key={m?.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <input
                  type="checkbox"
                  checked={(formData?.ageVerificationMethods || [])?.includes(m?.value)}
                  onChange={(e) => {
                    const current = formData?.ageVerificationMethods || [];
                    const updated = e?.target?.checked
                      ? [...current, m?.value]
                      : current?.filter(x => x !== m?.value);
                    onChange('ageVerificationMethods', updated);
                  }}
                  className="w-4 h-4 text-primary border-border rounded"
                />
                <div>
                  <span className="text-sm font-medium text-foreground">{m?.label}</span>
                  <p className="text-xs text-muted-foreground">{m?.desc}</p>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Unlimited Audience */}
      <div className="border border-border rounded-xl p-4 md:p-6 bg-card/50">
        <h4 className="text-base font-heading font-semibold text-foreground mb-2">
          Audience Size
        </h4>
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData?.unlimitedAudience !== false}
            onChange={(e) => onChange('unlimitedAudience', e?.target?.checked)}
            className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
          />
          <div>
            <span className="text-sm font-medium text-foreground">Unlimited Audience</span>
            <p className="text-xs text-muted-foreground">No cap on number of voters (scale-ready)</p>
          </div>
        </label>
      </div>

      <Select
        label="Biometric Voting Requirement"
        description="Vote without fingerprint (default) or require fingerprint/Face ID scan"
        options={biometricOptions}
        value={formData?.biometricRequired || 'none'}
        onChange={(value) => onChange('biometricRequired', value)}
        error={errors?.biometricRequired}
      />
      {formData?.biometricRequired && formData?.biometricRequired !== 'none' && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 md:p-4">
          <div className="flex gap-3">
            <Icon name="AlertCircle" size={18} className="text-warning flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs md:text-sm text-foreground font-medium">
                Biometric Verification Required
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Voters authenticate using their device&apos;s built-in biometrics (Face ID, Touch ID, Android fingerprint, Windows Hello, or a compatible security key). Vottery never stores raw biometric data – we only receive a secure yes/no from the operating system, and any external USB scanners must be configured at the OS level (no custom drivers).
              </p>
            </div>
          </div>
        </div>
      )}
      <Select
        label="Permission to Vote"
        description="Control who can see and participate in this election"
        options={visibilityOptions}
        value={formData?.permissionType || 'public'}
        onChange={(value) => onChange('permissionType', value)}
        error={errors?.permissionType}
        required
      />
      {formData?.permissionType === 'private' && (
        <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-primary/20 space-y-4">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 md:p-4">
            <div className="flex gap-3">
              <Icon name="Upload" size={18} className="text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-foreground font-medium">
                  Voter Roll Import
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a CSV with columns: email, name. Only voters on this list can participate.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm font-medium text-foreground mb-2 block">Upload Voter Roll CSV</span>
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleVoterRollCSV}
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                aria-label="Upload voter roll CSV file"
              />
            </label>
            {voterRollUploading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Icon name="Loader" size={16} className="animate-spin" />
                <span>Parsing CSV...</span>
              </div>
            )}
            {voterRollMsg && (
              <p className="text-sm text-primary font-medium">{voterRollMsg}</p>
            )}
            {voterRollParsed?.length > 0 && (
              <div className="bg-card border border-border rounded-lg p-3 max-h-48 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-2">
                  Preview ({voterRollParsed?.length} voter{voterRollParsed?.length !== 1 ? 's' : ''}):
                </p>
                <div className="space-y-1">
                  {voterRollParsed?.slice(0, 20)?.map((v, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-foreground">{v?.email}</span>
                      <span className="text-muted-foreground">{v?.name}</span>
                    </div>
                  ))}
                  {voterRollParsed?.length > 20 && (
                    <p className="text-xs text-muted-foreground">...and {voterRollParsed?.length - 20} more</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {formData?.permissionType === 'group_only' && (
        <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-secondary/20 space-y-4">
          <div className="bg-secondary/10 border border-secondary/20 rounded-lg p-3 md:p-4">
            <div className="flex gap-3">
              <Icon name="Users" size={18} className="text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-foreground font-medium">
                  Group-Only Election
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only registered members of your specified group or organization can participate
                </p>
              </div>
            </div>
          </div>

          <Input
            label="Group/Organization ID"
            type="text"
            placeholder="Enter group identifier"
            value={formData?.groupId || ''}
            onChange={(e) => onChange('groupId', e?.target?.value)}
            error={errors?.groupId}
            required
            description="Unique identifier for your group or organization"
          />
        </div>
      )}
      {formData?.permissionType === 'country_specific' && (
        <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-accent/20 space-y-4">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 md:p-4">
            <div className="flex gap-3">
              <Icon name="Globe" size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-foreground font-medium">
                  Country-Specific Election
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Only residents of selected countries can participate in this election
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Allowed Countries <span className="text-destructive">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Enter country codes (ISO 3166-1 alpha-2) separated by commas (e.g., US, CA, GB, AU)
            </p>
            <Input
              type="text"
              placeholder="US, CA, GB, AU, IN"
              value={formData?.allowedCountries || ''}
              onChange={(e) => onChange('allowedCountries', e?.target?.value)}
              error={errors?.allowedCountries}
              required
              description="Comma-separated list of country codes"
            />
          </div>
        </div>
      )}

      {/* NEW: Anonymous Voting Toggle */}
      <div className="border-t border-border pt-6">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">
          Advanced Voting Controls
        </h4>
        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.anonymousVotingEnabled || false}
              onChange={(e) => onChange('anonymousVotingEnabled', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Enable Anonymous Voting</span>
              <p className="text-xs text-muted-foreground">Voters' identities will be hidden from results</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.voterApprovalRequired || false}
              onChange={(e) => onChange('voterApprovalRequired', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Require Voter Approval</span>
              <p className="text-xs text-muted-foreground">Manually approve each voter before they can participate</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.voteEditingAllowed || false}
              onChange={(e) => onChange('voteEditingAllowed', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Allow Vote Editing</span>
              <p className="text-xs text-muted-foreground">Voters can change their vote before election ends</p>
            </div>
          </label>

          {formData?.voteEditingAllowed && (
            <label className="flex items-center gap-3 pl-7">
              <input
                type="checkbox"
                checked={formData?.voteEditingRequiresApproval || false}
                onChange={(e) => onChange('voteEditingRequiresApproval', e?.target?.checked)}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <div>
                <span className="text-sm font-medium text-foreground">Require Approval for Vote Changes</span>
                <p className="text-xs text-muted-foreground">You must approve each vote change request</p>
              </div>
            </label>
          )}

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.otpRequired || false}
              onChange={(e) => onChange('otpRequired', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Require OTP Verification</span>
              <p className="text-xs text-muted-foreground">Send one-time password via email before voting</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.abstentionTrackingEnabled !== false}
              onChange={(e) => onChange('abstentionTrackingEnabled', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Track Abstentions</span>
              <p className="text-xs text-muted-foreground">Record intentional non-votes in results</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.allowNominations || false}
              onChange={(e) => onChange('allowNominations', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Allow Online Nominations</span>
              <p className="text-xs text-muted-foreground">Let voters nominate candidates/products/services for this election</p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData?.allowSpoiledBallots || false}
              onChange={(e) => onChange('allowSpoiledBallots', e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div>
              <span className="text-sm font-medium text-foreground">Allow Spoiled Ballots</span>
              <p className="text-xs text-muted-foreground">Voters can spoil their ballot and re-vote (handled like vote refunds, marked for audit)</p>
            </div>
          </label>
        </div>
      </div>

      {/* NEW: Authentication Methods */}
      <div className="border-t border-border pt-6">
        <h4 className="text-base font-heading font-semibold text-foreground mb-4">
          Authentication Methods
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Select which authentication methods voters can use
        </p>
        <div className="space-y-3">
          {[
            { value: 'email_password', label: 'Email & Password', icon: 'Mail' },
            { value: 'passkey', label: 'Passkey (WebAuthn)', icon: 'Key' },
            { value: 'magic_link', label: 'Magic Link', icon: 'Link' },
            { value: 'oauth', label: 'OAuth (Google/GitHub)', icon: 'Shield' }
          ]?.map(method => (
            <label key={method?.value} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <input
                type="checkbox"
                checked={formData?.allowedAuthMethods?.includes(method?.value) || false}
                onChange={(e) => {
                  const current = formData?.allowedAuthMethods || ['email_password'];
                  const updated = e?.target?.checked
                    ? [...current, method?.value]
                    : current?.filter(m => m !== method?.value);
                  onChange('allowedAuthMethods', updated);
                }}
                className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
              />
              <Icon name={method?.icon} size={18} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{method?.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParticipationSettingsForm;