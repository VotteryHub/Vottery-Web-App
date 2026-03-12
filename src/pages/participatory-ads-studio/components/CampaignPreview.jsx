import React from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CampaignPreview = ({ formData, onEdit }) => {
  const formatCurrency = (amount, zone = 'us') => {
    const value = parseFloat(amount) || 0;
    return `$${value?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  const getObjectiveLabel = (value) => {
    const objectives = {
      market_research: 'Market Research',
      brand_awareness: 'Brand Awareness',
      product_launch: 'Product Launch',
      csr_initiative: 'CSR Initiative',
      hype_prediction: 'Hype Prediction',
      customer_feedback: 'Customer Feedback'
    };
    return objectives?.[value] || value;
  };

  const getElectionTypeLabel = (value) => {
    const types = {
      market_research: 'Market Research Questions',
      hype_prediction: 'Hype Prediction Topics',
      csr_voting: 'CSR Voting Initiative'
    };
    return types?.[value] || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Eye" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Campaign Preview</h3>
          <p className="text-sm text-muted-foreground">Review how your sponsored election will appear</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {formData?.coverImage && (
          <div className="relative h-48 md:h-64 overflow-hidden">
            <Image
              src={formData?.coverImage}
              alt="Campaign cover image preview showing promotional visual for sponsored election"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Icon name="Sparkles" size={14} />
                Sponsored
              </div>
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-start gap-4">
            {formData?.brandLogo && (
              <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                <Image
                  src={formData?.brandLogo}
                  alt="Brand logo preview showing company branding and identity"
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="text-lg md:text-xl font-heading font-bold text-foreground mb-1">
                {formData?.campaignTitle || 'Campaign Title'}
              </h4>
              <p className="text-sm text-muted-foreground">
                by {formData?.brandName || 'Brand Name'}
              </p>
            </div>
          </div>

          <p className="text-sm md:text-base text-foreground">
            {formData?.description || 'Campaign description will appear here...'}
          </p>

          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
              {getObjectiveLabel(formData?.objective)}
            </div>
            <div className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium">
              {getElectionTypeLabel(formData?.electionType)}
            </div>
            {formData?.enableGamification && (
              <div className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium flex items-center gap-1">
                <Icon name="Trophy" size={12} />
                Prize Pool: {formatCurrency(formData?.prizePool)}
              </div>
            )}
          </div>

          {formData?.questions && formData?.questions?.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground">Sample Question:</p>
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium text-foreground">
                  {formData?.questions?.[0]?.text || 'Question text'}
                </p>
                <div className="space-y-2">
                  {formData?.questions?.[0]?.options?.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border hover:border-primary transition-all duration-250 cursor-pointer"
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
                      <span className="text-sm text-foreground">{option || `Option ${index + 1}`}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button variant="default" fullWidth iconName="Vote" iconPosition="left">
              Vote Now
            </Button>
            <Button variant="outline" fullWidth iconName="Share2" iconPosition="left">
              Share
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Icon name="Users" size={14} />
                2.4M reach
              </span>
              <span className="flex items-center gap-1">
                <Icon name="Clock" size={14} />
                {formData?.duration || '7'} days
              </span>
            </div>
            <span className="flex items-center gap-1">
              <Icon name="Shield" size={14} />
              Blockchain verified
            </span>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Preview Notes</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>This preview shows how your campaign appears in user feeds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Actual appearance may vary slightly based on device and screen size</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Click "Edit" buttons to modify any section before launching</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignPreview;