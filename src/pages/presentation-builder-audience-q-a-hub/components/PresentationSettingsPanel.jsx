import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';

import Icon from '../../../components/AppIcon';

const PresentationSettingsPanel = ({ election, onToggleQuestions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-6">
          Audience Interaction Settings
        </h3>

        <div className="space-y-6">
          {/* Question Submission Toggle */}
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Checkbox
              id="allow-questions"
              checked={election?.allowAudienceQuestions || false}
              onCheckedChange={onToggleQuestions}
            />
            <div className="flex-1">
              <label htmlFor="allow-questions" className="text-sm font-medium text-foreground cursor-pointer">
                Allow Audience Questions
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Enable voters to submit questions during the presentation. All questions require moderation before display.
              </p>
            </div>
          </div>

          {/* Anonymous Questions */}
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Checkbox
              id="anonymous-questions"
              checked
              disabled={!election?.allowAudienceQuestions}
            />
            <div className="flex-1">
              <label htmlFor="anonymous-questions" className="text-sm font-medium text-foreground cursor-pointer">
                Allow Anonymous Questions
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Voters can choose to submit questions anonymously without revealing their identity.
              </p>
            </div>
          </div>

          {/* Auto-approve Questions */}
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Checkbox
              id="auto-approve"
             
              disabled={!election?.allowAudienceQuestions}
            />
            <div className="flex-1">
              <label htmlFor="auto-approve" className="text-sm font-medium text-foreground cursor-pointer">
                Auto-approve Questions
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Automatically approve all submitted questions without moderation (not recommended).
              </p>
            </div>
          </div>

          {/* Display Approved Questions */}
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <Checkbox
              id="display-questions"
              checked
              disabled={!election?.allowAudienceQuestions}
            />
            <div className="flex-1">
              <label htmlFor="display-questions" className="text-sm font-medium text-foreground cursor-pointer">
                Display Approved Questions in Presentation
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Show approved questions in the live presentation sidebar for audience visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Presentation Controls */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-lg font-heading font-bold text-foreground mb-6">
          Presentation Controls
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Slide Transitions</p>
              <p className="text-xs text-muted-foreground mt-1">Fade animation between slides</p>
            </div>
            <Icon name="Check" size={20} className="text-success" />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Keyboard Navigation</p>
              <p className="text-xs text-muted-foreground mt-1">Arrow keys to navigate, ESC to exit</p>
            </div>
            <Icon name="Check" size={20} className="text-success" />
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-foreground">Responsive Design</p>
              <p className="text-xs text-muted-foreground mt-1">Optimized for desktop and mobile</p>
            </div>
            <Icon name="Check" size={20} className="text-success" />
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Info" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">
              Presentation Tips
            </h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-quality images for better visual impact</li>
              <li>• Keep slide content concise and focused</li>
              <li>• Enable Q&A for interactive engagement</li>
              <li>• Test your presentation before going live</li>
              <li>• Use keyboard shortcuts for smooth navigation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentationSettingsPanel;