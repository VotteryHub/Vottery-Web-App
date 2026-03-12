import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InteractiveTutorialEngine = ({ userRole, activeTutorial, completedModules, onComplete, onBack }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);

  const tutorialSteps = {
    'voter-1': [
      { title: 'Welcome to Voting', description: 'Let\'s explore how to discover and participate in elections on Vottery', element: null },
      { title: 'Home Feed', description: 'Your personalized feed shows elections tailored to your interests', element: 'home-feed' },
      { title: 'Browse Elections', description: 'Click "Vote in Elections" to see all available elections', element: 'vote-hub' },
      { title: 'Categories', description: 'Filter elections by 8 categories: Politics, Entertainment, Sports, and more', element: 'categories' },
      { title: 'Election Card', description: 'Each card shows the election title, description, prizes, and voting deadline', element: 'election-card' },
      { title: 'Start Voting', description: 'Click on any election to view details and cast your vote', element: 'vote-button' },
      { title: 'Congratulations!', description: 'You\'ve learned the basics of discovering elections. Ready to vote?', element: null }
    ],
    'creator-1': [
      { title: 'Create Your First Election', description: 'Let\'s walk through creating an engaging election', element: null },
      { title: 'Election Studio', description: 'Click "Create Election" to open the Election Creation Studio', element: 'create-election' },
      { title: 'Basic Information', description: 'Enter your election title, description, and category', element: 'basics-form' },
      { title: 'Voting Configuration', description: 'Choose voting method: Plurality, Ranked Choice, Approval, or Plus-Minus', element: 'voting-config' },
      { title: 'Add Candidates', description: 'Add at least 2 candidates or options for voters to choose from', element: 'candidates' },
      { title: 'Media Upload', description: 'Upload images or videos to make your election more engaging', element: 'media-upload' },
      { title: 'Gamification', description: 'Enable prizes and lottery tickets to incentivize participation', element: 'gamification' },
      { title: 'Preview & Publish', description: 'Review your election and publish it to start receiving votes', element: 'publish' },
      { title: 'Success!', description: 'You\'ve created your first election. Monitor performance in your dashboard', element: null }
    ],
    'advertiser-1': [
      { title: 'Participatory Advertising', description: 'Learn how to create engaging ad campaigns on Vottery', element: null },
      { title: 'Campaign Studio', description: 'Navigate to "Participatory Ads Studio" to create your first campaign', element: 'ads-studio' },
      { title: 'Campaign Type', description: 'Choose: Market Research, Hype Prediction, or CSR Election', element: 'campaign-type' },
      { title: 'Target Audience', description: 'Define your audience by demographics, location, and behavior', element: 'targeting' },
      { title: 'Budget Setup', description: 'Set your CPE (Cost Per Engagement) and total budget', element: 'budget' },
      { title: 'Creative Assets', description: 'Upload your brand assets, videos, and election content', element: 'creative' },
      { title: 'Launch Campaign', description: 'Review and launch your campaign to start engaging voters', element: 'launch' },
      { title: 'Track ROI', description: 'Monitor real-time engagement, conversions, and ROI in your dashboard', element: null }
    ]
  };

  const steps = tutorialSteps?.[activeTutorial] || [
    { title: 'Tutorial Not Found', description: 'This tutorial is not available yet', element: null }
  ];

  useEffect(() => {
    if (steps?.[currentStep]?.element) {
      setHighlightedElement(steps?.[currentStep]?.element);
      setShowTooltip(true);
    } else {
      setHighlightedElement(null);
    }
  }, [currentStep, activeTutorial]);

  const handleNext = () => {
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(activeTutorial);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    onComplete(activeTutorial);
  };

  const progress = ((currentStep + 1) / steps?.length) * 100;

  return (
    <div className="space-y-6">
      {/* Tutorial Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                {steps?.[currentStep]?.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps?.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip Tutorial
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Step Content */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 mb-4">
          <p className="text-foreground text-lg leading-relaxed">
            {steps?.[currentStep]?.description}
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
          >
            <Icon name="ChevronLeft" size={16} className="mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps?.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-primary w-6'
                    : index < currentStep
                    ? 'bg-green-500' :'bg-gray-300 dark:bg-gray-700'
                }`}
              ></div>
            ))}
          </div>

          <Button onClick={handleNext}>
            {currentStep === steps?.length - 1 ? 'Complete' : 'Next'}
            <Icon name="ChevronRight" size={16} className="ml-1" />
          </Button>
        </div>
      </div>

      {/* Interactive Demo Area */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="Monitor" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Interactive Demo</h3>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Icon name="PlayCircle" size={64} className="text-primary mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Interactive demo for this step would appear here
            </p>
            <p className="text-sm text-muted-foreground">
              {highlightedElement ? `Highlighting: ${highlightedElement}` : 'Follow the instructions above'}
            </p>
          </div>
        </div>
      </div>

      {/* Contextual Tooltip */}
      {showTooltip && highlightedElement && (
        <div className="fixed bottom-4 right-4 max-w-sm card p-4 shadow-2xl z-50 animate-fade-in">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="Info" size={18} className="text-primary" />
              <span className="font-semibold text-foreground">Tip</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            {steps?.[currentStep]?.description}
          </p>
        </div>
      )}
    </div>
  );
};

export default InteractiveTutorialEngine;