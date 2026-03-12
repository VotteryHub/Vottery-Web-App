import React from 'react';
import Icon from '../../../components/AppIcon';

const OnboardingGuidance = ({ onClose }) => {
  return (
    <div className="mb-6 card p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
            <Icon name="Lightbulb" size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground">
              How It Works
            </h3>
            <p className="text-sm text-muted-foreground">
              Personalize your experience in seconds
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close guidance"
        >
          <Icon name="X" size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
            1
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Swipe Right</h4>
            <p className="text-sm text-muted-foreground">
              Topics you love and want to see more of
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
            2
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Swipe Left</h4>
            <p className="text-sm text-muted-foreground">
              Topics you are not interested in
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
            3
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-1">Get Personalized</h4>
            <p className="text-sm text-muted-foreground">
              Your feed adapts to your preferences
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-primary/20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon name="Info" size={16} className="text-primary" />
          <span>
            <strong>Pro tip:</strong> The more you swipe, the better your recommendations become!
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuidance;