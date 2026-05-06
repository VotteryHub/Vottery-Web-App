import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import SlideEditorPanel from './components/SlideEditorPanel';
import SlideListPanel from './components/SlideListPanel';
import QuestionModerationPanel from './components/QuestionModerationPanel';
import LivePresentationPanel from './components/LivePresentationPanel';
import PresentationSettingsPanel from './components/PresentationSettingsPanel';
import { presentationService } from '../../services/presentationService';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';

const PresentationBuilderAudienceQAHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const electionId = searchParams?.get('election');

  const [activeTab, setActiveTab] = useState('slides');
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [election, setElection] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (electionId) {
      loadElection();
      loadSlides();
      loadQuestions();
    }
  }, [electionId]);

  const loadElection = async () => {
    const { data, error } = await electionsService?.getById(electionId);
    if (!error && data) {
      setElection(data);
    }
    setLoading(false);
  };

  const loadSlides = async () => {
    const { success, data } = await presentationService?.getSlides(electionId);
    if (success && data) {
      setSlides(data);
      if (data?.length > 0 && !selectedSlide) {
        setSelectedSlide(data?.[0]);
      }
    }
  };

  const loadQuestions = async () => {
    const { success, data } = await presentationService?.getQuestions(electionId);
    if (success && data) {
      setQuestions(data);
    }
  };

  const handleCreateSlide = async () => {
    const newSlide = {
      title: 'New Slide',
      content: '',
      slideOrder: slides?.length,
      mediaUrl: '',
      mediaType: 'none',
      animations: {},
      interactiveElements: []
    };

    const { success, data } = await presentationService?.createSlide(electionId, newSlide);
    if (success && data) {
      setSlides([...slides, data]);
      setSelectedSlide(data);
    }
  };

  const handleUpdateSlide = async (slideId, updates) => {
    const { success, data } = await presentationService?.updateSlide(slideId, updates);
    if (success && data) {
      setSlides(slides?.map(s => s?.id === slideId ? data : s));
      setSelectedSlide(data);
    }
  };

  const handleDeleteSlide = async (slideId) => {
    const { success } = await presentationService?.deleteSlide(slideId);
    if (success) {
      const updatedSlides = slides?.filter(s => s?.id !== slideId);
      setSlides(updatedSlides);
      setSelectedSlide(updatedSlides?.[0] || null);
    }
  };

  const handleReorderSlides = async (newOrder) => {
    const slideOrders = newOrder?.map((slide, index) => ({
      id: slide?.id,
      order: index
    }));
    
    const { success } = await presentationService?.reorderSlides(electionId, slideOrders);
    if (success) {
      setSlides(newOrder);
    }
  };

  const handleModerateQuestion = async (questionId, action, notes) => {
    const { success, data } = await presentationService?.moderateQuestion(questionId, action, notes);
    if (success && data) {
      setQuestions(questions?.map(q => q?.id === questionId ? data : q));
    }
  };

  const handleToggleQuestions = async (enabled) => {
    const { success, data } = await presentationService?.toggleQuestionSubmission(electionId, enabled);
    if (success && data) {
      setElection(data);
    }
  };

  const handleStartPresentation = () => {
    setIsPresentationMode(true);
    setCurrentSlideIndex(0);
  };

  const handleExitPresentation = () => {
    setIsPresentationMode(false);
  };

  const tabs = [
    { id: 'slides', label: 'Slide Builder', icon: 'Layout' },
    { id: 'questions', label: 'Q&A Moderation', icon: 'MessageSquare' },
    { id: 'settings', label: 'Settings', icon: 'Settings' }
  ];

  if (loading) {
    return (
      <GeneralPageLayout title="Presentation Builder">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading presentation builder...</p>
        </div>
      </GeneralPageLayout>
    );
  }

  if (isPresentationMode) {
    return (
      <LivePresentationPanel
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSlideChange={setCurrentSlideIndex}
        onExit={handleExitPresentation}
        election={election}
        questions={questions?.filter(q => q?.moderationStatus === 'approved')}
      />
    );
  }

  return (
    <GeneralPageLayout title="Presentation Builder" showSidebar={true}>
      <div className="w-full py-0">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white mb-3 tracking-tight uppercase">
              Presentation Builder
            </h1>
            <p className="text-base md:text-lg text-slate-400 font-medium">
              {election?.title || 'Create interactive presentation slides with integrated audience engagement'}
            </p>
          </div>
          <Button
            onClick={handleStartPresentation}
            disabled={slides?.length === 0}
            className="hidden md:inline-flex rounded-2xl font-black uppercase tracking-widest text-xs px-8 py-4"
          >
            <Icon name="Play" size={16} className="mr-2" />
            Start Presentation
          </Button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="border-b border-white/5 bg-black/20">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center gap-3 px-8 py-5 font-black uppercase tracking-widest text-xs transition-all duration-300 border-b-4 whitespace-nowrap ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary bg-primary/5 shadow-inner'
                      : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {activeTab === 'slides' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="lg:col-span-4">
                  <SlideListPanel
                    slides={slides}
                    selectedSlide={selectedSlide}
                    onSelectSlide={setSelectedSlide}
                    onCreateSlide={handleCreateSlide}
                    onDeleteSlide={handleDeleteSlide}
                    onReorderSlides={handleReorderSlides}
                  />
                </div>
                <div className="lg:col-span-8">
                  <SlideEditorPanel
                    slide={selectedSlide}
                    onUpdateSlide={handleUpdateSlide}
                  />
                </div>
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="animate-in fade-in duration-500">
                <QuestionModerationPanel
                  questions={questions}
                  onModerateQuestion={handleModerateQuestion}
                  onRefresh={loadQuestions}
                  allowQuestions={election?.allowAudienceQuestions}
                />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in duration-500">
                <PresentationSettingsPanel
                  election={election}
                  onToggleQuestions={handleToggleQuestions}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </GeneralPageLayout>
  );
};

export default PresentationBuilderAudienceQAHub;