import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';


const MediaUploadSection = ({ formData, onChange, errors }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(type, event?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleFileInput = (e, type) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange(type, event?.target?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeMedia = (type) => {
    onChange(type, null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
          <Icon name="Image" size={20} color="var(--color-success)" />
        </div>
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Media Assets</h3>
          <p className="text-sm text-muted-foreground">Upload brand visuals and campaign materials</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Brand Logo</label>
          <p className="text-xs text-muted-foreground">Square format recommended (500x500px minimum)</p>
          
          {formData?.brandLogo ? (
            <div className="relative bg-muted rounded-lg p-4 border border-border">
              <Image
                src={formData?.brandLogo}
                alt="Brand logo preview showing company branding and identity"
                className="w-full h-48 object-contain rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                onClick={() => removeMedia('brandLogo')}
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-250 ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, 'brandLogo')}
            >
              <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-2">Drop your logo here</p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('logo-upload')?.click()}>
                Browse Files
              </Button>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInput(e, 'brandLogo')}
              />
            </div>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Campaign Cover Image</label>
          <p className="text-xs text-muted-foreground">Landscape format recommended (1200x630px minimum)</p>
          
          {formData?.coverImage ? (
            <div className="relative bg-muted rounded-lg p-4 border border-border">
              <Image
                src={formData?.coverImage}
                alt="Campaign cover image showing promotional visual for sponsored election"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                iconName="Trash2"
                onClick={() => removeMedia('coverImage')}
                className="absolute top-2 right-2"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-250 ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={(e) => handleDrop(e, 'coverImage')}
            >
              <Icon name="Upload" size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground mb-2">Drop your cover image here</p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('cover-upload')?.click()}>
                Browse Files
              </Button>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileInput(e, 'coverImage')}
              />
            </div>
          )}
        </div>
      </div>
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Campaign Video (Optional)</label>
        <p className="text-xs text-muted-foreground">Engage participants with video content (MP4, max 100MB)</p>
        
        {formData?.campaignVideo ? (
          <div className="relative bg-muted rounded-lg p-4 border border-border">
            <div className="aspect-video bg-background rounded-lg flex items-center justify-center">
              <Icon name="Video" size={48} className="text-muted-foreground" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm text-foreground">campaign-video.mp4</span>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => removeMedia('campaignVideo')}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-250 ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(e) => handleDrop(e, 'campaignVideo')}
          >
            <Icon name="Video" size={32} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground mb-2">Drop your video here</p>
            <p className="text-xs text-muted-foreground mb-4">or</p>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('video-upload')?.click()}>
              Browse Files
            </Button>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileInput(e, 'campaignVideo')}
            />
          </div>
        )}

        {formData?.campaignVideo && (
          <div className="mt-4">
            <Checkbox
              label="Require minimum watch time"
              description="Participants must watch at least 80% of the video before voting"
              checked={formData?.requireVideoWatch}
              onChange={(e) => onChange('requireVideoWatch', e?.target?.checked)}
            />
          </div>
        )}
      </div>
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={18} className="text-primary mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground">Media Guidelines</p>
            <ul className="space-y-1 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>High-quality images improve engagement by up to 40%</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Videos with clear CTAs increase participation rates significantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Ensure all media complies with platform content policies</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaUploadSection;