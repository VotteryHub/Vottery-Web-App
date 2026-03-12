import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading presentation builder...</p>
        </div>
      </div>
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
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 ml-0 lg:ml-64">
          <div className="max-w-[1920px] mx-auto p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
                    Presentation Builder & Audience Q&A Hub
                  </h1>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {election?.title || 'Create interactive presentation slides with integrated audience engagement'}
                  </p>
                </div>
                <Button
                  onClick={handleStartPresentation}
                  disabled={slides?.length === 0}
                  iconName="Play"
                  size="lg"
                  className="hidden md:flex"
                >
                  Start Presentation
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-border">
                {tabs?.map(tab => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 border-b-2 ${
                      activeTab === tab?.id
                        ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon name={tab?.icon} size={18} />
                    <span className="hidden md:inline">{tab?.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {activeTab === 'slides' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <QuestionModerationPanel
                questions={questions}
                onModerateQuestion={handleModerateQuestion}
                onRefresh={loadQuestions}
                allowQuestions={election?.allowAudienceQuestions}
              />
            )}

            {activeTab === 'settings' && (
              <PresentationSettingsPanel
                election={election}
                onToggleQuestions={handleToggleQuestions}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PresentationBuilderAudienceQAHub;