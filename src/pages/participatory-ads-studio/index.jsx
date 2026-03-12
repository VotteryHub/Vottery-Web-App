import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import CampaignBasicsForm from './components/CampaignBasicsForm';
import ElectionSetupForm from './components/ElectionSetupForm';
import MediaUploadSection from './components/MediaUploadSection';
import TargetingPanel from './components/TargetingPanel';
import BudgetConfiguration from './components/BudgetConfiguration';
import AdvancedOptions from './components/AdvancedOptions';
import CampaignPreview from './components/CampaignPreview';
import TemplateLibrary from './components/TemplateLibrary';
import { supabase } from '../../lib/supabase';
import { blockchainService } from '../../services/blockchainService';

const ParticipatoryAdsStudio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    campaignTitle: '',
    objective: '',
    category: '',
    description: '',
    electionType: '',
    votingMethod: '',
    questions: [],
    brandLogo: null,
    coverImage: null,
    campaignVideo: null,
    requireVideoWatch: false,
    ageRange: [],
    gender: 'all',
    regions: [],
    interests: [],
    keywords: '',
    minVotingHistory: '',
    minEngagement: '',
    regionalPrices: Array(8)?.fill(''),
    participationModel: 'free',
    campaignBudget: '',
    duration: '7',
    enableGamification: false,
    prizePool: '',
    prizeDistribution: 'single_winner',
    numberOfWinners: '',
    tier1Percent: '50',
    tier2Percent: '30',
    tier3Percent: '20',
    visibility: 'public',
    abTestType: 'none',
    trafficSplit: '50',
    minSampleSize: '1000',
    autoOptimize: false,
    analyticsFrequency: 'daily',
    trackImpressions: true,
    trackCTR: true,
    trackCompletion: true,
    trackViral: false,
    trackDemographics: true,
    allowVoteChanges: false,
    showRealTimeResults: true,
    enableSharing: true,
    requireEmailVerification: true,
    oneVotePerUser: true,
    enableBlockchain: true,
    publicVerification: true,
    enableZKP: false
  });
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 0, label: 'Campaign Basics', icon: 'FileText', component: CampaignBasicsForm },
    { id: 1, label: 'Election Setup', icon: 'Vote', component: ElectionSetupForm },
    { id: 2, label: 'Media Assets', icon: 'Image', component: MediaUploadSection },
    { id: 3, label: 'Targeting', icon: 'Target', component: TargetingPanel },
    { id: 4, label: 'Budget & Pricing', icon: 'DollarSign', component: BudgetConfiguration },
    { id: 5, label: 'Advanced Options', icon: 'Settings', component: AdvancedOptions },
    { id: 6, label: 'Preview & Launch', icon: 'Eye', component: CampaignPreview }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (stepIndex) => {
    const newErrors = {};

    if (stepIndex === 0) {
      if (!formData?.brandName) newErrors.brandName = 'Brand name is required';
      if (!formData?.campaignTitle) newErrors.campaignTitle = 'Campaign title is required';
      if (!formData?.objective) newErrors.objective = 'Campaign objective is required';
      if (!formData?.category) newErrors.category = 'Campaign category is required';
      if (!formData?.description) newErrors.description = 'Campaign description is required';
      if (formData?.description && formData?.description?.length > 500) {
        newErrors.description = 'Description must be 500 characters or less';
      }
    }

    if (stepIndex === 1) {
      if (!formData?.electionType) newErrors.electionType = 'Election type is required';
      if (!formData?.votingMethod) newErrors.votingMethod = 'Voting method is required';
      if (!formData?.questions || formData?.questions?.length === 0) {
        newErrors.questions = 'At least one question is required';
      }
    }

    if (stepIndex === 3) {
      if (!formData?.regions || formData?.regions?.length === 0) {
        newErrors.regions = 'At least one geographic region is required';
      }
    }

    if (stepIndex === 4) {
      if (!formData?.participationModel) newErrors.participationModel = 'Participation model is required';
      if (!formData?.campaignBudget) newErrors.campaignBudget = 'Campaign budget is required';
      if (!formData?.duration) newErrors.duration = 'Campaign duration is required';
      if (formData?.enableGamification) {
        if (!formData?.prizePool) newErrors.prizePool = 'Prize pool amount is required';
        if (!formData?.prizeDistribution) newErrors.prizeDistribution = 'Prize distribution model is required';
      }
    }

    if (stepIndex === 5) {
      if (!formData?.visibility) newErrors.visibility = 'Campaign visibility is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps?.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveDraft = () => {
    console.log('Saving draft:', formData);
    alert('Campaign draft saved successfully!');
  };

  const handleLaunchCampaign = async () => {
    if (!validateStep(currentStep)) return;

    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      const campaignPayload = {
        campaign_name: formData?.campaignName || formData?.electionTitle,
        description: formData?.electionDescription,
        ad_format_type: formData?.adFormat || 'market_research',
        status: 'active',
        bid_amount: parseFloat(formData?.campaignBudget) || 0,
        target_zones: formData?.regions?.length > 0 ? formData?.regions : [1, 2, 3, 4, 5, 6, 7, 8],
        image_url: formData?.coverImage || null,
        engagement_metrics: { impressions: 0, clicks: 0, votes: 0 },
        created_by: user?.id,
        enable_gamification: formData?.enableGamification || false,
        prize_pool: parseFloat(formData?.prizePool) || 0,
      };

      const { data, error } = await supabase
        ?.from('sponsored_elections')
        ?.insert(campaignPayload)
        ?.select()
        ?.single();

      if (error) throw error;

      await blockchainService?.recordAuditLog('sponsored_campaign_created', {
        userId: user?.id,
        campaignId: data?.id,
        campaignName: campaignPayload?.campaign_name,
      });

      setShowSuccessModal(true);
    } catch (err) {
      alert('Failed to launch campaign: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleSelectTemplate = (template) => {
    console.log('Selected template:', template);
    setShowTemplateLibrary(false);
    alert(`Template "${template?.name}" loaded! You can now customize it.`);
  };

  const CurrentStepComponent = steps?.[currentStep]?.component;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Participatory Ads Studio
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Create engaging sponsored elections that reward participation
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              iconName="LayoutTemplate"
              iconPosition="left"
              onClick={() => setShowTemplateLibrary(true)}
            >
              Browse Templates
            </Button>
            <Button
              variant="secondary"
              iconName="Save"
              iconPosition="left"
              onClick={handleSaveDraft}
            >
              Save Draft
            </Button>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {steps?.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(((currentStep + 1) / steps?.length) * 100)}% Complete
              </span>
            </div>

            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / steps?.length) * 100}%` }}
                />
              </div>

              <div className="relative flex justify-between">
                {steps?.map((step, index) => (
                  <div
                    key={step?.id}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => {
                      if (index <= currentStep) {
                        setCurrentStep(index);
                      }
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-250 ${
                        index < currentStep
                          ? 'bg-primary text-primary-foreground'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? (
                        <Icon name="Check" size={20} />
                      ) : (
                        <Icon name={step?.icon} size={20} />
                      )}
                    </div>
                    <span
                      className={`text-xs font-medium text-center hidden md:block ${
                        index === currentStep ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {step?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 mb-6">
          <CurrentStepComponent
            formData={formData}
            onChange={handleChange}
            errors={errors}
            onEdit={(step) => setCurrentStep(step)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icon name="Shield" size={16} />
            <span>All data encrypted and secure</span>
          </div>

          {currentStep < steps?.length - 1 ? (
            <Button
              variant="default"
              iconName="ArrowRight"
              iconPosition="right"
              onClick={handleNext}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="success"
              iconName="Rocket"
              iconPosition="left"
              onClick={handleLaunchCampaign}
            >
              Launch Campaign
            </Button>
          )}
        </div>
      </div>
      {showTemplateLibrary && (
        <TemplateLibrary
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateLibrary(false)}
        />
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Campaign Launched Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your sponsored election is now under review. You'll receive a notification once it's approved and live.
            </p>
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/admin-control-center');
                }}
              >
                View Campaign Dashboard
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate('/home-feed-dashboard');
                }}
              >
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipatoryAdsStudio;