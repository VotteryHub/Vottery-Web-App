import React, { useRef, useState } from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { aiOrchestrationService } from '../../../services/aiOrchestrationService';

const ElectionBasicsForm = ({ formData, onChange, errors, onCaptchaVerify }) => {
  const captchaRef = useRef(null);
  const [isImproving, setIsImproving] = useState(false);
  const HCAPTCHA_SITE_KEY = import.meta.env?.VITE_HCAPTCHA_SITE_KEY;
  const hcaptchaEnabled = HCAPTCHA_SITE_KEY && HCAPTCHA_SITE_KEY !== 'your-hcaptcha-site-key-here';

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('coverImage', reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    onChange('coverImage', '');
  };

  const handleImproveDescription = async () => {
    if (!formData?.description?.trim() || isImproving) return;
    
    setIsImproving(true);
    try {
      const improved = await aiOrchestrationService.improveDescription(
        formData.description,
        formData.title
      );
      if (improved) {
        onChange('description', improved);
      }
    } catch (err) {
      console.error('Failed to improve description:', err);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Election Basics
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Provide the fundamental information about your election
        </p>
      </div>
      <Input
        label="Election Title"
        type="text"
        placeholder="Enter a clear, descriptive title"
        value={formData?.title}
        onChange={(e) => onChange('title', e?.target?.value)}
        error={errors?.title}
        required
        maxLength={100}
        description="Maximum 100 characters"
      />
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-foreground">
            Description <span className="text-destructive">*</span>
          </label>
          {formData?.description?.length > 10 && (
            <button
              type="button"
              onClick={handleImproveDescription}
              disabled={isImproving}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-all"
            >
              <Icon name={isImproving ? 'RotateCw' : 'Sparkles'} size={14} className={isImproving ? 'animate-spin' : ''} />
              {isImproving ? 'Improving...' : 'Auto-improve'}
            </button>
          )}
        </div>
        <textarea
          value={formData?.description}
          onChange={(e) => onChange('description', e?.target?.value)}
          placeholder="Provide detailed information about the election purpose, rules, and what voters should know"
          className="input min-h-[120px] md:min-h-[150px] resize-y"
          maxLength={2000}
        />
        {errors?.description && (
          <p className="text-sm text-destructive mt-1">{errors?.description}</p>
        )}
        <div className="flex justify-between items-center mt-1">
          <p className="text-xs text-muted-foreground">
            {formData?.description?.length}/2000 characters
          </p>
          {isImproving && (
            <p className="text-xs text-primary animate-pulse font-medium">AI is refining your content...</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cover Image <span className="text-destructive">*</span>
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Upload a compelling cover image (recommended: 1200x630px, max 5MB)
        </p>

        {!formData?.coverImage ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-xl p-8 md:p-12 hover:border-primary transition-all duration-250 bg-muted/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Upload" size={24} color="var(--color-primary)" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium text-foreground">
                    Click to upload cover image
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <Image
              src={formData?.coverImage}
              alt="Election cover image showing the visual representation of the election topic"
              className="w-full h-48 md:h-64 object-cover"
            />
            <button
              onClick={removeCoverImage}
              className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-105 transition-all duration-250 shadow-democratic-md"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        )}
        {errors?.coverImage && (
          <p className="text-sm text-destructive mt-2">{errors?.coverImage}</p>
        )}
      </div>
      {/* hCaptcha for election creation */}
      {hcaptchaEnabled && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Security Verification</label>
          <HCaptcha
            ref={captchaRef}
            sitekey={HCAPTCHA_SITE_KEY}
            onVerify={(token) => onCaptchaVerify?.(token)}
            onExpire={() => onCaptchaVerify?.(null)}
            theme="dark"
          />
          {errors?.captcha && <p className="text-sm text-destructive mt-1">{errors?.captcha}</p>}
        </div>
      )}
    </div>
  );
};

export default ElectionBasicsForm;