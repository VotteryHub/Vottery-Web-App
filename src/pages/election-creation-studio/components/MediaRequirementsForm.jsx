import React from 'react';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const MediaRequirementsForm = ({ formData, onChange, errors }) => {
  const handleVideoUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      onChange('videoUrl', videoUrl);
      onChange('videoFile', file);
    }
  };

  const removeVideo = () => {
    onChange('videoUrl', '');
    onChange('videoFile', null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Media Requirements
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Add optional video content to inform voters before they cast their vote
        </p>
      </div>
      <Checkbox
        label="Include video requirement"
        description="Require voters to watch a video before voting"
        checked={formData?.requireVideo}
        onChange={(e) => onChange('requireVideo', e?.target?.checked)}
      />
      {formData?.requireVideo && (
        <div className="space-y-4 pl-0 md:pl-6 border-l-0 md:border-l-2 border-primary/20">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Upload Video <span className="text-destructive">*</span>
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload an informational video (MP4, max 100MB)
            </p>

            {!formData?.videoUrl ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 hover:border-primary transition-all duration-250 bg-muted/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Icon name="Video" size={24} color="var(--color-secondary)" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm md:text-base font-medium text-foreground">
                        Click to upload video
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        MP4, MOV, AVI up to 100MB
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-border bg-muted">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <video
                    src={formData?.videoUrl}
                    controls
                    className="w-full h-full"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
                <button
                  onClick={removeVideo}
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-105 transition-all duration-250 shadow-democratic-md"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>
            )}
            {errors?.videoUrl && (
              <p className="text-sm text-destructive mt-2">{errors?.videoUrl}</p>
            )}
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Watch Time Requirement <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="watchTimeType"
                  value="seconds"
                  checked={formData?.watchTimeType === 'seconds' || !formData?.watchTimeType}
                  onChange={(e) => onChange('watchTimeType', e?.target?.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Minimum Seconds</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="watchTimeType"
                  value="percentage"
                  checked={formData?.watchTimeType === 'percentage'}
                  onChange={(e) => onChange('watchTimeType', e?.target?.value)}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Minimum Percentage</span>
              </label>
            </div>
          </div>

          {(formData?.watchTimeType === 'seconds' || !formData?.watchTimeType) && (
            <Input
              label="Minimum Watch Time (seconds)"
              type="number"
              placeholder="Enter minimum seconds"
              value={formData?.minWatchTime}
              onChange={(e) => onChange('minWatchTime', e?.target?.value)}
              error={errors?.minWatchTime}
              required
              min={1}
              max={600}
              description="Voters must watch at least this many seconds before voting (1-600 seconds)"
            />
          )}

          {formData?.watchTimeType === 'percentage' && (
            <Input
              label="Minimum Watch Percentage (%)"
              type="number"
              placeholder="Enter percentage (1-100)"
              value={formData?.minWatchPercentage}
              onChange={(e) => onChange('minWatchPercentage', e?.target?.value)}
              error={errors?.minWatchPercentage}
              required
              min={1}
              max={100}
              description="Voters must watch at least this percentage of the video before voting"
            />
          )}

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 md:p-4">
            <div className="flex gap-3">
              <Icon name="Info" size={18} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs md:text-sm text-foreground font-medium">
                  Video Enforcement
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  The voting interface will track watch time and prevent voting until the minimum {formData?.watchTimeType === 'percentage' ? 'percentage' : 'duration'} is reached
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRequirementsForm;