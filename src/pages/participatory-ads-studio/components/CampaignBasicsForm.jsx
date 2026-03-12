import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const CampaignBasicsForm = ({ formData, onChange, errors }) => {
  const campaignObjectives = [
    { value: 'market_research', label: 'Market Research', description: 'Gather consumer insights and feedback' },
    { value: 'brand_awareness', label: 'Brand Awareness', description: 'Increase brand visibility and recognition' },
    { value: 'product_launch', label: 'Product Launch', description: 'Generate buzz for new product releases' },
    { value: 'csr_initiative', label: 'CSR Initiative', description: 'Promote corporate social responsibility' },
    { value: 'hype_prediction', label: 'Hype Prediction', description: 'Gauge interest in upcoming trends' },
    { value: 'customer_feedback', label: 'Customer Feedback', description: 'Collect product improvement suggestions' }
  ];

  const campaignCategories = [
    { value: 'technology', label: 'Technology & Electronics' },
    { value: 'fashion', label: 'Fashion & Apparel' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'health_wellness', label: 'Health & Wellness' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'travel', label: 'Travel & Hospitality' },
    { value: 'education', label: 'Education & Training' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileText" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Campaign Basics</h3>
          <p className="text-sm text-muted-foreground">Essential information about your sponsored election</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Input
          label="Brand Name"
          type="text"
          placeholder="Enter your brand or organization name"
          description="This will be displayed as the campaign sponsor"
          required
          value={formData?.brandName}
          onChange={(e) => onChange('brandName', e?.target?.value)}
          error={errors?.brandName}
        />

        <Input
          label="Campaign Title"
          type="text"
          placeholder="Create an engaging campaign title"
          description="Keep it concise and attention-grabbing"
          required
          value={formData?.campaignTitle}
          onChange={(e) => onChange('campaignTitle', e?.target?.value)}
          error={errors?.campaignTitle}
        />
      </div>
      <Select
        label="Campaign Objective"
        description="Select the primary goal of your sponsored election"
        required
        options={campaignObjectives}
        value={formData?.objective}
        onChange={(value) => onChange('objective', value)}
        error={errors?.objective}
      />
      <Select
        label="Campaign Category"
        description="Choose the industry category that best fits your campaign"
        required
        options={campaignCategories}
        value={formData?.category}
        onChange={(value) => onChange('category', value)}
        error={errors?.category}
      />
      <div>
        <Input
          label="Campaign Description"
          type="text"
          placeholder="Describe your campaign objectives and what participants can expect"
          description="Provide clear context for voters (max 500 characters)"
          required
          value={formData?.description}
          onChange={(e) => onChange('description', e?.target?.value)}
          error={errors?.description}
        />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {formData?.description?.length || 0}/500 characters
          </span>
          {formData?.description?.length > 500 && (
            <span className="text-destructive flex items-center gap-1">
              <Icon name="AlertCircle" size={14} />
              Character limit exceeded
            </span>
          )}
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Campaign Best Practices</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Use clear, concise language that resonates with your target audience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Align your objective with measurable outcomes for better ROI tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Choose categories that accurately represent your brand for better targeting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignBasicsForm;