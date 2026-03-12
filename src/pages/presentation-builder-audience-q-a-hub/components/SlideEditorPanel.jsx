import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const SlideEditorPanel = ({ slide, onUpdateSlide }) => {
  const [title, setTitle] = useState(slide?.title || '');
  const [content, setContent] = useState(slide?.content || '');
  const [mediaUrl, setMediaUrl] = useState(slide?.mediaUrl || '');
  const [mediaType, setMediaType] = useState(slide?.mediaType || 'none');

  const handleSave = () => {
    if (!slide?.id) return;
    
    onUpdateSlide(slide?.id, {
      title,
      content,
      mediaUrl,
      mediaType
    });
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader?.result);
        setMediaType('image');
      };
      reader?.readAsDataURL(file);
    }
  };

  const mediaTypeOptions = [
    { value: 'none', label: 'No Media' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'poll', label: 'Poll' },
    { value: 'voting', label: 'Voting Trigger' }
  ];

  if (!slide) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Layout" size={40} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-heading font-bold text-foreground mb-2">
          No Slide Selected
        </h3>
        <p className="text-muted-foreground">
          Select a slide from the list or create a new one to start editing
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-bold text-foreground">
          Slide Editor
        </h3>
        <Button onClick={handleSave} iconName="Save" size="sm">
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Input
          label="Slide Title"
          value={title}
          onChange={(e) => setTitle(e?.target?.value)}
          placeholder="Enter slide title"
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Slide Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e?.target?.value)}
            placeholder="Enter slide content, bullet points, or key messages"
            className="input min-h-[200px] resize-y"
          />
        </div>

        <Select
          label="Media Type"
          options={mediaTypeOptions}
          value={mediaType}
          onChange={setMediaType}
        />

        {mediaType === 'image' && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Slide Image
            </label>
            {!mediaUrl ? (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-border rounded-xl p-8 hover:border-primary transition-all duration-250 bg-muted/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Upload" size={24} color="var(--color-primary)" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
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
                  src={mediaUrl}
                  alt="Slide media showing visual content for presentation"
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setMediaUrl('')}
                  className="absolute top-3 right-3 w-10 h-10 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-105 transition-all duration-250 shadow-lg"
                >
                  <Icon name="X" size={18} />
                </button>
              </div>
            )}
          </div>
        )}

        {mediaType === 'video' && (
          <Input
            label="Video URL"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e?.target?.value)}
            placeholder="Enter YouTube or Vimeo URL"
          />
        )}

        {/* Preview */}
        <div className="border-t border-border pt-6">
          <h4 className="text-sm font-medium text-foreground mb-4">Preview</h4>
          <div className="bg-muted rounded-xl p-8 aspect-video flex flex-col items-center justify-center">
            {mediaUrl && mediaType === 'image' && (
              <Image
                src={mediaUrl}
                alt="Slide preview showing the current slide design"
                className="w-full h-full object-contain mb-4"
              />
            )}
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">
              {title || 'Untitled Slide'}
            </h2>
            <p className="text-muted-foreground text-center whitespace-pre-wrap">
              {content || 'No content'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlideEditorPanel;