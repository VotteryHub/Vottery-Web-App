import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { claudeContentService } from '../../../services/claudeContentService';

const AIContentGeneratorPanel = () => {
  const [activeTab, setActiveTab] = useState('headlines');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);
  const [campaignContext, setCampaignContext] = useState({
    campaignType: 'Election Participation',
    targetAudience: 'Young professionals 25-44',
    productService: 'Democratic voting platform',
    tone: 'Engaging and empowering'
  });

  const handleGenerateHeadlines = async () => {
    try {
      setLoading(true);
      const result = await claudeContentService?.generateCampaignHeadlines(campaignContext);
      if (result?.data) {
        setGeneratedContent(result?.data);
      }
    } catch (error) {
      console.error('Failed to generate headlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDescriptions = async () => {
    try {
      setLoading(true);
      const audienceSegments = [
        { name: 'Young Professionals', description: 'Ages 25-34, career-focused, tech-savvy' },
        { name: 'Established Professionals', description: 'Ages 35-44, family-oriented, community-engaged' },
        { name: 'Senior Voters', description: 'Ages 55+, experienced, value-driven' }
      ];
      const result = await claudeContentService?.generateCampaignDescriptions(campaignContext, audienceSegments);
      if (result?.data) {
        setGeneratedContent(result?.data);
      }
    } catch (error) {
      console.error('Failed to generate descriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    try {
      setLoading(true);
      const result = await claudeContentService?.generateMessagingVariations(
        'Make your voice heard in today\'s election',
        5
      );
      if (result?.data) {
        setGeneratedContent(result?.data);
      }
    } catch (error) {
      console.error('Failed to generate variations:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'headlines', label: 'Headlines', icon: 'Type' },
    { id: 'descriptions', label: 'Descriptions', icon: 'FileText' },
    { id: 'variations', label: 'A/B Variations', icon: 'GitBranch' }
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              AI Content Generator
            </h2>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
              <Icon name="Sparkles" size={14} className="text-purple-600" />
              <span className="text-xs font-semibold text-purple-600">Claude AI</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Generate high-performing campaign copy optimized for different audience segments
          </p>
        </div>
        <Icon name="Wand2" size={24} className="text-purple-600" />
      </div>

      <div className="mb-6">
        <div className="flex gap-2 border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => {
                setActiveTab(tab?.id);
                setGeneratedContent(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 font-medium text-sm transition-all duration-200 ${
                activeTab === tab?.id
                  ? 'text-primary border-b-2 border-primary' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              {tab?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-muted/50">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Campaign Type</label>
            <input
              type="text"
              value={campaignContext?.campaignType}
              onChange={(e) => setCampaignContext({ ...campaignContext, campaignType: e?.target?.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Target Audience</label>
            <input
              type="text"
              value={campaignContext?.targetAudience}
              onChange={(e) => setCampaignContext({ ...campaignContext, targetAudience: e?.target?.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Product/Service</label>
            <input
              type="text"
              value={campaignContext?.productService}
              onChange={(e) => setCampaignContext({ ...campaignContext, productService: e?.target?.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Tone</label>
            <input
              type="text"
              value={campaignContext?.tone}
              onChange={(e) => setCampaignContext({ ...campaignContext, tone: e?.target?.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <Button
          variant="default"
          size="lg"
          iconName="Sparkles"
          fullWidth
          loading={loading}
          onClick={() => {
            if (activeTab === 'headlines') handleGenerateHeadlines();
            else if (activeTab === 'descriptions') handleGenerateDescriptions();
            else if (activeTab === 'variations') handleGenerateVariations();
          }}
        >
          {loading ? 'Generating...' : `Generate ${tabs?.find(t => t?.id === activeTab)?.label}`}
        </Button>
      </div>

      {generatedContent && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h3 className="text-lg font-heading font-semibold text-foreground">Generated Content</h3>
          </div>
          
          {activeTab === 'headlines' && Array.isArray(generatedContent) && (
            <div className="space-y-3">
              {generatedContent?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:border-primary transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-base font-semibold text-foreground flex-1">{item?.headline}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Icon name="TrendingUp" size={14} className="text-success" />
                        <span className="text-sm font-semibold text-success font-data">{item?.score}</span>
                      </div>
                      <Button variant="ghost" size="sm" iconName="Copy">
                        Copy
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{item?.reasoning}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'descriptions' && Array.isArray(generatedContent) && (
            <div className="space-y-3">
              {generatedContent?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:border-primary transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{item?.segmentName}</h4>
                    <span className="text-xs font-semibold text-success font-data">{item?.engagementScore}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{item?.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-primary font-medium">{item?.cta}</span>
                    <Button variant="ghost" size="sm" iconName="Copy">
                      Copy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'variations' && Array.isArray(generatedContent) && (
            <div className="space-y-3">
              {generatedContent?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border hover:border-primary transition-all duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-foreground">{item?.variation}</h4>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item?.approach}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{item?.hypothesis}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-success font-data">{item?.score}</span>
                      <Button variant="ghost" size="sm" iconName="Copy">
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-purple-50">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-2">
              How AI Content Generation Works
            </h4>
            <p className="text-sm text-muted-foreground">
              Claude AI analyzes your campaign context, target audience, and objectives to generate high-performing copy variations. Each suggestion is optimized using proven copywriting principles and includes performance predictions based on historical data patterns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIContentGeneratorPanel;