import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react';

const InteractiveTutorialEngine = ({ steps, onComplete, onExit, title, icon }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const handleNext = () => {
    if (!completedSteps?.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (currentStep < steps?.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (window.confirm('Are you sure you want to skip this tutorial?')) {
      onExit();
    }
  };

  const currentStepData = steps?.[currentStep];
  const progress = Math.round(((currentStep + 1) / steps?.length) * 100);

  return (
    <div className="relative">
      {/* Header */}
      <div className="bg-slate-900/50 border-b border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{icon}</span>
            <h2 className="text-2xl font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Step {currentStep + 1} of {steps?.length}</span>
            <span className="text-sm font-semibold text-white">{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-3xl mx-auto">
          {/* Step Title */}
          <h3 className="text-2xl font-bold text-white mb-4">{currentStepData?.title}</h3>

          {/* Step Description */}
          <p className="text-lg text-slate-300 mb-6">{currentStepData?.description}</p>

          {/* Interactive Demo Area */}
          {currentStepData?.demo && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 mb-6">
              <div className="text-slate-400 text-sm mb-2">Interactive Demo:</div>
              {currentStepData?.demo}
            </div>
          )}

          {/* Key Points */}
          {currentStepData?.keyPoints && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 mb-6">
              <h4 className="text-white font-semibold mb-3">Key Points:</h4>
              <ul className="space-y-2">
                {currentStepData?.keyPoints?.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Practice Exercise */}
          {currentStepData?.practice && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 mb-6">
              <h4 className="text-white font-semibold mb-3">Practice Exercise:</h4>
              <p className="text-slate-300">{currentStepData?.practice}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-slate-900/50 border-t border-slate-700 p-6">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex gap-2">
            {steps?.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 w-8'
                    : completedSteps?.includes(index)
                    ? 'bg-green-500' :'bg-slate-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white rounded-lg transition-all flex items-center gap-2 font-semibold"
          >
            {currentStep === steps?.length - 1 ? 'Complete' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveTutorialEngine;