import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TemplateCard from './components/TemplateCard';
import TemplateDetailsModal from './components/TemplateDetailsModal';
import { analytics } from '../../hooks/useGoogleAnalytics';

const CampaignTemplateGallery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedObjective, setSelectedObjective] = useState('all');
  const [selectedBudget, setSelectedBudget] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    analytics?.trackEvent('template_gallery_viewed', {
      timestamp: new Date()?.toISOString()
    });
  }, []);

  const industries = [
  { value: 'all', label: 'All Industries', icon: 'LayoutGrid' },
  { value: 'retail', label: 'Retail', icon: 'ShoppingBag' },
  { value: 'technology', label: 'Technology', icon: 'Cpu' },
  { value: 'nonprofits', label: 'Nonprofits', icon: 'Heart' }];


  const objectives = [
  { value: 'all', label: 'All Objectives' },
  { value: 'product_launch', label: 'Product Launch' },
  { value: 'seasonal_promotion', label: 'Seasonal Promotion' },
  { value: 'customer_feedback', label: 'Customer Feedback' },
  { value: 'feature_adoption', label: 'Feature Adoption' },
  { value: 'beta_testing', label: 'Beta Testing' },
  { value: 'user_research', label: 'User Research' },
  { value: 'awareness_campaign', label: 'Awareness Campaign' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'community_engagement', label: 'Community Engagement' }];


  const budgetRanges = [
  { value: 'all', label: 'All Budgets' },
  { value: 'small', label: 'Small ($1K - $5K)' },
  { value: 'medium', label: 'Medium ($5K - $20K)' },
  { value: 'large', label: 'Large ($20K+)' }];


  const templates = [
  // Retail Templates
  {
    id: 'retail-1',
    name: 'Product Launch Hype Builder',
    industry: 'retail',
    objective: 'product_launch',
    description: 'Generate pre-launch excitement with community voting on product features, colors, or launch date preferences.',
    image: "https://images.unsplash.com/photo-1711864768464-98c979cb920c",
    imageAlt: 'Modern retail store interior with product displays and shoppers browsing merchandise',
    setupTime: '15 min',
    budgetRange: 'medium',
    successRate: 92,
    avgEngagement: 8500,
    preWrittenQuestions: [
    'Which product color would you most likely purchase?',
    'What price point feels right for this product?',
    'Which feature matters most to you?'],

    targetingParams: {
      zones: [1, 2, 3],
      demographics: 'Ages 25-45, Shopping enthusiasts',
      interests: 'Retail, Fashion, Consumer goods'
    },
    budgetAllocation: {
      zone1: 35,
      zone2: 30,
      zone3: 35
    },
    mediaAssets: ['Product hero image', 'Feature comparison chart', 'Launch teaser video'],
    popularity: 95
  },
  {
    id: 'retail-2',
    name: 'Seasonal Promotion Optimizer',
    industry: 'retail',
    objective: 'seasonal_promotion',
    description: 'Let customers vote on seasonal deals, bundle offers, or limited-time promotions to maximize engagement.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bf7a064c-1772141567670.png",
    imageAlt: 'Holiday shopping scene with decorated store windows and seasonal sale displays',
    setupTime: '12 min',
    budgetRange: 'small',
    successRate: 88,
    avgEngagement: 6200,
    preWrittenQuestions: [
    'Which seasonal bundle interests you most?',
    'What discount percentage would motivate your purchase?',
    'Which holiday theme resonates with you?'],

    targetingParams: {
      zones: [1, 2, 4, 5],
      demographics: 'Ages 18-55, Bargain hunters',
      interests: 'Shopping, Deals, Seasonal events'
    },
    budgetAllocation: {
      zone1: 25,
      zone2: 25,
      zone4: 25,
      zone5: 25
    },
    mediaAssets: ['Seasonal banner', 'Product bundle images', 'Countdown timer graphic'],
    popularity: 87
  },
  {
    id: 'retail-3',
    name: 'Customer Feedback Loop',
    industry: 'retail',
    objective: 'customer_feedback',
    description: 'Collect actionable customer insights on shopping experience, product quality, and service improvements.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1852f4b53-1772141568858.png",
    imageAlt: 'Customer service representative helping shopper with tablet in modern retail environment',
    setupTime: '10 min',
    budgetRange: 'small',
    successRate: 85,
    avgEngagement: 4800,
    preWrittenQuestions: [
    'How satisfied are you with our product quality?',
    'What would improve your shopping experience?',
    'Which new product category should we add?'],

    targetingParams: {
      zones: [1, 2, 3, 4, 5, 6],
      demographics: 'Existing customers, All ages',
      interests: 'Retail, Customer service'
    },
    budgetAllocation: {
      zone1: 20,
      zone2: 15,
      zone3: 15,
      zone4: 15,
      zone5: 20,
      zone6: 15
    },
    mediaAssets: ['Store photos', 'Product images', 'Customer testimonial graphics'],
    popularity: 78
  },

  // Technology Templates
  {
    id: 'tech-1',
    name: 'Feature Adoption Accelerator',
    industry: 'technology',
    objective: 'feature_adoption',
    description: 'Drive awareness and adoption of new software features through interactive voting and education.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18a6399e3-1772282856982.png",
    imageAlt: 'Software development team collaborating on feature design with multiple monitors and code',
    setupTime: '18 min',
    budgetRange: 'medium',
    successRate: 90,
    avgEngagement: 7200,
    preWrittenQuestions: [
    'Which new feature would you use most frequently?',
    'How important is this feature to your workflow?',
    'What additional functionality would enhance this feature?'],

    targetingParams: {
      zones: [1, 2, 3, 7],
      demographics: 'Tech professionals, Ages 25-50',
      interests: 'Software, Productivity, Innovation'
    },
    budgetAllocation: {
      zone1: 30,
      zone2: 30,
      zone3: 25,
      zone7: 15
    },
    mediaAssets: ['Feature demo video', 'UI screenshots', 'Tutorial graphics'],
    popularity: 91
  },
  {
    id: 'tech-2',
    name: 'Beta Testing Recruitment',
    industry: 'technology',
    objective: 'beta_testing',
    description: 'Recruit engaged beta testers and gather early feedback on product iterations before full launch.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_174858f13-1772141570859.png",
    imageAlt: 'Diverse team of beta testers using laptops and mobile devices in collaborative workspace',
    setupTime: '20 min',
    budgetRange: 'medium',
    successRate: 86,
    avgEngagement: 5400,
    preWrittenQuestions: [
    'Would you be interested in beta testing our new product?',
    'What device/platform do you primarily use?',
    'How much time can you dedicate to testing weekly?'],

    targetingParams: {
      zones: [1, 2, 7, 8],
      demographics: 'Early adopters, Tech enthusiasts',
      interests: 'Technology, Software testing, Innovation'
    },
    budgetAllocation: {
      zone1: 30,
      zone2: 30,
      zone7: 20,
      zone8: 20
    },
    mediaAssets: ['Product preview', 'Beta program benefits', 'Tester testimonials'],
    popularity: 83
  },
  {
    id: 'tech-3',
    name: 'User Research Initiative',
    industry: 'technology',
    objective: 'user_research',
    description: 'Conduct comprehensive user research to inform product roadmap and UX design decisions.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14cefb594-1772141569587.png",
    imageAlt: 'UX researcher analyzing user behavior data on multiple screens with analytics dashboards',
    setupTime: '22 min',
    budgetRange: 'large',
    successRate: 89,
    avgEngagement: 9100,
    preWrittenQuestions: [
    'What is your biggest pain point with current solutions?',
    'Which workflow improvement would save you the most time?',
    'How do you currently solve this problem?'],

    targetingParams: {
      zones: [1, 2, 3, 4, 7],
      demographics: 'Target user personas, Ages 22-55',
      interests: 'Technology, Productivity, Problem-solving'
    },
    budgetAllocation: {
      zone1: 25,
      zone2: 25,
      zone3: 20,
      zone4: 15,
      zone7: 15
    },
    mediaAssets: ['Research objectives', 'User persona graphics', 'Problem statement visuals'],
    popularity: 80
  },

  // Nonprofit Templates
  {
    id: 'nonprofit-1',
    name: 'Awareness Campaign Builder',
    industry: 'nonprofits',
    objective: 'awareness_campaign',
    description: 'Amplify your cause and educate the community through interactive awareness campaigns with measurable impact.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1eb11f9ba-1772282854423.png",
    imageAlt: 'Community volunteers holding awareness campaign signs at outdoor public event',
    setupTime: '14 min',
    budgetRange: 'small',
    successRate: 84,
    avgEngagement: 5800,
    preWrittenQuestions: [
    'How familiar are you with our cause?',
    'Which aspect of our mission resonates most with you?',
    'How would you like to get involved?'],

    targetingParams: {
      zones: [1, 2, 3, 4, 5, 6],
      demographics: 'Socially conscious, Ages 18-65',
      interests: 'Social causes, Community service, Activism'
    },
    budgetAllocation: {
      zone1: 18,
      zone2: 18,
      zone3: 16,
      zone4: 16,
      zone5: 16,
      zone6: 16
    },
    mediaAssets: ['Impact statistics', 'Beneficiary stories', 'Call-to-action graphics'],
    popularity: 82
  },
  {
    id: 'nonprofit-2',
    name: 'Fundraising Drive Optimizer',
    industry: 'nonprofits',
    objective: 'fundraising',
    description: 'Engage donors and maximize fundraising results with transparent goal tracking and community participation.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c3c106d4-1772141568253.png",
    imageAlt: 'Diverse group of volunteers at fundraising event with donation collection and community engagement',
    setupTime: '16 min',
    budgetRange: 'medium',
    successRate: 87,
    avgEngagement: 6700,
    preWrittenQuestions: [
    'Which program should receive priority funding?',
    'What donation amount feels comfortable for you?',
    'Would you prefer one-time or recurring donations?'],

    targetingParams: {
      zones: [1, 2, 3, 4, 5],
      demographics: 'Donors, Philanthropists, Ages 30-70',
      interests: 'Charity, Giving, Social impact'
    },
    budgetAllocation: {
      zone1: 25,
      zone2: 20,
      zone3: 20,
      zone4: 20,
      zone5: 15
    },
    mediaAssets: ['Fundraising goal tracker', 'Impact photos', 'Donor recognition graphics'],
    popularity: 88
  },
  {
    id: 'nonprofit-3',
    name: 'Community Engagement Hub',
    industry: 'nonprofits',
    objective: 'community_engagement',
    description: 'Build lasting community connections through participatory decision-making and volunteer mobilization.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_164da5831-1772141568618.png",
    imageAlt: 'Multicultural community members collaborating at round table discussion in community center',
    setupTime: '12 min',
    budgetRange: 'small',
    successRate: 81,
    avgEngagement: 4200,
    preWrittenQuestions: [
    'Which community initiative should we prioritize?',
    'How would you like to volunteer?',
    'What time commitment works best for you?'],

    targetingParams: {
      zones: [1, 2, 3, 4, 5, 6, 7, 8],
      demographics: 'Community members, All ages',
      interests: 'Community service, Volunteering, Local events'
    },
    budgetAllocation: {
      zone1: 15,
      zone2: 15,
      zone3: 12,
      zone4: 12,
      zone5: 12,
      zone6: 12,
      zone7: 11,
      zone8: 11
    },
    mediaAssets: ['Community photos', 'Volunteer opportunities', 'Impact stories'],
    popularity: 76
  }];


  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = !searchQuery ||
    template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || template?.industry === selectedIndustry;
    const matchesObjective = selectedObjective === 'all' || template?.objective === selectedObjective;
    const matchesBudget = selectedBudget === 'all' || template?.budgetRange === selectedBudget;

    return matchesSearch && matchesIndustry && matchesObjective && matchesBudget;
  });

  const sortedTemplates = [...filteredTemplates]?.sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b?.popularity - a?.popularity;
      case 'success_rate':
        return b?.successRate - a?.successRate;
      case 'engagement':
        return b?.avgEngagement - a?.avgEngagement;
      case 'setup_time':
        return parseInt(a?.setupTime) - parseInt(b?.setupTime);
      default:
        return 0;
    }
  });

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    analytics?.trackEvent('template_viewed', {
      template_id: template?.id,
      template_name: template?.name,
      industry: template?.industry
    });
  };

  const handleApplyTemplate = (template) => {
    analytics?.trackEvent('template_applied', {
      template_id: template?.id,
      template_name: template?.name,
      industry: template?.industry
    });

    // Navigate to Ads Studio with template data
    navigate('/participatory-ads-studio', { state: { template } });
  };

  return (
    <GeneralPageLayout 
      title="Campaign Template Gallery" 
      description="Pre-built campaign templates by industry (retail, tech, nonprofits) to accelerate advertiser setup and reduce time-to-launch for sponsored elections."
      showSidebar={false}
      maxWidth="max-w-[1600px]"
    >
      <div className="w-full">
        <div className="mb-6 md:mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                  Campaign Template Gallery
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Pre-built campaign templates to accelerate setup and reduce time-to-launch
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" iconName="BookOpen">
                  Template Guide
                </Button>
                <Button iconName="Plus" onClick={() => navigate('/participatory-ads-studio')}>
                  Create Custom Campaign
                </Button>
              </div>
            </div>
          </div>

          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                type="search"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="lg:col-span-2" />

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e?.target?.value)}
                className="px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

                <option value="popularity">Sort by Popularity</option>
                <option value="success_rate">Sort by Success Rate</option>
                <option value="engagement">Sort by Engagement</option>
                <option value="setup_time">Sort by Setup Time</option>
              </select>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border">
                <Icon name="Layers" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">
                  {sortedTemplates?.length} Templates
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Industry:</p>
                <div className="flex flex-wrap gap-2">
                  {industries?.map((industry) =>
                  <button
                    key={industry?.value}
                    onClick={() => setSelectedIndustry(industry?.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
                    selectedIndustry === industry?.value ?
                    'bg-primary text-primary-foreground' :
                    'bg-card text-foreground hover:bg-muted border border-border'}`
                    }>

                      <Icon name={industry?.icon} size={16} />
                      {industry?.label}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Campaign Objective:</p>
                  <select
                    value={selectedObjective}
                    onChange={(e) => setSelectedObjective(e?.target?.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

                    {objectives?.map((obj) =>
                    <option key={obj?.value} value={obj?.value}>
                        {obj?.label}
                      </option>
                    )}
                  </select>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Budget Range:</p>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e?.target?.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary">

                    {budgetRanges?.map((range) =>
                    <option key={range?.value} value={range?.value}>
                        {range?.label}
                      </option>
                    )}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {sortedTemplates?.length === 0 ?
          <div className="text-center py-20">
              <Icon name="Search" size={64} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setSelectedIndustry('all');
              setSelectedObjective('all');
              setSelectedBudget('all');
            }}>
                Clear Filters
              </Button>
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTemplates?.map((template) =>
            <TemplateCard
              key={template?.id}
              template={template}
              onSelect={handleTemplateSelect}
              onApply={handleApplyTemplate} />

            )}
        </div>
      </div>

      {selectedTemplate &&
      <TemplateDetailsModal
        template={selectedTemplate}
        onClose={() => setSelectedTemplate(null)}
        onApply={handleApplyTemplate} />

      }
    </GeneralPageLayout>
  );
};

export default CampaignTemplateGallery;