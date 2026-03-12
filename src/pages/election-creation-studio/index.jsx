import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ElectionBasicsForm from './components/ElectionBasicsForm';
import MediaRequirementsForm from './components/MediaRequirementsForm';
import VotingConfigurationForm from './components/VotingConfigurationForm';
import QuestionBuilderForm from './components/QuestionBuilderForm';
import MCQQuizBuilder from './components/MCQQuizBuilder';
import AdvancedSettingsForm from './components/AdvancedSettingsForm';
import ParticipationSettingsForm from './components/ParticipationSettingsForm';
import ProgressIndicator from './components/ProgressIndicator';
import PreviewModal from './components/PreviewModal';
import { electionsService } from '../../services/electionsService';
import { voterRollsService } from '../../services/voterRollsService';
import { blockchainService } from '../../services/blockchainService';

const ElectionCreationStudio = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const steps = [
    { id: 'basics', label: 'Basics', component: ElectionBasicsForm },
    { id: 'media', label: 'Media', component: MediaRequirementsForm },
    { id: 'voting', label: 'Voting', component: VotingConfigurationForm },
    { id: 'questions', label: 'Questions', component: QuestionBuilderForm },
    { id: 'mcq', label: 'MCQ Quiz', component: MCQQuizBuilder },
    { id: 'advanced', label: 'Advanced', component: AdvancedSettingsForm },
    { id: 'participation', label: 'Participation', component: ParticipationSettingsForm }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    requireVideo: false,
    videoUrl: '',
    videoFile: null,
    minWatchTime: '',
    votingType: '',
    questions: [],
    mcqQuestions: [],
    mcqEnforceBeforeVoting: false,
    category: '',
    enableGamification: false,
    prizeType: 'monetary',
    prizeAmount: '',
    prizePool: '',
    voucherDescription: '',
    voucherValue: '',
    projectedRevenue: '',
    numberOfWinners: '',
    winnerDistribution: [],
    startDate: '',
    endDate: '',
    brandingLogo: '',
    feeStructure: '',
    generalFee: '',
    baseFee: '',
    regionalFees: {},
    biometricRequired: 'none',
    requireAgeVerification: false,
    ageVerificationMethods: [],
    unlimitedAudience: true,
    permissionType: 'public',
    groupId: '',
    allowedCountries: '',
    showRealTimePrize: true,
    voteVisibility: 'visible',
    showLiveResults: true,
    creatorCanSeeTotals: true,
    uniqueElectionId: '',
    electionUrl: '',
    qrCodeData: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (!formData?.title?.trim()) newErrors.title = 'Title is required';
        if (!formData?.description?.trim()) newErrors.description = 'Description is required';
        if (!formData?.coverImage) newErrors.coverImage = 'Cover image is required';
        break;

      case 2:
        if (formData?.requireVideo) {
          if (!formData?.videoUrl) newErrors.videoUrl = 'Video is required when video requirement is enabled';
          if (!formData?.minWatchTime || formData?.minWatchTime < 1) {
            newErrors.minWatchTime = 'Minimum watch time must be at least 1 second';
          }
        }
        break;

      case 3:
        if (!formData?.votingType) newErrors.votingType = 'Voting type is required';
        break;

      case 4:
        if (formData?.questions?.length === 0) {
          newErrors.questions = 'At least one question is required';
        } else {
          formData?.questions?.forEach(q => {
            if (!q?.text?.trim()) {
              newErrors[`question_${q.id}`] = 'Question text is required';
            }
            if (q?.options?.some(opt => !opt?.trim())) {
              newErrors[`question_${q.id}`] = 'All options must be filled';
            }
          });
        }
        break;

      case 5:
        if (!formData?.category) newErrors.category = 'Category is required';
        if (!formData?.startDate) newErrors.startDate = 'Start date is required';
        if (!formData?.endDate) newErrors.endDate = 'End date is required';
        if (formData?.startDate && formData?.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
          newErrors.endDate = 'End date must be after start date';
        }
        if (formData?.enableGamification) {
          if (!formData?.prizeAmount || formData?.prizeAmount <= 0) {
            newErrors.prizeAmount = 'Prize amount must be greater than 0';
          }
          if (!formData?.numberOfWinners || formData?.numberOfWinners < 1) {
            newErrors.numberOfWinners = 'Number of winners must be at least 1';
          }
        }
        break;

      case 6:
        if (!formData?.feeStructure) newErrors.feeStructure = 'Fee structure is required';
        if (formData?.feeStructure === 'paid-general' && (!formData?.generalFee || formData?.generalFee <= 0)) {
          newErrors.generalFee = 'General fee must be greater than 0';
        }
        if (formData?.feeStructure === 'paid-regional' && (!formData?.baseFee || formData?.baseFee <= 0)) {
          newErrors.baseFee = 'Base fee must be greater than 0';
        }
        if (!formData?.permissionType) newErrors.permissionType = 'Permission type is required';
        if (formData?.permissionType === 'group_only' && !formData?.groupId?.trim()) {
          newErrors.groupId = 'Group ID is required for group-only elections';
        }
        if (formData?.permissionType === 'country_specific' && !formData?.allowedCountries?.trim()) {
          newErrors.allowedCountries = 'Allowed countries are required for country-specific elections';
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps?.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handlePublish = async () => {
    if (!validateStep(currentStep)) return;

    setIsPublishing(true);
    
    try {
      const electionData = {
        title: formData?.title,
        description: formData?.description,
        coverImage: formData?.coverImage,
        category: formData?.category,
        votingType: formData?.votingType,
        mediaType: formData?.requireVideo ? 'video' : null,
        mediaUrl: formData?.videoUrl || null,
        // When watchTimeType is 'percentage', we store percentage in the dedicated column
        minimumWatchTime: formData?.watchTimeType === 'percentage'
          ? 0
          : formData?.minWatchTime || 0,
        minWatchPercentage: formData?.watchTimeType === 'percentage'
          ? formData?.minWatchPercentage || null
          : null,
        isLotterized: formData?.enableGamification,
        prizePool: formData?.prizeAmount ? `$${formData?.prizeAmount}` : null,
        numberOfWinners: formData?.numberOfWinners || 0,
        startDate: formData?.startDate,
        endDate: formData?.endDate,
        brandingLogo: formData?.brandingLogo || null,
        entryFee: formData?.feeStructure === 'free' ? 'Free' : 
                  formData?.feeStructure === 'paid-general' ? `$${formData?.generalFee}` :
                  'Regional Pricing',
        regionalFees: formData?.feeStructure === 'paid-regional' ? formData?.regionalFees : {},
        biometricRequired: formData?.biometricRequired || 'none',
        ageVerificationRequired: formData?.requireAgeVerification || false,
        ageVerificationMethods: formData?.ageVerificationMethods || [],
        unlimitedAudience: formData?.unlimitedAudience !== false,
        permissionType: formData?.permissionType || 'public',
        groupId: formData?.groupId || null,
        allowedCountries: formData?.permissionType === 'country_specific' ? 
                          formData?.allowedCountries?.split(',')?.map(c => c?.trim()) : [],
        showRealTimePrize: formData?.showRealTimePrize,
        voteVisibility: formData?.voteVisibility || 'visible',
        showLiveResults: formData?.showLiveResults !== false,
        creatorCanSeeTotals: formData?.creatorCanSeeTotals !== false,
        allowNominations: formData?.allowNominations || false,
        allowSpoiledBallots: formData?.allowSpoiledBallots || false,
        status: 'active'
      };

      const { data, error } = await electionsService?.create(electionData);
      
      if (error) throw new Error(error.message);
      
      if (data) {
        if (formData?.permissionType === 'private' && formData?.voterRollData?.length > 0) {
          await voterRollsService?.importVoterRoll(data?.id, formData?.voterRollData);
        }

        await blockchainService?.recordAuditLog('election_created', {
          electionId: data?.id,
          title: formData?.title,
          votingType: formData?.votingType,
          isLotterized: formData?.enableGamification,
        });

        setFormData(prev => ({
          ...prev,
          uniqueElectionId: data?.uniqueElectionId,
          electionUrl: data?.electionUrl,
          qrCodeData: data?.qrCodeData
        }));
        
        setShowSuccessMessage(true);
        setTimeout(() => {
          navigate('/elections-dashboard');
        }, 2000);
      }
    } catch (err) {
      setErrors({ publish: err?.message });
    } finally {
      setIsPublishing(false);
    }
  };

  const CurrentStepComponent = steps?.[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <div className="hidden lg:block">
          <ElectionsSidebar />
        </div>

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
          <div className="mb-6 md:mb-8">
            <button
              onClick={() => navigate('/elections-dashboard')}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-all duration-250 mb-4"
            >
              <Icon name="ArrowLeft" size={16} />
              Back to Elections Dashboard
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">
                  Create New Election
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Set up a secure, blockchain-verified election with optional gamification
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  iconName="Save"
                  iconPosition="left"
                  onClick={handleSaveDraft}
                  loading={isSaving}
                  disabled={isPublishing}
                >
                  Save Draft
                </Button>
                <Button
                  variant="secondary"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => setIsPreviewOpen(true)}
                  disabled={isSaving || isPublishing}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>

          {showSuccessMessage && (
            <div className="mb-6 bg-success/10 border border-success/20 rounded-xl p-4 flex items-center gap-3">
              <Icon name="CheckCircle" size={20} className="text-success flex-shrink-0" />
              <p className="text-sm text-foreground">
                Draft saved successfully! You can continue editing or publish when ready.
              </p>
            </div>
          )}

          <div className="card p-6 md:p-8">
            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps?.length}
              steps={steps}
            />

            <div className="mt-6 md:mt-8">
              <CurrentStepComponent
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            </div>

            <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
              <Button
                variant="outline"
                iconName="ChevronLeft"
                iconPosition="left"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isSaving || isPublishing}
              >
                Previous
              </Button>

              <div className="flex gap-3">
                {currentStep < steps?.length ? (
                  <Button
                    variant="default"
                    iconName="ChevronRight"
                    iconPosition="right"
                    onClick={handleNext}
                    disabled={isSaving || isPublishing}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    iconName="Rocket"
                    iconPosition="left"
                    onClick={handlePublish}
                    loading={isPublishing}
                    disabled={isSaving}
                  >
                    Publish Election
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Blockchain Security</span>
              </div>
              <p className="text-xs text-muted-foreground">
                All votes are encrypted and stored on the blockchain for transparency
              </p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Lock" size={18} className="text-primary" />
                <span className="text-sm font-medium text-foreground">End-to-End Encryption</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Voter privacy protected with RSA encryption and digital signatures
              </p>
            </div>

            <div className="card p-4">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Trophy" size={18} className="text-accent" />
                <span className="text-sm font-medium text-foreground">Gamification Ready</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Optional lottery features to boost engagement and participation
              </p>
            </div>
          </div>
        </main>
      </div>
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={formData}
      />
    </div>
  );
};

export default ElectionCreationStudio;