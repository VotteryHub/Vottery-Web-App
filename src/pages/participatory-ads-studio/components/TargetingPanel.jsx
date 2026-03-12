import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const TargetingPanel = ({ formData, onChange, errors }) => {
  const ageRanges = [
    { value: '18-24', label: '18-24 years' },
    { value: '25-34', label: '25-34 years' },
    { value: '35-44', label: '35-44 years' },
    { value: '45-54', label: '45-54 years' },
    { value: '55-64', label: '55-64 years' },
    { value: '65+', label: '65+ years' }
  ];

  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non_binary', label: 'Non-binary' },
    { value: 'prefer_not_say', label: 'Prefer not to say' }
  ];

  const geographicRegions = [
    { value: 'us', label: 'United States', description: 'Zone 1 - High purchasing power' },
    { value: 'europe', label: 'Europe', description: 'Zone 2 - High purchasing power' },
    { value: 'canada', label: 'Canada', description: 'Zone 3 - High purchasing power' },
    { value: 'australia', label: 'Australia/NZ', description: 'Zone 4 - High purchasing power' },
    { value: 'asia_developed', label: 'Developed Asia', description: 'Zone 5 - Medium-high purchasing power' },
    { value: 'latin_america', label: 'Latin America', description: 'Zone 6 - Medium purchasing power' },
    { value: 'asia_emerging', label: 'Emerging Asia', description: 'Zone 7 - Medium-low purchasing power' },
    { value: 'africa', label: 'Africa', description: 'Zone 8 - Low purchasing power' }
  ];

  const interestCategories = [
    'Technology & Innovation',
    'Fashion & Beauty',
    'Food & Cooking',
    'Travel & Adventure',
    'Health & Fitness',
    'Entertainment & Media',
    'Sports & Recreation',
    'Business & Finance',
    'Education & Learning',
    'Arts & Culture',
    'Gaming & Esports',
    'Sustainability & Environment'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Target" size={20} color="var(--color-warning)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Audience Targeting</h3>
          <p className="text-sm text-muted-foreground">Define who will see your sponsored election</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Select
          label="Age Range"
          description="Target specific age demographics"
          multiple
          searchable
          options={ageRanges}
          value={formData?.ageRange}
          onChange={(value) => onChange('ageRange', value)}
          error={errors?.ageRange}
        />

        <Select
          label="Gender"
          description="Select target gender demographics"
          options={genderOptions}
          value={formData?.gender}
          onChange={(value) => onChange('gender', value)}
          error={errors?.gender}
        />
      </div>
      <Select
        label="Geographic Regions"
        description="Select regions based on purchasing power zones"
        multiple
        searchable
        required
        options={geographicRegions}
        value={formData?.regions}
        onChange={(value) => onChange('regions', value)}
        error={errors?.regions}
      />
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Interest Categories</label>
        <p className="text-xs text-muted-foreground">Select interests that align with your campaign</p>
        
        <CheckboxGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {interestCategories?.map((interest) => (
              <Checkbox
                key={interest}
                label={interest}
                checked={formData?.interests?.includes(interest)}
                onChange={(e) => {
                  const currentInterests = formData?.interests || [];
                  const updatedInterests = e?.target?.checked
                    ? [...currentInterests, interest]
                    : currentInterests?.filter(i => i !== interest);
                  onChange('interests', updatedInterests);
                }}
              />
            ))}
          </div>
        </CheckboxGroup>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground">Advanced Targeting (Optional)</label>
          <p className="text-xs text-muted-foreground mb-3">Refine your audience with additional parameters</p>
        </div>

        <Input
          label="Custom Keywords"
          type="text"
          placeholder="Enter comma-separated keywords (e.g., sustainable, organic, eco-friendly)"
          description="Target users interested in specific topics"
          value={formData?.keywords}
          onChange={(e) => onChange('keywords', e?.target?.value)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Input
            label="Minimum Voting History"
            type="number"
            placeholder="0"
            description="Target users with at least this many past votes"
            value={formData?.minVotingHistory}
            onChange={(e) => onChange('minVotingHistory', e?.target?.value)}
          />

          <Input
            label="Engagement Score Minimum"
            type="number"
            placeholder="0"
            description="Target highly engaged users (0-100 scale)"
            value={formData?.minEngagement}
            onChange={(e) => onChange('minEngagement', e?.target?.value)}
          />
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 md:p-6">
        <div className="flex items-start gap-3 mb-4">
          <Icon name="Users" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-base font-heading font-semibold text-foreground">Estimated Reach</h4>
            <p className="text-sm text-muted-foreground">Based on your targeting parameters</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-heading font-bold text-primary">2.4M</p>
            <p className="text-xs text-muted-foreground mt-1">Total Reach</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-heading font-bold text-success">18-35%</p>
            <p className="text-xs text-muted-foreground mt-1">Est. Engagement</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-heading font-bold text-warning">480K</p>
            <p className="text-xs text-muted-foreground mt-1">Expected Votes</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-heading font-bold text-secondary">92</p>
            <p className="text-xs text-muted-foreground mt-1">Relevance Score</p>
          </div>
        </div>
      </div>
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="TrendingUp" size={18} className="text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Targeting Optimization Tips</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Broader targeting increases reach but may reduce engagement quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Multiple geographic zones require adjusted pricing per zone</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Interest-based targeting typically yields 2-3x higher engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TargetingPanel;