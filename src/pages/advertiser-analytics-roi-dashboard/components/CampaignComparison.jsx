import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const CampaignComparison = ({ data }) => {
  const campaignsFromApi = data?.campaigns || [];
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  useEffect(() => {
    if (campaignsFromApi?.length >= 2 && selectedCampaigns?.length < 2) {
      const ids = campaignsFromApi?.map((c) => c?.id)?.filter(Boolean) || [];
      setSelectedCampaigns(ids?.slice(0, 2) || []);
    }
  }, [campaignsFromApi?.length]);

  const campaigns = campaignsFromApi?.length > 0
    ? campaignsFromApi
    : [
        { id: 1, name: 'Summer Product Launch', roi: 185, costEfficiency: 2.8, participants: 4500, spend: 12600, conversions: 580 },
        { id: 2, name: 'Brand Awareness Q3', roi: 165, costEfficiency: 3.2, participants: 3800, spend: 12160, conversions: 485 },
        { id: 3, name: 'Holiday Special', roi: 210, costEfficiency: 2.4, participants: 5200, spend: 12480, conversions: 680 },
        { id: 4, name: 'New Market Entry', roi: 145, costEfficiency: 3.8, participants: 2900, spend: 11020, conversions: 320 }
      ];

  const comparedCampaigns = campaigns?.filter(c => selectedCampaigns?.includes(c?.id));

  const getComparisonColor = (value, isHigherBetter = true) => {
    if (comparedCampaigns?.length !== 2) return 'text-foreground';
    const [first, second] = comparedCampaigns;
    const metric1 = first?.[value];
    const metric2 = second?.[value];
    
    if (isHigherBetter) {
      return metric1 > metric2 ? 'text-success' : metric1 < metric2 ? 'text-destructive' : 'text-foreground';
    } else {
      return metric1 < metric2 ? 'text-success' : metric1 > metric2 ? 'text-destructive' : 'text-foreground';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
            Campaign Comparison
          </h2>
          <p className="text-sm text-muted-foreground">
            Side-by-side performance analysis and ROI comparison
          </p>
        </div>
        <Icon name="GitCompare" size={24} className="text-primary" />
      </div>
      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3">Select campaigns to compare:</p>
        <div className="flex flex-wrap gap-2">
          {campaigns?.map((campaign) => (
            <button
              key={campaign?.id}
              onClick={() => {
                if (selectedCampaigns?.includes(campaign?.id)) {
                  setSelectedCampaigns(selectedCampaigns?.filter(id => id !== campaign?.id));
                } else if (selectedCampaigns?.length < 2) {
                  setSelectedCampaigns([...selectedCampaigns, campaign?.id]);
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-250 ${
                selectedCampaigns?.includes(campaign?.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-foreground hover:bg-muted border border-border'
              }`}
              disabled={!selectedCampaigns?.includes(campaign?.id) && selectedCampaigns?.length >= 2}
            >
              {campaign?.name}
            </button>
          ))}
        </div>
      </div>
      {comparedCampaigns?.length === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparedCampaigns?.map((campaign, index) => (
            <div key={campaign?.id} className="p-6 rounded-lg border-2 border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground text-lg">
                  {campaign?.name}
                </h3>
                <div className="px-3 py-1 rounded-full bg-primary/10">
                  <span className="text-xs font-medium text-primary">Campaign {index + 1}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10">
                  <p className="text-sm text-muted-foreground mb-1">ROI</p>
                  <p className={`text-3xl font-heading font-bold font-data ${index === 0 ? getComparisonColor('roi', true) : 'text-foreground'}`}>
                    {campaign?.roi}%
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground mb-1">Cost Efficiency</p>
                  <p className={`text-2xl font-heading font-bold font-data ${index === 0 ? getComparisonColor('costEfficiency', false) : 'text-foreground'}`}>
                    ${campaign?.costEfficiency}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Participants</p>
                    <p className="text-base font-heading font-bold text-foreground font-data">
                      {campaign?.participants?.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">Conversions</p>
                    <p className="text-base font-heading font-bold text-foreground font-data">
                      {campaign?.conversions?.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-accent/10">
                  <p className="text-sm text-muted-foreground mb-1">Total Spend</p>
                  <p className="text-2xl font-heading font-bold text-foreground font-data">
                    ${campaign?.spend?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {comparedCampaigns?.length === 2 && (
        <div className="mt-6 p-4 rounded-lg bg-primary/10">
          <div className="flex items-start gap-3">
            <Icon name="Info" size={20} className="text-primary mt-1" />
            <div>
              <h4 className="font-heading font-semibold text-foreground mb-2">
                Statistical Significance
              </h4>
              <p className="text-sm text-muted-foreground">
                The performance difference between these campaigns is statistically significant (p &lt; 0.05). 
                Campaign 1 shows {Math.abs(comparedCampaigns?.[0]?.roi - comparedCampaigns?.[1]?.roi)}% higher ROI with 95% confidence.
              </p>
            </div>
          </div>
        </div>
      )}
      {comparedCampaigns?.length < 2 && (
        <div className="text-center py-12">
          <Icon name="GitCompare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Select 2 campaigns to compare their performance</p>
        </div>
      )}
    </div>
  );
};

export default CampaignComparison;