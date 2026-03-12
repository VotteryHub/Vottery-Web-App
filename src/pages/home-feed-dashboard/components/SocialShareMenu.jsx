import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SocialShareMenu = ({ contentType, contentId, title, onClose }) => {
  const navigate = useNavigate();

  const shareUrl = `${window?.location?.origin}/${contentType}/${contentId}`;
  const message = `Check out: ${title}`;

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedMessage = encodeURIComponent(message);

    let shareLink = '';

    switch (platform) {
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'telegram':
        shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedMessage}`;
        break;
      default:
        return;
    }

    window?.open(shareLink, '_blank', 'width=600,height=400');
    onClose?.();
  };

  return (
    <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10 min-w-[200px]">
      <button
        onClick={() => handleShare('whatsapp')}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all text-left"
      >
        <Icon name="MessageCircle" size={18} className="text-green-500" />
        <span className="text-sm font-medium text-foreground">WhatsApp</span>
      </button>
      <button
        onClick={() => handleShare('facebook')}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all text-left"
      >
        <Icon name="Facebook" size={18} className="text-blue-600" />
        <span className="text-sm font-medium text-foreground">Facebook</span>
      </button>
      <button
        onClick={() => handleShare('twitter')}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all text-left"
      >
        <Icon name="Twitter" size={18} className="text-sky-500" />
        <span className="text-sm font-medium text-foreground">Twitter</span>
      </button>
      <button
        onClick={() => handleShare('linkedin')}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all text-left"
      >
        <Icon name="Linkedin" size={18} className="text-blue-700" />
        <span className="text-sm font-medium text-foreground">LinkedIn</span>
      </button>
      <button
        onClick={() => handleShare('telegram')}
        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-muted rounded-lg transition-all text-left"
      >
        <Icon name="Send" size={18} className="text-sky-400" />
        <span className="text-sm font-medium text-foreground">Telegram</span>
      </button>
    </div>
  );
};

export default SocialShareMenu;