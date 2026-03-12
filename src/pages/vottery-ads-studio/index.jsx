/**
 * Vottery Ads Studio – unified ad creation (normal + participatory/gamified + Spark).
 * Campaign > Ad Group > Ad; targeting by zones, countries, regions; placement slots.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { supabase } from '../../lib/supabase';
import {
  votteryAdsService,
  createCampaign,
  createAdGroup,
  setTargetingGeo,
  createAd,
  upsertSparkReference,
  getPlacementSlots,
  getAdminConfig,
} from '../../services/votteryAdsService';
import {
  VOTTERY_ADS_ROUTE,
  CAMPAIGN_OBJECTIVES,
  AD_TYPES,
  PRICING_MODELS,
  ZONES,
  PLACEMENT_SLOTS_TIKTOK,
  PLACEMENT_SLOTS_FACEBOOK,
  PLACEMENT_SLOT_LABELS,
} from '../../constants/votteryAdsConstants';
import VotteryAdsStepCampaign from './components/VotteryAdsStepCampaign';
import VotteryAdsStepTargeting from './components/VotteryAdsStepTargeting';
import VotteryAdsStepCreative from './components/VotteryAdsStepCreative';
import VotteryAdsStepPreview from './components/VotteryAdsStepPreview';

const STEPS = [
  { id: 0, label: 'Campaign', icon: 'FileText' },
  { id: 1, label: 'Targeting & placement', icon: 'Target' },
  { id: 2, label: 'Ad creative', icon: 'Image' },
  { id: 3, label: 'Preview & launch', icon: 'Eye' },
];

const defaultFormData = {
  campaignName: '',
  campaignObjective: CAMPAIGN_OBJECTIVES.REACH,
  adGroupName: '',
  targetZones: [1, 2, 3, 4, 5, 6, 7, 8],
  targetCountries: [],
  targetRegions: [], // { country_iso, region_code, region_name }
  placementMode: 'automatic',
  placementSlots: [],
  dailyBudgetCents: 500,
  lifetimeBudgetCents: null,
  scheduleStart: null,
  scheduleEnd: null,
  adName: '',
  adType: AD_TYPES.DISPLAY,
  headline: '',
  body: '',
  cta: 'LEARN_MORE',
  ctaUrl: '',
  imageUrl: '',
  videoUrl: '',
  electionId: null,
  enableGamification: false,
  prizePoolCents: null,
  sourcePostId: null,
  sparkSourceType: 'moment',
  bidAmountCents: 500,
  pricingModel: PRICING_MODELS.CPM,
};

const VotteryAdsStudio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(defaultFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [placementSlots, setPlacementSlots] = useState([]);
  const [adminConfig, setAdminConfig] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [slots, config] = await Promise.all([
          getPlacementSlots(),
          getAdminConfig(),
        ]);
        setPlacementSlots(slots);
        setAdminConfig(config);
      } catch (e) {
        console.error('Vottery Ads Studio init:', e);
      }
    })();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateStep = (stepIndex) => {
    const e = {};
    if (stepIndex === 0) {
      if (!formData.campaignName?.trim()) e.campaignName = 'Campaign name is required';
      if (!formData.campaignObjective) e.campaignObjective = 'Objective is required';
    }
    if (stepIndex === 1) {
      if (!formData.adGroupName?.trim()) e.adGroupName = 'Ad group name is required';
      if (!formData.targetZones?.length) e.targetZones = 'Select at least one zone';
      const minDaily = votteryAdsService.getMinDailyBudgetCents(adminConfig);
      if (formData.dailyBudgetCents != null && formData.dailyBudgetCents < minDaily) {
        e.dailyBudgetCents = `Minimum daily budget is $${(minDaily / 100).toFixed(2)}`;
      }
    }
    if (stepIndex === 2) {
      if (!formData.adName?.trim()) e.adName = 'Ad name is required';
      if (!formData.adType) e.adType = 'Ad type is required';
      if (formData.adType === AD_TYPES.PARTICIPATORY && !formData.electionId) {
        e.electionId = 'Select an election for participatory ad';
      }
      if (formData.adType === AD_TYPES.SPARK && !formData.sourcePostId) {
        e.sourcePostId = 'Select a post (Moment/Jolt) for Spark ad';
      }
      if (!formData.bidAmountCents || formData.bidAmountCents < 0) {
        e.bidAmountCents = 'Valid bid is required';
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunch = async () => {
    if (!validateStep(currentStep)) return;
    setLoading(true);
    setErrors({});
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const campaign = await createCampaign(user.id, {
        name: formData.campaignName,
        objective: formData.campaignObjective,
        status: 'active',
      });

      const adGroup = await createAdGroup({
        campaign_id: campaign.id,
        name: formData.adGroupName,
        target_zones: formData.targetZones,
        target_countries: formData.targetCountries,
        placement_mode: formData.placementMode,
        placement_slots: formData.placementSlots.length ? formData.placementSlots : null,
        daily_budget_cents: formData.dailyBudgetCents,
        lifetime_budget_cents: formData.lifetimeBudgetCents || null,
        schedule_start: formData.scheduleStart || null,
        schedule_end: formData.scheduleEnd || null,
        status: 'active',
      });

      if (formData.targetRegions?.length) {
        await setTargetingGeo(
          adGroup.id,
          formData.targetRegions.map((r) => ({
            country_iso: r.country_iso,
            region_code: r.region_code,
            region_name: r.region_name,
          }))
        );
      }

      const creative = {
        headline: formData.headline,
        body: formData.body,
        cta: formData.cta,
        image_url: formData.imageUrl,
        video_url: formData.videoUrl,
      };

      const ad = await createAd({
        ad_group_id: adGroup.id,
        name: formData.adName,
        ad_type: formData.adType,
        status: 'active',
        creative,
        election_id: formData.electionId || null,
        enable_gamification: formData.adType === AD_TYPES.PARTICIPATORY && formData.enableGamification,
        prize_pool_cents: formData.prizePoolCents ?? null,
        source_post_id: formData.sourcePostId || null,
        bid_amount_cents: formData.bidAmountCents,
        pricing_model: formData.pricingModel,
      });

      if (formData.adType === AD_TYPES.SPARK && formData.sourcePostId) {
        await upsertSparkReference(ad.id, formData.sourcePostId, formData.sparkSourceType, {
          label: formData.cta,
          destination_url: formData.ctaUrl,
        });
      }

      setSuccessModal(true);
    } catch (err) {
      setErrors({ submit: err?.message || 'Failed to launch campaign' });
    } finally {
      setLoading(false);
    }
  };

  const stepComponents = [
    <VotteryAdsStepCampaign key="0" formData={formData} onChange={handleChange} errors={errors} />,
    <VotteryAdsStepTargeting
      key="1"
      formData={formData}
      onChange={handleChange}
      errors={errors}
      placementSlots={placementSlots}
      adminConfig={adminConfig}
    />,
    <VotteryAdsStepCreative key="2" formData={formData} onChange={handleChange} errors={errors} />,
    <VotteryAdsStepPreview key="3" formData={formData} ZONES={ZONES} PLACEMENT_SLOT_LABELS={PLACEMENT_SLOT_LABELS} />,
  ];

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="max-w-[1400px] mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Vottery Ads Studio
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Create normal ads, participatory/gamified ads, or Spark ads (boost organic posts) in one place
            </p>
          </div>
        </div>

        <div className="mb-6 md:mb-8">
          <div className="bg-card border border-border rounded-xl p-4 md:p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep + 1} of {STEPS.length}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
              </span>
            </div>
            <div className="relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <div className="relative flex justify-between">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() => index <= currentStep && setCurrentStep(index)}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        index < currentStep
                          ? 'bg-primary text-primary-foreground'
                          : index === currentStep
                          ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < currentStep ? <Icon name="Check" size={20} /> : <Icon name={step.icon} size={20} />}
                    </div>
                    <span className={`text-xs font-medium text-center hidden md:block ${index === currentStep ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 mb-6">
          {stepComponents[currentStep]}
        </div>

        {errors.submit && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
            {errors.submit}
          </div>
        )}

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
            <span>Unified Ads: normal, gamified & Spark</span>
          </div>
          {currentStep < STEPS.length - 1 ? (
            <Button variant="default" iconName="ArrowRight" iconPosition="right" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              variant="success"
              iconName="Rocket"
              iconPosition="left"
              onClick={handleLaunch}
              disabled={loading}
            >
              {loading ? 'Launching…' : 'Launch campaign'}
            </Button>
          )}
        </div>
      </div>

      {successModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="CheckCircle" size={32} color="var(--color-success)" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Campaign launched</h2>
            <p className="text-muted-foreground mb-6">
              Your ad campaign is live. You can manage it from the Campaign Management Dashboard.
            </p>
            <div className="space-y-3">
              <Button
                variant="default"
                fullWidth
                iconName="BarChart3"
                iconPosition="left"
                onClick={() => {
                  setSuccessModal(false);
                  navigate('/campaign-management-dashboard');
                }}
              >
                Campaign dashboard
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setSuccessModal(false);
                  navigate('/home-feed-dashboard');
                }}
              >
                Home
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotteryAdsStudio;
